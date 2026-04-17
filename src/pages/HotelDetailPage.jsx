import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Phone, Mail, ChevronLeft, ChevronRight, Calendar, Users } from 'lucide-react'
import { hotelService } from '../services/hotelService'
import { roomService } from '../services/roomService'
import { useAuth } from '../context/AuthContext'
import { useAsync } from '../hooks'
import { Button, Spinner, EmptyState } from '../components/common/UI'
import RoomCard from '../components/hotel/RoomCard'
import StarRating from '../components/common/StarRating'
import { formatDateInput, nightsCount, formatCurrency } from '../utils'

export default function HotelDetailPage() {
  const { hotelId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const today    = formatDateInput(new Date())
  const tomorrow = formatDateInput(new Date(Date.now() + 86400000))

  const [checkIn,  setCheckIn]  = useState(today)
  const [checkOut, setCheckOut] = useState(tomorrow)
  const [guests,   setGuests]   = useState(2)
  const [imgIdx,   setImgIdx]   = useState(0)
  const [rooms,    setRooms]    = useState([])
  const [searching, setSearching] = useState(false)
  const [searched,  setSearched]  = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)

  const { data: hotel, loading, error } = useAsync(() => hotelService.getHotel(hotelId), [hotelId])

  const nights = checkIn && checkOut ? nightsCount(checkIn, checkOut) : 0

  const searchRooms = async () => {
    if (!checkIn || !checkOut || nights < 1) return
    setSearching(true)
    setSelectedRoom(null)
    try {
      const res = await roomService.getAvailableRooms(hotelId, checkIn, checkOut)
      setRooms(res)
      setSearched(true)
    } finally {
      setSearching(false)
    }
  }

  const handleBook = () => {
    if (!user) { navigate('/login'); return }
    if (!selectedRoom) return
    navigate('/booking', {
      state: {
        hotel,
        room: selectedRoom,
        checkIn,
        checkOut,
        guests,
        nights,
      }
    })
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={36} /></div>
  if (error || !hotel) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <span className="text-5xl mb-4">🏨</span>
      <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">Hotel not found</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6">This hotel may have been removed or doesn't exist.</p>
      <Button onClick={() => navigate('/hotels')}>Browse Hotels</Button>
    </div>
  )

  const images = hotel.imageIds || []
  const currentImg = images[imgIdx]
    ? hotelService.getImageUrl(images[imgIdx], 1200, 700)
    : hotel.imageUrl || 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200'

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 page-enter">
      {/* Hero image carousel */}
      <div className="relative h-72 sm:h-96 lg:h-[500px] bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <img src={currentImg} alt={hotel.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Image nav */}
        {images.length > 1 && (
          <>
            <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              aria-label="Previous image">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
              aria-label="Next image">
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-white w-5' : 'bg-white/40'}`}
                  aria-label={`Image ${i + 1}`} />
              ))}
            </div>
          </>
        )}

        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-1.5 text-white text-sm bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 hover:bg-black/50 transition-colors"
          id="hotel-back-btn">
          <ChevronLeft size={15} /> Back
        </button>

        {/* Hotel title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">{hotel.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1.5"><MapPin size={14} />{hotel.location}</span>
              <StarRating rating={hotel.rating || 0} size={15} />
              {hotel.reviewCount > 0 && <span>({hotel.reviewCount} reviews)</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Description */}
            <section className="mb-8">
              <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-3">About</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{hotel.description}</p>
            </section>

            {/* Amenities */}
            {hotel.amenities?.length > 0 && (
              <section className="mb-8">
                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map(a => (
                    <span key={a} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium border border-emerald-200 dark:border-emerald-800">
                      {a}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Contact */}
            <section className="mb-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5">
              <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-4">Contact & Location</h2>
              <div className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                {hotel.address  && <div className="flex items-center gap-2"><MapPin size={15} className="text-emerald-500 shrink-0" />{hotel.address}</div>}
                {hotel.phone    && <div className="flex items-center gap-2"><Phone size={15} className="text-emerald-500 shrink-0" />{hotel.phone}</div>}
                {hotel.email    && <div className="flex items-center gap-2"><Mail size={15} className="text-emerald-500 shrink-0" />{hotel.email}</div>}
              </div>
            </section>

            {/* Rooms section */}
            <section>
              <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-white mb-4">Available Rooms</h2>
              {!searched ? (
                <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                  <Calendar size={28} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Select your dates on the right to check room availability.</p>
                </div>
              ) : searching ? (
                <Spinner className="py-10" />
              ) : rooms.length === 0 ? (
                <EmptyState icon={Calendar} title="No rooms found" message="No rooms have been added to this hotel yet." />
              ) : (
                <div className="space-y-4">
                  {rooms.map(room => (
                    <RoomCard
                      key={room.$id}
                      room={room}
                      selected={selectedRoom?.$id === room.$id}
                      onSelect={setSelectedRoom}
                      checkIn={checkIn}
                      checkOut={checkOut}
                      nights={nights}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Booking sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xl p-6">
              <div className="mb-5">
                <span className="text-sm text-slate-400">Starting from</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(hotel.startingPrice)}</span>
                  <span className="text-sm text-slate-400">/night</span>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block flex items-center gap-1"><Calendar size={12} />Check-in</label>
                  <input type="date" value={checkIn} min={today} onChange={e => setCheckIn(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white" id="sidebar-checkin" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block flex items-center gap-1"><Calendar size={12} />Check-out</label>
                  <input type="date" value={checkOut} min={checkIn || today} onChange={e => setCheckOut(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white" id="sidebar-checkout" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block flex items-center gap-1"><Users size={12} />Guests</label>
                  <input type="number" value={guests} min={1} max={10} onChange={e => setGuests(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white" id="sidebar-guests" />
                </div>
              </div>

              {nights > 0 && (
                <div className="text-sm text-slate-500 dark:text-slate-400 mb-4 text-center">
                  {nights} night{nights > 1 ? 's' : ''} selected
                </div>
              )}

              <Button className="w-full mb-3" onClick={searchRooms} loading={searching} disabled={nights < 1} id="check-availability-btn">
                Check Availability
              </Button>

              {selectedRoom && (
                <div className="mb-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Selected: {selectedRoom.type}</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(selectedRoom.pricePerNight * nights)} total</p>
                </div>
              )}

              <Button
                variant={selectedRoom ? 'primary' : 'secondary'}
                className="w-full"
                disabled={!selectedRoom}
                onClick={handleBook}
                id="book-now-btn"
              >
                {selectedRoom ? 'Book Now' : 'Select a Room First'}
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
