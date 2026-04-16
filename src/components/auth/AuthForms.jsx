import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Input, Button } from '../common/UI'
import { Mail, Lock, User, Eye, EyeOff, Hotel } from 'lucide-react'

// ─── Login Form ───────────────────────────────────────────────────────────────
export function LoginForm() {
  const { login } = useAuth()
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
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch { /* toast handled in context */ }
    finally { setLoading(false) }
  }

  return (
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
        />
        <button type="button" onClick={() => setShowPass(s => !s)} className="self-end flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
          {showPass ? 'Hide' : 'Show'} password
        </button>
      </div>
      <Button type="submit" className="w-full" size="lg" loading={loading}>Sign In</Button>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        No account?{' '}
        <Link to="/register" className="text-gold-600 dark:text-gold-400 font-medium hover:underline">Create one</Link>
      </p>
    </form>
  )
}

// ─── Register Form ────────────────────────────────────────────────────────────
export function RegisterForm() {
  const { register } = useAuth()
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
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/')
    } catch { /* toast handled in context */ }
    finally { setLoading(false) }
  }

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Full name" type="text" placeholder="John Smith" icon={User}
        value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
      <Input label="Email address" type="email" placeholder="you@example.com" icon={Mail}
        value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
      <div className="flex flex-col gap-1.5">
        <Input label="Password" type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" icon={Lock}
          value={form.password} onChange={set('password')} error={errors.password} autoComplete="new-password" />
        <button type="button" onClick={() => setShowPass(s => !s)} className="self-end flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          {showPass ? <EyeOff size={12} /> : <Eye size={12} />}
          {showPass ? 'Hide' : 'Show'}
        </button>
      </div>
      <Input label="Confirm password" type={showPass ? 'text' : 'password'} placeholder="Repeat password" icon={Lock}
        value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} />
      <Button type="submit" className="w-full" size="lg" loading={loading}>Create Account</Button>
      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        Have an account?{' '}
        <Link to="/login" className="text-gold-600 dark:text-gold-400 font-medium hover:underline">Sign in</Link>
      </p>
    </form>
  )
}

// ─── Auth Layout Wrapper ─────────────────────────────────────────────────────
export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 bg-hero-pattern">
      <div className="w-full max-w-md animate-fade-in">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center shadow-lg">
              <Hotel size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Luxe<span className="text-gradient-gold">Stay</span>
            </span>
          </div>
          <h1 className="text-2xl font-display font-semibold text-white mb-2">{title}</h1>
          {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
