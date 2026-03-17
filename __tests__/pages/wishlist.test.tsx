import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import WishlistPage from '@/app/wishlist/page'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        daysToGoal: 'Get it in {days} days!',
        savingProgress: 'Saved {current} / {target} THB ({percent}%)',
        streakDays: '{days} Days Streak!',
        dropIntoPiggy: 'Dropped into piggy bank today!',
      }
      return translations[key] || key
    },
  }),
  useLanguageSafe: () => ({
    t: (key: string) => key,
  }),
}))

describe('WishlistPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders the setup page initially', () => {
    render(<WishlistPage />)
    
    expect(screen.getByText('wishlistTitle')).toBeInTheDocument()
    expect(screen.getByText('wishlistDescription')).toBeInTheDocument()
    expect(screen.getByText('itemName')).toBeInTheDocument()
    expect(screen.getByText('itemPrice')).toBeInTheDocument()
    expect(screen.getByText('dailyAllowance')).toBeInTheDocument()
    expect(screen.getByText('createGoal')).toBeInTheDocument()
  })

  it('creates a goal and shows the dashboard', () => {
    render(<WishlistPage />)
    
    const nameInput = screen.getByPlaceholderText('itemPlaceholder')
    const priceInput = screen.getAllByPlaceholderText('0')[0] // Price is first '0'
    const allowanceInput = screen.getAllByPlaceholderText('0')[1] // Allowance is second '0'
    const createBtn = screen.getByText('createGoal')

    fireEvent.change(nameInput, { target: { value: 'PS5' } })
    fireEvent.change(priceInput, { target: { value: '15000' } })
    fireEvent.change(allowanceInput, { target: { value: '200' } })
    
    fireEvent.click(createBtn)

    expect(screen.getByText('PS5')).toBeInTheDocument()
    expect(screen.getByText('Goal: ฿15,000')).toBeInTheDocument()
    expect(screen.getByText(/Saved/)).toBeInTheDocument()
    expect(screen.getByText(/Dropped/)).toBeInTheDocument()
  })

  it('updates streak and progress when dropping money', () => {
    // Pre-set a goal in localStorage
    const goalData = {
      name: 'PS5',
      price: 15000,
      allowance: 200,
      emoji: '🎮',
      saved: 0,
      streak: 0,
      lastSaved: null
    }
    localStorage.setItem('wishlist_goal', JSON.stringify(goalData))

    render(<WishlistPage />)

    const dropBtn = screen.getByText(/Dropped/)
    fireEvent.click(dropBtn)

    // Check if streak updated
    expect(screen.getByText(/Streak/)).toBeInTheDocument()
    
    // Check if saved amount updated in localStorage
    const updatedData = JSON.parse(localStorage.getItem('wishlist_goal') || '{}')
    expect(updatedData.saved).toBeGreaterThan(0)
    expect(updatedData.streak).toBe(1)
  })

  it('calculates saving paths correctly', () => {
    const goalData = {
      name: 'PS5',
      price: 1000,
      allowance: 100,
      emoji: '🎮',
      saved: 0,
      streak: 0,
      lastSaved: null
    }
    localStorage.setItem('wishlist_goal', JSON.stringify(goalData))

    render(<WishlistPage />)

    // Chill Path: 20% of 100 = 20/day. 1000/20 = 50 days.
    const pathTexts = screen.getAllByText(/Get it in/)
    expect(pathTexts[0].textContent).toContain('50')
    
    // Middle Path: 50% of 100 = 50/day. 1000/50 = 20 days.
    expect(pathTexts[1].textContent).toContain('20')
    
    // Racing Path: 80% of 100 = 80/day. 1000/80 = 13 days.
    expect(pathTexts[2].textContent).toContain('13')
  })
})
