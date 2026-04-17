import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, ChevronRight, Star, Shield, Clock, Award, Users, Palmtree, Compass, Heart } from 'lucide-react'
import { Button } from '../components/common/UI'
import HotelCard from '../components/hotel/HotelCard'
import { useAsync } from '../hooks'
import { hotelService } from '../services/hotelService'
import { Skeleton } from '../components/common/UI'
import { KENYAN_DESTINATIONS } from '../utils'

const HERO_STATS = [
  { value: '200+', label: 'Premium Hotels' },
  { value: '47', label: 'Counties Covered' },
  { value: '98%', label: 'Guest Satisfaction' },
  { value: '24/7', label: 'Kenyan Support' },
]

const WHY_US = [
  { icon: Shield, title: 'Best Price Guarantee', desc: 'We match or beat any price you find. No hidden fees, pay in KES.' },
  { icon: Clock, title: 'Instant Confirmation', desc: 'Book in minutes, get confirmed instantly. Your stay secured immediately.' },
  { icon: Award, title: 'Curated Excellence', desc: 'Every property is hand-verified by our Kenyan travel experts.' },
  { icon: Heart, title: 'Local Rewards', desc: 'Earn points on every stay. Redeem for free nights across Kenya.' },
]

const TESTIMONIALS = [
  { name: 'Grace Wanjiku', role: 'Nairobi', text: 'TembeaKenya made booking our anniversary trip to Diani so effortless. The hotel was even better than the photos!', rating: 5 },
  { name: 'James Ochieng', role: 'Kisumu', text: 'I travel for work across Kenya monthly. This platform saves me hours and always finds the best deals.', rating: 5 },
  { name: 'Amina Hassan', role: 'Mombasa', text: 'The Maasai Mara lodge we booked through TembeaKenya was world-class. Truly proud of Kenyan hospitality!', rating: 5 },
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

  // Hero Background Images
  const heroImages = [
    'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1600&auto=format&fit=crop&q=80', // Safari/Nature
    'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1600&auto=format&fit=crop&q=80', // Beach/Diani
    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&auto=format&fit=crop&q=80', // Luxury Resort
    'https://images.unsplash.com/photo-1455587734955-081b22074882?w=1600&auto=format&fit=crop&q=80'  // Elegant Pool
  ]
  const [currentHeroImage, setCurrentHeroImage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroImages.length])

  return (
    <div className="page-enter">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] bg-slate-950 flex items-center overflow-hidden" id="hero-section">
        {/* Real Image Background Carousel */}
        {heroImages.map((img, idx) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentHeroImage ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={img} alt="Hero Background" className="w-full h-full object-cover object-center" />
          </div>
        ))}
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
              Discover
              <span className="block text-emerald-400 italic font-medium">Magical Kenya</span>
              Your Way
            </h1>

            <p className="text-slate-200 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed animate-fade-in-up-delay">
              From Nairobi's skyline to Mombasa's shores, Maasai Mara's savannahs to Diani's white sands — book extraordinary stays across Kenya.
            </p>

            {/* Search box */}
            <form onSubmit={handleSearch} className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl flex flex-col sm:flex-row gap-2 animate-fade-in-up-delay-2" id="hero-search-form">
              <div className="flex items-center gap-2 flex-1 px-3 py-2">
                <MapPin size={16} className="text-emerald-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Where in Kenya?"
                  value={searchForm.location}
                  onChange={e => setSearchForm(f => ({ ...f, location: e.target.value }))}
                  className="flex-1 bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 outline-none"
                  id="hero-search-location"
                />
              </div>
              <div className="hidden sm:block w-px bg-slate-200 dark:bg-slate-600 my-1" />
              <div className="flex items-center gap-2 flex-1 px-3 py-2">
                <Calendar size={16} className="text-emerald-500 shrink-0" />
                <input
                  type="date"
                  value={searchForm.checkIn}
                  min={today}
                  onChange={e => setSearchForm(f => ({ ...f, checkIn: e.target.value }))}
                  className="flex-1 bg-transparent text-sm text-slate-600 dark:text-slate-300 outline-none"
                  id="hero-search-checkin"
                />
              </div>
              <div className="hidden sm:block w-px bg-slate-200 dark:bg-slate-600 my-1" />
              <div className="flex items-center gap-2 flex-1 px-3 py-2">
                <Calendar size={16} className="text-emerald-500 shrink-0" />
                <input
                  type="date"
                  value={searchForm.checkOut}
                  min={searchForm.checkIn || today}
                  onChange={e => setSearchForm(f => ({ ...f, checkOut: e.target.value }))}
                  className="flex-1 bg-transparent text-sm text-slate-600 dark:text-slate-300 outline-none"
                  id="hero-search-checkout"
                />
              </div>
              <Button type="submit" size="lg" icon={Search} className="sm:px-6 shrink-0" id="hero-search-btn">
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

      {/* ── POPULAR DESTINATIONS ───────────────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900" id="destinations-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-2">Explore Kenya</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Popular Destinations</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {KENYAN_DESTINATIONS.map((dest, i) => (
              <button
                key={dest.name}
                onClick={() => navigate(`/hotels?location=${encodeURIComponent(dest.name)}`)}
                className="group relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl p-5 text-left border border-slate-100 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                id={`dest-${dest.name.toLowerCase().replace(/\s/g, '-')}`}
              >
                <span className="text-3xl mb-3 block">{dest.emoji}</span>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{dest.tagline}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED HOTELS ───────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50" id="featured-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-2">
                Handpicked for You
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                Featured Properties
              </h2>
            </div>
            <Button variant="outline" iconRight={ChevronRight} onClick={() => navigate('/hotels')} className="hidden sm:flex" id="view-all-hotels-btn">
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
            <Button size="lg" onClick={() => navigate('/hotels')} id="explore-all-btn">Explore All Hotels</Button>
          </div>
        </div>
      </section>

      {/* ── WHY TEMBEAKENYA ──────────────────────────────────────────── */}
      <section className="py-20" id="why-us-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-2">Our Promise</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Why Book with TembeaKenya?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-5 group-hover:bg-emerald-500 transition-all duration-300 group-hover:scale-110">
                  <Icon size={24} className="text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50" id="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-2">Testimonials</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-950 relative overflow-hidden" id="cta-section">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-gold-500/10 rounded-full blur-3xl animate-float-reverse" />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="relative">
            <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-4">Limited Offer</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
              Your Dream Safari<br />
              <span className="text-gradient-gold italic">Starts Here</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Sign up today and receive 15% off your first booking. Experience Kenya like never before.
            </p>
            <Button size="xl" onClick={() => navigate('/register')} id="cta-register-btn">
              Start Your Journey →
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
