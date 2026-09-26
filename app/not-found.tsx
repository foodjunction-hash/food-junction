import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl md:text-9xl font-bold bg-gradient-to-br from-gold via-gold-light to-gold-dark bg-clip-text text-transparent mb-4">
          404
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-3">Page not found</h1>
        <p className="text-white/60 text-sm mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-6 py-3 rounded-full hover:scale-105 transition-all shadow-lg shadow-gold/20"
          >
            <Home size={16} />
            Go Home
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 font-semibold px-6 py-3 rounded-full transition-all border border-white/10 hover:border-white/20"
          >
            <Search size={16} />
            Browse Menu
          </Link>
        </div>
      </div>
    </div>
  )
}