"use client"

import { useState } from "react"
import { Globe, ChevronDown } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface LanguageSelectorProps {
  isDarkMode: boolean
}

export function LanguageSelector({ isDarkMode }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: "th" as const, name: t("thai") },
    { code: "en" as const, name: t("english") },
  ]

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <div className="flex items-center gap-3">
      <span className={`font-medium ${isDarkMode ? "text-yellow-200" : "text-blue-600"}`}>{t("selectLanguage")}</span>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 border-2 rounded-full transition-all duration-200 ${
            isDarkMode
              ? "border-yellow-400/30 bg-gray-800 hover:bg-gray-700 text-yellow-200"
              : "border-orange-300 bg-white hover:bg-orange-50 text-gray-700"
          }`}
        >
          <Globe className={`w-4 h-4 ${isDarkMode ? "text-yellow-400" : "text-orange-500"}`} />
          <span className="font-medium">{currentLanguage?.name}</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div
            className={`absolute top-full left-0 mt-2 w-full rounded-lg border shadow-lg z-50 ${
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2 text-left hover:bg-opacity-10 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  language === lang.code
                    ? isDarkMode
                      ? "bg-yellow-500/20 text-yellow-200"
                      : "bg-blue-50 text-blue-600"
                    : isDarkMode
                      ? "text-yellow-200 hover:bg-yellow-500/10"
                      : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
