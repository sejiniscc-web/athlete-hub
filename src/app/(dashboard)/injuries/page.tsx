'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/ui/Header'
import { Siren, Plus, AlertTriangle, CheckCircle, Clock, Pencil, ShieldAlert } from 'lucide-react'
import Button from '@/components/ui/Button'
import EditModal, { FieldConfig } from '@/components/ui/EditModal'
import { ROLE_DISPLAY_NAMES } from '@/types/database'
import { useUser } from '@/context/UserContext'

// Mock athletes data with sport and squad for filtering
const allAthletes = [
  { id: '1', full_name: 'Mohammed Al-Omari', sport: 'football', squad: 'first_team' },
  { id: '2', full_name: 'Ahmed Al-Saeed', sport: 'football', squad: 'first_team' },
  { id: '3', full_name: 'Khalid Al-Mohammadi', sport: 'football', squad: 'first_team' },
  { id: '4', full_name: 'Saad Al-Dosari', sport: 'football', squad: 'u21' },
  { id: '5', full_name: 'Fahad Al-Otaibi', sport: 'football', squad: 'first_team' },
  { id: '6', full_name: 'Omar Al-Qahtani', sport: 'football', squad: 'first_team' },
  { id: '7', full_name: 'Yasser Al-Harbi', sport: 'football', squad: 'u21' },
  { id: '8', full_name: 'Faisal Al-Rashid', sport: 'football', squad: 'reserve' },
  { id: '9', full_name: 'Nasser Al-Ghamdi', sport: 'basketball', squad: 'first_team' },
  { id: '10', full_name: 'Rayan Al-Shammari', sport: 'basketball', squad: 'u21' },
  { id: '11', full_name: 'Hassan Al-Zahrani', sport: 'volleyball', squad: 'first_team' },
]

// Initial injuries data with sport and squad for filtering
const initialInjuries = [
  {
    id: '1',
    athlete_id: '3',
    athlete_name: 'Khalid Al-Mohammadi',
    sport: 'football',
    squad: 'first_team',
    injury_date: '2025-01-05',
    injury_type: 'Hamstring Strain',
    severity: 'Moderate',
    status: 'In Recovery',
    expected_return: '2025-02-01',
    doctor: 'Dr. Ahmed Al-Fahad'
  },
  {
    id: '2',
    athlete_id: '1',
    athlete_name: 'Mohammed Al-Omari',
    sport: 'football',
    squad: 'first_team',
    injury_date: '2024-12-15',
    injury_type: 'Ankle Sprain',
    severity: 'Minor',
    status: 'Recovered',
    expected_return: '2025-01-10',
    doctor: 'Dr. Ahmed Al-Fahad'
  },
  {
    id: '3',
    athlete_id: '2',
    athlete_name: 'Ahmed Al-Saeed',
    sport: 'football',
    squad: 'first_team',
    injury_date: '2025-01-18',
    injury_type: 'Muscle Fatigue',
    severity: 'Minor',
    status: 'Under Treatment',
    expected_return: '2025-01-25',
    doctor: 'Dr. Saud Al-Malki'
  },
  {
    id: '4',
    athlete_id: '9',
    athlete_name: 'Nasser Al-Ghamdi',
    sport: 'basketball',
    squad: 'first_team',
    injury_date: '2025-01-10',
    injury_type: 'Knee Contusion',
    severity: 'Minor',
    status: 'Recovered',
    expected_return: '2025-01-20',
    doctor: 'Dr. Ahmed Al-Fahad'
  }
]

export default function InjuriesPage() {
  const { currentUser, filterAthletes, hasFullAccess, isLoading: userLoading } = useUser()
  const [injuries, setInjuries] = useState(initialInjuries)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<typeof initialInjuries[0] | null>(null)

  // Filter athletes based on user permissions
  const accessibleAthletes = useMemo(() => {
    return filterAthletes(allAthletes)
  }, [filterAthletes])

  // Filter injuries based on user permissions
  const accessibleInjuries = useMemo(() => {
    return filterAthletes(injuries)
  }, [injuries, filterAthletes])

  // Build injury fields dynamically with athlete dropdown
  const injuryFields: FieldConfig[] = useMemo(() => [
    {
      key: 'athlete_id',
      label: 'Athlete Name',
      type: 'select',
      required: true,
      options: accessibleAthletes.map(athlete => ({
        value: athlete.id,
        label: athlete.full_name
      }))
    },
    { key: 'injury_date', label: 'Injury Date', type: 'date', required: true },
    { key: 'injury_type', label: 'Injury Type', type: 'text', required: true, placeholder: 'e.g., Hamstring Strain' },
    {
      key: 'severity',
      label: 'Severity',
      type: 'select',
      required: true,
      options: [
        { value: 'Minor', label: 'Minor' },
        { value: 'Moderate', label: 'Moderate' },
        { value: 'Severe', label: 'Severe' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'Under Treatment', label: 'Under Treatment' },
        { value: 'In Recovery', label: 'In Recovery' },
        { value: 'Recovered', label: 'Recovered' }
      ]
    },
    { key: 'expected_return', label: 'Expected Return', type: 'date', required: true },
    { key: 'doctor', label: 'Doctor', type: 'text', required: true }
  ], [accessibleAthletes])

  const activeInjuries = accessibleInjuries.filter(i => i.status !== 'Recovered').length
  const recoveredThisMonth = accessibleInjuries.filter(i => i.status === 'Recovered').length

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Minor': return 'bg-yellow-500/20 text-yellow-500'
      case 'Moderate': return 'bg-orange-500/20 text-orange-500'
      case 'Severe': return 'bg-red-500/20 text-red-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recovered': return 'bg-green-500/20 text-green-500'
      case 'In Recovery': return 'bg-blue-500/20 text-blue-500'
      case 'Under Treatment': return 'bg-orange-500/20 text-orange-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  const handleSaveEdit = (data: Record<string, any>) => {
    // Get athlete info from selected athlete
    const selectedAthlete = allAthletes.find(a => a.id === data.athlete_id)

    setInjuries(prev => prev.map(injury =>
      injury.id === editingRecord?.id
        ? {
            ...injury,
            ...data,
            athlete_name: selectedAthlete?.full_name || injury.athlete_name,
            sport: selectedAthlete?.sport || injury.sport,
            squad: selectedAthlete?.squad || injury.squad
          }
        : injury
    ))
    setEditingRecord(null)
  }

  const handleAddNew = (data: Record<string, any>) => {
    // Get athlete info from selected athlete
    const selectedAthlete = allAthletes.find(a => a.id === data.athlete_id)

    const newInjury = {
      id: String(Date.now()),
      athlete_id: data.athlete_id,
      athlete_name: selectedAthlete?.full_name || '',
      sport: selectedAthlete?.sport || '',
      squad: selectedAthlete?.squad || '',
      injury_date: data.injury_date,
      injury_type: data.injury_type,
      severity: data.severity,
      status: data.status,
      expected_return: data.expected_return,
      doctor: data.doctor
    }
    setInjuries(prev => [...prev, newInjury])
    setShowAddModal(false)
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
        title="Injuries"
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
                Viewing injury records based on your permissions
              </p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                You have access to {accessibleInjuries.length} of {injuries.length} injury records
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Injury Records</h2>
            <p style={{ color: 'var(--muted-foreground)' }}>Track and manage athlete injuries</p>
          </div>
          <Button variant="primary" className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
            <Plus size={20} />
            Report Injury
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total Records</p>
                <p className="text-3xl font-bold text-[#FFD700]">{accessibleInjuries.length}</p>
              </div>
              <Siren className="text-[#FFD700]" size={32} />
            </div>
          </div>
          <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Active Injuries</p>
                <p className="text-3xl font-bold text-red-500">{activeInjuries}</p>
              </div>
              <AlertTriangle className="text-red-500" size={32} />
            </div>
          </div>
          <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Recovered</p>
                <p className="text-3xl font-bold text-green-500">{recoveredThisMonth}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
          <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>In Recovery</p>
                <p className="text-3xl font-bold text-blue-500">{accessibleInjuries.filter(i => i.status === 'In Recovery').length}</p>
              </div>
              <Clock className="text-blue-500" size={32} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Athlete Name</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Injury Date</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Injury Type</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Severity</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Status</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Expected Return</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Doctor</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accessibleInjuries.map((injury) => (
                  <tr key={injury.id} className="hover:bg-[#FFD700]/5 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-6 py-4 text-base font-medium" style={{ color: 'var(--foreground)' }}>{injury.athlete_name}</td>
                    <td className="px-6 py-4 text-base" style={{ color: 'var(--foreground)' }}>{injury.injury_date}</td>
                    <td className="px-6 py-4 text-base" style={{ color: 'var(--foreground)' }}>{injury.injury_type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(injury.severity)}`}>
                        {injury.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(injury.status)}`}>
                        {injury.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-base" style={{ color: 'var(--foreground)' }}>{injury.expected_return}</td>
                    <td className="px-6 py-4 text-base" style={{ color: 'var(--foreground)' }}>{injury.doctor}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setEditingRecord(injury)}
                        className="p-2 rounded-lg hover:bg-[#FFD700]/20 transition-colors text-[#FFD700]"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {accessibleInjuries.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center" style={{ color: 'var(--muted-foreground)' }}>
                      No injury records found for your assigned athletes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        <EditModal
          isOpen={!!editingRecord}
          onClose={() => setEditingRecord(null)}
          onSave={handleSaveEdit}
          title="Edit Injury Record"
          fields={injuryFields}
          initialData={editingRecord ? { ...editingRecord } : {}}
        />

        {/* Add Modal */}
        <EditModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddNew}
          title="Report New Injury"
          fields={injuryFields}
          initialData={{}}
        />
      </div>
    </div>
  )
}
