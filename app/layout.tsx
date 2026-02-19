import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Sans_Thai } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/LanguageContext"

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "The1% by Narets Ngamsatain",
  description: "กำหนดเป้าหมายชีวิต 6 ด้าน ด้านละ 1 เป้าหมาย ที่จะตั้งใจทำให้สำเร็จ",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon-32x32.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${ibmPlexSansThai.className} antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
