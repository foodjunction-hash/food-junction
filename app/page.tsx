'use client'

import { useEffect } from 'react'

export default function Home() {
  // Font aur Animation ko load karne ke liye effect
  useEffect(() => {
    // Google Fonts add karna
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Montserrat:wght@300;400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Page ka title change karna
    document.title = "The King Is Back! - Coming Soon";

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div style={{
      backgroundColor: '#030201',
      backgroundImage: `
        radial-gradient(circle at 90% 30%, rgba(139, 69, 19, 0.4) 0%, transparent 40%),
        radial-gradient(circle at 20% 80%, rgba(139, 69, 19, 0.1) 0%, transparent 30%),
        radial-gradient(circle at 50% 50%, #110a04 0%, #000000 80%)
      `,
      color: '#ffffff',
      fontFamily: "'Montserrat', sans-serif",
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      textAlign: 'center',
      position: 'relative',
      width: '100%'
    }}>
      
      {/* Background Stars effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        backgroundImage: `
          radial-gradient(1.5px 1.5px at 10% 20%, #d4af37, transparent),
          radial-gradient(1px 1px at 25% 15%, #d4af37, transparent),
          radial-gradient(2px 2px at 40% 30%, #ffcc00, transparent),
          radial-gradient(1px 1px at 60% 10%, #d4af37, transparent),
          radial-gradient(1.5px 1.5px at 80% 25%, #d4af37, transparent),
          radial-gradient(1px 1px at 95% 50%, #ffcc00, transparent),
          radial-gradient(1px 1px at 15% 65%, #d4af37, transparent),
          radial-gradient(1.5px 1.5px at 35% 85%, #d4af37, transparent),
          radial-gradient(1px 1px at 70% 75%, #ffcc00, transparent),
          radial-gradient(2px 2px at 88% 90%, #d4af37, transparent)
        `,
        backgroundSize: '100% 100%',
        opacity: 0.7,
        animation: 'twinkle 4s infinite alternate'
      }} />

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ fontSize: '11px', letterSpacing: '8px', color: '#d4af37', marginBottom: '25px', textTransform: 'uppercase', fontWeight: 600 }}>
          ✦ THE ROYAL RETURN ✦
        </div>
        
        <div style={{ fontSize: '55px', marginBottom: '15px', filter: 'drop-shadow(0 0 15px rgba(255, 165, 0, 0.8)) drop-shadow(0 0 30px rgba(255, 100, 0, 0.4))' }}>
          👑
        </div>
        
        <div style={{ fontSize: '16px', letterSpacing: '7px', color: '#ffffff', marginBottom: '25px', fontWeight: 500, textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}>
          WAIT... I AM BACK!
        </div>
        
        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '95px',
          lineHeight: 0.95,
          background: 'linear-gradient(to bottom, #fff5cc 10%, #f3c04b 50%, #b87e1b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0px 0px 20px rgba(255, 180, 50, 0.6), 0px 0px 50px rgba(255, 140, 0, 0.4), 0px 0px 80px rgba(139, 69, 19, 0.3)',
          marginBottom: '30px',
          fontWeight: 900,
          letterSpacing: '2px'
        }}>
          THE KING<br />IS BACK!
        </h1>
        
        <div style={{
          width: '350px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #d4af37, #fff5cc, #d4af37, transparent)',
          margin: '0 auto 35px auto',
          boxShadow: '0 0 15px rgba(212, 175, 55, 0.8)',
          borderRadius: '50%'
        }}></div>
        
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: '24px', color: '#ffffff', marginBottom: '15px', letterSpacing: '1px', fontWeight: 600, textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
          Legends Never Quit,
        </div>
        
        <div style={{ fontFamily: "'Cinzel', serif", color: '#d4af37', fontSize: '20px', fontWeight: 700, marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', letterSpacing: '2px', textShadow: '0 0 15px rgba(212, 175, 55, 0.6)' }}>
          KINGS ALWAYS RETURN! 🦁 🔥
        </div>
        
        <div style={{
          border: '1px solid rgba(212, 175, 55, 0.4)',
          padding: '15px 45px',
          borderRadius: '50px',
          color: '#d4af37',
          fontSize: '12px',
          letterSpacing: '5px',
          textTransform: 'uppercase',
          background: 'rgba(10, 5, 0, 0.5)',
          boxShadow: 'inset 0 0 20px rgba(212, 175, 55, 0.1), 0 0 20px rgba(212, 175, 55, 0.2)',
          marginBottom: '40px',
          display: 'inline-block',
          fontWeight: 600
        }}>
          NO FEAR · NO LIMITS · ONLY KING
        </div>

        <div style={{ fontSize: '24px', display: 'flex', gap: '30px', justifyContent: 'center', filter: 'drop-shadow(0 0 10px rgba(255, 80, 0, 0.6))' }}>
          <span>🔥</span>
          <span>💀</span>
          <span>🔥</span>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '25px', fontSize: '10px', letterSpacing: '6px', color: '#666', textTransform: 'uppercase', fontWeight: 600, zIndex: 2 }}>
        THE LEGEND NEVER DIES
      </div>

      {/* CSS Styles for Animation & Mobile Responsive */}
      <style jsx global>{`
        @keyframes twinkle {
          0% { opacity: 0.4; transform: translateY(0px); }
          100% { opacity: 0.9; transform: translateY(-10px); }
        }
        @media (max-width: 768px) {
          h1 { font-size: 55px !important; }
          div[style*="letter-spacing: 7px"] { font-size: 12px !important; letter-spacing: 4px !important; }
          div[style*="letter-spacing: 8px"] { font-size: 9px !important; letter-spacing: 5px !important; }
          div[style*="width: 350px"] { width: 250px !important; }
          div[style*="padding: 15px 45px"] { padding: 12px 25px !important; font-size: 9px !important; letter-spacing: 3px !important; }
        }
      `}</style>
    </div>
  )
}