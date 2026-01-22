// Settings store for Sports and Squads
// This will be managed via Settings page

export interface Sport {
  id: string
  name: string
  nameAr: string
  active: boolean
}

export interface Squad {
  id: string
  name: string
  nameAr: string
  sportId: string // Link to sport
  active: boolean
}

// Default sports
export const defaultSports: Sport[] = [
  { id: 'football', name: 'Football', nameAr: 'كرة القدم', active: true },
  { id: 'basketball', name: 'Basketball', nameAr: 'كرة السلة', active: true },
  { id: 'volleyball', name: 'Volleyball', nameAr: 'كرة الطائرة', active: true },
  { id: 'handball', name: 'Handball', nameAr: 'كرة اليد', active: true },
  { id: 'swimming', name: 'Swimming', nameAr: 'السباحة', active: true },
  { id: 'athletics', name: 'Athletics', nameAr: 'ألعاب القوى', active: true },
  { id: 'tennis', name: 'Tennis', nameAr: 'التنس', active: true },
  { id: 'table_tennis', name: 'Table Tennis', nameAr: 'تنس الطاولة', active: true },
  { id: 'archery', name: 'Archery', nameAr: 'الرماية', active: true },
  { id: 'badminton', name: 'Badminton', nameAr: 'الريشة الطائرة', active: true },
  { id: 'e_games', name: 'E-Games', nameAr: 'الألعاب الإلكترونية', active: true },
  { id: 'fencing', name: 'Fencing', nameAr: 'المبارزة', active: true },
  { id: 'gymnastics', name: 'Gymnastics', nameAr: 'الجمباز', active: true },
  { id: 'judo', name: 'Judo', nameAr: 'الجودو', active: true },
  { id: 'karate', name: 'Karate', nameAr: 'الكاراتيه', active: true },
  { id: 'taekwondo', name: 'Taekwondo', nameAr: 'التايكوندو', active: true },
  { id: 'water_polo', name: 'Water Polo', nameAr: 'كرة الماء', active: true },
  { id: 'weightlifting', name: 'Weightlifting', nameAr: 'رفع الأثقال', active: true },
]

// Default squads
export const defaultSquads: Squad[] = [
  { id: 'first_team', name: 'First Team', nameAr: 'الفريق الأول', sportId: 'all', active: true },
  { id: 'youth_team', name: 'Youth Team', nameAr: 'فريق الشباب', sportId: 'all', active: true },
  { id: 'junior_team', name: 'Junior Team', nameAr: 'فريق الناشئين', sportId: 'all', active: true },
  { id: 'reserve', name: 'Reserve', nameAr: 'الاحتياطي', sportId: 'all', active: true },
  { id: 'u21', name: 'Under 21', nameAr: 'تحت 21', sportId: 'all', active: true },
  { id: 'u18', name: 'Under 18', nameAr: 'تحت 18', sportId: 'all', active: true },
  { id: 'u15', name: 'Under 15', nameAr: 'تحت 15', sportId: 'all', active: true },
  { id: 'women', name: 'Women Team', nameAr: 'فريق السيدات', sportId: 'all', active: true },
]

// Local storage keys
export const SPORTS_STORAGE_KEY = 'athlete_hub_sports'
export const SQUADS_STORAGE_KEY = 'athlete_hub_squads'

// Helper functions to get/set from localStorage
export const getSports = (): Sport[] => {
  if (typeof window === 'undefined') return defaultSports
  const stored = localStorage.getItem(SPORTS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : defaultSports
}

export const setSports = (sports: Sport[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(SPORTS_STORAGE_KEY, JSON.stringify(sports))
}

export const getSquads = (): Squad[] => {
  if (typeof window === 'undefined') return defaultSquads
  const stored = localStorage.getItem(SQUADS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : defaultSquads
}

export const setSquads = (squads: Squad[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(SQUADS_STORAGE_KEY, JSON.stringify(squads))
}

// Get active sports only
export const getActiveSports = (): Sport[] => {
  return getSports().filter(s => s.active)
}

// Get active squads only
export const getActiveSquads = (): Squad[] => {
  return getSquads().filter(s => s.active)
}

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}
