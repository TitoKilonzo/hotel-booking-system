import {
  databases, DB_ID, ROOMS_COL, BOOKINGS_COL, Query, ID, BOOKING_STATUS
} from '../config/appwrite'

const MOCK_ROOMS = [
  {
    $id: 'mock-room-1',
    hotelId: 'mock-1',
    type: 'Deluxe Suite',
    capacity: 2,
    pricePerNight: 35000,
    isAvailable: true,
    description: 'Spacious suite with breathtaking views and a private balcony.',
    features: ['King Bed', 'Balcony', 'Ocean View', 'Mini Bar']
  },
  {
    $id: 'mock-room-2',
    hotelId: 'mock-1',
    type: 'Standard Room',
    capacity: 2,
    pricePerNight: 20000,
    isAvailable: true,
    description: 'Comfortable standard room with modern amenities.',
    features: ['Queen Bed', 'Smart TV', 'Work Desk']
  },
  {
    $id: 'mock-room-3',
    hotelId: 'mock-2',
    type: 'Family Villa',
    capacity: 4,
    pricePerNight: 65000,
    isAvailable: true,
    description: 'A luxurious villa perfect for family getaways with private garden access.',
    features: ['2 King Beds', 'Kitchenette', 'Private Pool', 'Bathtub']
  },
  {
    $id: 'mock-room-4',
    hotelId: 'mock-3',
    type: 'Luxury Tent',
    capacity: 2,
    pricePerNight: 42000,
    isAvailable: true,
    description: 'Authentic Maasai Mara luxury tent experience.',
    features: ['King Bed', 'Outdoor Shower', 'Game Drives Included']
  }
]

// Helper to generate generic mock rooms for any other mock hotel
const getMockRooms = (hotelId) => {
  const specific = MOCK_ROOMS.filter(r => r.hotelId === hotelId)
  if (specific.length > 0) return specific
  return [
    {
      $id: `mock-room-${hotelId}-basic`,
      hotelId,
      type: 'Executive Room',
      capacity: 2,
      pricePerNight: 28000,
      isAvailable: true,
      description: 'Elegant executive room designed for comfort and luxury.',
      features: ['King Bed', 'Smart TV', 'City View', 'Bathtub']
    }
  ]
}

// ─── Room Service ─────────────────────────────────────────────────────────────

export const roomService = {
  // Get all rooms for a hotel
  async getRoomsByHotel(hotelId) {
    if (hotelId.startsWith('mock-')) {
      const mockRooms = getMockRooms(hotelId)
      return { documents: mockRooms, total: mockRooms.length }
    }
    return databases.listDocuments(DB_ID, ROOMS_COL, [
      Query.equal('hotelId', hotelId),
      Query.orderAsc('pricePerNight'),
      Query.limit(50),
    ])
  },

  // Get single room
  async getRoom(roomId) {
    if (roomId.startsWith('mock-room-')) {
      const basicMock = {
        $id: roomId,
        hotelId: 'mock-1',
        type: 'Premium Room',
        pricePerNight: 25000,
        capacity: 2,
        isAvailable: true,
        features: ['King Bed', 'Smart TV']
      }
      return MOCK_ROOMS.find(r => r.$id === roomId) || basicMock
    }
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
    if (roomId.startsWith('mock-')) throw new Error('Cannot edit mock rooms.')
    return databases.updateDocument(DB_ID, ROOMS_COL, roomId, data)
  },

  // Delete room (admin)
  async deleteRoom(roomId) {
    if (roomId.startsWith('mock-')) throw new Error('Cannot delete mock rooms.')
    return databases.deleteDocument(DB_ID, ROOMS_COL, roomId)
  },

  // ── Availability Check ──────────────────────────────────────────────────────
  // Check if a room is available for given dates (conflict detection)
  async checkAvailability(roomId, checkIn, checkOut) {
    if (roomId.startsWith('mock-')) return true // Mock rooms always available

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
