import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input, Button } from '../common/UI'
import { AMENITIES, cn } from '../../utils'

export default function HotelFilters({ filters, onChange, locations = [] }) {
  const [localSearch, setLocalSearch] = useState(filters.search || '')
  const [open, setOpen] = useState(false)

  const update = (key, value) => onChange({ ...filters, [key]: value })

  const toggleAmenity = (a) => {
    const current = filters.amenities || []
    const next = current.includes(a) ? current.filter(x => x !== a) : [...current, a]
    update('amenities', next)
  }

  const clearAll = () => {
    setLocalSearch('')
    onChange({ search: '', location: '', minPrice: 0, maxPrice: 2000, amenities: [] })
  }

  const hasFilters =
    filters.search || filters.location || (filters.amenities?.length > 0) ||
    filters.minPrice > 0 || filters.maxPrice < 2000

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search hotels..."
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && update('search', localSearch)}
          onBlur={() => update('search', localSearch)}
          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
        />
      </div>

      {/* Filter toggle (mobile) */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="secondary"
          size="sm"
          icon={SlidersHorizontal}
          onClick={() => setOpen(o => !o)}
          className="lg:hidden"
        >
          Filters {hasFilters && <span className="ml-1 w-4 h-4 rounded-full bg-gold-500 text-white text-xs flex items-center justify-center">{[filters.location, ...(filters.amenities||[])].filter(Boolean).length}</span>}
        </Button>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 ml-auto">
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      {/* Filters panel */}
      <div className={cn('space-y-6', !open && 'hidden lg:block')}>

        {/* Location */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Location</h4>
          <div className="space-y-1.5">
            <button
              onClick={() => update('location', '')}
              className={cn(
                'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                !filters.location
                  ? 'bg-gold-50 text-gold-700 dark:bg-gold-900/20 dark:text-gold-400 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              )}
            >
              All Locations
            </button>
            {locations.map(loc => (
              <button
                key={loc}
                onClick={() => update('location', filters.location === loc ? '' : loc)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  filters.location === loc
                    ? 'bg-gold-50 text-gold-700 dark:bg-gold-900/20 dark:text-gold-400 font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                )}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Price per night
            <span className="font-normal text-slate-400 ml-2">${filters.minPrice} – ${filters.maxPrice === 2000 ? '2000+' : filters.maxPrice}</span>
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Min price</label>
              <input
                type="range" min={0} max={1000} step={50}
                value={filters.minPrice || 0}
                onChange={e => update('minPrice', Number(e.target.value))}
                className="w-full accent-gold-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Max price</label>
              <input
                type="range" min={100} max={2000} step={100}
                value={filters.maxPrice || 2000}
                onChange={e => update('maxPrice', Number(e.target.value))}
                className="w-full accent-gold-500"
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Amenities</h4>
          <div className="grid grid-cols-2 gap-1.5">
            {AMENITIES.slice(0, 12).map(a => {
              const active = filters.amenities?.includes(a)
              return (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={cn(
                    'text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                    active
                      ? 'bg-gold-500 text-white border-gold-500'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-gold-300'
                  )}
                >
                  {a}
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
