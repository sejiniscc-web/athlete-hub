'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole, hasFullAccess, filterAthletesByPermission, canAccessAthlete, canSwitchUser, isSystemAdmin } from '@/types/database'

interface UserContextType {
  currentUser: User | null
  originalUser: User | null  // The real logged-in user (for switch user feature)
  isLoading: boolean
  hasFullAccess: boolean
  isSystemAdmin: boolean
  canSwitchUser: boolean
  isSwitchedUser: boolean  // True if currently viewing as another user
  filterAthletes: <T extends { sport: string; squad?: string }>(athletes: T[]) => T[]
  canAccessAthlete: <T extends { sport: string; squad?: string }>(athlete: T) => boolean
  setCurrentUser: (user: User | null) => void
  switchToUser: (user: User) => void  // Switch to another user (system_admin only)
  switchBack: () => void  // Switch back to original user
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Mock users for development/testing
export const mockUsers: User[] = [
  {
    id: '0',
    email: 'abdul.sejini@gmail.com',
    full_name: 'Abdulelah Sejini',
    role: 'system_admin',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    assigned_sports: [],
    assigned_squads: [],
  },
  {
    id: '1',
    email: 'admin@alittihad.com',
    full_name: 'Hala Jambi',
    role: 'super_admin',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    assigned_sports: [], // Empty = all (for admins it doesn't matter due to hasFullAccess)
    assigned_squads: [],
  },
  {
    id: '2',
    email: 'football.coach@alittihad.com',
    full_name: 'Ahmad Football Coach',
    role: 'sport_coach',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    assigned_sports: ['football'],
    assigned_squads: ['first_team', 'u21'],
  },
  {
    id: '3',
    email: 'basketball.coach@alittihad.com',
    full_name: 'Mohammed Basketball Coach',
    role: 'sport_coach',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    assigned_sports: ['basketball'],
    assigned_squads: ['all'],
  },
  {
    id: '4',
    email: 'fitness@alittihad.com',
    full_name: 'Omar Fitness',
    role: 'fitness_coach',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    assigned_sports: ['all'],
    assigned_squads: ['first_team'],
  },
  {
    id: '5',
    email: 'doctor@alittihad.com',
    full_name: 'Dr. Saeed',
    role: 'doctor',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    assigned_sports: ['football', 'basketball'],
    assigned_squads: ['all'],
  },
  {
    id: '6',
    email: 'nutritionist@alittihad.com',
    full_name: 'Fatima Nutritionist',
    role: 'nutritionist',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    assigned_sports: ['all'],
    assigned_squads: ['first_team', 'u21'],
  },
  {
    id: '7',
    email: 'psychologist@alittihad.com',
    full_name: 'Dr. Noura',
    role: 'psychologist',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    assigned_sports: ['football'],
    assigned_squads: ['all'],
  },
  // Physiotherapists
  {
    id: '8',
    email: 'Abdulmoeen.kl@gmail.com',
    full_name: 'Abdulmoien Kalantan',
    phone: '+966 5xxxxxxxx',
    role: 'physiotherapist',
    is_active: true,
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
    assigned_sports: ['football'],
    assigned_squads: ['first_team'],
  },
  {
    id: '9',
    email: 'mohamedberriri.kine@gmail.com',
    full_name: 'Mohammed Berrery',
    phone: '+966 5xxxxxxxx',
    role: 'physiotherapist',
    is_active: true,
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
    assigned_sports: ['football'],
    assigned_squads: ['first_team', 'u21'],
  },
  {
    id: '10',
    email: 'hmalshareef@ittihadclub.sa',
    full_name: 'Hassan Alsharief',
    phone: '+966 5xxxxxxxx',
    role: 'physiotherapist',
    is_active: true,
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    assigned_sports: ['football'],
    assigned_squads: ['first_team'],
  },
  {
    id: '11',
    email: 'Saadyahya0505@gmail.com',
    full_name: 'Saad Alqahtani',
    phone: '+966 5xxxxxxxx',
    role: 'physiotherapist',
    is_active: true,
    created_at: '2024-02-15',
    updated_at: '2024-02-15',
    assigned_sports: ['football'],
    assigned_squads: ['u21'],
  },
  {
    id: '12',
    email: 'lolo.oskaz@gmail.com',
    full_name: 'Lara Kazim',
    phone: '+966 5xxxxxxxx',
    role: 'physiotherapist',
    is_active: true,
    created_at: '2024-03-01',
    updated_at: '2024-03-01',
    assigned_sports: ['all'],
    assigned_squads: ['first_team'],
  },
  {
    id: '13',
    email: 'Smalasmari@ittihadclub.sa',
    full_name: 'Saed Alasmari',
    phone: '+966 5xxxxxxxx',
    role: 'physiotherapist',
    is_active: true,
    created_at: '2024-03-15',
    updated_at: '2024-03-15',
    assigned_sports: ['football'],
    assigned_squads: ['all'],
  },
  // Strength and Condition Coaches
  {
    id: '14',
    email: 'arab-30@hotmail.com',
    full_name: 'Abdulrahman Arab',
    phone: '+966 5xxxxxxxx',
    role: 'fitness_coach',
    is_active: true,
    created_at: '2024-01-10',
    updated_at: '2024-01-10',
    assigned_sports: ['football'],
    assigned_squads: ['first_team'],
  },
  {
    id: '15',
    email: 'the_loard@hotmail.com',
    full_name: 'Faisal Alsharief',
    phone: '+966 5xxxxxxxx',
    role: 'fitness_coach',
    is_active: true,
    created_at: '2024-01-10',
    updated_at: '2024-01-10',
    assigned_sports: ['football'],
    assigned_squads: ['first_team', 'u21'],
  },
  {
    id: '16',
    email: 'rlanca@ittihadclub.sa',
    full_name: 'Rui Lanca',
    phone: '+966 5xxxxxxxx',
    role: 'fitness_coach',
    is_active: true,
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    assigned_sports: ['football'],
    assigned_squads: ['first_team'],
  },
]

// Key for localStorage
const CURRENT_USER_KEY = 'athlete_hub_current_user'
const ORIGINAL_USER_KEY = 'athlete_hub_original_user'
const SWITCHED_USER_KEY = 'athlete_hub_switched_user'

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null)
  const [originalUser, setOriginalUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem(CURRENT_USER_KEY)
    const savedOriginalUserId = localStorage.getItem(ORIGINAL_USER_KEY)
    const savedSwitchedUserId = localStorage.getItem(SWITCHED_USER_KEY)

    // First load the original user
    if (savedOriginalUserId) {
      const origUser = mockUsers.find(u => u.id === savedOriginalUserId)
      if (origUser) {
        setOriginalUserState(origUser)
      }
    }

    // Then load the current user (may be switched)
    if (savedSwitchedUserId && savedOriginalUserId) {
      // User is in switched mode
      const switchedUser = mockUsers.find(u => u.id === savedSwitchedUserId)
      const origUser = mockUsers.find(u => u.id === savedOriginalUserId)
      if (switchedUser && origUser) {
        setCurrentUserState(switchedUser)
        setOriginalUserState(origUser)
      } else {
        // Reset to default
        const defaultUser = mockUsers.find(u => u.role === 'super_admin') || mockUsers[1]
        setCurrentUserState(defaultUser)
        setOriginalUserState(null)
      }
    } else if (savedUserId) {
      const user = mockUsers.find(u => u.id === savedUserId)
      if (user) {
        setCurrentUserState(user)
      } else {
        // Default to super_admin if saved user not found
        const defaultUser = mockUsers.find(u => u.role === 'super_admin') || mockUsers[1]
        setCurrentUserState(defaultUser)
      }
    } else {
      // Default to super_admin (not system_admin)
      const defaultUser = mockUsers.find(u => u.role === 'super_admin') || mockUsers[1]
      setCurrentUserState(defaultUser)
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage when changed
  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user)
    // Clear switched state when setting user directly
    setOriginalUserState(null)
    localStorage.removeItem(ORIGINAL_USER_KEY)
    localStorage.removeItem(SWITCHED_USER_KEY)
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, user.id)
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  }

  // Switch to another user (ONLY for system_admin)
  const switchToUser = (user: User) => {
    // Only system_admin can switch users
    const actualUser = originalUser || currentUser
    if (!actualUser || !canSwitchUser(actualUser.role)) {
      console.error('Only system_admin can switch users')
      return
    }

    // Save original user if not already saved
    if (!originalUser) {
      setOriginalUserState(currentUser)
      localStorage.setItem(ORIGINAL_USER_KEY, currentUser!.id)
    }

    // Switch to new user
    setCurrentUserState(user)
    localStorage.setItem(SWITCHED_USER_KEY, user.id)
  }

  // Switch back to original user
  const switchBack = () => {
    if (originalUser) {
      setCurrentUserState(originalUser)
      setOriginalUserState(null)
      localStorage.removeItem(ORIGINAL_USER_KEY)
      localStorage.removeItem(SWITCHED_USER_KEY)
      localStorage.setItem(CURRENT_USER_KEY, originalUser.id)
    }
  }

  // Check if user is currently switched
  const isSwitchedUser = originalUser !== null

  const value: UserContextType = {
    currentUser,
    originalUser,
    isLoading,
    hasFullAccess: currentUser ? hasFullAccess(currentUser.role) : false,
    isSystemAdmin: currentUser ? isSystemAdmin(currentUser.role) : false,
    canSwitchUser: (originalUser || currentUser) ? canSwitchUser((originalUser || currentUser)!.role) : false,
    isSwitchedUser,
    filterAthletes: <T extends { sport: string; squad?: string }>(athletes: T[]) => {
      if (!currentUser) return []
      return filterAthletesByPermission(athletes, currentUser)
    },
    canAccessAthlete: <T extends { sport: string; squad?: string }>(athlete: T) => {
      if (!currentUser) return false
      return canAccessAthlete(athlete, currentUser)
    },
    setCurrentUser,
    switchToUser,
    switchBack,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export { mockUsers as availableUsers }
