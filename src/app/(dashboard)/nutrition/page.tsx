'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/ui/Header'
import Button from '@/components/ui/Button'
import TrendIndicator, { TrendArrow } from '@/components/ui/TrendIndicator'
import RecordHistory from '@/components/ui/RecordHistory'
import { Plus, Utensils, Droplet, Apple, Beef, History, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Scale, Pencil, ShieldAlert } from 'lucide-react'
import EditModal, { FieldConfig } from '@/components/ui/EditModal'
import { calculateTrend, type SimpleRecordEntry, ROLE_DISPLAY_NAMES } from '@/types/database'
import { useUser } from '@/context/UserContext'

// Fields configuration for EditModal
const nutritionFields: FieldConfig[] = [
  { key: 'date', label: 'Date', type: 'date', required: true },
  { key: 'current_weight', label: 'Current Weight (kg)', type: 'number', step: 0.1, required: true },
  { key: 'target_weight', label: 'Target Weight (kg)', type: 'number', step: 0.1, required: true },
  { key: 'daily_calories', label: 'Daily Calories', type: 'number', required: true },
  { key: 'protein', label: 'Protein (g)', type: 'number', required: true },
  { key: 'carbs', label: 'Carbs (g)', type: 'number', required: true },
  { key: 'fats', label: 'Fats (g)', type: 'number', required: true },
  { key: 'water', label: 'Water (L)', type: 'number', step: 0.1, required: true },
  { key: 'compliance_score', label: 'Compliance Score', type: 'rating', min: 1, max: 10, required: true },
]

// Extended mock data with historical records per athlete
// Including sport and squad for permission filtering
let athleteNutritionHistory: Record<string, {
  athlete_id: string
  athlete_name: string
  sport: string
  squad: string
  records: Array<{
    id: string
    date: string
    doctor_name: string
    current_weight: number
    target_weight: number
    daily_calories: number
    protein: number
    carbs: number
    fats: number
    water: number
    compliance_score: number // 1-10 scale for tracking adherence
  }>
}> = {
  '1': {
    athlete_id: '1',
    athlete_name: 'Mohammed Al-Omari',
    sport: 'football',
    squad: 'first_team',
    records: [
      { id: '1a', date: '2024-10-15', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 78, target_weight: 73, daily_calories: 2600, protein: 170, carbs: 300, fats: 75, water: 3.0, compliance_score: 7 },
      { id: '1b', date: '2024-11-15', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 76.5, target_weight: 73, daily_calories: 2700, protein: 175, carbs: 310, fats: 78, water: 3.2, compliance_score: 8 },
      { id: '1c', date: '2024-12-15', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 75.5, target_weight: 73, daily_calories: 2750, protein: 178, carbs: 315, fats: 79, water: 3.4, compliance_score: 8 },
      { id: '1d', date: '2025-01-15', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 75, target_weight: 73, daily_calories: 2800, protein: 180, carbs: 320, fats: 80, water: 3.5, compliance_score: 9 },
    ]
  },
  '2': {
    athlete_id: '2',
    athlete_name: 'Ahmed Al-Saeed',
    sport: 'football',
    squad: 'first_team',
    records: [
      { id: '2a', date: '2024-10-14', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 68, target_weight: 72, daily_calories: 3000, protein: 190, carbs: 360, fats: 85, water: 3.8, compliance_score: 8 },
      { id: '2b', date: '2024-11-14', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 69, target_weight: 72, daily_calories: 3100, protein: 195, carbs: 370, fats: 88, water: 3.9, compliance_score: 8 },
      { id: '2c', date: '2024-12-14', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 69.5, target_weight: 72, daily_calories: 3150, protein: 198, carbs: 375, fats: 89, water: 4.0, compliance_score: 9 },
      { id: '2d', date: '2025-01-14', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 70, target_weight: 72, daily_calories: 3200, protein: 200, carbs: 380, fats: 90, water: 4.0, compliance_score: 9 },
    ]
  },
  '3': {
    athlete_id: '3',
    athlete_name: 'Khalid Al-Mohammadi',
    sport: 'football',
    squad: 'first_team',
    records: [
      { id: '3a', date: '2024-10-10', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 79, target_weight: 78, daily_calories: 2600, protein: 165, carbs: 290, fats: 72, water: 3.2, compliance_score: 8 },
      { id: '3b', date: '2024-11-10', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 79.5, target_weight: 78, daily_calories: 2550, protein: 163, carbs: 285, fats: 71, water: 3.1, compliance_score: 7 },
      { id: '3c', date: '2024-12-10', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 80, target_weight: 78, daily_calories: 2500, protein: 160, carbs: 280, fats: 70, water: 3.0, compliance_score: 6 },
      { id: '3d', date: '2025-01-10', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 80, target_weight: 78, daily_calories: 2500, protein: 160, carbs: 280, fats: 70, water: 3.0, compliance_score: 6 },
    ]
  },
  '4': {
    athlete_id: '4',
    athlete_name: 'Saad Al-Dosari',
    sport: 'football',
    squad: 'u21',
    records: [
      { id: '4a', date: '2024-11-20', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 72, target_weight: 72, daily_calories: 2900, protein: 175, carbs: 340, fats: 82, water: 3.5, compliance_score: 8 },
      { id: '4b', date: '2024-12-20', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 72.5, target_weight: 72, daily_calories: 2850, protein: 173, carbs: 335, fats: 80, water: 3.5, compliance_score: 8 },
      { id: '4c', date: '2025-01-20', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 72, target_weight: 72, daily_calories: 2900, protein: 175, carbs: 340, fats: 82, water: 3.6, compliance_score: 9 },
    ]
  },
  '5': {
    athlete_id: '5',
    athlete_name: 'Fahad Al-Otaibi',
    sport: 'football',
    squad: 'first_team',
    records: [
      { id: '5a', date: '2024-10-18', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 85, target_weight: 80, daily_calories: 2400, protein: 150, carbs: 260, fats: 65, water: 2.8, compliance_score: 5 },
      { id: '5b', date: '2024-11-18', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 83, target_weight: 80, daily_calories: 2450, protein: 155, carbs: 270, fats: 68, water: 3.0, compliance_score: 6 },
      { id: '5c', date: '2024-12-18', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 81, target_weight: 80, daily_calories: 2500, protein: 160, carbs: 280, fats: 70, water: 3.2, compliance_score: 7 },
      { id: '5d', date: '2025-01-18', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 79.5, target_weight: 80, daily_calories: 2600, protein: 165, carbs: 290, fats: 72, water: 3.4, compliance_score: 8 },
    ]
  },
  '6': {
    athlete_id: '6',
    athlete_name: 'Nasser Al-Ghamdi',
    sport: 'basketball',
    squad: 'first_team',
    records: [
      { id: '6a', date: '2024-11-10', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 92, target_weight: 90, daily_calories: 3200, protein: 200, carbs: 380, fats: 95, water: 4.0, compliance_score: 7 },
      { id: '6b', date: '2024-12-10', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 91, target_weight: 90, daily_calories: 3150, protein: 198, carbs: 375, fats: 93, water: 4.0, compliance_score: 8 },
      { id: '6c', date: '2025-01-10', doctor_name: 'Dr. Sarah Al-Tamimi', current_weight: 90, target_weight: 90, daily_calories: 3100, protein: 195, carbs: 370, fats: 90, water: 4.2, compliance_score: 9 },
    ]
  },
}

// Process data for table display (will be filtered by permissions)
const processAllAthletes = () => Object.values(athleteNutritionHistory).map(athlete => {
  const latestRecord = athlete.records[athlete.records.length - 1]
  const scores = athlete.records.map(r => r.compliance_score)
  const trend = calculateTrend(scores)

  // Calculate weight progress
  const firstWeight = athlete.records[0].current_weight
  const currentWeight = latestRecord.current_weight
  const targetWeight = latestRecord.target_weight
  const weightChange = currentWeight - firstWeight
  const onTarget = Math.abs(currentWeight - targetWeight) <= 1

  return {
    ...latestRecord,
    athlete_id: athlete.athlete_id,
    athlete_name: athlete.athlete_name,
    sport: athlete.sport,
    squad: athlete.squad,
    trend,
    weightChange,
    onTarget,
    history: athlete.records.map(r => ({
      id: r.id,
      date: r.date,
      score: r.compliance_score,
      details: {
        weight: `${r.current_weight}kg`,
        target: `${r.target_weight}kg`,
        calories: `${r.daily_calories}kcal`,
        protein: `${r.protein}g`,
        carbs: `${r.carbs}g`,
        water: `${r.water}L`
      }
    })) as SimpleRecordEntry[]
  }
})

const allProcessedAthletes = processAllAthletes()

type ProcessedAthlete = typeof allProcessedAthletes[0]

type NutritionRecord = typeof athleteNutritionHistory['1']['records'][0]

export default function NutritionPage() {
  const { currentUser, filterAthletes, hasFullAccess, isLoading: userLoading } = useUser()
  const [showAddModal, setShowAddModal] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [selectedAthleteHistory, setSelectedAthleteHistory] = useState<string | null>(null)
  const [editingRecord, setEditingRecord] = useState<{ athleteId: string; record: NutritionRecord } | null>(null)

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

  const handleEdit = (athleteId: string, record: NutritionRecord) => {
    setEditingRecord({ athleteId, record })
  }

  const handleSaveEdit = (data: Record<string, any>) => {
    if (!editingRecord) return

    const { athleteId, record } = editingRecord
    const athleteData = athleteNutritionHistory[athleteId]
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
    const avgCalories = Math.round(processedAthletes.reduce((acc, a) => acc + a.daily_calories, 0) / processedAthletes.length)
    const avgProtein = Math.round(processedAthletes.reduce((acc, a) => acc + a.protein, 0) / processedAthletes.length)
    const avgWater = (processedAthletes.reduce((acc, a) => acc + a.water, 0) / processedAthletes.length).toFixed(1)
    const onTargetCount = processedAthletes.filter(a => a.onTarget).length
    const improving = processedAthletes.filter(a => a.trend.direction === 'up').length

    return { totalRecords, avgCalories, avgProtein, avgWater, onTargetCount, improving }
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
      key: 'date',
      header: 'Latest Update',
      sortable: true,
      render: (record: ProcessedAthlete) => (
        <span style={{ color: 'var(--foreground)' }}>
          {new Date(record.date).toLocaleDateString('en-US')}
        </span>
      ),
    },
    {
      key: 'current_weight',
      header: 'Weight',
      render: (record: ProcessedAthlete) => (
        <div className="flex items-center gap-2">
          <Scale size={16} style={{ color: 'var(--muted-foreground)' }} />
          <span style={{ color: 'var(--foreground)' }}>{record.current_weight} kg</span>
          {record.weightChange !== 0 && (
            <span className={`text-xs ${record.weightChange < 0 ? 'text-green-500' : 'text-orange-500'}`}>
              ({record.weightChange > 0 ? '+' : ''}{record.weightChange.toFixed(1)})
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'target_weight',
      header: 'Target',
      render: (record: ProcessedAthlete) => (
        <span className={record.onTarget ? 'text-green-500' : 'text-orange-500'}>
          {record.target_weight} kg
          {record.onTarget && <span className="ml-1 text-xs">(✓)</span>}
        </span>
      ),
    },
    {
      key: 'daily_calories',
      header: 'Calories',
      render: (record: ProcessedAthlete) => (
        <span style={{ color: 'var(--foreground)' }}>{record.daily_calories.toLocaleString()} kcal</span>
      ),
    },
    {
      key: 'protein',
      header: 'Protein',
      render: (record: ProcessedAthlete) => (
        <div className="flex items-center gap-1">
          <Beef size={14} className="text-red-500" />
          <span style={{ color: 'var(--foreground)' }}>{record.protein}g</span>
        </div>
      ),
    },
    {
      key: 'water',
      header: 'Water',
      render: (record: ProcessedAthlete) => (
        <div className="flex items-center gap-1">
          <Droplet size={14} className="text-blue-500" />
          <span style={{ color: 'var(--foreground)' }}>{record.water}L</span>
        </div>
      ),
    },
    {
      key: 'compliance',
      header: 'Compliance',
      render: (record: ProcessedAthlete) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-4 rounded-sm ${
                i < record.compliance_score ? 'bg-[#FFD700]' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
          <span className="ml-2 font-bold text-[#FFD700]">{record.compliance_score}/10</span>
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
              const latestRecord = athleteNutritionHistory[record.athlete_id]?.records.slice(-1)[0]
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

    const athleteData = athleteNutritionHistory[record.athlete_id]
    if (!athleteData) return null

    return (
      <tr>
        <td colSpan={columns.length} className="p-0">
          <div className="p-4 border-t" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h4 className="font-semibold mb-3 text-[#FFD700]">Nutrition History for {record.athlete_name}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Date</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Weight</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Target</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Calories</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Protein</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Carbs</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Water</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Compliance</th>
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
                        {new Date(rec.date).toLocaleDateString('en-US')}
                        {idx === 0 && <span className="ml-2 text-xs text-[#FFD700]">(Latest)</span>}
                      </td>
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>{rec.current_weight} kg</td>
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>{rec.target_weight} kg</td>
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>{rec.daily_calories} kcal</td>
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>{rec.protein}g</td>
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>{rec.carbs}g</td>
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>{rec.water}L</td>
                      <td className="px-4 py-2">
                        <span className="font-bold text-[#FFD700]">{rec.compliance_score}/10</span>
                      </td>
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
        title="Nutrition"
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
                Viewing nutrition plans based on your permissions
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
              <Utensils className="text-[#FFD700]" size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Calories</p>
                <p className="text-3xl font-bold text-orange-500">{stats.avgCalories}</p>
              </div>
              <Apple className="text-orange-500" size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Protein</p>
                <p className="text-3xl font-bold text-red-500">{stats.avgProtein}g</p>
              </div>
              <Beef className="text-red-500" size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Water</p>
                <p className="text-3xl font-bold text-blue-500">{stats.avgWater}L</p>
              </div>
              <Droplet className="text-blue-500" size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>On Target</p>
                <p className="text-3xl font-bold text-green-500">{stats.onTargetCount}</p>
              </div>
              <Scale className="text-green-500" size={28} />
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
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Nutrition Plans</h2>
            <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>Track athlete nutrition with historical trends</p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus size={20} />}
            onClick={() => setShowAddModal(true)}
          >
            Add New Plan
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

      {/* History Modal */}
      {selectedAthleteHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#FFD700]">
                Nutrition History - {athleteNutritionHistory[selectedAthleteHistory]?.athlete_name}
              </h2>
              <button
                onClick={() => setSelectedAthleteHistory(null)}
                className="p-2 hover:bg-[#FFD700]/20 rounded-lg transition-colors"
              >
                <span style={{ color: 'var(--foreground)' }}>✕</span>
              </button>
            </div>

            {athleteNutritionHistory[selectedAthleteHistory] && (
              <RecordHistory
                title="Nutrition Compliance"
                records={athleteNutritionHistory[selectedAthleteHistory].records.map(r => ({
                  id: r.id,
                  date: r.date,
                  score: r.compliance_score,
                  details: {
                    weight: `${r.current_weight}kg`,
                    target: `${r.target_weight}kg`,
                    calories: `${r.daily_calories}kcal`,
                    protein: `${r.protein}g`,
                    carbs: `${r.carbs}g`,
                    water: `${r.water}L`
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
        title={`Edit Nutrition Plan - ${editingRecord ? athleteNutritionHistory[editingRecord.athleteId]?.athlete_name : ''}`}
        fields={nutritionFields}
        initialData={editingRecord?.record || {}}
      />

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Add New Nutrition Plan</h2>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Athlete
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]" style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    <option value="">Select Athlete</option>
                    {Object.values(athleteNutritionHistory).map(a => (
                      <option key={a.athlete_id} value={a.athlete_id}>{a.athlete_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Current Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder="75"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Target Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder="73"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Daily Calories
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder="2800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder="180"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Carbohydrates (g)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder="320"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Water (L)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder="3.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Compliance Score (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder="8"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Meal Plan Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  placeholder="Additional notes about the meal plan..."
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
