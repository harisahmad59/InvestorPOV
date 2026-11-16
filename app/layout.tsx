import type { Metadata, Viewport } from 'next'
import { Arimo, Funnel_Sans, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const funnel = Funnel_Sans({
  subsets: ['latin'],
  variable: '--font-funnel',
  display: 'swap',
})

// The hero follows the Figma design, which is set in Inter with Arimo for field text.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  axes: ['opsz'],
})

const arimo = Arimo({
  subsets: ['latin'],
  variable: '--font-arimo',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.investorpov.com'),
  title: {
    default: 'InvestorPOV: a first-read investment memo for any startup',
    template: '%s · InvestorPOV',
  },
  description:
    "Enter a startup's domain. InvestorPOV reads its homepage and drafts a first-read investment memo: market, competitors, strengths, risks and a score.",
  openGraph: {
    title: 'InvestorPOV',
    description:
      "A first-read investment memo for any startup, drafted from the company's own homepage.",
    url: 'https://www.investorpov.com',
    siteName: 'InvestorPOV',
    type: 'website',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#fafaf8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${funnel.variable} ${inter.variable} ${arimo.variable}`}>
      <body className="font-sans antialiased">
        <noscript>
          <style>{`.reveal,.reveal-line,.enter,.enter-line,.enter-sheet{opacity:1!important;transform:none!important;animation:none!important;clip-path:none!important;filter:none!important}`}</style>
        </noscript>
        <a href="#content" className="skip-link btn btn-primary">
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
