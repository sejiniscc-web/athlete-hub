'use client'

import { useState, useRef, useEffect } from 'react'
import { useUser, availableUsers } from '@/context/UserContext'
import { ROLE_DISPLAY_NAMES, hasFullAccess } from '@/types/database'
import { User, ChevronDown, Shield, ShieldCheck, Users } from 'lucide-react'

export default function UserSwitcher() {
  const { currentUser, setCurrentUser, isLoading } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getRoleIcon = (role: string) => {
    if (hasFullAccess(role as any)) {
      return <ShieldCheck size={14} className="text-[#FFD700]" />
    }
    return <Shield size={14} className="text-gray-400" />
  }

  if (isLoading || !currentUser) {
    return (
      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-600" />
          <div className="flex-1">
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  // Only show User Switcher for admin users
  if (!hasFullAccess(currentUser.role)) {
    return (
      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
            <User size={20} className="text-[#FFD700]" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>
                {currentUser.full_name}
              </span>
              {getRoleIcon(currentUser.role)}
            </div>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {ROLE_DISPLAY_NAMES[currentUser.role]}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const getPermissionSummary = (user: typeof currentUser) => {
    if (!user) return ''
    if (hasFullAccess(user.role)) {
      return 'Full Access'
    }
    const sports = user.assigned_sports || []
    const squads = user.assigned_squads || []

    const sportText = sports.includes('all') ? 'All Sports' :
      sports.length > 0 ? `${sports.length} Sport${sports.length > 1 ? 's' : ''}` : 'No Sports'
    const squadText = squads.includes('all') ? 'All Squads' :
      squads.length > 0 ? `${squads.length} Squad${squads.length > 1 ? 's' : ''}` : 'No Squads'

    return `${sportText} · ${squadText}`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-t flex items-center gap-3 hover:bg-[#FFD700]/10 transition-colors"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
          <User size={20} className="text-[#FFD700]" />
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>
              {currentUser.full_name}
            </span>
            {getRoleIcon(currentUser.role)}
          </div>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {ROLE_DISPLAY_NAMES[currentUser.role]}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: 'var(--muted-foreground)' }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute bottom-full left-0 right-0 mb-1 rounded-lg shadow-xl overflow-hidden z-50"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="p-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 px-2 py-1">
              <Users size={14} className="text-[#FFD700]" />
              <span className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                Switch User (Dev Mode)
              </span>
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {availableUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  setCurrentUser(user)
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-2 flex items-center gap-3 hover:bg-[#FFD700]/10 transition-colors ${
                  user.id === currentUser.id ? 'bg-[#FFD700]/20' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  user.id === currentUser.id ? 'bg-[#FFD700]' : 'bg-[#FFD700]/20'
                }`}>
                  <User size={16} className={user.id === currentUser.id ? 'text-black' : 'text-[#FFD700]'} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                      {user.full_name}
                    </span>
                    {getRoleIcon(user.role)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {ROLE_DISPLAY_NAMES[user.role]}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      · {getPermissionSummary(user)}
                    </span>
                  </div>
                </div>
                {user.id === currentUser.id && (
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                )}
              </button>
            ))}
          </div>

          <div className="p-2 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
            <div className="px-2 py-1">
              <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <span className="font-medium">Current Permissions:</span>
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--foreground)' }}>
                {getPermissionSummary(currentUser)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
