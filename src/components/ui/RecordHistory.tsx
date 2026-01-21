'use client'

import { useState } from 'react'
import { Calendar, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Eye } from 'lucide-react'
import { TrendData, calculateTrend } from '@/types/database'
import TrendIndicator from './TrendIndicator'

interface HistoryRecord {
  id: string
  date: string
  score: number
  metrics?: Record<string, number | string>
  notes?: string
  recorded_by?: string
}

interface RecordHistoryProps {
  title: string
  records: HistoryRecord[]
  onViewRecord?: (record: HistoryRecord) => void
  maxVisible?: number
  scoreLabel?: string
}

export default function RecordHistory({
  title,
  records,
  onViewRecord,
  maxVisible = 5,
  scoreLabel = 'Score'
}: RecordHistoryProps) {
  const [expanded, setExpanded] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null)

  // Sort records by date (newest first)
  const sortedRecords = [...records].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const visibleRecords = expanded ? sortedRecords : sortedRecords.slice(0, maxVisible)

  // Calculate trend
  const scores = sortedRecords.map(r => r.score).reverse()
  const trend = calculateTrend(scores)

  // Calculate average
  const average = scores.length > 0
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
    : 0

  // Mini chart data (last 10 records)
  const chartData = sortedRecords.slice(0, 10).reverse()
  const maxScore = Math.max(...chartData.map(r => r.score), 10)
  const minScore = Math.min(...chartData.map(r => r.score), 0)

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500'
    if (score >= 6) return 'text-yellow-500'
    if (score >= 4) return 'text-orange-500'
    return 'text-red-500'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-500'
    if (score >= 6) return 'bg-yellow-500'
    if (score >= 4) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div
      className="rounded-xl p-4 shadow-lg"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{title}</h3>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {records.length} records total
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Average</p>
            <p className={`text-xl font-bold ${getScoreColor(average)}`}>{average}/10</p>
          </div>
          <TrendIndicator trend={trend} />
        </div>
      </div>

      {/* Mini Chart */}
      {chartData.length > 1 && (
        <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
          <div className="flex items-end justify-between h-16 gap-1">
            {chartData.map((record, index) => {
              const height = ((record.score - minScore) / (maxScore - minScore)) * 100
              return (
                <div
                  key={record.id}
                  className="flex-1 flex flex-col items-center gap-1"
                  title={`${record.date}: ${record.score}/10`}
                >
                  <div
                    className={`w-full rounded-t transition-all hover:opacity-80 cursor-pointer ${getScoreBgColor(record.score)}`}
                    style={{ height: `${Math.max(height, 10)}%` }}
                    onClick={() => setSelectedRecord(record)}
                  />
                  {index === chartData.length - 1 && (
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Latest</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Records List */}
      <div className="space-y-2">
        {visibleRecords.map((record, index) => {
          const prevRecord = sortedRecords[index + 1]
          const change = prevRecord ? record.score - prevRecord.score : 0

          return (
            <div
              key={record.id}
              className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-[#FFD700]/5 cursor-pointer"
              style={{ backgroundColor: index === 0 ? 'var(--muted)' : 'transparent' }}
              onClick={() => onViewRecord?.(record)}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar size={16} style={{ color: 'var(--muted-foreground)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    {new Date(record.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                {index === 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-[#FFD700]/20 text-[#FFD700] rounded-full">
                    Latest
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold ${getScoreColor(record.score)}`}>
                  {record.score}/10
                </span>
                {change !== 0 && (
                  <span className={`flex items-center text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(change)}
                  </span>
                )}
                {onViewRecord && (
                  <Eye size={16} style={{ color: 'var(--muted-foreground)' }} />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Show More/Less */}
      {records.length > maxVisible && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-3 py-2 flex items-center justify-center gap-1 text-sm font-medium text-[#FFD700] hover:bg-[#FFD700]/10 rounded-lg transition-colors"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp size={16} />
            </>
          ) : (
            <>
              Show All ({records.length - maxVisible} more) <ChevronDown size={16} />
            </>
          )}
        </button>
      )}

      {/* Selected Record Detail Modal */}
      {selectedRecord && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="rounded-xl p-6 max-w-md w-full mx-4"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            onClick={e => e.stopPropagation()}
          >
            <h4 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Record Details
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>Date</span>
                <span style={{ color: 'var(--foreground)' }}>
                  {new Date(selectedRecord.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted-foreground)' }}>{scoreLabel}</span>
                <span className={`font-bold ${getScoreColor(selectedRecord.score)}`}>
                  {selectedRecord.score}/10
                </span>
              </div>
              {selectedRecord.metrics && Object.entries(selectedRecord.metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span style={{ color: 'var(--muted-foreground)' }}>{key}</span>
                  <span style={{ color: 'var(--foreground)' }}>{String(value)}</span>
                </div>
              ))}
              {selectedRecord.notes && (
                <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Notes</p>
                  <p style={{ color: 'var(--foreground)' }}>{selectedRecord.notes}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSelectedRecord(null)}
              className="w-full mt-4 py-2 bg-[#FFD700] text-black font-medium rounded-lg hover:bg-[#FFD700]/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
