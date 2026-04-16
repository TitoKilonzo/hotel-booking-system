import { Client, Account, Databases, Storage, Query, ID } from 'appwrite'

// ─── Appwrite Client ──────────────────────────────────────────────────────────
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '')

export const account  = new Account(client)
export const databases = new Databases(client)
export const storage  = new Storage(client)
export { Query, ID, client }

// ─── Constants ────────────────────────────────────────────────────────────────
export const DB_ID          = import.meta.env.VITE_APPWRITE_DATABASE_ID          || 'hotel_booking_db'
export const USERS_COL      = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID  || 'users'
export const HOTELS_COL     = import.meta.env.VITE_APPWRITE_HOTELS_COLLECTION_ID || 'hotels'
export const ROOMS_COL      = import.meta.env.VITE_APPWRITE_ROOMS_COLLECTION_ID  || 'rooms'
export const BOOKINGS_COL   = import.meta.env.VITE_APPWRITE_BOOKINGS_COLLECTION_ID || 'bookings'
export const HOTELS_BUCKET  = import.meta.env.VITE_APPWRITE_HOTELS_BUCKET_ID     || 'hotel_images'

// ─── Booking Status ───────────────────────────────────────────────────────────
export const BOOKING_STATUS = {
  PENDING:   'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
}

// ─── User Roles ───────────────────────────────────────────────────────────────
export const USER_ROLES = {
  ADMIN:    'admin',
  CUSTOMER: 'customer',
}

export default client
