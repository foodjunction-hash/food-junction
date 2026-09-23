'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Crown,
  Code2,
} from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const update = (key: string, value: string) => {
    setForm((s) => ({ ...s, [key]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) return setError('Name required')
    if (!/^\d{10}$/.test(form.mobile.trim()))
      return setError('Enter valid 10-digit mobile')
    if (!form.message.trim()) return setError('Message required')

    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    console.log('Contact form submitted:', form)

    setSuccess(true)
    setLoading(false)
  }

  const CONTACT_CARDS = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 99733 18421',
      href: 'tel:+919973318421',
      color: 'text-gold',
      bg: 'bg-gold/10',
      border: 'border-gold/30',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      value: '+91 99733 18421',
      href: 'https://wa.me/919973318421?text=Hi%20Food%20Junction!',
      color: 'text-fresh',
      bg: 'bg-fresh/10',
      border: 'border-fresh/30',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'shubhamydv9272@gmail.com',
      href: 'mailto:shubhamydv9272@gmail.com',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/30',
    },
  ]

  const TEAM = [
    {
      name: 'Raj Nandni',
      role: 'Owner & Founder',
      photo: '/team/owner.jpg',
      icon: Crown,
      color: 'from-gold to-gold-dark',
      description: 'For any queries about food, orders, or feedback',
    },
    {
      name: 'Shubham Yadav',
      role: 'Web Developer',
      photo: '/team/developer-new.jpg',
      icon: Code2,
      color: 'from-fresh to-fresh-dark',
      description: 'For technical issues, website bugs, or feature requests',
    },
  ]

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden py-16 md:py-24 bg-mesh">
          <div className="absolute inset-0 bg-dots opacity-30" />
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/10 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-fresh/10 blur-[100px]" />

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-gold border border-gold/30 text-gold px-4 py-2 rounded-full text-sm mb-6">
              <Sparkles size={14} />
              <span className="font-semibold">Get in Touch</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
              Contact <span className="text-shimmer">Us</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Koi bhi sawaal ya feedback? Humse baat karein — hum 24/7 available hain! 💬
            </p>
          </div>
        </section>

        {/* ===== Contact Cards ===== */}
        <section className="relative py-12 md:py-16 bg-night-soft">
          <div className="relative max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {CONTACT_CARDS.map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`group bg-night-card border ${c.border} rounded-2xl p-6 text-center card-premium hover:scale-105 transition-all duration-300`}
                >
                  <div
                    className={`w-14 h-14 mx-auto rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <c.icon size={24} className={c.color} />
                  </div>
                  <p className="text-xs text-white/40 tracking-wider mb-1">
                    {c.title.toUpperCase()}
                  </p>
                  <p className={`font-bold ${c.color} group-hover:underline break-all text-sm`}>
                    {c.value}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Talk to Team Section ===== */}
        <section className="relative py-16 md:py-20 bg-mesh">
          <div className="absolute inset-0 bg-dots opacity-30" />

          <div className="relative max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-gold tracking-[0.3em] text-xs md:text-sm mb-3">
                TALK TO US
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Reach the <span className="text-shimmer">Right Person</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">
                Directly contact the team member for your specific query
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {TEAM.map((member, i) => (
                <div
                  key={i}
                  className="group relative bg-night-card border border-white/5 rounded-2xl p-6 card-premium overflow-hidden"
                >
                  {/* Glow */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${member.color} rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity`}
                  />

                  {/* Photo + Info */}
                  <div className="relative flex items-center gap-4 mb-4">
                    {/* Photo */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.color} blur-md opacity-40`}
                      />
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold/40 group-hover:border-gold transition-all">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg group-hover:text-gold transition">
                        {member.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 bg-gradient-to-br ${member.color} text-night text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1`}
                      >
                        <member.icon size={10} />
                        <span>{member.role}</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-white/60 leading-relaxed">
                    {member.description}
                  </p>

                  {/* Contact buttons */}
                  <div className="flex gap-2 mt-4">
                    <a
                      href="https://wa.me/919973318421"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-xs text-center bg-fresh/10 border border-fresh/30 text-fresh font-semibold py-2 rounded-full hover:bg-fresh/20 transition"
                    >
                      💬 WhatsApp
                    </a>
                    <a
                      href="tel:+919973318421"
                      className="flex-1 text-xs text-center bg-gold/10 border border-gold/30 text-gold font-semibold py-2 rounded-full hover:bg-gold/20 transition"
                    >
                      📞 Call
                    </a>
                  </div>

                  {/* Bottom gold line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Form + Map ===== */}
        <section className="relative py-16 md:py-24 bg-night-soft">
          <div className="absolute inset-0 bg-dots opacity-20" />

          <div className="relative max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* LEFT: Contact Form */}
              <div className="bg-night-card border border-white/5 rounded-2xl p-6 md:p-8">
                <div className="mb-6">
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                    Send <span className="text-shimmer">Message</span>
                  </h2>
                  <p className="text-white/50 text-sm">
                    Form fill karein — hum jaldi reply karenge
                  </p>
                </div>

                {success ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto rounded-full bg-fresh/20 border-2 border-fresh flex items-center justify-center mb-4">
                      <CheckCircle2 size={32} className="text-fresh" />
                    </div>
                    <p className="font-bold text-xl mb-2">Message Sent! 🎉</p>
                    <p className="text-white/60 text-sm mb-6">
                      Thank you {form.name}! Hum jaldi aapse contact karenge.
                    </p>
                    <button
                      onClick={() => {
                        setSuccess(false)
                        setForm({
                          name: '',
                          mobile: '',
                          email: '',
                          subject: '',
                          message: '',
                        })
                      }}
                      className="text-gold hover:text-gold-light text-sm font-semibold"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5 text-sm text-red-300">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Name */}
                    <div>
                      <label className="block text-sm text-white/70 mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                        />
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => update('name', e.target.value)}
                          placeholder="Your name"
                          className="w-full bg-night border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    {/* Mobile + Email */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-white/70 mb-1.5">
                          Mobile *
                        </label>
                        <div className="relative">
                          <Phone
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                          />
                          <input
                            type="tel"
                            value={form.mobile}
                            onChange={(e) =>
                              update(
                                'mobile',
                                e.target.value.replace(/\D/g, '').slice(0, 10)
                              )
                            }
                            placeholder="10-digit"
                            className="w-full bg-night border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-white/70 mb-1.5">
                          Email (optional)
                        </label>
                        <div className="relative">
                          <Mail
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                          />
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => update('email', e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-night border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm text-white/70 mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => update('subject', e.target.value)}
                        placeholder="e.g., Order query, Feedback"
                        className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm text-white/70 mb-1.5">
                        Message *
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => update('message', e.target.value)}
                        placeholder="Apna message yahan likhein..."
                        rows={5}
                        className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-br from-gold to-gold-dark text-night font-bold py-4 rounded-full btn-premium shadow-gold hover:shadow-[0_15px_40px_rgba(245,179,1,0.4)] flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            <span>Send Message</span>
                          </>
                        )}
                      </span>
                    </button>
                  </form>
                )}
              </div>

              {/* RIGHT: Info + Map */}
              <div className="space-y-6">
                {/* Info Card */}
                <div className="bg-night-card border border-white/5 rounded-2xl p-6 md:p-8">
                  <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
                    Visit <span className="text-shimmer">Us</span>
                  </h2>

                  <ul className="space-y-5">
                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                        <MapPin size={18} className="text-gold" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40 tracking-wider mb-1">
                          ADDRESS
                        </p>
                        <p className="text-sm font-semibold">
                          Food Junction
                          <br />
                          Amarpur, Bihar
                          <br />
                          India - 813101
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-fresh/10 border border-fresh/30 flex items-center justify-center flex-shrink-0">
                        <Clock size={18} className="text-fresh" />
                      </div>
                      <div>
                        <p className="text-xs text-white/40 tracking-wider mb-1">
                          OPENING HOURS
                        </p>
                        <p className="text-sm font-semibold">
                          Monday – Sunday
                          <br />
                          10:00 AM – 10:00 PM
                        </p>
                        <span className="inline-flex items-center gap-1.5 mt-2 text-fresh text-xs font-semibold">
                          <span className="w-2 h-2 rounded-full bg-fresh animate-pulse" />
                          Currently Open
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Google Map */}
                <div className="bg-night-card border border-white/5 rounded-2xl overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14439.796461761616!2d86.8725467!3d25.5734453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sAmarpur%2C%20Bihar!5e0!3m2!1sen!2sin!4v1700000000000"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Food Junction Location"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-night-card border border-white/5 rounded-2xl p-6">
                  <p className="text-xs text-white/40 tracking-wider mb-3">
                    FOLLOW US
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="https://www.instagram.com/shubhamyadav_9272"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-center hover:scale-105 transition-transform text-sm font-semibold"
                    >
                      📷 Instagram
                    </a>
                    <a
                      href="https://wa.me/919973318421"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 rounded-xl bg-fresh/10 border border-fresh/30 text-center hover:scale-105 transition-transform text-sm font-semibold text-fresh"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Bottom CTA ===== */}
        <section className="relative py-16 md:py-20 bg-mesh">
          <div className="absolute inset-0 bg-dots opacity-30" />
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <div className="text-5xl mb-4">🍽️</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Hungry? <span className="text-shimmer">Order Now!</span>
            </h2>
            <p className="text-white/60 mb-6">
              Fresh food ready to be delivered at your doorstep
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-gold to-gold-dark text-night font-bold px-8 py-4 rounded-full btn-premium shadow-gold"
            >
              Browse Menu →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}