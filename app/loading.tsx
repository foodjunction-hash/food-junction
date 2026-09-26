export default function Loading() {
  return (
    <div className="min-h-screen bg-night flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-pulse">🍽️</div>
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="text-white/60 text-sm">Loading Food Junction...</p>
      </div>
    </div>
  )
}