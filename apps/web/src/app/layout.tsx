import type { Metadata } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import { sfProDisplay, neueHaasDisplay, fraunces } from '@/lib/fonts'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'datmotions — Motion Graphics Studio',
  description:
    'Premium Apple-style motion graphics templates. Preview, customize, and export production-ready video.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${sfProDisplay.variable} ${neueHaasDisplay.variable} ${fraunces.variable}`}
    >
      <body className="bg-canvas text-text-primary antialiased">{children}</body>
    </html>
  )
}
