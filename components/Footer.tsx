import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative bg-night-soft border-t border-gold/10 mt-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-gold/5 rounded-full blur-[100px]" />

      {/* Top gold divider */}
      <div className="divider-gold" />

      <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* ===== Brand ===== */}
          <div>
            <div className="flex items-center gap-3 mb-5 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gold/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src="/food-junction-logo.png"
                  alt="Food Junction Logo"
                  className="relative w-14 h-14 rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div>
                <p className="text-xl text-gold font-bold">Food Junction</p>
                <p className="text-xs text-white/50 tracking-[0.2em]">
                  THE FAMILY RESTAURANT
                </p>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-5 leading-relaxed">
              Serving delicious, hygienic food to families in Amarpur. Taste
              that brings family together. 🍽️
            </p>

            {/* Instagram */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/shubhamyadav_9272"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-gold hover:to-gold-dark hover:border-gold hover:scale-110 transition-all duration-300 text-lg"
              >
                <span className="group-hover:scale-110 transition-transform">
                  📷
                </span>
              </a>
            </div>
          </div>

          {/* ===== Quick Links ===== */}
          <div>
            <h4 className="font-bold text-gold mb-5 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gold/50" />
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/menu', label: 'Menu' },
                { href: '/offers', label: 'Offers' },
                { href: '/about', label: 'About' },
                { href: '/track-order', label: 'Track Order' },
              ].map((l, i) => (
                <li key={i}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-white/60 hover:text-gold transition-all duration-300 hover:translate-x-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-gold/50 group-hover:w-3 group-hover:bg-gold transition-all duration-300" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== Contact ===== */}
          <div>
            <h4 className="font-bold text-gold mb-5 relative inline-block">
              Contact Us
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gold/50" />
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3 text-white/60 group">
                <MapPin
                  size={16}
                  className="text-gold mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform"
                />
                <span>Amarpur, Bihar</span>
              </li>
              <li className="flex items-start gap-3 text-white/60 group">
                <Phone
                  size={16}
                  className="text-gold mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform"
                />
                <a
                  href="tel:+919973318421"
                  className="hover:text-gold transition-colors"
                >
                  +91 99733 18421
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/60 group">
                <Mail
                  size={16}
                  className="text-gold mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform"
                />
                <a
                  href="mailto:shubhamydv9272@gmail.com"
                  className="hover:text-gold transition-colors break-all"
                >
                  shubhamydv9272@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* ===== Hours ===== */}
          <div>
            <h4 className="font-bold text-gold mb-5 relative inline-block">
              Opening Hours
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gold/50" />
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-white/60">
                <Clock size={16} className="text-gold" />
                <span>Mon – Sun</span>
              </li>
              <li className="pl-6 font-semibold text-white text-base">
                10:00 AM – 10:00 PM
              </li>
              <li className="pt-3">
                <span className="inline-flex items-center gap-2 text-fresh font-semibold text-sm glass-gold border border-fresh/30 px-3 py-1.5 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fresh opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-fresh"></span>
                  </span>
                  Currently Open
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ===== Bottom Bar ===== */}
        <div className="divider-gold mt-12 mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>
            © 2025 Food Junction – The Family Restaurant. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="hover:text-gold transition-colors relative group"
            >
              Privacy
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="/terms"
              className="hover:text-gold transition-colors relative group"
            >
              Terms
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom gold divider */}
      <div className="divider-gold" />
    </footer>
  )
}