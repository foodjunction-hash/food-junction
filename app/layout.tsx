import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import StickyCart from '@/components/StickyCart'
import InstallPWA from '@/components/InstallPWA'
import BackgroundMusic from '@/components/BackgroundMusic'
import RestaurantStatusBanner from '@/components/RestaurantStatusBanner'
import OfferBannerPopup from '@/components/OfferBannerPopup'
import WelcomePopup from '@/components/WelcomePopup'
import { ToastProvider } from '@/components/Toast'
import { RestaurantProvider } from '@/lib/restaurantContext'
import { getDefaultRestaurant } from '@/lib/restaurant'

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

// ============================================
// DYNAMIC METADATA (Server-side)
// ============================================
export async function generateMetadata(): Promise<Metadata> {
  const restaurant = await getDefaultRestaurant()

  const name = restaurant?.name || 'Food Junction'
  const tagline = restaurant?.tagline || 'The Family Restaurant'
  const city = restaurant?.city || 'Amarpur'
  const description =
    restaurant?.short_description ||
    `${name} – ${tagline} in ${city}. Order delicious food online with easy UPI payment.`
  const logoUrl = restaurant?.logo_url || '/icon-192.png'
  const faviconUrl = restaurant?.favicon_url || '/icon-192.png'

  return {
    title: `${name} – ${tagline} | ${city}`,
    description,
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: name,
    },
    icons: {
      icon: faviconUrl,
      apple: logoUrl,
    },
    formatDetection: {
      telephone: true,
    },
    openGraph: {
      title: `${name} – ${tagline}`,
      description,
      images: [logoUrl],
      type: 'website',
    },
  }
}

// ============================================
// DYNAMIC VIEWPORT
// ============================================
export async function generateViewport(): Promise<Viewport> {
  const restaurant = await getDefaultRestaurant()
  const themeColor = restaurant?.primary_color || '#F5B301'

  return {
    themeColor,
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const restaurant = await getDefaultRestaurant()

  const name = restaurant?.name || 'Food Junction'
  const logoUrl = restaurant?.logo_url || '/icon-192.png'
  const faviconUrl = restaurant?.favicon_url || '/icon-192.png'
  const themeColor = restaurant?.primary_color || '#F5B301'

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content={themeColor} />
        <link rel="apple-touch-icon" href={logoUrl} />
        <link rel="icon" type="image/png" href={faviconUrl} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content={name} />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased min-h-screen">
        <RestaurantProvider>
          <ToastProvider>
            <WelcomePopup />
            <RestaurantStatusBanner />
            {children}
            <StickyCart />
            <InstallPWA />
            <BackgroundMusic />
            <OfferBannerPopup />

            {/* Service Worker Registration */}
            <Script
              id="service-worker-registration"
              strategy="afterInteractive"
            >
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
        </RestaurantProvider>
      </body>
    </html>
  )
}