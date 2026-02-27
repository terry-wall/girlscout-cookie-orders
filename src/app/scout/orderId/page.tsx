'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import OrderSummary from '@/components/OrderSummary'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import { Order } from '@/types'

export default function ScoutOrderPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const orderData = await response.json()
          setOrder(orderData)
        } else {
          setError('Order not found')
        }
      } catch (err) {
        setError('Failed to load order')
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
      
      // Poll for order status updates every 5 seconds
      const interval = setInterval(fetchOrder, 5000)
      return () => clearInterval(interval)
    }
  }, [orderId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gs-green"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">{error || 'Order not found'}</p>
      </div>
    )
  }

  const customerPaymentUrl = `${window.location.origin}/customer/${orderId}`

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Created!</h2>
        <p className="text-gray-600">Share the QR code or link below with your customer for payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <OrderSummary order={order} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Customer Payment</h3>
          
          <div className="space-y-6">
            <QRCodeDisplay url={customerPaymentUrl} />
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Or share this link:</p>
              <div className="bg-gray-50 p-3 rounded border break-all text-sm">
                {customerPaymentUrl}
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => navigator.clipboard.writeText(customerPaymentUrl)}
                className="bg-gs-green text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Payment Status</h3>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            order.status === 'PAID' ? 'bg-green-500' :
            order.status === 'FAILED' ? 'bg-red-500' :
            order.status === 'CANCELLED' ? 'bg-gray-500' :
            'bg-yellow-500'
          }`}></div>
          <span className="font-medium capitalize">
            {order.status === 'PAID' ? 'Payment Received' :
             order.status === 'FAILED' ? 'Payment Failed' :
             order.status === 'CANCELLED' ? 'Payment Cancelled' :
             'Awaiting Payment'}
          </span>
        </div>
        
        {order.status === 'PAID' && order.paidAt && (
          <p className="text-sm text-gray-600 mt-2">
            Paid on {new Date(order.paidAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}
