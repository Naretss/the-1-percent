"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Download,
  Share2,
  Heart,
  Home,
  Briefcase,
  DollarSign,
  BookOpen,
  Users,
  FileText,
  Wallet,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Building,
  Car,
  Sun,
  Moon,
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Footer } from "@/components/Footer"

const dimensionIcons = {
  1: Heart,
  2: Home,
  3: Briefcase,
  4: DollarSign,
  5: BookOpen,
  6: Users,
}

interface PlanData {
  startYear: string
  endYear: string
  createdAt: string
  dimensions: Array<{
    id: number
    name: string
    goal: string
    reason: string
    timeline: string
  }>
}

interface FinancialData {
  months: number
  startingMonth?: number
  monthNames?: string[]
  rows: Array<{
    id: string
    name: string
    type: "income" | "expense" | "summary"
    isEditable: boolean
    values: number[]
    total: number
  }>
  totalRemaining: number
  createdAt: string
}

interface AssetItem {
  id: string
  name: string
  category: string
  amount: number
  icon: any
}

interface LiabilityItem {
  id: string
  name: string
  category: string
  amount: number
  interestRate: number
  icon: any
}

interface FinancialStatusData {
  assets: AssetItem[]
  liabilities: LiabilityItem[]
  totalAssets: number
  totalLiabilities: number
  netWorth: number
  lastUpdated?: string
}

export default function ReportPage() {
  const router = useRouter()
  const [planData, setPlanData] = useState<PlanData | null>(null)
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [financialStatusData, setFinancialStatusData] = useState<FinancialStatusData | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const { t } = useLanguage()

  // Thai month names
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ]

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode))
    }

    // Load all datasets
    const savedPlanData = localStorage.getItem("financialPlanData")
    const savedFinancialData = localStorage.getItem("financialPlanningData")
    const savedFinancialStatusData = localStorage.getItem("financialStatusData")

    if (savedPlanData) {
      setPlanData(JSON.parse(savedPlanData))
    }

    if (savedFinancialData) {
      const parsedFinancialData = JSON.parse(savedFinancialData)

      // If monthNames don't exist, generate them from startingMonth
      if (!parsedFinancialData.monthNames && parsedFinancialData.startingMonth) {
        const monthNames = []
        for (let i = 0; i < parsedFinancialData.months; i++) {
          const monthIndex = (parsedFinancialData.startingMonth - 1 + i) % 12
          monthNames.push(thaiMonths[monthIndex])
        }
        parsedFinancialData.monthNames = monthNames
      }

      setFinancialData(parsedFinancialData)
    }

    // Load financial status data - prioritize saved data
    if (savedFinancialStatusData) {
      const parsedStatusData = JSON.parse(savedFinancialStatusData)

      // Ensure icons are properly set for assets and liabilities
      const assetsWithIcons =
        parsedStatusData.assets?.map((asset: any) => ({
          ...asset,
          icon: getIconForAsset(asset.category, asset.name),
        })) || []

      const liabilitiesWithIcons =
        parsedStatusData.liabilities?.map((liability: any) => ({
          ...liability,
          icon: getIconForLiability(liability.category, liability.name),
        })) || []

      setFinancialStatusData({
        ...parsedStatusData,
        assets: assetsWithIcons,
        liabilities: liabilitiesWithIcons,
      })
    } else {
      // Create default financial status data if not exists
      const defaultAssets = [
        { id: "1", name: "บ้านพักอาศัย", category: "อสังหาริมทรัพย์", amount: 1800000, icon: Home },
        { id: "2", name: "รถยนต์", category: "ยานพาหนะ", amount: 450000, icon: Car },
        { id: "3", name: "เงินฝากธนาคาร", category: "เงินสด", amount: 120000, icon: PiggyBank },
        { id: "4", name: "กองทุนรวม", category: "การลงทุน", amount: 80000, icon: Building },
      ]

      const defaultLiabilities = [
        { id: "1", name: "สินเชื่อบ้าน", category: "สินเชื่อระยะยาว", amount: 750000, interestRate: 3.5, icon: Home },
        { id: "2", name: "สินเชื่อรถยนต์", category: "สินเชื่อระยะกลาง", amount: 65000, interestRate: 5.2, icon: Car },
        { id: "3", name: "บัตรเครดิต", category: "สินเชื่อระยะสั้น", amount: 35000, interestRate: 18, icon: CreditCard },
      ]

      const totalAssets = defaultAssets.reduce((sum, asset) => sum + asset.amount, 0)
      const totalLiabilities = defaultLiabilities.reduce((sum, liability) => sum + liability.amount, 0)
      const netWorth = totalAssets - totalLiabilities

      setFinancialStatusData({
        assets: defaultAssets,
        liabilities: defaultLiabilities,
        totalAssets,
        totalLiabilities,
        netWorth,
      })
    }

    // If no data, redirect back to main page
    if (!savedPlanData && !savedFinancialData && !savedFinancialStatusData) {
      router.push("/")
    }
  }, [router])

  // Helper function to get appropriate icon for assets
  const getIconForAsset = (category: string, name: string) => {
    if (name.includes("บ้าน") || category.includes("อสังหา")) return Home
    if (name.includes("รถ") || category.includes("ยานพาหนะ")) return Car
    if (name.includes("เงินฝาก") || name.includes("เงินสด") || category.includes("เงินสด")) return PiggyBank
    if (name.includes("กองทุน") || name.includes("หุ้น") || category.includes("การลงทุน")) return Building
    return Wallet
  }

  // Helper function to get appropriate icon for liabilities
  const getIconForLiability = (category: string, name: string) => {
    if (name.includes("บ้าน") || name.includes("สินเชื่อบ้าน")) return Home
    if (name.includes("รถ") || name.includes("สินเชื่อรถ")) return Car
    if (name.includes("บัตรเครดิต") || name.includes("บัตร")) return CreditCard
    return CreditCard
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const handleBack = () => {
    router.push("/planning")
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true)

      // Dynamic imports to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default
      const jsPDF = (await import("jspdf")).default

      // Get the report content element
      const reportElement = document.getElementById("report-content")
      if (!reportElement) {
        throw new Error("Report content not found")
      }

      // Hide the header buttons temporarily for cleaner PDF
      const headerElement = document.getElementById("report-header")
      const originalHeaderDisplay = headerElement?.style.display
      if (headerElement) {
        headerElement.style.display = "none"
      }

      // Configure html2canvas options for single page PDF
      const canvas = await html2canvas(reportElement, {
        scale: 1.5, // Reduced scale for better fit
        useCORS: true,
        allowTaint: true,
        backgroundColor: isDarkMode ? "#111827" : "#ffffff",
        width: reportElement.scrollWidth,
        height: reportElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
      })

      // Restore header
      if (headerElement && originalHeaderDisplay !== undefined) {
        headerElement.style.display = originalHeaderDisplay
      }

      // A4 dimensions in mm
      const a4Width = 210
      const a4Height = 297

      // Calculate dimensions to fit A4 page
      const canvasAspectRatio = canvas.width / canvas.height
      const a4AspectRatio = a4Width / a4Height

      let imgWidth = a4Width
      let imgHeight = a4Height

      // Adjust dimensions to maintain aspect ratio and fit within A4
      if (canvasAspectRatio > a4AspectRatio) {
        // Canvas is wider than A4 ratio - fit to width
        imgHeight = a4Width / canvasAspectRatio
      } else {
        // Canvas is taller than A4 ratio - fit to height
        imgWidth = a4Height * canvasAspectRatio
      }

      // Center the image on the page
      const xOffset = (a4Width - imgWidth) / 2
      const yOffset = (a4Height - imgHeight) / 2

      // Create PDF with A4 dimensions
      const pdf = new jsPDF("p", "mm", "a4")

      // Add the image to PDF, scaled to fit one page
      const imgData = canvas.toDataURL("image/png")
      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight)

      // Generate filename with current date
      const currentDate = new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      const filename = `รายงานการวางแผนการเงิน_${currentDate}.pdf`

      // Save the PDF
      pdf.save(filename)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert(t("pdfError"))
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleDownloadExcel = async () => {
    try {
      const XLSX = await import("xlsx")

      const workbook = XLSX.utils.book_new()

      // Financial Status Sheet
      if (financialStatusData) {
        const statusData = [
          ["Financial Status"],
          [""],
          ["Summary"],
          ["Total Assets", financialStatusData.totalAssets],
          ["Total Liabilities", financialStatusData.totalLiabilities],
          ["Net Worth", financialStatusData.netWorth],
          [""],
          ["Assets"],
          ["Item", "Category", "Amount"],
        ]

        financialStatusData.assets.forEach((asset) => {
          statusData.push([asset.name, asset.category, asset.amount])
        })

        statusData.push([""])
        statusData.push(["Liabilities"])
        statusData.push(["Item", "Category", "Amount", "Interest Rate"])

        financialStatusData.liabilities.forEach((liability) => {
          statusData.push([liability.name, liability.category, liability.amount, liability.interestRate])
        })

        const statusSheet = XLSX.utils.aoa_to_sheet(statusData)
        XLSX.utils.book_append_sheet(workbook, statusSheet, "Financial Status")
      }

      // 6-Dimension Goals Sheet
      if (planData) {
        const goalsData = [
          ["6-Dimension Life Goals"],
          [`Planning Period: ${planData.startYear} - ${planData.endYear}`],
          [""],
          ["Dimension", "Goal", "Reason", "Timeline"],
        ]

        planData.dimensions.forEach((dimension) => {
          if (dimension.goal || dimension.reason || dimension.timeline) {
            goalsData.push([dimension.name, dimension.goal || "", dimension.reason || "", dimension.timeline || ""])
          }
        })

        const goalsSheet = XLSX.utils.aoa_to_sheet(goalsData)
        XLSX.utils.book_append_sheet(workbook, goalsSheet, "Life Goals")
      }

      // Financial Planning Sheet
      if (financialData) {
        const monthHeaders =
          financialData.monthNames || Array.from({ length: financialData.months }, (_, i) => `Month ${i + 1}`)

        const financialSheetData = [
          ["Financial Planning"],
          [`Period: ${financialData.months} months`],
          financialData.startingMonth ? [`Starting Month: ${thaiMonths[financialData.startingMonth - 1]}`] : [],
          [""],
          ["Category", "Item", ...monthHeaders, "Total"],
        ].filter((row) => row.length > 0)

        // Income section
        financialSheetData.push(["INCOME", "", ...Array(financialData.months).fill(""), ""])

        financialData.rows
          .filter((row) => row.type === "income")
          .forEach((row) => {
            financialSheetData.push(["", row.name, ...row.values.map((v) => v || 0), row.total])
          })

        // Total Income
        const totalIncomeRow = financialData.rows.find((row) => row.id === "total-income")
        if (totalIncomeRow) {
          financialSheetData.push([
            "",
            "Total Income",
            ...totalIncomeRow.values.map((v) => v || 0),
            totalIncomeRow.total,
          ])
        }

        financialSheetData.push(["", "", ...Array(financialData.months).fill(""), ""])

        // Expenses section
        financialSheetData.push(["EXPENSES", "", ...Array(financialData.months).fill(""), ""])

        financialData.rows
          .filter((row) => row.type === "expense")
          .forEach((row) => {
            financialSheetData.push(["", row.name, ...row.values.map((v) => v || 0), row.total])
          })

        // Total Expenses
        const totalExpenseRow = financialData.rows.find((row) => row.id === "total-expense")
        if (totalExpenseRow) {
          financialSheetData.push([
            "",
            "Total Expenses",
            ...totalExpenseRow.values.map((v) => v || 0),
            totalExpenseRow.total,
          ])
        }

        financialSheetData.push(["", "", ...Array(financialData.months).fill(""), ""])

        // Remaining
        const remainingRow = financialData.rows.find((row) => row.id === "remaining")
        if (remainingRow) {
          financialSheetData.push([
            "REMAINING",
            "Net Amount",
            ...remainingRow.values.map((v) => v || 0),
            remainingRow.total,
          ])
        }

        const financialSheet = XLSX.utils.aoa_to_sheet(financialSheetData)
        XLSX.utils.book_append_sheet(workbook, financialSheet, "Financial Plan")
      }

      // Generate Excel file as a Blob
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      const data = new Blob([excelBuffer], { type: "application/octet-stream" })

      // Create a download link and trigger click
      const url = window.URL.createObjectURL(data)
      const link = document.createElement("a")
      link.href = url
      link.download = "financial-planning-report.xlsx"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating Excel:", error)
      alert(t("excelError"))
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Financial Planning Report",
        text: "ดูแผนการเงิน 6 มิติของฉัน",
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert(t("linkCopied"))
    }
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("darkMode", JSON.stringify(newMode))
  }

  if (!planData && !financialData && !financialStatusData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className={`${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>{t("loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto px-8 py-8 max-w-4xl">
        {/* Header */}
        <div id="report-header" className="flex items-center justify-between mb-8">
          {/* Left: Dark/Light Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-lg transition-all duration-200 ${
              isDarkMode
                ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/30"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300 border border-gray-300"
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Center: Back Button */}
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

          {/* Right: Other Buttons */}
          <div className="flex gap-3">
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
              onClick={handleShare}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                isDarkMode
                  ? "text-yellow-200 hover:bg-gray-800 border border-gray-700"
                  : "text-gray-600 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              <Share2 className="w-4 h-4" />
              {t("share")}
            </button>
            <button
              onClick={handleDownloadExcel}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                isDarkMode
                  ? "text-yellow-200 hover:bg-gray-800 border border-gray-700"
                  : "text-gray-600 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              <FileText className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                isGeneratingPDF
                  ? "opacity-50 cursor-not-allowed"
                  : isDarkMode
                    ? "bg-yellow-500 text-black hover:bg-yellow-400"
                    : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  กำลังสร้าง...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div
          id="report-content"
          className={`rounded-lg p-8 ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
              {t("reportTitle")}
            </h1>
            {planData && (
              <p className={`text-lg ${isDarkMode ? "text-yellow-200" : "text-gray-600"}`}>
                ปี {planData.startYear} - {planData.endYear}
              </p>
            )}
            <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {t("createdOn")}:{" "}
              {new Date().toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {financialStatusData?.lastUpdated && (
              <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                ข้อมูลสถานะการเงินอัปเดตล่าสุด:{" "}
                {new Date(financialStatusData.lastUpdated).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>

          {/* 6-Dimension Goals Section */}
          {planData && (
            <div className="mb-12">
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
                {t("sixDimensionGoals")}
              </h2>
              <div className="space-y-6">
                {planData.dimensions.map((dimension) => {
                  const IconComponent = dimensionIcons[dimension.id as keyof typeof dimensionIcons]
                  const hasContent = dimension.goal || dimension.reason || dimension.timeline

                  if (!hasContent) return null

                  return (
                    <div
                      key={dimension.id}
                      className={`p-6 rounded-lg border ${
                        isDarkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <IconComponent className={`w-6 h-6 ${isDarkMode ? "text-yellow-400" : "text-gray-600"}`} />
                        <h3 className={`text-xl font-semibold ${isDarkMode ? "text-yellow-200" : "text-gray-800"}`}>
                          {dimension.name}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {dimension.goal && (
                          <div>
                            <h4 className={`font-medium mb-2 ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}>
                              เป้าหมาย
                            </h4>
                            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{dimension.goal}</p>
                          </div>
                        )}

                        {dimension.reason && (
                          <div>
                            <h4 className={`font-medium mb-2 ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}>
                              เหตุผล
                            </h4>
                            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{dimension.reason}</p>
                          </div>
                        )}

                        {dimension.timeline && (
                          <div>
                            <h4 className={`font-medium mb-2 ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}>
                              ระยะเวลา
                            </h4>
                            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{dimension.timeline}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Financial Status Section */}
          {financialStatusData && (
            <div className="mb-12">
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
                {t("financialStatusTitle")}
              </h2>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Assets */}
                <div
                  className={`p-6 rounded-lg border ${isDarkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
                      {t("totalAssets")}
                    </h3>
                    <Wallet className={`w-5 h-5 ${isDarkMode ? "text-yellow-400" : "text-gray-600"}`} />
                  </div>
                  <p className={`text-3xl font-bold mb-1 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
                    ฿{financialStatusData.totalAssets.toLocaleString()}
                  </p>
                </div>

                {/* Total Liabilities */}
                <div
                  className={`p-6 rounded-lg border ${isDarkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
                      {t("totalLiabilities")}
                    </h3>
                    <CreditCard className={`w-5 h-5 ${isDarkMode ? "text-yellow-400" : "text-gray-600"}`} />
                  </div>
                  <p className={`text-3xl font-bold mb-1 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
                    ฿{financialStatusData.totalLiabilities.toLocaleString()}
                  </p>
                </div>

                {/* Net Worth */}
                <div
                  className={`p-6 rounded-lg border ${isDarkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-semibold ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
                      {t("netWorth")}
                    </h3>
                    <TrendingUp className={`w-5 h-5 ${isDarkMode ? "text-yellow-400" : "text-gray-600"}`} />
                  </div>
                  <p
                    className={`text-3xl font-bold mb-1 ${financialStatusData.netWorth >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    ฿{financialStatusData.netWorth.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Assets and Liabilities Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Assets */}
                <div>
                  <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}>
                    {t("assets")}
                  </h3>
                  <div className="space-y-3">
                    {financialStatusData.assets.map((asset) => {
                      const IconComponent = asset.icon
                      return (
                        <div
                          key={asset.id}
                          className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? "bg-gray-800/50" : "bg-gray-100"}`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className={`w-4 h-4 ${isDarkMode ? "text-yellow-400" : "text-gray-600"}`} />
                            <div>
                              <p className={`font-medium ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
                                {asset.name}
                              </p>
                              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {asset.category}
                              </p>
                            </div>
                          </div>
                          <p className={`font-semibold ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
                            ฿{asset.amount.toLocaleString()}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Liabilities */}
                <div>
                  <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}>
                    {t("liabilities")}
                  </h3>
                  <div className="space-y-3">
                    {financialStatusData.liabilities.map((liability) => {
                      const IconComponent = liability.icon
                      return (
                        <div
                          key={liability.id}
                          className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? "bg-gray-800/50" : "bg-gray-100"}`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className={`w-4 h-4 ${isDarkMode ? "text-yellow-400" : "text-gray-600"}`} />
                            <div>
                              <p className={`font-medium ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
                                {liability.name}
                              </p>
                              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {liability.category} • {liability.interestRate}%
                              </p>
                            </div>
                          </div>
                          <p className={`font-semibold ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
                            ฿{liability.amount.toLocaleString()}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Planning Section */}
          {financialData && (
            <div>
              <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
                {t("financialPlanningAhead")} ({financialData.months} {t("months")})
                {financialData.startingMonth && (
                  <span className={`text-lg font-normal ml-2 ${isDarkMode ? "text-yellow-200" : "text-gray-600"}`}>
                    ({thaiMonths[financialData.startingMonth - 1]} -{" "}
                    {thaiMonths[(financialData.startingMonth + financialData.months - 2) % 12]})
                  </span>
                )}
              </h2>

              {/* Financial Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div
                  className={`p-6 rounded-lg border ${isDarkMode ? "bg-blue-900/20 border-blue-700" : "bg-blue-50 border-blue-200"}`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}>
                    รวมรายได้
                  </h3>
                  <p className={`text-2xl font-bold ${isDarkMode ? "text-blue-200" : "text-blue-600"}`}>
                    {financialData.rows.find((row) => row.id === "total-income")?.total.toLocaleString() || "0"} บาท
                  </p>
                </div>

                <div
                  className={`p-6 rounded-lg border ${isDarkMode ? "bg-red-900/20 border-red-700" : "bg-red-50 border-red-200"}`}
                >
                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-red-300" : "text-red-700"}`}>
                    รวมรายจ่าย
                  </h3>
                  <p className={`text-2xl font-bold ${isDarkMode ? "text-red-200" : "text-red-600"}`}>
                    {financialData.rows.find((row) => row.id === "total-expense")?.total.toLocaleString() || "0"} บาท
                  </p>
                </div>

                <div
                  className={`p-6 rounded-lg border ${
                    financialData.totalRemaining >= 0
                      ? isDarkMode
                        ? "bg-green-900/20 border-green-700"
                        : "bg-green-50 border-green-200"
                      : isDarkMode
                        ? "bg-red-900/20 border-red-700"
                        : "bg-red-50 border-red-200"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      financialData.totalRemaining >= 0
                        ? isDarkMode
                          ? "text-green-300"
                          : "text-green-700"
                        : isDarkMode
                          ? "text-red-300"
                          : "text-red-700"
                    }`}
                  >
                    คงเหลือ
                  </h3>
                  <p
                    className={`text-2xl font-bold ${
                      financialData.totalRemaining >= 0
                        ? isDarkMode
                          ? "text-green-200"
                          : "text-green-600"
                        : isDarkMode
                          ? "text-red-200"
                          : "text-red-600"
                    }`}
                  >
                    {financialData.totalRemaining.toLocaleString()} บาท
                  </p>
                </div>
              </div>

              {/* Detailed Financial Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                      <th
                        className={`px-4 py-3 text-left font-semibold ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                      >
                        รายการ
                      </th>
                      {(
                        financialData.monthNames ||
                        Array.from({ length: financialData.months }, (_, i) => `เดือนที่ ${i + 1}`)
                      ).map((monthName, i) => (
                        <th
                          key={i}
                          className={`px-4 py-3 text-center font-semibold ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                        >
                          {monthName}
                        </th>
                      ))}
                      <th
                        className={`px-4 py-3 text-center font-semibold ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                      >
                        รวม
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Income Section */}
                    <tr className={`${isDarkMode ? "bg-blue-900/20" : "bg-blue-50"}`}>
                      <td
                        colSpan={financialData.months + 2}
                        className={`px-4 py-2 text-center font-semibold ${isDarkMode ? "text-blue-300" : "text-blue-700"}`}
                      >
                        รายได้
                      </td>
                    </tr>
                    {financialData.rows
                      .filter((row) => row.type === "income" || row.id === "total-income")
                      .map((row) => (
                        <tr
                          key={row.id}
                          className={`border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"} ${row.id === "total-income" ? (isDarkMode ? "bg-gray-700/50" : "bg-gray-100") : ""}`}
                        >
                          <td className={`px-4 py-3 font-medium ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
                            {row.name}
                          </td>
                          {row.values.map((value, index) => (
                            <td
                              key={index}
                              className={`px-4 py-3 text-center ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                            >
                              {value.toLocaleString()}
                            </td>
                          ))}
                          <td
                            className={`px-4 py-3 text-center font-semibold ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}
                          >
                            {row.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}

                    {/* Expense Section */}
                    <tr className={`${isDarkMode ? "bg-red-900/20" : "bg-red-50"}`}>
                      <td
                        colSpan={financialData.months + 2}
                        className={`px-4 py-2 text-center font-semibold ${isDarkMode ? "text-red-300" : "text-red-700"}`}
                      >
                        รายจ่าย
                      </td>
                    </tr>
                    {financialData.rows
                      .filter((row) => row.type === "expense" || row.id === "total-expense")
                      .map((row) => (
                        <tr
                          key={row.id}
                          className={`border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"} ${row.id === "total-expense" ? (isDarkMode ? "bg-gray-700/50" : "bg-gray-100") : ""}`}
                        >
                          <td className={`px-4 py-3 font-medium ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
                            {row.name}
                          </td>
                          {row.values.map((value, index) => (
                            <td
                              key={index}
                              className={`px-4 py-3 text-center ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                            >
                              {value.toLocaleString()}
                            </td>
                          ))}
                          <td
                            className={`px-4 py-3 text-center font-semibold ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}
                          >
                            {row.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}

                    {/* Remaining Section */}
                    <tr className={`${isDarkMode ? "bg-green-900/20" : "bg-green-50"}`}>
                      <td
                        colSpan={financialData.months + 2}
                        className={`px-4 py-2 text-center font-semibold ${isDarkMode ? "text-green-300" : "text-green-700"}`}
                      >
                        คงเหลือ
                      </td>
                    </tr>
                    {financialData.rows
                      .filter((row) => row.id === "remaining")
                      .map((row) => (
                        <tr
                          key={row.id}
                          className={`border-t ${isDarkMode ? "border-gray-700 bg-gray-700/50" : "border-gray-200 bg-gray-100"}`}
                        >
                          <td className={`px-4 py-3 font-semibold ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
                            {row.name}
                          </td>
                          {row.values.map((value, index) => (
                            <td
                              key={index}
                              className={`px-4 py-3 text-center font-semibold ${value >= 0 ? (isDarkMode ? "text-green-400" : "text-green-600") : isDarkMode ? "text-red-400" : "text-red-600"}`}
                            >
                              {value.toLocaleString()}
                            </td>
                          ))}
                          <td
                            className={`px-4 py-3 text-center font-bold text-lg ${row.total >= 0 ? (isDarkMode ? "text-green-400" : "text-green-600") : isDarkMode ? "text-red-400" : "text-red-600"}`}
                          >
                            {row.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer */}
          <Footer isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  )
}
