import { render, screen } from '@testing-library/react'
import { vi, expect, it, describe } from 'vitest'
import SupportPage from '@/app/support/page'
import { LanguageProvider } from '@/contexts/LanguageContext'

describe('SupportPage', () => {
  it('renders the support page', () => {
    render(
      <LanguageProvider>
        <SupportPage />
      </LanguageProvider>
    )
    
    expect(screen.getByRole('heading', { name: /สนับสนุน/i, level: 1 })).toBeInTheDocument()
    expect(screen.getByText(/QR Code PromptPay/i)).toBeInTheDocument()
  })
})
