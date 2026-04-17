import { Link } from 'react-router-dom'
import { MapPin, Star, Wifi, Dumbbell, Waves } from 'lucide-react'
import { hotelService } from '../../services/hotelService'
import { formatCurrency, truncate } from '../../utils'
import { Badge } from '../common/UI'

const AMENITY_ICONS = {
  'WiFi': Wifi,
  'Pool': Waves,
  'Gym': Dumbbell,
}

export default function HotelCard({ hotel, className }) {
  const imageUrl = hotel.imageIds?.[0]
    ? hotelService.getImageUrl(hotel.imageIds[0], 600, 400)
    : hotel.imageUrl || null

  return (
    <Link
      to={`/hotels/${hotel.$id}`}
      className={`group block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-card dark:shadow-card-dark card-hover ${className || ''}`}
      id={`hotel-card-${hotel.$id}`}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-700">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={hotel.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-slate-700 dark:to-slate-600">
            <span className="text-4xl">🏨</span>
          </div>
        )}

        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-md">
          <Star size={12} className="fill-gold-400 text-gold-400" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {hotel.rating?.toFixed(1) || 'New'}
          </span>
        </div>

        {/* Category badge */}
        {hotel.category && (
          <div className="absolute top-3 left-3">
            <Badge variant="gold">{hotel.category}</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display font-semibold text-slate-900 dark:text-white text-lg leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {hotel.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mb-3">
          <MapPin size={13} />
          <span className="text-sm">{hotel.location}</span>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
          {truncate(hotel.description, 100)}
        </p>

        {/* Amenities preview */}
        {hotel.amenities?.length > 0 && (
          <div className="flex items-center gap-1.5 mb-4 flex-wrap">
            {hotel.amenities.slice(0, 4).map(a => {
              const Icon = AMENITY_ICONS[a]
              return (
                <span key={a} className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">
                  {Icon && <Icon size={10} />}
                  {a}
                </span>
              )
            })}
            {hotel.amenities.length > 4 && (
              <span className="text-xs text-slate-400 dark:text-slate-500">+{hotel.amenities.length - 4}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500">Starting from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(hotel.startingPrice || 0)}
              </span>
              <span className="text-xs text-slate-400">/night</span>
            </div>
          </div>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  )
}
