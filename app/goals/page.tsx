"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Moon, Sun, Heart, Home, Briefcase, DollarSign, BookOpen, Users, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Footer } from "@/components/Footer"

const GoalsPage = () => {
  const { t } = useLanguage()

  const dimensions = [
    { id: 1, name: t("health"), icon: Heart, position: { x: 50, y: 15 } },
    { id: 2, name: t("family"), icon: Home, position: { x: 85, y: 35 } },
    { id: 3, name: t("career"), icon: Briefcase, position: { x: 85, y: 65 } },
    { id: 4, name: t("finance"), icon: DollarSign, position: { x: 50, y: 85 } },
    { id: 5, name: t("development"), icon: BookOpen, position: { x: 15, y: 65 } },
    { id: 6, name: t("sharing"), icon: Users, position: { x: 15, y: 35 } },
  ]

  const router = useRouter()
  const [startYear, setStartYear] = useState("2025")
  const [endYear, setEndYear] = useState("2026")
  const [goals, setGoals] = useState<Record<number, { goal: string; reason: string; timeline: string }>>({})
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode))
    } else {
      setIsDarkMode(true)
    }

    // Load saved data
    const savedData = localStorage.getItem("financialPlanData")
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setStartYear(parsedData.startYear || "2025")
      setEndYear(parsedData.endYear || "2026")
      setGoals(parsedData.goals || {})
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

  const handleGoalChange = (dimensionId: number, field: string, value: string) => {
    setGoals((prev) => ({
      ...prev,
      [dimensionId]: {
        ...prev[dimensionId],
        [field]: value,
      },
    }))
  }

  const saveDataAndNavigate = () => {
    // Save all data to localStorage
    const planData = {
      startYear,
      endYear,
      goals,
      createdAt: new Date().toISOString(),
      dimensions: dimensions.map((dim) => ({
        id: dim.id,
        name: dim.name,
        goal: goals[dim.id]?.goal || "",
        reason: goals[dim.id]?.reason || "",
        timeline: goals[dim.id]?.timeline || "",
      })),
    }

    localStorage.setItem("financialPlanData", JSON.stringify(planData))

    // Navigate to financial status page
    router.push("/financial-status")
  }

  const handleCancel = () => {
    setGoals({})
    setStartYear("2025")
    setEndYear("2026")
    localStorage.removeItem("financialPlanData")
  }

  const handleBack = () => {
    router.push("/")
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Check if form has any data
  const hasData = Object.values(goals).some(
    (goal) => goal?.goal?.trim() || goal?.reason?.trim() || goal?.timeline?.trim(),
  )

  return (
    <div className={`min-h-screen transition-all duration-300 font-sans ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Dark Mode Toggle - Top Right */}
      <div className="absolute top-6 right-6 z-10">
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

      <div className="container mx-auto px-8 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBack}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                isDarkMode
                  ? "text-yellow-200 hover:bg-gray-800 border border-gray-700"
                  : "text-gray-600 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              {t("backToHome")}
            </button>
          </div>

          <h1 className={`text-4xl font-bold mb-6 font-sans ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
            {t("goalsTitle")}
          </h1>

          <div className={`mb-6 font-sans ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
            <h2 className="text-xl font-semibold mb-2">{t("goalsSubtitle")}</h2>
            <p className="text-base leading-relaxed font-normal">{t("goalsDescription")}</p>
          </div>

          {/* Year Selection */}
          <div className="flex items-center gap-4 mb-8">
            <input
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              min="2020"
              max="2030"
              placeholder="2025"
              className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 w-24 text-center font-medium ${
                isDarkMode
                  ? "bg-gray-800 border-yellow-400/30 text-yellow-200 focus:ring-yellow-400 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500 placeholder-gray-400"
              }`}
            />

            <span className={`font-medium ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>{t("to")}</span>

            <input
              type="number"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              min="2020"
              max="2030"
              placeholder="2026"
              className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 w-24 text-center font-medium ${
                isDarkMode
                  ? "bg-gray-800 border-yellow-400/30 text-yellow-200 focus:ring-yellow-400 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500 placeholder-gray-400"
              }`}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 mb-8">
          {/* Left Side - Hexagon */}
          <div className="flex justify-start items-center">
            <div className="relative w-72 h-72">
              {/* Background Glow Effect */}
              <div
                className={`absolute inset-0 rounded-full blur-3xl opacity-20 ${
                  isDarkMode ? "bg-yellow-400" : "bg-blue-400"
                }`}
              ></div>

              {/* Hexagon SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
                {/* Gradient Definitions */}
                <defs>
                  <linearGradient id="hexagonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isDarkMode ? "#fbbf24" : "#3b82f6"} stopOpacity="0.8" />
                    <stop offset="50%" stopColor={isDarkMode ? "#f59e0b" : "#1d4ed8"} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={isDarkMode ? "#d97706" : "#1e40af"} stopOpacity="0.4" />
                  </linearGradient>

                  <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isDarkMode ? "#fcd34d" : "#60a5fa"} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={isDarkMode ? "#f59e0b" : "#2563eb"} stopOpacity="0.1" />
                  </linearGradient>

                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <filter id="pointGlow">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Outer hexagon with gradient */}
                <polygon
                  points="50,15 85,35 85,65 50,85 15,65 15,35"
                  fill="none"
                  stroke="url(#hexagonGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="3,2"
                  filter="url(#glow)"
                  className="animate-pulse"
                />

                {/* Inner hexagon */}
                <polygon
                  points="50,25 75,40 75,60 50,75 25,60 25,40"
                  fill="url(#innerGradient)"
                  stroke={isDarkMode ? "#fbbf24" : "#3b82f6"}
                  strokeWidth="0.8"
                  strokeOpacity="0.6"
                  strokeDasharray="2,1"
                />

                {/* Center circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="8"
                  fill="none"
                  stroke={isDarkMode ? "#fcd34d" : "#60a5fa"}
                  strokeWidth="0.5"
                  strokeOpacity="0.4"
                  strokeDasharray="1,1"
                />

                {/* Dimension points and labels */}
                {dimensions.map((dimension, index) => {
                  return (
                    <g key={dimension.id}>
                      {/* Outer glow for points */}
                      <circle
                        cx={dimension.position.x}
                        cy={dimension.position.y}
                        r="3"
                        fill={isDarkMode ? "#fbbf24" : "#3b82f6"}
                        fillOpacity="0.2"
                        filter="url(#pointGlow)"
                      />

                      {/* Main point */}
                      <circle
                        cx={dimension.position.x}
                        cy={dimension.position.y}
                        r="2"
                        fill={isDarkMode ? "#fcd34d" : "#60a5fa"}
                        className="animate-pulse"
                        style={{
                          animationDelay: `${index * 0.2}s`,
                          animationDuration: "2s",
                        }}
                      />

                      {/* Inner point */}
                      <circle
                        cx={dimension.position.x}
                        cy={dimension.position.y}
                        r="0.8"
                        fill={isDarkMode ? "#ffffff" : "#1e40af"}
                        fillOpacity="0.8"
                      />

                      {/* Label text with IBM Plex Sans Thai */}
                      <text
                        x={dimension.position.x}
                        y={dimension.position.y - 6}
                        textAnchor="middle"
                        className={`text-[4px] font-semibold ${isDarkMode ? "fill-yellow-200" : "fill-blue-700"}`}
                        style={{
                          filter: "drop-shadow(0 0 2px rgba(0,0,0,0.5))",
                          letterSpacing: "0.3px",
                          fontFamily: "IBM Plex Sans Thai, system-ui, sans-serif",
                        }}
                      >
                        {dimension.name}
                      </text>
                    </g>
                  )
                })}

                {/* Connecting lines with gradient */}
                <g stroke="url(#hexagonGradient)" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="2,1">
                  <line x1="50" y1="15" x2="85" y2="35" />
                  <line x1="85" y1="35" x2="85" y2="65" />
                  <line x1="85" y1="65" x2="50" y2="85" />
                  <line x1="50" y1="85" x2="15" y2="65" />
                  <line x1="15" y1="65" x2="15" y2="35" />
                  <line x1="15" y1="35" x2="50" y2="15" />
                </g>

                {/* Radial lines from center */}
                <g
                  stroke={isDarkMode ? "#fbbf24" : "#3b82f6"}
                  strokeWidth="0.3"
                  strokeOpacity="0.3"
                  strokeDasharray="1,2"
                >
                  <line x1="50" y1="50" x2="50" y2="15" />
                  <line x1="50" y1="50" x2="85" y2="35" />
                  <line x1="50" y1="50" x2="85" y2="65" />
                  <line x1="50" y1="50" x2="50" y2="85" />
                  <line x1="50" y1="50" x2="15" y2="65" />
                  <line x1="50" y1="50" x2="15" y2="35" />
                </g>
              </svg>
            </div>
          </div>

          {/* Right Side - Table */}
          <div className="overflow-x-auto">
            <table className="table-fixed w-full">
              <colgroup>
                <col className="w-[15%]" />
                <col className="w-[35%]" />
                <col className="w-[35%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-yellow-500/20" : "border-gray-200"}`}>
                  <th
                    className={`px-4 py-3 text-left text-sm font-semibold font-sans ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                  >
                    {t("dimension")}
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-sm font-semibold font-sans ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                  >
                    {t("goal")}
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-sm font-semibold font-sans ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                  >
                    {t("reason")}
                  </th>
                  <th
                    className={`px-4 py-3 text-left text-sm font-semibold font-sans ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                  >
                    {t("timeline")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {dimensions.map((dimension) => {
                  const IconComponent = dimension.icon
                  return (
                    <tr
                      key={dimension.id}
                      className={`border-b transition-all duration-200 ${
                        isDarkMode ? "border-yellow-500/10 hover:bg-yellow-500/5" : "border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-4 h-4 ${isDarkMode ? "text-yellow-400" : "text-gray-600"}`} />
                          <span
                            className={`text-sm font-medium font-sans ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}
                          >
                            {dimension.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="text"
                          placeholder={t("goalPlaceholder")}
                          value={goals[dimension.id]?.goal || ""}
                          onChange={(e) => handleGoalChange(dimension.id, "goal", e.target.value)}
                          className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-200 font-normal font-sans ${
                            isDarkMode
                              ? "bg-gray-800/50 border-yellow-400/30 text-yellow-200 placeholder-gray-400 focus:ring-yellow-400"
                              : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400 focus:ring-blue-500"
                          }`}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="text"
                          placeholder={t("reasonPlaceholder")}
                          value={goals[dimension.id]?.reason || ""}
                          onChange={(e) => handleGoalChange(dimension.id, "reason", e.target.value)}
                          className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-200 font-normal font-sans ${
                            isDarkMode
                              ? "bg-gray-800/50 border-yellow-400/30 text-yellow-200 placeholder-gray-400 focus:ring-yellow-400"
                              : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400 focus:ring-blue-500"
                          }`}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          type="text"
                          placeholder={t("timelinePlaceholder")}
                          value={goals[dimension.id]?.timeline || ""}
                          onChange={(e) => handleGoalChange(dimension.id, "timeline", e.target.value)}
                          className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 transition-all duration-200 text-center font-normal font-sans ${
                            isDarkMode
                              ? "bg-gray-800/50 border-yellow-400/30 text-yellow-200 placeholder-gray-400 focus:ring-yellow-400"
                              : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400 focus:ring-blue-500"
                          }`}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mb-8">
          <button
            onClick={handleCancel}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 font-sans ${
              isDarkMode
                ? "text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-600"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            {t("cancel")}
          </button>
          <button
            onClick={saveDataAndNavigate}
            disabled={!hasData}
            className={`px-6 py-2 text-sm font-semibold rounded-md transition-all duration-200 font-sans ${
              hasData
                ? isDarkMode
                  ? "bg-yellow-500 text-black hover:bg-yellow-400"
                  : "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
          >
            {t("startPlanning")}
          </button>
        </div>

        {/* Footer */}
        <Footer isDarkMode={isDarkMode} />
      </div>
    </div>
  )
}

export default GoalsPage
