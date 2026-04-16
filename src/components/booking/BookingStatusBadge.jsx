import { statusConfig, cn } from '../../utils'
import { Clock, CheckCircle2, XCircle, Flag } from 'lucide-react'

const STATUS_ICONS = {
  pending: Clock,
  confirmed: CheckCircle2,
  cancelled: XCircle,
  completed: Flag,
}

export default function BookingStatusBadge({ status, showIcon = true }) {
  const config = statusConfig[status] || statusConfig.pending
  const Icon = STATUS_ICONS[status] || Clock

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', config.color)}>
      {showIcon && <Icon size={11} />}
      {config.label}
    </span>
  )
}
