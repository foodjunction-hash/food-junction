import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import StickyCart from '@/components/StickyCart'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Food Junction – The Family Restaurant | Amarpur',
  description:
    'Food Junction – The Family Restaurant in Amarpur. Order delicious food online with easy UPI payment.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen">
        {children}
        <StickyCart />
      </body>
    </html>
  )
}