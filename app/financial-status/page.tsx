"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Moon, Sun, TrendingUp, Wallet, Home, Car, CreditCard, PiggyBank, Building } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Footer } from "@/components/Footer"

interface AssetItem {
  id: string
  name: string
  category: string
  amount: number
  iconType: string
}

interface LiabilityItem {
  id: string
  name: string
  category: string
  amount: number
  interestRate: number
  iconType: string
}

export default function FinancialStatusPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [assets, setAssets] = useState<AssetItem[]>([
    { id: "1", name: "บ้านพักอาศัย", category: "อสังหาริมทรัพย์", amount: 1800000, iconType: "home" },
    { id: "2", name: "รถยนต์", category: "ยานพาหนะ", amount: 450000, iconType: "car" },
    { id: "3", name: "เงินฝากธนาคาร", category: "เงินสด", amount: 120000, iconType: "piggybank" },
    { id: "4", name: "กองทุนรวม", category: "การลงทุน", amount: 80000, iconType: "building" },
  ])

  const [liabilities, setLiabilities] = useState<LiabilityItem[]>([
    { id: "1", name: "สินเชื่อบ้าน", category: "สินเชื่อระยะยาว", amount: 750000, interestRate: 3.5, iconType: "home" },
    { id: "2", name: "สินเชื่อรถยนต์", category: "สินเชื่อระยะกลาง", amount: 65000, interestRate: 5.2, iconType: "car" },
    { id: "3", name: "บัตรเครดิต", category: "สินเชื่อระยะสั้น", amount: 35000, interestRate: 18, iconType: "creditcard" },
  ])

  const { t } = useLanguage()

  // Helper function to get icon component from iconType string
  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case "home":
        return Home
      case "car":
        return Car
      case "piggybank":
        return PiggyBank
      case "building":
        return Building
      case "creditcard":
        return CreditCard
      case "wallet":
      default:
        return Wallet
    }
  }

  // Helper function to determine icon type from category and name
  const getIconTypeForAsset = (category: string, name: string) => {
    if (name.includes("บ้าน") || category.includes("อสังหา")) return "home"
    if (name.includes("รถ") || category.includes("ยานพาหนะ")) return "car"
    if (name.includes("เงินฝาก") || name.includes("เงินสด") || category.includes("เงินสด")) return "piggybank"
    if (name.includes("กองทุน") || name.includes("หุ้น") || category.includes("การลงทุน")) return "building"
    return "wallet"
  }

  const getIconTypeForLiability = (category: string, name: string) => {
    if (name.includes("บ้าน") || name.includes("สินเชื่อบ้าน")) return "home"
    if (name.includes("รถ") || name.includes("สินเชื่อรถ")) return "car"
    if (name.includes("บัตรเครดิต") || name.includes("บัตร")) return "creditcard"
    return "creditcard"
  }

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode))
    }

    // Load saved financial status data
    const savedFinancialStatusData = localStorage.getItem("financialStatusData")
    if (savedFinancialStatusData) {
      const parsedData = JSON.parse(savedFinancialStatusData)
      if (parsedData.assets) {
        // Ensure iconType is set for loaded assets
        const assetsWithIconType = parsedData.assets.map((asset: any) => ({
          ...asset,
          iconType: asset.iconType || getIconTypeForAsset(asset.category, asset.name),
        }))
        setAssets(assetsWithIconType)
      }
      if (parsedData.liabilities) {
        // Ensure iconType is set for loaded liabilities
        const liabilitiesWithIconType = parsedData.liabilities.map((liability: any) => ({
          ...liability,
          iconType: liability.iconType || getIconTypeForLiability(liability.category, liability.name),
        }))
        setLiabilities(liabilitiesWithIconType)
      }
    }
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Save financial status data whenever assets or liabilities change
  useEffect(() => {
    const totalAssets = assets.reduce((sum, asset) => sum + asset.amount, 0)
    const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0)
    const netWorth = totalAssets - totalLiabilities

    const financialStatusData = {
      assets,
      liabilities,
      totalAssets,
      totalLiabilities,
      netWorth,
      lastUpdated: new Date().toISOString(),
    }

    localStorage.setItem("financialStatusData", JSON.stringify(financialStatusData))
  }, [assets, liabilities])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    localStorage.setItem("darkMode", JSON.stringify(!isDarkMode))
  }

  const handleBack = () => {
    router.push("/goals")
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  const goToFinancialPlanning = () => {
    router.push("/planning")
  }

  const totalAssets = assets.reduce((sum, asset) => sum + asset.amount, 0)
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0)
  const netWorth = totalAssets - totalLiabilities

  const addAsset = () => {
    const newAsset: AssetItem = {
      id: Date.now().toString(),
      name: "รายการใหม่",
      category: "อื่นๆ",
      amount: 0,
      iconType: "wallet",
    }
    setAssets([...assets, newAsset])
  }

  const addLiability = () => {
    const newLiability: LiabilityItem = {
      id: Date.now().toString(),
      name: "รายการใหม่",
      category: "อื่นๆ",
      amount: 0,
      interestRate: 0,
      iconType: "creditcard",
    }
    setLiabilities([...liabilities, newLiability])
  }

  const updateAsset = (id: string, field: keyof AssetItem, value: any) => {
    setAssets(
      assets.map((asset) => {
        if (asset.id === id) {
          const updatedAsset = { ...asset, [field]: value }
          // Update iconType when name or category changes
          if (field === "name" || field === "category") {
            updatedAsset.iconType = getIconTypeForAsset(
              field === "category" ? value : asset.category,
              field === "name" ? value : asset.name,
            )
          }
          return updatedAsset
        }
        return asset
      }),
    )
  }

  const updateLiability = (id: string, field: keyof LiabilityItem, value: any) => {
    setLiabilities(
      liabilities.map((liability) => {
        if (liability.id === id) {
          const updatedLiability = { ...liability, [field]: value }
          // Update iconType when name or category changes
          if (field === "name" || field === "category") {
            updatedLiability.iconType = getIconTypeForLiability(
              field === "category" ? value : liability.category,
              field === "name" ? value : liability.name,
            )
          }
          return updatedLiability
        }
        return liability
      }),
    )
  }

  const deleteAsset = (id: string) => {
    setAssets(assets.filter((asset) => asset.id !== id))
  }

  const deleteLiability = (id: string) => {
    setLiabilities(liabilities.filter((liability) => liability.id !== id))
  }

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-8 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
              isDarkMode
                ? "text-yellow-200 hover:bg-gray-800 border border-gray-700"
                : "text-gray-600 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToEdit")}
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToHome}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                isDarkMode
                  ? "text-yellow-200 hover:bg-gray-800 border border-gray-700"
                  : "text-gray-600 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              <Home className="w-4 h-4" />
              {t("backToHome")}
            </button>

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

        {/* Title */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
            {t("financialStatusTitle")}
          </h1>
          <p className={`text-lg ${isDarkMode ? "text-yellow-200" : "text-gray-600"}`}>
            {t("financialStatusSubtitle")}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Assets */}
          <div
            className={`p-6 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-semibold ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
                {t("totalAssets")}
              </h3>
              <Wallet className={`w-5 h-5 ${isDarkMode ? "text-yellow-400" : "text-gray-600"}`} />
            </div>
            <p className={`text-3xl font-bold mb-1 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
              ฿{totalAssets.toLocaleString()}
            </p>
          </div>

          {/* Total Liabilities */}
          <div
            className={`p-6 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-semibold ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
                {t("totalLiabilities")}
              </h3>
              <CreditCard className={`w-5 h-5 ${isDarkMode ? "text-yellow-400" : "text-gray-600"}`} />
            </div>
            <p className={`text-3xl font-bold mb-1 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
              ฿{totalLiabilities.toLocaleString()}
            </p>
          </div>

          {/* Net Worth */}
          <div
            className={`p-6 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-lg font-semibold ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
                {t("netWorth")}
              </h3>
              <TrendingUp className={`w-5 h-5 ${isDarkMode ? "text-yellow-400" : "text-gray-600"}`} />
            </div>
            <p className={`text-3xl font-bold mb-1 ${netWorth >= 0 ? "text-green-500" : "text-red-500"}`}>
              ฿{netWorth.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Assets Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>{t("assets")}</h2>
            <button
              onClick={addAsset}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isDarkMode ? "bg-green-600 text-white hover:bg-green-700" : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              + {t("addItem")}
            </button>
          </div>

          <div className={`rounded-lg border overflow-hidden ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
            <table className="w-full">
              <thead className={`${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                <tr>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                  >
                    {t("item")}
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                  >
                    {t("category")}
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-sm font-semibold ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                  >
                    {t("value")}
                  </th>
                  <th
                    className={`px-6 py-3 text-center text-sm font-semibold ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                  >
                    {t("management")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => {
                  const IconComponent = getIconComponent(asset.iconType)
                  return (
                    <tr key={asset.id} className={`border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-5 h-5 ${isDarkMode ? "text-yellow-400" : "text-gray-600"}`} />
                          <input
                            type="text"
                            value={asset.name}
                            onChange={(e) => updateAsset(asset.id, "name", e.target.value)}
                            className={`font-medium px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
                              isDarkMode
                                ? "bg-gray-800 border-gray-600 text-yellow-200 focus:ring-yellow-400"
                                : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                            }`}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={asset.category}
                          onChange={(e) => updateAsset(asset.id, "category", e.target.value)}
                          className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-gray-300 focus:ring-yellow-400"
                              : "bg-white border-gray-300 text-gray-600 focus:ring-blue-500"
                          }`}
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <input
                          type="number"
                          value={asset.amount}
                          onChange={(e) => updateAsset(asset.id, "amount", Number(e.target.value))}
                          className={`text-right px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 font-semibold ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-yellow-200 focus:ring-yellow-400"
                              : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                          }`}
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => deleteAsset(asset.id)}
                            className={`p-1 rounded hover:bg-red-100 ${isDarkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-600"}`}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Liabilities Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
              {t("liabilities")}
            </h2>
            <button
              onClick={addLiability}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isDarkMode ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              + {t("addItem")}
            </button>
          </div>

          <div className={`rounded-lg border overflow-hidden ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
            <table className="w-full">
              <thead className={`${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                <tr>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                  >
                    {t("item")}
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                  >
                    {t("category")}
                  </th>
                  <th
                    className={`px-6 py-3 text-right text-sm font-semibold ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                  >
                    {t("remainingValue")}
                  </th>
                  <th
                    className={`px-6 py-3 text-center text-sm font-semibold ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                  >
                    {t("interestRate")}
                  </th>
                  <th
                    className={`px-6 py-3 text-center text-sm font-semibold ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                  >
                    {t("management")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {liabilities.map((liability) => {
                  const IconComponent = getIconComponent(liability.iconType)
                  return (
                    <tr key={liability.id} className={`border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-5 h-5 ${isDarkMode ? "text-yellow-400" : "text-gray-600"}`} />
                          <input
                            type="text"
                            value={liability.name}
                            onChange={(e) => updateLiability(liability.id, "name", e.target.value)}
                            className={`font-medium px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
                              isDarkMode
                                ? "bg-gray-800 border-gray-600 text-yellow-200 focus:ring-yellow-400"
                                : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                            }`}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={liability.category}
                          onChange={(e) => updateLiability(liability.id, "category", e.target.value)}
                          className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-gray-300 focus:ring-yellow-400"
                              : "bg-white border-gray-300 text-gray-600 focus:ring-blue-500"
                          }`}
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <input
                          type="number"
                          value={liability.amount}
                          onChange={(e) => updateLiability(liability.id, "amount", Number(e.target.value))}
                          className={`text-right px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 font-semibold ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-yellow-200 focus:ring-yellow-400"
                              : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                          }`}
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          step="0.1"
                          value={liability.interestRate}
                          onChange={(e) => updateLiability(liability.id, "interestRate", Number(e.target.value))}
                          className={`text-center px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 w-20 ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-600 text-gray-300 focus:ring-yellow-400"
                              : "bg-white border-gray-300 text-gray-600 focus:ring-blue-500"
                          }`}
                        />
                        %
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => deleteLiability(liability.id)}
                            className={`p-1 rounded hover:bg-red-100 ${isDarkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-600"}`}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={goToFinancialPlanning}
            className={`px-8 py-3 text-lg font-semibold rounded-md transition-all duration-200 ${
              isDarkMode ? "bg-yellow-500 text-black hover:bg-yellow-400" : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {t("planFinancialFuture")}
          </button>
        </div>
      </div>
      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  )
}
