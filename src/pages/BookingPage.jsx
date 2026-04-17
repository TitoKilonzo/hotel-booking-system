import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { bookingService } from '../services/bookingService'
import { useAuth } from '../context/AuthContext'
import { Button, Input, Textarea } from '../components/common/UI'
import { formatDate, formatCurrency, nightsCount } from '../utils'
import { Calendar, Users, CreditCard, ChevronLeft, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function BookingPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user, profile } = useAuth()

  const state = location.state
  if (!state?.hotel || !state?.room) {
    navigate('/hotels', { replace: true })
    return null
  }

  const { hotel, room, checkIn, checkOut, guests } = state
  const nights    = nightsCount(checkIn, checkOut)
  const total     = room.pricePerNight * nights

  const [form, setForm] = useState({
    firstName:  profile?.name?.split(' ')[0] || '',
    lastName:   profile?.name?.split(' ').slice(1).join(' ') || '',
    email:      profile?.email || '',
    phone:      profile?.phone || '',
    specialRequests: '',
  })
  const [booking,  setBooking] = useState(null)
  const [loading,  setLoading] = useState(false)
  const [errors,   setErrors]  = useState({})

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.firstName) e.firstName = 'Required'
    if (!form.lastName)  e.lastName  = 'Required'
    if (!form.email)     e.email     = 'Required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const result = await bookingService.createBooking({
        userId:          user.$id,
        roomId:          room.$id,
        hotelId:         hotel.$id,
        checkInDate:     checkIn,
        checkOutDate:    checkOut,
        guestCount:      guests || 2,
        specialRequests: form.specialRequests,
      })
      setBooking(result.booking)
      toast.success('🎉 Booking confirmed!')
    } catch (err) {
      toast.error(err.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (booking) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900/30 flex items-center justify-center p-4 page-enter">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">Booking Confirmed! 🇰🇪</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Your reservation has been successfully created. Asante sana for choosing TembeaKenya!
          </p>

          <div className="bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-4 mb-6 text-left space-y-2.5 text-sm">
            <Row label="Hotel"    value={hotel.name} />
            <Row label="Room"     value={room.type} />
            <Row label="Check-in"  value={formatDate(checkIn)} />
            <Row label="Check-out" value={formatDate(checkOut)} />
            <Row label="Nights"   value={nights} />
            <Row label="Guests"   value={guests} />
            <div className="border-t border-slate-200 dark:border-slate-600 pt-2.5">
              <Row label="Total Paid" value={formatCurrency(total)} bold />
            </div>
            <Row label="Booking ID" value={`#${booking.$id.slice(-8).toUpperCase()}`} mono />
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => navigate('/hotels')} id="browse-more-btn">Browse More</Button>
            <Button className="flex-1" onClick={() => navigate('/dashboard')} id="my-bookings-btn">My Bookings</Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Booking form ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/30 page-enter">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors" id="booking-back-btn">
          <ChevronLeft size={16} /> Back to hotel
        </button>

        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-8">Complete Your Booking</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-6">
            {/* Guest info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
              <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-5">Guest Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="First Name *" value={form.firstName} onChange={set('firstName')} error={errors.firstName} placeholder="John" id="booking-firstname" />
                <Input label="Last Name *"  value={form.lastName}  onChange={set('lastName')}  error={errors.lastName}  placeholder="Kamau" id="booking-lastname" />
                <Input label="Email *" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="john@example.com" id="booking-email" />
                <Input label="Phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+254 7XX XXX XXX" id="booking-phone" />
              </div>
              <div className="mt-4">
                <Textarea
                  label="Special Requests (optional)"
                  value={form.specialRequests}
                  onChange={set('specialRequests')}
                  placeholder="Early check-in, dietary requirements, accessibility needs, room preferences..."
                  rows={3}
                  id="booking-requests"
                />
              </div>
            </div>

            {/* Payment placeholder */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
              <h2 className="font-display font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <CreditCard size={18} className="text-emerald-500" />
                Payment Method
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Payment is processed securely at the hotel. This booking creates a reservation.
              </p>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
                💳 Pay at hotel — No charges made now. M-PESA and card payments accepted at check-in.
              </div>
            </div>

            <Button type="submit" size="xl" className="w-full" loading={loading} id="confirm-booking-btn">
              Confirm Reservation — {formatCurrency(total)}
            </Button>

            <p className="text-xs text-center text-slate-400 dark:text-slate-500">
              By confirming, you agree to our Terms of Service and Cancellation Policy.
            </p>
          </form>

          {/* Booking summary sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
              <div className="bg-slate-900 dark:bg-slate-950 p-5 text-white">
                <h3 className="font-display font-semibold text-lg mb-1">{hotel.name}</h3>
                <p className="text-slate-300 text-sm">{room.type} · {hotel.location}</p>
              </div>
              <div className="p-5 space-y-3">
                <SummaryRow icon={Calendar} label="Check-in"  value={formatDate(checkIn)} />
                <SummaryRow icon={Calendar} label="Check-out" value={formatDate(checkOut)} />
                <SummaryRow icon={Users}    label="Guests"    value={`${guests} guest${guests > 1 ? 's' : ''}`} />
                <div className="border-t border-slate-100 dark:border-slate-700 pt-3 space-y-2">
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>{formatCurrency(room.pricePerNight)} × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span>{formatCurrency(room.pricePerNight * nights)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                    <span>Taxes & fees</span>
                    <span>Included</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white text-base border-t border-slate-100 dark:border-slate-700 pt-2">
                    <span>Total</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(total)}</span>
                  </div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400">
                  ✓ Free cancellation up to 24h before check-in
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, bold, mono }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className={`text-slate-900 dark:text-white ${bold ? 'font-bold' : ''} ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  )
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={15} className="text-emerald-500 shrink-0" />
      <div className="flex-1 flex justify-between text-sm">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-medium text-slate-800 dark:text-slate-200">{value}</span>
      </div>
    </div>
  )
}
