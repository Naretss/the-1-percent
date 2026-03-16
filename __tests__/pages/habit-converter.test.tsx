import { render, screen, fireEvent } from '@testing-library/react'
import { vi, expect, it, describe } from 'vitest'
import HabitConverterPage from '@/app/habit-converter/page'
import { LanguageProvider } from '@/contexts/LanguageContext'

describe('HabitConverterPage', () => {
  it('renders the habit converter page', () => {
    render(
      <LanguageProvider>
        <HabitConverterPage />
      </LanguageProvider>
    )
    
    expect(screen.getByText(/แปลงร่างรายจ่ายจุกจิกเป็นพลังปลดหนี้/i)).toBeInTheDocument()
    expect(screen.getByText(/ยอดหนี้คงเหลือ/i)).toBeInTheDocument()
  })

  it('allows adding a custom habit', () => {
    const { container } = render(
      <LanguageProvider>
        <HabitConverterPage />
      </LanguageProvider>
    )
    
    const nameInput = screen.getByPlaceholderText(/เช่น ลดค่าบุหรี่/i)
    const amountInput = screen.getByPlaceholderText(/ยอดประหยัด\/เดือน/i)
    const addButton = container.querySelector('.lucide-plus')?.closest('button')
    
    fireEvent.change(nameInput, { target: { value: 'เดินไปทำงาน' } })
    fireEvent.change(amountInput, { target: { value: '500' } })
    
    if (addButton) {
      fireEvent.click(addButton)
    }
    
    expect(screen.getByText(/เดินไปทำงาน/i)).toBeInTheDocument()
    expect(screen.getByText(/ประหยัดได้ 500.-/i)).toBeInTheDocument()
  })

  it('updates calculations when a habit is selected', () => {
    render(
      <LanguageProvider>
        <HabitConverterPage />
      </LanguageProvider>
    )
    
    // Initial state should not show success message
    expect(screen.queryByText(/เยี่ยมมาก!/i)).not.toBeInTheDocument()
    
    // Toggle coffee habit
    const coffeeLabel = screen.getByText(/ลดกาแฟ/i)
    fireEvent.click(coffeeLabel)
    
    // Success message should appear
    expect(screen.getByText(/เยี่ยมมาก!/i)).toBeInTheDocument()
  })
})
