export interface CookieProduct {
  id: string
  name: string
  price: number
  upc: string
  description: string
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  total: number
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED'
  stripePaymentIntentId?: string
  createdAt: string
  paidAt?: string
  items: OrderItem[]
}

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED'
