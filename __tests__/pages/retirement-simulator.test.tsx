import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RetirementSimulator from '@/app/retirement-simulator/page'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: any = {
        retirementGoalResult: 'For a {lifestyle} life...',
        actionPlanInvesting: 'If you invest to get {rate}%...',
        yearsToSave: 'Saving duration {years} years',
        monthlyBudget: 'Budget {amount} THB/month',
      }
      return translations[key] || key
    },
  }),
  useLanguageSafe: () => ({
    t: (key: string) => key,
  }),
}))

// Mock UI components that might use window or other browser APIs
vi.mock('@/components/ui/slider', () => ({
  Slider: ({ value, onValueChange, min, max }: any) => (
    <input
      type="range"
      min={min}
      max={max}
      value={value[0]}
      onChange={(e) => onValueChange([parseInt(e.target.value)])}
      data-testid="slider"
    />
  ),
}))

describe('RetirementSimulator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders the page with correct title and description', () => {
    render(<RetirementSimulator />)
    expect(screen.getByText('retirementSimulatorTitle')).toBeInTheDocument()
    expect(screen.getByText('retirementSimulatorDescription')).toBeInTheDocument()
  })

  it('renders section 1 with age sliders', () => {
    render(<RetirementSimulator />)
    expect(screen.getByText('currentAge')).toBeInTheDocument()
    expect(screen.getByText('retirementAge')).toBeInTheDocument()
    const sliders = screen.getAllByTestId('slider')
    expect(sliders.length).toBe(2)
  })

  it('renders lifestyle cards', () => {
    render(<RetirementSimulator />)
    expect(screen.getByText('minimalistLifestyle')).toBeInTheDocument()
    expect(screen.getByText('comfortableLifestyle')).toBeInTheDocument()
    expect(screen.getByText('luxuryLifestyle')).toBeInTheDocument()
    expect(screen.getByText('diyLifestyle')).toBeInTheDocument()
  })

  it('updates selected lifestyle when a card is clicked', () => {
    render(<RetirementSimulator />)
    
    const minimalistCard = screen.getByText('minimalistLifestyle')
    fireEvent.click(minimalistCard)
    
    // The result text should update to use minimalistLifestyle
    // We expect at least two occurrences: one in the card and one in the result section
    expect(screen.getAllByText(/minimalistLifestyle/).length).toBeGreaterThanOrEqual(2)
  })

  it('shows custom budget input when DIY lifestyle is selected', () => {
    render(<RetirementSimulator />)
    
    const diyCard = screen.getByText('diyLifestyle')
    fireEvent.click(diyCard)
    
    expect(screen.getByPlaceholderText('enterCustomBudget')).toBeInTheDocument()
  })

  it('renders summary section with calculated results', () => {
    render(<RetirementSimulator />)
    // Since we mocked t to return the key or a specific string with placeholders
    expect(screen.getByText(/For a/)).toBeInTheDocument()
    expect(screen.getByText('monthlyInvestmentRequired')).toBeInTheDocument()
  })

  it('updates investment return rate when buttons are clicked', () => {
    render(<RetirementSimulator />)
    
    const rate5Button = screen.getAllByText('5%').find(el => el.tagName === 'BUTTON')!
    
    fireEvent.click(rate5Button)
    // The result text should update to show 5%
    expect(screen.getByText(/If you invest to get 5%/)).toBeInTheDocument()
  })
})
