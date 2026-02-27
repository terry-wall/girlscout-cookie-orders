'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface QRCodeDisplayProps {
  url: string
  size?: number
}

export default function QRCodeDisplay({ url, size = 200 }: QRCodeDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const qrCode = await QRCode.toDataURL(url, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        })
        
        setQrCodeUrl(qrCode)
      } catch (err) {
        console.error('Failed to generate QR code:', err)
        setError('Failed to generate QR code')
      } finally {
        setLoading(false)
      }
    }

    if (url) {
      generateQRCode()
    }
  }, [url, size])

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ height: size, width: size }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gs-green"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center bg-gray-100 rounded" style={{ height: size, width: size }}>
        <p className="text-red-600 text-sm text-center">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <img 
        src={qrCodeUrl} 
        alt="QR Code for payment" 
        className="border rounded"
        style={{ maxWidth: size, maxHeight: size }}
      />
    </div>
  )
}
