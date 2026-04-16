import {
  databases, storage, DB_ID, HOTELS_COL, HOTELS_BUCKET, Query, ID
} from '../config/appwrite'

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

    return databases.listDocuments(DB_ID, HOTELS_COL, queries)
  },

  // Get single hotel
  async getHotel(hotelId) {
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
    return databases.updateDocument(DB_ID, HOTELS_COL, hotelId, data)
  },

  // Delete hotel (admin only)
  async deleteHotel(hotelId) {
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
    const res = await databases.listDocuments(DB_ID, HOTELS_COL, [Query.limit(100)])
    const locs = [...new Set(res.documents.map(h => h.location))]
    return locs.filter(Boolean)
  },
}
