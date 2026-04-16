import { format, parseISO, differenceInDays } from 'date-fns'
import clsx from 'clsx'

// ─── Class names helper ───────────────────────────────────────────────────────
export { clsx as cn }

// ─── Date formatters ─────────────────────────────────────────────────────────
export const formatDate = (dateStr) =>
  dateStr ? format(parseISO(dateStr), 'MMM dd, yyyy') : '—'

export const formatDateInput = (date) =>
  date instanceof Date ? format(date, 'yyyy-MM-dd') : date

export const nightsCount = (checkIn, checkOut) =>
  differenceInDays(new Date(checkOut), new Date(checkIn))

// ─── Currency formatter ───────────────────────────────────────────────────────
export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)

// ─── Status colors ────────────────────────────────────────────────────────────
export const statusConfig = {
  pending:   { color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400',   label: 'Pending' },
  confirmed: { color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Confirmed' },
  cancelled: { color: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400',          label: 'Cancelled' },
  completed: { color: 'text-slate-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300',     label: 'Completed' },
}

// ─── Amenity icons (text fallback) ───────────────────────────────────────────
export const AMENITIES = [
  'WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking',
  'Airport Shuttle', 'Room Service', 'Conference Room', 'Beach Access',
  'Air Conditioning', 'Laundry', 'Concierge', 'Kids Club', 'Pet Friendly',
]

// ─── Room types ───────────────────────────────────────────────────────────────
export const ROOM_TYPES = [
  'Standard', 'Deluxe', 'Suite', 'Junior Suite', 'Executive Suite',
  'Presidential Suite', 'Penthouse', 'Studio', 'Villa',
]

// ─── Star rating display ─────────────────────────────────────────────────────
export const starRating = (rating, max = 5) => {
  return Array.from({ length: max }, (_, i) => i < Math.floor(rating))
}

// ─── Truncate text ────────────────────────────────────────────────────────────
export const truncate = (text, len = 120) =>
  text?.length > len ? text.slice(0, len) + '…' : text
