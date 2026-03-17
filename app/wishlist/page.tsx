"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Gamepad2, 
  Coins, 
  Flame, 
  Trophy, 
  Plus, 
  Image as ImageIcon,
  Sparkles,
  Trash2
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Footer } from "@/components/Footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function WishlistPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { t } = useLanguage()

  // App State
  const [hasGoal, setHasGoal] = useState(false)
  const [itemName, setItemName] = useState("")
  const [itemPrice, setItemPrice] = useState(0)
  const [allowance, setAllowance] = useState(0)
  const [selectedEmoji, setSelectedEmoji] = useState("🎮")
  
  // Progress State
  const [savedAmount, setSavedAmount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lastSavedDate, setLastSavedDate] = useState<string | null>(null)
  const [isAnimating, setIsDarkModeAnimating] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const emojis = ["🎮", "👟", "🐷", "🎸", "📱", "💻", "👗", "🚲", "✈️", "🍕"]

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode) setIsDarkMode(JSON.parse(savedMode))
    
    // Load wishlist data
    const savedWishlist = localStorage.getItem("wishlist_goal")
    if (savedWishlist) {
      const data = JSON.parse(savedWishlist)
      setItemName(data.name)
      setItemPrice(data.price)
      setAllowance(data.allowance)
      setSelectedEmoji(data.emoji)
      setSavedAmount(data.saved || 0)
      setStreak(data.streak || 0)
      setLastSavedDate(data.lastSaved || null)
      setHasGoal(true)
    }
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode))
  }, [isDarkMode])

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  const handleCreateGoal = () => {
    if (!itemName || itemPrice <= 0 || allowance <= 0) return
    
    const goalData = {
      name: itemName,
      price: itemPrice,
      allowance: allowance,
      emoji: selectedEmoji,
      saved: 0,
      streak: 0,
      lastSaved: null
    }
    localStorage.setItem("wishlist_goal", JSON.stringify(goalData))
    setHasGoal(true)
  }

  const handleDeleteGoal = () => {
    if (confirm("Are you sure you want to delete this goal? All progress will be lost!")) {
      localStorage.removeItem("wishlist_goal")
      setHasGoal(false)
      setSavedAmount(0)
      setStreak(0)
      setItemName("")
      setItemPrice(0)
      setAllowance(0)
    }
  }

  const handleDropMoney = () => {
    const today = new Date().toDateString()
    if (lastSavedDate === today) {
      alert("You've already saved for today! See you tomorrow! ✨")
      return
    }

    // Calculate daily saving based on path (we'll use middle path as default for this button)
    const dailySaving = allowance * 0.5 
    const newAmount = Math.min(savedAmount + dailySaving, itemPrice)
    
    // Streak logic
    let newStreak = streak + 1
    if (lastSavedDate) {
      const lastDate = new Date(lastSavedDate)
      const yesterday = new Date()
      yesterday.setDate(new Date().getDate() - 1)
      
      if (lastDate.toDateString() !== yesterday.toDateString() && lastDate.toDateString() !== today) {
        newStreak = 1 // Reset streak if missed a day
      }
    }

    setSavedAmount(newAmount)
    setStreak(newStreak)
    setLastSavedDate(today)
    
    // Animation
    setIsDarkModeAnimating(true)
    setTimeout(() => setIsDarkModeAnimating(false), 1000)
    
    if (newAmount >= itemPrice) {
      setShowCelebration(true)
    }

    // Save to local storage
    const goalData = {
      name: itemName,
      price: itemPrice,
      allowance: allowance,
      emoji: selectedEmoji,
      saved: newAmount,
      streak: newStreak,
      lastSaved: today
    }
    localStorage.setItem("wishlist_goal", JSON.stringify(goalData))
  }

  const calculateDays = (percent: number) => {
    const dailySaving = allowance * percent
    if (dailySaving <= 0) return 0
    return Math.ceil(itemPrice / dailySaving)
  }

  const progressPercent = itemPrice > 0 ? (savedAmount / itemPrice) * 100 : 0

  return (
    <div className={`min-h-screen font-sans transition-all duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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

          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-xl transition-all ${
              isDarkMode ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : "bg-white border text-gray-600 shadow-sm"
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {!hasGoal ? (
          /* Goal Setup Section */
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center">
              <h1 className={`text-4xl md:text-5xl font-black mb-4 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
                {t("wishlistTitle" as any)}
              </h1>
              <p className={`text-xl opacity-80 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {t("wishlistDescription" as any)}
              </p>
            </div>

            <Card className={`p-8 rounded-[2.5rem] border-4 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Profile Creation UI */}
                <div className="space-y-6 flex flex-col items-center justify-center border-r-0 md:border-r border-dashed border-gray-600 pr-0 md:pr-12">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-2xl relative group cursor-pointer border-4 ${isDarkMode ? "bg-gray-700 border-yellow-500/50" : "bg-yellow-100 border-yellow-400"}`}>
                    {selectedEmoji}
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {emojis.map(e => (
                      <button 
                        key={e} 
                        onClick={() => setSelectedEmoji(e)}
                        className={`text-2xl p-2 rounded-lg hover:bg-yellow-500/20 transition-all ${selectedEmoji === e ? "scale-125 ring-2 ring-yellow-500" : "opacity-50"}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest opacity-70">{t("itemName" as any)}</label>
                    <Input 
                      placeholder={t("itemPlaceholder" as any)} 
                      value={itemName}
                      onChange={e => setItemName(e.target.value)}
                      className="text-lg py-6 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest opacity-70">{t("itemPrice" as any)}</label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={itemPrice || ""}
                      onChange={e => setItemPrice(Number(e.target.value))}
                      className="text-lg py-6 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest opacity-70">{t("dailyAllowance" as any)}</label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      value={allowance || ""}
                      onChange={e => setAllowance(Number(e.target.value))}
                      className="text-lg py-6 rounded-2xl"
                    />
                  </div>
                  <Button 
                    onClick={handleCreateGoal}
                    className="w-full py-8 text-xl font-black rounded-2xl shadow-xl hover:scale-105 transition-transform bg-yellow-500 text-black hover:bg-yellow-400"
                  >
                    {t("createGoal" as any)}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* Dashboard Section */
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black flex items-center gap-2">
                  <span className="text-5xl">{selectedEmoji}</span>
                  {itemName}
                </h1>
                <p className="opacity-70 text-lg">Goal: ฿{itemPrice.toLocaleString()}</p>
              </div>
              <button 
                onClick={handleDeleteGoal}
                className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>

            {/* Streak & Burn */}
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-xl shadow-lg ${streak > 0 ? "bg-orange-500 text-white animate-pulse" : "bg-gray-700 text-gray-500"}`}>
                <Flame className={`w-6 h-6 ${streak > 0 ? "fill-current" : ""}`} />
                {t("streakDays" as any).replace("{days}", streak.toString())}
              </div>
              {streak >= 5 && (
                <div className="bg-yellow-500 text-black px-6 py-3 rounded-full font-black text-xl flex items-center gap-2 shadow-lg">
                  <Trophy className="w-6 h-6" />
                  PRO SAVER
                </div>
              )}
            </div>

            {/* Progress Bar (Gaming Style) */}
            <Card className={`p-8 rounded-[2.5rem] border-4 shadow-2xl relative overflow-hidden ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xl font-bold">
                    {t("savingProgress" as any)
                      .replace("{current}", savedAmount.toLocaleString())
                      .replace("{target}", itemPrice.toLocaleString())
                      .replace("{percent}", Math.round(progressPercent).toString())}
                  </p>
                  <Sparkles className={`w-8 h-8 text-yellow-400 ${isAnimating ? "animate-bounce" : ""}`} />
                </div>
                
                <div className="h-12 w-full bg-gray-700 rounded-full p-2 shadow-inner border-2 border-black/20">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_20px_rgba(234,179,8,0.5)] ${
                      progressPercent === 100 ? "bg-green-500" : "bg-yellow-500"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={handleDropMoney}
                    disabled={savedAmount >= itemPrice}
                    className={`group py-10 px-12 text-2xl font-black rounded-3xl shadow-[0_10px_0_0_#ca8a04] active:shadow-none active:translate-y-2 transition-all ${
                      isDarkMode ? "bg-yellow-500 text-black hover:bg-yellow-400" : "bg-yellow-400 text-black hover:bg-yellow-300"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Coins className={`w-8 h-8 group-hover:rotate-12 transition-transform ${isAnimating ? "animate-ping" : ""}`} />
                      {t("dropIntoPiggy" as any)}
                    </div>
                  </Button>
                </div>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Gamepad2 className="w-64 h-64 rotate-12" />
              </div>
            </Card>

            {/* Path Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className={`p-6 rounded-3xl border-2 transition-all hover:scale-105 ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
                <Badge className="mb-4 bg-blue-500">{t("chillPath" as any)}</Badge>
                <p className="text-sm opacity-70 mb-4">{t("chillPathDesc" as any)}</p>
                <p className="text-xl font-black text-blue-400">
                  {t("daysToGoal" as any).replace("{days}", calculateDays(0.2).toString())}
                </p>
                <p className="text-xs mt-2 opacity-50">฿{(allowance * 0.2).toFixed(0)} / Day</p>
              </Card>

              <Card className={`p-6 rounded-3xl border-4 border-yellow-500/50 transition-all hover:scale-105 ${isDarkMode ? "bg-gray-800/50" : "bg-yellow-50"}`}>
                <Badge className="mb-4 bg-yellow-500 text-black">{t("walkPath" as any)}</Badge>
                <p className="text-sm opacity-70 mb-4">{t("walkPathDesc" as any)}</p>
                <p className="text-xl font-black text-yellow-500">
                  {t("daysToGoal" as any).replace("{days}", calculateDays(0.5).toString())}
                </p>
                <p className="text-xs mt-2 opacity-50">฿{(allowance * 0.5).toFixed(0)} / Day</p>
              </Card>

              <Card className={`p-6 rounded-3xl border-2 transition-all hover:scale-105 ${isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"}`}>
                <Badge className="mb-4 bg-orange-500">{t("racePath" as any)}</Badge>
                <p className="text-sm opacity-70 mb-4">{t("racePathDesc" as any)}</p>
                <p className="text-xl font-black text-orange-400">
                  {t("daysToGoal" as any).replace("{days}", calculateDays(0.8).toString())}
                </p>
                <p className="text-xs mt-2 opacity-50">฿{(allowance * 0.8).toFixed(0)} / Day</p>
              </Card>
            </div>

            {/* Streak Message */}
            {streak > 0 && (
              <div className={`p-6 rounded-3xl flex gap-4 items-center ${isDarkMode ? "bg-orange-500/10 text-orange-200" : "bg-orange-50 text-orange-800"}`}>
                <Sparkles className="w-8 h-8 text-orange-500 shrink-0" />
                <p className="leading-relaxed font-medium">
                  {t("streakMessage" as any).replace("{days}", streak.toString())}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
          <Card className="p-12 text-center space-y-6 max-w-lg bg-gray-800 border-4 border-yellow-500 rounded-[3rem]">
            <div className="text-8xl animate-bounce">🎉</div>
            <h2 className="text-4xl font-black text-yellow-400">MISSION COMPLETE!</h2>
            <p className="text-xl">
              You finally got enough for <span className="font-bold text-white">{itemName}</span>!
            </p>
            <Button 
              onClick={() => setShowCelebration(false)}
              className="bg-yellow-500 text-black font-black py-6 px-12 text-xl rounded-full"
            >
              GGWP! 🎮
            </Button>
          </Card>
        </div>
      )}

      <Footer isDarkMode={isDarkMode} />
    </div>
  )
}
