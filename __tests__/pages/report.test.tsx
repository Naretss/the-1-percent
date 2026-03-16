import { render, screen } from '@testing-library/react'
import { vi, expect, it, describe } from 'vitest'
import ReportPage from '@/app/report/page'
import { LanguageProvider } from '@/contexts/LanguageContext'

describe('ReportPage', () => {
  it('renders the report page with summary and habit converter', () => {
    // Mock localStorage data for report
    window.localStorage.setItem('financialPlanData', JSON.stringify({
      startYear: '2025',
      endYear: '2026',
      dimensions: []
    }))
    window.localStorage.setItem('financialPlanningData', JSON.stringify({
      months: 12,
      rows: [],
      totalRemaining: 0,
      createdAt: new Date().toISOString()
    }))
    window.localStorage.setItem('financialStatusData', JSON.stringify({
      assets: [],
      liabilities: [],
      totalAssets: 0,
      totalLiabilities: 0,
      netWorth: 0
    }))
    
    render(
      <LanguageProvider>
        <ReportPage />
      </LanguageProvider>
    )
    
    expect(screen.getByText(/สรุปวางแผนการเงินล่วงหน้า/i)).toBeInTheDocument()
    expect(screen.getByText(/แปลงร่างรายจ่ายจุกจิกเป็นพลังปลดหนี้/i)).toBeInTheDocument()
  })
})
