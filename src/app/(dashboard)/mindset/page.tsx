'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/ui/Header'
import DataTable from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import RatingInput from '@/components/ui/RatingInput'
import TrendIndicator, { TrendArrow } from '@/components/ui/TrendIndicator'
import RecordHistory from '@/components/ui/RecordHistory'
import { calculateTrend, SimpleRecordEntry, TrendData } from '@/types/database'
import { Plus, Brain, Smile, Frown, Meh, ChevronDown, ChevronUp, History, TrendingUp, TrendingDown, X } from 'lucide-react'

// Athlete mindset history data
const athleteMindsetHistory: Record<string, {
  athlete_id: string
  athlete_name: string
  records: {
    id: string
    date: string
    daily_mood: number
    daily_stress: number
    daily_anxiety: number
    daily_training: number
    competitive_soul: number
    fixed_sleep: boolean
    socialized: boolean
    board_games: boolean
    video_games: boolean
    relaxation_method: string
    motivation_method: string
  }[]
}> = {
  'athlete-1': {
    athlete_id: 'athlete-1',
    athlete_name: 'Mohammed Al-Omari',
    records: [
      {
        id: '1-1',
        date: '2024-01-05',
        daily_mood: 6,
        daily_stress: 5,
        daily_anxiety: 4,
        daily_training: 7,
        competitive_soul: 7,
        fixed_sleep: false,
        socialized: true,
        board_games: false,
        video_games: true,
        relaxation_method: 'Listening to music',
        motivation_method: 'Family support',
      },
      {
        id: '1-2',
        date: '2024-01-10',
        daily_mood: 7,
        daily_stress: 4,
        daily_anxiety: 3,
        daily_training: 8,
        competitive_soul: 8,
        fixed_sleep: true,
        socialized: true,
        board_games: true,
        video_games: true,
        relaxation_method: 'Reading',
        motivation_method: 'Team success',
      },
      {
        id: '1-3',
        date: '2024-01-15',
        daily_mood: 8,
        daily_stress: 3,
        daily_anxiety: 2,
        daily_training: 9,
        competitive_soul: 9,
        fixed_sleep: true,
        socialized: true,
        board_games: false,
        video_games: false,
        relaxation_method: 'Meditation',
        motivation_method: 'Personal goals',
      },
      {
        id: '1-4',
        date: '2024-01-20',
        daily_mood: 9,
        daily_stress: 2,
        daily_anxiety: 2,
        daily_training: 9,
        competitive_soul: 9,
        fixed_sleep: true,
        socialized: true,
        board_games: true,
        video_games: false,
        relaxation_method: 'Walking',
        motivation_method: 'Championship dreams',
      },
    ],
  },
  'athlete-2': {
    athlete_id: 'athlete-2',
    athlete_name: 'Ahmed Al-Saeed',
    records: [
      {
        id: '2-1',
        date: '2024-01-04',
        daily_mood: 8,
        daily_stress: 3,
        daily_anxiety: 2,
        daily_training: 8,
        competitive_soul: 9,
        fixed_sleep: true,
        socialized: true,
        board_games: true,
        video_games: true,
        relaxation_method: 'Video games',
        motivation_method: 'Competition',
      },
      {
        id: '2-2',
        date: '2024-01-09',
        daily_mood: 7,
        daily_stress: 4,
        daily_anxiety: 3,
        daily_training: 7,
        competitive_soul: 8,
        fixed_sleep: true,
        socialized: false,
        board_games: false,
        video_games: true,
        relaxation_method: 'Sleeping',
        motivation_method: 'Self-improvement',
      },
      {
        id: '2-3',
        date: '2024-01-14',
        daily_mood: 7,
        daily_stress: 4,
        daily_anxiety: 3,
        daily_training: 8,
        competitive_soul: 8,
        fixed_sleep: true,
        socialized: false,
        board_games: false,
        video_games: true,
        relaxation_method: 'Music',
        motivation_method: 'Family pride',
      },
      {
        id: '2-4',
        date: '2024-01-19',
        daily_mood: 6,
        daily_stress: 5,
        daily_anxiety: 4,
        daily_training: 7,
        competitive_soul: 7,
        fixed_sleep: false,
        socialized: false,
        board_games: false,
        video_games: true,
        relaxation_method: 'TV watching',
        motivation_method: 'Contract renewal',
      },
    ],
  },
  'athlete-3': {
    athlete_id: 'athlete-3',
    athlete_name: 'Khalid Al-Mohammadi',
    records: [
      {
        id: '3-1',
        date: '2024-01-03',
        daily_mood: 5,
        daily_stress: 6,
        daily_anxiety: 5,
        daily_training: 6,
        competitive_soul: 6,
        fixed_sleep: false,
        socialized: false,
        board_games: false,
        video_games: false,
        relaxation_method: 'None specified',
        motivation_method: 'Salary',
      },
      {
        id: '3-2',
        date: '2024-01-08',
        daily_mood: 5,
        daily_stress: 7,
        daily_anxiety: 6,
        daily_training: 5,
        competitive_soul: 6,
        fixed_sleep: false,
        socialized: true,
        board_games: false,
        video_games: true,
        relaxation_method: 'Social media',
        motivation_method: 'Coach encouragement',
      },
      {
        id: '3-3',
        date: '2024-01-13',
        daily_mood: 6,
        daily_stress: 6,
        daily_anxiety: 5,
        daily_training: 6,
        competitive_soul: 7,
        fixed_sleep: false,
        socialized: true,
        board_games: true,
        video_games: false,
        relaxation_method: 'Friends hangout',
        motivation_method: 'National team selection',
      },
      {
        id: '3-4',
        date: '2024-01-18',
        daily_mood: 7,
        daily_stress: 5,
        daily_anxiety: 4,
        daily_training: 7,
        competitive_soul: 8,
        fixed_sleep: true,
        socialized: true,
        board_games: true,
        video_games: true,
        relaxation_method: 'Meditation app',
        motivation_method: 'Winning mentality',
      },
    ],
  },
  'athlete-4': {
    athlete_id: 'athlete-4',
    athlete_name: 'Omar Al-Rashid',
    records: [
      {
        id: '4-1',
        date: '2024-01-02',
        daily_mood: 7,
        daily_stress: 4,
        daily_anxiety: 3,
        daily_training: 7,
        competitive_soul: 8,
        fixed_sleep: true,
        socialized: true,
        board_games: false,
        video_games: false,
        relaxation_method: 'Prayer',
        motivation_method: 'Spiritual fulfillment',
      },
      {
        id: '4-2',
        date: '2024-01-07',
        daily_mood: 8,
        daily_stress: 3,
        daily_anxiety: 2,
        daily_training: 8,
        competitive_soul: 8,
        fixed_sleep: true,
        socialized: true,
        board_games: true,
        video_games: false,
        relaxation_method: 'Reading Quran',
        motivation_method: 'Team brotherhood',
      },
      {
        id: '4-3',
        date: '2024-01-12',
        daily_mood: 8,
        daily_stress: 3,
        daily_anxiety: 3,
        daily_training: 8,
        competitive_soul: 9,
        fixed_sleep: true,
        socialized: true,
        board_games: false,
        video_games: false,
        relaxation_method: 'Nature walks',
        motivation_method: 'Club legacy',
      },
      {
        id: '4-4',
        date: '2024-01-17',
        daily_mood: 9,
        daily_stress: 2,
        daily_anxiety: 2,
        daily_training: 9,
        competitive_soul: 9,
        fixed_sleep: true,
        socialized: true,
        board_games: true,
        video_games: false,
        relaxation_method: 'Family time',
        motivation_method: 'Fan support',
      },
    ],
  },
  'athlete-5': {
    athlete_id: 'athlete-5',
    athlete_name: 'Faisal Al-Zahrani',
    records: [
      {
        id: '5-1',
        date: '2024-01-06',
        daily_mood: 6,
        daily_stress: 5,
        daily_anxiety: 4,
        daily_training: 6,
        competitive_soul: 7,
        fixed_sleep: false,
        socialized: true,
        board_games: true,
        video_games: true,
        relaxation_method: 'Gaming',
        motivation_method: 'Starting lineup',
      },
      {
        id: '5-2',
        date: '2024-01-11',
        daily_mood: 5,
        daily_stress: 6,
        daily_anxiety: 5,
        daily_training: 5,
        competitive_soul: 6,
        fixed_sleep: false,
        socialized: false,
        board_games: false,
        video_games: true,
        relaxation_method: 'Sleeping late',
        motivation_method: 'Proving doubters wrong',
      },
      {
        id: '5-3',
        date: '2024-01-16',
        daily_mood: 6,
        daily_stress: 5,
        daily_anxiety: 5,
        daily_training: 6,
        competitive_soul: 7,
        fixed_sleep: true,
        socialized: true,
        board_games: false,
        video_games: true,
        relaxation_method: 'Movies',
        motivation_method: 'Performance bonus',
      },
      {
        id: '5-4',
        date: '2024-01-21',
        daily_mood: 5,
        daily_stress: 6,
        daily_anxiety: 6,
        daily_training: 5,
        competitive_soul: 6,
        fixed_sleep: false,
        socialized: false,
        board_games: false,
        video_games: true,
        relaxation_method: 'Social media scrolling',
        motivation_method: 'Not being benched',
      },
    ],
  },
}

type MindsetRecord = typeof athleteMindsetHistory['athlete-1']['records'][0]

type ProcessedMindset = MindsetRecord & {
  athlete_id: string
  athlete_name: string
  trend: TrendData
  history: SimpleRecordEntry[]
}

const getMoodIcon = (mood: number) => {
  if (mood >= 7) return <Smile className="text-green-500" size={20} />
  if (mood >= 4) return <Meh className="text-yellow-500" size={20} />
  return <Frown className="text-red-500" size={20} />
}

const getRatingColor = (value: number, inverse = false) => {
  if (inverse) {
    if (value <= 3) return 'text-green-500'
    if (value <= 6) return 'text-yellow-500'
    return 'text-red-500'
  }
  if (value >= 7) return 'text-green-500'
  if (value >= 4) return 'text-yellow-500'
  return 'text-red-500'
}

// Calculate wellness score (higher mood, training, competitive + lower stress, anxiety = better)
const calculateWellnessScore = (record: MindsetRecord): number => {
  const positives = record.daily_mood + record.daily_training + record.competitive_soul
  const negatives = record.daily_stress + record.daily_anxiety
  // Normalize to 0-10 scale: positives out of 30, negatives inverted out of 20
  return ((positives / 30) * 60 + ((20 - negatives) / 20) * 40) / 10
}

export default function MindsetPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [historyModal, setHistoryModal] = useState<{ athlete: ProcessedMindset } | null>(null)
  const [formData, setFormData] = useState({
    mood: 5,
    stress: 5,
    anxiety: 5,
    training: 5,
    competitive: 5,
  })

  // Process data for table display
  const processedAthletes = useMemo(() => {
    return Object.values(athleteMindsetHistory).map(athlete => {
      const latestRecord = athlete.records[athlete.records.length - 1]
      const wellnessScores = athlete.records.map(r => calculateWellnessScore(r))
      const trend = calculateTrend(wellnessScores)

      return {
        ...latestRecord,
        athlete_id: athlete.athlete_id,
        athlete_name: athlete.athlete_name,
        trend,
        history: athlete.records.map(r => ({
          id: r.id,
          date: r.date,
          score: calculateWellnessScore(r),
          details: {
            'Mood': `${r.daily_mood}/10`,
            'Stress': `${r.daily_stress}/10`,
            'Anxiety': `${r.daily_anxiety}/10`,
            'Training Readiness': `${r.daily_training}/10`,
            'Competitive Spirit': `${r.competitive_soul}/10`,
            'Regular Sleep': r.fixed_sleep ? 'Yes' : 'No',
          }
        })) as SimpleRecordEntry[]
      }
    })
  }, [])

  // Calculate stats
  const stats = useMemo(() => {
    const totalRecords = Object.values(athleteMindsetHistory).reduce(
      (sum, athlete) => sum + athlete.records.length, 0
    )

    const allRecords = Object.values(athleteMindsetHistory).flatMap(a => a.records)
    const avgMood = allRecords.reduce((sum, r) => sum + r.daily_mood, 0) / allRecords.length
    const avgStress = allRecords.reduce((sum, r) => sum + r.daily_stress, 0) / allRecords.length
    const avgTraining = allRecords.reduce((sum, r) => sum + r.daily_training, 0) / allRecords.length

    const improving = processedAthletes.filter(a => a.trend.direction === 'up').length
    const declining = processedAthletes.filter(a => a.trend.direction === 'down').length

    return { totalRecords, avgMood, avgStress, avgTraining, improving, declining }
  }, [processedAthletes])

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const columns = [
    {
      key: 'expand',
      header: '',
      render: (record: ProcessedMindset) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleRow(record.id)
          }}
          className="p-1 hover:bg-[#FFD700]/20 rounded transition-colors"
        >
          {expandedRows[record.id] ? (
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
    },
    {
      key: 'date',
      header: 'Last Entry',
      sortable: true,
      render: (record: ProcessedMindset) =>
        new Date(record.date).toLocaleDateString('en-US'),
    },
    {
      key: 'daily_mood',
      header: 'Mood',
      render: (record: ProcessedMindset) => (
        <div className="flex items-center gap-2">
          {getMoodIcon(record.daily_mood)}
          <span className={`font-bold ${getRatingColor(record.daily_mood)}`}>
            {record.daily_mood}/10
          </span>
        </div>
      ),
    },
    {
      key: 'daily_stress',
      header: 'Stress',
      render: (record: ProcessedMindset) => (
        <span className={`font-bold ${getRatingColor(record.daily_stress, true)}`}>
          {record.daily_stress}/10
        </span>
      ),
    },
    {
      key: 'daily_anxiety',
      header: 'Anxiety',
      render: (record: ProcessedMindset) => (
        <span className={`font-bold ${getRatingColor(record.daily_anxiety, true)}`}>
          {record.daily_anxiety}/10
        </span>
      ),
    },
    {
      key: 'daily_training',
      header: 'Training Readiness',
      render: (record: ProcessedMindset) => (
        <span className={`font-bold ${getRatingColor(record.daily_training)}`}>
          {record.daily_training}/10
        </span>
      ),
    },
    {
      key: 'competitive_soul',
      header: 'Competitive Spirit',
      render: (record: ProcessedMindset) => (
        <span className={`font-bold ${getRatingColor(record.competitive_soul)}`}>
          {record.competitive_soul}/10
        </span>
      ),
    },
    {
      key: 'fixed_sleep',
      header: 'Regular Sleep',
      render: (record: ProcessedMindset) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            record.fixed_sleep
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {record.fixed_sleep ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'trend',
      header: 'Wellness Trend',
      render: (record: ProcessedMindset) => (
        <TrendIndicator trend={record.trend} showPercentage size="sm" />
      ),
    },
    {
      key: 'actions',
      header: 'History',
      render: (record: ProcessedMindset) => (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setHistoryModal({ athlete: record })
          }}
          className="p-2 hover:bg-[#FFD700]/20 rounded-lg transition-colors"
          title="View Full History"
        >
          <History size={18} className="text-[#FFD700]" />
        </button>
      ),
    },
  ]

  // Custom row render for expandable content
  const renderExpandedRow = (record: ProcessedMindset) => {
    if (!expandedRows[record.id]) return null

    const athleteHistory = athleteMindsetHistory[record.athlete_id]
    if (!athleteHistory) return null

    return (
      <tr>
        <td colSpan={11} className="p-0">
          <div className="p-4" style={{ backgroundColor: 'var(--muted)' }}>
            <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <History size={16} className="text-[#FFD700]" />
              Mindset History - {record.athlete_name}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Mood</th>
                    <th className="text-left p-2">Stress</th>
                    <th className="text-left p-2">Anxiety</th>
                    <th className="text-left p-2">Training</th>
                    <th className="text-left p-2">Competitive</th>
                    <th className="text-left p-2">Sleep</th>
                    <th className="text-left p-2">Wellness</th>
                  </tr>
                </thead>
                <tbody>
                  {[...athleteHistory.records].reverse().map((hist, idx) => {
                    const wellness = calculateWellnessScore(hist)
                    return (
                      <tr key={hist.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="p-2">{new Date(hist.date).toLocaleDateString('en-US')}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            {getMoodIcon(hist.daily_mood)}
                            <span className={getRatingColor(hist.daily_mood)}>{hist.daily_mood}</span>
                          </div>
                        </td>
                        <td className={`p-2 ${getRatingColor(hist.daily_stress, true)}`}>{hist.daily_stress}</td>
                        <td className={`p-2 ${getRatingColor(hist.daily_anxiety, true)}`}>{hist.daily_anxiety}</td>
                        <td className={`p-2 ${getRatingColor(hist.daily_training)}`}>{hist.daily_training}</td>
                        <td className={`p-2 ${getRatingColor(hist.competitive_soul)}`}>{hist.competitive_soul}</td>
                        <td className="p-2">
                          <span className={hist.fixed_sleep ? 'text-green-500' : 'text-red-500'}>
                            {hist.fixed_sleep ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className={`font-medium ${getRatingColor(wellness)}`}>
                            {wellness.toFixed(1)}
                          </span>
                          {idx < athleteHistory.records.length - 1 && (
                            <TrendArrow
                              direction={
                                wellness > calculateWellnessScore(athleteHistory.records[athleteHistory.records.length - 1 - idx - 1])
                                  ? 'up'
                                  : wellness < calculateWellnessScore(athleteHistory.records[athleteHistory.records.length - 1 - idx - 1])
                                  ? 'down'
                                  : 'stable'
                              }
                            />
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div>
      <Header title="Mindset" userName="Admin User" userRole="System Admin" />

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total Records</p>
                <p className="text-2xl font-bold text-[#FFD700]">{stats.totalRecords}</p>
              </div>
              <Brain className="text-[#FFD700]" size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Mood</p>
                <p className={`text-2xl font-bold ${getRatingColor(stats.avgMood)}`}>
                  {stats.avgMood.toFixed(1)}
                </p>
              </div>
              <Smile className={getRatingColor(stats.avgMood)} size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Stress</p>
                <p className={`text-2xl font-bold ${getRatingColor(stats.avgStress, true)}`}>
                  {stats.avgStress.toFixed(1)}
                </p>
              </div>
              <Meh className={getRatingColor(stats.avgStress, true)} size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Training</p>
                <p className={`text-2xl font-bold ${getRatingColor(stats.avgTraining)}`}>
                  {stats.avgTraining.toFixed(1)}
                </p>
              </div>
              <Brain className={getRatingColor(stats.avgTraining)} size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Improving</p>
                <p className="text-2xl font-bold text-green-500">{stats.improving}</p>
              </div>
              <TrendingUp className="text-green-500" size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Declining</p>
                <p className="text-2xl font-bold text-red-500">{stats.declining}</p>
              </div>
              <TrendingDown className="text-red-500" size={28} />
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Mindset Records</h2>
            <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>Track daily mental and psychological state of athletes with history</p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus size={20} />}
            onClick={() => setShowAddModal(true)}
          >
            Add New Evaluation
          </Button>
        </div>

        {/* Data Table */}
        <DataTable
          data={processedAthletes}
          columns={columns}
          searchable
          searchKeys={['athlete_name'] as (keyof ProcessedMindset)[]}
        />
      </div>

      {/* History Modal */}
      {historyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                Wellness History - {historyModal.athlete.athlete_name}
              </h2>
              <button
                onClick={() => setHistoryModal(null)}
                className="p-2 hover:bg-[#FFD700]/20 rounded-lg transition-colors"
              >
                <X size={20} style={{ color: 'var(--muted-foreground)' }} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              <RecordHistory
                records={historyModal.athlete.history}
                title="Wellness Score Over Time"
                scoreLabel="Wellness Score"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Add New Mindset Evaluation</h2>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-base mb-1">
                  Athlete
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]">
                  <option value="">Select Athlete</option>
                  {Object.values(athleteMindsetHistory).map(athlete => (
                    <option key={athlete.athlete_id} value={athlete.athlete_id}>
                      {athlete.athlete_name}
                    </option>
                  ))}
                </select>
              </div>

              <RatingInput
                label="Daily Mood"
                value={formData.mood}
                onChange={(v) => setFormData({ ...formData, mood: v })}
                max={10}
              />

              <RatingInput
                label="Stress Level (1 = Low, 10 = High)"
                value={formData.stress}
                onChange={(v) => setFormData({ ...formData, stress: v })}
                max={10}
              />

              <RatingInput
                label="Anxiety Level (1 = Low, 10 = High)"
                value={formData.anxiety}
                onChange={(v) => setFormData({ ...formData, anxiety: v })}
                max={10}
              />

              <RatingInput
                label="Training Readiness"
                value={formData.training}
                onChange={(v) => setFormData({ ...formData, training: v })}
                max={10}
              />

              <RatingInput
                label="Competitive Spirit"
                value={formData.competitive}
                onChange={(v) => setFormData({ ...formData, competitive: v })}
                max={10}
              />

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-[#FFD700]/10">
                  <input type="checkbox" className="w-5 h-5 text-[#FFD700]" />
                  <span className="text-base">Fixed Sleep Schedule</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-[#FFD700]/10">
                  <input type="checkbox" className="w-5 h-5 text-[#FFD700]" />
                  <span className="text-base">Socialized</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-[#FFD700]/10">
                  <input type="checkbox" className="w-5 h-5 text-[#FFD700]" />
                  <span className="text-base">Board Games</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-[#FFD700]/10">
                  <input type="checkbox" className="w-5 h-5 text-[#FFD700]" />
                  <span className="text-base">Video Games</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-base mb-1">
                  Relaxation Method
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]"
                  placeholder="How do you relax?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-base mb-1">
                  Motivation Method
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]"
                  placeholder="What motivates you?"
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
