import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute'

// Pages
import HomePage        from './pages/HomePage'
import HotelsPage      from './pages/HotelsPage'
import HotelDetailPage from './pages/HotelDetailPage'
import BookingPage     from './pages/BookingPage'
import DashboardPage   from './pages/DashboardPage'
import AdminDashboard  from './pages/AdminDashboard'
import ProfilePage     from './pages/ProfilePage'
import { LoginPage, RegisterPage } from './pages/AuthPages'

// Layout wrapper (excludes auth pages)
function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

// 404 page
function NotFoundPage() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 page-enter">
        <span className="text-7xl mb-6">🏔️</span>
        <h1 className="font-display text-4xl font-bold text-slate-900 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
          Looks like you've wandered off the trail! Let's get you back to discovering Kenya's finest stays.
        </p>
        <a href="/" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl px-6 py-3 transition-colors">
          ← Back to Home
        </a>
      </div>
    </Layout>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth pages (no navbar/footer) */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Public pages */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/hotels" element={<Layout><HotelsPage /></Layout>} />
            <Route path="/hotels/:hotelId" element={<Layout><HotelDetailPage /></Layout>} />

            {/* Protected - requires login */}
            <Route path="/booking" element={
              <ProtectedRoute>
                <Layout><BookingPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><DashboardPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout><ProfilePage /></Layout>
              </ProtectedRoute>
            } />

            {/* Admin only */}
            <Route path="/admin" element={
              <AdminRoute>
                <Layout><AdminDashboard /></Layout>
              </AdminRoute>
            } />

            {/* 404 catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              className: 'font-body text-sm',
              style: { borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
