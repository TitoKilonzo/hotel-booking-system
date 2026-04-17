import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Input, Button } from '../common/UI'
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft, Palmtree } from 'lucide-react'

// ─── Google Icon SVG ────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  )
}

// ─── Login Form ───────────────────────────────────────────────────────────────
export function LoginForm() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      // Redirect to dashboard for logged-in users, or previous page
      navigate(from === '/' ? '/dashboard' : from, { replace: true })
    } catch {
      // toast handled in context
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Google OAuth */}
      <button type="button" onClick={loginWithGoogle} className="btn-google" id="google-login-btn">
        <GoogleIcon />
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
        <span className="text-xs text-slate-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          error={errors.email}
          autoComplete="email"
          id="login-email"
        />
        <div className="flex flex-col gap-1.5">
          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            icon={Lock}
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            error={errors.password}
            autoComplete="current-password"
            id="login-password"
          />
          <button type="button" onClick={() => setShowPass(s => !s)} className="self-end flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
            {showPass ? 'Hide' : 'Show'} password
          </button>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading} id="login-submit-btn">
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        No account?{' '}
        <Link to="/register" className="text-gold-600 dark:text-gold-400 font-medium hover:underline">Create one</Link>
      </p>
    </div>
  )
}

// ─── Register Form ────────────────────────────────────────────────────────────
export function RegisterForm() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name || form.name.length < 2) e.name = 'Name must be at least 2 characters'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      // Redirect to dashboard after successful signup
      navigate('/dashboard', { replace: true })
    } catch {
      // toast handled in context
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <div className="space-y-5">
      {/* Google OAuth */}
      <button type="button" onClick={loginWithGoogle} className="btn-google" id="google-register-btn">
        <GoogleIcon />
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
        <span className="text-xs text-slate-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-600" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full name" type="text" placeholder="John Kamau" icon={User}
          value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" id="register-name" />
        <Input label="Email address" type="email" placeholder="you@example.com" icon={Mail}
          value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" id="register-email" />
        <div className="flex flex-col gap-1.5">
          <Input label="Password" type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" icon={Lock}
            value={form.password} onChange={set('password')} error={errors.password} autoComplete="new-password" id="register-password" />
          <button type="button" onClick={() => setShowPass(s => !s)} className="self-end flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
            {showPass ? 'Hide' : 'Show'}
          </button>
        </div>
        <Input label="Confirm password" type={showPass ? 'text' : 'password'} placeholder="Repeat password" icon={Lock}
          value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} id="register-confirm" />
        <Button type="submit" className="w-full" size="lg" loading={loading} id="register-submit-btn">Create Account</Button>
      </form>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Have an account?{' '}
        <Link to="/login" className="text-gold-600 dark:text-gold-400 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  )
}

// ─── Auth Layout Wrapper ─────────────────────────────────────────────────────
export function AuthLayout({ title, subtitle, children }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Real Image Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600&auto=format&fit=crop&q=80"
          alt="Auth Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
      </div>

      {/* Back to Home button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full px-4 py-2 border border-white/10"
        id="auth-back-home"
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <Palmtree size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Tembea<span className="text-gradient-gold">Kenya</span>
            </span>
          </div>
          <h1 className="text-2xl font-display font-semibold text-white mb-2">{title}</h1>
          {subtitle && <p className="text-slate-300 text-sm">{subtitle}</p>}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-white/10">
          {children}
        </div>
      </div>
    </div>
  )
}
