'use client'

import { useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  MapPin,
  Ruler,
  Activity,
  Brain,
  Utensils,
  Stethoscope,
  FileText,
  Edit,
  Cigarette,
  X,
  Printer,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Heart,
  Dumbbell,
  Scale,
  FileDown
} from 'lucide-react'
import RatingInput from '@/components/ui/RatingInput'
import AthleteProfilePrint from '@/components/print/AthleteProfilePrint'

// Mock athlete data
const mockAthletes: Record<string, {
  id: string
  full_name: string
  picture?: string
  gender: 'male' | 'female'
  nationality: string
  mobile_number: string
  date_of_birth: string
  age: number
  education?: string
  social_status?: string
  has_kids: boolean
  no_of_kids?: number
  height: number
  weight: number
  smoker: boolean
  emergency_phone: string
  tshirt_size?: string
  short_size?: string
  goals?: string
  squad: string
  sport: string
  status: 'active' | 'injured' | 'inactive'
  fitness_score?: number
  mental_score?: number
  nutrition_score?: number
  overall_rating?: number
}> = {
  '1': {
    id: '1',
    full_name: 'Mohammed Al-Omari',
    gender: 'male',
    nationality: 'Saudi',
    mobile_number: '+966 512345678',
    date_of_birth: '2000-03-15',
    age: 24,
    education: 'Bachelor Degree',
    social_status: 'Single',
    has_kids: false,
    height: 180,
    weight: 75,
    smoker: false,
    emergency_phone: '+966 598765432',
    tshirt_size: 'L',
    short_size: 'M',
    goals: 'Become a professional football player and represent the national team',
    squad: 'First Team',
    sport: 'Football',
    status: 'active',
    fitness_score: 9,
    mental_score: 8,
    nutrition_score: 9,
    overall_rating: 9
  },
  '2': {
    id: '2',
    full_name: 'Ahmed Al-Saeed',
    gender: 'male',
    nationality: 'Saudi',
    mobile_number: '+966 523456789',
    date_of_birth: '2002-07-22',
    age: 22,
    education: 'High School',
    social_status: 'Single',
    has_kids: false,
    height: 175,
    weight: 70,
    smoker: false,
    emergency_phone: '+966 587654321',
    tshirt_size: 'M',
    short_size: 'M',
    goals: 'Improve technical skills and gain first team experience',
    squad: 'First Team',
    sport: 'Football',
    status: 'active',
    fitness_score: 8,
    mental_score: 9,
    nutrition_score: 8,
    overall_rating: 8
  },
  '3': {
    id: '3',
    full_name: 'Khalid Al-Mohammadi',
    gender: 'male',
    nationality: 'Saudi',
    mobile_number: '+966 534567890',
    date_of_birth: '1998-11-10',
    age: 26,
    education: 'Bachelor Degree',
    social_status: 'Married',
    has_kids: true,
    no_of_kids: 1,
    height: 185,
    weight: 80,
    smoker: false,
    emergency_phone: '+966 576543210',
    tshirt_size: 'XL',
    short_size: 'L',
    goals: 'Lead the team as captain and mentor younger players',
    squad: 'First Team',
    sport: 'Football',
    status: 'injured',
    fitness_score: 7,
    mental_score: 9,
    nutrition_score: 8,
    overall_rating: 8
  },
  '4': {
    id: '4',
    full_name: 'Saad Al-Dosari',
    gender: 'male',
    nationality: 'Saudi',
    mobile_number: '+966 545678901',
    date_of_birth: '2005-05-18',
    age: 19,
    education: 'High School',
    social_status: 'Single',
    has_kids: false,
    height: 178,
    weight: 72,
    smoker: false,
    emergency_phone: '+966 565432109',
    tshirt_size: 'M',
    short_size: 'M',
    goals: 'Develop and earn a spot in the first team',
    squad: 'Youth Team',
    sport: 'Football',
    status: 'active',
    fitness_score: 8,
    mental_score: 7,
    nutrition_score: 8,
    overall_rating: 8
  },
  '5': {
    id: '5',
    full_name: 'Fahad Al-Otaibi',
    gender: 'male',
    nationality: 'Saudi',
    mobile_number: '+966 556789012',
    date_of_birth: '1996-09-03',
    age: 28,
    education: 'Bachelor Degree',
    social_status: 'Married',
    has_kids: true,
    no_of_kids: 2,
    height: 182,
    weight: 78,
    smoker: false,
    emergency_phone: '+966 554321098',
    tshirt_size: 'L',
    short_size: 'L',
    goals: 'Continue performing at the highest level and win championships',
    squad: 'First Team',
    sport: 'Football',
    status: 'active',
    fitness_score: 9,
    mental_score: 8,
    nutrition_score: 9,
    overall_rating: 9
  }
}

// Mock detailed records for each category
const mockFitnessRecords = [
  { id: '1', date: '2025-01-15', coach: 'Coach Ahmed', vo2_max: 55, sprint_time: 4.2, endurance: 9, strength: 8, flexibility: 7, overall: 9, trend: 'up', notes: 'Excellent cardio performance' },
  { id: '2', date: '2025-01-08', coach: 'Coach Ahmed', vo2_max: 53, sprint_time: 4.3, endurance: 8, strength: 8, flexibility: 7, overall: 8, trend: 'stable', notes: 'Good progress in strength training' },
  { id: '3', date: '2025-01-01', coach: 'Coach Ahmed', vo2_max: 52, sprint_time: 4.4, endurance: 8, strength: 7, flexibility: 6, overall: 8, trend: 'up', notes: 'Starting new fitness program' },
]

const mockMedicalRecords = [
  { id: '1', date: '2025-01-10', doctor: 'Dr. Mohammed', type: 'Routine Checkup', blood_pressure: '120/80', heart_rate: 65, status: 'Healthy', notes: 'All vitals normal, cleared for training' },
  { id: '2', date: '2024-12-15', doctor: 'Dr. Mohammed', type: 'Injury Follow-up', blood_pressure: '118/78', heart_rate: 68, status: 'Recovered', notes: 'Ankle fully healed, can resume full training' },
  { id: '3', date: '2024-11-20', doctor: 'Dr. Ali', type: 'Pre-Season Medical', blood_pressure: '122/82', heart_rate: 62, status: 'Healthy', notes: 'Pre-season medical clearance granted' },
]

const mockNutritionRecords = [
  { id: '1', date: '2025-01-18', nutritionist: 'Sarah Ahmed', plan: 'High Protein', calories: 2800, protein: 180, carbs: 320, fat: 70, hydration: 3.5, weight: 75, body_fat: 12, notes: 'Maintaining lean muscle mass' },
  { id: '2', date: '2025-01-11', nutritionist: 'Sarah Ahmed', plan: 'High Protein', calories: 2750, protein: 175, carbs: 310, fat: 72, hydration: 3.2, weight: 75.5, body_fat: 12.5, notes: 'Slight adjustment to carb intake' },
  { id: '3', date: '2025-01-04', nutritionist: 'Sarah Ahmed', plan: 'Balanced', calories: 2600, protein: 160, carbs: 300, fat: 75, hydration: 3.0, weight: 76, body_fat: 13, notes: 'Starting new nutrition program' },
]

const mockMentalRecords = [
  { id: '1', date: '2025-01-12', psychologist: 'Dr. Fatima', commitment: 9, respect: 9, self_confidence: 8, team_work: 9, attitude_training: 8, attitude_game: 9, overall: 8, notes: 'Strong mental focus, good leadership qualities' },
  { id: '2', date: '2025-01-05', psychologist: 'Dr. Fatima', commitment: 8, respect: 9, self_confidence: 7, team_work: 8, attitude_training: 8, attitude_game: 8, overall: 8, notes: 'Working on self-confidence in high-pressure situations' },
  { id: '3', date: '2024-12-28', psychologist: 'Dr. Fatima', commitment: 8, respect: 8, self_confidence: 7, team_work: 8, attitude_training: 7, attitude_game: 8, overall: 7, notes: 'Initial assessment completed' },
]

type RecordType = 'fitness' | 'medical' | 'nutrition' | 'mental' | null

export default function AthleteProfilePage() {
  const params = useParams()
  const athleteId = params.id as string
  const athlete = mockAthletes[athleteId]
  const [activeRecord, setActiveRecord] = useState<RecordType>(null)
  const printRef = useRef<HTMLDivElement>(null)
  const fullProfilePrintRef = useRef<HTMLDivElement>(null)

  // Handle full profile print
  const handleFullProfilePrint = () => {
    // Show print container
    if (fullProfilePrintRef.current) {
      fullProfilePrintRef.current.style.display = 'block'
    }
    // Trigger print
    setTimeout(() => {
      window.print()
      // Hide after print dialog closes
      setTimeout(() => {
        if (fullProfilePrintRef.current) {
          fullProfilePrintRef.current.style.display = 'none'
        }
      }, 100)
    }, 100)
  }

  if (!athlete) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Athlete Not Found
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }} className="mb-6">
            The athlete you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/athletes"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-black rounded-lg font-medium hover:bg-[#FFD700]/90 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Athletes
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'injured': return 'bg-red-500'
      case 'inactive': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Active' }
      case 'injured': return { bg: 'bg-red-500/20', text: 'text-red-500', label: 'Injured' }
      case 'inactive': return { bg: 'bg-gray-500/20', text: 'text-gray-500', label: 'Inactive' }
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-500', label: status }
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="text-green-500" size={16} />
      case 'down': return <TrendingDown className="text-red-500" size={16} />
      default: return <Minus className="text-yellow-500" size={16} />
    }
  }

  const statusBadge = getStatusBadge(athlete.status)

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  // Handle PDF export (simplified - opens print dialog)
  const handleExportPDF = () => {
    window.print()
  }

  // Record Detail Modal
  const renderRecordModal = () => {
    if (!activeRecord) return null

    const getModalContent = () => {
      switch (activeRecord) {
        case 'fitness':
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Activity className="text-green-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Fitness Records</h3>
                  <p style={{ color: 'var(--muted-foreground)' }}>{athlete.full_name}</p>
                </div>
              </div>

              {/* Latest Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-2xl font-bold text-green-500">{mockFitnessRecords[0].vo2_max}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>VO2 Max</p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-2xl font-bold text-[#FFD700]">{mockFitnessRecords[0].sprint_time}s</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sprint Time</p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-2xl font-bold text-blue-500">{mockFitnessRecords[0].endurance}/10</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Endurance</p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-2xl font-bold text-purple-500">{mockFitnessRecords[0].strength}/10</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Strength</p>
                </div>
              </div>

              {/* Records Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--muted)' }}>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Coach</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">VO2 Max</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Sprint</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Overall</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Trend</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockFitnessRecords.map((record, idx) => (
                      <tr key={record.id} className={idx === 0 ? 'bg-green-500/10' : ''} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{record.date}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{record.coach}</td>
                        <td className="px-4 py-3 font-bold text-green-500">{record.vo2_max}</td>
                        <td className="px-4 py-3 font-bold text-[#FFD700]">{record.sprint_time}s</td>
                        <td className="px-4 py-3 font-bold text-[#FFD700]">{record.overall}/10</td>
                        <td className="px-4 py-3">{getTrendIcon(record.trend)}</td>
                        <td className="px-4 py-3 max-w-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{record.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )

        case 'medical':
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Stethoscope className="text-blue-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Medical Records</h3>
                  <p style={{ color: 'var(--muted-foreground)' }}>{athlete.full_name}</p>
                </div>
              </div>

              {/* Latest Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-xl font-bold text-blue-500">{mockMedicalRecords[0].blood_pressure}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Blood Pressure</p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-2xl font-bold text-red-500">{mockMedicalRecords[0].heart_rate}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Heart Rate (bpm)</p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-lg font-bold text-green-500">{mockMedicalRecords[0].status}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Status</p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-lg font-bold text-[#FFD700]">{mockMedicalRecords[0].type}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Last Checkup</p>
                </div>
              </div>

              {/* Records Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--muted)' }}>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Doctor</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Type</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">BP</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">HR</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockMedicalRecords.map((record, idx) => (
                      <tr key={record.id} className={idx === 0 ? 'bg-blue-500/10' : ''} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{record.date}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{record.doctor}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{record.type}</td>
                        <td className="px-4 py-3 font-bold text-blue-500">{record.blood_pressure}</td>
                        <td className="px-4 py-3 font-bold text-red-500">{record.heart_rate}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === 'Healthy' ? 'bg-green-500/20 text-green-500' :
                            record.status === 'Recovered' ? 'bg-blue-500/20 text-blue-500' :
                            'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{record.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )

        case 'nutrition':
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Utensils className="text-orange-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Nutrition Plans</h3>
                  <p style={{ color: 'var(--muted-foreground)' }}>{athlete.full_name}</p>
                </div>
              </div>

              {/* Latest Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-2xl font-bold text-orange-500">{mockNutritionRecords[0].calories}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Daily Calories</p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-2xl font-bold text-red-500">{mockNutritionRecords[0].protein}g</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Protein</p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-2xl font-bold text-[#FFD700]">{mockNutritionRecords[0].body_fat}%</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Body Fat</p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-2xl font-bold text-blue-500">{mockNutritionRecords[0].hydration}L</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Hydration</p>
                </div>
              </div>

              {/* Macros Breakdown */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                <h4 className="font-bold mb-3" style={{ color: 'var(--foreground)' }}>Daily Macros Breakdown</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span style={{ color: 'var(--muted-foreground)' }}>Protein</span>
                      <span className="font-bold text-red-500">{mockNutritionRecords[0].protein}g</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span style={{ color: 'var(--muted-foreground)' }}>Carbs</span>
                      <span className="font-bold text-yellow-500">{mockNutritionRecords[0].carbs}g</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span style={{ color: 'var(--muted-foreground)' }}>Fat</span>
                      <span className="font-bold text-green-500">{mockNutritionRecords[0].fat}g</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Records Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--muted)' }}>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Nutritionist</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Plan</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Calories</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Weight</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Body Fat</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockNutritionRecords.map((record, idx) => (
                      <tr key={record.id} className={idx === 0 ? 'bg-orange-500/10' : ''} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{record.date}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{record.nutritionist}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-500">
                            {record.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-orange-500">{record.calories}</td>
                        <td className="px-4 py-3 font-bold" style={{ color: 'var(--foreground)' }}>{record.weight}kg</td>
                        <td className="px-4 py-3 font-bold text-[#FFD700]">{record.body_fat}%</td>
                        <td className="px-4 py-3 max-w-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{record.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )

        case 'mental':
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Brain className="text-purple-500" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Mental Assessment</h3>
                  <p style={{ color: 'var(--muted-foreground)' }}>{athlete.full_name}</p>
                </div>
              </div>

              {/* Latest Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-2xl font-bold text-purple-500">{mockMentalRecords[0].overall}/10</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Overall Score</p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-2xl font-bold text-blue-500">{mockMentalRecords[0].self_confidence}/10</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Confidence</p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-2xl font-bold text-green-500">{mockMentalRecords[0].team_work}/10</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Team Work</p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--muted)' }}>
                  <p className="text-2xl font-bold text-[#FFD700]">{mockMentalRecords[0].commitment}/10</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Commitment</p>
                </div>
              </div>

              {/* Mental Metrics */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                <h4 className="font-bold mb-3" style={{ color: 'var(--foreground)' }}>Mental Metrics Breakdown</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Commitment', value: mockMentalRecords[0].commitment, color: 'text-[#FFD700]' },
                    { label: 'Respect', value: mockMentalRecords[0].respect, color: 'text-blue-500' },
                    { label: 'Self Confidence', value: mockMentalRecords[0].self_confidence, color: 'text-green-500' },
                    { label: 'Team Work', value: mockMentalRecords[0].team_work, color: 'text-purple-500' },
                    { label: 'Training Attitude', value: mockMentalRecords[0].attitude_training, color: 'text-orange-500' },
                    { label: 'Game Attitude', value: mockMentalRecords[0].attitude_game, color: 'text-red-500' },
                  ].map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: 'var(--card)' }}>
                      <span style={{ color: 'var(--muted-foreground)' }}>{metric.label}</span>
                      <span className={`font-bold ${metric.color}`}>{metric.value}/10</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Records Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--muted)' }}>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Date</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Psychologist</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Commitment</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Confidence</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Teamwork</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Overall</th>
                      <th className="px-4 py-3 text-left text-[#FFD700] font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockMentalRecords.map((record, idx) => (
                      <tr key={record.id} className={idx === 0 ? 'bg-purple-500/10' : ''} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{record.date}</td>
                        <td className="px-4 py-3" style={{ color: 'var(--foreground)' }}>{record.psychologist}</td>
                        <td className="px-4 py-3 font-bold text-[#FFD700]">{record.commitment}/10</td>
                        <td className="px-4 py-3 font-bold text-blue-500">{record.self_confidence}/10</td>
                        <td className="px-4 py-3 font-bold text-green-500">{record.team_work}/10</td>
                        <td className="px-4 py-3 font-bold text-purple-500">{record.overall}/10</td>
                        <td className="px-4 py-3 max-w-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{record.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )

        default:
          return null
      }
    }

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div
          ref={printRef}
          className="rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          {/* Modal Header */}
          <div className="sticky top-0 flex items-center justify-between p-4 print:hidden" style={{ backgroundColor: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#FFD700]/20 transition-colors"
                style={{ color: 'var(--foreground)', border: '1px solid var(--border)' }}
              >
                <Printer size={18} />
                Print
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-black rounded-lg font-medium hover:bg-[#FFD700]/90 transition-colors"
              >
                <Download size={18} />
                Export PDF
              </button>
            </div>
            <button
              onClick={() => setActiveRecord(null)}
              className="p-2 rounded-lg hover:bg-red-500/20 transition-colors text-red-500"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {getModalContent()}
          </div>

          {/* Print Footer */}
          <div className="hidden print:block p-4 text-center" style={{ borderTop: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--muted-foreground)' }}>Al-Ittihad FC - Athlete Performance Management System</p>
            <p style={{ color: 'var(--muted-foreground)' }}>Generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/athletes"
            className="p-2 rounded-lg hover:bg-[#FFD700]/10 transition-colors"
            style={{ color: 'var(--foreground)' }}
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              Athlete Profile
            </h1>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Al-Ittihad FC - Performance Management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleFullProfilePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors hover:bg-[#FFD700]/20"
            style={{ color: 'var(--foreground)', border: '1px solid var(--border)' }}
          >
            <FileDown size={20} />
            Export Full Profile
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-black rounded-lg font-medium hover:bg-[#FFD700]/90 transition-colors">
            <Edit size={20} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div
          className="rounded-xl p-6 shadow-lg"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-[#FFD700]/20 flex items-center justify-center mb-4">
                <User size={64} className="text-[#FFD700]" />
              </div>
              <div className={`absolute bottom-4 right-2 w-5 h-5 rounded-full border-2 border-white ${getStatusColor(athlete.status)}`} />
            </div>
            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
              {athlete.full_name}
            </h2>
            <p style={{ color: 'var(--muted-foreground)' }} className="mb-3">
              {athlete.sport} - {athlete.squad}
            </p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.bg} ${statusBadge.text}`}>
              {statusBadge.label}
            </span>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 w-full mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
              <div>
                <p className="text-2xl font-bold text-[#FFD700]">{athlete.age}</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Age</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FFD700]">{athlete.height}</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Height (cm)</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FFD700]">{athlete.weight}</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Weight (kg)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div
          className="lg:col-span-2 rounded-xl p-6 shadow-lg"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <h3 className="text-lg font-bold mb-4 text-[#FFD700]">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
              <Calendar className="text-[#FFD700]" size={20} />
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Date of Birth</p>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>{athlete.date_of_birth}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
              <MapPin className="text-[#FFD700]" size={20} />
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Nationality</p>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>{athlete.nationality}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
              <Phone className="text-[#FFD700]" size={20} />
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Mobile Number</p>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>{athlete.mobile_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
              <Phone className="text-[#FFD700]" size={20} />
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Emergency Contact</p>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>{athlete.emergency_phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
              <User className="text-[#FFD700]" size={20} />
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Social Status</p>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                  {athlete.social_status || 'N/A'} {athlete.has_kids && `(${athlete.no_of_kids} kids)`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
              <FileText className="text-[#FFD700]" size={20} />
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Education</p>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>{athlete.education || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
              <Ruler className="text-[#FFD700]" size={20} />
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>T-Shirt / Short Size</p>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                  {athlete.tshirt_size || 'N/A'} / {athlete.short_size || 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
              <Cigarette className="text-[#FFD700]" size={20} />
              <div>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Smoker</p>
                <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                  {athlete.smoker ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Goals */}
          {athlete.goals && (
            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
              <p className="text-sm font-medium text-[#FFD700] mb-2">Goals</p>
              <p style={{ color: 'var(--foreground)' }}>{athlete.goals}</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Scores */}
      <div
        className="rounded-xl p-6 shadow-lg"
        style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <h3 className="text-lg font-bold mb-4 text-[#FFD700]">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <RatingInput
              value={athlete.fitness_score || 0}
              onChange={() => {}}
              label="Fitness Score"
              readOnly
            />
          </div>
          <div>
            <RatingInput
              value={athlete.mental_score || 0}
              onChange={() => {}}
              label="Mental Score"
              readOnly
            />
          </div>
          <div>
            <RatingInput
              value={athlete.nutrition_score || 0}
              onChange={() => {}}
              label="Nutrition Score"
              readOnly
            />
          </div>
          <div>
            <RatingInput
              value={athlete.overall_rating || 0}
              onChange={() => {}}
              label="Overall Rating"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Quick Links to Records - Now Clickable to Show Modal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveRecord('fitness')}
          className="rounded-xl p-4 shadow-lg hover:scale-[1.02] transition-all cursor-pointer text-left group"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Activity className="text-green-500" size={24} />
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--foreground)' }}>Fitness Records</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Last: {mockFitnessRecords[0].date}
                </p>
              </div>
            </div>
            <ChevronRight className="text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
          </div>
        </button>

        <button
          onClick={() => setActiveRecord('medical')}
          className="rounded-xl p-4 shadow-lg hover:scale-[1.02] transition-all cursor-pointer text-left group"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Stethoscope className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--foreground)' }}>Medical Records</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Last: {mockMedicalRecords[0].date}
                </p>
              </div>
            </div>
            <ChevronRight className="text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
          </div>
        </button>

        <button
          onClick={() => setActiveRecord('nutrition')}
          className="rounded-xl p-4 shadow-lg hover:scale-[1.02] transition-all cursor-pointer text-left group"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Utensils className="text-orange-500" size={24} />
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--foreground)' }}>Nutrition Plans</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Last: {mockNutritionRecords[0].date}
                </p>
              </div>
            </div>
            <ChevronRight className="text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
          </div>
        </button>

        <button
          onClick={() => setActiveRecord('mental')}
          className="rounded-xl p-4 shadow-lg hover:scale-[1.02] transition-all cursor-pointer text-left group"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Brain className="text-purple-500" size={24} />
              </div>
              <div>
                <p className="font-bold" style={{ color: 'var(--foreground)' }}>Mental Assessment</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Last: {mockMentalRecords[0].date}
                </p>
              </div>
            </div>
            <ChevronRight className="text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
          </div>
        </button>
      </div>

      {/* Record Detail Modal */}
      {renderRecordModal()}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:max-h-none {
            max-height: none !important;
          }
          .print\\:overflow-visible {
            overflow: visible !important;
          }
          [class*="fixed"] {
            position: static !important;
          }
          [class*="bg-black\\/60"] {
            background: white !important;
          }
        }
      `}</style>

      {/* Full Profile Print Component */}
      <AthleteProfilePrint
        ref={fullProfilePrintRef}
        athlete={athlete}
        fitnessRecords={mockFitnessRecords}
        medicalRecords={mockMedicalRecords}
        nutritionRecords={mockNutritionRecords}
        mentalRecords={mockMentalRecords}
      />
    </div>
  )
}
