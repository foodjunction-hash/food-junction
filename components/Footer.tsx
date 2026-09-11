import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-night-soft border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-night font-bold text-xl">
                FJ
              </div>
              <div>
                <p className="text-xl text-gold font-bold">Food Junction</p>
                <p className="text-xs text-white/60 tracking-widest">THE FAMILY RESTAURANT</p>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-4">
              Serving delicious, hygienic food to families in Amarpur.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-night-card border border-white/10 flex items-center justify-center hover:bg-gold hover:text-night transition text-lg">
                📷
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-night-card border border-white/10 flex items-center justify-center hover:bg-gold hover:text-night transition text-lg">
                📘
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-night-card border border-white/10 flex items-center justify-center hover:bg-gold hover:text-night transition text-lg">
                ▶️
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/" className="hover:text-gold transition">Home</Link></li>
              <li><Link href="/menu" className="hover:text-gold transition">Menu</Link></li>
              <li><Link href="/offers" className="hover:text-gold transition">Offers</Link></li>
              <li><Link href="/about" className="hover:text-gold transition">About</Link></li>
              <li><Link href="/track-order" className="hover:text-gold transition">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-gold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <span>Amarpur, Bihar</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <a href="tel:+919999999999" className="hover:text-gold">+91 9999999999</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <a href="mailto:info@foodjunction.com" className="hover:text-gold">info@foodjunction.com</a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-bold text-gold mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-gold" />
                <span>Mon – Sun</span>
              </li>
              <li className="pl-6 font-semibold text-white">10:00 AM – 10:00 PM</li>
              <li className="pt-2 text-fresh font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fresh animate-pulse" />
                Currently Open
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-white/40">
          <p>© 2025 Food Junction – The Family Restaurant. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gold">Privacy</Link>
            <Link href="/terms" className="hover:text-gold">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}