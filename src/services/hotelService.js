import {
  databases, storage, DB_ID, HOTELS_COL, HOTELS_BUCKET, Query, ID
} from '../config/appwrite'

const MOCK_HOTELS = [
  {
    $id: 'mock-1',
    name: 'Hemingways Nairobi',
    location: 'Nairobi',
    category: 'Luxury',
    description: 'A luxury boutique hotel in Karen, Nairobi. Featuring a spa, outdoor pool, and personalized butler service. Enjoy breathtaking views of the Ngong Hills.',
    startingPrice: 35000,
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa'],
    rating: 4.9,
    imageIds: [],
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'
  },
  {
    $id: 'mock-2',
    name: 'Diani Reef Beach Resort & Spa',
    location: 'Diani Beach',
    category: 'Resort',
    description: 'Nestled on the pristine white sands of Diani Beach. Offers world-class spa facilities, multiple dining options, and stunning Indian Ocean views.',
    startingPrice: 24000,
    amenities: ['WiFi', 'Pool', 'Gym', 'Bar', 'Beach Access'],
    rating: 4.8,
    imageIds: [],
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80'
  },
  {
    $id: 'mock-3',
    name: 'Sarova Mara Game Camp',
    location: 'Maasai Mara',
    category: 'Camp',
    description: 'Set in the heart of the Maasai Mara Game Reserve. Experience luxury tents, exceptional wildlife viewing, and authentic cultural encounters.',
    startingPrice: 42000,
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Game Drives'],
    rating: 4.9,
    imageIds: [],
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80'
  },
  {
    $id: 'mock-4',
    name: 'Fairmont Mount Kenya Safari Club',
    location: 'Nanyuki',
    category: 'Lodge',
    description: 'With magnificent views of majestic Mount Kenya, the Fairmont Mount Kenya Safari Club offers an exclusive retreat in the heart of nature.',
    startingPrice: 32000,
    amenities: ['WiFi', 'Golf', 'Pool', 'Restaurant', 'Spa'],
    rating: 4.7,
    imageIds: [],
    imageUrl: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c1e?w=800&q=80'
  },
  {
    $id: 'mock-5',
    name: 'Tribe Hotel',
    location: 'Nairobi',
    category: 'Boutique',
    description: 'A deeply chic boutique hotel located in the leafy suburbs of Nairobi. Tribe promises a beautifully curated experience with a sophisticated edge.',
    startingPrice: 28000,
    amenities: ['WiFi', 'Spa', 'Pool', 'Gym', 'Restaurant'],
    rating: 4.6,
    imageIds: [],
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c0d589rx?w=800&q=80' // Using fallback
  },
  {
    $id: 'mock-6',
    name: 'Baobab Beach Resort',
    location: 'Diani Beach',
    category: 'Resort',
    description: 'Located on the world-famous Diani Beach, the Baobab Beach Resort is set within 80 acres of tropical gardens overlooking the Indian Ocean.',
    startingPrice: 21000,
    amenities: ['WiFi', 'Pool', 'Restaurant', 'Beach Access', 'Bar'],
    rating: 4.5,
    imageIds: [],
    imageUrl: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=800&q=80'
  }
]

// ─── Hotel Service ────────────────────────────────────────────────────────────

export const hotelService = {
  // Fetch all hotels with optional filters
  async getHotels({ search = '', location = '', minPrice = 0, maxPrice = 99999, amenities = [], page = 1, limit = 9 } = {}) {
    const queries = [
      Query.limit(limit),
      Query.offset((page - 1) * limit),
      Query.orderDesc('$createdAt'),
    ]
    if (location) queries.push(Query.equal('location', location))
    if (search)   queries.push(Query.search('name', search))
    if (amenities.length > 0) queries.push(Query.contains('amenities', amenities))

    try {
      const res = await databases.listDocuments(DB_ID, HOTELS_COL, queries)
      // Return mock data if database is completely empty (for premium portfolio visual experience)
      if (res.total === 0 && !location && !search && amenities.length === 0) {
        return { documents: MOCK_HOTELS.slice(0, limit), total: MOCK_HOTELS.length }
      }
      return res
    } catch (error) {
      console.warn("Database error, returning mock data", error)
      return { documents: MOCK_HOTELS.slice(0, limit), total: MOCK_HOTELS.length }
    }
  },

  // Get single hotel
  async getHotel(hotelId) {
    if (hotelId.startsWith('mock-')) {
      const hotel = MOCK_HOTELS.find(h => h.$id === hotelId)
      if (hotel) return hotel
    }
    return databases.getDocument(DB_ID, HOTELS_COL, hotelId)
  },

  // Create hotel (admin only)
  async createHotel(data) {
    return databases.createDocument(DB_ID, HOTELS_COL, ID.unique(), {
      ...data,
      rating:     0,
      reviewCount: 0,
      createdAt:  new Date().toISOString(),
    })
  },

  // Update hotel (admin only)
  async updateHotel(hotelId, data) {
    if (hotelId.startsWith('mock-')) throw new Error('Cannot edit mock hotels.')
    return databases.updateDocument(DB_ID, HOTELS_COL, hotelId, data)
  },

  // Delete hotel (admin only)
  async deleteHotel(hotelId) {
    if (hotelId.startsWith('mock-')) throw new Error('Cannot delete mock hotels.')
    return databases.deleteDocument(DB_ID, HOTELS_COL, hotelId)
  },

  // Upload hotel image
  async uploadImage(file) {
    const res = await storage.createFile(HOTELS_BUCKET, ID.unique(), file)
    return res.$id
  },

  // Get image preview URL
  getImageUrl(fileId, width = 800, height = 600) {
    if (!fileId) return null
    return storage.getFilePreview(HOTELS_BUCKET, fileId, width, height)
  },

  // Delete image
  async deleteImage(fileId) {
    return storage.deleteFile(HOTELS_BUCKET, fileId)
  },

  // Get distinct locations for filter
  async getLocations() {
    try {
      const res = await databases.listDocuments(DB_ID, HOTELS_COL, [Query.limit(100)])
      let locs = [...new Set(res.documents.map(h => h.location))]
      if (locs.length === 0) {
        locs = [...new Set(MOCK_HOTELS.map(h => h.location))]
      }
      return locs.filter(Boolean)
    } catch (e) {
      return [...new Set(MOCK_HOTELS.map(h => h.location))]
    }
  },
}
