'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/ui/Header'
import Button from '@/components/ui/Button'
import TrendIndicator, { TrendArrow } from '@/components/ui/TrendIndicator'
import RecordHistory from '@/components/ui/RecordHistory'
import { Plus, Stethoscope, FileText, Droplet, History, ChevronDown, ChevronUp, TrendingUp, HeartPulse, Activity, Pencil, ShieldAlert } from 'lucide-react'
import EditModal, { FieldConfig } from '@/components/ui/EditModal'
import { calculateTrend, type SimpleRecordEntry, ROLE_DISPLAY_NAMES } from '@/types/database'
import { useUser } from '@/context/UserContext'

// Fields configuration for EditModal
const clinicFields: FieldConfig[] = [
  { key: 'date', label: 'Date', type: 'date', required: true },
  { key: 'checkup_type', label: 'Checkup Type', type: 'select', required: true, options: [
    { value: 'Routine', label: 'Routine' },
    { value: 'Injury Follow-up', label: 'Injury Follow-up' },
    { value: 'Asthma Review', label: 'Asthma Review' },
    { value: 'Pre-Season', label: 'Pre-Season' },
    { value: 'Post-Season', label: 'Post-Season' },
  ]},
  { key: 'blood_pressure', label: 'Blood Pressure', type: 'text', placeholder: '120/80', required: true },
  { key: 'heart_rate', label: 'Heart Rate (bpm)', type: 'number', required: true },
  { key: 'status', label: 'Status', type: 'select', required: true, options: [
    { value: 'Completed', label: 'Completed' },
    { value: 'Follow-up', label: 'Follow-up' },
    { value: 'Pending', label: 'Pending' },
  ]},
  { key: 'health_score', label: 'Health Score', type: 'rating', min: 1, max: 10, required: true },
  { key: 'notes', label: 'Notes', type: 'textarea' },
]

// Extended mock data with historical records per athlete
// Including sport and squad for permission filtering
let athleteMedicalHistory: Record<string, {
  athlete_id: string
  athlete_name: string
  sport: string
  squad: string
  blood_type: string
  allergy: string
  records: Array<{
    id: string
    date: string
    doctor_name: string
    checkup_type: string
    blood_pressure: string
    heart_rate: number
    medical_history: string
    status: 'Completed' | 'Follow-up' | 'Pending'
    health_score: number // 1-10 overall health assessment
    notes: string
  }>
}> = {
  '1': {
    athlete_id: '1',
    athlete_name: 'Mohammed Al-Omari',
    sport: 'football',
    squad: 'first_team',
    blood_type: 'O+',
    allergy: 'None',
    records: [
      { id: '1a', date: '2024-10-15', doctor_name: 'Dr. Ahmed Al-Fahad', checkup_type: 'Routine', blood_pressure: '125/82', heart_rate: 68, medical_history: 'None', status: 'Completed', health_score: 8, notes: 'Good overall health' },
      { id: '1b', date: '2024-11-15', doctor_name: 'Dr. Ahmed Al-Fahad', checkup_type: 'Routine', blood_pressure: '122/80', heart_rate: 66, medical_history: 'None', status: 'Completed', health_score: 8, notes: 'Slight improvement in cardiovascular health' },
      { id: '1c', date: '2024-12-15', doctor_name: 'Dr. Ahmed Al-Fahad', checkup_type: 'Routine', blood_pressure: '120/78', heart_rate: 64, medical_history: 'None', status: 'Completed', health_score: 9, notes: 'Excellent health markers' },
      { id: '1d', date: '2025-01-15', doctor_name: 'Dr. Ahmed Al-Fahad', checkup_type: 'Routine', blood_pressure: '118/76', heart_rate: 62, medical_history: 'None', status: 'Completed', health_score: 9, notes: 'Maintaining excellent health' },
    ]
  },
  '2': {
    athlete_id: '2',
    athlete_name: 'Ahmed Al-Saeed',
    sport: 'football',
    squad: 'first_team',
    blood_type: 'A+',
    allergy: 'Penicillin',
    records: [
      { id: '2a', date: '2024-10-14', doctor_name: 'Dr. Ahmed Al-Fahad', checkup_type: 'Routine', blood_pressure: '120/80', heart_rate: 60, medical_history: 'Previous knee injury', status: 'Completed', health_score: 8, notes: 'Knee fully recovered' },
      { id: '2b', date: '2024-11-14', doctor_name: 'Dr. Ahmed Al-Fahad', checkup_type: 'Routine', blood_pressure: '118/78', heart_rate: 58, medical_history: 'Previous knee injury', status: 'Completed', health_score: 9, notes: 'Excellent cardiovascular health' },
      { id: '2c', date: '2024-12-14', doctor_name: 'Dr. Ahmed Al-Fahad', checkup_type: 'Injury Follow-up', blood_pressure: '122/80', heart_rate: 60, medical_history: 'Previous knee injury', status: 'Follow-up', health_score: 8, notes: 'Minor knee discomfort, monitoring' },
      { id: '2d', date: '2025-01-14', doctor_name: 'Dr. Ahmed Al-Fahad', checkup_type: 'Routine', blood_pressure: '118/78', heart_rate: 58, medical_history: 'Previous knee injury', status: 'Completed', health_score: 9, notes: 'Knee discomfort resolved' },
    ]
  },
  '3': {
    athlete_id: '3',
    athlete_name: 'Khalid Al-Mohammadi',
    sport: 'football',
    squad: 'first_team',
    blood_type: 'B+',
    allergy: 'None',
    records: [
      { id: '3a', date: '2024-10-10', doctor_name: 'Dr. Saud Al-Malki', checkup_type: 'Routine', blood_pressure: '130/85', heart_rate: 72, medical_history: 'Mild asthma', status: 'Completed', health_score: 7, notes: 'Asthma well controlled' },
      { id: '3b', date: '2024-11-10', doctor_name: 'Dr. Saud Al-Malki', checkup_type: 'Asthma Review', blood_pressure: '128/84', heart_rate: 70, medical_history: 'Mild asthma', status: 'Completed', health_score: 7, notes: 'Stable condition' },
      { id: '3c', date: '2024-12-10', doctor_name: 'Dr. Saud Al-Malki', checkup_type: 'Routine', blood_pressure: '132/86', heart_rate: 74, medical_history: 'Mild asthma', status: 'Follow-up', health_score: 6, notes: 'Slight increase in BP, needs monitoring' },
      { id: '3d', date: '2025-01-10', doctor_name: 'Dr. Saud Al-Malki', checkup_type: 'Follow-up', blood_pressure: '128/84', heart_rate: 72, medical_history: 'Mild asthma', status: 'Follow-up', health_score: 7, notes: 'BP improved, continue monitoring' },
    ]
  },
  '4': {
    athlete_id: '4',
    athlete_name: 'Saad Al-Dosari',
    sport: 'football',
    squad: 'u21',
    blood_type: 'AB+',
    allergy: 'None',
    records: [
      { id: '4a', date: '2024-11-20', doctor_name: 'Dr. Ahmed Al-Fahad', checkup_type: 'Routine', blood_pressure: '122/80', heart_rate: 66, medical_history: 'None', status: 'Completed', health_score: 8, notes: 'Good health' },
      { id: '4b', date: '2024-12-20', doctor_name: 'Dr. Ahmed Al-Fahad', checkup_type: 'Routine', blood_pressure: '120/78', heart_rate: 64, medical_history: 'None', status: 'Completed', health_score: 8, notes: 'Maintaining good health' },
      { id: '4c', date: '2025-01-20', doctor_name: 'Dr. Ahmed Al-Fahad', checkup_type: 'Routine', blood_pressure: '118/76', heart_rate: 62, medical_history: 'None', status: 'Completed', health_score: 9, notes: 'Health improving' },
    ]
  },
  '5': {
    athlete_id: '5',
    athlete_name: 'Fahad Al-Otaibi',
    sport: 'football',
    squad: 'first_team',
    blood_type: 'O-',
    allergy: 'Sulfa drugs',
    records: [
      { id: '5a', date: '2024-10-18', doctor_name: 'Dr. Saud Al-Malki', checkup_type: 'Routine', blood_pressure: '135/88', heart_rate: 76, medical_history: 'Obesity risk', status: 'Follow-up', health_score: 5, notes: 'Weight management plan initiated' },
      { id: '5b', date: '2024-11-18', doctor_name: 'Dr. Saud Al-Malki', checkup_type: 'Follow-up', blood_pressure: '132/86', heart_rate: 74, medical_history: 'Obesity risk', status: 'Follow-up', health_score: 6, notes: 'Weight reducing, BP improving' },
      { id: '5c', date: '2024-12-18', doctor_name: 'Dr. Saud Al-Malki', checkup_type: 'Follow-up', blood_pressure: '128/84', heart_rate: 70, medical_history: 'Previously obese', status: 'Completed', health_score: 7, notes: 'Significant improvement' },
      { id: '5d', date: '2025-01-18', doctor_name: 'Dr. Saud Al-Malki', checkup_type: 'Routine', blood_pressure: '124/82', heart_rate: 68, medical_history: 'Previously obese', status: 'Completed', health_score: 8, notes: 'Excellent progress, maintain lifestyle' },
    ]
  },
  '9': {
    athlete_id: '9',
    athlete_name: 'Nasser Al-Ghamdi',
    sport: 'basketball',
    squad: 'first_team',
    blood_type: 'A+',
    allergy: 'None',
    records: [
      { id: '9a', date: '2024-12-10', doctor_name: 'Dr. Ahmed Al-Fahad', checkup_type: 'Routine', blood_pressure: '120/80', heart_rate: 65, medical_history: 'None', status: 'Completed', health_score: 8, notes: 'Good health' },
      { id: '9b', date: '2025-01-10', doctor_name: 'Dr. Ahmed Al-Fahad', checkup_type: 'Routine', blood_pressure: '118/78', heart_rate: 62, medical_history: 'None', status: 'Completed', health_score: 9, notes: 'Excellent health' },
    ]
  },
}

// Process data for table display (will be filtered by permissions)
const processAllAthletes = () => Object.values(athleteMedicalHistory).map(athlete => {
  const latestRecord = athlete.records[athlete.records.length - 1]
  const scores = athlete.records.map(r => r.health_score)
  const trend = calculateTrend(scores)

  return {
    ...latestRecord,
    athlete_id: athlete.athlete_id,
    athlete_name: athlete.athlete_name,
    sport: athlete.sport,
    squad: athlete.squad,
    blood_type: athlete.blood_type,
    allergy: athlete.allergy,
    trend,
    history: athlete.records.map(r => ({
      id: r.id,
      date: r.date,
      score: r.health_score,
      details: {
        type: r.checkup_type,
        bp: r.blood_pressure,
        heart_rate: `${r.heart_rate} bpm`,
        status: r.status,
        notes: r.notes
      }
    })) as SimpleRecordEntry[]
  }
})

const allProcessedAthletes = processAllAthletes()

type ProcessedAthlete = typeof allProcessedAthletes[0]

type MedicalRecord = typeof athleteMedicalHistory['1']['records'][0]

export default function ClinicsPage() {
  const { currentUser, filterAthletes, hasFullAccess, isLoading: userLoading } = useUser()
  const [showAddModal, setShowAddModal] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [selectedAthleteHistory, setSelectedAthleteHistory] = useState<string | null>(null)
  const [editingRecord, setEditingRecord] = useState<{ athleteId: string; record: MedicalRecord } | null>(null)

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

  const handleEdit = (athleteId: string, record: MedicalRecord) => {
    setEditingRecord({ athleteId, record })
  }

  const handleSaveEdit = (data: Record<string, any>) => {
    if (!editingRecord) return

    const { athleteId, record } = editingRecord
    const athleteData = athleteMedicalHistory[athleteId]
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
    const completed = processedAthletes.filter(a => a.status === 'Completed').length
    const followUp = processedAthletes.filter(a => a.status === 'Follow-up').length
    const avgHealth = (processedAthletes.reduce((acc, a) => acc + a.health_score, 0) / processedAthletes.length).toFixed(1)
    const improving = processedAthletes.filter(a => a.trend.direction === 'up').length
    const declining = processedAthletes.filter(a => a.trend.direction === 'down').length

    return { totalRecords, completed, followUp, avgHealth, improving, declining }
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
      header: 'Last Checkup',
      sortable: true,
      render: (record: ProcessedAthlete) => (
        <span style={{ color: 'var(--foreground)' }}>
          {new Date(record.date).toLocaleDateString('en-US')}
        </span>
      ),
    },
    {
      key: 'blood_type',
      header: 'Blood Type',
      render: (record: ProcessedAthlete) => (
        <div className="flex items-center gap-2">
          <Droplet size={16} className="text-red-500" />
          <span className="font-bold" style={{ color: 'var(--foreground)' }}>{record.blood_type}</span>
        </div>
      ),
    },
    {
      key: 'blood_pressure',
      header: 'Blood Pressure',
      render: (record: ProcessedAthlete) => (
        <div className="flex items-center gap-2">
          <HeartPulse size={16} className="text-pink-500" />
          <span style={{ color: 'var(--foreground)' }}>{record.blood_pressure}</span>
        </div>
      ),
    },
    {
      key: 'heart_rate',
      header: 'Heart Rate',
      render: (record: ProcessedAthlete) => (
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-red-500" />
          <span style={{ color: 'var(--foreground)' }}>{record.heart_rate} bpm</span>
        </div>
      ),
    },
    {
      key: 'allergy',
      header: 'Allergies',
      render: (record: ProcessedAthlete) => (
        <span className={record.allergy !== 'None' ? 'text-orange-500 font-medium' : ''} style={{ color: record.allergy === 'None' ? 'var(--muted-foreground)' : undefined }}>
          {record.allergy}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (record: ProcessedAthlete) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            record.status === 'Completed'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : record.status === 'Follow-up'
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          }`}
        >
          {record.status}
        </span>
      ),
    },
    {
      key: 'health_score',
      header: 'Health Score',
      render: (record: ProcessedAthlete) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-4 rounded-sm ${
                i < record.health_score ? 'bg-[#FFD700]' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
          <span className="ml-2 font-bold text-[#FFD700]">{record.health_score}/10</span>
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
              const latestRecord = athleteMedicalHistory[record.athlete_id]?.records.slice(-1)[0]
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

    const athleteData = athleteMedicalHistory[record.athlete_id]
    if (!athleteData) return null

    return (
      <tr>
        <td colSpan={columns.length} className="p-0">
          <div className="p-4 border-t" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h4 className="font-semibold mb-3 text-[#FFD700]">Medical History for {record.athlete_name}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Date</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Type</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Blood Pressure</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Heart Rate</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Status</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Health Score</th>
                    <th className="px-4 py-2 text-left text-[#FFD700]">Notes</th>
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
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>{rec.checkup_type}</td>
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>{rec.blood_pressure}</td>
                      <td className="px-4 py-2" style={{ color: 'var(--foreground)' }}>{rec.heart_rate} bpm</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            rec.status === 'Completed'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="font-bold text-[#FFD700]">{rec.health_score}/10</span>
                      </td>
                      <td className="px-4 py-2 max-w-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{rec.notes}</td>
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
        title="Medical Clinic"
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
                Viewing medical records based on your permissions
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
              <Stethoscope className="text-[#FFD700]" size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Completed</p>
                <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
              </div>
              <FileText className="text-green-500" size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Follow-up</p>
                <p className="text-3xl font-bold text-yellow-500">{stats.followUp}</p>
              </div>
              <FileText className="text-yellow-500" size={28} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Health</p>
                <p className="text-3xl font-bold text-[#FFD700]">{stats.avgHealth}/10</p>
              </div>
              <HeartPulse className="text-[#FFD700]" size={28} />
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
            <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Medical Records</h2>
            <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>Track athlete medical checkups with historical trends</p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus size={20} />}
            onClick={() => setShowAddModal(true)}
          >
            Add New Checkup
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
                Medical History - {athleteMedicalHistory[selectedAthleteHistory]?.athlete_name}
              </h2>
              <button
                onClick={() => setSelectedAthleteHistory(null)}
                className="p-2 hover:bg-[#FFD700]/20 rounded-lg transition-colors"
              >
                <span style={{ color: 'var(--foreground)' }}>✕</span>
              </button>
            </div>

            {athleteMedicalHistory[selectedAthleteHistory] && (
              <RecordHistory
                title="Health Assessments"
                records={athleteMedicalHistory[selectedAthleteHistory].records.map(r => ({
                  id: r.id,
                  date: r.date,
                  score: r.health_score,
                  details: {
                    type: r.checkup_type,
                    bp: r.blood_pressure,
                    heart_rate: `${r.heart_rate} bpm`,
                    status: r.status,
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
        title={`Edit Medical Record - ${editingRecord ? athleteMedicalHistory[editingRecord.athleteId]?.athlete_name : ''}`}
        fields={clinicFields}
        initialData={editingRecord?.record || {}}
      />

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Add New Medical Checkup</h2>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Athlete
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]" style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    <option value="">Select Athlete</option>
                    {Object.values(athleteMedicalHistory).map(a => (
                      <option key={a.athlete_id} value={a.athlete_id}>{a.athlete_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Checkup Type
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]" style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    <option value="">Select Type</option>
                    <option value="routine">Routine</option>
                    <option value="injury">Injury Follow-up</option>
                    <option value="pre_season">Pre-Season</option>
                    <option value="post_season">Post-Season</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    placeholder="65"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Health Score (1-10)
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
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                    Status
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]" style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                    <option value="completed">Completed</option>
                    <option value="follow_up">Follow-up Required</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700]"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  placeholder="Enter checkup notes..."
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
