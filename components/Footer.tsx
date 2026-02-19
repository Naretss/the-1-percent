"use client"

import { useLanguageSafe } from "@/contexts/LanguageContext"
import { Facebook, Youtube } from "lucide-react"
import Image from "next/image"
import { TiktokIcon } from "@/components/icons/TiktokIcon"

interface FooterProps {
  isDarkMode: boolean
}

export function Footer({ isDarkMode }: FooterProps) {
  const { t } = useLanguageSafe()

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/the.one.percent.money/",
      icon: Facebook,
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@the.one.percents",
      icon: Youtube,
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@the.one.percents",
      icon: TiktokIcon,
    },
  ]

  return (
    <footer
      className={`container mx-auto px-8 py-8 max-w-7xl mt-12 border-t ${
        isDarkMode ? "border-yellow-500/20 text-gray-400" : "border-gray-200 text-gray-500"
      }`}
    >
      <div className="flex flex-col items-center gap-6 text-sm font-normal text-center">
        {/* Social Media Icons */}
        <div className="flex items-center gap-4">
          <span className="font-medium">{t("followUs")}:</span>
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className={`transition-colors ${
                isDarkMode ? "text-gray-400 hover:text-yellow-300" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <social.icon className="w-6 h-6" />
            </a>
          ))}
        </div>

        {/* Copyright and Contact */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <span>
            {t("footerCopyrightPrefix")}{" "}
            <a
              href={socialLinks.find((s) => s.name === "Facebook")?.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 font-medium transition-colors hover:underline ${
                isDarkMode ? "text-yellow-300 hover:text-yellow-200" : "text-blue-600 hover:text-blue-700"
              }`}
            >
              {t("theOnePercent")}
            </a>
          </span>
          <a
            href={socialLinks.find((s) => s.name === "Facebook")?.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-normal transition-colors hover:underline ${
              isDarkMode ? "text-yellow-300 hover:text-yellow-200" : "text-blue-600 hover:text-blue-700"
            }`}
          >
            {t("footerContactPrompt")}
          </a>
        </div>

        {/* Support Section */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span>{t("footerSupportPrompt")}</span>
          <div className="flex items-center gap-2">
            <Image
              src="/images/promptpay-qr.png"
              alt="QR Code PromptPay"
              width={60}
              height={60}
              className="rounded border border-gray-300"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
