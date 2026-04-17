import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Button } from './UI'
import {
  Palmtree, Menu, X, Moon, Sun, User, LogOut, LayoutDashboard, BookOpen
} from 'lucide-react'
import { cn } from '../../utils'

export default function Navbar() {
  const { user, profile, isAdmin, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)

  const isActive = (path) => location.pathname === path

  // Track scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    if (profileOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [profileOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setProfileOpen(false)
  }, [location.pathname])

  const navLinks = [
    { to: '/',       label: 'Home' },
    { to: '/hotels', label: 'Hotels' },
  ]

  return (
    <nav className={cn(
      'sticky top-0 z-40 transition-all duration-300',
      scrolled
        ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-md border-b border-slate-200/50 dark:border-slate-700/50'
        : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50'
    )} id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" id="navbar-logo">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Palmtree size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Tembea<span className="text-gradient-gold">Kenya</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(link.to)
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              id="theme-toggle"
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(o => !o)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  id="profile-dropdown-btn"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                    {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                    {profile?.name?.split(' ')[0] || 'User'}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-20 overflow-hidden animate-slide-up">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{profile?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{profile?.email}</p>
                    </div>
                    <div className="py-1">
                      {isAdmin && (
                        <MenuItem icon={LayoutDashboard} label="Admin Dashboard" to="/admin" />
                      )}
                      <MenuItem icon={BookOpen} label="My Bookings" to="/dashboard" />
                      <MenuItem icon={User} label="Profile" to="/profile" />
                      <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                        <button
                          onClick={() => { logout(); navigate('/') }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          id="logout-btn"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')} id="nav-signin-btn">Sign In</Button>
                <Button size="sm" onClick={() => navigate('/register')} id="nav-register-btn">Get Started</Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              id="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-4 space-y-2 animate-slide-up">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive(link.to)
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <>
              <Link to="/dashboard" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                My Bookings
              </Link>
              <Link to="/profile" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                Profile
              </Link>
            </>
          )}
          {!user && (
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => navigate('/login')} id="mobile-signin-btn">Sign In</Button>
              <Button size="sm" className="flex-1" onClick={() => navigate('/register')} id="mobile-register-btn">Register</Button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

function MenuItem({ icon: Icon, label, to }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      <Icon size={15} className="text-slate-500" />
      {label}
    </button>
  )
}
