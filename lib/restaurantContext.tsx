'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getDefaultRestaurant, type Restaurant } from '@/lib/restaurant'

type RestaurantContextType = {
  restaurant: Restaurant | null
  loading: boolean
  refresh: () => Promise<void>
}

const RestaurantContext = createContext<RestaurantContextType>({
  restaurant: null,
  loading: true,
  refresh: async () => {},
})

export function RestaurantProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const data = await getDefaultRestaurant()
    setRestaurant(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <RestaurantContext.Provider
      value={{ restaurant, loading, refresh: load }}
    >
      {children}
    </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  return useContext(RestaurantContext)
}