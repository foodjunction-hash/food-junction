export type OrderType = 'delivery' | 'takeaway' | 'dinein'
export type PaymentMethod = 'cash' | 'upi' | 'online'
export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'ready' | 'delivered'

export type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export type Order = {
  id: string
  orderNumber: string
  createdAt: string
  items: OrderItem[]
  subtotal: number
  deliveryCharge: number
  tax: number
  total: number
  orderType: OrderType
  paymentMethod: PaymentMethod
  paymentStatus: 'pending' | 'paid'
  status: OrderStatus
  transactionId?: string
  customer: {
    name: string
    mobile: string
    email?: string
    address?: string
    landmark?: string
    pincode?: string
    instructions?: string
    tableNumber?: string
  }
}

const STORAGE_KEY = 'fj-orders'

export function saveOrder(order: Order) {
  if (typeof window === 'undefined') return
  const orders = getOrders()
  orders.unshift(order)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function getOrderById(id: string): Order | null {
  const orders = getOrders()
  return orders.find((o) => o.id === id || o.orderNumber === id) || null
}

export function generateOrderNumber(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `FJ${date}${rand}`
}

export function generateOrderId(): string {
  return `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// ==================== Status Management ====================

export function updateOrderStatus(id: string, status: OrderStatus): Order | null {
  if (typeof window === 'undefined') return null
  const orders = getOrders()
  const index = orders.findIndex((o) => o.id === id || o.orderNumber === id)
  if (index === -1) return null
  orders[index] = { ...orders[index], status }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  return orders[index]
}

export const ORDER_STATUSES: {
  key: OrderStatus
  label: string
  emoji: string
  desc: string
}[] = [
  {
    key: 'placed',
    label: 'Order Placed',
    emoji: '📝',
    desc: 'We received your order',
  },
  {
    key: 'accepted',
    label: 'Restaurant Accepted',
    emoji: '✅',
    desc: 'Restaurant confirmed your order',
  },
  {
    key: 'preparing',
    label: 'Preparing',
    emoji: '👨‍🍳',
    desc: 'Chef is cooking your food',
  },
  {
    key: 'ready',
    label: 'Food Ready',
    emoji: '🍽️',
    desc: 'Your food is ready',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    emoji: '🎉',
    desc: 'Enjoy your meal!',
  },
]