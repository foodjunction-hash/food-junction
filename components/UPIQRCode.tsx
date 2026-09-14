'use client'

import { useEffect, useState } from 'react'
import { Copy, Check, Smartphone } from 'lucide-react'

type UPIQRCodeProps = {
  upiId: string
  name: string
  amount: number
  note: string
}

export default function UPIQRCode({ upiId, name, amount, note }: UPIQRCodeProps) {
  const [qrUrl, setQrUrl] = useState('')
  const [copied, setCopied] = useState(false)

  // Build UPI URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(
    upiId
  )}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(
    note
  )}`

  useEffect(() => {
    // QR Server API (free, no key needed, reliable)
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      upiUri
    )}`
    setQrUrl(qrApiUrl)
  }, [upiUri])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-night-card border border-gold/30 rounded-2xl p-5 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Smartphone size={20} className="text-gold" />
        <h3 className="font-bold text-lg">Pay via UPI</h3>
      </div>

      <p className="text-xs text-white/50 mb-4">
        Scan this QR with any UPI app (GPay, PhonePe, Paytm)
      </p>

      {/* QR Code */}
      <div className="bg-white p-4 rounded-2xl inline-block mb-4">
        {qrUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrUrl}
            alt="UPI QR Code"
            className="w-48 h-48"
            loading="eager"
          />
        ) : (
          <div className="w-48 h-48 flex items-center justify-center text-black">
            Loading...
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 mb-4">
        <p className="text-xs text-white/50 mb-1">Amount to Pay</p>
        <p className="text-2xl font-bold text-gold">₹{amount}</p>
      </div>

      {/* UPI ID Copy */}
      <div className="bg-night border border-white/10 rounded-xl p-3 flex items-center justify-between gap-2 mb-3">
        <div className="text-left flex-1 min-w-0">
          <p className="text-xs text-white/40">UPI ID</p>
          <p className="font-mono text-sm font-semibold truncate">{upiId}</p>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 hover:bg-white/5 rounded-lg transition flex-shrink-0"
          aria-label="Copy UPI ID"
        >
          {copied ? (
            <Check size={16} className="text-fresh" />
          ) : (
            <Copy size={16} className="text-white/60" />
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="text-left text-xs text-white/50 space-y-1.5 bg-white/5 rounded-xl p-3">
        <p>1. Scan QR with any UPI app</p>
        <p>2. Verify the amount (₹{amount})</p>
        <p>3. Complete payment</p>
        <p>4. Screenshot le lo (proof ke liye)</p>
        <p className="text-gold mt-2 font-semibold">
          5. Payment ke baad UTR number yahan daalo 👇
        </p>
      </div>
    </div>
  )
}