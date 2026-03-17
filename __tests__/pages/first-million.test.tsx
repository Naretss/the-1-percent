import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FirstMillionPage from '@/app/first-million/page'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => key,
  }),
  useLanguageSafe: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('recharts', async () => {
  const OriginalRechartsModule = await vi.importActual('recharts')
  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    AreaChart: ({ children }: any) => <div>{children}</div>,
    Area: () => <div data-testid="recharts-area" />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
    ReferenceLine: () => <div />
  }
})

describe('FirstMillionPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders the page with correct title and description', () => {
    render(<FirstMillionPage />)
    
    // Check if hero title is rendered (using the translation key as mocked)
    const headings = screen.getAllByText('firstMillionTitle')
    expect(headings.length).toBeGreaterThan(0)
    
    expect(screen.getByText('firstMillionDescription')).toBeInTheDocument()
  })

  it('renders input controls', () => {
    render(<FirstMillionPage />)
    
    expect(screen.getByText('monthlySaving')).toBeInTheDocument()
    expect(screen.getByText('investmentStyle')).toBeInTheDocument()
    expect(screen.getByText('depositStyle')).toBeInTheDocument()
    expect(screen.getByText('mixedFundStyle')).toBeInTheDocument()
    expect(screen.getByText('stockStyle')).toBeInTheDocument()
  })

  it('renders the chart and result area', () => {
    render(<FirstMillionPage />)
    
    expect(screen.getByText('goalAchievementTime')).toBeInTheDocument()
    expect(screen.getAllByTestId('recharts-area').length).toBeGreaterThan(0)
  })

  it('updates tip text when investment style changes', () => {
    render(<FirstMillionPage />)
    
    // Default is 5% which maps to tipMixedFund
    expect(screen.getByText('tipMixedFund')).toBeInTheDocument()
    
    // Click on 8% stock style
    const stockRadio = screen.getByLabelText('stockStyle')
    fireEvent.click(stockRadio)
    
    expect(screen.getByText('tipStock')).toBeInTheDocument()
  })

  it('shows custom rate slider when custom style is selected', () => {
    render(<FirstMillionPage />)
    
    // Custom slider should not be visible initially
    expect(screen.queryByText('10%')).not.toBeInTheDocument()
    
    // Select custom style
    const customRadio = screen.getByLabelText('customStyle')
    fireEvent.click(customRadio)
    
    // Now custom rate (default 10%) should be visible
    expect(screen.getByText('10%')).toBeInTheDocument()
  })
})
