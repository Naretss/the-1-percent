"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Moon, Sun, Zap, Lightbulb, Rocket, PiggyBank } from "lucide-react"
import { Footer } from "@/components/Footer"
import { LanguageSelector } from "@/components/LanguageSelector"
import { useLanguage } from "@/contexts/LanguageContext"

export default function HomePage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode))
    } else {
      // ถ้าไม่มีค่าที่บันทึกไว้ ให้ใช้ dark mode เป็น default
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

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  const tools = [
    {
      id: 1,
      title: t("advancedPlanningTitle"),
      description: t("advancedPlanningDescription"),
      icon: Calendar,
      color: "blue",
      path: "/money-planning",
    },
    {
      id: 5,
      title: t("retirementSimulatorTitle" as any),
      description: t("retirementSimulatorDescription" as any),
      icon: Sun,
      color: "yellow",
      path: "/retirement-simulator",
    },
    {
      id: 2,
      title: t("habitConverterTitle"),
      description: t("habitConverterDescription"),
      icon: Zap,
      color: "yellow",
      path: "/habit-converter",
    },
    {
      id: 3,
      title: t("firstMillionTitle" as any),
      description: t("firstMillionDescription" as any),
      icon: Rocket,
      color: "green",
      path: "/first-million",
    },
    {
      id: 4,
      title: t("wishlistTitle" as any),
      description: t("wishlistDescription" as any),
      icon: PiggyBank,
      color: "purple",
      path: "/wishlist",
    },
  ]

  return (
    <div className={`min-h-screen transition-all duration-300 font-sans ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div className="container mx-auto px-8 py-6 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Language Selector */}
          <LanguageSelector isDarkMode={isDarkMode} />

          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex items-center">
              <span className={`text-2xl font-bold ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
                {t("homeMainTitle")}
              </span>
            </div>

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
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className={`text-6xl font-bold mb-6 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
            {t("homeMainTitle")}
          </h1>
          <p
            className={`text-xl mb-12 leading-relaxed max-w-3xl mx-auto ${isDarkMode ? "text-yellow-200" : "text-gray-600"}`}
          >
            {t("homeMainDescription")}{" "}
            <a
              href={t("facebookLink")}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-500 hover:text-blue-600 dark:text-yellow-300 dark:hover:text-yellow-200"
            >
              {t("facebookLink")}
            </a>
          </p>
        </div>

        {/* Tools Section */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
            {t("financialToolsTitle")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto">
            {tools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <div
                  key={tool.id}
                  className={`p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer flex flex-col ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 hover:border-yellow-400/50"
                      : "bg-white border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex flex-col items-center text-center flex-1">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                        tool.color === "blue"
                          ? isDarkMode
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-blue-100 text-blue-600"
                          : tool.color === "green"
                            ? isDarkMode
                              ? "bg-green-500/20 text-green-400"
                              : "bg-green-100 text-green-600"
                            : tool.color === "yellow"
                              ? isDarkMode
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-yellow-100 text-yellow-600"
                              : isDarkMode
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-purple-100 text-purple-600"
                      }`}
                    >
                      <IconComponent className="w-8 h-8" />
                    </div>

                    <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-yellow-200" : "text-gray-800"}`}>
                      {tool.title}
                    </h3>

                    <p className={`text-sm leading-relaxed mb-8 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {tool.description}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleNavigate(tool.path)}
                    className={`mt-auto px-8 py-3 text-lg font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      isDarkMode
                        ? "bg-yellow-500 text-black hover:bg-yellow-400"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }`}
                  >
                    {t("startUsing")}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  )
}
