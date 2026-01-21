'use client'

import { useState, useMemo, useEffect } from 'react'
import Header from '@/components/ui/Header'
import DataTable from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import StatusBadge from '@/components/ui/StatusBadge'
import StatusFilter, { StatusTabs } from '@/components/ui/StatusFilter'
import { TrendArrow } from '@/components/ui/TrendIndicator'
import EditModal, { FieldConfig } from '@/components/ui/EditModal'
import { Plus, Eye, Edit, Trash2, User, TrendingUp, TrendingDown, Users, AlertTriangle, Activity, Pencil, ShieldAlert } from 'lucide-react'
import { AthleteStatus, ATHLETE_STATUS_CONFIG, TrendDirection, calculateTrend, ROLE_DISPLAY_NAMES } from '@/types/database'
import { getSortedCountries } from '@/data/countries'
import { getActiveSports, getActiveSquads, calculateAge, Sport, Squad } from '@/data/settings'
import { useUser } from '@/context/UserContext'

// Extended athlete data with status, trends, and history
// Sport IDs: football, basketball, volleyball, swimming, handball, athletics, tennis, karate
// Squad IDs: first_team, u21, u18, u15, reserve
const initialAthletes = [
  {
    id: '1',
    full_name: 'Mohammed Al-Omari',
    sport: 'football',
    squad: 'first_team',
    nationality: 'SA',
    date_of_birth: '2001-03-15',
    age: 24,
    height: 180,
    weight: 75,
    jersey_number: 10,
    position: 'Midfielder',
    mobile: '+966 512345678',
    status: 'active' as AthleteStatus,
    fitness_score: 9,
    mental_score: 8,
    overall_trend: 'up' as TrendDirection,
    last_assessment: '2025-01-20',
    score_history: [7.5, 8.0, 8.2, 8.5, 9.0],
  },
  {
    id: '2',
    full_name: 'Ahmed Al-Saeed',
    sport: 'football',
    squad: 'first_team',
    nationality: 'SA',
    date_of_birth: '2003-07-22',
    age: 22,
    height: 175,
    weight: 70,
    jersey_number: 7,
    position: 'Forward',
    mobile: '+966 512345679',
    status: 'active' as AthleteStatus,
    fitness_score: 8,
    mental_score: 9,
    overall_trend: 'stable' as TrendDirection,
    last_assessment: '2025-01-19',
    score_history: [8.0, 8.1, 8.0, 8.2, 8.1],
  },
  {
    id: '3',
    full_name: 'Khalid Al-Mohammadi',
    sport: 'football',
    squad: 'first_team',
    nationality: 'SA',
    date_of_birth: '1999-11-10',
    age: 26,
    height: 185,
    weight: 80,
    jersey_number: 4,
    position: 'Defender',
    mobile: '+966 512345680',
    status: 'injured' as AthleteStatus,
    fitness_score: 6,
    mental_score: 8,
    overall_trend: 'down' as TrendDirection,
    last_assessment: '2025-01-10',
    score_history: [8.5, 8.0, 7.5, 7.0, 6.5],
  },
  {
    id: '4',
    full_name: 'Saad Al-Dosari',
    sport: 'football',
    squad: 'u21',
    nationality: 'SA',
    date_of_birth: '2006-05-08',
    age: 19,
    height: 178,
    weight: 72,
    jersey_number: 22,
    position: 'Midfielder',
    mobile: '+966 512345681',
    status: 'active' as AthleteStatus,
    fitness_score: 8,
    mental_score: 7,
    overall_trend: 'up' as TrendDirection,
    last_assessment: '2025-01-18',
    score_history: [6.5, 7.0, 7.5, 7.8, 8.0],
  },
  {
    id: '5',
    full_name: 'Fahad Al-Otaibi',
    sport: 'football',
    squad: 'first_team',
    nationality: 'SA',
    date_of_birth: '1997-02-28',
    age: 28,
    height: 182,
    weight: 78,
    jersey_number: 9,
    position: 'Forward',
    mobile: '+966 512345682',
    status: 'active' as AthleteStatus,
    fitness_score: 9,
    mental_score: 8,
    overall_trend: 'stable' as TrendDirection,
    last_assessment: '2025-01-20',
    score_history: [8.8, 8.9, 9.0, 8.9, 9.0],
  },
  {
    id: '6',
    full_name: 'Omar Al-Qahtani',
    sport: 'football',
    squad: 'first_team',
    nationality: 'SA',
    date_of_birth: '2000-09-12',
    age: 25,
    height: 179,
    weight: 74,
    jersey_number: 8,
    position: 'Midfielder',
    mobile: '+966 512345683',
    status: 'recovering' as AthleteStatus,
    fitness_score: 7,
    mental_score: 8,
    overall_trend: 'up' as TrendDirection,
    last_assessment: '2025-01-15',
    score_history: [5.0, 5.5, 6.0, 6.5, 7.0],
  },
  {
    id: '7',
    full_name: 'Yasser Al-Harbi',
    sport: 'football',
    squad: 'u21',
    nationality: 'SA',
    date_of_birth: '2005-01-25',
    age: 20,
    height: 183,
    weight: 76,
    jersey_number: 15,
    position: 'Goalkeeper',
    mobile: '+966 512345684',
    status: 'suspended' as AthleteStatus,
    fitness_score: 8,
    mental_score: 6,
    overall_trend: 'down' as TrendDirection,
    last_assessment: '2025-01-05',
    score_history: [8.5, 8.0, 7.5, 7.0, 6.5],
  },
  {
    id: '8',
    full_name: 'Faisal Al-Rashid',
    sport: 'football',
    squad: 'reserve',
    nationality: 'SA',
    date_of_birth: '2002-06-18',
    age: 23,
    height: 177,
    weight: 73,
    jersey_number: 18,
    position: 'Defender',
    mobile: '+966 512345685',
    status: 'on_loan' as AthleteStatus,
    fitness_score: 7,
    mental_score: 7,
    overall_trend: 'stable' as TrendDirection,
    last_assessment: '2024-12-01',
    score_history: [7.0, 7.0, 7.1, 7.0, 7.0],
  },
  // Basketball athletes
  {
    id: '9',
    full_name: 'Nasser Al-Ghamdi',
    sport: 'basketball',
    squad: 'first_team',
    nationality: 'SA',
    date_of_birth: '1998-04-10',
    age: 27,
    height: 195,
    weight: 90,
    jersey_number: 23,
    position: 'Center',
    mobile: '+966 512345686',
    status: 'active' as AthleteStatus,
    fitness_score: 8,
    mental_score: 8,
    overall_trend: 'up' as TrendDirection,
    last_assessment: '2025-01-18',
    score_history: [7.0, 7.5, 8.0, 8.0, 8.5],
  },
  {
    id: '10',
    full_name: 'Rayan Al-Shammari',
    sport: 'basketball',
    squad: 'u21',
    nationality: 'SA',
    date_of_birth: '2004-08-15',
    age: 21,
    height: 188,
    weight: 82,
    jersey_number: 11,
    position: 'Point Guard',
    mobile: '+966 512345687',
    status: 'active' as AthleteStatus,
    fitness_score: 7,
    mental_score: 8,
    overall_trend: 'stable' as TrendDirection,
    last_assessment: '2025-01-17',
    score_history: [7.0, 7.2, 7.1, 7.3, 7.2],
  },
  // Volleyball athletes
  {
    id: '11',
    full_name: 'Hassan Al-Zahrani',
    sport: 'volleyball',
    squad: 'first_team',
    nationality: 'SA',
    date_of_birth: '2000-02-20',
    age: 25,
    height: 192,
    weight: 85,
    jersey_number: 1,
    position: 'Setter',
    mobile: '+966 512345688',
    status: 'active' as AthleteStatus,
    fitness_score: 9,
    mental_score: 9,
    overall_trend: 'up' as TrendDirection,
    last_assessment: '2025-01-19',
    score_history: [8.0, 8.3, 8.5, 8.8, 9.0],
  },
]

type Athlete = typeof initialAthletes[0]

// Helper to get display name for sport/squad
const getSportDisplayName = (sportId: string, sportsList: Sport[]) => {
  const sport = sportsList.find(s => s.id === sportId)
  return sport ? sport.name : sportId.charAt(0).toUpperCase() + sportId.slice(1).replace(/_/g, ' ')
}

const getSquadDisplayName = (squadId: string, squadsList: Squad[]) => {
  const squad = squadsList.find(s => s.id === squadId)
  return squad ? squad.name : squadId.charAt(0).toUpperCase() + squadId.slice(1).replace(/_/g, ' ')
}

export default function AthletesPage() {
  const { currentUser, filterAthletes, hasFullAccess, isLoading: userLoading } = useUser()
  const [athletes, setAthletes] = useState(initialAthletes)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null)
  const [selectedStatuses, setSelectedStatuses] = useState<AthleteStatus[]>([])
  const [activeTab, setActiveTab] = useState<AthleteStatus | 'all'>('all')
  const [sports, setSports] = useState<Sport[]>([])
  const [squads, setSquads] = useState<Squad[]>([])

  // Load sports and squads from settings
  useEffect(() => {
    setSports(getActiveSports())
    setSquads(getActiveSquads())
  }, [])

  // Filter athletes based on user permissions
  const accessibleAthletes = useMemo(() => {
    return filterAthletes(athletes)
  }, [athletes, filterAthletes])

  // Get sorted countries for nationality dropdown
  const countries = getSortedCountries()

  // Filter athletes based on selected statuses (from accessible athletes only)
  const filteredAthletes = useMemo(() => {
    if (activeTab !== 'all') {
      return accessibleAthletes.filter(a => a.status === activeTab)
    }
    if (selectedStatuses.length === 0) return accessibleAthletes
    return accessibleAthletes.filter(a => selectedStatuses.includes(a.status))
  }, [accessibleAthletes, selectedStatuses, activeTab])

  // Calculate status counts (from accessible athletes only)
  const statusCounts = useMemo(() => {
    const counts: Record<AthleteStatus | 'all', number> = {
      all: accessibleAthletes.length,
      active: 0,
      injured: 0,
      recovering: 0,
      suspended: 0,
      on_loan: 0,
      transferred: 0,
      retired: 0,
      released: 0,
      inactive: 0,
    }
    accessibleAthletes.forEach(a => {
      counts[a.status]++
    })
    return counts
  }, [accessibleAthletes])

  // Get country name by code
  const getCountryName = (code: string) => {
    const country = countries.find(c => c.code === code)
    return country ? country.name : code
  }

  // Build athlete form fields
  const athleteFields: FieldConfig[] = useMemo(() => [
    { key: 'full_name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter full name' },
    {
      key: 'nationality',
      label: 'Nationality',
      type: 'select',
      required: true,
      options: countries.map(c => ({ value: c.code, label: `${c.name} - ${c.nameAr}` }))
    },
    { key: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
    { key: 'mobile', label: 'Mobile Number', type: 'text', placeholder: '+966 5xxxxxxxx' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'active', label: 'Active - نشط' },
        { value: 'injured', label: 'Injured - مصاب' },
        { value: 'recovering', label: 'Recovering - في التعافي' },
        { value: 'suspended', label: 'Suspended - موقوف' },
        { value: 'on_loan', label: 'On Loan - معار' },
        { value: 'inactive', label: 'Inactive - غير نشط' },
      ]
    },
    { key: 'position', label: 'Position', type: 'text', placeholder: 'e.g. Midfielder' },
    { key: 'jersey_number', label: 'Jersey Number', type: 'number', placeholder: '10' },
    {
      key: 'sport',
      label: 'Sport',
      type: 'select',
      required: true,
      options: sports.length > 0
        ? sports.map(s => ({ value: s.name, label: `${s.name} - ${s.nameAr}` }))
        : [
            { value: 'Football', label: 'Football - كرة القدم' },
            { value: 'Basketball', label: 'Basketball - كرة السلة' },
            { value: 'Volleyball', label: 'Volleyball - كرة الطائرة' },
          ]
    },
    {
      key: 'squad',
      label: 'Squad',
      type: 'select',
      required: true,
      options: squads.length > 0
        ? squads.map(s => ({ value: s.name, label: `${s.name} - ${s.nameAr}` }))
        : [
            { value: 'First Team', label: 'First Team - الفريق الأول' },
            { value: 'Youth Team', label: 'Youth Team - فريق الشباب' },
            { value: 'Junior Team', label: 'Junior Team - فريق الناشئين' },
            { value: 'Reserve', label: 'Reserve - الاحتياطي' },
          ]
    },
    { key: 'height', label: 'Height (cm)', type: 'number', placeholder: '180' },
    { key: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '75' },
  ], [countries, sports, squads])

  // Handle save edit
  const handleSaveEdit = (data: Record<string, any>) => {
    const age = data.date_of_birth ? calculateAge(data.date_of_birth) : editingAthlete?.age || 0
    setAthletes(prev => prev.map(athlete =>
      athlete.id === editingAthlete?.id
        ? {
            ...athlete,
            ...data,
            age,
            height: Number(data.height) || athlete.height,
            weight: Number(data.weight) || athlete.weight,
            jersey_number: Number(data.jersey_number) || athlete.jersey_number,
          }
        : athlete
    ))
    setEditingAthlete(null)
  }

  // Handle add new
  const handleAddNew = (data: Record<string, any>) => {
    const age = data.date_of_birth ? calculateAge(data.date_of_birth) : 0
    const newAthlete: Athlete = {
      id: String(Date.now()),
      full_name: data.full_name || '',
      sport: data.sport || 'Football',
      squad: data.squad || 'First Team',
      nationality: data.nationality || 'SA',
      date_of_birth: data.date_of_birth || '',
      age,
      height: Number(data.height) || 0,
      weight: Number(data.weight) || 0,
      jersey_number: Number(data.jersey_number) || 0,
      position: data.position || '',
      mobile: data.mobile || '',
      status: (data.status || 'active') as AthleteStatus,
      fitness_score: 5,
      mental_score: 5,
      overall_trend: 'stable' as TrendDirection,
      last_assessment: new Date().toISOString().split('T')[0],
      score_history: [5],
    }
    setAthletes(prev => [...prev, newAthlete])
    setShowAddModal(false)
  }

  // Handle delete
  const handleDelete = (athleteId: string) => {
    if (confirm('Are you sure you want to delete this athlete?')) {
      setAthletes(prev => prev.filter(a => a.id !== athleteId))
    }
  }

  const columns = [
    {
      key: 'full_name',
      header: 'Athlete Name',
      sortable: true,
      render: (athlete: Athlete) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-[#FFD700]/20 rounded-full flex items-center justify-center">
              {athlete.jersey_number ? (
                <span className="font-bold text-[#FFD700]">{athlete.jersey_number}</span>
              ) : (
                <User className="text-[#FFD700]" size={20} />
              )}
            </div>
            {/* Status indicator dot */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                ATHLETE_STATUS_CONFIG[athlete.status].bgColor.replace('/20', '')
              }`}
            />
          </div>
          <div>
            <span className="font-semibold text-base block" style={{ color: 'var(--foreground)' }}>
              {athlete.full_name}
            </span>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {athlete.position}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'sport',
      header: 'Sport',
      sortable: true,
      render: (athlete: Athlete) => getSportDisplayName(athlete.sport, sports),
    },
    {
      key: 'squad',
      header: 'Squad',
      sortable: true,
      render: (athlete: Athlete) => getSquadDisplayName(athlete.squad, squads),
    },
    {
      key: 'nationality',
      header: 'Nationality',
      render: (athlete: Athlete) => getCountryName(athlete.nationality),
    },
    {
      key: 'age',
      header: 'Age',
      sortable: true,
      render: (athlete: Athlete) => (
        <div>
          <span style={{ color: 'var(--foreground)' }}>{athlete.age} yrs</span>
          {athlete.date_of_birth && (
            <span className="text-xs block" style={{ color: 'var(--muted-foreground)' }}>
              {athlete.date_of_birth}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'height',
      header: 'Height',
      render: (athlete: Athlete) => `${athlete.height} cm`,
    },
    {
      key: 'weight',
      header: 'Weight',
      render: (athlete: Athlete) => `${athlete.weight} kg`,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (athlete: Athlete) => <StatusBadge status={athlete.status} size="sm" />,
    },
    {
      key: 'fitness_score',
      header: 'Fitness',
      sortable: true,
      render: (athlete: Athlete) => (
        <div className="flex items-center gap-1">
          <span className={`font-bold ${
            athlete.fitness_score >= 8 ? 'text-green-500' :
            athlete.fitness_score >= 6 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {athlete.fitness_score}/10
          </span>
        </div>
      ),
    },
    {
      key: 'overall_trend',
      header: 'Trend',
      render: (athlete: Athlete) => <TrendArrow direction={athlete.overall_trend} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (athlete: Athlete) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              window.location.href = `/athletes/${athlete.id}`
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors cursor-pointer"
            title="View"
          >
            <Eye size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setEditingAthlete(athlete)
            }}
            className="p-2 text-[#FFD700] hover:bg-[#FFD700]/10 rounded-lg transition-colors cursor-pointer"
            title="Edit"
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleDelete(athlete.id)
            }}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ]

  // Get permission info for display
  const getPermissionInfo = () => {
    if (!currentUser) return { sports: [], squads: [] }
    if (hasFullAccess) {
      return { sports: ['All Sports'], squads: ['All Squads'] }
    }
    const assignedSports = currentUser.assigned_sports || []
    const assignedSquads = currentUser.assigned_squads || []

    const sportNames = assignedSports.includes('all')
      ? ['All Sports']
      : assignedSports.map(id => getSportDisplayName(id, sports))

    const squadNames = assignedSquads.includes('all')
      ? ['All Squads']
      : assignedSquads.map(id => getSquadDisplayName(id, squads))

    return { sports: sportNames, squads: squadNames }
  }

  const permissionInfo = getPermissionInfo()

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
        title="Athletes"
        userName={currentUser?.full_name || 'User'}
        userRole={currentUser ? ROLE_DISPLAY_NAMES[currentUser.role] : 'Unknown'}
      />

      <div className="p-6">
        {/* Permission Info Banner (only show for non-admin users) */}
        {!hasFullAccess && currentUser && (
          <div
            className="mb-6 p-4 rounded-xl flex items-center gap-4"
            style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}
          >
            <ShieldAlert className="text-[#FFD700] flex-shrink-0" size={24} />
            <div className="flex-1">
              <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                Viewing athletes based on your permissions
              </p>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                <span className="font-medium">Sports:</span> {permissionInfo.sports.join(', ') || 'None'} |{' '}
                <span className="font-medium">Squads:</span> {permissionInfo.squads.join(', ') || 'None'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                {accessibleAthletes.length} of {athletes.length} athletes
              </span>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Athletes List</h2>
            <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>
              {hasFullAccess ? 'Manage all athletes in the club' : `Showing ${accessibleAthletes.length} athletes you have access to`}
            </p>
          </div>
          <Button
            variant="primary"
            leftIcon={<Plus size={20} />}
            onClick={() => setShowAddModal(true)}
          >
            Add New Athlete
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total Athletes</p>
                <p className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>{accessibleAthletes.length}</p>
              </div>
              <Users className="text-[#FFD700]" size={32} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Active</p>
                <p className="text-3xl font-bold text-green-500">{statusCounts.active}</p>
              </div>
              <Activity className="text-green-500" size={32} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Injured</p>
                <p className="text-3xl font-bold text-red-500">{statusCounts.injured}</p>
              </div>
              <AlertTriangle className="text-red-500" size={32} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Improving</p>
                <p className="text-3xl font-bold text-green-500">
                  {accessibleAthletes.filter(a => a.overall_trend === 'up').length}
                </p>
              </div>
              <TrendingUp className="text-green-500" size={32} />
            </div>
          </div>
          <div className="p-5 rounded-xl shadow-lg transition-colors" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Declining</p>
                <p className="text-3xl font-bold text-red-500">
                  {accessibleAthletes.filter(a => a.overall_trend === 'down').length}
                </p>
              </div>
              <TrendingDown className="text-red-500" size={32} />
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <StatusTabs
            selectedStatus={activeTab}
            onChange={setActiveTab}
            counts={statusCounts}
          />
          <StatusFilter
            selectedStatuses={selectedStatuses}
            onChange={(statuses) => {
              setSelectedStatuses(statuses)
              setActiveTab('all')
            }}
          />
        </div>

        {/* Data Table */}
        <DataTable
          data={filteredAthletes}
          columns={columns}
          searchable
          searchKeys={['full_name', 'sport', 'squad', 'nationality', 'position'] as (keyof Athlete)[]}
          onRowClick={(athlete) => (window.location.href = `/athletes/${athlete.id}`)}
        />
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={!!editingAthlete}
        onClose={() => setEditingAthlete(null)}
        onSave={handleSaveEdit}
        title="Edit Athlete"
        fields={athleteFields}
        initialData={editingAthlete || {}}
      />

      {/* Add Modal */}
      <EditModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddNew}
        title="Add New Athlete"
        fields={athleteFields}
        initialData={{ status: 'active', nationality: 'SA', sport: 'Football', squad: 'First Team' }}
      />
    </div>
  )
}
