# LuxeStay — Appwrite Setup Guide

## Step 1 — Create Appwrite Project

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io) and sign up / log in
2. Click **"Create project"** → Name it `LuxeStay`
3. Copy your **Project ID** — you'll need it for `.env.local`

---

## Step 2 — Configure `.env.local`

Create a `.env.local` file in the project root:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=<YOUR_PROJECT_ID>

VITE_APPWRITE_DATABASE_ID=hotel_booking_db

VITE_APPWRITE_USERS_COLLECTION_ID=users
VITE_APPWRITE_HOTELS_COLLECTION_ID=hotels
VITE_APPWRITE_ROOMS_COLLECTION_ID=rooms
VITE_APPWRITE_BOOKINGS_COLLECTION_ID=bookings

VITE_APPWRITE_HOTELS_BUCKET_ID=hotel_images
```

---

## Step 3 — Add Web Platform

1. In your Appwrite project → **Settings → Platforms**
2. Click **Add Platform → Web App**
3. Name: `LuxeStay Web`
4. Hostname: `localhost` (and add your Vercel domain later)

---

## Step 4 — Create Database

1. Go to **Databases → Create Database**
2. Database ID: `hotel_booking_db`
3. Name: `Hotel Booking DB`

---

## Step 5 — Create Collections

### 5.1 — `users` Collection

**Collection ID:** `users`
**Permissions:** Any (read own, write own via auth)

| Attribute     | Type    | Required | Notes                    |
|---------------|---------|----------|--------------------------|
| userId        | String  | ✅       | Max 36 chars             |
| name          | String  | ✅       | Max 128 chars            |
| email         | String  | ✅       | Max 255 chars            |
| role          | Enum    | ✅       | Values: `admin`,`customer` |
| phone         | String  | ❌       | Max 20 chars             |
| avatar        | String  | ❌       | Max 255 chars (fileId)   |
| createdAt     | String  | ✅       | ISO date string          |

**Indexes:**
- `userId` → Unique Key on `userId`
- `email` → Unique Key on `email`
- `role` → Key on `role`

---

### 5.2 — `hotels` Collection

**Collection ID:** `hotels`
**Permissions:** Read (Any), Write (Users with admin role via Appwrite Functions or server SDK)

| Attribute      | Type     | Required | Notes                        |
|----------------|----------|----------|------------------------------|
| name           | String   | ✅       | Max 128 chars                |
| description    | String   | ✅       | Max 5000 chars               |
| location       | String   | ✅       | Max 128 chars                |
| address        | String   | ❌       | Max 255 chars                |
| category       | String   | ❌       | Max 64 chars                 |
| startingPrice  | Float    | ✅       | Min: 0                       |
| amenities      | String[] | ❌       | Array of strings             |
| imageIds       | String[] | ❌       | Array of storage file IDs    |
| rating         | Float    | ❌       | Default: 0, Min: 0, Max: 5   |
| reviewCount    | Integer  | ❌       | Default: 0                   |
| phone          | String   | ❌       | Max 20 chars                 |
| email          | String   | ❌       | Max 255 chars                |
| createdAt      | String   | ✅       | ISO date string              |

**Indexes:**
- `name` → Fulltext on `name` (enables search)
- `location` → Key on `location`
- `startingPrice` → Key on `startingPrice`
- `createdAt` → Key on `createdAt`

---

### 5.3 — `rooms` Collection

**Collection ID:** `rooms`
**Permissions:** Read (Any), Write (Authenticated admins)

| Attribute      | Type     | Required | Notes                      |
|----------------|----------|----------|----------------------------|
| hotelId        | String   | ✅       | Max 36 chars               |
| type           | String   | ✅       | Max 64 chars               |
| description    | String   | ❌       | Max 2000 chars             |
| pricePerNight  | Float    | ✅       | Min: 0                     |
| capacity       | Integer  | ✅       | Min: 1                     |
| size           | Float    | ❌       | m² value                   |
| floor          | Integer  | ❌       |                            |
| roomNumber     | String   | ❌       | Max 10 chars               |
| features       | String[] | ❌       | Array of strings           |
| isAvailable    | Boolean  | ✅       | Default: true              |
| createdAt      | String   | ✅       | ISO date string            |

**Indexes:**
- `hotelId` → Key on `hotelId`
- `pricePerNight` → Key on `pricePerNight`
- `isAvailable` → Key on `isAvailable`

---

### 5.4 — `bookings` Collection

**Collection ID:** `bookings`
**Permissions:** Users read/write their own documents

| Attribute       | Type    | Required | Notes                              |
|-----------------|---------|----------|------------------------------------|
| userId          | String  | ✅       | Max 36 chars                       |
| roomId          | String  | ✅       | Max 36 chars                       |
| hotelId         | String  | ✅       | Max 36 chars                       |
| checkInDate     | String  | ✅       | ISO date `YYYY-MM-DD`              |
| checkOutDate    | String  | ✅       | ISO date `YYYY-MM-DD`              |
| status          | Enum    | ✅       | `pending`,`confirmed`,`cancelled`,`completed` |
| totalPrice      | Float   | ✅       | Min: 0                             |
| nights          | Integer | ✅       | Min: 1                             |
| guestCount      | Integer | ✅       | Min: 1                             |
| specialRequests | String  | ❌       | Max 1000 chars                     |
| createdAt       | String  | ✅       | ISO date string                    |
| updatedAt       | String  | ✅       | ISO date string                    |

**Indexes:**
- `userId` → Key on `userId`
- `roomId` → Key on `roomId`
- `hotelId` → Key on `hotelId`
- `status` → Key on `status`
- `checkInDate` → Key on `checkInDate`
- `checkOutDate` → Key on `checkOutDate`

---

## Step 6 — Set Collection Permissions

### Permissions Matrix

| Collection | Read        | Create         | Update         | Delete       |
|------------|-------------|----------------|----------------|--------------|
| users      | Any (own)   | Users          | Users (own)    | Users (own)  |
| hotels     | Any         | Users (admin)  | Users (admin)  | Users (admin)|
| rooms      | Any         | Users (admin)  | Users (admin)  | Users (admin)|
| bookings   | Users (own) | Users          | Users (own)    | Users (own)  |

To configure per-document permissions in Appwrite:
1. Open collection → **Settings → Permissions**
2. For `hotels` and `rooms`: Add role `any` for Read
3. For `bookings`: Use **Document-level security** — permissions are set at document creation time
   - In `bookingService.createBooking`, Appwrite will attach the session user's permissions automatically

---

## Step 7 — Create Storage Bucket

1. Go to **Storage → Create Bucket**
2. Bucket ID: `hotel_images`
3. Name: `Hotel Images`
4. **Permissions:**
   - Read: `any`
   - Create: `users` (logged-in users or admin only)
   - Update/Delete: `users`
5. **Allowed file extensions:** `jpg, jpeg, png, webp, avif`
6. **Max file size:** `10MB`
7. Enable **Image transformations** ✅

---

## Step 8 — Booking Availability Logic (Conflict Detection)

The double-booking prevention query in `roomService.checkAvailability()`:

```js
// Fetch all non-cancelled bookings for a room
const existing = await databases.listDocuments(DB_ID, BOOKINGS_COL, [
  Query.equal('roomId', roomId),
  Query.notEqual('status', 'cancelled'),
  Query.limit(100),
])

// Check for date overlap:
// Conflict = newCheckIn < existingCheckOut AND newCheckOut > existingCheckIn
const hasConflict = existing.documents.some(booking => {
  const bIn  = new Date(booking.checkInDate)
  const bOut = new Date(booking.checkOutDate)
  return newCheckIn < bOut && newCheckOut > bIn
})
```

**Why this logic works:**
- Two date ranges [A, B] and [C, D] overlap if and only if `A < D && B > C`
- Any booking touching the same room within overlapping dates is a conflict
- Cancelled bookings are excluded, so re-booking a cancelled room is allowed

---

## Step 9 — Role-Based Access (Admin Setup)

Since Appwrite Cloud doesn't expose custom JWT roles for free, use this pattern:

1. **Admin user setup:** Manually set a user's `role` to `admin` in the `users` DB collection using the Appwrite Console or server SDK.

2. **Frontend guard:** The `AuthContext` reads the `role` from the DB profile — admin sees the Admin Dashboard, regular users don't.

3. **Server-side enforcement (production):** For critical admin writes (delete hotel, update booking status), use an **Appwrite Function** that checks the caller's role before executing.

---

## Step 10 — Realtime Subscriptions

The app subscribes to account changes for session sync:

```js
// In AuthContext.jsx
const unsubscribe = client.subscribe('account', () => {
  loadUser() // Re-fetch user on any auth event
})
```

To add realtime booking updates on the dashboard:
```js
// Subscribe to bookings collection changes
client.subscribe(
  `databases.${DB_ID}.collections.${BOOKINGS_COL}.documents`,
  (event) => {
    if (event.events.includes('databases.*.collections.*.documents.*.update')) {
      refetchBookings()
    }
  }
)
```

---

## Step 11 — Deploy to Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Build and deploy
cd hotel-booking
vercel

# 3. Add environment variables in Vercel dashboard:
#    Project → Settings → Environment Variables
#    Add all VITE_APPWRITE_* variables

# 4. Add your Vercel domain to Appwrite platforms:
#    Appwrite → Settings → Platforms → Add hostname
```

---

## Step 12 — Running Locally

```bash
# Clone / navigate to project
cd hotel-booking

# Install dependencies
npm install

# Copy env file
cp .env.example .env.local
# Edit .env.local with your Appwrite credentials

# Start dev server
npm run dev
# → http://localhost:5173

# Build for production
npm run build
```

---

## Folder Structure

```
hotel-booking/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── HotelFormModal.jsx    # Add/edit hotel form
│   │   │   └── RoomFormModal.jsx     # Add/edit room form
│   │   ├── auth/
│   │   │   └── AuthForms.jsx         # Login, Register, AuthLayout
│   │   ├── booking/
│   │   │   ├── BookingCard.jsx       # User booking card with cancel
│   │   │   └── BookingStatusBadge.jsx
│   │   ├── common/
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx    # Auth + admin guards
│   │   │   ├── StarRating.jsx
│   │   │   └── UI.jsx               # Button, Input, Modal, Card, Badge...
│   │   └── hotel/
│   │       ├── HotelCard.jsx         # Hotel listing card
│   │       ├── HotelFilters.jsx      # Search + filter sidebar
│   │       └── RoomCard.jsx          # Room selection card
│   ├── config/
│   │   └── appwrite.js              # Appwrite client + constants
│   ├── context/
│   │   ├── AuthContext.jsx          # Auth state, login/logout/register
│   │   └── ThemeContext.jsx         # Dark mode toggle
│   ├── hooks/
│   │   └── index.js                 # useAsync, useRealtime, useDebounce
│   ├── pages/
│   │   ├── AdminDashboard.jsx       # Admin: hotels, rooms, bookings mgmt
│   │   ├── AuthPages.jsx            # LoginPage, RegisterPage
│   │   ├── BookingPage.jsx          # Checkout + confirmation
│   │   ├── DashboardPage.jsx        # User: my bookings
│   │   ├── HotelDetailPage.jsx      # Hotel info + room availability
│   │   ├── HotelsPage.jsx           # Hotel listing with filters
│   │   ├── HomePage.jsx             # Landing page
│   │   └── ProfilePage.jsx          # User profile editor
│   ├── services/
│   │   ├── authService.js           # Appwrite Auth + user profile
│   │   ├── bookingService.js        # Create, cancel, list bookings
│   │   ├── hotelService.js          # CRUD hotels + image upload
│   │   └── roomService.js           # CRUD rooms + availability check
│   ├── utils/
│   │   └── index.js                 # Formatters, constants, helpers
│   ├── App.jsx                      # Router + providers
│   ├── index.css                    # Tailwind + global styles
│   └── main.jsx                     # React entry point
├── .env.example                     # Environment variable template
├── .env.local                       # Your actual env (git-ignored)
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

---

## Quick Reference — Appwrite SDK Patterns Used

```js
// List with filters
await databases.listDocuments(DB_ID, COLLECTION_ID, [
  Query.equal('field', 'value'),
  Query.orderDesc('$createdAt'),
  Query.limit(10),
  Query.offset(0),
])

// Create
await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), data)

// Read
await databases.getDocument(DB_ID, COLLECTION_ID, documentId)

// Update
await databases.updateDocument(DB_ID, COLLECTION_ID, documentId, partialData)

// Delete
await databases.deleteDocument(DB_ID, COLLECTION_ID, documentId)

// Auth
await account.create(ID.unique(), email, password, name)  // Register
await account.createEmailPasswordSession(email, password) // Login
await account.deleteSession('current')                    // Logout
await account.get()                                       // Get current user

// Storage
await storage.createFile(BUCKET_ID, ID.unique(), file)
storage.getFilePreview(BUCKET_ID, fileId, width, height)  // Returns URL
await storage.deleteFile(BUCKET_ID, fileId)
```
