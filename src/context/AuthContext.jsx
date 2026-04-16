import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'
import { client } from '../config/appwrite'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null)   // Appwrite auth user
  const [profile, setProfile]     = useState(null)   // DB user profile (has role)
  const [loading, setLoading]     = useState(true)

  const loadUser = useCallback(async () => {
    try {
      const u = await authService.getCurrentUser()
      if (u) {
        setUser(u)
        const p = await authService.getUserProfile(u.$id)
        setProfile(p)
      }
    } catch {
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadUser() }, [loadUser])

  // Subscribe to realtime auth changes
  useEffect(() => {
    const unsubscribe = client.subscribe('account', () => { loadUser() })
    return () => unsubscribe()
  }, [loadUser])

  const register = async (data) => {
    try {
      await authService.register(data)
      await loadUser()
      toast.success('Welcome to LuxeStay!')
    } catch (err) {
      toast.error(err.message || 'Registration failed')
      throw err
    }
  }

  const login = async (email, password) => {
    try {
      await authService.login(email, password)
      await loadUser()
      toast.success('Welcome back!')
    } catch (err) {
      toast.error(err.message || 'Login failed')
      throw err
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      setProfile(null)
      toast.success('Logged out successfully')
    } catch (err) {
      toast.error(err.message || 'Logout failed')
    }
  }

  const updateProfile = async (data) => {
    if (!user) return
    try {
      const updated = await authService.updateProfile(user.$id, data)
      setProfile(updated)
      toast.success('Profile updated')
      return updated
    } catch (err) {
      toast.error(err.message || 'Update failed')
      throw err
    }
  }

  const isAdmin = authService.isAdmin(profile)

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, register, login, logout, updateProfile, reload: loadUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
