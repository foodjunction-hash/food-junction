'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

type Props = {
  children: ReactNode
  fallback?: ReactNode
}

type State = {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            {/* Icon */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-red-500/40 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl shadow-red-500/40 border-4 border-red-400/30">
                <AlertTriangle size={36} className="text-white" strokeWidth={2.5} />
              </div>
            </div>

            {/* Text */}
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              Something went wrong
            </h1>
            <p className="text-white/60 text-sm mb-6">
              We&apos;re sorry for the trouble. Please try again.
            </p>

            {/* Error detail (dev only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-left">
                <p className="text-xs font-mono text-red-300 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-6 py-3 rounded-full hover:scale-105 transition-all shadow-lg shadow-gold/20"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 font-semibold px-6 py-3 rounded-full transition-all border border-white/10 hover:border-white/20"
              >
                <Home size={16} />
                Go Home
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}