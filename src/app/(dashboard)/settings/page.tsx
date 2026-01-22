'use client'

import { useState, useMemo, useEffect } from 'react'
import Header from '@/components/ui/Header'
import Button from '@/components/ui/Button'
import DataTable from '@/components/ui/DataTable'
import {
  User as UserIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Save,
  Camera,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserCog,
  Plus,
  Edit,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Activity,
  CheckCircle,
  XCircle,
  Dumbbell,
  Users,
  X,
  KeyRound,
  RefreshCw,
  ArrowLeftRight
} from 'lucide-react'
import { Sport, Squad, getSports, setSports, getSquads, setSquads, defaultSports, defaultSquads } from '@/data/settings'
import {
  User,
  UserRole,
  ROLE_DISPLAY_NAMES,
  getVisibleRoles,
  canManageUser,
  hasFullAccess,
  canSwitchUser,
  isSystemAdmin,
  isHiddenUser,
  HIDDEN_SYSTEM_ADMIN_EMAIL
} from '@/types/database'
import { useUser, mockUsers, addCustomUser, getAllUsers, updateUser, updateUserPassword, deleteUser, getDefaultPassword } from '@/context/UserContext'

export default function SettingsPage() {
  // Get current user from context
  const { currentUser: contextUser, originalUser, isSwitchedUser, switchToUser, switchBack, canSwitchUser: userCanSwitch, isLoading: userLoading } = useUser()

  // Show loading while user is being loaded
  if (userLoading || !contextUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full" />
      </div>
    )
  }

  // Now we're sure contextUser exists
  const currentUser: User = contextUser

  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  // Sports & Squads state
  const [sportsData, setSportsData] = useState<Sport[]>([])
  const [squadsData, setSquadsData] = useState<Squad[]>([])
  const [editingSport, setEditingSport] = useState<Sport | null>(null)
  const [editingSquad, setEditingSquad] = useState<Squad | null>(null)
  const [showAddSport, setShowAddSport] = useState(false)
  const [showAddSquad, setShowAddSquad] = useState(false)
  const [newSport, setNewSport] = useState({ name: '', nameAr: '' })
  const [newSquad, setNewSquad] = useState({ name: '', nameAr: '', sportId: 'all' })

  // Users state - loaded from getAllUsers() which combines mockUsers with custom users from localStorage
  const [usersData, setUsersData] = useState<User[]>([])

  // Load sports, squads, and users on mount
  useEffect(() => {
    setSportsData(getSports())
    setSquadsData(getSquads())

    // Load all users (mockUsers + custom users from localStorage)
    const allUsers = getAllUsers()
    setUsersData(allUsers)
  }, [])

  // Save sports
  const saveSportsData = (newSports: Sport[]) => {
    setSportsData(newSports)
    setSports(newSports)
  }

  // Save squads
  const saveSquadsData = (newSquads: Squad[]) => {
    setSquadsData(newSquads)
    setSquads(newSquads)
  }

  // Add new sport
  const handleAddSport = () => {
    if (!newSport.name.trim()) return
    const sport: Sport = {
      id: newSport.name.toLowerCase().replace(/\s+/g, '_'),
      name: newSport.name,
      nameAr: newSport.nameAr || newSport.name,
      active: true
    }
    saveSportsData([...sportsData, sport])
    setNewSport({ name: '', nameAr: '' })
    setShowAddSport(false)
  }

  // Add new squad
  const handleAddSquad = () => {
    if (!newSquad.name.trim()) return
    const squad: Squad = {
      id: newSquad.name.toLowerCase().replace(/\s+/g, '_'),
      name: newSquad.name,
      nameAr: newSquad.nameAr || newSquad.name,
      sportId: newSquad.sportId,
      active: true
    }
    saveSquadsData([...squadsData, squad])
    setNewSquad({ name: '', nameAr: '', sportId: 'all' })
    setShowAddSquad(false)
  }

  // Update sport
  const handleUpdateSport = () => {
    if (!editingSport) return
    saveSportsData(sportsData.map(s => s.id === editingSport.id ? editingSport : s))
    setEditingSport(null)
  }

  // Update squad
  const handleUpdateSquad = () => {
    if (!editingSquad) return
    saveSquadsData(squadsData.map(s => s.id === editingSquad.id ? editingSquad : s))
    setEditingSquad(null)
  }

  // Delete sport
  const handleDeleteSport = (id: string) => {
    if (confirm('Are you sure you want to delete this sport?')) {
      saveSportsData(sportsData.filter(s => s.id !== id))
    }
  }

  // Delete squad
  const handleDeleteSquad = (id: string) => {
    if (confirm('Are you sure you want to delete this squad?')) {
      saveSquadsData(squadsData.filter(s => s.id !== id))
    }
  }

  // Toggle sport active
  const toggleSportActive = (id: string) => {
    saveSportsData(sportsData.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  // Toggle squad active
  const toggleSquadActive = (id: string) => {
    saveSquadsData(squadsData.map(s => s.id === id ? { ...s, active: !s.active } : s))
  }

  // Reset to defaults
  const resetToDefaults = () => {
    if (confirm('Reset all sports and squads to default? This will delete all custom entries.')) {
      saveSportsData(defaultSports)
      saveSquadsData(defaultSquads)
    }
  }

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newAthlete: true,
    injuries: true,
    evaluations: true,
    contracts: false,
  })

  const [profile, setProfile] = useState({
    full_name: currentUser.full_name,
    email: currentUser.email,
    phone: '+966 5xxxxxxxx',
    role: ROLE_DISPLAY_NAMES[currentUser.role],
    language: 'en',
    timezone: 'Asia/Riyadh',
  })

  const allTabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon, adminOnly: false, systemAdminOnly: false },
    { id: 'users', label: 'User Management', icon: UserCog, adminOnly: true, systemAdminOnly: false },
    { id: 'sports', label: 'Sports & Squads', icon: Dumbbell, adminOnly: true, systemAdminOnly: false },
    { id: 'notifications', label: 'Notifications', icon: Bell, adminOnly: false, systemAdminOnly: false },
    { id: 'security', label: 'Security', icon: Shield, adminOnly: false, systemAdminOnly: false },
    { id: 'appearance', label: 'Appearance', icon: Palette, adminOnly: false, systemAdminOnly: false },
    { id: 'system', label: 'System', icon: Database, adminOnly: true, systemAdminOnly: false },
    { id: 'switch_user', label: 'Switch User', icon: ArrowLeftRight, adminOnly: false, systemAdminOnly: true },
  ]

  // Filter tabs based on user role
  // - System tab: only for super_admin and system_admin
  // - Switch User tab: ONLY for the hidden system admin (abdul.sejini@gmail.com)
  const tabs = allTabs.filter(tab => {
    if (tab.systemAdminOnly) {
      // Switch User is ONLY available for the hidden system admin by email
      const emailToCheck = originalUser?.email || currentUser.email
      return emailToCheck.toLowerCase() === HIDDEN_SYSTEM_ADMIN_EMAIL.toLowerCase()
    }
    if (tab.adminOnly) {
      const roleToCheck = originalUser?.role || currentUser.role
      return roleToCheck === 'super_admin' || roleToCheck === 'system_admin'
    }
    return true
  })

  // User Management helpers
  const visibleRoles = getVisibleRoles(currentUser.role)
  const visibleUsers = useMemo(() => {
    return usersData.filter(user => {
      // Hide the system admin from everyone except themselves
      if (isHiddenUser(user.email) && !isHiddenUser(currentUser.email)) {
        return false
      }
      return visibleRoles.includes(user.role)
    })
  }, [usersData, visibleRoles, currentUser.email])

  const filteredUsers = useMemo(() => {
    return visibleUsers.filter(user => {
      const roleMatch = filterRole === 'all' || user.role === filterRole
      const statusMatch = filterStatus === 'all' ||
        (filterStatus === 'active' && user.is_active) ||
        (filterStatus === 'inactive' && !user.is_active)
      return roleMatch && statusMatch
    })
  }, [visibleUsers, filterRole, filterStatus])

  // Update profile when currentUser changes (e.g., after switch user)
  useEffect(() => {
    setProfile(prev => ({
      ...prev,
      full_name: currentUser.full_name,
      email: currentUser.email,
      role: ROLE_DISPLAY_NAMES[currentUser.role],
    }))
  }, [currentUser.id, currentUser.full_name, currentUser.email, currentUser.role])

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'system_admin':
        return <ShieldAlert className="text-red-500" size={20} />
      case 'super_admin':
        return <ShieldCheck className="text-[#FFD700]" size={20} />
      case 'admin':
        return <Shield className="text-blue-500" size={20} />
      default:
        return <UserIcon className="text-gray-500" size={20} />
    }
  }

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'system_admin':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'super_admin':
        return 'bg-[#FFD700]/20 text-[#D4AF00] dark:bg-[#FFD700]/30 dark:text-[#FFD700]'
      case 'admin':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'doctor':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'fitness_coach':
      case 'sport_coach':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      case 'nutritionist':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'psychologist':
        return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return formatDate(dateString)
  }

  const userColumns = [
    {
      key: 'full_name',
      header: 'User',
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFD700]/20 rounded-full flex items-center justify-center">
            {getRoleIcon(user.role)}
          </div>
          <div>
            <span className="font-semibold text-base block" style={{ color: 'var(--foreground)' }}>
              {user.full_name}
            </span>
            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {user.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (user: User) => (
        <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
          {ROLE_DISPLAY_NAMES[user.role]}
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (user: User) => (
        <div className="flex items-center gap-2">
          {user.is_active ? (
            <>
              <CheckCircle className="text-green-500" size={18} />
              <span className="text-green-600 font-medium">Active</span>
            </>
          ) : (
            <>
              <XCircle className="text-red-500" size={18} />
              <span className="text-red-600 font-medium">Inactive</span>
            </>
          )}
        </div>
      ),
    },
    {
      key: 'permissions',
      header: 'Permissions',
      render: (user: User) => {
        // Admin roles have full access
        if (hasFullAccess(user.role)) {
          return (
            <span className="text-xs px-2 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700]">
              Full Access
            </span>
          )
        }

        const sports = user.assigned_sports || []
        const squads = user.assigned_squads || []

        // No assignments = no access
        if (sports.length === 0 && squads.length === 0) {
          return (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
              No Access
            </span>
          )
        }

        const getSportLabel = (id: string) => {
          if (id === 'all') return 'All Sports'
          const sport = sportsData.find(s => s.id === id)
          return sport ? sport.name : id
        }

        const getSquadLabel = (id: string) => {
          if (id === 'all') return 'All Squads'
          const squad = squadsData.find(s => s.id === id)
          return squad ? squad.name : id
        }

        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {sports.slice(0, 2).map(s => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {getSportLabel(s)}
              </span>
            ))}
            {sports.length > 2 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                +{sports.length - 2}
              </span>
            )}
            {squads.slice(0, 2).map(s => (
              <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {getSquadLabel(s)}
              </span>
            ))}
            {squads.length > 2 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                +{squads.length - 2}
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: 'last_login',
      header: 'Last Login',
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <Activity className="text-gray-400" size={16} />
          <span style={{ color: 'var(--foreground-secondary)' }}>
            {formatLastLogin(user.last_login)}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => {
        const canManage = canManageUser(currentUser.role, user.role)
        const isSelf = user.id === currentUser.id

        return (
          <div className="flex items-center gap-2">
            {canManage && !isSelf && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedUser(user)
                    setShowEditUserModal(true)
                  }}
                  className="p-2 text-[#FFD700] hover:bg-[#FFD700]/10 rounded-lg transition-colors"
                  title="Edit User"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedUser(user)
                    setShowResetPasswordModal(true)
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Reset Password"
                >
                  <KeyRound size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Are you sure you want to delete ${user.full_name}?`)) {
                      // Delete logic here
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete User"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
            {isSelf && (
              <span className="text-sm px-2 py-1 rounded" style={{ color: 'var(--muted-foreground)' }}>
                (You)
              </span>
            )}
          </div>
        )
      },
    },
  ]

  const availableRoles = visibleRoles.filter(role => role !== 'system_admin' || currentUser.role === 'system_admin')
  const totalUsers = visibleUsers.length
  const activeUsers = visibleUsers.filter(u => u.is_active).length
  const inactiveUsers = visibleUsers.filter(u => !u.is_active).length

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              Profile Settings
            </h3>

            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-[#FFD700]/20 rounded-full flex items-center justify-center">
                  <UserIcon className="text-[#FFD700]" size={48} />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg hover:bg-[#D4AF00] transition-colors">
                  <Camera size={16} className="text-black" />
                </button>
              </div>
              <div>
                <h4 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                  {profile.full_name}
                </h4>
                <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>
                  {profile.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} size={20} />
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} size={20} />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} size={20} />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Language
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} size={20} />
                  <select
                    value={profile.language}
                    onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button variant="primary" leftIcon={<Save size={20} />}>
                Save Changes
              </Button>
            </div>
          </div>
        )

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                  User Management
                </h3>
                <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>
                  Manage all users and their permissions
                </p>
              </div>
              <Button
                variant="primary"
                leftIcon={<Plus size={20} />}
                onClick={() => setShowAddUserModal(true)}
              >
                Add User
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total Users</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{totalUsers}</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Active</p>
                <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Inactive</p>
                <p className="text-2xl font-bold text-red-600">{inactiveUsers}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Role
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
                  className="px-3 py-2 border rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >
                  <option value="all">All Roles</option>
                  {availableRoles.map(role => (
                    <option key={role} value={role}>{ROLE_DISPLAY_NAMES[role]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                  className="px-3 py-2 border rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <DataTable
              data={filteredUsers}
              columns={userColumns}
              searchable
              searchKeys={['full_name', 'email', 'role'] as (keyof User)[]}
            />
          </div>
        )

      case 'sports':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                  Sports & Squads Management
                </h3>
                <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>
                  Manage sports types and team squads
                </p>
              </div>
              <Button variant="outline" onClick={resetToDefaults}>
                Reset to Defaults
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sports Section */}
              <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="text-[#FFD700]" size={24} />
                    <h4 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Sports</h4>
                  </div>
                  <Button variant="primary" className="flex items-center gap-2" onClick={() => setShowAddSport(true)}>
                    <Plus size={18} />
                    Add Sport
                  </Button>
                </div>

                {/* Add Sport Form */}
                {showAddSport && (
                  <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Sport Name (English)"
                        value={newSport.name}
                        onChange={(e) => setNewSport({ ...newSport, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-transparent"
                        style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                      />
                      <input
                        type="text"
                        placeholder="اسم الرياضة (عربي)"
                        value={newSport.nameAr}
                        onChange={(e) => setNewSport({ ...newSport, nameAr: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-transparent text-right"
                        style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                        dir="rtl"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" onClick={handleAddSport}>
                        <Save size={16} className="mr-1" /> Save
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddSport(false)}>
                        <X size={16} className="mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Sports List */}
                <div className="space-y-2 max-h-[350px] overflow-y-auto">
                  {sportsData.map((sport) => (
                    <div
                      key={sport.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-[#FFD700]/5 transition-colors"
                      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                    >
                      {editingSport?.id === sport.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={editingSport.name}
                            onChange={(e) => setEditingSport({ ...editingSport, name: e.target.value })}
                            className="flex-1 px-3 py-1 rounded bg-transparent"
                            style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                          />
                          <input
                            type="text"
                            value={editingSport.nameAr}
                            onChange={(e) => setEditingSport({ ...editingSport, nameAr: e.target.value })}
                            className="flex-1 px-3 py-1 rounded bg-transparent text-right"
                            style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                            dir="rtl"
                          />
                          <button onClick={handleUpdateSport} className="p-1 text-green-500 hover:bg-green-500/20 rounded">
                            <Save size={18} />
                          </button>
                          <button onClick={() => setEditingSport(null)} className="p-1 text-red-500 hover:bg-red-500/20 rounded">
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleSportActive(sport.id)}
                              className={`w-4 h-4 rounded-full ${sport.active ? 'bg-green-500' : 'bg-gray-400'}`}
                              title={sport.active ? 'Active' : 'Inactive'}
                            />
                            <span style={{ color: 'var(--foreground)' }}>{sport.name}</span>
                            <span style={{ color: 'var(--muted-foreground)' }}>({sport.nameAr})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingSport(sport)}
                              className="p-2 text-[#FFD700] hover:bg-[#FFD700]/20 rounded-lg transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteSport(sport.id)}
                              className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Squads Section */}
              <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="text-[#FFD700]" size={24} />
                    <h4 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Squads</h4>
                  </div>
                  <Button variant="primary" className="flex items-center gap-2" onClick={() => setShowAddSquad(true)}>
                    <Plus size={18} />
                    Add Squad
                  </Button>
                </div>

                {/* Add Squad Form */}
                {showAddSquad && (
                  <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Squad Name (English)"
                        value={newSquad.name}
                        onChange={(e) => setNewSquad({ ...newSquad, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-transparent"
                        style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                      />
                      <input
                        type="text"
                        placeholder="اسم الفريق (عربي)"
                        value={newSquad.nameAr}
                        onChange={(e) => setNewSquad({ ...newSquad, nameAr: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-transparent text-right"
                        style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                        dir="rtl"
                      />
                    </div>
                    <div className="mb-4">
                      <select
                        value={newSquad.sportId}
                        onChange={(e) => setNewSquad({ ...newSquad, sportId: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-transparent"
                        style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                      >
                        <option value="all">All Sports - جميع الرياضات</option>
                        {sportsData.filter(s => s.active).map(sport => (
                          <option key={sport.id} value={sport.id}>{sport.name} - {sport.nameAr}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" onClick={handleAddSquad}>
                        <Save size={16} className="mr-1" /> Save
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddSquad(false)}>
                        <X size={16} className="mr-1" /> Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Squads List */}
                <div className="space-y-2 max-h-[350px] overflow-y-auto">
                  {squadsData.map((squad) => (
                    <div
                      key={squad.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-[#FFD700]/5 transition-colors"
                      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                    >
                      {editingSquad?.id === squad.id ? (
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingSquad.name}
                              onChange={(e) => setEditingSquad({ ...editingSquad, name: e.target.value })}
                              className="flex-1 px-3 py-1 rounded bg-transparent"
                              style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                            />
                            <input
                              type="text"
                              value={editingSquad.nameAr}
                              onChange={(e) => setEditingSquad({ ...editingSquad, nameAr: e.target.value })}
                              className="flex-1 px-3 py-1 rounded bg-transparent text-right"
                              style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                              dir="rtl"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={editingSquad.sportId}
                              onChange={(e) => setEditingSquad({ ...editingSquad, sportId: e.target.value })}
                              className="flex-1 px-3 py-1 rounded bg-transparent"
                              style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                            >
                              <option value="all">All Sports</option>
                              {sportsData.filter(s => s.active).map(sport => (
                                <option key={sport.id} value={sport.id}>{sport.name}</option>
                              ))}
                            </select>
                            <button onClick={handleUpdateSquad} className="p-1 text-green-500 hover:bg-green-500/20 rounded">
                              <Save size={18} />
                            </button>
                            <button onClick={() => setEditingSquad(null)} className="p-1 text-red-500 hover:bg-red-500/20 rounded">
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleSquadActive(squad.id)}
                              className={`w-4 h-4 rounded-full ${squad.active ? 'bg-green-500' : 'bg-gray-400'}`}
                              title={squad.active ? 'Active' : 'Inactive'}
                            />
                            <div>
                              <span style={{ color: 'var(--foreground)' }}>{squad.name}</span>
                              <span style={{ color: 'var(--muted-foreground)' }}> ({squad.nameAr})</span>
                              {squad.sportId !== 'all' && (
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#FFD700]/20 text-[#FFD700]">
                                  {sportsData.find(s => s.id === squad.sportId)?.name || squad.sportId}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingSquad(squad)}
                              className="p-2 text-[#FFD700] hover:bg-[#FFD700]/20 rounded-lg transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteSquad(squad.id)}
                              className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              Notification Preferences
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
                <h4 className="text-lg font-medium mb-4" style={{ color: 'var(--foreground)' }}>
                  Notification Channels
                </h4>
                <div className="space-y-3">
                  {[
                    { key: 'push', label: 'Push Notifications', desc: 'Receive browser push notifications' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#FFD700] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
                <h4 className="text-lg font-medium mb-4" style={{ color: 'var(--foreground)' }}>
                  Event Notifications
                </h4>
                <div className="space-y-3">
                  {[
                    { key: 'newAthlete', label: 'New Athlete Added', desc: 'When a new athlete joins the system' },
                    { key: 'injuries', label: 'Injury Reports', desc: 'When an injury is reported' },
                    { key: 'evaluations', label: 'Coach Evaluations', desc: 'When a new evaluation is submitted' },
                    { key: 'contracts', label: 'Contract Updates', desc: 'Contract renewals and expirations' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium" style={{ color: 'var(--foreground)' }}>{item.label}</p>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#FFD700] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button variant="primary" leftIcon={<Save size={20} />}>
                Save Preferences
              </Button>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              Security Settings
            </h3>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
              <h4 className="text-lg font-medium mb-4" style={{ color: 'var(--foreground)' }}>
                Change Password
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-12 py-3 border rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]"
                      style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]"
                      style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]"
                      style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button variant="primary" leftIcon={<Lock size={20} />}>
                  Update Password
                </Button>
              </div>
            </div>


            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
              <h4 className="text-lg font-medium mb-4" style={{ color: 'var(--foreground)' }}>
                Active Sessions
              </h4>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                <div>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>Current Session</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Chrome on macOS - Riyadh, SA</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">Active</span>
              </div>
            </div>
          </div>
        )

      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              Appearance Settings
            </h3>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
              <h4 className="text-lg font-medium mb-4" style={{ color: 'var(--foreground)' }}>
                Theme
              </h4>
              <p className="text-base mb-4" style={{ color: 'var(--muted-foreground)' }}>
                Use the toggle in the header to switch between light and dark mode.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border-2 cursor-pointer hover:border-[#FFD700] transition-colors" style={{ backgroundColor: '#FFFFFF', borderColor: 'var(--border)' }}>
                  <div className="h-20 rounded bg-gray-100 mb-2"></div>
                  <p className="font-medium text-gray-900">Light Mode</p>
                </div>
                <div className="p-4 rounded-lg border-2 cursor-pointer hover:border-[#FFD700] transition-colors" style={{ backgroundColor: '#1E293B', borderColor: 'var(--border)' }}>
                  <div className="h-20 rounded bg-gray-800 mb-2"></div>
                  <p className="font-medium text-gray-100">Dark Mode</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
              <h4 className="text-lg font-medium mb-4" style={{ color: 'var(--foreground)' }}>
                Accent Color
              </h4>
              <p className="text-base mb-4" style={{ color: 'var(--muted-foreground)' }}>
                Al-Ittihad FC Gold is the default accent color.
              </p>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full bg-[#FFD700] border-4 border-[#FFD700]/30 shadow-lg"></button>
                <button className="w-10 h-10 rounded-full bg-blue-500 hover:ring-2 ring-blue-500/30"></button>
                <button className="w-10 h-10 rounded-full bg-green-500 hover:ring-2 ring-green-500/30"></button>
                <button className="w-10 h-10 rounded-full bg-purple-500 hover:ring-2 ring-purple-500/30"></button>
              </div>
            </div>
          </div>
        )

      case 'system':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              System Settings
            </h3>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
              <h4 className="text-lg font-medium mb-4" style={{ color: 'var(--foreground)' }}>
                Database
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--foreground)' }}>Database Provider</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Supabase</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--foreground)' }}>Connection Status</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--foreground)' }}>Last Sync</span>
                  <span style={{ color: 'var(--muted-foreground)' }}>Just now</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
              <h4 className="text-lg font-medium mb-4" style={{ color: 'var(--foreground)' }}>
                Data Export
              </h4>
              <p className="text-base mb-4" style={{ color: 'var(--muted-foreground)' }}>
                Export all your data in various formats.
              </p>
              <div className="flex gap-3">
                <Button variant="outline">Export as CSV</Button>
                <Button variant="outline">Export as JSON</Button>
                <Button variant="outline">Export as PDF</Button>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <h4 className="text-lg font-medium mb-4 text-red-600">Danger Zone</h4>
              <p className="text-base mb-4 text-red-600">These actions are irreversible.</p>
              <div className="flex gap-3">
                <Button variant="danger">Clear Cache</Button>
                <Button variant="danger">Reset Settings</Button>
              </div>
            </div>
          </div>
        )

      case 'switch_user':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                  Switch User
                </h3>
                <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>
                  View the system as another user (System Admin only)
                </p>
              </div>
              {isSwitchedUser && (
                <Button
                  variant="primary"
                  leftIcon={<RefreshCw size={18} />}
                  onClick={switchBack}
                >
                  Switch Back to {originalUser?.full_name}
                </Button>
              )}
            </div>

            {/* Current Status */}
            {isSwitchedUser && (
              <div className="p-4 rounded-lg bg-[#FFD700]/20" style={{ border: '2px solid #FFD700' }}>
                <div className="flex items-center gap-3">
                  <ArrowLeftRight className="text-[#FFD700]" size={24} />
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                      Currently viewing as: {currentUser.full_name}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Role: {ROLE_DISPLAY_NAMES[currentUser.role]} • Original: {originalUser?.full_name} ({originalUser ? ROLE_DISPLAY_NAMES[originalUser.role] : ''})
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="p-4 rounded-lg bg-yellow-500/10" style={{ border: '1px solid var(--border)' }}>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                <ShieldAlert size={18} />
                Switch User allows you to view the system from another user&apos;s perspective. All actions will be performed as that user.
              </p>
            </div>

            {/* Users List */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
              <h4 className="text-lg font-medium mb-4" style={{ color: 'var(--foreground)' }}>
                Select User to Switch To
              </h4>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {mockUsers.map((user) => {
                  const isCurrentSwitch = currentUser.id === user.id
                  const isOriginal = originalUser?.id === user.id

                  return (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                        isCurrentSwitch
                          ? 'bg-[#FFD700]/20 border-2 border-[#FFD700]'
                          : 'hover:bg-[#FFD700]/10'
                      }`}
                      style={!isCurrentSwitch ? { backgroundColor: 'var(--card)', border: '1px solid var(--border)' } : undefined}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center">
                          {user.role === 'system_admin' ? (
                            <ShieldAlert className="text-red-500" size={24} />
                          ) : user.role === 'super_admin' ? (
                            <ShieldCheck className="text-[#FFD700]" size={24} />
                          ) : (
                            <UserIcon className="text-gray-500" size={24} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                            {user.full_name}
                            {isOriginal && (
                              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500">
                                Original
                              </span>
                            )}
                            {isCurrentSwitch && !isOriginal && (
                              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#FFD700]/20 text-[#FFD700]">
                                Current
                              </span>
                            )}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                            {user.email}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(user.role)}`}>
                            {ROLE_DISPLAY_NAMES[user.role]}
                          </span>
                        </div>
                      </div>
                      <div>
                        {!isCurrentSwitch && (
                          <Button
                            variant="outline"
                            onClick={() => switchToUser(user)}
                          >
                            Switch to User
                          </Button>
                        )}
                        {isCurrentSwitch && !isOriginal && (
                          <span className="text-sm text-[#FFD700] font-medium">Viewing as this user</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div>
      <Header title="Settings" userName={currentUser.full_name} userRole={ROLE_DISPLAY_NAMES[currentUser.role]} />

      <div className="p-6">
        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-64 shrink-0 rounded-xl p-4" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#FFD700] text-black font-semibold'
                        : 'hover:bg-[#FFD700]/10'
                    }`}
                    style={activeTab !== tab.id ? { color: 'var(--foreground)' } : undefined}
                  >
                    <Icon size={20} />
                    <span className="text-base">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 rounded-xl p-6" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <UserFormModal
          currentUserRole={currentUser.role}
          sportsData={sportsData}
          squadsData={squadsData}
          onClose={() => setShowAddUserModal(false)}
          onSave={(userData) => {
            // Create new user object with default password
            const newUser: User = {
              id: `user-${Date.now()}`,
              email: userData.email || '',
              full_name: userData.full_name || '',
              phone: userData.phone || '',
              password: getDefaultPassword(), // Set default password for new users
              role: (userData.role || 'sport_coach') as UserRole,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              assigned_sports: userData.assigned_sports || [],
              assigned_squads: userData.assigned_squads || [],
            }
            // Save to localStorage so they can login
            addCustomUser(newUser)
            // Update local state to reflect changes immediately
            setUsersData(prev => [...prev, newUser])
            console.log('User added and can now login:', newUser.email, 'with password:', getDefaultPassword())
            setShowAddUserModal(false)
          }}
        />
      )}

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <UserFormModal
          user={selectedUser}
          currentUserRole={currentUser.role}
          sportsData={sportsData}
          squadsData={squadsData}
          onClose={() => {
            setShowEditUserModal(false)
            setSelectedUser(null)
          }}
          onSave={(userData) => {
            // Update user with new data (preserve password)
            const updatedUser: User = {
              ...selectedUser,
              ...userData,
              updated_at: new Date().toISOString(),
            } as User
            // Save to localStorage
            updateUser(updatedUser)
            // Update local state to reflect changes immediately
            setUsersData(prev => prev.map(u => u.id === selectedUser.id ? updatedUser : u))
            console.log('User updated:', updatedUser.email)
            setShowEditUserModal(false)
            setSelectedUser(null)
          }}
        />
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedUser && (
        <ResetPasswordModal
          user={selectedUser}
          onClose={() => {
            setShowResetPasswordModal(false)
            setSelectedUser(null)
          }}
          onReset={() => {
            // Reset password to default Welcome@123
            const defaultPwd = getDefaultPassword()
            const success = updateUserPassword(selectedUser.id, defaultPwd)
            if (success) {
              console.log('Password reset to default for user:', selectedUser.email)
              // Update local state to reflect changes
              setUsersData(prev => prev.map(u =>
                u.id === selectedUser.id ? { ...u, password: defaultPwd, updated_at: new Date().toISOString() } : u
              ))
            }
            setShowResetPasswordModal(false)
            setSelectedUser(null)
          }}
        />
      )}
    </div>
  )
}

// User Form Modal Component
interface UserFormModalProps {
  user?: User
  currentUserRole: UserRole
  sportsData: Sport[]
  squadsData: Squad[]
  onClose: () => void
  onSave: (userData: Partial<User>) => void
}

interface CreatedUserCredentials {
  email: string
  password: string
  full_name: string
}

function UserFormModal({ user, currentUserRole, sportsData, squadsData, onClose, onSave }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'sport_coach' as UserRole,
    is_active: user?.is_active ?? true,
    assigned_sports: user?.assigned_sports || [] as string[],
    assigned_squads: user?.assigned_squads || [] as string[],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [createdCredentials, setCreatedCredentials] = useState<CreatedUserCredentials | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const isEditing = !!user
  const visibleRoles = getVisibleRoles(currentUserRole)
  const assignableRoles = visibleRoles.filter(role => {
    if (currentUserRole === 'system_admin') return true
    if (currentUserRole === 'super_admin') return role !== 'system_admin' && role !== 'super_admin'
    return role !== 'system_admin' && role !== 'super_admin' && role !== 'admin'
  })

  // Check if selected role has full access (admin roles don't need sport/squad assignments)
  const roleHasFullAccess = hasFullAccess(formData.role)

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (isEditing) {
      // For editing, just call onSave directly
      onSave(formData)
      return
    }

    // For new user, call the API
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
          assigned_sports: formData.assigned_sports,
          assigned_squads: formData.assigned_squads,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user')
      }

      // Show credentials to admin
      setCreatedCredentials({
        email: data.credentials.email,
        password: data.credentials.password,
        full_name: data.user.full_name,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle sport selection
  const toggleSport = (sportId: string) => {
    if (sportId === 'all') {
      // If selecting "all", clear other selections
      setFormData({
        ...formData,
        assigned_sports: formData.assigned_sports.includes('all') ? [] : ['all']
      })
    } else {
      // Remove "all" if selecting specific sport
      const newSports = formData.assigned_sports.filter(s => s !== 'all')
      if (newSports.includes(sportId)) {
        setFormData({ ...formData, assigned_sports: newSports.filter(s => s !== sportId) })
      } else {
        setFormData({ ...formData, assigned_sports: [...newSports, sportId] })
      }
    }
  }

  // Toggle squad selection
  const toggleSquad = (squadId: string) => {
    if (squadId === 'all') {
      // If selecting "all", clear other selections
      setFormData({
        ...formData,
        assigned_squads: formData.assigned_squads.includes('all') ? [] : ['all']
      })
    } else {
      // Remove "all" if selecting specific squad
      const newSquads = formData.assigned_squads.filter(s => s !== 'all')
      if (newSquads.includes(squadId)) {
        setFormData({ ...formData, assigned_squads: newSquads.filter(s => s !== squadId) })
      } else {
        setFormData({ ...formData, assigned_squads: [...newSquads, squadId] })
      }
    }
  }

  // If credentials were created, show success screen
  if (createdCredentials) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="rounded-xl p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
              User Created Successfully!
            </h2>
            <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
              Share these credentials with {createdCredentials.full_name}
            </p>
          </div>

          <div className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
            <div>
              <label className="block text-xs font-medium mb-1 text-[#FFD700]">Email</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={createdCredentials.email}
                  className="flex-1 px-3 py-2 rounded-lg bg-transparent text-base"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(createdCredentials.email, 'email')}
                  className={`p-2 rounded-lg transition-colors ${
                    copiedField === 'email' ? 'bg-green-500 text-white' : 'bg-[#FFD700]/20 text-[#FFD700] hover:bg-[#FFD700]/30'
                  }`}
                >
                  {copiedField === 'email' ? <CheckCircle size={18} /> : <Mail size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-[#FFD700]">Password</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={createdCredentials.password}
                  className="flex-1 px-3 py-2 rounded-lg bg-transparent text-base font-mono"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(createdCredentials.password, 'password')}
                  className={`p-2 rounded-lg transition-colors ${
                    copiedField === 'password' ? 'bg-green-500 text-white' : 'bg-[#FFD700]/20 text-[#FFD700] hover:bg-[#FFD700]/30'
                  }`}
                >
                  {copiedField === 'password' ? <CheckCircle size={18} /> : <KeyRound size={18} />}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const text = `Login Credentials for ${createdCredentials.full_name}:\n\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\n\nPlease change your password after first login.`
                copyToClipboard(text, 'all')
              }}
              className={`w-full py-2 rounded-lg transition-colors text-sm font-medium ${
                copiedField === 'all' ? 'bg-green-500 text-white' : 'bg-[#FFD700] text-black hover:bg-[#D4AF00]'
              }`}
            >
              {copiedField === 'all' ? 'Copied!' : 'Copy All Credentials'}
            </button>
          </div>

          <div className="p-3 rounded-lg bg-yellow-500/10 mt-4" style={{ border: '1px solid var(--border)' }}>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Make sure to save these credentials securely. The password will not be shown again.
            </p>
          </div>

          <div className="mt-6">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                onSave(formData)
                onClose()
              }}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
          {isEditing ? 'Edit User' : 'Add New User'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                placeholder="user@ittihadclub.sa"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                placeholder="+966 5xxxxxxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Role *
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-4 py-2 border rounded-lg bg-transparent text-base focus:outline-none focus:border-[#FFD700]"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                {assignableRoles.map(role => (
                  <option key={role} value={role}>{ROLE_DISPLAY_NAMES[role]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sports & Squads Assignment - Only show for non-admin roles */}
          {!roleHasFullAccess && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
              <h4 className="font-semibold mb-4 text-[#FFD700]">Athlete Access Permissions</h4>
              <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
                Select which sports and squads this user can access. User will only see athletes matching these permissions.
              </p>

              {/* Sports Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Assigned Sports
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSport('all')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      formData.assigned_sports.includes('all')
                        ? 'bg-[#FFD700] text-black'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-[#FFD700]/20'
                    }`}
                    style={!formData.assigned_sports.includes('all') ? { color: 'var(--foreground)' } : undefined}
                  >
                    All Sports
                  </button>
                  {sportsData.filter(s => s.active).map(sport => (
                    <button
                      key={sport.id}
                      type="button"
                      onClick={() => toggleSport(sport.id)}
                      disabled={formData.assigned_sports.includes('all')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        formData.assigned_sports.includes(sport.id)
                          ? 'bg-blue-500 text-white'
                          : formData.assigned_sports.includes('all')
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 dark:bg-gray-700 hover:bg-blue-500/20'
                      }`}
                      style={!formData.assigned_sports.includes(sport.id) && !formData.assigned_sports.includes('all') ? { color: 'var(--foreground)' } : undefined}
                    >
                      {sport.name}
                    </button>
                  ))}
                </div>
                {formData.assigned_sports.length > 0 && (
                  <p className="text-xs mt-2 text-[#FFD700]">
                    Selected: {formData.assigned_sports.includes('all') ? 'All Sports' : formData.assigned_sports.map(id => sportsData.find(s => s.id === id)?.name || id).join(', ')}
                  </p>
                )}
              </div>

              {/* Squads Selection */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Assigned Squads
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSquad('all')}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      formData.assigned_squads.includes('all')
                        ? 'bg-[#FFD700] text-black'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-[#FFD700]/20'
                    }`}
                    style={!formData.assigned_squads.includes('all') ? { color: 'var(--foreground)' } : undefined}
                  >
                    All Squads
                  </button>
                  {squadsData.filter(s => s.active).map(squad => (
                    <button
                      key={squad.id}
                      type="button"
                      onClick={() => toggleSquad(squad.id)}
                      disabled={formData.assigned_squads.includes('all')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        formData.assigned_squads.includes(squad.id)
                          ? 'bg-green-500 text-white'
                          : formData.assigned_squads.includes('all')
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 dark:bg-gray-700 hover:bg-green-500/20'
                      }`}
                      style={!formData.assigned_squads.includes(squad.id) && !formData.assigned_squads.includes('all') ? { color: 'var(--foreground)' } : undefined}
                    >
                      {squad.name}
                    </button>
                  ))}
                </div>
                {formData.assigned_squads.length > 0 && (
                  <p className="text-xs mt-2 text-[#FFD700]">
                    Selected: {formData.assigned_squads.includes('all') ? 'All Squads' : formData.assigned_squads.map(id => squadsData.find(s => s.id === id)?.name || id).join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {roleHasFullAccess && (
            <div className="p-4 rounded-lg bg-[#FFD700]/10" style={{ border: '1px solid var(--border)' }}>
              <p className="text-sm text-[#FFD700] flex items-center gap-2">
                <ShieldCheck size={18} />
                This role has full access to all athletes. No sport/squad restrictions needed.
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-[#FFD700] focus:ring-[#FFD700]"
            />
            <label htmlFor="is_active" className="text-base" style={{ color: 'var(--foreground)' }}>
              User is active
            </label>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10" style={{ border: '1px solid var(--border)' }}>
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {!isEditing && (
            <div className="p-3 rounded-lg bg-blue-500/10" style={{ border: '1px solid var(--border)' }}>
              <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                <KeyRound size={16} />
                A random password will be generated automatically. You can share it with the user after creation.
              </p>
            </div>
          )}

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : isEditing ? 'Update User' : 'Create User'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Reset Password Modal Component
interface ResetPasswordModalProps {
  user: User
  onClose: () => void
  onReset: () => void
}

function ResetPasswordModal({ user, onClose, onReset }: ResetPasswordModalProps) {
  const defaultPassword = getDefaultPassword()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onReset()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="rounded-xl p-6 w-full max-w-md" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
            <KeyRound className="text-blue-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
              Reset Password
            </h2>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {user.full_name}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 rounded-lg bg-yellow-500/10" style={{ border: '1px solid var(--border)' }}>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              This will reset the password for <strong>{user.email}</strong> to the default password.
            </p>
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>
              New Password will be:
            </label>
            <div className="flex items-center gap-3">
              <Lock className="text-[#FFD700]" size={20} />
              <code className="text-lg font-mono font-bold" style={{ color: 'var(--foreground)' }}>
                {defaultPassword}
              </code>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-500/10" style={{ border: '1px solid var(--border)' }}>
            <p className="text-sm text-blue-500 flex items-center gap-2">
              <Shield size={16} />
              The user should change this password after logging in.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" variant="primary" leftIcon={<KeyRound size={18} />}>
              Reset Password
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
