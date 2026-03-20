"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Sun, Moon, Home, Coffee, Plane, Info, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Footer } from "@/components/Footer"
import { LanguageSelector } from "@/components/LanguageSelector"
import { useLanguage } from "@/contexts/LanguageContext"

type Lifestyle = "minimalist" | "comfortable" | "luxury" | "diy"

export default function RetirementSimulator() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Section 1: Time Horizon
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(60)

  // Section 2: Lifestyle Cards
  const [selectedLifestyle, setSelectedLifestyle] = useState<Lifestyle>("comfortable")
  const [customBudget, setCustomBudget] = useState(40000)

  // Section 4: Adjust Investment Return
  const [investmentReturn, setInvestmentReturn] = useState(8)

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

  const lifestyles = [
    {
      id: "minimalist" as Lifestyle,
      title: t("minimalistLifestyle"),
      description: t("minimalistDescription"),
      budget: 15000,
      icon: Home,
      image: "🏡",
    },
    {
      id: "comfortable" as Lifestyle,
      title: t("comfortableLifestyle"),
      description: t("comfortableDescription"),
      budget: 30000,
      icon: Coffee,
      image: "☕",
    },
    {
      id: "luxury" as Lifestyle,
      title: t("luxuryLifestyle"),
      description: t("luxuryDescription"),
      budget: 50000,
      icon: Plane,
      image: "✈️",
    },
    {
      id: "diy" as Lifestyle,
      title: t("diyLifestyle"),
      description: t("diyDescription"),
      budget: customBudget,
      icon: Settings,
      image: "🛠️",
    },
  ]

  const yearsToSave = Math.max(0, retirementAge - currentAge)
  const selectedLifestyleData = lifestyles.find((l) => l.id === selectedLifestyle)!
  
  // ใช้ budget จากตัวเลือก หรือใช้ customBudget ถ้าเลือก DIY
  const activeBudget = selectedLifestyle === "diy" ? customBudget : selectedLifestyleData.budget
  
  // คิดคร่าวๆ จาก budget x 12 เดือน x 20 ปีหลังเกษียณ
  const retirementFundNeeded = activeBudget * 12 * 20
  
  // ถ้าฝากเงินเฉยๆ (0% return)
  const monthlySavingNoInvestment = yearsToSave > 0 ? retirementFundNeeded / (yearsToSave * 12) : 0
  
  // ถ้าลงทุน (Compound Interest PMT formula)
  const calculateMonthlyInvestment = (target: number, years: number, annualRate: number) => {
    if (years <= 0) return 0
    if (annualRate === 0) return target / (years * 12)
    
    const monthlyRate = annualRate / 100 / 12
    const totalMonths = years * 12
    return target / ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
  }

  const monthlyInvestmentRequired = calculateMonthlyInvestment(retirementFundNeeded, yearsToSave, investmentReturn)

  return (
    <div className={`min-h-screen transition-all duration-300 font-sans ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div className="container mx-auto px-6 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className={isDarkMode ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10" : "text-gray-600"}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            {t("back")}
          </Button>

          <div className="flex items-center gap-4">
            <LanguageSelector isDarkMode={isDarkMode} />
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode ? "bg-yellow-500/20 text-yellow-400" : "bg-white text-gray-600 shadow-sm border border-gray-200"
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
            {t("retirementSimulatorTitle")}
          </h1>
          <p className={`text-lg ${isDarkMode ? "text-yellow-100/80" : "text-gray-600"}`}>
            {t("retirementSimulatorDescription")}
          </p>
        </div>

        {/* Section 1: The Time Horizon */}
        <Card className={`mb-8 border-2 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100 shadow-md"}`}>
          <CardHeader>
            <CardTitle className={isDarkMode ? "text-yellow-200" : "text-gray-800"}>
              {t("yearsToSave").replace("{years}", yearsToSave.toString())}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {t("currentAge")}
                </label>
                <span className={`font-bold ${isDarkMode ? "text-yellow-400" : "text-blue-600"}`}>{currentAge}</span>
              </div>
              <Slider
                value={[currentAge]}
                onValueChange={(val) => setCurrentAge(val[0])}
                min={20}
                max={60}
                step={1}
                className="py-4"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {t("retirementAge")}
                </label>
                <span className={`font-bold ${isDarkMode ? "text-yellow-400" : "text-blue-600"}`}>{retirementAge}</span>
              </div>
              <Slider
                value={[retirementAge]}
                onValueChange={(val) => setRetirementAge(val[0])}
                min={45}
                max={70}
                step={1}
                className="py-4"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Lifestyle Cards */}
        <div className="mb-10">
          <h2 className={`text-2xl font-bold mb-6 text-center ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
            {t("lifestyleSelection")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lifestyles.map((lifestyle) => (
              <Card
                key={lifestyle.id}
                onClick={() => setSelectedLifestyle(lifestyle.id)}
                className={`cursor-pointer transition-all duration-300 border-2 overflow-hidden hover:scale-105 flex flex-col ${
                  selectedLifestyle === lifestyle.id
                    ? "border-yellow-400 ring-2 ring-yellow-400/20 scale-105"
                    : isDarkMode
                    ? "bg-gray-800 border-gray-700 grayscale hover:grayscale-0"
                    : "bg-white border-gray-100 grayscale hover:grayscale-0"
                }`}
              >
                <div className="p-6 text-center flex-1 flex flex-col items-center">
                  <div className="text-5xl mb-4">{lifestyle.image}</div>
                  <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? "text-yellow-200" : "text-gray-800"}`}>
                    {lifestyle.title}
                  </h3>
                  <p className={`text-xs mb-4 line-clamp-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {lifestyle.description}
                  </p>
                  
                  {lifestyle.id === "diy" ? (
                    <div className="mt-auto w-full space-y-2">
                      {selectedLifestyle === "diy" && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <Input
                            type="number"
                            value={customBudget}
                            onChange={(e) => setCustomBudget(Number(e.target.value))}
                            placeholder={t("enterCustomBudget")}
                            className={`h-8 text-center text-xs ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50"}`}
                          />
                        </div>
                      )}
                      <div className={`text-sm font-bold ${isDarkMode ? "text-yellow-400" : "text-blue-600"}`}>
                        {customBudget.toLocaleString()} {t("baht")}/{t("month")}
                      </div>
                    </div>
                  ) : (
                    <div className={`mt-auto text-sm font-bold ${isDarkMode ? "text-yellow-400" : "text-blue-600"}`}>
                      {t("monthlyBudget").replace("{amount}", lifestyle.budget.toLocaleString())}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Section 3: Summary Result */}
        <Card className={`mb-8 border-none ${isDarkMode ? "bg-indigo-950 text-white" : "bg-indigo-900 text-white shadow-xl"}`}>
          <CardContent className="pt-8 pb-10 text-center space-y-6">
            <div className="space-y-2">
              <p className="text-indigo-200">
                {t("retirementGoalResult").replace("{lifestyle}", selectedLifestyleData.title)}
              </p>
              <h2 className="text-5xl font-black text-yellow-400">
                {retirementFundNeeded.toLocaleString()} <span className="text-2xl">{t("baht")}</span>
              </h2>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-indigo-200 italic">
                {t("actionPlanSaving").replace("{amount}", Math.round(monthlySavingNoInvestment).toLocaleString())}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-lg">
                {t("actionPlanInvesting").replace("{rate}", investmentReturn.toString())}
              </p>
              <div className="bg-yellow-400 text-indigo-950 p-6 rounded-2xl inline-block shadow-lg">
                <p className="text-sm font-bold uppercase tracking-wider mb-1">{t("monthlyInvestmentRequired")}</p>
                <h3 className="text-4xl font-black">
                  {Math.round(monthlyInvestmentRequired).toLocaleString()} <span className="text-xl">{t("baht")}</span>
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Adjust Return */}
        <Card className={`border-2 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100 shadow-sm"}`}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-yellow-500" />
              <CardTitle className={`text-lg ${isDarkMode ? "text-yellow-200" : "text-gray-800"}`}>
                {t("adjustInvestmentReturn")}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 w-full space-y-4">
                <div className="flex justify-between">
                  <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {t("investmentReturnRate")}
                  </label>
                  <span className={`font-bold ${isDarkMode ? "text-yellow-400" : "text-blue-600"}`}>
                    {investmentReturn}%
                  </span>
                </div>
                <div className="flex gap-2">
                  {[2, 5, 8, 10].map((rate) => (
                    <Button
                      key={rate}
                      variant={investmentReturn === rate ? "default" : "outline"}
                      onClick={() => setInvestmentReturn(rate)}
                      className={`flex-1 ${
                        investmentReturn === rate
                          ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                          : isDarkMode
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {rate}%
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className={`p-4 rounded-lg text-sm flex-1 ${isDarkMode ? "bg-gray-900/50 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
                <p>
                  2%: {t("depositStyle")}<br/>
                  5%: {t("mixedFundStyle")}<br/>
                  8%: {t("stockStyle")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  )
}
