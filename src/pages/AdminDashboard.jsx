import { useState } from 'react'
import { useAsync } from '../hooks'
import { hotelService } from '../services/hotelService'
import { roomService } from '../services/roomService'
import { bookingService } from '../services/bookingService'
import { databases, DB_ID, USERS_COL, Query } from '../config/appwrite'
import { Button, Skeleton, Modal, EmptyState } from '../components/common/UI'
import HotelFormModal from '../components/admin/HotelFormModal'
import RoomFormModal from '../components/admin/RoomFormModal'
import BookingStatusBadge from '../components/booking/BookingStatusBadge'
import { Hotel, BedDouble, CalendarCheck, Users, Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { formatCurrency, formatDate } from '../utils'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshKey, setRefreshKey] = useState(0)
  const refresh = () => setRefreshKey(k => k + 1)

  const { data: stats, loading: statsLoading } = useAsync(async () => {
    const [hotels, bookingStats, users] = await Promise.all([
      hotelService.getHotels({ limit: 1 }),
      bookingService.getDashboardStats(),
      databases.listDocuments(DB_ID, USERS_COL, [Query.limit(1)]),
    ])
    return { hotels: hotels.total, users: users.total, ...bookingStats }
  }, [refreshKey])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/30 page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage hotels, rooms, and reservations</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Hotels',   value: stats?.hotels,    icon: Hotel,         color: 'blue' },
            { label: 'Total Users',    value: stats?.users,     icon: Users,         color: 'purple' },
            { label: 'Total Bookings', value: stats?.total,     icon: CalendarCheck, color: 'gold' },
            { label: 'Pending',        value: stats?.pending,   icon: BedDouble,     color: 'amber' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
                <div className={`w-8 h-8 rounded-lg bg-${color}-50 dark:bg-${color}-900/20 flex items-center justify-center`}>
                  <Icon size={16} className={`text-${color}-600 dark:text-${color}-400`} />
                </div>
              </div>
              {statsLoading
                ? <Skeleton className="h-8 w-16" />
                : <div className="text-2xl font-bold text-slate-900 dark:text-white">{value ?? '—'}</div>
              }
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6 w-fit overflow-x-auto">
          {['overview', 'hotels', 'rooms', 'bookings'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                activeTab === t
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'overview'  && <OverviewTab refresh={refresh} />}
        {activeTab === 'hotels'    && <HotelsTab refreshKey={refreshKey} refresh={refresh} />}
        {activeTab === 'rooms'     && <RoomsTab  refreshKey={refreshKey} refresh={refresh} />}
        {activeTab === 'bookings'  && <BookingsTab refreshKey={refreshKey} refresh={refresh} />}
      </div>
    </div>
  )
}

// ─── Overview tab: recent bookings ────────────────────────────────────────────
function OverviewTab({ refresh }) {
  const { data, loading } = useAsync(() => bookingService.getAllBookings({ limit: 10 }))
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Bookings</h2>
      {loading ? <Skeleton className="h-64 rounded-2xl" /> : (
        <BookingsTable bookings={data?.documents || []} onRefresh={refresh} />
      )}
    </div>
  )
}

// ─── Hotels tab ───────────────────────────────────────────────────────────────
function HotelsTab({ refreshKey, refresh }) {
  const [showAdd, setShowAdd]   = useState(false)
  const [editing, setEditing]   = useState(null)
  const [deleting, setDeleting] = useState(null)

  const { data, loading } = useAsync(() => hotelService.getHotels({ limit: 50 }), [refreshKey])

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await hotelService.deleteHotel(deleting.$id)
      toast.success('Hotel deleted')
      refresh()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Hotels ({data?.total ?? 0})</h2>
        <Button icon={Plus} size="sm" onClick={() => setShowAdd(true)}>Add Hotel</Button>
      </div>

      {loading ? <Skeleton className="h-64 rounded-2xl" /> : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
          {data?.documents.length === 0 ? (
            <EmptyState icon={Hotel} title="No hotels yet" message="Add your first hotel." />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase">
                <tr>
                  {['Name', 'Location', 'Category', 'Price', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {data.documents.map(hotel => (
                  <tr key={hotel.$id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{hotel.name}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{hotel.location}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{hotel.category}</td>
                    <td className="px-4 py-3 font-medium text-gold-600 dark:text-gold-400">{formatCurrency(hotel.startingPrice)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setEditing(hotel)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => setDeleting(hotel)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <HotelFormModal open={showAdd}   onClose={() => setShowAdd(false)}  onSuccess={refresh} />
      <HotelFormModal open={!!editing} onClose={() => setEditing(null)} hotel={editing} onSuccess={refresh} />

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete Hotel">
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Are you sure you want to delete <strong>{deleting?.name}</strong>? This action is permanent.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="danger"    className="flex-1" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}

// ─── Rooms tab ────────────────────────────────────────────────────────────────
function RoomsTab({ refreshKey, refresh }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [selectedHotelId, setSelectedHotelId] = useState('')

  const { data: hotelsData } = useAsync(() => hotelService.getHotels({ limit: 50 }))
  const { data: roomsData, loading } = useAsync(
    () => selectedHotelId
      ? roomService.getRoomsByHotel(selectedHotelId)
      : Promise.resolve({ documents: [], total: 0 }),
    [selectedHotelId, refreshKey]
  )

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white">Rooms</h2>
        <select
          value={selectedHotelId}
          onChange={e => setSelectedHotelId(e.target.value)}
          className="text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300"
        >
          <option value="">— Select a hotel —</option>
          {hotelsData?.documents.map(h => <option key={h.$id} value={h.$id}>{h.name}</option>)}
        </select>
        {selectedHotelId && <Button icon={Plus} size="sm" onClick={() => setShowAdd(true)}>Add Room</Button>}
      </div>

      {!selectedHotelId ? (
        <EmptyState icon={BedDouble} title="Select a hotel" message="Choose a hotel above to manage its rooms." />
      ) : loading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
          {roomsData?.documents.length === 0 ? (
            <EmptyState icon={BedDouble} title="No rooms" message="Add the first room for this hotel." />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase">
                <tr>
                  {['Type', 'Capacity', 'Price/Night', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {roomsData.documents.map(room => (
                  <tr key={room.$id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{room.type}</td>
                    <td className="px-4 py-3 text-slate-500">{room.capacity}</td>
                    <td className="px-4 py-3 text-gold-600 dark:text-gold-400 font-medium">{formatCurrency(room.pricePerNight)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${room.isAvailable ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
                        {room.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setEditing(room)} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-colors"><Pencil size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <RoomFormModal open={showAdd}   onClose={() => setShowAdd(false)} hotelId={selectedHotelId} onSuccess={refresh} />
      <RoomFormModal open={!!editing} onClose={() => setEditing(null)} room={editing} hotelId={selectedHotelId} onSuccess={refresh} />
    </div>
  )
}

// ─── Bookings tab ─────────────────────────────────────────────────────────────
function BookingsTab({ refreshKey, refresh }) {
  const { data, loading } = useAsync(() => bookingService.getAllBookings({ limit: 100 }), [refreshKey])

  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-4">
        All Bookings ({data?.total ?? 0})
      </h2>
      {loading ? <Skeleton className="h-64 rounded-2xl" /> : (
        <BookingsTable bookings={data?.documents || []} onRefresh={refresh} showAdmin />
      )}
    </div>
  )
}

// ─── Shared bookings table ────────────────────────────────────────────────────
function BookingsTable({ bookings, onRefresh, showAdmin }) {
  const handleStatus = async (bookingId, status) => {
    try {
      await bookingService.updateStatus(bookingId, status)
      toast.success('Status updated')
      onRefresh()
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (bookings.length === 0) return <EmptyState icon={CalendarCheck} title="No bookings" message="Bookings will appear here." />

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-500 dark:text-slate-400 uppercase">
          <tr>
            {['ID', 'Check-in', 'Check-out', 'Guests', 'Total', 'Status', showAdmin && 'Actions'].filter(Boolean).map(h => (
              <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {bookings.map(b => (
            <tr key={b.$id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
              <td className="px-4 py-3 font-mono text-xs text-slate-500">#{b.$id.slice(-6).toUpperCase()}</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatDate(b.checkInDate)}</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatDate(b.checkOutDate)}</td>
              <td className="px-4 py-3 text-slate-500">{b.guestCount}</td>
              <td className="px-4 py-3 font-medium text-gold-600 dark:text-gold-400">{formatCurrency(b.totalPrice)}</td>
              <td className="px-4 py-3"><BookingStatusBadge status={b.status} /></td>
              {showAdmin && (
                <td className="px-4 py-3">
                  <select
                    value={b.status}
                    onChange={e => handleStatus(b.$id, e.target.value)}
                    className="text-xs bg-transparent border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 text-slate-600 dark:text-slate-400"
                  >
                    {['pending', 'confirmed', 'cancelled', 'completed'].map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
