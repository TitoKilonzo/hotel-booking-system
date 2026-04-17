import {
  databases, DB_ID, BOOKINGS_COL, ROOMS_COL, Query, ID, BOOKING_STATUS
} from '../config/appwrite'
import { roomService } from './roomService'
import { differenceInDays } from 'date-fns'

// ─── Booking Service ──────────────────────────────────────────────────────────

export const bookingService = {
  // Create a new booking with conflict prevention
  async createBooking({ userId, roomId, hotelId, checkInDate, checkOutDate, guestCount, specialRequests }) {
    // 1. Verify availability (double-booking prevention)
    const available = await roomService.checkAvailability(roomId, checkInDate, checkOutDate)
    if (!available) throw new Error('Room is not available for selected dates.')

    const nights = differenceInDays(new Date(checkOutDate), new Date(checkInDate))
    if (nights < 1) throw new Error('Check-out must be after check-in.')

    // Mock booking handling
    if (roomId.startsWith('mock-')) {
      const room = await roomService.getRoom(roomId)
      const totalPrice = nights * room.pricePerNight
      return {
        booking: { $id: `mock-booking-${Date.now()}`, roomId, hotelId, userId, checkInDate, checkOutDate, nights, totalPrice, status: BOOKING_STATUS.PENDING },
        room,
        totalPrice,
        nights
      }
    }

    // 2. Get room to calculate price
    const room = await databases.getDocument(DB_ID, ROOMS_COL, roomId)
    
    const totalPrice = nights * room.pricePerNight

    // 3. Create booking document
    const booking = await databases.createDocument(DB_ID, BOOKINGS_COL, ID.unique(), {
      userId,
      roomId,
      hotelId,
      checkInDate,
      checkOutDate,
      status: BOOKING_STATUS.PENDING,
      totalPrice,
      nights,
      guestCount: guestCount || 1,
      specialRequests: specialRequests || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return { booking, room, totalPrice, nights }
  },

  // Get bookings for a user
  async getUserBookings(userId) {
    return databases.listDocuments(DB_ID, BOOKINGS_COL, [
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
      Query.limit(50),
    ])
  },

  // Get all bookings (admin)
  async getAllBookings({ page = 1, limit = 20, status = null } = {}) {
    const queries = [
      Query.orderDesc('$createdAt'),
      Query.limit(limit),
      Query.offset((page - 1) * limit),
    ]
    if (status) queries.push(Query.equal('status', status))
    return databases.listDocuments(DB_ID, BOOKINGS_COL, queries)
  },

  // Get single booking
  async getBooking(bookingId) {
    return databases.getDocument(DB_ID, BOOKINGS_COL, bookingId)
  },

  // Update booking status (admin or system)
  async updateStatus(bookingId, status) {
    return databases.updateDocument(DB_ID, BOOKINGS_COL, bookingId, {
      status,
      updatedAt: new Date().toISOString(),
    })
  },

  // Cancel booking (by user – only if pending or confirmed)
  async cancelBooking(bookingId, userId) {
    const booking = await this.getBooking(bookingId)
    if (booking.userId !== userId) throw new Error('Unauthorized')
    if (booking.status === BOOKING_STATUS.CANCELLED) throw new Error('Already cancelled')
    if (booking.status === BOOKING_STATUS.COMPLETED)  throw new Error('Cannot cancel completed booking')

    return databases.updateDocument(DB_ID, BOOKINGS_COL, bookingId, {
      status: BOOKING_STATUS.CANCELLED,
      updatedAt: new Date().toISOString(),
    })
  },

  // Get bookings for a hotel (admin)
  async getHotelBookings(hotelId) {
    return databases.listDocuments(DB_ID, BOOKINGS_COL, [
      Query.equal('hotelId', hotelId),
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ])
  },

  // Stats for admin dashboard
  async getDashboardStats() {
    const [all, pending, confirmed, cancelled] = await Promise.all([
      databases.listDocuments(DB_ID, BOOKINGS_COL, [Query.limit(1)]),
      databases.listDocuments(DB_ID, BOOKINGS_COL, [Query.equal('status', 'pending'), Query.limit(1)]),
      databases.listDocuments(DB_ID, BOOKINGS_COL, [Query.equal('status', 'confirmed'), Query.limit(1)]),
      databases.listDocuments(DB_ID, BOOKINGS_COL, [Query.equal('status', 'cancelled'), Query.limit(1)]),
    ])
    return {
      total: all.total,
      pending: pending.total,
      confirmed: confirmed.total,
      cancelled: cancelled.total,
    }
  },
}
