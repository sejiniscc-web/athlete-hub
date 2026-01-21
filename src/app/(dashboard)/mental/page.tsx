'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/ui/Header'
import Button from '@/components/ui/Button'
import RatingInput from '@/components/ui/RatingInput'
import TrendIndicator, { TrendArrow } from '@/components/ui/TrendIndicator'
import RecordHistory from '@/components/ui/RecordHistory'
import { Brain, Plus, History, ChevronDown, ChevronUp, TrendingUp, Users, Heart, Target, Pencil, ShieldAlert } from 'lucide-react'
import EditModal, { FieldConfig } from '@/components/ui/EditModal'
import { calculateTrend, type SimpleRecordEntry, ROLE_DISPLAY_NAMES } from '@/types/database'
import { useUser } from '@/context/UserContext'

// Fields configuration for EditModal
const mentalFields: FieldConfig[] = [
  { key: 'assessment_date', label: 'Assessment Date', type: 'date', required: true },
  { key: 'commitment', label: 'Commitment', type: 'rating', min: 1, max: 10, required: true },
  { key: 'respect', label: 'Respect', type: 'rating', min: 1, max: 10, required: true },
  { key: 'self_confidence', label: 'Self Confidence', type: 'rating', min: 1, max: 10, required: true },
  { key: 'team_work', label: 'Team Work', type: 'rating', min: 1, max: 10, required: true },
  { key: 'attitude_training', label: 'Attitude Training', type: 'rating', min: 1, max: 10, required: true },
  { key: 'attitude_game', label: 'Attitude Game', type: 'rating', min: 1, max: 10, required: true },
  { key: 'overall', label: 'Overall', type: 'rating', min: 1, max: 10, required: true },
  { key: 'notes', label: 'Notes', type: 'textarea' },
]

// Extended mock data with historical records per athlete
// Including sport and squad for permission filtering
let athleteMentalHistory: Record<string, {
  athlete_id: string
  athlete_name: string
  sport: string
  squad: string
  records: Array<{
    id: string
    assessment_date: string
    commitment: number
    respect: number
    self_confidence: number
    team_work: number
    attitude_training: number
    attitude_game: number
    overall: number
    psychologist: string
    notes: string
  }>
}> = {
  '1': {
    athlete_id: '1',
    athlete_name: 'Mohammed Al-Omari',
    sport: 'football',
    squad: 'first_team',
    records: [
      { id: '1a', assessment_date: '2024-10-15', commitment: 8, respect: 8, self_confidence: 7, team_work: 8, attitude_training: 8, attitude_game: 7, overall: 8, psychologist: 'Dr. Sara Al-Psychology', notes: 'Good mental state' },
      { id: '1b', assessment_date: '2024-11-15', commitment: 8, respect: 9, self_confidence: 8, team_work: 8, attitude_training: 8, attitude_game: 8, overall: 8, psychologist: 'Dr. Sara Al-Psychology', notes: 'Improved confidence' },
      { id: '1c', assessment_date: '2024-12-15', commitment: 9, respect: 9, self_confidence: 8, team_work: 9, attitude_training: 9, attitude_game: 8, overall: 9, psychologist: 'Dr. Sara Al-Psychology', notes: 'Excellent progress' },
      { id: '1d', assessment_date: '2025-01-15', commitment: 9, respect: 9, self_confidence: 8, team_work: 9, attitude_training: 9, attitude_game: 8, overall: 9, psychologist: 'Dr. Sara Al-Psychology', notes: 'Maintaining high standards' },
    ]
  },
  '2': {
    athlete_id: '2',
    athlete_name: 'Ahmed Al-Saeed',
    sport: 'football',
    squad: 'first_team',
    records: [
      { id: '2a', assessment_date: '2024-10-14', commitment: 8, respect: 9, self_confidence: 8, team_work: 8, attitude_training: 8, attitude_game: 8, overall: 8, psychologist: 'Dr. Sara Al-Psychology', notes: 'Stable mental health' },
      { id: '2b', assessment_date: '2024-11-14', commitment: 8, respect: 9, self_confidence: 9, team_work: 8, attitude_training: 8, attitude_game: 9, overall: 8, psychologist: 'Dr. Sara Al-Psychology', notes: 'Improved game attitude' },
      { id: '2c', assessment_date: '2024-12-14', commitment: 8, respect: 9, self_confidence: 9, team_work: 8, attitude_training: 8, attitude_game: 9, overall: 8, psychologist: 'Dr. Sara Al-Psychology', notes: 'Consistent performance' },
      { id: '2d', assessment_date: '2025-01-14', commitment: 8, respect: 9, self_confidence: 9, team_work: 8, attitude_training: 8, attitude_game: 9, overall: 8, psychologist: 'Dr. Sara Al-Psychology', notes: 'Strong mentality' },
    ]
  },
  '3': {
    athlete_id: '3',
    athlete_name: 'Khalid Al-Mohammadi',
    sport: 'football',
    squad: 'first_team',
    records: [
      { id: '3a', assessment_date: '2024-10-10', commitment: 9, respect: 10, self_confidence: 9, team_work: 9, attitude_training: 9, attitude_game: 9, overall: 9, psychologist: 'Dr. Sara Al-Psychology', notes: 'Exceptional mental strength' },
      { id: '3b', assessment_date: '2024-11-10', commitment: 9, respect: 10, self_confidence: 8, team_work: 9, attitude_training: 8, attitude_game: 8, overall: 9, psychologist: 'Dr. Sara Al-Psychology', notes: 'Slight dip due to injury' },
      { id: '3c', assessment_date: '2024-12-10', commitment: 9, respect: 10, self_confidence: 8, team_work: 9, attitude_training: 8, attitude_game: 8, overall: 9, psychologist: 'Dr. Sara Al-Psychology', notes: 'Recovery affecting confidence' },
      { id: '3d', assessment_date: '2025-01-10', commitment: 9, respect: 10, self_confidence: 8, team_work: 9, attitude_training: 8, attitude_game: 8, overall: 9, psychologist: 'Dr. Sara Al-Psychology', notes: 'Managing injury stress well' },
    ]
  },
  '4': {
    athlete_id: '4',
    athlete_name: 'Saad Al-Dosari',
    sport: 'football',
    squad: 'u21',
    records: [
      { id: '4a', assessment_date: '2024-11-20', commitment: 7, respect: 8, self_confidence: 7, team_work: 8, attitude_training: 7, attitude_game: 7, overall: 7, psychologist: 'Dr. Sara Al-Psychology', notes: 'Room for improvement' },
      { id: '4b', assessment_date: '2024-12-20', commitment: 7, respect: 8, self_confidence: 7, team_work: 8, attitude_training: 7, attitude_game: 7, overall: 7, psychologist: 'Dr. Sara Al-Psychology', notes: 'Stable but needs motivation' },
      { id: '4c', assessment_date: '2025-01-20', commitment: 8, respect: 8, self_confidence: 8, team_work: 8, attitude_training: 8, attitude_game: 8, overall: 8, psychologist: 'Dr. Sara Al-Psychology', notes: 'Showing improvement' },
    ]
  },
  '5': {
    athlete_id: '5',
    athlete_name: 'Fahad Al-Otaibi',
    sport: 'football',
    squad: 'first_team',
    records: [
      { id: '5a', assessment_date: '2024-10-18', commitment: 6, respect: 7, self_confidence: 5, team_work: 6, attitude_training: 6, attitude_game: 5, overall: 6, psychologist: 'Dr. Sara Al-Psychology', notes: 'Struggling with confidence' },
      { id: '5b', assessment_date: '2024-11-18', commitment: 7, respect: 7, self_confidence: 6, team_work: 7, attitude_training: 7, attitude_game: 6, overall: 7, psychologist: 'Dr. Sara Al-Psychology', notes: 'Gradual improvement' },
      { id: '5c', assessment_date: '2024-12-18', commitment: 7, respect: 8, self_confidence: 7, team_work: 7, attitude_training: 7, attitude_game: 7, overall: 7, psychologist: 'Dr. Sara Al-Psychology', notes: 'Building confidence' },
      { id: '5d', assessment_date: '2025-01-18', commitment: 8, respect: 8, self_confidence: 7, team_work: 8, attitude_training: 8, attitude_game: 7, overall: 8, psychologist: 'Dr. Sara Al-Psychology', notes: 'Significant mental growth' },
    ]
  },
  '6': {
    athlete_id: '6',
    athlete_name: 'Nasser Al-Ghamdi',
    sport: 'basketball',
    squad: 'first_team',
    records: [
      { id: '6a', assessment_date: '2024-11-10', commitment: 8, respect: 9, self_confidence: 8, team_work: 9, attitude_training: 8, attitude_game: 8, overall: 8, psychologist: 'Dr. Sara Al-Psychology', notes: 'Strong team player' },
      { id: '6b', assessment_date: '2024-12-10', commitment: 8, respect: 9, self_confidence: 9, team_work: 9, attitude_training: 9, attitude_game: 8, overall: 9, psychologist: 'Dr. Sara Al-Psychology', notes: 'Showing leadership qualities' },
      { id: '6c', assessment_date: '2025-01-10', commitment: 9, respect: 9, self_confidence: 9, team_work: 9, attitude_training: 9, attitude_game: 9, overall: 9, psychologist: 'Dr. Sara Al-Psychology', notes: 'Excellent mental state' },
    ]
  },
}

// Process data for table display (will be filtered by permissions)
const processAllAthletes = () => Object.values(athleteMentalHistory).map(athlete => {
  const latestRecord = athlete.records[athlete.records.length - 1]
  const scores = athlete.records.map(r => r.overall)
  const trend = calculateTrend(scores)

  return {
    ...latestRecord,
    athlete_id: athlete.athlete_id,
    athlete_name: athlete.athlete_name,
    sport: athlete.sport,
    squad: athlete.squad,
    trend,
    history: athlete.records.map(r => ({
      id: r.id,
      date: r.assessment_date,
      score: r.overall,
      details: {
        commitment: r.commitment,
        respect: r.respect,
        confidence: r.self_confidence,
        teamwork: r.team_work,
        training: r.attitude_training,
        game: r.attitude_game,
        notes: r.notes
      }
    })) as SimpleRecordEntry[]
  }
})

const allProcessedAthletes = processAllAthletes()

type ProcessedAthlete = typeof allProcessedAthletes[0]

type MentalRecord = typeof athleteMentalHistory['1']['records'][0]

export default function MentalAssessmentPage() {
  const { currentUser, filterAthletes, hasFullAccess, isLoading: userLoading } = useUser()
  const [showAddModal, setShowAddModal] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [selectedAthleteHistory, setSelectedAthleteHistory] = useState<string | null>(null)
  const [editingRecord, setEditingRecord] = useState<{ athleteId: string; record: MentalRecord } | null>(null)

  // Filter athletes based on user permissions
  const processedAthletes = useMemo(() => {
    return filterAthletes(allProcessedAthletes)
  }, [filterAthletes])

  const toggleRowExpand = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const handleEdit = (athleteId: string, record: MentalRecord) => {
    setEditingRecord({ athleteId, record })
  }

  const handleSaveEdit = (data: Record<string, any>) => {
    if (!editingRecord) return

    const { athleteId, record } = editingRecord
    const athleteData = athleteMentalHistory[athleteId]
    if (athleteData) {
      const recordIndex = athleteData.records.findIndex(r => r.id === record.id)
      if (recordIndex !== -1) {
        athleteData.records[recordIndex] = {
          ...athleteData.records[recordIndex],
          ...data,
        }
      }
    }
    setEditingRecord(null)
  }

  // Calculate stats
  const stats = useMemo(() => {
    const totalRecords = processedAthletes.reduce((acc, a) => acc + a.history.length, 0)
    const avgScore = (processedAthletes.reduce((acc, a) => acc + a.overall, 0) / processedAthletes.length).toFixed(1)
    const avgConfidence = (processedAthletes.reduce((acc, a) => acc + a.self_confidence, 0) / processedAthletes.length).toFixed(1)
    const avgTeamwork = (processedAthletes.reduce((acc, a) => acc + a.team_work, 0) / processedAthletes.length).toFixed(1)
    const improving = processedAthletes.filter(a => a.trend.direction === 'up').length
    const declining = processedAthletes.filter(a => a.trend.direction === 'down').length

    return { totalRecords, avgScore, avgConfidence, avgTeamwork, improving, declining }
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
      key: 'assessment_date',
      header: 'Date',
      sortable: true,
      render: (record: ProcessedAthlete) => (
        <span style={{ color: 'var(--foreground)' }}>
          {new Date(record.assessment_date).toLocaleDateString('en-US')}
        </span>
      ),
    },
    {
      key: 'commitment',
      header: 'Commitment',
      render: (record: ProcessedAthlete) => (
        <RatingInput value={record.commitment} onChange={() => {}} readOnly size="sm" />
      ),
    },
    {
      key: 'self_confidence',
      header: 'Self Confidence',
      render: (record: ProcessedAthlete) => (
        <RatingInput value={record.self_confidence} onChange={() => {}} readOnly size="sm" />
      ),
    },
    {
      key: 'team_work',
      header: 'Team Work',
      render: (record: ProcessedAthlete) => (
        <RatingInput value={record.team_work} onChange={() => {}} readOnly size="sm" />
      ),
    },
    {
      key: 'overall',
      header: 'Overall',
      render: (record: ProcessedAthlete) => (
        <RatingInput value={record.overall} onChange={() => {}} readOnly size="sm" />
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
      key: 'psychologist',
      header: 'Psychologist',
      render: (record: ProcessedAthlete) => (
        <span style={{ color: 'var(--foreground)' }}>{record.psychologist}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (record: ProcessedAthlete) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              const latestRecord = athleteMentalHistory[record.athlete_id]?.records.slice(-1)[0]
              if (latestRecord) {
                handleEdit(record.athlete_id, latestRecord)
              }
            }}
            className="p-2 hover:bg-[#FFD700]/20 rounded-lg transition-colors text-[#FFD700]"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedAthleteHistory(record.athlete_id)
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#FFD700]/20 transition-colors text-[#FFD700]"
            title="View History"
          >
            <History size={16} />
            <span className="text-sm">{record.history.length}</span>
          </button>
        </div>
      ),
    },
  ]

  // Custom row renderer to show expanded history
  const renderExpandedRow = (record: ProcessedAthlete) => {
    if (!expandedRows.has(record.athlete_id)) return null

    const athleteData = athleteMentalHistory[record.athlete_id]
    if (!athleteData) return null

    return (
      <tr>
        <td colSpan={columns.length} className="p-0">
          <div className="p-4 border-t" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h4 className="font-semibold mb-3 text-[#FFD700]">Mental Assessment History for {record.athlete_name}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Date</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Commitment</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Respect</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Confidence</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Teamwork</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Training</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Game</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Overall</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Edit</th>
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
                        {new Date(rec.assessment_date).toLocaleDateString('en-US')}
                        {idx === 0 && <span className="ml-2 text-xs text-[#FFD700]">(Latest)</span>}
                      </td>
                      <td className="px-4 py-2"><span className="font-bold text-[#FFD700]">{rec.commitment}/10</span></td>
                      <td className="px-4 py-2"><span className="font-bold text-[#FFD700]">{rec.respect}/10</span></td>
                      <td className="px-4 py-2"><span className="font-bold text-[#FFD700]">{rec.self_confidence}/10</span></td>
                      <td className="px-4 py-2"><span className="font-bold text-[#FFD700]">{rec.team_work}/10</span></td>
                      <td className="px-4 py-2"><span className="font-bold text-[#FFD700]">{rec.attitude_training}/10</span></td>
                      <td className="px-4 py-2"><span className="font-bold text-[#FFD700]">{rec.attitude_game}/10</span></td>
                      <td className="px-4 py-2"><span className="font-bold text-[#FFD700]">{rec.overall}/10</span></td>
                      <td className="px-4 py-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(record.athlete_id, rec)
                          }}
                          className="p-1 hover:bg-[#FFD700]/20 rounded transition-colors text-[#FFD700]"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                      </td>
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

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <Header
        title="Mental Assessment"
        userName={currentUser?.full_name || 'User'}
        userRole={currentUser ? ROLE_DISPLAY_NAMES[currentUser.role] : 'Unknown'}
      />

      <div className="p-6 space-y-6">
        {/* Permission Info Banner */}
        {!hasFullAccess && currentUser && (
          <div
            className="p-4 rounded-xl flex items-center gap-4"
            style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            <ShieldAlert className="text-[#FFD700] flex-shrink-0" size={24} />
            <div className="flex-1">
              <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                Viewing mental assessments based on your permissions
              </p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                You have access to {processedAthletes.length} of {allProcessedAthletes.length} athlete records
              </p>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Mental Assessments</h2>
            <p style={{ color: 'var(--muted-foreground)' }}>Track athlete mental health with historical trends</p>
          </div>
          <Button variant="primary" className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
            <Plus size={20} />
            New Assessment
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
            <Brain className="text-[#FFD700]" size={28} />
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Average Score</p>
              <p className="text-3xl font-bold text-[#FFD700]">{stats.avgScore}/10</p>
            </div>
            <Brain className="text-purple-500" size={28} />
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Confidence</p>
              <p className="text-3xl font-bold text-blue-500">{stats.avgConfidence}/10</p>
            </div>
            <Heart className="text-blue-500" size={28} />
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Teamwork</p>
              <p className="text-3xl font-bold text-orange-500">{stats.avgTeamwork}/10</p>
            </div>
            <Users className="text-orange-500" size={28} />
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
                <>
                  <tr
                    key={record.athlete_id}
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
                </>
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
                Mental History - {athleteMentalHistory[selectedAthleteHistory]?.athlete_name}
              </h2>
              <button
                onClick={() => setSelectedAthleteHistory(null)}
                className="p-2 hover:bg-[#FFD700]/20 rounded-lg transition-colors"
              >
                <span style={{ color: 'var(--foreground)' }}>✕</span>
              </button>
            </div>

            {athleteMentalHistory[selectedAthleteHistory] && (
              <RecordHistory
                title="Mental Assessments"
                records={athleteMentalHistory[selectedAthleteHistory].records.map(r => ({
                  id: r.id,
                  date: r.assessment_date,
                  score: r.overall,
                  details: {
                    commitment: r.commitment,
                    respect: r.respect,
                    confidence: r.self_confidence,
                    teamwork: r.team_work,
                    training: r.attitude_training,
                    game: r.attitude_game,
                    notes: r.notes
                  }
                }))}
              />
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <EditModal
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        onSave={handleSaveEdit}
        title={`Edit Mental Assessment - ${editingRecord ? athleteMentalHistory[editingRecord.athleteId]?.athlete_name : ''}`}
        fields={mentalFields}
        initialData={editingRecord?.record || {}}
      />

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Add New Mental Assessment</h2>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Athlete
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]" style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    <option value="">Select Athlete</option>
                    {Object.values(athleteMentalHistory).map(a => (
                      <option key={a.athlete_id} value={a.athlete_id}>{a.athlete_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Assessment Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <RatingInput label="Commitment" value={5} onChange={() => {}} max={10} />
                <RatingInput label="Respect" value={5} onChange={() => {}} max={10} />
                <RatingInput label="Self Confidence" value={5} onChange={() => {}} max={10} />
                <RatingInput label="Team Work" value={5} onChange={() => {}} max={10} />
                <RatingInput label="Attitude Training" value={5} onChange={() => {}} max={10} />
                <RatingInput label="Attitude Game" value={5} onChange={() => {}} max={10} />
              </div>

              <RatingInput label="Overall" value={5} onChange={() => {}} max={10} />

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  placeholder="Assessment notes..."
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
    </div>
  )
}
