"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Moon, Sun, ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { LanguageSelector } from "@/components/LanguageSelector"
import { Footer } from "@/components/Footer"

export default function MoneyPlanningPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode))
    } else {
      setIsDarkMode(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode))
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleGetStarted = () => {
    router.push("/goals")
  }

  const handleSupport = () => {
    router.push("/support")
  }

  return (
    <div className={`min-h-screen transition-all duration-300 font-sans ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div className="container mx-auto px-8 py-6 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Language Selector */}
          <LanguageSelector isDarkMode={isDarkMode} />

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-lg transition-all duration-300 hover:scale-110 font-medium ${
              isDarkMode
                ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-md"
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 max-w-6xl">
        <div
          className={`rounded-3xl border-2 p-12 shadow-lg ${
            isDarkMode ? "bg-gray-800 border-yellow-400/20" : "bg-white border-gray-200"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Illustration */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Hourglass SVG Illustration */}
                <svg viewBox="0 0 400 400" className="w-full h-auto">
                  {/* Background elements */}
                  <circle cx="80" cy="100" r="20" fill={isDarkMode ? "#FEF3C7" : "#E0F2FE"} opacity="0.6" />
                  <circle cx="320" cy="80" r="15" fill={isDarkMode ? "#FBBF24" : "#FEF3C7"} opacity="0.8" />
                  <circle cx="350" cy="200" r="25" fill={isDarkMode ? "#FCD34D" : "#DBEAFE"} opacity="0.5" />
                  <circle cx="50" cy="250" r="18" fill={isDarkMode ? "#F59E0B" : "#FEF3C7"} opacity="0.7" />

                  {/* Hourglass */}
                  <g transform="translate(150, 80)">
                    {/* Hourglass frame */}
                    <path
                      d="M20 20 L80 20 L80 40 L50 70 L80 100 L80 120 L20 120 L20 100 L50 70 L20 40 Z"
                      fill={isDarkMode ? "#FBBF24" : "#3B82F6"}
                      opacity="0.8"
                    />
                    <path
                      d="M25 25 L75 25 L75 35 L50 60 L75 85 L75 115 L25 115 L25 85 L50 60 L25 35 Z"
                      fill={isDarkMode ? "#FCD34D" : "#60A5FA"}
                      opacity="0.6"
                    />

                    {/* Sand */}
                    <path d="M30 90 L70 90 L70 110 L30 110 Z" fill={isDarkMode ? "#D97706" : "#F59E0B"} />
                    <path d="M45 65 L55 65 L50 75 Z" fill={isDarkMode ? "#D97706" : "#F59E0B"} />
                  </g>

                  {/* Person sitting on hourglass */}
                  <g transform="translate(170, 50)">
                    {/* Laptop */}
                    <rect x="5" y="25" width="20" height="12" rx="2" fill={isDarkMode ? "#D97706" : "#F59E0B"} />
                    <rect x="6" y="26" width="18" height="8" rx="1" fill={isDarkMode ? "#FCD34D" : "#FCD34D"} />

                    {/* Person */}
                    <circle cx="15" cy="15" r="8" fill="#FEF3C7" />
                    <path
                      d="M10 12 Q15 8 20 12"
                      stroke={isDarkMode ? "#FBBF24" : "#1E40AF"}
                      strokeWidth="2"
                      fill="none"
                    />
                    <rect x="8" y="20" width="14" height="15" rx="3" fill={isDarkMode ? "#FBBF24" : "#3B82F6"} />
                    <rect x="10" y="35" width="4" height="8" fill={isDarkMode ? "#F59E0B" : "#1E40AF"} />
                    <rect x="16" y="35" width="4" height="8" fill={isDarkMode ? "#F59E0B" : "#1E40AF"} />
                  </g>

                  {/* Person on the right */}
                  <g transform="translate(280, 180)">
                    <circle cx="15" cy="15" r="8" fill="#FEF3C7" />
                    <path
                      d="M10 12 Q15 8 20 12"
                      stroke={isDarkMode ? "#D97706" : "#F59E0B"}
                      strokeWidth="2"
                      fill="none"
                    />
                    <rect x="8" y="20" width="14" height="20" rx="3" fill={isDarkMode ? "#D97706" : "#F59E0B"} />
                    <rect x="10" y="40" width="4" height="12" fill={isDarkMode ? "#92400E" : "#D97706"} />
                    <rect x="16" y="40" width="4" height="12" fill={isDarkMode ? "#92400E" : "#D97706"} />
                    {/* Arms raised */}
                    <rect x="2" y="25" width="8" height="4" rx="2" fill="#FEF3C7" transform="rotate(-30 6 27)" />
                    <rect x="20" y="25" width="8" height="4" rx="2" fill="#FEF3C7" transform="rotate(30 24 27)" />
                  </g>

                  {/* Person on the left (child) */}
                  <g transform="translate(80, 200)">
                    <circle cx="12" cy="12" r="6" fill="#FEF3C7" />
                    <path
                      d="M8 10 Q12 6 16 10"
                      stroke={isDarkMode ? "#D97706" : "#F59E0B"}
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <rect x="6" y="16" width="12" height="16" rx="2" fill={isDarkMode ? "#D97706" : "#F59E0B"} />
                    <rect x="8" y="32" width="3" height="10" fill={isDarkMode ? "#92400E" : "#D97706"} />
                    <rect x="13" y="32" width="3" height="10" fill={isDarkMode ? "#92400E" : "#D97706"} />
                    {/* Arms raised */}
                    <rect x="0" y="20" width="6" height="3" rx="1.5" fill="#FEF3C7" transform="rotate(-45 3 21.5)" />
                    <rect x="18" y="20" width="6" height="3" rx="1.5" fill="#FEF3C7" transform="rotate(45 21 21.5)" />
                  </g>

                  {/* Decorative elements */}
                  <path
                    d="M100 150 Q120 140 140 150"
                    stroke={isDarkMode ? "#FBBF24" : "#3B82F6"}
                    strokeWidth="2"
                    fill="none"
                    opacity="0.3"
                  />
                  <path
                    d="M260 120 Q280 110 300 120"
                    stroke={isDarkMode ? "#D97706" : "#F59E0B"}
                    strokeWidth="2"
                    fill="none"
                    opacity="0.3"
                  />
                </svg>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="text-center lg:text-left">
              <h1 className={`text-5xl font-bold mb-4 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
                {t("homeTitle")}
              </h1>
              <p className={`text-xl mb-8 leading-relaxed ${isDarkMode ? "text-yellow-200" : "text-gray-600"}`}>
                {t("homeSubtitle")}
              </p>

              {/* Buttons - Now on the same line */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* Primary Button */}
                <button
                  onClick={handleGetStarted}
                  className={`px-12 py-4 text-lg font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 ${
                    isDarkMode
                      ? "bg-yellow-500 text-black hover:bg-yellow-400"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {t("getStarted")}
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Support Button */}
                <button
                  onClick={handleSupport}
                  className={`px-8 py-4 border-2 font-semibold text-lg rounded-full transition-all duration-200 ${
                    isDarkMode
                      ? "border-yellow-400/30 text-yellow-200 hover:border-yellow-400 hover:text-yellow-400"
                      : "border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {t("support")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  )
}
