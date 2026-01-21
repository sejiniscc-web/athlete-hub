'use client'

import { useState } from 'react'
import { Filter, ChevronDown, Check, X } from 'lucide-react'
import { AthleteStatus, ATHLETE_STATUS_CONFIG, ATHLETE_STATUS_GROUPS } from '@/types/database'

interface StatusFilterProps {
  selectedStatuses: AthleteStatus[]
  onChange: (statuses: AthleteStatus[]) => void
  showGroups?: boolean
}

export default function StatusFilter({ selectedStatuses, onChange, showGroups = true }: StatusFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const allStatuses = Object.keys(ATHLETE_STATUS_CONFIG) as AthleteStatus[]

  const toggleStatus = (status: AthleteStatus) => {
    if (selectedStatuses.includes(status)) {
      onChange(selectedStatuses.filter(s => s !== status))
    } else {
      onChange([...selectedStatuses, status])
    }
  }

  const selectGroup = (group: AthleteStatus[]) => {
    const allSelected = group.every(s => selectedStatuses.includes(s))
    if (allSelected) {
      onChange(selectedStatuses.filter(s => !group.includes(s)))
    } else {
      const newStatuses = [...new Set([...selectedStatuses, ...group])]
      onChange(newStatuses)
    }
  }

  const clearAll = () => {
    onChange([])
  }

  const selectAll = () => {
    onChange(allStatuses)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors"
        style={{
          backgroundColor: selectedStatuses.length > 0 ? '#FFD700' : 'var(--muted)',
          color: selectedStatuses.length > 0 ? '#000' : 'var(--foreground)',
          border: '1px solid var(--border)'
        }}
      >
        <Filter size={18} />
        <span className="font-medium">
          Status {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}
        </span>
        <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div
            className="absolute top-full left-0 mt-2 w-72 rounded-xl shadow-xl z-50 overflow-hidden"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            {/* Header */}
            <div className="p-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="font-medium" style={{ color: 'var(--foreground)' }}>Filter by Status</span>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-xs px-2 py-1 rounded text-[#FFD700] hover:bg-[#FFD700]/10"
                >
                  All
                </button>
                <button
                  onClick={clearAll}
                  className="text-xs px-2 py-1 rounded hover:bg-red-500/10 text-red-500"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Quick Groups */}
            {showGroups && (
              <div className="p-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <p className="text-xs font-medium px-2 mb-2" style={{ color: 'var(--muted-foreground)' }}>
                  Quick Select
                </p>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => selectGroup(ATHLETE_STATUS_GROUPS.available)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      ATHLETE_STATUS_GROUPS.available.every(s => selectedStatuses.includes(s))
                        ? 'bg-green-500 text-white'
                        : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                    }`}
                  >
                    Available
                  </button>
                  <button
                    onClick={() => selectGroup(ATHLETE_STATUS_GROUPS.unavailable)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      ATHLETE_STATUS_GROUPS.unavailable.every(s => selectedStatuses.includes(s))
                        ? 'bg-red-500 text-white'
                        : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                    }`}
                  >
                    Unavailable
                  </button>
                  <button
                    onClick={() => selectGroup(ATHLETE_STATUS_GROUPS.away)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      ATHLETE_STATUS_GROUPS.away.every(s => selectedStatuses.includes(s))
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30'
                    }`}
                  >
                    Away
                  </button>
                  <button
                    onClick={() => selectGroup(ATHLETE_STATUS_GROUPS.departed)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      ATHLETE_STATUS_GROUPS.departed.every(s => selectedStatuses.includes(s))
                        ? 'bg-gray-500 text-white'
                        : 'bg-gray-500/20 text-gray-500 hover:bg-gray-500/30'
                    }`}
                  >
                    Departed
                  </button>
                </div>
              </div>
            )}

            {/* Individual Statuses */}
            <div className="p-2 max-h-64 overflow-y-auto">
              {allStatuses.map(status => {
                const config = ATHLETE_STATUS_CONFIG[status]
                const isSelected = selectedStatuses.includes(status)

                return (
                  <button
                    key={status}
                    onClick={() => toggleStatus(status)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                      isSelected ? 'bg-[#FFD700]/10' : 'hover:bg-[#FFD700]/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${config.bgColor.replace('/20', '')}`} />
                      <span style={{ color: 'var(--foreground)' }}>{config.label}</span>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        ({config.labelAr})
                      </span>
                    </div>
                    {isSelected && <Check size={16} className="text-[#FFD700]" />}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Compact Status Tabs for page headers
export function StatusTabs({
  selectedStatus,
  onChange,
  counts
}: {
  selectedStatus: AthleteStatus | 'all'
  onChange: (status: AthleteStatus | 'all') => void
  counts: Record<AthleteStatus | 'all', number>
}) {
  const tabs: (AthleteStatus | 'all')[] = ['all', 'active', 'injured', 'recovering', 'suspended', 'on_loan']

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
      {tabs.map(tab => {
        const isSelected = selectedStatus === tab
        const config = tab === 'all' ? null : ATHLETE_STATUS_CONFIG[tab]

        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-[#FFD700] text-black'
                : 'hover:bg-[#FFD700]/10'
            }`}
            style={{ color: isSelected ? '#000' : 'var(--foreground)' }}
          >
            {tab === 'all' ? 'All' : config?.label}
            <span className="ml-1 text-xs opacity-70">({counts[tab] || 0})</span>
          </button>
        )
      })}
    </div>
  )
}
