'use client'

import { useEffect, useState, createContext, useContext, useCallback } from 'react'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

type Toast = {
  id: string
  message: string
  type: ToastType
  duration?: number
}

type ToastContextType = {
  showToast: (message: string, type?: ToastType, duration?: number) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const TOAST_STYLES: Record<
  ToastType,
  { bg: string; border: string; icon: any; iconColor: string; text: string }
> = {
  success: {
    bg: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
    border: 'border-emerald-500/40',
    icon: CheckCircle2,
    iconColor: 'text-fresh',
    text: 'text-fresh',
  },
  error: {
    bg: 'from-red-500/20 via-red-500/10 to-transparent',
    border: 'border-red-500/40',
    icon: XCircle,
    iconColor: 'text-red-400',
    text: 'text-red-300',
  },
  info: {
    bg: 'from-blue-500/20 via-blue-500/10 to-transparent',
    border: 'border-blue-500/40',
    icon: Info,
    iconColor: 'text-blue-400',
    text: 'text-blue-300',
  },
  warning: {
    bg: 'from-gold/20 via-gold/10 to-transparent',
    border: 'border-gold/40',
    icon: AlertTriangle,
    iconColor: 'text-gold',
    text: 'text-gold',
  },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 3500) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
      setToasts((prev) => [...prev, { id, message, type, duration }])
      setTimeout(() => removeToast(id), duration)
    },
    [removeToast]
  )

  const success = useCallback(
    (message: string, duration?: number) => showToast(message, 'success', duration),
    [showToast]
  )
  const error = useCallback(
    (message: string, duration?: number) => showToast(message, 'error', duration),
    [showToast]
  )
  const info = useCallback(
    (message: string, duration?: number) => showToast(message, 'info', duration),
    [showToast]
  )
  const warning = useCallback(
    (message: string, duration?: number) => showToast(message, 'warning', duration),
    [showToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const [show, setShow] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const style = TOAST_STYLES[toast.type]
  const Icon = style.icon

  useEffect(() => {
    // Slide in
    setTimeout(() => setShow(true), 10)
  }, [])

  const handleClose = () => {
    setLeaving(true)
    setTimeout(onClose, 300)
  }

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden bg-night-card/95 backdrop-blur-xl border ${style.border} rounded-2xl shadow-2xl shadow-black/50 transition-all duration-300 ${
        show && !leaving
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      {/* Glow background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${style.bg} pointer-events-none`}
      />

      <div className="relative z-10 flex items-start gap-3 p-4">
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-xl bg-night/60 flex items-center justify-center ${style.iconColor}`}
        >
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <p className={`flex-1 text-sm font-medium ${style.text} leading-snug pt-1`}>
          {toast.message}
        </p>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition text-white/40 hover:text-white"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
        <div
          className={`h-full bg-gradient-to-r ${
            toast.type === 'success'
              ? 'from-fresh to-emerald-600'
              : toast.type === 'error'
              ? 'from-red-500 to-red-600'
              : toast.type === 'warning'
              ? 'from-gold to-yellow-600'
              : 'from-blue-500 to-blue-600'
          }`}
          style={{
            animation: `toastProgress ${toast.duration || 3500}ms linear forwards`,
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes toastProgress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  )
}