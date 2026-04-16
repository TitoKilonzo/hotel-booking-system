import { cn } from '../../utils'
import { X, Loader2 } from 'lucide-react'

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ variant = 'primary', size = 'md', loading, icon: Icon, iconRight, children, className, disabled, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-body font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const variants = {
    primary:   'bg-gold-500 hover:bg-gold-600 text-white shadow-md hover:shadow-lg active:scale-[0.98]',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white',
    ghost:     'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300',
    danger:    'bg-red-500 hover:bg-red-600 text-white shadow-md',
    outline:   'border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white dark:text-gold-400',
  }

  const sizes = {
    sm:  'px-3 py-1.5 text-sm',
    md:  'px-5 py-2.5 text-sm',
    lg:  'px-7 py-3.5 text-base',
    xl:  'px-9 py-4 text-lg',
    icon: 'p-2.5',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
      {iconRight && <iconRight size={16} />}
    </button>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, error, icon: Icon, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
        <input
          className={cn(
            'w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600',
            'rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400',
            'transition-all duration-200',
            Icon && 'pl-9',
            error && 'border-red-400',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, error, children, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <select
        className={cn(
          'w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600',
          'rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white',
          'transition-all duration-200',
          error && 'border-red-400',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <textarea
        className={cn(
          'w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600',
          'rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 resize-none',
          'transition-all duration-200',
          error && 'border-red-400',
          className
        )}
        rows={4}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ variant = 'default', children, className }) {
  const variants = {
    default:  'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    gold:     'bg-gold-100 text-gold-800 dark:bg-gold-900/30 dark:text-gold-400',
    green:    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    red:      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    blue:     'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 24, className }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 size={size} className="animate-spin text-gold-500" />
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card dark:shadow-card-dark',
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, className }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up',
        className
      )}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold font-display text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <div className="mb-4 p-4 rounded-full bg-slate-100 dark:bg-slate-800"><Icon size={32} className="text-slate-400" /></div>}
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{title}</h3>
      {message && <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-4">{message}</p>}
      {action}
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className }) {
  return <div className={cn('skeleton rounded-xl', className)} />
}
