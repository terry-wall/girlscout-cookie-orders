'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Scanner from '@/components/Scanner'
import { CookieProduct } from '@/types'
import { getCookieByUPC } from '@/lib/cookie-products'

type OrderItem = {
  product: CookieProduct
  quantity: number
}

export default function HomePage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleScan = async (upc: string) => {
    const product = getCookieByUPC(upc)
    if (product) {
      const existingItem = orderItems.find(item => item.product.upc === upc)
      if (existingItem) {
        setOrderItems(prev => 
          prev.map(item => 
            item.product.upc === upc 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        )
      } else {
        setOrderItems(prev => [...prev, { product, quantity: 1 }])
      }
    } else {
      alert('Product not found. Please check the UPC code.')
    }
  }

  const updateQuantity = (upc: string, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems(prev => prev.filter(item => item.product.upc !== upc))
    } else {
      setOrderItems(prev => 
        prev.map(item => 
          item.product.upc === upc 
            ? { ...item, quantity }
            : item
        )
      )
    }
  }

  const createOrder = async () => {
    if (orderItems.length === 0) {
      alert('Please add items to your order first.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: item.product.price
          }))
        })
      })

      if (response.ok) {
        const order = await response.json()
        router.push(`/scout/${order.id}`)
      } else {
        throw new Error('Failed to create order')
      }
    } catch (error) {
      alert('Failed to create order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const total = orderItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Create New Cookie Order</h2>
        <p className="text-gray-600">Scan cookie box UPCs to add items to your order</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Scanner</h3>
          <Scanner onScan={handleScan} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          
          {orderItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No items added yet</p>
          ) : (
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.product.upc} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">${item.product.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product.upc, item.quantity - 1)}
                      className="bg-red-500 text-white w-8 h-8 rounded flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.upc, item.quantity + 1)}
                      className="bg-green-500 text-white w-8 h-8 rounded flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={createOrder}
            disabled={loading || orderItems.length === 0}
            className="w-full mt-6 bg-gs-green text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      </div>
    </div>
  )
}
