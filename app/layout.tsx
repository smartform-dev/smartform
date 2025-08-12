import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers";
import { ClerkProvider } from '@clerk/nextjs';

export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmartForm",
  description: "Create intelligent contact forms with AI-powered responses",
  keywords: ["SmartForm", "AI form builder", "intelligent forms", "contact forms", "AI responses"],
  metadataBase: new URL("https://smartform.dev"),
  openGraph: {
    title: "SmartForm",
    description: "Create intelligent contact forms with AI-powered responses",
    url: "https://smartform.dev",
    siteName: "SmartForm",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SmartForm - AI Form Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartForm",
    description: "Create intelligent contact forms with AI-powered responses",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
