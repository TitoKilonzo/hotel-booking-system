# 🏨 LuxeStay — Full-Stack Hotel Booking System

A production-ready hotel booking platform built with **React + Vite** (frontend) and **Appwrite** (backend-as-a-service).

![LuxeStay](https://img.shields.io/badge/React-18-blue?logo=react) ![Appwrite](https://img.shields.io/badge/Appwrite-16-pink?logo=appwrite) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5-yellow?logo=vite)

---

## ✨ Features

| Feature | Details |
|---|---|
| **Authentication** | Email/password signup, login, logout via Appwrite Auth |
| **Role-based access** | Admin and Customer roles stored in DB |
| **Hotel management** | Add, edit, delete hotels with image uploads (Admin) |
| **Room management** | Room types, pricing, capacity, availability (Admin) |
| **Booking system** | Date selection, real-time availability, double-booking prevention |
| **Reservation management** | View, cancel bookings; status: pending/confirmed/cancelled/completed |
| **Realtime updates** | Appwrite subscriptions for session sync |
| **Dark mode** | Full dark/light theme toggle |
| **Pagination & filtering** | Search, location, price range, amenities |
| **Responsive design** | Mobile-first, works on all screen sizes |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# → Fill in your Appwrite credentials

# 3. Start dev server
npm run dev
```

Then follow **[APPWRITE_SETUP.md](./APPWRITE_SETUP.md)** to configure your Appwrite project.

---

## 🏗️ Tech Stack

- **Frontend:** React 18, React Router 6, Tailwind CSS 3, Lucide Icons
- **Backend:** Appwrite Cloud (Auth, Database, Storage, Realtime)
- **State:** Context API (Auth + Theme)
- **Utilities:** date-fns, react-hot-toast, clsx
- **Build:** Vite 5
- **Deploy:** Vercel

---

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── admin/         # Admin-specific forms
│   ├── auth/          # Login/register forms
│   ├── booking/       # Booking card, status badge
│   ├── common/        # Navbar, footer, UI primitives
│   └── hotel/         # Hotel card, room card, filters
├── config/            # Appwrite client config
├── context/           # Auth & Theme context providers
├── hooks/             # Custom hooks (useAsync, useDebounce...)
├── pages/             # Page-level components
├── services/          # Appwrite API abstraction layer
└── utils/             # Helpers, formatters, constants
```

---

## 🔐 Appwrite Collections

| Collection | Purpose |
|---|---|
| `users` | User profiles with role (`admin`/`customer`) |
| `hotels` | Hotel listings with images, amenities, location |
| `rooms` | Room types, pricing, capacity per hotel |
| `bookings` | Reservations with date conflict prevention |

---

## 📦 Deploy to Vercel

```bash
npm i -g vercel
vercel
# Add your VITE_APPWRITE_* env vars in Vercel dashboard
# Add Vercel domain to Appwrite Platforms
```

---

## 🛡️ Security Notes

- Admin writes should be enforced server-side via Appwrite Functions in production
- Appwrite document-level permissions protect user bookings
- `.env.local` is git-ignored — never commit credentials

---

## 📄 License

MIT — Built with ❤️ using React + Appwrite
