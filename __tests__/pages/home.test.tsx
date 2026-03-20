import { render, screen } from '@testing-library/react'
import { vi, expect, it, describe } from 'vitest'
import HomePage from '@/app/page'
import { LanguageProvider } from '@/contexts/LanguageContext'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('HomePage', () => {
  it('renders the home page with welcome title', () => {
    render(
      <LanguageProvider>
        <HomePage />
      </LanguageProvider>
    )
    
    // Check if the welcome title exists
    expect(screen.getByText(/ยินดีต้อนรับสู่ The 1 Percent/i)).toBeInTheDocument()
  })

  it('renders all three goal zones', () => {
    render(
      <LanguageProvider>
        <HomePage />
      </LanguageProvider>
    )
    
    // Zone 1
    expect(screen.getByText(/จัดการหนี้สิน & อุดรอยรั่วทางการเงิน/i)).toBeInTheDocument()
    // Zone 2
    expect(screen.getByText(/เริ่มต้นเก็บออม & สร้างความมั่งคั่ง/i)).toBeInTheDocument()
    // Zone 3
    expect(screen.getByText(/วางแผนระยะยาว & เกษียณสุขใจ/i)).toBeInTheDocument()
  })

  it('renders all tool cards within zones', () => {
    render(
      <LanguageProvider>
        <HomePage />
      </LanguageProvider>
    )
    
    // Zone 1 tools
    expect(screen.getByText(/แปลงรายจ่ายเป็นพลังปลดหนี้/i)).toBeInTheDocument()
    
    // Zone 2 tools
    expect(screen.getByText(/กระปุกสานฝันวัยมันส์/i)).toBeInTheDocument()
    expect(screen.getByText(/เส้นทางสู่เงินล้านแรก/i)).toBeInTheDocument()
    
    // Zone 3 tools
    expect(screen.getByText(/จำลองไลฟ์สไตล์วัยเกษียณ/i)).toBeInTheDocument()
    expect(screen.getByText(/วางแผนการเงินล่วงหน้า/i)).toBeInTheDocument()
  })
})
