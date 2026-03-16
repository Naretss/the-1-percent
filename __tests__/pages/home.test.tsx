import { render, screen } from '@testing-library/react'
import { vi, expect, it, describe } from 'vitest'
import HomePage from '@/app/page'
import { LanguageProvider } from '@/contexts/LanguageContext'

describe('HomePage', () => {
  it('renders the home page with title and subtitle', () => {
    render(
      <LanguageProvider>
        <HomePage />
      </LanguageProvider>
    )
    
    // Check if the main title exists
    const titles = screen.getAllByText(/The1%/i)
    expect(titles.length).toBeGreaterThan(0)
    
    // Check if the start planning button exists
    const startButton = screen.getAllByText(/วางแผนการเงินล่วงหน้า/i)
    expect(startButton.length).toBeGreaterThan(0)
  })

  it('renders all tool cards', () => {
    render(
      <LanguageProvider>
        <HomePage />
      </LanguageProvider>
    )
    
    // Check for "Advanced Financial Planning" card
    expect(screen.getByText(/วางแผนการเงินล่วงหน้า/i)).toBeInTheDocument()
    
    // Check for "Habit Converter" card
    expect(screen.getByText(/แปลงร่างรายจ่ายจุกจิกเป็นพลังปลดหนี้/i)).toBeInTheDocument()
  })
})
