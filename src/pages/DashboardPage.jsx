import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useAsync } from '../hooks'
import { bookingService } from '../services/bookingService'
import { hotelService } from '../services/hotelService'
import { roomService } from '../services/roomService'
import BookingCard from '../components/booking/BookingCard'
import { Spinner, EmptyState, Button, Skeleton } from '../components/common/UI'
import { CalendarDays, User, BookOpen, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BOOKING_STATUS } from '../config/appwrite'

const TABS = [
  { id: 'all',       label: 'All',       status: null },
  { id: 'upcoming',  label: 'Upcoming',  status: BOOKING_STATUS.CONFIRMED },
  { id: 'pending',   label: 'Pending',   status: BOOKING_STATUS.PENDING },
  { id: 'cancelled', label: 'Cancelled', status: BOOKING_STATUS.CANCELLED },
]

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [refreshKey, setRefreshKey] = useState(0)

  const { data, loading } = useAsync(
    async () => {
      if (!user?.$id) return []
      const { documents: bookings } = await bookingService.getUserBookings(user.$id)
      // Enrich with hotel and room names
      const enriched = await Promise.all(bookings.map(async b => {
        const [hotel, room] = await Promise.allSettled([
          hotelService.getHotel(b.hotelId),
          roomService.getRoom(b.roomId),
        ])
        return {
          ...b,
          hotelName: hotel.status === 'fulfilled' ? hotel.value.name : 'Hotel',
          roomType:  room.status  === 'fulfilled' ? room.value.type  : 'Room',
        }
      }))
      return enriched
    },
    [user?.$id, refreshKey]
  )

  const filtered = data?.filter(b => {
    if (tab === 'all') return true
    const t = TABS.find(x => x.id === tab)
    return t?.status ? b.status === t.status : true
  }) || []

  const counts = data
    ? TABS.reduce((acc, t) => {
        acc[t.id] = t.status ? data.filter(b => b.status === t.status).length : data.length
        return acc
      }, {})
    : {}

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/30 page-enter">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">
              My Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Karibu, <span className="font-medium text-slate-700 dark:text-slate-300">{profile?.name}</span> 🇰🇪
            </p>
          </div>
          <Button onClick={() => navigate('/hotels')} iconRight={ChevronRight} size="sm" id="dash-book-stay-btn">
            Book a Stay
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)
            : [
                { label: 'Total Bookings', value: data?.length || 0, icon: BookOpen },
                { label: 'Upcoming',       value: data?.filter(b => b.status === 'confirmed').length || 0, icon: CalendarDays },
                { label: 'Pending',        value: data?.filter(b => b.status === 'pending').length || 0, icon: CalendarDays },
                { label: 'Completed',      value: data?.filter(b => b.status === 'completed').length || 0, icon: User },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white">{value}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">{label}</div>
                  </div>
                </div>
              ))
          }
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6 w-fit overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                tab === t.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
              id={`tab-${t.id}`}
            >
              {t.label}
              {!loading && counts[t.id] > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 ${tab === t.id ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'}`}>
                  {counts[t.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No bookings found"
            message={tab === 'all' ? "You haven't made any bookings yet. Start exploring Kenya's finest hotels!" : `No ${tab} bookings.`}
            action={<Button onClick={() => navigate('/hotels')} id="explore-hotels-btn">Explore Hotels</Button>}
          />
        ) : (
          <div className="space-y-4">
            {filtered.map(b => (
              <BookingCard
                key={b.$id}
                booking={b}
                hotelName={b.hotelName}
                roomType={b.roomType}
                onUpdate={() => setRefreshKey(k => k + 1)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
