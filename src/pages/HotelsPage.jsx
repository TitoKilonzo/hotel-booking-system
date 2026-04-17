import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { hotelService } from '../services/hotelService'
import HotelCard from '../components/hotel/HotelCard'
import HotelFilters from '../components/hotel/HotelFilters'
import { Skeleton, EmptyState, Button } from '../components/common/UI'
import { Hotel, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDebounce } from '../hooks'

const PAGE_SIZE = 9

export default function HotelsPage() {
  const [searchParams] = useSearchParams()

  const [filters, setFilters] = useState({
    search:   searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    minPrice: 0,
    maxPrice: 50000,
    amenities: [],
  })
  const [hotels, setHotels]       = useState([])
  const [total, setTotal]         = useState(0)
  const [loading, setLoading]     = useState(true)
  const [page, setPage]           = useState(1)
  const [locations, setLocations] = useState([])

  const debouncedSearch = useDebounce(filters.search, 500)

  // Load locations for filter sidebar
  useEffect(() => {
    hotelService.getLocations().then(setLocations).catch(() => {})
  }, [])

  // Reload hotels when filters/page change
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    hotelService.getHotels({
      search:    debouncedSearch,
      location:  filters.location,
      minPrice:  filters.minPrice,
      maxPrice:  filters.maxPrice,
      amenities: filters.amenities,
      page,
      limit: PAGE_SIZE,
    }).then(res => {
      if (!cancelled) {
        setHotels(res.documents)
        setTotal(res.total)
        setLoading(false)
      }
    }).catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [debouncedSearch, filters.location, filters.minPrice, filters.maxPrice, filters.amenities, page])

  // Reset page when filters change
  useEffect(() => { setPage(1) }, [filters])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/30 page-enter">
      {/* Page header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-1" id="hotels-page-title">
            Discover Hotels in Kenya 🇰🇪
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {loading ? 'Searching...' : `${total.toLocaleString()} properties found across Kenya`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-card p-5">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Filters</h2>
              <HotelFilters filters={filters} onChange={setFilters} locations={locations} />
            </div>
          </aside>

          {/* Grid */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden">
                    <Skeleton className="h-48" />
                    <div className="p-5 space-y-2.5">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : hotels.length === 0 ? (
              <EmptyState
                icon={Hotel}
                title="No hotels found"
                message="Try adjusting your filters or search terms to find more options."
                action={
                  <Button variant="secondary" onClick={() => setFilters({ search: '', location: '', minPrice: 0, maxPrice: 50000, amenities: [] })} id="clear-filters-btn">
                    Clear Filters
                  </Button>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {hotels.map(hotel => <HotelCard key={hotel.$id} hotel={hotel} />)}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <Button variant="secondary" size="icon" disabled={page === 1} onClick={() => setPage(p => p - 1)} id="prev-page-btn">
                      <ChevronLeft size={18} />
                    </Button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            p === page
                              ? 'bg-emerald-500 text-white'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                          id={`page-${p}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <Button variant="secondary" size="icon" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} id="next-page-btn">
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
