"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image" // Import Next.js Image component
import { ArrowLeft, Moon, Sun } from "lucide-react"
import { useLanguageSafe } from "@/contexts/LanguageContext"
import { Footer } from "@/components/Footer"

export default function SupportPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const { t } = useLanguageSafe()

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

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className={`min-h-screen transition-all duration-300 font-sans ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
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
            {t("back")}
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

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div
            className={`rounded-3xl border-2 p-12 shadow-lg ${
              isDarkMode ? "bg-gray-800 border-yellow-400/20" : "bg-white border-gray-200"
            }`}
          >
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className={`text-5xl font-bold mb-6 ${isDarkMode ? "text-yellow-400" : "text-gray-800"}`}>
                {t("supportTitle")}
              </h1>
              <p className={`text-xl leading-relaxed ${isDarkMode ? "text-yellow-200" : "text-gray-600"}`}>
                {t("supportDescription")}
              </p>
            </div>

            {/* Support Content */}
            <div className="space-y-8">
              {/* QR Code Section */}
              <div
                className={`p-6 rounded-lg border ${
                  isDarkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
                }`}
              >
                <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-yellow-300" : "text-gray-800"}`}>
                  📱 {t("qrCodePromptPay")}
                </h2>
                <div className="flex flex-col items-center space-y-4">
                  <div
                    className={`w-48 h-48 rounded-lg flex items-center justify-center ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <Image
                      src="/images/promptpay-qr.png"
                      alt={t("qrCodePromptPay")}
                      width={192} // 48 * 4 (tailwind w-48 is 192px)
                      height={192} // 48 * 4
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className={`text-center ${isDarkMode ? "text-yellow-200" : "text-gray-600"}`}>{t("scanQrCode")}</p>
                </div>
              </div>

              {/* Other Support Methods */}
              <div
                className={`p-6 rounded-lg border ${
                  isDarkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
                }`}
              >
                <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-yellow-300" : "text-gray-800"}`}>
                  🤝 {t("otherWaysToSupport")}
                </h2>
                <div className="space-y-3">
                  <div className={`${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
                    <p>{t("shareWebsite")}</p>
                    <p>{t("giveFeedback")}</p>
                    <p>{t("reportErrors")}</p>
                    <p>{t("writeReview")}</p>
                  </div>
                </div>
              </div>

              {/* Book Recommendation Section */}
              <div
                className={`p-6 rounded-lg border ${
                  isDarkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
                }`}
              >
                <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? "text-yellow-300" : "text-gray-800"}`}>
                  📚 {t("bookRecommendationTitle")}
                </h2>
                <p className={`mb-6 ${isDarkMode ? "text-yellow-200" : "text-gray-700"}`}>
                  {t("bookRecommendationDescription")}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Book Cover */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <Image
                        src="/images/money-summary-book.png"
                        alt="Money Summary Book Cover"
                        width={300}
                        height={400}
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-yellow-200" : "text-gray-800"}`}>
                        {t("bookTitle")}
                      </h3>
                      <p className={`text-lg mb-3 ${isDarkMode ? "text-yellow-300" : "text-blue-600"}`}>
                        {t("bookSubtitle")}
                      </p>
                      <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {t("bookAuthor")}
                      </p>
                    </div>

                    <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800/50" : "bg-blue-50"}`}>
                      <h4 className={`font-semibold mb-2 ${isDarkMode ? "text-yellow-300" : "text-blue-700"}`}>
                        ✨ {t("bookHighlights")}
                      </h4>
                      <ul className={`space-y-1 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        <li>{t("bookFeature1")}</li>
                        <li>{t("bookFeature2")}</li>
                        <li>{t("bookFeature3")}</li>
                        <li>{t("bookFeature4")}</li>
                      </ul>
                    </div>

                    <div className="pt-4">
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>💡 {t("bookNote")}</p>
                    </div>
                  </div>
                </div>

                {/* Bookstore Button */}
                <div className="mt-8 text-center">
                  <a
                    href={t("bookstoreLink")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-md transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      isDarkMode
                        ? "bg-yellow-500 text-black hover:bg-yellow-400"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {t("bookstoreButton")}
                  </a>
                </div>

                {/* Sample Infographic */}
                <div className="mt-8">
                  <h4 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-yellow-300" : "text-gray-800"}`}>
                    📊 {t("sampleContent")}
                  </h4>
                  <div className="flex justify-center">
                    <Image
                      src="/images/book-infographic-sample.png"
                      alt="Book Infographic Sample"
                      width={400}
                      height={600}
                      className="rounded-lg shadow-md"
                    />
                  </div>
                  <p className={`text-center text-sm mt-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {t("sampleContentCaption")}
                  </p>
                </div>
              </div>

              {/* Thank You Message */}
              <div className="text-center">
                <div
                  className={`inline-block p-6 rounded-lg border ${
                    isDarkMode ? "bg-yellow-500/10 border-yellow-400/30" : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-yellow-300" : "text-blue-800"}`}>
                    🙏 {t("thankYouForSupport")}
                  </h3>
                  <p className={`${isDarkMode ? "text-yellow-200" : "text-blue-700"}`}>{t("supportHelpsDevelop")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer isDarkMode={isDarkMode} />
      </div>
    </div>
  )
}
