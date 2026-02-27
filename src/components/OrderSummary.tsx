import { Order, OrderItem } from '@/types'
import { getCookieProducts } from '@/lib/cookie-products'

interface OrderSummaryProps {
  order: Order
}

export default function OrderSummary({ order }: OrderSummaryProps) {
  const cookieProducts = getCookieProducts()
  
  const getProductName = (productId: string) => {
    const product = cookieProducts.find(p => p.id === productId)
    return product?.name || 'Unknown Product'
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg">Order #{order.id.slice(-8)}</h4>
        <span className={`px-2 py-1 rounded text-sm font-medium ${
          order.status === 'PAID' ? 'bg-green-100 text-green-800' :
          order.status === 'FAILED' ? 'bg-red-100 text-red-800' :
          order.status === 'CANCELLED' ? 'bg-gray-100 text-gray-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {order.status}
        </span>
      </div>
      
      <div className="space-y-2">
        {order.items.map((item: OrderItem) => (
          <div key={item.id} className="flex justify-between items-center py-2 border-b">
            <div>
              <h5 className="font-medium">{getProductName(item.productId)}</h5>
              <p className="text-sm text-gray-600">
                ${item.unitPrice.toFixed(2)} × {item.quantity}
              </p>
            </div>
            <span className="font-medium">
              ${(item.unitPrice * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total:</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
        {order.paidAt && (
          <p>Paid: {new Date(order.paidAt).toLocaleString()}</p>
        )}
      </div>
    </div>
  )
}
