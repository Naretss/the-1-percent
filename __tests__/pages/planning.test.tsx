import { render, screen } from '@testing-library/react'
import { vi, expect, it, describe } from 'vitest'
import PlanningPage from '@/app/planning/page'
import { LanguageProvider } from '@/contexts/LanguageContext'

describe('PlanningPage', () => {
  it('renders the planning page', () => {
    render(
      <LanguageProvider>
        <PlanningPage />
      </LanguageProvider>
    )
    
    expect(screen.getByText(/วางแผนการเงินล่วงหน้ากันเถอะ/i)).toBeInTheDocument()
    const incomeSections = screen.getAllByText(/รายได้/i)
    expect(incomeSections.length).toBeGreaterThan(0)
    const expenseSections = screen.getAllByText(/รายจ่าย/i)
    expect(expenseSections.length).toBeGreaterThan(0)
  })
})
