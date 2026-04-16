import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, CreditCard, Trash2 } from 'lucide-react'
import { bookingService } from '../../services/bookingService'
import { useAuth } from '../../context/AuthContext'
import { formatDate, formatCurrency, nightsCount } from '../../utils'
import { Button, Modal } from '../common/UI'
import BookingStatusBadge from './BookingStatusBadge'
import toast from 'react-hot-toast'

export default function BookingCard({ booking, hotelName, roomType, onUpdate }) {
  const { user } = useAuth()
  const [cancelling, setCancelling] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const nights = nightsCount(booking.checkInDate, booking.checkOutDate)
  const canCancel = ['pending', 'confirmed'].includes(booking.status)

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await bookingService.cancelBooking(booking.$id, user.$id)
      toast.success('Booking cancelled')
      onUpdate?.()
    } catch (err) {
      toast.error(err.message || 'Failed to cancel')
    } finally {
      setCancelling(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card overflow-hidden">
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <Link
                to={`/hotels/${booking.hotelId}`}
                className="font-display font-semibold text-slate-900 dark:text-white hover:text-gold-600 dark:hover:text-gold-400 transition-colors"
              >
                {hotelName || 'Hotel'}
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{roomType || 'Room'}</p>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="flex items-start gap-2">
              <Calendar size={14} className="text-gold-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Check-in</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatDate(booking.checkInDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar size={14} className="text-gold-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Check-out</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatDate(booking.checkOutDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users size={14} className="text-gold-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Guests</p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{booking.guestCount} guest{booking.guestCount > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CreditCard size={14} className="text-gold-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Total ({nights}n)</p>
                <p className="text-sm font-bold text-gold-600 dark:text-gold-400">{formatCurrency(booking.totalPrice)}</p>
              </div>
            </div>
          </div>

          {booking.specialRequests && (
            <p className="text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2 mb-4">
              <span className="font-medium">Note:</span> {booking.specialRequests}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Booked {formatDate(booking.createdAt)} · #{booking.$id.slice(-6).toUpperCase()}
          </span>
          {canCancel && (
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={() => setShowConfirm(true)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Confirm cancel modal */}
      <Modal open={showConfirm} onClose={() => setShowConfirm(false)} title="Cancel Booking">
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
          Are you sure you want to cancel this booking? This action cannot be undone and refund policies may apply.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setShowConfirm(false)}>Keep Booking</Button>
          <Button variant="danger" className="flex-1" loading={cancelling} onClick={handleCancel}>Yes, Cancel</Button>
        </div>
      </Modal>
    </>
  )
}
