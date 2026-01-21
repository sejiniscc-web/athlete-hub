'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole, hasFullAccess, filterAthletesByPermission, canAccessAthlete } from '@/types/database'

interface UserContextType {
  currentUser: User | null
  isLoading: boolean
  hasFullAccess: boolean
  filterAthletes: <T extends { sport: string; squad?: string }>(athletes: T[]) => T[]
  canAccessAthlete: <T extends { sport: string; squad?: string }>(athlete: T) => boolean
  setCurrentUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Mock users for development/testing
export const mockUsers: User[] = [
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
]

// Key for localStorage
const CURRENT_USER_KEY = 'athlete_hub_current_user'

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem(CURRENT_USER_KEY)
    if (savedUserId) {
      const user = mockUsers.find(u => u.id === savedUserId)
      if (user) {
        setCurrentUserState(user)
      } else {
        // Default to super_admin if saved user not found
        setCurrentUserState(mockUsers[0])
      }
    } else {
      // Default to super_admin
      setCurrentUserState(mockUsers[0])
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage when changed
  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user)
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, user.id)
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  }

  const value: UserContextType = {
    currentUser,
    isLoading,
    hasFullAccess: currentUser ? hasFullAccess(currentUser.role) : false,
    filterAthletes: <T extends { sport: string; squad?: string }>(athletes: T[]) => {
      if (!currentUser) return []
      return filterAthletesByPermission(athletes, currentUser)
    },
    canAccessAthlete: <T extends { sport: string; squad?: string }>(athlete: T) => {
      if (!currentUser) return false
      return canAccessAthlete(athlete, currentUser)
    },
    setCurrentUser,
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
