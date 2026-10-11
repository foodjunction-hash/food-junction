'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import QRCode from 'qrcode'
import {
  QrCode,
  Printer,
  Download,
  Plus,
  Minus,
  Smartphone,
  Zap,
  BellRing,
  Sparkles,
} from 'lucide-react'
import { useRestaurant } from '@/lib/restaurantContext'
import AdminLoading from '@/components/AdminLoading'

export default function AdminTablesPage() {
  const params = useParams()
  const slug = (params?.slug as string) || ''
  const { restaurant, loading: contextLoading } = useRestaurant()
  
  const [tableCount, setTableCount] = useState(10)
  const [qrCodes, setQrCodes] = useState<{ table: number; dataUrl: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [baseUrl, setBaseUrl] = useState('')
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const url =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:3000'
    setBaseUrl(url)
    if (slug) {
      generateQRCodes(tableCount, url, slug)
    }
  }, [slug])

  useEffect(() => {
    if (baseUrl && slug) {
      generateQRCodes(tableCount, baseUrl, slug)
    }
  }, [tableCount, baseUrl, slug])

  const generateQRCodes = async (count: number, url: string, currentSlug: string) => {
    setLoading(true)
    const codes: { table: number; dataUrl: string }[] = []

    for (let i = 1; i <= count; i++) {
      const qrUrl = `${url}/${currentSlug}/menu?table=${i}`
      try {
        const dataUrl = await QRCode.toDataURL(qrUrl, {
          width: 800,
          margin: 1,
          color: {
            dark: '#0B0B0F',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        })
        codes.push({ table: i, dataUrl })
      } catch (err) {
        console.error(`Failed to generate QR for table ${i}:`, err)
      }
    }

    setQrCodes(codes)
    setLoading(false)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async (table: number, qrDataUrl: string) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 700
    const height = 1000
    canvas.width = width
    canvas.height = height

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)

    const logoImage = new Image()
    logoImage.src = restaurant?.logo_url || '/food-junction-logo.png'
    await new Promise<void>((resolve) => {
      logoImage.onload = () => resolve()
      logoImage.onerror = () => resolve()
    })

    // Header
    ctx.fillStyle = '#0B0B0F'
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(`TABLE ${String(table).padStart(2, '0')}`, width - 40, 60)

    // Logo
    ctx.save()
    ctx.beginPath()
    ctx.arc(70, 70, 35, 0, Math.PI * 2)
    ctx.clip()
    if (logoImage.complete && logoImage.naturalWidth > 0) {
      ctx.drawImage(logoImage, 35, 35, 70, 70)
    } else {
      ctx.fillStyle = '#F5B301'
      ctx.fillRect(35, 35, 70, 70)
      ctx.restore()
      ctx.save()
      ctx.fillStyle = '#0B0B0F'
      ctx.font = 'bold 26px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('RJ', 70, 70)
    }
    ctx.restore()

    ctx.beginPath()
    ctx.arc(70, 70, 35, 0, Math.PI * 2)
    ctx.strokeStyle = '#F5B301'
    ctx.lineWidth = 3
    ctx.stroke()

    // Restaurant name
    const restaurantName = restaurant?.name || 'FOOD JUNCTION'
    const tagline = restaurant?.tagline || 'THE FAMILY RESTAURENT'
    
    ctx.fillStyle = '#0B0B0F'
    ctx.font = 'bold 26px Arial'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(restaurantName.toUpperCase(), 120, 62)

    ctx.font = 'bold 18px Arial'
    ctx.fillText(tagline.toUpperCase(), 120, 88)

    ctx.fillStyle = '#0B0B0F'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('S C A N   •   O R D E R   •   E N J O Y', width / 2, 140)

    // Big heading
    ctx.fillStyle = '#0B0B0F'
    ctx.font = 'bold 42px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Scan to order', width / 2, 220)
    ctx.fillText('from your phone', width / 2, 270)

    // Subtext
    ctx.fillStyle = '#6B7280'
    ctx.font = '20px Arial'
    ctx.fillText('View menu, place order,', width / 2, 330)
    ctx.fillText('and get served — instantly.', width / 2, 358)

    // QR
    const qrImage = new Image()
    qrImage.src = qrDataUrl

    await new Promise<void>((resolve) => {
      qrImage.onload = () => resolve()
    })

    const qrSize = 320
    const qrX = (width - qrSize) / 2
    const qrY = 400

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(qrX, qrY, qrSize, qrSize)
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize)

    // Logo overlay in center of QR
    const centerX = width / 2
    const centerY = qrY + qrSize / 2
    const logoRadius = 34

    ctx.beginPath()
    ctx.arc(centerX, centerY, logoRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#FFFFFF'
    ctx.fill()

    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, logoRadius - 3, 0, Math.PI * 2)
    ctx.clip()
    if (logoImage.complete && logoImage.naturalWidth > 0) {
      ctx.drawImage(
        logoImage,
        centerX - (logoRadius - 3),
        centerY - (logoRadius - 3),
        (logoRadius - 3) * 2,
        (logoRadius - 3) * 2
      )
    } else {
      ctx.fillStyle = '#F5B301'
      ctx.fillRect(
        centerX - (logoRadius - 3),
        centerY - (logoRadius - 3),
        (logoRadius - 3) * 2,
        (logoRadius - 3) * 2
      )
      ctx.restore()
      ctx.save()
      ctx.fillStyle = '#0B0B0F'
      ctx.font = 'bold 22px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('RJ', centerX, centerY + 1)
    }
    ctx.restore()

    ctx.beginPath()
    ctx.arc(centerX, centerY, logoRadius, 0, Math.PI * 2)
    ctx.strokeStyle = '#F5B301'
    ctx.lineWidth = 3
    ctx.stroke()

    // Icons row
    const iconY = 780
    const iconSpacing = width / 3
    const iconCenters = [iconSpacing / 2, width / 2, (width * 5) / 6]

    // Icon 1 - Phone
    ctx.strokeStyle = '#0B0B0F'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.roundRect(iconCenters[0] - 14, iconY - 22, 28, 44, 5)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(iconCenters[0], iconY + 15, 2, 0, Math.PI * 2)
    ctx.fillStyle = '#0B0B0F'
    ctx.fill()

    // Icon 2 - Zap
    ctx.beginPath()
    ctx.moveTo(iconCenters[1] - 4, iconY - 22)
    ctx.lineTo(iconCenters[1] + 8, iconY - 22)
    ctx.lineTo(iconCenters[1] - 2, iconY + 2)
    ctx.lineTo(iconCenters[1] + 6, iconY + 2)
    ctx.lineTo(iconCenters[1] - 8, iconY + 24)
    ctx.lineTo(iconCenters[1] - 2, iconY + 2)
    ctx.lineTo(iconCenters[1] - 10, iconY + 2)
    ctx.closePath()
    ctx.fillStyle = '#0B0B0F'
    ctx.fill()

    // Icon 3 - Bell
    ctx.beginPath()
    ctx.arc(iconCenters[2], iconY + 2, 16, Math.PI, 0)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(iconCenters[2] - 18, iconY + 2)
    ctx.lineTo(iconCenters[2] + 18, iconY + 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(iconCenters[2], iconY + 8, 3, 0, Math.PI)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(iconCenters[2], iconY - 14, 2, 0, Math.PI * 2)
    ctx.fillStyle = '#0B0B0F'
    ctx.fill()

    // Labels
    ctx.fillStyle = '#0B0B0F'
    ctx.font = 'bold 14px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('Browse', iconCenters[0], iconY + 60)
    ctx.fillText('Menu', iconCenters[0], iconY + 78)
    ctx.fillText('Place', iconCenters[1], iconY + 60)
    ctx.fillText('Order', iconCenters[1], iconY + 78)
    ctx.fillText('Get', iconCenters[2], iconY + 60)
    ctx.fillText('Served', iconCenters[2], iconY + 78)

    // Footer
    const footerY = 920
    ctx.fillStyle = '#0B0B0F'
    ctx.fillRect(0, footerY, width, height - footerY)

    ctx.save()
    ctx.beginPath()
    ctx.arc(50, footerY + 40, 25, 0, Math.PI * 2)
    ctx.clip()
    if (logoImage.complete && logoImage.naturalWidth > 0) {
      ctx.drawImage(logoImage, 25, footerY + 15, 50, 50)
    } else {
      ctx.fillStyle = '#F5B301'
      ctx.fillRect(25, footerY + 15, 50, 50)
      ctx.restore()
      ctx.save()
      ctx.fillStyle = '#0B0B0F'
      ctx.font = 'bold 18px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('RJ', 50, footerY + 40)
    }
    ctx.restore()

    ctx.beginPath()
    ctx.arc(50, footerY + 40, 25, 0, Math.PI * 2)
    ctx.strokeStyle = '#F5B301'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(restaurantName.toUpperCase(), 90, footerY + 34)
    ctx.font = 'bold 13px Arial'
    ctx.fillText(tagline.toUpperCase(), 90, footerY + 54)

    ctx.strokeStyle = '#FFFFFF'
    ctx.globalAlpha = 0.3
    ctx.beginPath()
    ctx.moveTo(width - 230, footerY + 20)
    ctx.lineTo(width - 230, footerY + 60)
    ctx.stroke()
    ctx.globalAlpha = 1

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 13px Arial'
    ctx.textAlign = 'left'
    ctx.fillText('GOOD FOOD', width - 210, footerY + 34)
    ctx.fillText('BETTER FLOW', width - 210, footerY + 54)

    const link = document.createElement('a')
    link.download = `${slug}-table-${table}.png`
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
  }

  const handleDownloadAll = async () => {
    for (let i = 0; i < qrCodes.length; i++) {
      await handleDownload(qrCodes[i].table, qrCodes[i].dataUrl)
      await new Promise((r) => setTimeout(r, 400))
    }
  }

  // 🚨 KHATARNAK LOADING SCREEN
  if (contextLoading || loading) {
    return <AdminLoading message="Generating QR Codes" />
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-6 print:hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-night">
            <QrCode size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-gold animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
                Table QR Codes
              </h1>
            </div>
            <p className="text-white/50 text-sm">
              {restaurant?.name || 'Restaurant'} ke liye premium table stand cards
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="relative z-10 bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 rounded-2xl p-5 mb-6 print:hidden">
        <h2 className="font-bold text-gold mb-2">💡 How It Works</h2>
        <ol className="text-sm text-white/70 space-y-1.5 list-decimal list-inside">
          <li>Set the number of tables in your restaurant</li>
          <li>Download each table's QR card (PNG)</li>
          <li>Print on thick paper or put in acrylic stand</li>
          <li>Place on the respective table</li>
          <li>Customer scans QR → Menu opens with table auto-filled</li>
        </ol>
      </div>

      {/* Controls */}
      <div className="relative z-10 bg-night-card border border-white/5 rounded-2xl p-5 mb-6 print:hidden">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-white/70 font-semibold">
              Number of Tables:
            </label>
            <div className="flex items-center gap-2 bg-night rounded-full border border-gold/30 p-1">
              <button
                onClick={() => setTableCount(Math.max(1, tableCount - 1))}
                className="w-8 h-8 rounded-full text-gold font-bold hover:bg-gold/10 transition flex items-center justify-center"
              >
                <Minus size={14} />
              </button>
              <span className="text-gold font-bold w-10 text-center">
                {tableCount}
              </span>
              <button
                onClick={() => setTableCount(Math.min(50, tableCount + 1))}
                className="w-8 h-8 rounded-full bg-gold text-night font-bold hover:bg-gold-light transition flex items-center justify-center"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 ml-auto">
            <button
              onClick={handleDownloadAll}
              disabled={loading || qrCodes.length === 0}
              className="flex items-center gap-2 bg-fresh/20 text-fresh border border-fresh/40 font-bold text-sm px-4 py-2.5 rounded-full hover:bg-fresh/30 transition disabled:opacity-50"
            >
              <Download size={16} /> Download All
            </button>
            <button
              onClick={handlePrint}
              disabled={loading || qrCodes.length === 0}
              className="flex items-center gap-2 bg-gradient-to-br from-gold to-gold-dark text-night font-bold text-sm px-4 py-2.5 rounded-full hover:shadow-gold transition disabled:opacity-50"
            >
              <Printer size={16} /> Print Preview
            </button>
          </div>
        </div>
      </div>

      {/* QR Grid */}
      {!loading && qrCodes.length > 0 && (
        <div
          ref={printRef}
          className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 print:grid-cols-2 print:gap-6 print:p-6"
        >
          {qrCodes.map((qr) => (
            <div
              key={qr.table}
              className="relative bg-white rounded-xl shadow-2xl overflow-hidden print:break-inside-avoid print:shadow-lg"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {/* Header */}
              <div className="relative px-6 pt-5 pb-3 bg-white">
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold flex items-center justify-center bg-white">
                    <img
                      src={restaurant?.logo_url || '/food-junction-logo.png'}
                      alt={restaurant?.name || 'Logo'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-night font-bold text-base">
                    TABLE {String(qr.table).padStart(2, '0')}
                  </p>
                </div>

                <div className="mt-3">
                  <p className="text-night font-bold text-xl leading-tight">
                    {(restaurant?.name || 'FOOD JUNCTION').toUpperCase()}
                  </p>
                  <p className="text-night font-bold text-base leading-tight">
                    {(restaurant?.tagline || 'THE FAMILY RESTAURENT').toUpperCase()}
                  </p>
                </div>

                <p className="text-night text-xs font-bold tracking-[0.25em] text-center mt-4">
                  SCAN • ORDER • ENJOY
                </p>
              </div>

              {/* Big Heading */}
              <div className="px-6 pt-4 text-center">
                <p className="text-night font-bold text-2xl md:text-3xl leading-tight">
                  Scan to order
                </p>
                <p className="text-night font-bold text-2xl md:text-3xl leading-tight">
                  from your phone
                </p>
              </div>

              {/* Subtext */}
              <div className="px-6 pt-4 text-center">
                <p className="text-gray-500 text-sm leading-relaxed">
                  View menu, place order,
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  and get served — instantly.
                </p>
              </div>

              {/* QR Code */}
              <div className="px-8 py-6">
                <div className="relative aspect-square bg-white">
                  <img
                    src={qr.dataUrl}
                    alt={`Table ${qr.table} QR`}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full overflow-hidden border-2 border-gold bg-white shadow-md flex items-center justify-center">
                    <img
                      src={restaurant?.logo_url || '/food-junction-logo.png'}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Icons Row */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex flex-col items-center">
                    <Smartphone size={28} className="text-night mb-2" />
                    <p className="text-night text-[11px] font-semibold text-center leading-tight">
                      Browse Menu
                    </p>
                  </div>

                  <div className="w-px h-12 bg-gray-200" />

                  <div className="flex-1 flex flex-col items-center">
                    <Zap size={28} className="text-night mb-2" />
                    <p className="text-night text-[11px] font-semibold text-center leading-tight">
                      Place Order
                    </p>
                  </div>

                  <div className="w-px h-12 bg-gray-200" />

                  <div className="flex-1 flex flex-col items-center">
                    <BellRing size={28} className="text-night mb-2" />
                    <p className="text-night text-[11px] font-semibold text-center leading-tight">
                      Get Served
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-night text-white px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gold flex items-center justify-center bg-white flex-shrink-0">
                    <img
                      src={restaurant?.logo_url || '/food-junction-logo.png'}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs leading-tight truncate">
                      {(restaurant?.name || 'FOOD JUNCTION').toUpperCase()}
                    </p>
                    <p className="font-bold text-[10px] leading-tight opacity-90 truncate">
                      {(restaurant?.tagline || 'THE FAMILY RESTAURENT').toUpperCase()}
                    </p>
                  </div>

                  <div className="w-px h-8 bg-white/30" />

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-[10px] leading-tight">
                      GOOD FOOD
                    </p>
                    <p className="font-bold text-[10px] leading-tight">
                      BETTER FLOW
                    </p>
                  </div>
                </div>
              </div>

              {/* Download button */}
              <button
                onClick={() => handleDownload(qr.table, qr.dataUrl)}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-black/60 hover:text-black bg-gray-50 hover:bg-gray-100 transition py-2.5 border-t border-gray-200 print:hidden"
              >
                <Download size={14} /> Download Premium PNG (Table {qr.table})
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            margin: 0.5cm;
          }
        }
      `}</style>
    </div>
  )
}