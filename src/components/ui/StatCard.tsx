import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: {
    value: number
    isPositive: boolean
  }
  color?: 'gold' | 'black' | 'success' | 'warning' | 'error'
}

const colorClasses = {
  gold: 'border-l-[#FFD700] bg-gradient-to-r from-gray-800 to-gray-900',
  black: 'border-l-black bg-gradient-to-r from-[#FFD700] to-yellow-500',
  success: 'border-l-green-500 bg-gradient-to-r from-green-800 to-green-900',
  warning: 'border-l-orange-500 bg-gradient-to-r from-orange-800 to-orange-900',
  error: 'border-l-red-500 bg-gradient-to-r from-red-800 to-red-900',
}

const iconColorClasses = {
  gold: 'text-[#FFD700]',
  black: 'text-black',
  success: 'text-green-300',
  warning: 'text-orange-300',
  error: 'text-red-300',
}

const valueColorClasses = {
  gold: 'text-[#FFD700]',
  black: 'text-black',
  success: 'text-green-300',
  warning: 'text-orange-300',
  error: 'text-red-300',
}

const titleColorClasses = {
  gold: 'text-gray-200',
  black: 'text-black/80',
  success: 'text-green-100',
  warning: 'text-orange-100',
  error: 'text-red-100',
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  color = 'gold',
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl p-6 border-l-4 ${colorClasses[color]} text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium mb-1 ${titleColorClasses[color]}`}>{title}</p>
          <p className={`text-3xl font-bold ${valueColorClasses[color]}`}>{value}</p>
          {change && (
            <p
              className={`text-sm font-semibold mt-2 ${
                change.isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
              <span className="text-gray-300 font-normal ml-1">from last month</span>
            </p>
          )}
        </div>
        <div
          className={`p-3 rounded-lg bg-white/20 ${iconColorClasses[color]}`}
        >
          <Icon size={28} />
        </div>
      </div>
    </div>
  )
}
