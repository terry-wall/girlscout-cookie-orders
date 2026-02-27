'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/library'

interface ScannerProps {
  onScan: (code: string) => void
}

export default function Scanner({ onScan }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [manualInput, setManualInput] = useState('')
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  const startScanning = async () => {
    try {
      setError(null)
      setIsScanning(true)
      
      const reader = new BrowserMultiFormatReader()
      readerRef.current = reader
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        
        reader.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
          if (result) {
            const code = result.getText()
            console.log('Scanned code:', code)
            onScan(code)
            stopScanning()
          }
          if (error && error.name !== 'NotFoundException') {
            console.error('Scanner error:', error)
          }
        })
      }
    } catch (err) {
      console.error('Failed to start camera:', err)
      setError('Failed to access camera. Please check permissions.')
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (readerRef.current) {
      readerRef.current.reset()
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    
    setIsScanning(false)
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      onScan(manualInput.trim())
      setManualInput('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="video-container">
        {isScanning ? (
          <>
            <video ref={videoRef} className="w-full h-full object-cover" />
            <div className="scanner-overlay"></div>
          </>
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-500">Camera preview will appear here</p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-red-600 text-sm text-center">{error}</div>
      )}
      
      <div className="flex space-x-2">
        {!isScanning ? (
          <button
            onClick={startScanning}
            className="flex-1 bg-gs-green text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Start Scanner
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Stop Scanner
          </button>
        )}
      </div>
      
      <div className="border-t pt-4">
        <form onSubmit={handleManualSubmit} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Or enter UPC manually:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Enter UPC code"
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
