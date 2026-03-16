"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Home, Zap, Moon, Sun, TrendingDown, DollarSign, Calendar, Plus, Trash2 } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Footer } from "@/components/Footer"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface Habit {
  id: string
  name: string
  translationKey?: string
  amount: number
  isCustom?: boolean
}

export default function HabitConverterPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { t } = useLanguage()

  // Simulation State
  const [debtAmount, setDebtAmount] = useState(500000)
  const [interestRate, setInterestRate] = useState(15)
  const [monthlyPayment, setMonthlyPayment] = useState(15000)
  const [selectedHabits, setSelectedHabits] = useState<string[]>([])
  
  // Custom Habit State
  const [customHabitName, setCustomHabitName] = useState("")
  const [customHabitAmount, setCustomHabitAmount] = useState<number | "">("")

  const [habits, setHabits] = useState<Habit[]>([
    { id: "coffee", name: "ลดกาแฟ/ชานมไข่มุก 2 แก้ว/สัปดาห์", translationKey: "habitCoffee", amount: 800 },
    { id: "lottery", name: "ลดซื้อหวย/สลากลงครึ่งหนึ่ง", translationKey: "habitLottery", amount: 1000 },
    { id: "delivery", name: "ลดสั่ง Delivery เปลี่ยนมาทำเอง 3 มื้อ/สัปดาห์", translationKey: "habitDelivery", amount: 1200 },
    { id: "streaming", name: "ยกเลิกแอปสตรีมมิ่งที่ไม่ได้ใช้งาน", translationKey: "habitStreaming", amount: 200 },
  ])

  const extraSaving = selectedHabits.reduce((sum, habitId) => {
    const habit = habits.find((h) => h.id === habitId)
    return sum + (habit?.amount || 0)
  }, 0)

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode))
    }
    
    // Load custom habits if any
    const savedHabits = localStorage.getItem("customHabits")
    if (savedHabits) {
      const parsed = JSON.parse(savedHabits)
      setHabits(prev => [...prev, ...parsed])
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

  const toggleHabit = (habitId: string) => {
    setSelectedHabits((prev) =>
      prev.includes(habitId) ? prev.filter((id) => id !== habitId) : [...prev, habitId]
    )
  }

  const addCustomHabit = () => {
    if (!customHabitName || !customHabitAmount) return

    const newHabit: Habit = {
      id: `custom-${Date.now()}`,
      name: customHabitName,
      amount: Number(customHabitAmount),
      isCustom: true,
    }

    const updatedHabits = [...habits, newHabit]
    setHabits(updatedHabits)
    
    // Save only custom habits to localStorage
    const customOnly = updatedHabits.filter(h => h.isCustom)
    localStorage.setItem("customHabits", JSON.stringify(customOnly))

    // Clear inputs
    setCustomHabitName("")
    setCustomHabitAmount("")
    
    // Auto-select the new habit
    setSelectedHabits(prev => [...prev, newHabit.id])
  }

  const removeHabit = (id: string) => {
    const updatedHabits = habits.filter(h => h.id !== id)
    setHabits(updatedHabits)
    setSelectedHabits(prev => prev.filter(hid => hid !== id))
    
    const customOnly = updatedHabits.filter(h => h.isCustom)
    localStorage.setItem("customHabits", JSON.stringify(customOnly))
  }

  // Calculation Logic
  const calculatePayoff = (extra: number) => {
    let balance = debtAmount
    const monthlyRate = interestRate / 100 / 12
    const payment = monthlyPayment + extra
    const data = []
    let month = 0
    let totalInterest = 0

    data.push({ month: 0, balance: Math.round(balance) })

    while (balance > 0 && month < 360) { // Max 30 years
      month++
      const interest = balance * monthlyRate
      totalInterest += interest
      balance = balance + interest - payment
      
      if (balance < 0) balance = 0
      
      data.push({ month, balance: Math.round(balance) })
      if (balance === 0) break
    }

    return { data, months: month, totalInterest: Math.round(totalInterest) }
  }

  const original = calculatePayoff(0)
  const improved = calculatePayoff(extraSaving)

  const timeSaved = original.months - improved.months
  const interestSaved = original.totalInterest - improved.totalInterest

  // Combine data for chart
  const chartData = original.data.map((d, i) => ({
    month: d.month,
    originalBalance: d.balance,
    improvedBalance: improved.data[i] ? improved.data[i].balance : 0,
  }))

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
            <h2 className="text-xl font-bold hidden md:block">The 1% Habit Converter</h2>
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

        {/* Hero Concept */}
        <div className="text-center mb-12">
          <div className={`inline-flex p-4 rounded-3xl mb-6 ${isDarkMode ? "bg-yellow-500/20" : "bg-yellow-100"}`}>
            <Zap className={`w-12 h-12 ${isDarkMode ? "text-yellow-400" : "text-yellow-600"} fill-current`} />
          </div>
          <h1 className={`text-4xl md:text-5xl font-black mb-4 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
            {t("habitConverterTitle")}
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            เปลี่ยนนิสัยการใช้เงินเล็กๆ น้อยๆ ให้เป็น <span className="font-bold text-yellow-500">"พลังวิเศษ"</span> ในการปลดแอกตัวเองจากหนี้สิน
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls & Inputs */}
          <div className="lg:col-span-1 space-y-6">
            <div className={`p-6 rounded-3xl border-2 ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-yellow-500" />
                ตั้งค่าหนี้ของคุณ (จำลอง)
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm opacity-70 mb-1 block">ยอดหนี้คงเหลือ (บาท)</label>
                  <input 
                    type="number" 
                    value={debtAmount} 
                    onChange={(e) => setDebtAmount(Number(e.target.value))}
                    className={`w-full p-3 rounded-xl border-2 outline-none focus:border-yellow-500 transition-all ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                  />
                </div>
                <div>
                  <label className="text-sm opacity-70 mb-1 block">อัตราดอกเบี้ยต่อปี (%)</label>
                  <input 
                    type="number" 
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className={`w-full p-3 rounded-xl border-2 outline-none focus:border-yellow-500 transition-all ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                  />
                </div>
                <div>
                  <label className="text-sm opacity-70 mb-1 block">ยอดผ่อนต่อเดือน (บาท)</label>
                  <input 
                    type="number" 
                    value={monthlyPayment} 
                    onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                    className={`w-full p-3 rounded-xl border-2 outline-none focus:border-yellow-500 transition-all ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                  />
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border-2 ${isDarkMode ? "bg-gray-800/50 border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.05)]" : "bg-yellow-50/50 border-yellow-200"}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                เลือกพลังวิเศษของคุณ
              </h3>
              
              <div className="space-y-3 mb-6">
                {habits.map((habit) => (
                  <div 
                    key={habit.id} 
                    className={`flex items-center space-x-3 p-3 rounded-2xl border-2 transition-all cursor-pointer group ${
                      selectedHabits.includes(habit.id) 
                        ? (isDarkMode ? "bg-yellow-500/20 border-yellow-500" : "bg-yellow-100 border-yellow-400")
                        : (isDarkMode ? "bg-gray-900/50 border-transparent hover:border-gray-700" : "bg-white border-transparent hover:border-gray-200 shadow-sm")
                    }`}
                    onClick={() => toggleHabit(habit.id)}
                  >
                    <Checkbox 
                      id={habit.id} 
                      checked={selectedHabits.includes(habit.id)}
                      onCheckedChange={() => toggleHabit(habit.id)}
                      className="border-yellow-500 data-[state=checked]:bg-yellow-500"
                    />
                    <Label 
                      htmlFor={habit.id} 
                      className={`flex-1 cursor-pointer font-bold ${isDarkMode ? "text-yellow-50" : "text-gray-700"}`}
                    >
                      {habit.translationKey ? t(habit.translationKey as any) : habit.name}
                      <span className="block text-xs opacity-60 font-normal">ประหยัดได้ {habit.amount.toLocaleString()}.-</span>
                    </Label>
                    
                    {habit.isCustom && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeHabit(habit.id); }}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Custom Habit Form */}
              <div className={`p-4 rounded-2xl border-2 border-dashed ${isDarkMode ? "bg-gray-900/30 border-gray-700" : "bg-white border-gray-300"}`}>
                <p className="text-xs font-bold mb-3 opacity-60 uppercase tracking-wider">เพิ่มพลังวิเศษของคุณเอง</p>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="เช่น ลดค่าบุหรี่, เดินไปทำงาน" 
                    value={customHabitName}
                    onChange={(e) => setCustomHabitName(e.target.value)}
                    className={`w-full p-2 text-sm rounded-xl outline-none border-2 focus:border-yellow-500 transition-all ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                  />
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="ยอดประหยัด/เดือน" 
                      value={customHabitAmount}
                      onChange={(e) => setCustomHabitAmount(e.target.value === "" ? "" : Number(e.target.value))}
                      className={`flex-1 p-2 text-sm rounded-xl outline-none border-2 focus:border-yellow-500 transition-all ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                    />
                    <button 
                      onClick={addCustomHabit}
                      disabled={!customHabitName || !customHabitAmount}
                      className={`p-2 rounded-xl transition-all ${!customHabitName || !customHabitAmount ? "opacity-50 grayscale cursor-not-allowed bg-gray-700" : "bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20"}`}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization & Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* Real-time Graph */}
            <div className={`p-8 rounded-[2.5rem] border-2 h-[450px] relative ${isDarkMode ? "bg-gray-800/30 border-gray-700" : "bg-white border-gray-200 shadow-xl"}`}>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black">กราฟจำลองการปลดหนี้</h3>
                <div className="flex gap-4 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span>แบบเดิม</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-500">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>ใช้พลังวิเศษ</span>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorOriginal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorImproved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    hide 
                  />
                  <YAxis 
                    stroke={isDarkMode ? "#94a3b8" : "#64748b"}
                    tickFormatter={(value) => `฿${(value / 1000)}k`}
                    width={60}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", 
                      borderRadius: "16px", 
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                    }}
                    labelFormatter={(label) => `เดือนที่ ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="originalBalance" 
                    stroke="#94a3b8" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorOriginal)" 
                    name="ยอดหนี้แบบเดิม"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="improvedBalance" 
                    stroke="#eab308" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorImproved)" 
                    name="ยอดหนี้พลังวิเศษ"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-3xl border-2 flex items-center gap-6 ${isDarkMode ? "bg-green-500/10 border-green-500/20" : "bg-green-50 border-green-200"}`}>
                <div className={`p-4 rounded-2xl ${isDarkMode ? "bg-green-500 text-black" : "bg-green-500 text-white"}`}>
                  <Calendar className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm opacity-70">หมดหนี้ไวขึ้น</p>
                  <p className={`text-3xl font-black ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                    {Math.floor(timeSaved / 12)} ปี {timeSaved % 12} เดือน
                  </p>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border-2 flex items-center gap-6 ${isDarkMode ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-200"}`}>
                <div className={`p-4 rounded-2xl ${isDarkMode ? "bg-blue-500 text-black" : "bg-blue-500 text-white"}`}>
                  <TrendingDown className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm opacity-70">ประหยัดดอกเบี้ยได้</p>
                  <p className={`text-3xl font-black ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                    ฿{interestSaved.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Dynamic Success Message */}
            {extraSaving > 0 && (
              <div className={`p-8 rounded-[2.5rem] text-center border-4 animate-in zoom-in duration-500 ${isDarkMode ? "bg-yellow-500 text-black border-yellow-400" : "bg-yellow-400 text-black border-yellow-500 shadow-2xl"}`}>
                <p className="text-3xl font-black mb-4">เยี่ยมมาก! 🎉</p>
                <p className="text-xl font-bold leading-relaxed">
                  แค่ปรับพฤติกรรมนิดหน่อย คุณจะประหยัดดอกเบี้ยได้ <span className="underline decoration-black/30 underline-offset-4">{interestSaved.toLocaleString()}</span> บาท 
                  และหมดหนี้ไวขึ้นถึง <span className="underline decoration-black/30 underline-offset-4">{Math.floor(timeSaved / 12)} ปี {timeSaved % 12} เดือน</span>!
                </p>
                <button 
                  onClick={() => router.push("/money-planning")}
                  className="mt-8 px-10 py-4 bg-black text-white font-black rounded-2xl hover:scale-105 transition-transform"
                >
                  เริ่มวางแผนจริงจังเลย!
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  )
}
