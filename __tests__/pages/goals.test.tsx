import { render, screen } from '@testing-library/react'
import { vi, expect, it, describe } from 'vitest'
import GoalsPage from '@/app/goals/page'
import { LanguageProvider } from '@/contexts/LanguageContext'

describe('GoalsPage', () => {
  it('renders the goals page with all 6 dimensions', () => {
    render(
      <LanguageProvider>
        <GoalsPage />
      </LanguageProvider>
    )
    
    expect(screen.getByText(/วางแผนครั้งนี้ปีหมาย 6 มิติ/i)).toBeInTheDocument()
    expect(screen.getAllByText(/สุขภาพ/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/ครอบครัว/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/การงาน/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/การเงิน/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/พัฒนาตัวเอง/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/การแบ่งปัน/i).length).toBeGreaterThan(0)
  })
})
