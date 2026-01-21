'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { TrendData, TrendDirection } from '@/types/database'

interface TrendIndicatorProps {
  trend: TrendData
  showPercentage?: boolean
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function TrendIndicator({
  trend,
  showPercentage = true,
  showLabel = false,
  size = 'md'
}: TrendIndicatorProps) {
  const sizeConfig = {
    sm: { icon: 14, text: 'text-xs' },
    md: { icon: 18, text: 'text-sm' },
    lg: { icon: 24, text: 'text-base' }
  }

  const config = {
    up: {
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      label: 'Improving'
    },
    down: {
      icon: TrendingDown,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      label: 'Declining'
    },
    stable: {
      icon: Minus,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      label: 'Stable'
    }
  }

  const { icon: Icon, color, bgColor, label } = config[trend.direction]
  const { icon: iconSize, text: textSize } = sizeConfig[size]

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${bgColor}`}>
      <Icon size={iconSize} className={color} />
      {showPercentage && trend.percentage > 0 && (
        <span className={`${textSize} font-medium ${color}`}>
          {trend.direction === 'down' ? '-' : '+'}{trend.percentage}%
        </span>
      )}
      {showLabel && (
        <span className={`${textSize} ${color}`}>{label}</span>
      )}
    </div>
  )
}

// Mini version for tables
export function TrendArrow({ direction, size = 16 }: { direction: TrendDirection; size?: number }) {
  const config = {
    up: { icon: TrendingUp, color: 'text-green-500' },
    down: { icon: TrendingDown, color: 'text-red-500' },
    stable: { icon: Minus, color: 'text-yellow-500' }
  }

  const { icon: Icon, color } = config[direction]
  return <Icon size={size} className={color} />
}
