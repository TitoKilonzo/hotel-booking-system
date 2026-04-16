import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Spinner } from './UI'

// Requires login
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={36} /></div>
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

// Requires admin role
export function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size={36} /></div>
  if (!user)    return <Navigate to="/login" state={{ from: location }} replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
