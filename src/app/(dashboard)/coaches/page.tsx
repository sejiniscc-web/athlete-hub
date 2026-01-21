'use client'

import React, { useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import RatingInput from '@/components/ui/RatingInput'
import TrendIndicator, { TrendArrow } from '@/components/ui/TrendIndicator'
import RecordHistory from '@/components/ui/RecordHistory'
import { ClipboardList, Plus, History, ChevronDown, ChevronUp, TrendingUp, Target, Zap, Brain } from 'lucide-react'
import { calculateTrend, type SimpleRecordEntry } from '@/types/database'

// Extended mock data with historical records per athlete
const athleteCoachHistory: Record<string, {
  athlete_id: string
  athlete_name: string
  records: Array<{
    id: string
    evaluation_date: string
    technical_skills: number
    tactical_awareness: number
    physical_performance: number
    game_reading: number
    decision_making: number
    overall_rating: number
    coach: string
    notes: string
  }>
}> = {
  '1': {
    athlete_id: '1',
    athlete_name: 'Mohammed Al-Omari',
    records: [
      { id: '1a', evaluation_date: '2024-10-15', technical_skills: 8, tactical_awareness: 7, physical_performance: 8, game_reading: 7, decision_making: 7, overall_rating: 8, coach: 'Saad Al-Coach', notes: 'Good potential' },
      { id: '1b', evaluation_date: '2024-11-15', technical_skills: 8, tactical_awareness: 8, physical_performance: 8, game_reading: 8, decision_making: 8, overall_rating: 8, coach: 'Saad Al-Coach', notes: 'Improved tactical awareness' },
      { id: '1c', evaluation_date: '2024-12-15', technical_skills: 9, tactical_awareness: 8, physical_performance: 9, game_reading: 8, decision_making: 8, overall_rating: 9, coach: 'Saad Al-Coach', notes: 'Excellent technical progress' },
      { id: '1d', evaluation_date: '2025-01-15', technical_skills: 9, tactical_awareness: 8, physical_performance: 9, game_reading: 8, decision_making: 8, overall_rating: 9, coach: 'Saad Al-Coach', notes: 'Maintaining high level' },
    ]
  },
  '2': {
    athlete_id: '2',
    athlete_name: 'Ahmed Al-Saeed',
    records: [
      { id: '2a', evaluation_date: '2024-10-14', technical_skills: 8, tactical_awareness: 9, physical_performance: 8, game_reading: 9, decision_making: 8, overall_rating: 8, coach: 'Saad Al-Coach', notes: 'Strong tactical player' },
      { id: '2b', evaluation_date: '2024-11-14', technical_skills: 8, tactical_awareness: 9, physical_performance: 8, game_reading: 9, decision_making: 8, overall_rating: 8, coach: 'Saad Al-Coach', notes: 'Consistent performance' },
      { id: '2c', evaluation_date: '2024-12-14', technical_skills: 8, tactical_awareness: 9, physical_performance: 8, game_reading: 9, decision_making: 8, overall_rating: 8, coach: 'Saad Al-Coach', notes: 'Stable form' },
      { id: '2d', evaluation_date: '2025-01-14', technical_skills: 8, tactical_awareness: 9, physical_performance: 8, game_reading: 9, decision_making: 8, overall_rating: 8, coach: 'Saad Al-Coach', notes: 'Reliable team player' },
    ]
  },
  '3': {
    athlete_id: '3',
    athlete_name: 'Khalid Al-Mohammadi',
    records: [
      { id: '3a', evaluation_date: '2024-10-10', technical_skills: 9, tactical_awareness: 9, physical_performance: 9, game_reading: 9, decision_making: 9, overall_rating: 9, coach: 'Saad Al-Coach', notes: 'Complete player' },
      { id: '3b', evaluation_date: '2024-11-10', technical_skills: 9, tactical_awareness: 9, physical_performance: 8, game_reading: 9, decision_making: 9, overall_rating: 9, coach: 'Saad Al-Coach', notes: 'Slight physical dip due to injury' },
      { id: '3c', evaluation_date: '2024-12-10', technical_skills: 9, tactical_awareness: 9, physical_performance: 7, game_reading: 9, decision_making: 9, overall_rating: 8, coach: 'Saad Al-Coach', notes: 'Physical performance affected' },
      { id: '3d', evaluation_date: '2025-01-10', technical_skills: 9, tactical_awareness: 9, physical_performance: 7, game_reading: 9, decision_making: 9, overall_rating: 8, coach: 'Saad Al-Coach', notes: 'Recovering well' },
    ]
  },
  '4': {
    athlete_id: '4',
    athlete_name: 'Saad Al-Dosari',
    records: [
      { id: '4a', evaluation_date: '2024-11-20', technical_skills: 7, tactical_awareness: 7, physical_performance: 7, game_reading: 7, decision_making: 7, overall_rating: 7, coach: 'Saad Al-Coach', notes: 'Room for growth' },
      { id: '4b', evaluation_date: '2024-12-20', technical_skills: 7, tactical_awareness: 7, physical_performance: 7, game_reading: 7, decision_making: 7, overall_rating: 7, coach: 'Saad Al-Coach', notes: 'Needs more training' },
      { id: '4c', evaluation_date: '2025-01-20', technical_skills: 7, tactical_awareness: 7, physical_performance: 8, game_reading: 7, decision_making: 7, overall_rating: 7, coach: 'Saad Al-Coach', notes: 'Physical improvement noted' },
    ]
  },
  '5': {
    athlete_id: '5',
    athlete_name: 'Fahad Al-Otaibi',
    records: [
      { id: '5a', evaluation_date: '2024-10-18', technical_skills: 6, tactical_awareness: 6, physical_performance: 5, game_reading: 6, decision_making: 5, overall_rating: 6, coach: 'Saad Al-Coach', notes: 'Needs intensive work' },
      { id: '5b', evaluation_date: '2024-11-18', technical_skills: 6, tactical_awareness: 6, physical_performance: 6, game_reading: 6, decision_making: 6, overall_rating: 6, coach: 'Saad Al-Coach', notes: 'Slight improvement' },
      { id: '5c', evaluation_date: '2024-12-18', technical_skills: 7, tactical_awareness: 7, physical_performance: 7, game_reading: 7, decision_making: 6, overall_rating: 7, coach: 'Saad Al-Coach', notes: 'Noticeable progress' },
      { id: '5d', evaluation_date: '2025-01-18', technical_skills: 7, tactical_awareness: 7, physical_performance: 8, game_reading: 7, decision_making: 7, overall_rating: 7, coach: 'Saad Al-Coach', notes: 'Good development trajectory' },
    ]
  },
}

// Process data for table display
const processedAthletes = Object.values(athleteCoachHistory).map(athlete => {
  const latestRecord = athlete.records[athlete.records.length - 1]
  const scores = athlete.records.map(r => r.overall_rating)
  const trend = calculateTrend(scores)

  return {
    ...latestRecord,
    athlete_id: athlete.athlete_id,
    athlete_name: athlete.athlete_name,
    trend,
    history: athlete.records.map(r => ({
      id: r.id,
      date: r.evaluation_date,
      score: r.overall_rating,
      details: {
        technical: r.technical_skills,
        tactical: r.tactical_awareness,
        physical: r.physical_performance,
        game_reading: r.game_reading,
        decision: r.decision_making,
        notes: r.notes
      }
    })) as SimpleRecordEntry[]
  }
})

type ProcessedAthlete = typeof processedAthletes[0]

export default function CoachEvaluationPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [selectedAthleteHistory, setSelectedAthleteHistory] = useState<string | null>(null)

  const toggleRowExpand = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  // Calculate stats
  const stats = useMemo(() => {
    const totalRecords = processedAthletes.reduce((acc, a) => acc + a.history.length, 0)
    const avgRating = (processedAthletes.reduce((acc, a) => acc + a.overall_rating, 0) / processedAthletes.length).toFixed(1)
    const avgTechnical = (processedAthletes.reduce((acc, a) => acc + a.technical_skills, 0) / processedAthletes.length).toFixed(1)
    const avgTactical = (processedAthletes.reduce((acc, a) => acc + a.tactical_awareness, 0) / processedAthletes.length).toFixed(1)
    const improving = processedAthletes.filter(a => a.trend.direction === 'up').length
    const declining = processedAthletes.filter(a => a.trend.direction === 'down').length

    return { totalRecords, avgRating, avgTechnical, avgTactical, improving, declining }
  }, [])

  const columns = [
    {
      key: 'expand',
      header: '',
      render: (record: ProcessedAthlete) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleRowExpand(record.athlete_id)
          }}
          className="p-1 hover:bg-[#FFD700]/20 rounded transition-colors"
        >
          {expandedRows.has(record.athlete_id) ? (
            <ChevronUp size={18} className="text-[#FFD700]" />
          ) : (
            <ChevronDown size={18} style={{ color: 'var(--muted-foreground)' }} />
          )}
        </button>
      ),
    },
    {
      key: 'athlete_name',
      header: 'Athlete Name',
      sortable: true,
      render: (record: ProcessedAthlete) => (
        <div className="flex items-center gap-2">
          <span className="font-medium" style={{ color: 'var(--foreground)' }}>{record.athlete_name}</span>
          <TrendArrow direction={record.trend.direction} size={16} />
        </div>
      ),
    },
    {
      key: 'evaluation_date',
      header: 'Date',
      sortable: true,
      render: (record: ProcessedAthlete) => (
        <span style={{ color: 'var(--foreground)' }}>
          {new Date(record.evaluation_date).toLocaleDateString('en-US')}
        </span>
      ),
    },
    {
      key: 'technical_skills',
      header: 'Technical',
      render: (record: ProcessedAthlete) => (
        <RatingInput value={record.technical_skills} onChange={() => {}} readOnly size="sm" />
      ),
    },
    {
      key: 'tactical_awareness',
      header: 'Tactical',
      render: (record: ProcessedAthlete) => (
        <RatingInput value={record.tactical_awareness} onChange={() => {}} readOnly size="sm" />
      ),
    },
    {
      key: 'physical_performance',
      header: 'Physical',
      render: (record: ProcessedAthlete) => (
        <RatingInput value={record.physical_performance} onChange={() => {}} readOnly size="sm" />
      ),
    },
    {
      key: 'overall_rating',
      header: 'Overall',
      render: (record: ProcessedAthlete) => (
        <RatingInput value={record.overall_rating} onChange={() => {}} readOnly size="sm" />
      ),
    },
    {
      key: 'trend',
      header: 'Trend',
      render: (record: ProcessedAthlete) => (
        <TrendIndicator trend={record.trend} showPercentage size="sm" />
      ),
    },
    {
      key: 'coach',
      header: 'Coach',
      render: (record: ProcessedAthlete) => (
        <span style={{ color: 'var(--foreground)' }}>{record.coach}</span>
      ),
    },
    {
      key: 'history',
      header: 'History',
      render: (record: ProcessedAthlete) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setSelectedAthleteHistory(record.athlete_id)
          }}
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#FFD700]/20 transition-colors text-[#FFD700]"
        >
          <History size={16} />
          <span className="text-sm">{record.history.length} records</span>
        </button>
      ),
    },
  ]

  // Custom row renderer to show expanded history
  const renderExpandedRow = (record: ProcessedAthlete) => {
    if (!expandedRows.has(record.athlete_id)) return null

    const athleteData = athleteCoachHistory[record.athlete_id]
    if (!athleteData) return null

    return (
      <tr>
        <td colSpan={columns.length} className="p-0">
          <div className="p-4 border-t" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h4 className="font-semibold mb-3 text-[#FFD700]">Coach Evaluation History for {record.athlete_name}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Date</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Technical</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Tactical</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Physical</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Game Reading</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Decision</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Overall</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[...athleteData.records].reverse().map((rec, idx) => (
                    <tr
                      key={rec.id}
                      className={idx === 0 ? 'bg-[#FFD700]/10' : ''}
                      style={{ borderBottom: '1px solid var(--border)' }}
                    >
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>
                        {new Date(rec.evaluation_date).toLocaleDateString('en-US')}
                        {idx === 0 && <span className="ml-2 text-xs text-[#FFD700]">(Latest)</span>}
                      </td>
                      <td className="px-4 py-2"><span className="font-bold text-[#FFD700]">{rec.technical_skills}/10</span></td>
                      <td className="px-4 py-2"><span className="font-bold text-[#FFD700]">{rec.tactical_awareness}/10</span></td>
                      <td className="px-4 py-2"><span className="font-bold text-[#FFD700]">{rec.physical_performance}/10</span></td>
                      <td className="px-4 py-2"><span className="font-bold text-[#FFD700]">{rec.game_reading}/10</span></td>
                      <td className="px-4 py-2"><span className="font-bold text-[#FFD700]">{rec.decision_making}/10</span></td>
                      <td className="px-4 py-2"><span className="font-bold text-[#FFD700]">{rec.overall_rating}/10</span></td>
                      <td className="px-4 py-2 max-w-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{rec.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Coach Evaluation</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Al-Ittihad FC - Performance Management</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          New Evaluation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total Records</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>{stats.totalRecords}</p>
            </div>
            <ClipboardList className="text-[#FFD700]" size={28} />
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Rating</p>
              <p className="text-3xl font-bold text-[#FFD700]">{stats.avgRating}/10</p>
            </div>
            <Target className="text-green-500" size={28} />
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Technical</p>
              <p className="text-3xl font-bold text-blue-500">{stats.avgTechnical}/10</p>
            </div>
            <Zap className="text-blue-500" size={28} />
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Tactical</p>
              <p className="text-3xl font-bold text-purple-500">{stats.avgTactical}/10</p>
            </div>
            <Brain className="text-purple-500" size={28} />
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Improving</p>
              <p className="text-3xl font-bold text-green-500">{stats.improving}</p>
            </div>
            <TrendingUp className="text-green-500" size={28} />
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Declining</p>
              <p className="text-3xl font-bold text-red-500">{stats.declining}</p>
            </div>
            <TrendingUp className="text-red-500 rotate-180" size={28} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
                {columns.map((col) => (
                  <th key={col.key} className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedAthletes.map((record) => (
                <React.Fragment key={record.athlete_id}>
                  <tr
                    className="hover:bg-[#FFD700]/5 transition-colors cursor-pointer"
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onClick={() => toggleRowExpand(record.athlete_id)}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4">
                        {col.render ? col.render(record) : (record as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                  {renderExpandedRow(record)}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Modal */}
      {selectedAthleteHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#FFD700]">
                Coach Evaluation History - {athleteCoachHistory[selectedAthleteHistory]?.athlete_name}
              </h2>
              <button
                onClick={() => setSelectedAthleteHistory(null)}
                className="p-2 hover:bg-[#FFD700]/20 rounded-lg transition-colors"
              >
                <span style={{ color: 'var(--foreground)' }}>✕</span>
              </button>
            </div>

            {athleteCoachHistory[selectedAthleteHistory] && (
              <RecordHistory
                title="Coach Evaluations"
                records={athleteCoachHistory[selectedAthleteHistory].records.map(r => ({
                  id: r.id,
                  date: r.evaluation_date,
                  score: r.overall_rating,
                  details: {
                    technical: r.technical_skills,
                    tactical: r.tactical_awareness,
                    physical: r.physical_performance,
                    game_reading: r.game_reading,
                    decision: r.decision_making,
                    notes: r.notes
                  }
                }))}
              />
            )}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Add New Coach Evaluation</h2>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Athlete
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]" style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    <option value="">Select Athlete</option>
                    {Object.values(athleteCoachHistory).map(a => (
                      <option key={a.athlete_id} value={a.athlete_id}>{a.athlete_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Evaluation Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <RatingInput label="Technical Skills" value={5} onChange={() => {}} max={10} />
                <RatingInput label="Tactical Awareness" value={5} onChange={() => {}} max={10} />
                <RatingInput label="Physical Performance" value={5} onChange={() => {}} max={10} />
                <RatingInput label="Game Reading" value={5} onChange={() => {}} max={10} />
                <RatingInput label="Decision Making" value={5} onChange={() => {}} max={10} />
              </div>

              <RatingInput label="Overall Rating" value={5} onChange={() => {}} max={10} />

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  placeholder="Evaluation notes..."
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" variant="primary">
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
