import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'InvestorPOV: AI Startup Analysis and VC Investment Memos',
  description: 'Analyze any startup instantly. Paste a website URL to get a comprehensive investment memo, VC score, market sizing TAM projections, SWOT matrix, and competitor mapping.',
  generator: 'InvestorPOV',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
