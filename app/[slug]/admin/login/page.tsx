'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { loginRestaurantAdmin } from '@/lib/auth'
import { getRestaurant } from '@/lib/restaurant'

export default function RestaurantAdminLoginPage() {
  const router = useRouter()
  const params = useParams()
  const slug = (params?.slug as string) || ''

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [restaurantName, setRestaurantName] = useState('Food Junction Amarpur')
  const [restaurantLogo, setRestaurantLogo] = useState('/food-junction-logo.png')
  const [mounted, setMounted] = useState(false)
  const [clock, setClock] = useState('')
  const [greeting, setGreeting] = useState('GOOD EVENING')
  const [year, setYear] = useState(2025)

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setClock(
        now.toLocaleString('en-IN', {
          weekday: 'long',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      )
      const hour = now.getHours()
      if (hour < 12) setGreeting('GOOD MORNING')
      else if (hour < 17) setGreeting('GOOD AFTERNOON')
      else setGreeting('GOOD EVENING')
      setYear(now.getFullYear())
    }
    updateClock()
    const interval = setInterval(updateClock, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setMounted(true)
    const check = async () => {
      const stored = localStorage.getItem('fj-restaurant-admin-session')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed.restaurantSlug === slug && parsed.expiresAt > Date.now()) {
            router.push(`/${slug}/admin/dashboard`)
            return
          }
        } catch {}
      }
      if (slug) {
        const data = await getRestaurant(slug)
        if (data) {
          setRestaurantName(data.name)
          if (data.logo_url) setRestaurantLogo(data.logo_url)
        }
      }
    }
    check()
  }, [slug, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const result = await loginRestaurantAdmin(slug, username, password)
    if (result.success) {
      router.push(`/${slug}/admin/dashboard`)
    } else {
      setError(result.error || 'Invalid credentials')
      setLoading(false)
      setPassword('')
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }
  }

  const nameParts = restaurantName.split(' ')
  const firstName = nameParts.slice(0, -1).join(' ') || restaurantName
  const lastName = nameParts.length > 1 ? nameParts.slice(-1).join(' ') : ''

  return (
    <div className="fj-login-root">
      {/* Background layers */}
      <div className="fj-bg-leaves" />
      <div className="fj-bg-biryani" />
      <div className="fj-bg-chef" />

      {/* Gold curves */}
      <svg className="fj-gold-curve" viewBox="0 0 500 200" preserveAspectRatio="none">
        <path d="M0,40 Q120,10 250,30 T500,20 L500,0 L0,0 Z" fill="url(#goldGradient)" opacity="0.85" />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b8860b" />
            <stop offset="30%" stopColor="#ffbd00" />
            <stop offset="60%" stopColor="#f39a00" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>
        </defs>
      </svg>

      <svg className="fj-gold-curve-bottom" viewBox="0 0 400 200" preserveAspectRatio="none">
        <path d="M0,160 Q100,140 200,165 T400,180 L400,200 L0,200 Z" fill="url(#goldGradientBottom)" opacity="0.7" />
        <defs>
          <linearGradient id="goldGradientBottom" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b8860b" />
            <stop offset="50%" stopColor="#ffbd00" />
            <stop offset="100%" stopColor="#7a5700" />
          </linearGradient>
        </defs>
      </svg>

      {/* Page container */}
      <div className="fj-page">
        {/* Status bar */}
        <div className="fj-status">
          <span className="fj-dot" />
          <span>ALL SYSTEMS OPERATIONAL</span>
          <span className="fj-sep" />
          <span className="fj-time">◷ {clock || 'Loading time…'}</span>
        </div>

        {/* Main */}
        <main className="fj-main">
          {/* Brand */}
          <section className="fj-brand">
            <div className="fj-logo">
              <img src={restaurantLogo} alt={restaurantName} />
              <div className="fj-admin-pill">◇ ADMIN</div>
            </div>

            <div className="fj-eyebrow">{greeting}</div>

            <h1>
              {firstName}
              {lastName && <span>{lastName}</span>}
            </h1>

            <p className="fj-tagline">
              Delicious Food <b>•</b> Happy Customers <b>•</b> Better Tomorrow
            </p>

            <p className="fj-intro">
              Sign in to access your dashboard and manage your restaurant operations with ease.
            </p>

            <div className="fj-features">
              {[
                { label: 'Manage Orders', icon: <svg viewBox="0 0 24 24"><path d="M4 3v7M7 3v7M4 7h3M5.5 10v11M14 3v18M14 3c4 2 4 7 0 9"/></svg> },
                { label: 'Track Sales', icon: <svg viewBox="0 0 24 24"><path d="M4 20V12h4v8M10 20V7h4v13M16 20V3h4v17M2 20h20"/></svg> },
                { label: 'Control Users', icon: <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6"/></svg> },
                { label: 'System Settings', icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15l1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z"/></svg> },
              ].map((f, i) => (
                <div key={i} className="fj-feature">
                  <div className="fj-feature-icon">{f.icon}</div>
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Login card */}
          <section className="fj-login-wrap">
            <div className={`fj-login-card ${shake ? 'fj-shake' : ''}`}>
              <div className="fj-card-head">
                <div className="fj-lock-badge">
                  <svg viewBox="0 0 24 24">
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
                  </svg>
                </div>
                <div>
                  <h2>Welcome back</h2>
                  <p>Enter your credentials to continue</p>
                </div>
              </div>

              {error && <div className="fj-notice">{error}</div>}

              <form onSubmit={handleSubmit} autoComplete="on">
                <div className="fj-field">
                  <label className="fj-field-label" htmlFor="username">USERNAME</label>
                  <div className="fj-input-shell">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></svg>
                    <input
                      id="username"
                      type="text"
                      placeholder={`${slug}-admin`}
                      autoComplete="username"
                      autoFocus
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="fj-field">
                  <div className="fj-field-label">
                    <label htmlFor="password">PASSWORD</label>
                    <a className="fj-forgot" href="#forgot">Forgot?</a>
                  </div>
                  <div className="fj-input-shell">
                    <svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="fj-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>
                    </button>
                  </div>
                </div>

                <button className="fj-submit" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <svg viewBox="0 0 24 24" style={{ animation: 'fj-spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.2-8.5" /></svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24"><path d="M10 17l5-5-5-5M15 12H3M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></svg>
                      Sign in to Dashboard
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </form>

              <div className="fj-trust">
                <div className="fj-trust-item">
                  <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></svg>
                  SSL SECURED
                </div>
                <span className="fj-trust-divider" />
                <div className="fj-trust-item">
                  <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6" /></svg>
                  10K+ USERS
                </div>
                <span className="fj-trust-divider" />
                <div className="fj-trust-item">
                  <svg viewBox="0 0 24 24"><path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z" /></svg>
                  4.9
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="fj-footer">
          <span>© {year} {restaurantName}. All rights reserved.</span>
          <span>Made with care for {restaurantName}</span>
        </footer>
      </div>

      <style jsx global>{`
        /* ============================================
           ROOT
           ============================================ */
        .fj-login-root {
          min-height: 100vh;
          font-family: Inter, system-ui, -apple-system, sans-serif;
          color: #f8f9fc;
          background: radial-gradient(ellipse at 10% 10%, rgba(120, 76, 0, 0.28), transparent 32%),
            radial-gradient(ellipse at 95% 90%, rgba(57, 35, 110, 0.32), transparent 38%),
            linear-gradient(125deg, #0b0b0e, #08090d 55%, #0c0b14);
          overflow-x: hidden;
          position: relative;
        }

        .fj-login-root::before {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.15;
          background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: linear-gradient(to bottom, black, transparent 85%);
          -webkit-mask-image: linear-gradient(to bottom, black, transparent 85%);
          z-index: 1;
        }

        /* ============================================
           BACKGROUND IMAGES
           ============================================ */
        .fj-bg-leaves {
          position: fixed;
          top: -20px;
          left: -20px;
          width: 220px;
          height: 260px;
          background-image: url('/bg-leaves.jpg');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: top left;
          opacity: 0.55;
          pointer-events: none;
          z-index: 0;
          mask-image: radial-gradient(ellipse at top left, black 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at top left, black 30%, transparent 80%);
        }

        .fj-bg-biryani {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 50%;
          height: 48%;
          background-image: url('/bg-biryani.jpg');
          background-size: cover;
          background-position: bottom left;
          background-repeat: no-repeat;
          opacity: 0.85;
          pointer-events: none;
          z-index: 0;
          mask-image: radial-gradient(ellipse at bottom left, black 35%, transparent 78%);
          -webkit-mask-image: radial-gradient(ellipse at bottom left, black 35%, transparent 78%);
        }

        .fj-bg-chef {
          position: fixed;
          top: 0;
          right: 0;
          width: 320px;
          height: 320px;
          background-image: url('/bg-chef-pattern.jpg');
          background-size: cover;
          background-position: top right;
          opacity: 0.4;
          pointer-events: none;
          z-index: 0;
          mask-image: radial-gradient(ellipse at top right, black 30%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at top right, black 30%, transparent 75%);
        }

        /* ============================================
           GOLD CURVES
           ============================================ */
        .fj-gold-curve {
          position: fixed;
          top: 0;
          right: 0;
          width: 50%;
          height: 90px;
          z-index: 0;
          pointer-events: none;
          filter: drop-shadow(0 0 20px rgba(255, 189, 0, 0.15));
        }

        .fj-gold-curve-bottom {
          position: fixed;
          bottom: 0;
          right: 0;
          width: 40%;
          height: 80px;
          z-index: 0;
          pointer-events: none;
          filter: drop-shadow(0 0 20px rgba(255, 189, 0, 0.12));
        }

        /* ============================================
           PAGE CONTAINER
           ============================================ */
        .fj-page {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 4%;
          display: flex;
          flex-direction: column;
        }

        /* ============================================
           STATUS BAR
           ============================================ */
        .fj-status {
          align-self: center;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 9px 16px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 999px;
          background: rgba(18, 20, 26, 0.78);
          backdrop-filter: blur(10px);
          color: #c3c6d0;
          font-size: 10px;
          letter-spacing: 1.3px;
          text-transform: uppercase;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.2);
        }

        .fj-dot {
          height: 7px;
          width: 7px;
          background: #17d47b;
          border-radius: 50%;
          box-shadow: 0 0 13px rgba(23, 212, 123, 0.53);
          animation: fj-pulse 2s ease-in-out infinite;
        }

        @keyframes fj-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .fj-status .fj-time {
          letter-spacing: 0;
          text-transform: none;
          font-size: 11px;
          color: #a7abb6;
        }

        .fj-sep {
          height: 14px;
          width: 1px;
          background: #343640;
        }

        /* ============================================
           MAIN GRID
           ============================================ */
        .fj-main {
          flex: 1;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(380px, 0.95fr);
          gap: 5%;
          align-items: center;
          padding: 28px 0 32px;
        }

        /* ============================================
           BRAND
           ============================================ */
        .fj-brand {
          position: relative;
          z-index: 1;
          padding: 10px 0 20px;
        }

        .fj-logo {
          width: 110px;
          height: 110px;
          border: 2.5px solid #e7a900;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: radial-gradient(circle at 50% 35%, #27200c, #090a0d 70%);
          box-shadow: 0 0 0 6px rgba(244, 181, 0, 0.07), 0 0 40px rgba(245, 173, 0, 0.4);
          margin-bottom: 26px;
          position: relative;
          overflow: visible;
        }

        .fj-logo::before {
          content: '';
          position: absolute;
          inset: 6px;
          border: 1px solid #f9bd18;
          border-radius: 50%;
        }

        .fj-logo img {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          position: relative;
          z-index: 1;
        }

        .fj-admin-pill {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          background: #090a0d;
          border: 1px solid #9e7300;
          color: #ffbd00;
          border-radius: 999px;
          padding: 5px 13px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.8px;
          z-index: 2;
        }

        .fj-eyebrow {
          color: #ffbd00;
          font-size: 11px;
          letter-spacing: 4px;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .fj-brand h1 {
          font-size: clamp(32px, 4vw, 52px);
          line-height: 1;
          letter-spacing: -2px;
          margin: 0 0 18px;
          font-weight: 800;
          color: #f8f9fc;
        }

        .fj-brand h1 span {
          display: block;
          color: #ffbd00;
          text-shadow: 0 0 34px rgba(255, 183, 0, 0.15);
        }

        .fj-tagline {
          font-size: 13px;
          color: #d2d4dc;
          margin: 0 0 14px;
        }

        .fj-tagline b {
          color: #ffbd00;
          padding: 0 7px;
        }

        .fj-intro {
          font-size: 13px;
          color: #aeb2bf;
          line-height: 1.7;
          max-width: 420px;
          margin: 0;
        }

        /* ============================================
           FEATURES
           ============================================ */
        .fj-features {
          display: flex;
          gap: clamp(14px, 2.5vw, 32px);
          margin-top: 28px;
          flex-wrap: wrap;
        }

        .fj-feature {
          width: 68px;
          text-align: center;
          color: #e6e7eb;
          font-size: 11px;
          line-height: 1.35;
        }

        .fj-feature-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 7px;
          border: 1px solid #765400;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(145deg, #201907, #0c0d11);
          color: #ffbd00;
          box-shadow: inset 0 0 20px rgba(255, 185, 0, 0.04);
        }

        .fj-feature-icon svg {
          width: 20px;
          height: 20px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        /* ============================================
           LOGIN CARD
           ============================================ */
        .fj-login-wrap {
          position: relative;
          z-index: 2;
        }

        .fj-login-wrap::before {
          content: '';
          position: absolute;
          inset: -18px;
          border-radius: 30px;
          background: radial-gradient(ellipse, rgba(255, 184, 0, 0.09), transparent 68%);
          filter: blur(8px);
          pointer-events: none;
        }

        .fj-login-card {
          position: relative;
          border: 1px solid rgba(255, 190, 0, 0.62);
          border-top-color: #bb8d12;
          border-right-color: rgba(255, 255, 255, 0.25);
          border-radius: 22px;
          padding: 32px;
          background: linear-gradient(145deg, rgba(17, 19, 28, 0.97), rgba(9, 10, 16, 0.97));
          backdrop-filter: blur(20px);
          box-shadow: 0 24px 75px rgba(0, 0, 0, 0.53), 0 0 35px rgba(255, 183, 0, 0.06);
          overflow: hidden;
        }

        .fj-login-card.fj-shake {
          animation: fj-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }

        @keyframes fj-shake {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-6px); }
          30%, 60%, 90% { transform: translateX(6px); }
        }

        .fj-login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 45%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #ffd34d, transparent);
        }

        .fj-card-head {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 26px;
        }

        .fj-lock-badge {
          flex: 0 0 58px;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #ffbd00;
          background: radial-gradient(circle, #342709, #17140c);
          border: 1px solid #b98600;
          box-shadow: 0 0 25px rgba(255, 183, 0, 0.1);
        }

        .fj-lock-badge svg {
          width: 24px;
          height: 24px;
          stroke: currentColor;
          fill: none;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .fj-card-head h2 {
          font-size: clamp(20px, 2vw, 26px);
          letter-spacing: -0.5px;
          margin: 0 0 5px;
          font-weight: 700;
        }

        .fj-card-head p {
          margin: 0;
          color: #aeb2c0;
          font-size: 13px;
        }

        .fj-field {
          margin-bottom: 20px;
        }

        .fj-field-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          letter-spacing: 1.6px;
          font-weight: 700;
          color: #c4c6cf;
          margin-bottom: 9px;
        }

        .fj-forgot {
          letter-spacing: 0;
          text-transform: none;
          color: #ffbd00;
          text-decoration: none;
          font-weight: 500;
          font-size: 12px;
        }

        .fj-forgot:hover {
          text-decoration: underline;
        }

        .fj-input-shell {
          height: 58px;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 0 16px;
          border: 1px solid #343744;
          border-radius: 14px;
          background: rgba(5, 6, 10, 0.74);
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .fj-input-shell:focus-within {
          border-color: #c99400;
          box-shadow: 0 0 0 3px rgba(255, 189, 0, 0.1);
        }

        .fj-input-shell > svg {
          width: 19px;
          height: 19px;
          flex: 0 0 auto;
          stroke: #a2a6b4;
          fill: none;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .fj-input-shell input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #f7f7fa;
          font: 500 14px Inter, sans-serif;
        }

        .fj-input-shell input::placeholder {
          color: #858997;
        }

        .fj-toggle {
          border: 0;
          background: transparent;
          color: #a2a6b4;
          padding: 4px;
          cursor: pointer;
          display: grid;
          place-items: center;
        }

        .fj-toggle:hover {
          color: #ffbd00;
        }

        .fj-toggle svg {
          width: 18px;
          height: 18px;
          stroke: currentColor;
          fill: none;
          stroke-width: 1.8;
        }

        .fj-submit {
          width: 100%;
          height: 58px;
          border: 1px solid #ffe07a;
          border-radius: 14px;
          background: linear-gradient(110deg, #ffc400, #f7a900);
          color: #090909;
          font: 800 14px Inter, sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          box-shadow: 0 10px 32px rgba(255, 184, 0, 0.28);
          transition: transform 0.2s, filter 0.2s, box-shadow 0.2s;
        }

        .fj-submit:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: translateY(-2px);
          box-shadow: 0 14px 38px rgba(255, 184, 0, 0.45);
        }

        .fj-submit:active:not(:disabled) {
          transform: translateY(0);
        }

        .fj-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .fj-submit svg {
          width: 18px;
          height: 18px;
          stroke: currentColor;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        @keyframes fj-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .fj-trust {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          border-top: 1px solid #292b35;
          margin-top: 24px;
          padding-top: 20px;
          color: #b6b8c2;
          font-size: 11px;
        }

        .fj-trust-item {
          display: flex;
          align-items: center;
          gap: 7px;
          white-space: nowrap;
        }

        .fj-trust-item svg {
          width: 16px;
          height: 16px;
          stroke: #ffbd00;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .fj-trust-item:first-child svg {
          stroke: #10d78a;
        }

        .fj-trust-item:last-child svg {
          fill: #ffbd00;
          stroke: #ffbd00;
        }

        .fj-trust-divider {
          height: 20px;
          width: 1px;
          background: #30313a;
        }

        .fj-notice {
          padding: 10px 12px;
          margin: -8px 0 16px;
          border: 1px solid #7b5b12;
          border-radius: 10px;
          color: #ffdb70;
          background: #302507;
          font-size: 12px;
          line-height: 1.5;
        }

        .fj-footer {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          color: #777b88;
          font-size: 10px;
          padding: 12px 0 0;
        }

        .fj-footer span:last-child {
          color: #a9aab2;
        }

        /* ============================================
           RESPONSIVE
           ============================================ */
        @media (max-width: 1000px) {
          .fj-page { padding: 20px 4%; }
          .fj-main {
            grid-template-columns: 1fr;
            gap: 22px;
            max-width: 540px;
            width: 100%;
            margin: 0 auto;
            padding: 26px 0;
          }
          .fj-brand {
            display: grid;
            grid-template-columns: 88px 1fr;
            column-gap: 18px;
            align-items: center;
            padding-bottom: 6px;
          }
          .fj-logo {
            width: 88px;
            height: 88px;
            margin: 0;
            grid-row: span 3;
          }
          .fj-logo img {
            width: 56px;
            height: 56px;
          }
          .fj-admin-pill {
            font-size: 7px;
            padding: 4px 9px;
          }
          .fj-eyebrow {
            font-size: 10px;
            letter-spacing: 2.5px;
            margin-bottom: 6px;
          }
          .fj-brand h1 {
            font-size: clamp(26px, 5vw, 38px);
            letter-spacing: -1.2px;
            margin-bottom: 8px;
          }
          .fj-tagline {
            font-size: 12px;
            margin-bottom: 0;
          }
          .fj-intro,
          .fj-features {
            display: none;
          }
          .fj-login-card { padding: 26px; }
          .fj-card-head { margin-bottom: 22px; }
          .fj-footer { padding-top: 0; }
          .fj-bg-biryani {
            width: 80%;
            height: 35%;
            opacity: 0.4;
          }
          .fj-bg-chef {
            width: 200px;
            height: 200px;
          }
        }

        @media (max-width: 520px) {
          .fj-page { padding: 16px 14px; }
          .fj-status {
            font-size: 9px;
            letter-spacing: 1px;
            padding: 8px 11px;
            gap: 7px;
          }
          .fj-status .fj-time { font-size: 10px; }
          .fj-sep { height: 12px; }
          .fj-main { padding: 20px 0; }
          .fj-brand {
            grid-template-columns: 68px 1fr;
            column-gap: 13px;
          }
          .fj-logo {
            width: 68px;
            height: 68px;
            border-width: 2px;
          }
          .fj-logo::before { inset: 4px; }
          .fj-logo img {
            width: 44px;
            height: 44px;
          }
          .fj-admin-pill {
            bottom: -6px;
            font-size: 6px;
            letter-spacing: 1px;
            padding: 3px 7px;
          }
          .fj-eyebrow {
            font-size: 8px;
            letter-spacing: 2px;
          }
          .fj-brand h1 {
            font-size: 26px;
            letter-spacing: -1px;
          }
          .fj-tagline {
            font-size: 10px;
            line-height: 1.6;
          }
          .fj-login-card {
            padding: 20px 16px;
            border-radius: 18px;
          }
          .fj-card-head { gap: 12px; }
          .fj-lock-badge {
            flex-basis: 46px;
            width: 46px;
            height: 46px;
          }
          .fj-lock-badge svg {
            width: 20px;
            height: 20px;
          }
          .fj-card-head h2 { font-size: 20px; }
          .fj-card-head p { font-size: 11px; }
          .fj-field { margin-bottom: 16px; }
          .fj-input-shell {
            height: 52px;
            border-radius: 12px;
            padding: 0 12px;
            gap: 10px;
          }
          .fj-input-shell input { font-size: 13px; }
          .fj-submit {
            height: 54px;
            border-radius: 12px;
            font-size: 13px;
          }
          .fj-trust {
            margin-top: 20px;
            padding-top: 16px;
            font-size: 9px;
            gap: 6px;
          }
          .fj-trust-item { gap: 4px; }
          .fj-trust-item svg {
            width: 13px;
            height: 13px;
          }
          .fj-trust-divider { height: 16px; }
          .fj-footer {
            font-size: 9px;
            flex-wrap: wrap;
          }
          .fj-bg-biryani {
            width: 100%;
            height: 28%;
            opacity: 0.25;
          }
          .fj-bg-chef,
          .fj-bg-leaves { opacity: 0.2; }
          .fj-gold-curve,
          .fj-gold-curve-bottom { opacity: 0.5; }
        }

        @media (prefers-reduced-motion: reduce) {
          .fj-login-root * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}