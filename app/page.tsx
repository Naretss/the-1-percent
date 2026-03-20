"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Moon, Sun, Zap, Rocket, PiggyBank, ShieldAlert, Sprout, TrendingUp, ArrowUpRight } from "lucide-react"
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

  const zones = [
    {
      id: "zone2",
      title: t("zone2Title"),
      icon: Sprout,
      accentColor: "text-yellow-400",
      tools: [
        {
          id: 4,
          title: t("wishlistTitle"),
          description: t("wishlistCompactDesc" as any),
          icon: PiggyBank,
          color: "purple",
          path: "/wishlist",
        },
        {
          id: 3,
          title: t("firstMillionTitle"),
          description: t("firstMillionCompactDesc" as any),
          icon: Rocket,
          color: "green",
          path: "/first-million",
        },
      ],
    },
    {
      id: "zone3",
      title: t("zone3Title"),
      icon: TrendingUp,
      accentColor: "text-yellow-400",
      tools: [
        {
          id: 5,
          title: t("retirementSimulatorTitle"),
          description: t("retirementSimulatorCompactDesc" as any),
          icon: Sun,
          color: "yellow",
          path: "/retirement-simulator",
        },
        {
          id: 1,
          title: t("advancedPlanningTitle"),
          description: t("advancedPlanningCompactDesc" as any),
          icon: Calendar,
          color: "blue",
          path: "/money-planning",
        },
      ],
    },
    {
      id: "zone1",
      title: t("zone1Title"),
      icon: ShieldAlert,
      accentColor: "text-red-400",
      tools: [
        {
          id: 2,
          title: t("habitConverterCompactTitle" as any),
          description: t("habitConverterCompactDesc" as any),
          icon: Zap,
          color: "yellow",
          path: "/habit-converter",
        },
      ],
    },
  ]

  return (
    <div className={`min-h-screen transition-all duration-300 font-sans ${isDarkMode ? "bg-slate-950 text-white" : "bg-gray-50 text-slate-900"}`}>
      {/* Header */}
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <LanguageSelector isDarkMode={isDarkMode} />

          <div className="flex items-center gap-3">
            <span className={`text-xl font-black tracking-tighter ${isDarkMode ? "text-yellow-400" : "text-indigo-900"}`}>
              THE 1%
            </span>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-slate-800 text-yellow-400 border border-slate-700"
                  : "bg-white text-indigo-900 border border-gray-200 shadow-sm"
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section - Compact */}
      <div className="container mx-auto px-4 pt-8 pb-10 max-w-5xl text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
          {t("welcomeTitle")}
        </h1>
        <p className={`text-lg opacity-80 max-w-2xl mx-auto`}>
          {t("welcomeSubtitle")}
        </p>
      </div>

      {/* Goal Zones - Bento Grid (Centered) */}
      <main className="container mx-auto px-4 pb-20 max-w-6xl space-y-12">
        {zones.map((zone) => {
          const ZoneIcon = zone.icon
          return (
            <section key={zone.id} className="space-y-6">
              <div className="flex items-center justify-center gap-3 border-b pb-2 border-slate-200 dark:border-slate-800 max-w-2xl mx-auto">
                <div className={`p-1.5 rounded-lg ${isDarkMode ? "bg-slate-800" : "bg-indigo-100"}`}>
                  <ZoneIcon className={`w-5 h-5 ${zone.accentColor}`} />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-wide opacity-90">
                  {zone.title}
                </h2>
              </div>

              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {zone.tools.map((tool) => (
                  <div key={tool.id} className="w-[calc(50%-6px)] md:w-[calc(33.333%-11px)] max-w-[320px]">
                    <BentoCard 
                      tool={tool} 
                      isDarkMode={isDarkMode} 
                      onNavigate={handleNavigate}
                    />
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  )
}

function BentoCard({ tool, isDarkMode, onNavigate }: any) {
  const Icon = tool.icon
  
  return (
    <div
      onClick={() => onNavigate(tool.path)}
      className={`group relative p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between h-full ${
        isDarkMode
          ? "bg-slate-900 border-slate-800 hover:border-yellow-400/50 hover:bg-slate-800/60"
          : "bg-white border-gray-100 hover:border-indigo-300 shadow-sm hover:shadow-md"
      }`}
    >
      <div className="relative z-10">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${
          tool.color === 'yellow' ? 'bg-yellow-400/10 text-yellow-400' :
          tool.color === 'green' ? 'bg-green-400/10 text-green-400' :
          tool.color === 'purple' ? 'bg-purple-400/10 text-purple-400' :
          'bg-blue-400/10 text-blue-400'
        }`}>
          <Icon className="w-6 h-6 md:w-7 md:h-7" />
        </div>

        <h3 className="text-base md:text-lg font-bold leading-tight mb-1">
          {tool.title}
        </h3>
        <p className="text-xs md:text-sm opacity-60 line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="mt-4 flex justify-end">
        <div className={`p-1.5 rounded-full transition-all duration-300 ${
          isDarkMode ? "bg-slate-800 group-hover:bg-yellow-400 group-hover:text-black" : "bg-gray-100 group-hover:bg-indigo-600 group-hover:text-white"
        }`}>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
      
      {/* Subtle hover glow */}
      <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-10 ${
        tool.color === 'yellow' ? 'bg-yellow-400' :
        tool.color === 'green' ? 'bg-green-400' :
        tool.color === 'purple' ? 'bg-purple-400' :
        'bg-blue-400'
      }`}></div>
    </div>
  )
}
