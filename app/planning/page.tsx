"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Moon, Sun, Home } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Footer } from "@/components/Footer"

interface FinancialRow {
  id: string
  name: string
  type: "income" | "expense" | "summary"
  isEditable: boolean
  values: number[]
}

export default function PlanningPage() {
  const router = useRouter()
  const [months, setMonths] = useState(6)
  const [startingMonth, setStartingMonth] = useState(1) // 1 = January
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [rows, setRows] = useState<FinancialRow[]>([
    // รายได้
    { id: "salary", name: "เงินเดือน", type: "income", isEditable: true, values: Array(6).fill(0) },
    // รวมรายได้ (คำนวณอัตโนมัติ)
    { id: "total-income", name: "รวมรายได้", type: "summary", isEditable: false, values: Array(6).fill(0) },
    // รายจ่าย
    { id: "food", name: "อาหาร", type: "expense", isEditable: true, values: Array(6).fill(0) },
    { id: "housing", name: "ที่พัก", type: "expense", isEditable: true, values: Array(6).fill(0) },
    // รวมรายจ่าย (คำนวณอัตโนมัติ)
    { id: "total-expense", name: "รวมรายจ่าย", type: "summary", isEditable: false, values: Array(6).fill(0) },
    // เหลือ (คำนวณอัตโนมัติ)
    { id: "remaining", name: "เหลือ", type: "summary", isEditable: false, values: Array(6).fill(0) },
  ])

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

  // Function to get month names starting from selected month
  const getMonthNames = (startMonth: number, numMonths: number) => {
    const monthNames = []
    for (let i = 0; i < numMonths; i++) {
      const monthIndex = (startMonth - 1 + i) % 12
      monthNames.push(thaiMonths[monthIndex])
    }
    return monthNames
  }

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode")
    if (savedMode) {
      setIsDarkMode(JSON.parse(savedMode))
    }

    // Load saved planning data
    const savedPlanningData = localStorage.getItem("financialPlanningData")
    if (savedPlanningData) {
      const parsedData = JSON.parse(savedPlanningData)
      if (parsedData.months) setMonths(parsedData.months)
      if (parsedData.startingMonth) setStartingMonth(parsedData.startingMonth)
      if (parsedData.rows) {
        // Ensure all rows have the correct number of values
        const updatedRows = parsedData.rows.map((row: any) => ({
          ...row,
          values: Array(parsedData.months || 6)
            .fill(0)
            .map((_, index) => row.values[index] || 0),
        }))
        setRows(calculateSummaryValues(updatedRows, parsedData.months || 6))
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

  // Calculate summary values function
  const calculateSummaryValues = (currentRows: FinancialRow[], monthCount: number) => {
    const updatedRows = [...currentRows]

    for (let monthIndex = 0; monthIndex < monthCount; monthIndex++) {
      // Calculate total income
      const totalIncome = updatedRows
        .filter((row) => row.type === "income")
        .reduce((sum, row) => sum + (row.values[monthIndex] || 0), 0)

      // Calculate total expense
      const totalExpense = updatedRows
        .filter((row) => row.type === "expense")
        .reduce((sum, row) => sum + (row.values[monthIndex] || 0), 0)

      // Update summary rows
      const totalIncomeRow = updatedRows.find((row) => row.id === "total-income")
      const totalExpenseRow = updatedRows.find((row) => row.id === "total-expense")
      const remainingRow = updatedRows.find((row) => row.id === "remaining")

      if (totalIncomeRow) totalIncomeRow.values[monthIndex] = totalIncome
      if (totalExpenseRow) totalExpenseRow.values[monthIndex] = totalExpense
      if (remainingRow) remainingRow.values[monthIndex] = totalIncome - totalExpense
    }

    return updatedRows
  }

  const handleValueChange = (rowId: string, monthIndex: number, value: number) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) =>
        row.id === rowId ? { ...row, values: row.values.map((v, i) => (i === monthIndex ? value : v)) } : row,
      )
      return calculateSummaryValues(updatedRows, months)
    })
  }

  const handleNameChange = (rowId: string, newName: string) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) => (row.id === rowId ? { ...row, name: newName } : row))
      return updatedRows
    })
  }

  const handleMonthsChange = (newMonths: number) => {
    setMonths(newMonths)
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) => ({
        ...row,
        values: Array(newMonths)
          .fill(0)
          .map((_, index) => row.values[index] || 0),
      }))
      return calculateSummaryValues(updatedRows, newMonths)
    })
  }

  const handleStartingMonthChange = (newStartingMonth: number) => {
    setStartingMonth(newStartingMonth)
  }

  const addIncomeRow = () => {
    const newRow: FinancialRow = {
      id: `income-${Date.now()}`,
      name: t("newIncomeItem"),
      type: "income",
      isEditable: true,
      values: Array(months).fill(0),
    }

    setRows((prevRows) => {
      const totalIncomeIndex = prevRows.findIndex((row) => row.id === "total-income")
      const newRows = [...prevRows]
      newRows.splice(totalIncomeIndex, 0, newRow)
      return calculateSummaryValues(newRows, months)
    })
  }

  const addExpenseRow = () => {
    const newRow: FinancialRow = {
      id: `expense-${Date.now()}`,
      name: t("newExpenseItem"),
      type: "expense",
      isEditable: true,
      values: Array(months).fill(0),
    }

    setRows((prevRows) => {
      const totalExpenseIndex = prevRows.findIndex((row) => row.id === "total-expense")
      const newRows = [...prevRows]
      newRows.splice(totalExpenseIndex, 0, newRow)
      return calculateSummaryValues(newRows, months)
    })
  }

  const deleteRow = (rowId: string) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.filter((row) => row.id !== rowId)
      return calculateSummaryValues(updatedRows, months)
    })
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    localStorage.setItem("darkMode", JSON.stringify(!isDarkMode))
  }

  const handleBack = () => {
    router.push("/financial-status")
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  const getTotalRemaining = () => {
    const remainingRow = rows.find((row) => row.id === "remaining")
    return remainingRow ? remainingRow.values.reduce((sum, val) => sum + val, 0) : 0
  }

  const getRowSum = (row: FinancialRow) => {
    return row.values.reduce((sum, val) => sum + val, 0)
  }

  const saveFinancialDataAndGoToReport = () => {
    // Save financial planning data with starting month
    const financialData = {
      months,
      startingMonth,
      monthNames: getMonthNames(startingMonth, months),
      rows: rows.map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type,
        isEditable: row.isEditable,
        values: row.values.slice(0, months),
        total: getRowSum(row),
      })),
      totalRemaining: getTotalRemaining(),
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("financialPlanningData", JSON.stringify(financialData))
    router.push("/report")
  }

  // Determine if we need compact layout (for many months)
  const isCompactLayout = months > 8
  const monthNames = getMonthNames(startingMonth, months)

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <div className={`container mx-auto px-8 py-8 ${isCompactLayout ? "max-w-full" : "max-w-7xl"}`}>
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
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
            {t("planningTitle")}
          </h1>
          <p className={`text-lg leading-relaxed ${isDarkMode ? "text-yellow-200" : "text-gray-600"}`}>
            {t("planningDescription")}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
          {/* Starting Month Selector */}
          <div className="flex items-center gap-2">
            <label className={`font-medium ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>เดือนเริ่มต้น:</label>
            <select
              value={startingMonth}
              onChange={(e) => handleStartingMonthChange(Number(e.target.value))}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 font-medium ${
                isDarkMode
                  ? "bg-gray-800 border-yellow-400/30 text-yellow-200 focus:ring-yellow-400"
                  : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
              }`}
            >
              {thaiMonths.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Months */}
          <div className="flex items-center gap-2">
            <label className={`font-medium ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
              {t("numberOfMonths")}:
            </label>
            <input
              type="number"
              value={months}
              onChange={(e) => handleMonthsChange(Math.max(1, Math.min(12, Number.parseInt(e.target.value) || 6)))}
              min="1"
              max="12"
              className={`px-3 py-2 w-20 text-center border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 font-medium ${
                isDarkMode
                  ? "bg-gray-800 border-yellow-400/30 text-yellow-200 focus:ring-yellow-400"
                  : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
              }`}
            />
          </div>

          <button
            onClick={addIncomeRow}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              isDarkMode ? "bg-green-600 text-white hover:bg-green-700" : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            <Plus className="w-4 h-4" />
            {t("addIncome")}
          </button>

          <button
            onClick={addExpenseRow}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              isDarkMode ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            <Plus className="w-4 h-4" />
            {t("addExpense")}
          </button>
        </div>

        {/* Financial Table - Adaptive layout */}
        <div className={`mb-8 ${isCompactLayout ? "" : "overflow-x-auto"}`}>
          <div className={`rounded-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
            <table className={`w-full ${isCompactLayout ? "table-fixed" : ""}`}>
              <thead>
                <tr className={`${isDarkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                  <th
                    className={`px-4 py-3 text-left font-semibold ${
                      isCompactLayout ? "text-sm" : "text-sm"
                    } ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                    style={isCompactLayout ? { width: "120px" } : {}}
                  >
                    รายการ
                  </th>
                  {monthNames.map((monthName, i) => (
                    <th
                      key={i}
                      className={`${isCompactLayout ? "px-1" : "px-4"} py-3 text-center font-semibold ${
                        isCompactLayout ? "text-xs" : "text-sm"
                      } ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                      style={isCompactLayout ? { width: `${(100 - 15) / months}%` } : {}}
                    >
                      {monthName}
                    </th>
                  ))}
                  <th
                    className={`px-4 py-3 text-center font-semibold ${
                      isCompactLayout ? "text-sm" : "text-sm"
                    } ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                    style={isCompactLayout ? { width: "100px" } : {}}
                  >
                    สรุปรวม
                  </th>
                  <th
                    className={`px-2 py-3 text-center font-semibold ${
                      isCompactLayout ? "text-sm" : "text-sm"
                    } ${isDarkMode ? "text-yellow-300" : "text-gray-700"}`}
                    style={isCompactLayout ? { width: "60px" } : {}}
                  >
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* รายได้ Section */}
                <tr className={`${isDarkMode ? "bg-gray-700/30" : "bg-blue-50"}`}>
                  <td
                    colSpan={months + 3}
                    className={`px-4 py-2 text-center font-semibold ${isDarkMode ? "text-yellow-200" : "text-blue-700"}`}
                  >
                    {t("income")}
                  </td>
                </tr>

                {rows
                  .filter((row) => row.type === "income" || row.id === "total-income")
                  .map((row, index) => (
                    <tr
                      key={row.id}
                      className={`border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"} ${row.id === "total-income" ? (isDarkMode ? "bg-gray-700/50" : "bg-gray-100") : ""}`}
                    >
                      <td
                        className={`px-4 py-3 font-medium ${
                          isCompactLayout ? "text-sm" : "text-sm"
                        } ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}
                      >
                        {row.isEditable ? (
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => handleNameChange(row.id, e.target.value)}
                            className={`w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-1 transition-all duration-200 ${
                              isCompactLayout ? "text-xs" : "text-sm"
                            } ${
                              isDarkMode
                                ? "bg-gray-800 border-gray-600 text-yellow-200 focus:ring-yellow-400"
                                : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                            }`}
                          />
                        ) : (
                          row.name
                        )}
                      </td>
                      {row.values.slice(0, months).map((value, monthIndex) => (
                        <td key={monthIndex} className={`${isCompactLayout ? "px-1" : "px-2"} py-3 text-center`}>
                          {row.isEditable ? (
                            <input
                              type="number"
                              value={value || ""}
                              onChange={(e) =>
                                handleValueChange(row.id, monthIndex, Number.parseInt(e.target.value) || 0)
                              }
                              className={`${isCompactLayout ? "w-full px-1" : "w-20 px-2"} py-1 text-center ${
                                isCompactLayout ? "text-xs" : "text-sm"
                              } border rounded focus:outline-none focus:ring-1 transition-all duration-200 ${
                                isDarkMode
                                  ? "bg-gray-800 border-gray-600 text-yellow-200 focus:ring-yellow-400"
                                  : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                              }`}
                            />
                          ) : (
                            <span
                              className={`font-medium ${
                                isCompactLayout ? "text-xs" : "text-sm"
                              } ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}
                            >
                              {value.toLocaleString()}
                            </span>
                          )}
                        </td>
                      ))}
                      <td
                        className={`px-4 py-3 text-center font-semibold ${
                          isCompactLayout ? "text-sm" : "text-sm"
                        } ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}
                      >
                        {getRowSum(row).toLocaleString()}
                      </td>
                      <td className="px-2 py-3 text-center">
                        {row.isEditable && (
                          <button
                            onClick={() => deleteRow(row.id)}
                            className={`p-1 rounded hover:bg-red-100 ${isDarkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-600"}`}
                            title="ลบรายการ"
                          >
                            🗑️
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}

                {/* รายจ่าย Section */}
                <tr className={`${isDarkMode ? "bg-gray-700/30" : "bg-red-50"}`}>
                  <td
                    colSpan={months + 3}
                    className={`px-4 py-2 text-center font-semibold ${isDarkMode ? "text-yellow-200" : "text-red-700"}`}
                  >
                    {t("expense")}
                  </td>
                </tr>

                {rows
                  .filter((row) => row.type === "expense" || row.id === "total-expense")
                  .map((row) => (
                    <tr
                      key={row.id}
                      className={`border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"} ${row.id === "total-expense" ? (isDarkMode ? "bg-gray-700/50" : "bg-gray-100") : ""}`}
                    >
                      <td
                        className={`px-4 py-3 font-medium ${
                          isCompactLayout ? "text-sm" : "text-sm"
                        } ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}
                      >
                        {row.isEditable ? (
                          <input
                            type="text"
                            value={row.name}
                            onChange={(e) => handleNameChange(row.id, e.target.value)}
                            className={`w-full px-2 py-1 border rounded-md focus:outline-none focus:ring-1 transition-all duration-200 ${
                              isCompactLayout ? "text-xs" : "text-sm"
                            } ${
                              isDarkMode
                                ? "bg-gray-800 border-gray-600 text-yellow-200 focus:ring-yellow-400"
                                : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                            }`}
                          />
                        ) : (
                          row.name
                        )}
                      </td>
                      {row.values.slice(0, months).map((value, monthIndex) => (
                        <td key={monthIndex} className={`${isCompactLayout ? "px-1" : "px-2"} py-3 text-center`}>
                          {row.isEditable ? (
                            <input
                              type="number"
                              value={value || ""}
                              onChange={(e) =>
                                handleValueChange(row.id, monthIndex, Number.parseInt(e.target.value) || 0)
                              }
                              className={`${isCompactLayout ? "w-full px-1" : "w-20 px-2"} py-1 text-center ${
                                isCompactLayout ? "text-xs" : "text-sm"
                              } border rounded focus:outline-none focus:ring-1 transition-all duration-200 ${
                                isDarkMode
                                  ? "bg-gray-800 border-gray-600 text-yellow-200 focus:ring-yellow-400"
                                  : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500"
                              }`}
                            />
                          ) : (
                            <span
                              className={`font-medium ${
                                isCompactLayout ? "text-xs" : "text-sm"
                              } ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}
                            >
                              {value.toLocaleString()}
                            </span>
                          )}
                        </td>
                      ))}
                      <td
                        className={`px-4 py-3 text-center font-semibold ${
                          isCompactLayout ? "text-sm" : "text-sm"
                        } ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}
                      >
                        {getRowSum(row).toLocaleString()}
                      </td>
                      <td className="px-2 py-3 text-center">
                        {row.isEditable && (
                          <button
                            onClick={() => deleteRow(row.id)}
                            className={`p-1 rounded hover:bg-red-100 ${isDarkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-600"}`}
                            title="ลบรายการ"
                          >
                            🗑️
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}

                {/* เหลือ Section */}
                <tr className={`${isDarkMode ? "bg-gray-700/30" : "bg-green-50"}`}>
                  <td
                    colSpan={months + 3}
                    className={`px-4 py-2 text-center font-semibold ${isDarkMode ? "text-yellow-200" : "text-green-700"}`}
                  >
                    {t("remaining")}
                  </td>
                </tr>

                {rows
                  .filter((row) => row.id === "remaining")
                  .map((row) => (
                    <tr
                      key={row.id}
                      className={`border-t ${isDarkMode ? "border-gray-700 bg-gray-700/50" : "border-gray-200 bg-gray-100"}`}
                    >
                      <td
                        className={`px-4 py-3 font-semibold ${
                          isCompactLayout ? "text-sm" : "text-sm"
                        } ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}
                      >
                        {row.name}
                      </td>
                      {row.values.slice(0, months).map((value, monthIndex) => (
                        <td
                          key={monthIndex}
                          className={`${isCompactLayout ? "px-1" : "px-4"} py-3 text-center font-semibold ${
                            isCompactLayout ? "text-xs" : "text-sm"
                          } ${value >= 0 ? (isDarkMode ? "text-green-400" : "text-green-600") : isDarkMode ? "text-red-400" : "text-red-600"}`}
                        >
                          {value.toLocaleString()}
                        </td>
                      ))}
                      <td
                        className={`px-4 py-3 text-center font-bold ${
                          isCompactLayout ? "text-sm" : "text-lg"
                        } ${getRowSum(row) >= 0 ? (isDarkMode ? "text-green-400" : "text-green-600") : isDarkMode ? "text-red-400" : "text-red-600"}`}
                      >
                        {getRowSum(row).toLocaleString()}
                      </td>
                      <td className="px-2 py-3 text-center">{/* No delete button for remaining row */}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="text-center">
          <div
            className={`inline-block p-6 rounded-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
              {t("summary")} {months} เดือน ({thaiMonths[startingMonth - 1]} -{" "}
              {thaiMonths[(startingMonth + months - 2) % 12]})
            </h2>
            <p
              className={`text-4xl font-bold mb-4 ${getTotalRemaining() >= 0 ? (isDarkMode ? "text-green-400" : "text-green-600") : isDarkMode ? "text-red-400" : "text-red-600"}`}
            >
              {getTotalRemaining().toLocaleString()} บาท
            </p>

            <div className="mt-6">
              <button
                onClick={saveFinancialDataAndGoToReport}
                className={`px-8 py-3 text-lg font-semibold rounded-md transition-all duration-200 ${
                  isDarkMode
                    ? "bg-yellow-500 text-black hover:bg-yellow-400"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                {t("goToReport")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  )
}
