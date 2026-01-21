'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

interface RatingInputProps {
  value: number
  onChange: (value: number) => void
  max?: number
  label?: string
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 16,
  md: 24,
  lg: 32,
}

export default function RatingInput({
  value,
  onChange,
  max = 10,
  label,
  readOnly = false,
  size = 'md',
}: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const displayValue = hoverValue !== null ? hoverValue : value

  const getColor = (rating: number) => {
    if (rating <= 3) return 'text-red-500'
    if (rating <= 5) return 'text-orange-500'
    if (rating <= 7) return 'text-yellow-500'
    return 'text-[#FFD700]'
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-base font-medium" style={{ color: 'var(--foreground)' }}>{label}</label>
      )}
      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
          <button
            key={rating}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange(rating)}
            onMouseEnter={() => !readOnly && setHoverValue(rating)}
            onMouseLeave={() => setHoverValue(null)}
            className={`transition-transform ${
              !readOnly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
            }`}
          >
            <Star
              size={sizeClasses[size]}
              className={`transition-colors ${
                rating <= displayValue
                  ? `${getColor(displayValue)} fill-current`
                  : 'text-gray-300'
              }`}
              style={rating > displayValue ? { color: 'var(--muted-foreground)' } : undefined}
            />
          </button>
        ))}
        <span className={`ml-2 font-bold text-lg ${getColor(displayValue)}`}>
          {displayValue}/{max}
        </span>
      </div>
    </div>
  )
}
