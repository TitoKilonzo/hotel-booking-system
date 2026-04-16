import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, ChevronRight, Star, Shield, Clock, Award } from 'lucide-react'
import { Button } from '../components/common/UI'
import HotelCard from '../components/hotel/HotelCard'
import { useAsync } from '../hooks'
import { hotelService } from '../services/hotelService'
import { Skeleton } from '../components/common/UI'

const HERO_STATS = [
  { value: '500+', label: 'Premium Hotels' },
  { value: '50+', label: 'Destinations' },
  { value: '98%', label: 'Guest Satisfaction' },
  { value: '24/7', label: 'Support' },
]

const WHY_US = [
  { icon: Shield, title: 'Best Price Guarantee', desc: 'We match or beat any price you find elsewhere. No hidden fees, no surprises.' },
  { icon: Clock, title: 'Instant Confirmation', desc: 'Book in minutes, receive confirmation instantly. Your stay secured immediately.' },
  { icon: Award, title: 'Curated Excellence', desc: 'Every property is hand-selected and quality-verified by our expert team.' },
  { icon: Star, title: 'Loyalty Rewards', desc: 'Earn points on every stay. Redeem for free nights and exclusive upgrades.' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [searchForm, setSearchForm] = useState({ location: '', checkIn: '', checkOut: '' })

  const { data: featuredHotels, loading } = useAsync(
    () => hotelService.getHotels({ limit: 6 })
  )

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchForm.location) params.set('location', searchForm.location)
    if (searchForm.checkIn)  params.set('checkIn', searchForm.checkIn)
    if (searchForm.checkOut) params.set('checkOut', searchForm.checkOut)
    navigate(`/hotels?${params.toString()}`)
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="page-enter">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] bg-slate-950 flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600')] bg-cover bg-center opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-slate-900/80" />
          <div className="absolute inset-0 bg-hero-pattern opacity-20" />
          {/* Decorative orb */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-1.5 mb-6">
              <Star size={12} className="text-gold-400 fill-gold-400" />
              <span className="text-gold-400 text-sm font-medium">World's #1 Luxury Hotel Booking Platform</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Experience
              <span className="block text-gradient-gold italic">Extraordinary</span>
              Hospitality
            </h1>

            <p className="text-slate-300 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed">
              Discover handpicked luxury hotels and resorts across the world.
              Seamless booking, unmatched comfort.
            </p>

            {/* Search box */}
            <form onSubmit={handleSearch} className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 flex-1 px-3 py-2">
                <MapPin size={16} className="text-gold-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={searchForm.location}
                  onChange={e => setSearchForm(f => ({ ...f, location: e.target.value }))}
                  className="flex-1 bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 outline-none"
                />
              </div>
              <div className="hidden sm:block w-px bg-slate-200 dark:bg-slate-600 my-1" />
              <div className="flex items-center gap-2 flex-1 px-3 py-2">
                <Calendar size={16} className="text-gold-500 shrink-0" />
                <input
                  type="date"
                  value={searchForm.checkIn}
                  min={today}
                  onChange={e => setSearchForm(f => ({ ...f, checkIn: e.target.value }))}
                  className="flex-1 bg-transparent text-sm text-slate-600 dark:text-slate-300 outline-none"
                />
              </div>
              <div className="hidden sm:block w-px bg-slate-200 dark:bg-slate-600 my-1" />
              <div className="flex items-center gap-2 flex-1 px-3 py-2">
                <Calendar size={16} className="text-gold-500 shrink-0" />
                <input
                  type="date"
                  value={searchForm.checkOut}
                  min={searchForm.checkIn || today}
                  onChange={e => setSearchForm(f => ({ ...f, checkOut: e.target.value }))}
                  className="flex-1 bg-transparent text-sm text-slate-600 dark:text-slate-300 outline-none"
                />
              </div>
              <Button type="submit" size="lg" icon={Search} className="sm:px-6 shrink-0">
                Search
              </Button>
            </form>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16">
            {HERO_STATS.map(({ value, label }) => (
              <div key={label} className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-display font-bold text-gradient-gold">{value}</div>
                <div className="text-slate-400 text-sm mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED HOTELS ───────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gold-600 dark:text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">
                Handpicked for You
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Featured Properties
              </h2>
            </div>
            <Button variant="outline" iconRight={ChevronRight} onClick={() => navigate('/hotels')} className="hidden sm:flex">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden">
                    <Skeleton className="h-52" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))
              : featuredHotels?.documents?.map(hotel => (
                  <HotelCard key={hotel.$id} hotel={hotel} />
                ))
            }
          </div>

          <div className="text-center mt-10">
            <Button size="lg" onClick={() => navigate('/hotels')}>Explore All Hotels</Button>
          </div>
        </div>
      </section>

      {/* ── WHY LUXESTAY ──────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-gold-600 dark:text-gold-400 text-sm font-semibold uppercase tracking-widest mb-2">Our Promise</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Why Book with LuxeStay?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-gold-50 dark:bg-gold-900/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-gold-500 transition-colors">
                  <Icon size={24} className="text-gold-600 dark:text-gold-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
            <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-4 relative">Limited Offer</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 relative">
              Your Dream Stay<br />
              <span className="text-gradient-gold italic">Awaits You</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Sign up today and receive 15% off your first booking. Luxury doesn't have to break the bank.
            </p>
            <Button size="xl" onClick={() => navigate('/register')}>
              Claim Your Discount →
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
