import { render, screen, fireEvent } from '@testing-library/react'
import { vi, expect, it, describe } from 'vitest'
import FinancialStatusPage from '@/app/financial-status/page'
import { LanguageProvider } from '@/contexts/LanguageContext'

describe('FinancialStatusPage', () => {
  it('renders the financial status page with assets and liabilities', () => {
    render(
      <LanguageProvider>
        <FinancialStatusPage />
      </LanguageProvider>
    )
    
    expect(screen.getByText(/ตรวจสอบสถานะการเงิน/i)).toBeInTheDocument()
    expect(screen.getByText(/ทรัพย์สินรวม/i)).toBeInTheDocument()
    expect(screen.getByText(/หนี้สินรวม/i)).toBeInTheDocument()
  })

  it('shows refinance alert when home loan is paid for 36 months', () => {
    render(
      <LanguageProvider>
        <FinancialStatusPage />
      </LanguageProvider>
    )
    
    // Default mock data has a home loan with 36 months paid
    expect(screen.getByText(/Home Loan Refinance!/i)).toBeInTheDocument()
    expect(screen.getByText(/ผ่อนบ้านครบ 3 ปีแล้ว/i)).toBeInTheDocument()
  })

  it('allows adding a new asset', () => {
    render(
      <LanguageProvider>
        <FinancialStatusPage />
      </LanguageProvider>
    )
    
    const addButtons = screen.getAllByText(/เพิ่มรายการ/i)
    fireEvent.click(addButtons[0]) // Asset add button
    
    const newItems = screen.getAllByDisplayValue(/รายการใหม่/i)
    expect(newItems.length).toBeGreaterThan(0)
  })
})
