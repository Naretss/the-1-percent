"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Moon, Sun, Rocket, Info } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Footer } from "@/components/Footer"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts"

export default function FirstMillionPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { t } = useLanguage()

  // State
  const [monthlySaving, setMonthlySaving] = useState(5000)
  const [targetAmount, setTargetAmount] = useState(1000000)
  const [investmentRate, setInvestmentRate] = useState(5) // 2, 5, 8 or custom
  const [customRate, setCustomRate] = useState(10)
  const [isCustom, setIsCustom] = useState(false)

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode))
    }
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("darkMode", JSON.stringify(newMode))
  }

  const effectiveRate = isCustom ? customRate : investmentRate

  // Calculation Logic
  const calculateFirstMillion = () => {
    const target = targetAmount
    let currentBalance = 0
    let totalPrincipal = 0
    let months = 0
    const monthlyRate = effectiveRate / 100 / 12
    const data = []

    data.push({ year: 0, principal: 0, interest: 0, total: 0 })

    while (currentBalance < target && months < 1200) { // Max 100 years safeguard
      months++
      totalPrincipal += monthlySaving
      
      if (monthlyRate > 0) {
        const interestEarned = currentBalance * monthlyRate
        currentBalance = currentBalance + interestEarned + monthlySaving
      } else {
        currentBalance = totalPrincipal + monthlySaving
      }
      
      if (months % 12 === 0 || currentBalance >= target) {
        // Cap the total balance and interest at the target for the visualization
        const displayBalance = Math.min(currentBalance, target)
        data.push({
          year: months / 12,
          principal: totalPrincipal,
          interest: displayBalance > totalPrincipal ? displayBalance - totalPrincipal : 0,
          total: displayBalance
        })
      }
    }

    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    return { months, years, remainingMonths, data }
  }

  const result = calculateFirstMillion()

  const getTip = () => {
    if (isCustom) return null
    if (investmentRate === 2) return t("tipDeposit" as any)
    if (investmentRate === 5) return t("tipMixedFund" as any)
    return t("tipStock" as any)
  }

  const handleStyleChange = (val: string) => {
    if (val === "custom") {
      setIsCustom(true)
    } else {
      setIsCustom(false)
      setInvestmentRate(Number(val))
    }
  }

  return (
    <div className={`min-h-screen font-sans transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-yellow-400" : "bg-white border hover:bg-gray-50 text-gray-600"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToHome")}
          </button>

          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold hidden md:block">{t("firstMillionTitle" as any)}</h2>
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-xl transition-all ${
                isDarkMode ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : "bg-white border text-gray-600 shadow-sm"
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className={`inline-flex p-4 rounded-3xl mb-6 ${isDarkMode ? "bg-yellow-500/20" : "bg-yellow-100"}`}>
            <Rocket className={`w-12 h-12 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"} fill-current`} />
          </div>
          <h1 className={`text-4xl md:text-5xl font-black mb-4 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
            {t("firstMillionTitle" as any)}
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {t("firstMillionDescription" as any).replace("1,000,000", targetAmount.toLocaleString())}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className={`p-6 rounded-3xl border-2 ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
              {/* Monthly Saving Slider */}
              <h3 className="text-lg font-bold mb-6">{t("monthlySaving" as any)}</h3>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-2xl font-black ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                    ฿{monthlySaving.toLocaleString()}
                  </span>
                  <span className="text-sm opacity-70">/ {t("month")}</span>
                </div>
                <Slider
                  defaultValue={[5000]}
                  max={50000}
                  min={1000}
                  step={1000}
                  value={[monthlySaving]}
                  onValueChange={(vals) => setMonthlySaving(vals[0])}
                  className="py-4"
                  data-testid="monthly-saving-slider"
                />
              </div>

              {/* Target Amount Slider */}
              <h3 className="text-lg font-bold mb-6">{t("targetAmount" as any)}</h3>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-2xl font-black ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                    ฿{targetAmount.toLocaleString()}
                  </span>
                </div>
                <Slider
                  defaultValue={[1000000]}
                  max={10000000}
                  min={100000}
                  step={100000}
                  value={[targetAmount]}
                  onValueChange={(vals) => setTargetAmount(vals[0])}
                  className="py-4"
                  data-testid="target-amount-slider"
                />
              </div>

              <h3 className="text-lg font-bold mb-4">{t("investmentStyle" as any)}</h3>
              <RadioGroup value={isCustom ? "custom" : investmentRate.toString()} onValueChange={handleStyleChange} className="space-y-3">
                <div className={`flex items-center space-x-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${!isCustom && investmentRate === 2 ? (isDarkMode ? "border-yellow-500 bg-yellow-500/10" : "border-yellow-400 bg-yellow-50") : (isDarkMode ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300")}`}>
                  <RadioGroupItem value="2" id="rate-2" />
                  <Label htmlFor="rate-2" className="cursor-pointer flex-1">{t("depositStyle" as any)}</Label>
                </div>
                <div className={`flex items-center space-x-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${!isCustom && investmentRate === 5 ? (isDarkMode ? "border-yellow-500 bg-yellow-500/10" : "border-yellow-400 bg-yellow-50") : (isDarkMode ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300")}`}>
                  <RadioGroupItem value="5" id="rate-5" />
                  <Label htmlFor="rate-5" className="cursor-pointer flex-1">{t("mixedFundStyle" as any)}</Label>
                </div>
                <div className={`flex items-center space-x-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${!isCustom && investmentRate === 8 ? (isDarkMode ? "border-yellow-500 bg-yellow-500/10" : "border-yellow-400 bg-yellow-50") : (isDarkMode ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300")}`}>
                  <RadioGroupItem value="8" id="rate-8" />
                  <Label htmlFor="rate-8" className="cursor-pointer flex-1">{t("stockStyle" as any)}</Label>
                </div>
                <div className={`flex items-center space-x-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${isCustom ? (isDarkMode ? "border-yellow-500 bg-yellow-500/10" : "border-yellow-400 bg-yellow-50") : (isDarkMode ? "border-gray-700 hover:border-gray-600" : "border-gray-200 hover:border-gray-300")}`}>
                  <RadioGroupItem value="custom" id="rate-custom" />
                  <Label htmlFor="rate-custom" className="cursor-pointer flex-1">{t("customStyle" as any)}</Label>
                </div>
              </RadioGroup>

              {isCustom && (
                <div className="mt-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm opacity-70">{t("customStyle" as any)}</span>
                    <span className={`text-xl font-bold ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>{customRate}%</span>
                  </div>
                  <Slider
                    defaultValue={[10]}
                    max={20}
                    min={1}
                    step={0.5}
                    value={[customRate]}
                    onValueChange={(vals) => setCustomRate(vals[0])}
                    className="py-2"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Result & Chart */}
          <div className="lg:col-span-2 space-y-8">
            <div className={`p-8 rounded-[2.5rem] text-center border-4 ${isDarkMode ? "bg-gray-800/30 border-yellow-500/30" : "bg-white border-yellow-200 shadow-xl"}`}>
              <p className="text-xl mb-4 font-medium opacity-80">{t("goalAchievementTime" as any).replace("{amount}", targetAmount.toLocaleString())}</p>
              <p className={`text-5xl md:text-6xl font-black text-[#FBBF24]`}>
                {result.years > 0 && `${result.years} ${t("yearText" as any)} `}
                {result.remainingMonths > 0 && `${result.remainingMonths} ${t("monthText" as any)}`}
                {result.years === 0 && result.remainingMonths === 0 && `0 ${t("monthText" as any)}`}
              </p>
            </div>

            <div className={`p-8 rounded-[2.5rem] border-2 h-[400px] ${isDarkMode ? "bg-gray-800/30 border-gray-700" : "bg-white border-gray-200 shadow-xl"}`}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.data} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4b5563" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4b5563" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FBBF24" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis 
                    dataKey="year" 
                    stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                    tickFormatter={(val) => `${Number(val).toFixed(1).replace(/\.0$/, '')}${t("yearText" as any)}`}
                  />
                  <YAxis 
                    stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
                    tickFormatter={(val) => val === targetAmount ? targetAmount.toLocaleString() : `฿${val/1000}k`}
                    domain={[0, targetAmount]}
                    ticks={[0, targetAmount * 0.25, targetAmount * 0.5, targetAmount * 0.75, targetAmount]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: isDarkMode ? "#1f2937" : "#fff", borderRadius: "12px", border: "none" }}
                    labelFormatter={(label) => `${t("yearText" as any)} ${Number(label).toFixed(1)}`}
                    formatter={(value: number, name: string) => [`฿${value.toLocaleString()}`, name === 'principal' ? 'เงินต้นสะสม' : 'ดอกเบี้ยทบต้น']}
                  />
                  <ReferenceLine y={targetAmount} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: targetAmount.toLocaleString(), fill: '#10b981' }} />
                  <Area type="monotone" dataKey="principal" stackId="1" stroke="#4b5563" fill="url(#colorPrincipal)" />
                  <Area type="monotone" dataKey="interest" stackId="1" stroke="#FBBF24" fill="url(#colorInterest)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className={`p-6 rounded-3xl flex gap-4 ${isDarkMode ? "bg-blue-500/10 text-blue-200" : "bg-blue-50 text-blue-800"}`}>
              <Info className="w-6 h-6 shrink-0 text-blue-500" />
              <p className="leading-relaxed">{getTip()}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  )
}
