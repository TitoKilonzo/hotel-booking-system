import { Users, Maximize2, Check, X } from 'lucide-react'
import { formatCurrency, cn } from '../../utils'
import { Button, Badge } from '../common/UI'

export default function RoomCard({ room, selected, onSelect, checkIn, checkOut, nights }) {
  const total = nights ? room.pricePerNight * nights : null
  const unavailable = room.available === false

  return (
    <div className={cn(
      'relative rounded-2xl border-2 transition-all duration-200 p-5',
      unavailable
        ? 'border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed'
        : selected
          ? 'border-gold-500 bg-gold-50/50 dark:bg-gold-900/10 shadow-gold'
          : 'border-slate-200 dark:border-slate-700 hover:border-gold-300 dark:hover:border-gold-700 cursor-pointer bg-white dark:bg-slate-800'
    )}
      onClick={() => !unavailable && onSelect?.(room)}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center">
          <Check size={13} className="text-white" />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-semibold text-slate-900 dark:text-white">{room.type}</h3>
            {unavailable && <Badge variant="red">Unavailable</Badge>}
            {!unavailable && <Badge variant="green">Available</Badge>}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{room.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-gold-500" />
              Up to {room.capacity} guest{room.capacity > 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize2 size={14} className="text-gold-500" />
              {room.size || '—'} m²
            </span>
          </div>

          {/* Room features */}
          {room.features?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {room.features.map(f => (
                <span key={f} className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">
                  <Check size={9} className="text-emerald-500" />
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-gold-600 dark:text-gold-400">
            {formatCurrency(room.pricePerNight)}
          </div>
          <div className="text-xs text-slate-400">/night</div>
          {total && (
            <div className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {formatCurrency(total)} total
            </div>
          )}
          {total && <div className="text-xs text-slate-400">{nights} night{nights > 1 ? 's' : ''}</div>}
        </div>
      </div>

      {!unavailable && onSelect && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <Button
            variant={selected ? 'secondary' : 'primary'}
            size="sm"
            className="w-full sm:w-auto"
            onClick={(e) => { e.stopPropagation(); onSelect(room) }}
          >
            {selected ? 'Selected ✓' : 'Select Room'}
          </Button>
        </div>
      )}
    </div>
  )
}
