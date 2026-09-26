import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import StickyCart from '@/components/StickyCart'
import InstallPWA from '@/components/InstallPWA'
import BackgroundMusic from '@/components/BackgroundMusic'
import RestaurantStatusBanner from '@/components/RestaurantStatusBanner'
import OfferBannerPopup from '@/components/OfferBannerPopup'
import { ToastProvider } from '@/components/Toast'

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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Food Junction',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  formatDetection: {
    telephone: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#F5B301',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F5B301" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Food Junction" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased min-h-screen">
        <ToastProvider>
          <RestaurantStatusBanner />
          {children}
          <StickyCart />
          <InstallPWA />
          <BackgroundMusic />
          <OfferBannerPopup />

          {/* Service Worker Registration */}
          <Script id="service-worker-registration" strategy="afterInteractive">
            {`
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('SW registered:', registration.scope);
                    },
                    function(err) {
                      console.log('SW registration failed:', err);
                    }
                  );
                });
              }
            `}
          </Script>
        </ToastProvider>
      </body>
    </html>
  )
}