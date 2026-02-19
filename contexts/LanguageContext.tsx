"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations, type Language, type TranslationKey } from "@/lib/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("th")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "th" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.th[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  // Return undefined instead of throwing error
  return context
}

// Create a safe hook that provides fallbacks
export function useLanguageSafe() {
  const context = useContext(LanguageContext)

  if (context) {
    return context
  }

  // Fallback when context is not available
  return {
    language: "th" as Language,
    setLanguage: () => {},
    t: (key: TranslationKey) => {
      // Fallback translations
      const fallbacks: Record<string, string> = {
        back: "กลับ",
        supportTitle: "สนับสนุน",
        supportDescription: "ทำสามารถร่วมสนับสนุนการจัดทำโครงข้อมูลการเงิน เรื่องการเงินใสสดใสเสมอ ด้วยการโอนเงินกับบัญชี พร้อมแพยมี",
        copyright: "ระบบวางแผนการเงิน",
        allRightsReserved: "สงวนลิขสิทธิ์",
        privacyData: "ข้อมูลความเป็นส่วนตัว",
        privacyPolicy: "นโยบายความเป็นส่วนตัว",
      }
      return fallbacks[key] || key
    },
  }
}
