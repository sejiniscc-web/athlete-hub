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

// Default password for mock users who don't have a specific password
const DEFAULT_PASSWORD = 'Welcome@123'

// Mock users for development/testing
export const mockUsers: User[] = [
  {
    id: '0',
    email: 'abdul.sejini@gmail.com',
    full_name: 'Abdulelah Sejini',
    password: 'Admin@123',
    role: 'system_admin',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    assigned_sports: [],
    assigned_squads: [],
  },
  {
    id: '1',
    email: 'Hjambi@ittihadclub.sa',
    full_name: 'Hala Jambi',
    password: 'Welcome@123',
    role: 'super_admin',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    assigned_sports: [],
    assigned_squads: [],
  },
  {
    id: '2',
    email: 'football.coach@alittihad.com',
    full_name: 'Ahmad Football Coach',
    password: DEFAULT_PASSWORD,
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
    password: DEFAULT_PASSWORD,
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
    password: DEFAULT_PASSWORD,
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
    password: DEFAULT_PASSWORD,
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
    password: DEFAULT_PASSWORD,
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
    password: DEFAULT_PASSWORD,
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
    password: DEFAULT_PASSWORD,
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
    password: DEFAULT_PASSWORD,
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
    password: DEFAULT_PASSWORD,
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
    password: DEFAULT_PASSWORD,
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
    password: DEFAULT_PASSWORD,
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
    password: DEFAULT_PASSWORD,
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
    password: DEFAULT_PASSWORD,
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
    password: DEFAULT_PASSWORD,
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
    password: DEFAULT_PASSWORD,
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
const CUSTOM_USERS_KEY = 'athlete_hub_custom_users'

// Get all users (mockUsers + custom users from localStorage)
export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return mockUsers

  try {
    const customUsersJson = localStorage.getItem(CUSTOM_USERS_KEY)
    if (customUsersJson) {
      const customUsers: User[] = JSON.parse(customUsersJson)
      // Merge: custom users override mock users with the same ID
      const allUsers: User[] = []

      // First add mock users, but check if they have an override in custom users
      mockUsers.forEach(mockUser => {
        const customOverride = customUsers.find(cu => cu.id === mockUser.id)
        if (customOverride) {
          // Use the custom (updated) version
          allUsers.push(customOverride)
        } else {
          allUsers.push(mockUser)
        }
      })

      // Then add new custom users (not overrides)
      customUsers.forEach(cu => {
        const isOverride = mockUsers.some(mu => mu.id === cu.id)
        if (!isOverride) {
          allUsers.push(cu)
        }
      })

      return allUsers
    }
  } catch (e) {
    console.error('Error loading custom users:', e)
  }
  return mockUsers
}

// Add a new user to localStorage
export function addCustomUser(user: User): void {
  if (typeof window === 'undefined') return

  try {
    const customUsersJson = localStorage.getItem(CUSTOM_USERS_KEY)
    const customUsers: User[] = customUsersJson ? JSON.parse(customUsersJson) : []

    // Check if user already exists
    const existingIndex = customUsers.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase())
    if (existingIndex >= 0) {
      customUsers[existingIndex] = user // Update existing
    } else {
      customUsers.push(user) // Add new
    }

    localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(customUsers))
  } catch (e) {
    console.error('Error saving custom user:', e)
  }
}

// Find user by email (searches both mockUsers and custom users)
export function findUserByEmail(email: string): User | undefined {
  const allUsers = getAllUsers()
  return allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
}

// Find user by ID (searches both mockUsers and custom users)
export function findUserById(id: string): User | undefined {
  const allUsers = getAllUsers()
  return allUsers.find(u => u.id === id)
}

// Update an existing user
export function updateUser(user: User): void {
  if (typeof window === 'undefined') return

  try {
    // Check if it's a mock user (we store updates in custom users)
    const isMockUser = mockUsers.some(u => u.id === user.id)

    const customUsersJson = localStorage.getItem(CUSTOM_USERS_KEY)
    const customUsers: User[] = customUsersJson ? JSON.parse(customUsersJson) : []

    if (isMockUser) {
      // For mock users, we store the updated version in custom users (overrides mock)
      const existingIndex = customUsers.findIndex(u => u.id === user.id)
      if (existingIndex >= 0) {
        customUsers[existingIndex] = user
      } else {
        customUsers.push(user)
      }
    } else {
      // For custom users, update directly
      const existingIndex = customUsers.findIndex(u => u.id === user.id)
      if (existingIndex >= 0) {
        customUsers[existingIndex] = user
      }
    }

    localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(customUsers))
  } catch (e) {
    console.error('Error updating user:', e)
  }
}

// Update user password
export function updateUserPassword(userId: string, newPassword: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    const user = findUserById(userId)
    if (!user) return false

    const updatedUser = { ...user, password: newPassword, updated_at: new Date().toISOString() }
    updateUser(updatedUser)
    return true
  } catch (e) {
    console.error('Error updating password:', e)
    return false
  }
}

// Delete a user from localStorage
export function deleteUser(userId: string): boolean {
  if (typeof window === 'undefined') return false

  try {
    const customUsersJson = localStorage.getItem(CUSTOM_USERS_KEY)
    const customUsers: User[] = customUsersJson ? JSON.parse(customUsersJson) : []

    const filteredUsers = customUsers.filter(u => u.id !== userId)
    localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(filteredUsers))
    return true
  } catch (e) {
    console.error('Error deleting user:', e)
    return false
  }
}

// Get default password constant
export function getDefaultPassword(): string {
  return DEFAULT_PASSWORD
}

// Validate user password
export function validatePassword(user: User, password: string): boolean {
  // Check if user has a password set
  if (user.password) {
    return user.password === password
  }
  // If no password set, use default password
  return password === DEFAULT_PASSWORD
}

// Authenticate user with email and password
export function authenticateUser(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const user = findUserByEmail(email)

  if (!user) {
    return { success: false, error: 'User not found. Please check your email.' }
  }

  if (!user.is_active) {
    return { success: false, error: 'Your account is inactive. Please contact administrator.' }
  }

  if (!validatePassword(user, password)) {
    return { success: false, error: 'Invalid password. Please try again.' }
  }

  return { success: true, user }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null)
  const [originalUser, setOriginalUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem(CURRENT_USER_KEY)
    const savedOriginalUserId = localStorage.getItem(ORIGINAL_USER_KEY)
    const savedSwitchedUserId = localStorage.getItem(SWITCHED_USER_KEY)

    // Get all users including custom users from localStorage
    const allUsers = getAllUsers()

    // First load the original user
    if (savedOriginalUserId) {
      const origUser = allUsers.find(u => u.id === savedOriginalUserId)
      if (origUser) {
        setOriginalUserState(origUser)
      }
    }

    // Then load the current user (may be switched)
    if (savedSwitchedUserId && savedOriginalUserId) {
      // User is in switched mode
      const switchedUser = allUsers.find(u => u.id === savedSwitchedUserId)
      const origUser = allUsers.find(u => u.id === savedOriginalUserId)
      if (switchedUser && origUser) {
        setCurrentUserState(switchedUser)
        setOriginalUserState(origUser)
      } else {
        // Invalid switched state - clear everything
        localStorage.removeItem(ORIGINAL_USER_KEY)
        localStorage.removeItem(SWITCHED_USER_KEY)
        localStorage.removeItem(CURRENT_USER_KEY)
        setCurrentUserState(null)
        setOriginalUserState(null)
      }
    } else if (savedUserId) {
      const user = allUsers.find(u => u.id === savedUserId)
      if (user) {
        setCurrentUserState(user)
      } else {
        // User ID was saved but user not found - clear it
        localStorage.removeItem(CURRENT_USER_KEY)
        setCurrentUserState(null)
      }
    } else {
      // No user logged in - keep currentUser as null
      setCurrentUserState(null)
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

  // Switch to another user (ONLY for the hidden system admin)
  const switchToUser = (user: User) => {
    // Only the hidden system admin can switch users
    const actualUser = originalUser || currentUser
    if (!actualUser || !canSwitchUser(actualUser.role, actualUser.email)) {
      console.error('Only the hidden system admin can switch users')
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
    canSwitchUser: (originalUser || currentUser) ? canSwitchUser((originalUser || currentUser)!.role, (originalUser || currentUser)!.email) : false,
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
