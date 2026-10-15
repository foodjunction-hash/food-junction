'use client'

export default function AdminLoading({ message = 'Loading' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#030308] flex items-center justify-center overflow-hidden">
      {/* Hexagon grid background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%23ffbd00' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial energy pulses */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-gold/20 animate-pulse-ring-1" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-gold/10 animate-pulse-ring-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-gold/[0.05] animate-pulse-ring-3" />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gold/60 animate-particle"
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
            animationDelay: `${(i % 5) * 0.6}s`,
            animationDuration: `${3 + (i % 4)}s`,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* 3D Rotating Rings + Logo */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-gold/40 animate-spin-slow" />

          <div
            className="absolute inset-3 rounded-full animate-spin-reverse"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0%, #ffbd00 15%, transparent 30%, #ffbd00 50%, transparent 65%, #ffbd00 80%, transparent 100%)',
              maskImage:
                'radial-gradient(circle, transparent 55%, black 57%, black 63%, transparent 65%)',
              WebkitMaskImage:
                'radial-gradient(circle, transparent 55%, black 57%, black 63%, transparent 65%)',
            }}
          />

          <div className="absolute inset-6 rounded-full border border-gold/60 shadow-[0_0_30px_rgba(255,189,0,0.6),inset_0_0_30px_rgba(255,189,0,0.4)] animate-pulse-glow" />

          <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '5s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gold shadow-[0_0_15px_rgba(255,189,0,1)]" />
          </div>
          <div className="absolute inset-0 animate-spin-reverse" style={{ animationDuration: '7s' }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold-light shadow-[0_0_12px_rgba(255,189,0,1)]" />
          </div>

          {/* Center core */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-gold via-gold-light to-gold-dark flex items-center justify-center shadow-[0_0_60px_rgba(255,189,0,0.8)]">
            <svg
              className="w-10 h-10 text-night"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 3v7M7 3v7M4 7h3M5.5 10v11M14 3v18M14 3c4 2 4 7 0 9" />
            </svg>
          </div>
        </div>

        {/* Glitch loading text */}
        <div className="relative">
          <h1 className="font-mono text-3xl md:text-4xl font-bold tracking-[0.4em] text-gold glitch-text">
            LOADING
          </h1>
        </div>

        {/* Progress scanner */}
        <div className="w-80 h-1 bg-white/5 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent animate-scanner" />
        </div>

        {/* Status text */}
        <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] text-white/40 uppercase font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-fresh animate-pulse" />
          <span className="animate-typing">{message}...</span>
        </div>

        {/* Data stream */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden opacity-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute font-mono text-[10px] text-gold animate-data-stream"
              style={{ left: `${i * 12.5}%`, animationDelay: `${i * 0.3}s` }}
            >
              {Array.from({ length: 15 })
                .map(() => Math.round(Math.random()))
                .join('')}
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-spin-reverse { animation: spin-slow 6s linear infinite reverse; }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(255, 189, 0, 0.6), inset 0 0 30px rgba(255, 189, 0, 0.4);
            opacity: 1;
          }
          50% {
            box-shadow: 0 0 60px rgba(255, 189, 0, 1), inset 0 0 50px rgba(255, 189, 0, 0.8);
            opacity: 0.8;
          }
        }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }

        @keyframes pulse-ring-1 {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.3); opacity: 0; }
        }
        .animate-pulse-ring-1 { animation: pulse-ring-1 3s ease-out infinite; }
        .animate-pulse-ring-2 { animation: pulse-ring-1 3s ease-out infinite; animation-delay: 1s; }
        .animate-pulse-ring-3 { animation: pulse-ring-1 3s ease-out infinite; animation-delay: 2s; }

        @keyframes particle {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }
        .animate-particle { animation: particle 5s linear infinite; }

        @keyframes scanner {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .animate-scanner { animation: scanner 2s ease-in-out infinite; }

        @keyframes glitch {
          0%, 100% {
            text-shadow: 0 0 10px rgba(255, 189, 0, 0.5);
            transform: translateX(0);
          }
          20% {
            text-shadow: 2px 0 10px #ff0080, -2px 0 10px #00ffff;
            transform: translateX(-2px);
          }
          40% {
            text-shadow: -2px 0 10px #ff0080, 2px 0 10px #00ffff;
            transform: translateX(2px);
          }
          60% {
            text-shadow: 1px 0 10px #ff0080, -1px 0 10px #00ffff;
            transform: translateX(-1px);
          }
          80% {
            text-shadow: -1px 0 10px #ff0080, 1px 0 10px #00ffff;
            transform: translateX(1px);
          }
        }
        .glitch-text { animation: glitch 2s infinite; }

        @keyframes typing {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .animate-typing { animation: typing 1.5s ease-in-out infinite; }

        @keyframes data-stream {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-data-stream { animation: data-stream 3s linear infinite; }
      `}</style>
    </div>
  )
}