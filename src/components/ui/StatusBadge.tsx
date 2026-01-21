'use client'

import { AthleteStatus, ATHLETE_STATUS_CONFIG } from '@/types/database'

interface StatusBadgeProps {
  status: AthleteStatus
  size?: 'sm' | 'md' | 'lg'
  showArabic?: boolean
}

export default function StatusBadge({ status, size = 'md', showArabic = false }: StatusBadgeProps) {
  const config = ATHLETE_STATUS_CONFIG[status]

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.bgColor} ${config.color} ${sizeClasses[size]}`}>
      {showArabic ? config.labelAr : config.label}
    </span>
  )
}

// Status Dot for compact display
export function StatusDot({ status, size = 8 }: { status: AthleteStatus; size?: number }) {
  const config = ATHLETE_STATUS_CONFIG[status]
  const colorClass = config.color.replace('text-', 'bg-')

  return (
    <span
      className={`inline-block rounded-full ${colorClass}`}
      style={{ width: size, height: size }}
      title={config.label}
    />
  )
}
