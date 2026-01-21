'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/ui/Header'
import DataTable from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import RatingInput from '@/components/ui/RatingInput'
import TrendIndicator, { TrendArrow } from '@/components/ui/TrendIndicator'
import RecordHistory from '@/components/ui/RecordHistory'
import { Plus, Activity, TrendingUp, Heart, Dumbbell, History, ChevronDown, ChevronUp, Edit, X, ShieldAlert } from 'lucide-react'
import { calculateTrend, type TrendData, type SimpleRecordEntry, ROLE_DISPLAY_NAMES } from '@/types/database'
import { useUser } from '@/context/UserContext'

// Extended mock data with historical records per athlete
// Including sport and squad for permission filtering
const athleteFitnessHistory: Record<string, {
  athlete_id: string
  athlete_name: string
  sport: string
  squad: string
  records: Array<{
    id: string
    test_date: string
    fitness_test: string
    muscle_strength: string
    agility: string
    flexibility: string
    heart_rate: number
    fat_percentage: number
    rating: number
  }>
}> = {
  '1': {
    athlete_id: '1',
    athlete_name: 'Mohammed Al-Omari',
    sport: 'football',
    squad: 'first_team',
    records: [
      { id: '1a', test_date: '2024-10-15', fitness_test: 'Good', muscle_strength: 'Good', agility: 'Good', flexibility: 'Fair', heart_rate: 68, fat_percentage: 14.5, rating: 7 },
      { id: '1b', test_date: '2024-11-15', fitness_test: 'Very Good', muscle_strength: 'Good', agility: 'Very Good', flexibility: 'Good', heart_rate: 65, fat_percentage: 13.5, rating: 8 },
      { id: '1c', test_date: '2024-12-15', fitness_test: 'Very Good', muscle_strength: 'Very Good', agility: 'Excellent', flexibility: 'Good', heart_rate: 63, fat_percentage: 13.0, rating: 8 },
      { id: '1d', test_date: '2025-01-15', fitness_test: 'Excellent', muscle_strength: 'Very Good', agility: 'Excellent', flexibility: 'Good', heart_rate: 62, fat_percentage: 12.5, rating: 9 },
    ]
  },
  '2': {
    athlete_id: '2',
    athlete_name: 'Ahmed Al-Saeed',
    sport: 'football',
    squad: 'first_team',
    records: [
      { id: '2a', test_date: '2024-10-14', fitness_test: 'Excellent', muscle_strength: 'Excellent', agility: 'Excellent', flexibility: 'Very Good', heart_rate: 56, fat_percentage: 9.8, rating: 9 },
      { id: '2b', test_date: '2024-11-14', fitness_test: 'Very Good', muscle_strength: 'Excellent', agility: 'Very Good', flexibility: 'Excellent', heart_rate: 57, fat_percentage: 10.0, rating: 8 },
      { id: '2c', test_date: '2024-12-14', fitness_test: 'Very Good', muscle_strength: 'Excellent', agility: 'Very Good', flexibility: 'Excellent', heart_rate: 58, fat_percentage: 10.1, rating: 8 },
      { id: '2d', test_date: '2025-01-14', fitness_test: 'Very Good', muscle_strength: 'Excellent', agility: 'Very Good', flexibility: 'Excellent', heart_rate: 58, fat_percentage: 10.2, rating: 8 },
    ]
  },
  '3': {
    athlete_id: '3',
    athlete_name: 'Khalid Al-Mohammadi',
    sport: 'football',
    squad: 'first_team',
    records: [
      { id: '3a', test_date: '2024-10-10', fitness_test: 'Very Good', muscle_strength: 'Very Good', agility: 'Very Good', flexibility: 'Good', heart_rate: 60, fat_percentage: 12.0, rating: 8 },
      { id: '3b', test_date: '2024-11-10', fitness_test: 'Good', muscle_strength: 'Good', agility: 'Very Good', flexibility: 'Good', heart_rate: 62, fat_percentage: 13.5, rating: 7 },
      { id: '3c', test_date: '2024-12-10', fitness_test: 'Good', muscle_strength: 'Good', agility: 'Good', flexibility: 'Fair', heart_rate: 65, fat_percentage: 14.8, rating: 6 },
      { id: '3d', test_date: '2025-01-10', fitness_test: 'Good', muscle_strength: 'Good', agility: 'Good', flexibility: 'Fair', heart_rate: 68, fat_percentage: 15.8, rating: 6 },
    ]
  },
  '4': {
    athlete_id: '4',
    athlete_name: 'Saad Al-Dosari',
    sport: 'football',
    squad: 'u21',
    records: [
      { id: '4a', test_date: '2024-11-20', fitness_test: 'Good', muscle_strength: 'Good', agility: 'Good', flexibility: 'Good', heart_rate: 64, fat_percentage: 13.0, rating: 7 },
      { id: '4b', test_date: '2024-12-20', fitness_test: 'Good', muscle_strength: 'Good', agility: 'Good', flexibility: 'Good', heart_rate: 64, fat_percentage: 13.2, rating: 7 },
      { id: '4c', test_date: '2025-01-20', fitness_test: 'Good', muscle_strength: 'Very Good', agility: 'Good', flexibility: 'Good', heart_rate: 63, fat_percentage: 12.8, rating: 7 },
    ]
  },
  '5': {
    athlete_id: '5',
    athlete_name: 'Fahad Al-Otaibi',
    sport: 'football',
    squad: 'first_team',
    records: [
      { id: '5a', test_date: '2024-10-18', fitness_test: 'Fair', muscle_strength: 'Fair', agility: 'Good', flexibility: 'Fair', heart_rate: 72, fat_percentage: 18.0, rating: 5 },
      { id: '5b', test_date: '2024-11-18', fitness_test: 'Good', muscle_strength: 'Good', agility: 'Good', flexibility: 'Good', heart_rate: 68, fat_percentage: 16.5, rating: 6 },
      { id: '5c', test_date: '2024-12-18', fitness_test: 'Good', muscle_strength: 'Good', agility: 'Very Good', flexibility: 'Good', heart_rate: 65, fat_percentage: 15.0, rating: 7 },
      { id: '5d', test_date: '2025-01-18', fitness_test: 'Very Good', muscle_strength: 'Very Good', agility: 'Very Good', flexibility: 'Good', heart_rate: 62, fat_percentage: 13.5, rating: 8 },
    ]
  },
}

// Process data for table display (will be filtered by permissions)
const processAllAthletes = () => Object.values(athleteFitnessHistory).map(athlete => {
  const latestRecord = athlete.records[athlete.records.length - 1]
  const ratings = athlete.records.map(r => r.rating)
  const trend = calculateTrend(ratings)

  return {
    ...latestRecord,
    athlete_id: athlete.athlete_id,
    athlete_name: athlete.athlete_name,
    sport: athlete.sport,
    squad: athlete.squad,
    trend,
    history: athlete.records.map(r => ({
      id: r.id,
      date: r.test_date,
      score: r.rating,
      details: {
        fitness_test: r.fitness_test,
        muscle_strength: r.muscle_strength,
        agility: r.agility,
        flexibility: r.flexibility,
        heart_rate: r.heart_rate,
        fat_percentage: r.fat_percentage
      }
    })) as SimpleRecordEntry[]
  }
})

const allProcessedAthletes = processAllAthletes()

type ProcessedAthlete = typeof allProcessedAthletes[0]
type FitnessRecord = typeof athleteFitnessHistory['1']['records'][0]

export default function FitnessPage() {
  const { currentUser, filterAthletes, hasFullAccess, isLoading: userLoading } = useUser()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<{ athleteId: string; record: FitnessRecord } | null>(null)
  const [newRating, setNewRating] = useState(5)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [selectedAthleteHistory, setSelectedAthleteHistory] = useState<string | null>(null)

  // Filter athletes based on user permissions
  const processedAthletes = useMemo(() => {
    return filterAthletes(allProcessedAthletes)
  }, [filterAthletes])

  // Edit form state
  const [editForm, setEditForm] = useState({
    test_date: '',
    fitness_test: '',
    muscle_strength: '',
    agility: '',
    flexibility: '',
    heart_rate: 0,
    fat_percentage: 0,
    rating: 5,
  })

  const toggleRowExpand = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  // Open edit modal with record data
  const handleEdit = (athleteId: string, record: FitnessRecord) => {
    setEditingRecord({ athleteId, record })
    setEditForm({
      test_date: record.test_date,
      fitness_test: record.fitness_test,
      muscle_strength: record.muscle_strength,
      agility: record.agility,
      flexibility: record.flexibility,
      heart_rate: record.heart_rate,
      fat_percentage: record.fat_percentage,
      rating: record.rating,
    })
    setShowEditModal(true)
  }

  // Handle save edit
  const handleSaveEdit = () => {
    // Here you would normally save to the database
    console.log('Saving edit:', editForm)
    setShowEditModal(false)
    setEditingRecord(null)
    // In real app, update the data and refresh
  }

  // Calculate stats
  const stats = useMemo(() => {
    const totalRecords = processedAthletes.reduce((acc, a) => acc + a.history.length, 0)
    const avgRating = processedAthletes.reduce((acc, a) => acc + a.rating, 0) / processedAthletes.length
    const avgHeartRate = processedAthletes.reduce((acc, a) => acc + a.heart_rate, 0) / processedAthletes.length
    const avgFat = processedAthletes.reduce((acc, a) => acc + a.fat_percentage, 0) / processedAthletes.length
    const improving = processedAthletes.filter(a => a.trend.direction === 'up').length
    const declining = processedAthletes.filter(a => a.trend.direction === 'down').length

    return { totalRecords, avgRating, avgHeartRate, avgFat, improving, declining }
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
      key: 'test_date',
      header: 'Latest Test',
      sortable: true,
      render: (record: ProcessedAthlete) => (
        <span style={{ color: 'var(--foreground)' }}>
          {new Date(record.test_date).toLocaleDateString('en-US')}
        </span>
      ),
    },
    {
      key: 'fitness_test',
      header: 'Fitness Test',
      render: (record: ProcessedAthlete) => (
        <span style={{ color: 'var(--foreground)' }}>{record.fitness_test}</span>
      ),
    },
    {
      key: 'muscle_strength',
      header: 'Muscle Strength',
      render: (record: ProcessedAthlete) => (
        <span style={{ color: 'var(--foreground)' }}>{record.muscle_strength}</span>
      ),
    },
    {
      key: 'heart_rate',
      header: 'Heart Rate',
      render: (record: ProcessedAthlete) => (
        <div className="flex items-center gap-2">
          <Heart size={16} className="text-red-500" />
          <span style={{ color: 'var(--foreground)' }}>{record.heart_rate}</span>
        </div>
      ),
    },
    {
      key: 'fat_percentage',
      header: 'Fat %',
      render: (record: ProcessedAthlete) => (
        <span style={{ color: 'var(--foreground)' }}>{record.fat_percentage}%</span>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (record: ProcessedAthlete) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-4 rounded-sm ${
                i < record.rating ? 'bg-[#FFD700]' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
          <span className="ml-2 font-bold text-[#FFD700]">{record.rating}/10</span>
        </div>
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
      key: 'actions',
      header: 'Actions',
      render: (record: ProcessedAthlete) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              const latestRecord = athleteFitnessHistory[record.athlete_id]?.records.slice(-1)[0]
              if (latestRecord) {
                handleEdit(record.athlete_id, latestRecord)
              }
            }}
            className="p-2 hover:bg-[#FFD700]/20 rounded-lg transition-colors text-[#FFD700]"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedAthleteHistory(record.athlete_id)
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[#FFD700]/20 transition-colors text-[#FFD700]"
            title="History"
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

    const athleteData = athleteFitnessHistory[record.athlete_id]
    if (!athleteData) return null

    return (
      <tr>
        <td colSpan={columns.length} className="p-0">
          <div className="p-4 border-t" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h4 className="font-semibold mb-3 text-[#FFD700]">Historical Records for {record.athlete_name}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Date</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Fitness</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Muscle</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Agility</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Flexibility</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Heart Rate</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Fat %</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Rating</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Actions</th>
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
                        {new Date(rec.test_date).toLocaleDateString('en-US')}
                        {idx === 0 && <span className="ml-2 text-xs text-[#FFD700]">(Latest)</span>}
                      </td>
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>{rec.fitness_test}</td>
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>{rec.muscle_strength}</td>
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>{rec.agility}</td>
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>{rec.flexibility}</td>
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>{rec.heart_rate}</td>
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>{rec.fat_percentage}%</td>
                      <td className="px-4 py-2">
                        <span className="font-bold text-[#FFD700]">{rec.rating}/10</span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(record.athlete_id, rec)
                          }}
                          className="p-1.5 hover:bg-[#FFD700]/20 rounded transition-colors text-[#FFD700]"
                          title="Edit this record"
                        >
                          <Edit size={14} />
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
        title="Fitness"
        userName={currentUser?.full_name || 'User'}
        userRole={currentUser ? ROLE_DISPLAY_NAMES[currentUser.role] : 'Unknown'}
      />

      <div className="p-6">
        {/* Permission Info Banner */}
        {!hasFullAccess && currentUser && (
          <div
            className="mb-6 p-4 rounded-xl flex items-center gap-4"
            style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            <ShieldAlert className="text-[#FFD700] flex-shrink-0" size={24} />
            <div className="flex-1">
              <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                Viewing fitness records based on your permissions
              </p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                You have access to {processedAthletes.length} of {allProcessedAthletes.length} athlete records
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total Records</p>
                <p className="text-3xl font-bold text-[#FFD700]">{stats.totalRecords}</p>
              </div>
              <Activity className="text-[#FFD700]" size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Average Rating</p>
                <p className="text-3xl font-bold text-[#FFD700]">{stats.avgRating.toFixed(1)}</p>
              </div>
              <TrendingUp className="text-[#FFD700]" size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Heart Rate</p>
                <p className="text-3xl font-bold text-red-500">{Math.round(stats.avgHeartRate)}</p>
              </div>
              <Heart className="text-red-500" size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Fat %</p>
                <p className="text-3xl font-bold text-[#FFD700]">{stats.avgFat.toFixed(1)}%</p>
              </div>
              <Dumbbell className="text-[#FFD700]" size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Improving</p>
                <p className="text-3xl font-bold text-green-500">{stats.improving}</p>
              </div>
              <TrendingUp className="text-green-500" size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Declining</p>
                <p className="text-3xl font-bold text-red-500">{stats.declining}</p>
              </div>
              <TrendingUp className="text-red-500 rotate-180" size={28} />
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Fitness Records</h2>
            <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>Track and evaluate athlete fitness with historical trends</p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus size={20} />}
            onClick={() => setShowAddModal(true)}
          >
            Add New Evaluation
          </Button>
        </div>

        {/* Data Table with expandable rows */}
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
      </div>

      {/* Edit Modal */}
      {showEditModal && editingRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#FFD700]">
                Edit Fitness Record - {athleteFitnessHistory[editingRecord.athleteId]?.athlete_name}
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingRecord(null)
                }}
                className="p-2 hover:bg-[#FFD700]/20 rounded-lg transition-colors"
              >
                <X size={20} style={{ color: 'var(--foreground)' }} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Test Date
                  </label>
                  <input
                    type="date"
                    value={editForm.test_date}
                    onChange={(e) => setEditForm({ ...editForm, test_date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Fitness Test
                  </label>
                  <select
                    value={editForm.fitness_test}
                    onChange={(e) => setEditForm({ ...editForm, fitness_test: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Muscle Strength
                  </label>
                  <select
                    value={editForm.muscle_strength}
                    onChange={(e) => setEditForm({ ...editForm, muscle_strength: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Agility
                  </label>
                  <select
                    value={editForm.agility}
                    onChange={(e) => setEditForm({ ...editForm, agility: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Flexibility
                  </label>
                  <select
                    value={editForm.flexibility}
                    onChange={(e) => setEditForm({ ...editForm, flexibility: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Resting Heart Rate
                  </label>
                  <input
                    type="number"
                    value={editForm.heart_rate}
                    onChange={(e) => setEditForm({ ...editForm, heart_rate: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Fat Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.fat_percentage}
                    onChange={(e) => setEditForm({ ...editForm, fat_percentage: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>

              <div>
                <RatingInput
                  label="Overall Rating"
                  value={editForm.rating}
                  onChange={(value) => setEditForm({ ...editForm, rating: value })}
                  max={10}
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingRecord(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {selectedAthleteHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#FFD700]">
                Fitness History - {athleteFitnessHistory[selectedAthleteHistory]?.athlete_name}
              </h2>
              <button
                onClick={() => setSelectedAthleteHistory(null)}
                className="p-2 hover:bg-[#FFD700]/20 rounded-lg transition-colors"
              >
                <X size={20} style={{ color: 'var(--foreground)' }} />
              </button>
            </div>

            {athleteFitnessHistory[selectedAthleteHistory] && (
              <RecordHistory
                title="Fitness Evaluations"
                records={athleteFitnessHistory[selectedAthleteHistory].records.map(r => ({
                  id: r.id,
                  date: r.test_date,
                  score: r.rating,
                  details: {
                    fitness_test: r.fitness_test,
                    muscle_strength: r.muscle_strength,
                    agility: r.agility,
                    flexibility: r.flexibility,
                    heart_rate: r.heart_rate,
                    fat_percentage: r.fat_percentage
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Add New Fitness Evaluation</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-[#FFD700]/20 rounded-lg transition-colors"
              >
                <X size={20} style={{ color: 'var(--foreground)' }} />
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Athlete
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]" style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    <option value="">Select Athlete</option>
                    {Object.values(athleteFitnessHistory).map(a => (
                      <option key={a.athlete_id} value={a.athlete_id}>{a.athlete_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Test Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Fitness Test
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]" style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    <option value="">Select Rating</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Muscle Strength
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]" style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    <option value="">Select Rating</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Agility
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]" style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    <option value="">Select Rating</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Flexibility
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]" style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    <option value="">Select Rating</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Resting Heart Rate
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder="60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Fat Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder="12.5"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <RatingInput
                  label="Overall Rating"
                  value={newRating}
                  onChange={setNewRating}
                  max={10}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Recommendations
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  placeholder="Enter recommendations and notes..."
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
