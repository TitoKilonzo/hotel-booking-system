import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              className: 'font-body text-sm',
              style: { borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' },
              success: { iconTheme: { primary: '#f59e0b', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
