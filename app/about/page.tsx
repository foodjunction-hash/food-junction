import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  Heart,
  Award,
  Users,
  ChefHat,
  Leaf,
  Clock,
  Target,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Star,
  Code2,
  Crown,
} from 'lucide-react'

export default function AboutPage() {
  const features = [
    {
      icon: Leaf,
      title: 'Fresh Ingredients',
      desc: 'Daily sourced fresh vegetables, meat, and spices from local farmers',
      emoji: '🌿',
    },
    {
      icon: ChefHat,
      title: 'Expert Chefs',
      desc: 'Experienced chefs with 10+ years in Indian and continental cuisine',
      emoji: '👨‍🍳',
    },
    {
      icon: Heart,
      title: 'Made with Love',
      desc: 'Every dish is prepared with love and care for our family',
      emoji: '❤️',
    },
    {
      icon: Award,
      title: 'Best in Amarpur',
      desc: 'Voted as the favorite family restaurant in Amarpur',
      emoji: '🏆',
    },
    {
      icon: Clock,
      title: 'Fast Service',
      desc: 'Quick service without compromising on quality',
      emoji: '⚡',
    },
    {
      icon: Users,
      title: 'Family Friendly',
      desc: 'Perfect ambiance for families, couples, and friends',
      emoji: '👨‍👩‍👧‍👦',
    },
  ]

  const stats = [
    { value: '50+', label: 'Delicious Dishes', emoji: '🍽️' },
    { value: '10K+', label: 'Happy Customers', emoji: '😊' },
    { value: '5+', label: 'Years of Service', emoji: '🎂' },
    { value: '4.8', label: 'Customer Rating', emoji: '⭐' },
  ]

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      desc: 'To serve fresh, delicious, and hygienic food at affordable prices — making every family meal a memorable experience.',
      color: 'from-gold/20 to-gold/5',
      borderColor: 'border-gold/30',
      iconColor: 'text-gold',
    },
    {
      icon: Heart,
      title: 'Our Vision',
      desc: 'To become the most loved family restaurant in Bihar — where every customer feels at home and every meal brings joy.',
      color: 'from-fresh/20 to-fresh/5',
      borderColor: 'border-fresh/30',
      iconColor: 'text-fresh',
    },
    {
      icon: Award,
      title: 'Our Promise',
      desc: 'Fresh ingredients, honest prices, quick service, and a warm smile every time you visit us. That\'s our promise.',
      color: 'from-blue-500/20 to-blue-500/5',
      borderColor: 'border-blue-400/30',
      iconColor: 'text-blue-400',
    },
  ]

    const team = [
    {
      name: 'RAJ NANDNI',
      role: 'Owner & Founder',
      photo: '/team/owner.jpg',
      icon: Crown,
      description:
        'Founder of Food Junction — with a vision to serve the best food in Amarpur.',
      color: 'from-gold to-gold-dark',
      emoji: '👑',
    },
    {
      name: 'Shubham Yadav',
      role: 'Web Developer',
      photo: '/team/developer.jpg',
      icon: Code2,
      description:
        'Designed and built this complete digital ordering system for Food Junction.',
      color: 'from-fresh to-fresh-dark',
      emoji: '💻',
    },
  ]
  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* ===== Hero Section ===== */}
        <section className="relative overflow-hidden py-16 md:py-24 bg-mesh">
          <div className="absolute inset-0 bg-dots opacity-30" />
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/10 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-fresh/10 blur-[100px]" />

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-gold border border-gold/30 text-gold px-4 py-2 rounded-full text-sm mb-6">
              <Sparkles size={14} />
              <span className="font-semibold">Since 2020</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Our <span className="text-shimmer">Story</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Food Junction shuru hua ek simple sapne se —{' '}
              <span className="text-gold font-semibold">
                Amarpur ke families ko ghar jaisa khana
              </span>{' '}
              serve karne ka. Aaj hum har din 100+ families ki khushi ka hissa
              ban rahe hain. 🍽️
            </p>
          </div>
        </section>

        {/* ===== Story Section ===== */}
        <section className="relative py-16 md:py-24 bg-night-soft">
          <div className="absolute inset-0 bg-dots opacity-20" />

          <div className="relative max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text */}
              <div>
                <p className="text-gold tracking-[0.3em] text-sm mb-3">
                  OUR JOURNEY
                </p>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                  From a <span className="text-shimmer">Small Dream</span> to a
                  Big Family
                </h2>

                <div className="space-y-4 text-white/70 leading-relaxed">
                  <p>
                    2020 me, jab poori duniya COVID se lad rahi thi, humne socha
                    ki kuch aisa banayein jo logon ki zindagi me khushi la sake.{' '}
                    <span className="text-gold font-semibold">
                      Food Junction
                    </span>{' '}
                    ka idea wahi se aaya.
                  </p>
                  <p>
                    Ek chhoti si kitchen se shuru karke, aaj hum Amarpur ka
                    favorite family restaurant hain. Hamare paas{' '}
                    <span className="text-gold font-semibold">50+ dishes</span>{' '}
                    hain, aur rozana{' '}
                    <span className="text-gold font-semibold">100+ orders</span>{' '}
                    aate hain.
                  </p>
                  <p>
                    Lekin sabse bada achievement ye hai —{' '}
                    <span className="text-fresh font-semibold">
                      10,000+ happy customers
                    </span>{' '}
                    jinhone hum par bharosa kiya. 🙏
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-2 bg-gradient-to-br from-gold to-gold-dark text-night font-bold px-6 py-3 rounded-full btn-premium shadow-gold"
                  >
                    <ShoppingBag size={18} />
                    <span>Explore Menu</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 border-2 border-gold text-gold font-bold px-6 py-3 rounded-full hover:bg-gold hover:text-night transition"
                  >
                    <span>Visit Us</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>

              {/* Right: Visual */}
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden border-2 border-gold/20 aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-night to-fresh/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[200px] animate-float select-none">
                      🍽️
                    </span>
                  </div>

                  {/* Floating badges */}
                  <div className="absolute top-6 left-6 glass border border-gold/30 rounded-2xl px-4 py-3">
                    <p className="text-[10px] text-white/50 tracking-wider">
                      ESTABLISHED
                    </p>
                    <p className="text-lg font-bold text-gold">2020</p>
                  </div>

                  <div className="absolute bottom-6 right-6 glass border border-fresh/30 rounded-2xl px-4 py-3">
                    <p className="text-[10px] text-white/50 tracking-wider">
                      RATING
                    </p>
                    <p className="text-lg font-bold text-fresh flex items-center gap-1">
                      4.8 <Star size={14} fill="currentColor" />
                    </p>
                  </div>
                </div>

                {/* Glow */}
                <div className="absolute inset-0 rounded-3xl bg-gold/20 blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== Stats Section ===== */}
        <section className="relative py-16 md:py-20 bg-mesh">
          <div className="absolute inset-0 bg-dots opacity-30" />

          <div className="relative max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="group bg-night-card border border-white/5 rounded-2xl p-5 md:p-6 text-center card-premium"
                >
                  <div className="text-4xl md:text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {s.emoji}
                  </div>
                  <p className="font-display text-3xl md:text-4xl font-bold text-gold mb-1 group-hover:text-shimmer">
                    {s.value}
                  </p>
                  <p className="text-xs md:text-sm text-white/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Values Section (Mission/Vision/Promise) ===== */}
        <section className="relative py-16 md:py-24 bg-night-soft">
          <div className="absolute inset-0 bg-dots opacity-20" />

          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-gold tracking-[0.3em] text-sm mb-3">
                WHAT DRIVES US
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Our <span className="text-shimmer">Core Values</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <div
                  key={i}
                  className={`group relative bg-gradient-to-br ${v.color} border ${v.borderColor} rounded-2xl p-6 md:p-8 card-premium overflow-hidden`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-night-card border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <v.icon size={26} className={v.iconColor} />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3">
                    {v.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {v.desc}
                  </p>

                  {/* Gold line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Why Choose Us ===== */}
        <section className="relative py-16 md:py-24 bg-mesh">
          <div className="absolute inset-0 bg-dots opacity-30" />

          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-gold tracking-[0.3em] text-sm mb-3">
                WHY CHOOSE US
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                What Makes Us <span className="text-shimmer">Different</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group relative glass border border-white/5 rounded-2xl p-6 text-center card-premium overflow-hidden"
                >
                  <div className="relative w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[0_0_20px_rgba(245,179,1,0.1)] group-hover:shadow-[0_0_30px_rgba(245,179,1,0.4)]">
                    <f.icon
                      size={28}
                      className="text-gold group-hover:scale-110 transition-transform"
                    />
                    <span className="absolute -top-2 -right-2 text-2xl opacity-0 group-hover:opacity-100 group-hover:animate-bounce-soft transition-opacity">
                      {f.emoji}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mb-2 group-hover:text-gold transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors leading-relaxed">
                    {f.desc}
                  </p>

                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

                {/* ===== Meet the Team ===== */}
        <section className="relative py-16 md:py-24 bg-night-soft">
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/10 rounded-full blur-[100px]" />

          <div className="relative max-w-5xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-gold tracking-[0.3em] text-sm mb-3">
                MEET THE TEAM
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                The <span className="text-shimmer">People</span> Behind
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                The man who built this dream — from food to code
              </p>
            </div>

            <div className="flex justify-center">
              {team.map((member, i) => (
                <div key={i} className="group relative max-w-md w-full">
                  {/* Card */}
                  <div className="relative bg-night-card border border-white/5 rounded-3xl p-8 text-center card-premium overflow-hidden">
                    {/* Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-gold/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Photo */}
                    <div className="relative mx-auto mb-6">
                      <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.color} blur-lg opacity-40 group-hover:opacity-70 transition-opacity`}
                      />
                      <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full overflow-hidden border-4 border-gold/30 group-hover:border-gold transition-all duration-500 group-hover:scale-105">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Role badge */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                        <span
                          className={`inline-flex items-center gap-1.5 bg-gradient-to-br ${member.color} text-night text-xs font-bold px-3 py-1.5 rounded-full shadow-gold`}
                        >
                          <member.icon size={12} />
                          <span>{member.role}</span>
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <h3 className="font-display text-2xl font-bold mb-2 mt-4 group-hover:text-gold transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed px-4">
                      {member.description}
                    </p>

                    {/* Bottom gold line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Bottom CTA ===== */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-gold/10 via-night to-night overflow-hidden">
          <div className="absolute inset-0 bg-dots opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/20 rounded-full blur-[100px]" />

          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="text-6xl mb-6 animate-bounce-soft">🍽️</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Ready to <span className="text-shimmer">Taste</span> the
              Difference?
            </h2>
            <p className="text-white/60 mb-8 text-lg">
              Aaiye, humari family ka hissa baniye — aur khaane ka maza lein! 🎉
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-gold to-gold-dark text-night font-bold px-10 py-4 rounded-full btn-premium shadow-gold text-base md:text-lg"
              >
                <ShoppingBag size={20} />
                <span>Order Now</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border-2 border-gold text-gold font-bold px-10 py-4 rounded-full hover:bg-gold hover:text-night transition text-base md:text-lg"
              >
                <span>Visit Us</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}