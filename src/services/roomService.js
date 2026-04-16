import {
  databases, DB_ID, ROOMS_COL, BOOKINGS_COL, Query, ID, BOOKING_STATUS
} from '../config/appwrite'

// ─── Room Service ─────────────────────────────────────────────────────────────

export const roomService = {
  // Get all rooms for a hotel
  async getRoomsByHotel(hotelId) {
    return databases.listDocuments(DB_ID, ROOMS_COL, [
      Query.equal('hotelId', hotelId),
      Query.orderAsc('pricePerNight'),
      Query.limit(50),
    ])
  },

  // Get single room
  async getRoom(roomId) {
    return databases.getDocument(DB_ID, ROOMS_COL, roomId)
  },

  // Create room (admin)
  async createRoom(data) {
    return databases.createDocument(DB_ID, ROOMS_COL, ID.unique(), {
      ...data,
      isAvailable: true,
      createdAt: new Date().toISOString(),
    })
  },

  // Update room (admin)
  async updateRoom(roomId, data) {
    return databases.updateDocument(DB_ID, ROOMS_COL, roomId, data)
  },

  // Delete room (admin)
  async deleteRoom(roomId) {
    return databases.deleteDocument(DB_ID, ROOMS_COL, roomId)
  },

  // ── Availability Check ──────────────────────────────────────────────────────
  // Check if a room is available for given dates (conflict detection)
  async checkAvailability(roomId, checkIn, checkOut) {
    // Get all active bookings for this room
    const existing = await databases.listDocuments(DB_ID, BOOKINGS_COL, [
      Query.equal('roomId', roomId),
      Query.notEqual('status', BOOKING_STATUS.CANCELLED),
      Query.limit(100),
    ])

    const inDate  = new Date(checkIn)
    const outDate = new Date(checkOut)

    // Check for any date overlap
    const hasConflict = existing.documents.some(booking => {
      const bIn  = new Date(booking.checkInDate)
      const bOut = new Date(booking.checkOutDate)
      // Overlap condition: new check-in < existing check-out AND new check-out > existing check-in
      return inDate < bOut && outDate > bIn
    })

    return !hasConflict // true = available
  },

  // Get all available rooms for a hotel and dates
  async getAvailableRooms(hotelId, checkIn, checkOut) {
    const { documents: rooms } = await this.getRoomsByHotel(hotelId)
    const availability = await Promise.all(
      rooms.map(async room => ({
        ...room,
        available: await this.checkAvailability(room.$id, checkIn, checkOut),
      }))
    )
    return availability
  },
}
