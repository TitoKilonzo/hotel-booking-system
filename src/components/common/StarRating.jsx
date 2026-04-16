import { Star } from 'lucide-react'
import { cn } from '../../utils'

export default function StarRating({ rating = 0, max = 5, size = 14, interactive = false, onChange, className }) {
  const stars = Array.from({ length: max }, (_, i) => i + 1)

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {stars.map(star => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={cn(interactive && 'cursor-pointer hover:scale-110 transition-transform')}
        >
          <Star
            size={size}
            className={cn(
              star <= Math.round(rating)
                ? 'fill-gold-400 text-gold-400'
                : 'text-slate-300 dark:text-slate-600'
            )}
          />
        </button>
      ))}
    </div>
  )
}
