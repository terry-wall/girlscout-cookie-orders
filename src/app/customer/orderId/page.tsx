'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import OrderSummary from '@/components/OrderSummary'
import PaymentForm from '@/components/PaymentForm'
import { Order } from '@/types'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CustomerPaymentPage() {
  const { orderId } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderAndCreatePayment = async () => {
      try {
        // Fetch order details
        const orderResponse = await fetch(`/api/orders/${orderId}`)
        if (!orderResponse.ok) {
          throw new Error('Order not found')
        }
        
        const orderData = await orderResponse.json()
        setOrder(orderData)
        
        // If already paid, don't create payment intent
        if (orderData.status === 'PAID') {
          return
        }
        
        // Create payment intent
        const paymentResponse = await fetch('/api/stripe/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId })
        })
        
        if (!paymentResponse.ok) {
          throw new Error('Failed to create payment')
        }
        
        const { clientSecret } = await paymentResponse.json()
        setClientSecret(clientSecret)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order')
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderAndCreatePayment()
    }
  }, [orderId])

  const handlePaymentSuccess = () => {
    // Redirect to success page or show success message
    alert('Payment successful! Thank you for your order.')
    router.push('/')
  }

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

  if (order.status === 'PAID') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Received!</h2>
            <p className="text-gray-600 mb-6">Thank you for your Girl Scout cookie order.</p>
            <OrderSummary order={order} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Order</h2>
        <p className="text-gray-600">Review your Girl Scout cookie order and make payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <OrderSummary order={order} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Payment</h3>
          {clientSecret && (
            <Elements 
              stripe={stripePromise} 
              options={{ clientSecret }}
            >
              <PaymentForm 
                clientSecret={clientSecret}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  )
}
