'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { usePathname } from 'next/navigation'
import { getRestaurant, getDefaultRestaurant, type Restaurant } from '@/lib/restaurant'

type RestaurantContextType = {
  restaurant: Restaurant | null
  loading: boolean
  refresh: () => Promise<void>
  slug: string
}

const RestaurantContext = createContext<RestaurantContextType>({
  restaurant: null,
  loading: true,
  refresh: async () => {},
  slug: 'food-junction',
})

// Reserved routes — ye slug nahi hain
const RESERVED_ROUTES = [
  'admin', 'api', 'login', 'signup', 'cart', 'checkout',
  'track-order', 'profile', 'menu', 'offers', 'about', 'contact', 'gallery',
  'privacy', 'terms',
]

const DEFAULT_SLUG = 'food-junction'

// Minimum loading time (development: 5s, production: 1.5s)
const MIN_LOADING_TIME =
  process.env.NODE_ENV === 'development' ? 5000 : 1500

// URL se slug nikalo
function getSlugFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0] || ''
  if (firstSegment && !RESERVED_ROUTES.includes(firstSegment)) {
    return firstSegment
  }
  return DEFAULT_SLUG
}

export function RestaurantProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>(DEFAULT_SLUG)

  const load = async (currentSlug: string) => {
    setLoading(true)
    const startTime = Date.now()

    try {
      // Try to fetch by slug
      let data = await getRestaurant(currentSlug)

      // Agar nahi mila aur default slug nahi hai toh default try karo
      if (!data && currentSlug !== DEFAULT_SLUG) {
        console.warn(`Restaurant "${currentSlug}" not found, falling back to default`)
        data = await getDefaultRestaurant()
      }

      // Agar still nahi mila toh default
      if (!data) {
        data = await getDefaultRestaurant()
      }

      // Minimum loading time ensure karo
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, MIN_LOADING_TIME - elapsed)
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining))
      }

      setRestaurant(data)
    } catch (err) {
      console.error('Failed to load restaurant:', err)
      const fallback = await getDefaultRestaurant()

      // Minimum loading time ensure karo (error case mein bhi)
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, MIN_LOADING_TIME - elapsed)
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining))
      }

      setRestaurant(fallback)
    }
    setLoading(false)
  }

  useEffect(() => {
    const detectedSlug = getSlugFromPath(pathname)
    setSlug(detectedSlug)
    load(detectedSlug)
  }, [pathname])

  const refresh = async () => {
    await load(slug)
  }

  return (
    <RestaurantContext.Provider
      value={{ restaurant, loading, refresh, slug }}
    >
      {children}
    </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  return useContext(RestaurantContext)
}