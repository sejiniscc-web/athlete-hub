'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/ui/Header'
import { useUser } from '@/context/UserContext'
import { ROLE_DISPLAY_NAMES, hasFullAccess } from '@/types/database'
import {
  Users,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  FileText,
  CheckCircle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  BarChart3,
  PieChart,
  Calendar,
  Zap,
  Award,
  AlertTriangle,
  RefreshCw,
  Loader2
} from 'lucide-react'

// Types for user analytics
interface UserActivity {
  id: string
  user_id: string
  user_name: string
  user_role: string
  action: string
  page: string
  timestamp: string
  details?: string
}

interface UserStats {
  id: string
  full_name: string
  email: string
  role: string
  is_active: boolean
  total_logins: number
  total_actions: number
  pages_visited: number
  records_created: number
  records_edited: number
  last_login: string
  avg_session_duration: number
  login_streak: number
  performance_score: number
  trend: 'up' | 'down' | 'stable'
}

interface PageUsage {
  page: string
  visits: number
  percentage: number
}

interface OverallStats {
  activeUsers: number
  totalUsers: number
  totalActions: number
  totalLogins: number
  avgPerformance: number
  avgSessionDuration: number
}

export default function UserAnalyticsPage() {
  const { currentUser, isLoading: userLoading } = useUser()
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'all'>('week')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Data states
  const [overallStats, setOverallStats] = useState<OverallStats>({
    activeUsers: 0,
    totalUsers: 0,
    totalActions: 0,
    totalLogins: 0,
    avgPerformance: 0,
    avgSessionDuration: 0
  })
  const [userStats, setUserStats] = useState<UserStats[]>([])
  const [pageUsage, setPageUsage] = useState<PageUsage[]>([])
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([])

  // Check if user has admin access
  const isAdmin = currentUser && hasFullAccess(currentUser.role)

  // Fetch analytics data
  const fetchAnalytics = useCallback(async (showRefreshing = false) => {
    if (!isAdmin) return

    if (showRefreshing) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setError(null)

    try {
      const response = await fetch(`/api/activity/stats?period=${selectedPeriod}`)

      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data = await response.json()

      setOverallStats(data.overallStats || {
        activeUsers: 0,
        totalUsers: 0,
        totalActions: 0,
        totalLogins: 0,
        avgPerformance: 0,
        avgSessionDuration: 0
      })
      setUserStats(data.userStats || [])
      setPageUsage(data.pageUsage || [])
      setRecentActivities(data.recentActivities || [])
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Failed to load analytics data')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [isAdmin, selectedPeriod])

  // Fetch data on mount and when period changes
  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics()
    }
  }, [isAdmin, selectedPeriod, fetchAnalytics])

  // Filter users by role
  const filteredUsers = selectedRole === 'all'
    ? userStats
    : userStats.filter(u => u.role === selectedRole)

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
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

  // Get performance color
  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  // Get performance bar color
  const getPerformanceBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'Never'

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Get action icon
  const getActionIcon = (action: string) => {
    if (action.includes('Created') || action.includes('Added')) return <FileText className="text-green-500" size={18} />
    if (action.includes('Updated') || action.includes('Modified')) return <Activity className="text-blue-500" size={18} />
    if (action.includes('Viewed')) return <Eye className="text-gray-500" size={18} />
    if (action.includes('Completed')) return <CheckCircle className="text-purple-500" size={18} />
    if (action.includes('Reported') || action.includes('Deleted')) return <AlertTriangle className="text-red-500" size={18} />
    if (action.includes('Logged in')) return <Zap className="text-green-500" size={18} />
    if (action.includes('Logged out')) return <XCircle className="text-gray-400" size={18} />
    return <MousePointer className="text-[#FFD700]" size={18} />
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full" />
      </div>
    )
  }

  // Access denied for non-admin users
  if (!isAdmin) {
    return (
      <div>
        <Header
          title="User Analytics"
          userName={currentUser?.full_name || 'User'}
          userRole={currentUser ? ROLE_DISPLAY_NAMES[currentUser.role] : 'Unknown'}
        />
        <div className="p-6">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShieldAlert className="text-red-500 mb-4" size={64} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              Access Denied
            </h2>
            <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
              This page is only accessible to system administrators.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header
        title="User Analytics"
        userName={currentUser?.full_name || 'User'}
        userRole={currentUser ? ROLE_DISPLAY_NAMES[currentUser.role] : 'Unknown'}
      />

      <div className="p-6 space-y-6">
        {/* Admin Badge */}
        <div
          className="p-4 rounded-xl flex items-center gap-4"
          style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}
        >
          <ShieldCheck className="text-[#FFD700] flex-shrink-0" size={24} />
          <div className="flex-1">
            <p className="font-medium" style={{ color: 'var(--foreground)' }}>
              Administrator Dashboard
            </p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Monitor user activity and system performance across all departments
            </p>
          </div>
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:bg-[#FFD700]/10"
            style={{ border: '1px solid var(--border)' }}
          >
            {isRefreshing ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <RefreshCw size={18} />
            )}
            <span className="text-sm">Refresh</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
            {error}
          </div>
        )}

        {/* Period Filter */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Time Period:</span>
          <div className="flex gap-2">
            {(['today', 'week', 'month', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-[#FFD700] text-black'
                    : 'hover:bg-[#FFD700]/10'
                }`}
                style={selectedPeriod !== period ? { color: 'var(--foreground)', backgroundColor: 'var(--muted)' } : undefined}
              >
                {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="rounded-xl p-5 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Active Users</p>
                    <p className="text-3xl font-bold text-[#FFD700]">{overallStats.activeUsers}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>of {overallStats.totalUsers} total</p>
                  </div>
                  <Users className="text-[#FFD700]" size={32} />
                </div>
              </div>

              <div className="rounded-xl p-5 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total Actions</p>
                    <p className="text-3xl font-bold text-blue-500">{overallStats.totalActions.toLocaleString()}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>all activities</p>
                  </div>
                  <Activity className="text-blue-500" size={32} />
                </div>
              </div>

              <div className="rounded-xl p-5 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total Logins</p>
                    <p className="text-3xl font-bold text-green-500">{overallStats.totalLogins}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>login sessions</p>
                  </div>
                  <Zap className="text-green-500" size={32} />
                </div>
              </div>

              <div className="rounded-xl p-5 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Session</p>
                    <p className="text-3xl font-bold text-purple-500">{overallStats.avgSessionDuration}m</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>per user</p>
                  </div>
                  <Clock className="text-purple-500" size={32} />
                </div>
              </div>

              <div className="rounded-xl p-5 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Avg Performance</p>
                    <p className={`text-3xl font-bold ${getPerformanceColor(overallStats.avgPerformance)}`}>{overallStats.avgPerformance}%</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>score</p>
                  </div>
                  <Award className="text-orange-500" size={32} />
                </div>
              </div>

              <div className="rounded-xl p-5 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Inactive</p>
                    <p className="text-3xl font-bold text-red-500">{overallStats.totalUsers - overallStats.activeUsers}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>users</p>
                  </div>
                  <XCircle className="text-red-500" size={32} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Performance Table */}
              <div className="lg:col-span-2 rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="p-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="text-[#FFD700]" size={24} />
                    <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>User Performance</h2>
                  </div>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-transparent text-sm"
                    style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                  >
                    <option value="all">All Roles</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="fitness_coach">Fitness Coach</option>
                    <option value="sport_coach">Sport Coach</option>
                    <option value="nutritionist">Nutritionist</option>
                    <option value="psychologist">Psychologist</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  {filteredUsers.length === 0 ? (
                    <div className="p-8 text-center" style={{ color: 'var(--muted-foreground)' }}>
                      No users found
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700]">User</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700]">Role</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-[#FFD700]">Actions</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-[#FFD700]">Streak</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700]">Performance</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700]">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-[#FFD700]/5 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.is_active ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                  {user.is_active ? (
                                    <CheckCircle className="text-green-500" size={20} />
                                  ) : (
                                    <XCircle className="text-gray-400" size={20} />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{user.full_name}</p>
                                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{formatTimeAgo(user.last_login)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                {ROLE_DISPLAY_NAMES[user.role as keyof typeof ROLE_DISPLAY_NAMES] || user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{user.total_actions}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Zap className={user.login_streak > 0 ? 'text-[#FFD700]' : 'text-gray-400'} size={16} />
                                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{user.login_streak}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden" style={{ width: '80px' }}>
                                  <div
                                    className={`h-full rounded-full ${getPerformanceBarColor(user.performance_score)}`}
                                    style={{ width: `${user.performance_score}%` }}
                                  />
                                </div>
                                <span className={`font-semibold text-sm ${getPerformanceColor(user.performance_score)}`}>
                                  {user.performance_score}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {user.trend === 'up' && <TrendingUp className="text-green-500" size={20} />}
                              {user.trend === 'down' && <TrendingDown className="text-red-500" size={20} />}
                              {user.trend === 'stable' && <div className="w-5 h-0.5 bg-gray-400 rounded" />}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Page Usage */}
              <div className="rounded-xl shadow-lg p-6" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <PieChart className="text-[#FFD700]" size={24} />
                  <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Page Usage</h2>
                </div>

                {pageUsage.length === 0 ? (
                  <div className="text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
                    No page visit data yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pageUsage.map((page, index) => (
                      <div key={page.page} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{page.page}</span>
                          <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{page.visits} visits</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${page.percentage}%`,
                              backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#3B82F6' : index === 2 ? '#10B981' : index === 3 ? '#8B5CF6' : index === 4 ? '#F59E0B' : index === 5 ? '#EF4444' : '#6B7280'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="p-6 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <Calendar className="text-[#FFD700]" size={24} />
                <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Recent Activity</h2>
              </div>

              {recentActivities.length === 0 ? (
                <div className="p-8 text-center" style={{ color: 'var(--muted-foreground)' }}>
                  No recent activity
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-[#FFD700]/5 transition-colors flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 flex items-center justify-center flex-shrink-0">
                        {getActionIcon(activity.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold" style={{ color: 'var(--foreground)' }}>{activity.user_name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(activity.user_role)}`}>
                            {ROLE_DISPLAY_NAMES[activity.user_role as keyof typeof ROLE_DISPLAY_NAMES] || activity.user_role}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          {activity.action} {activity.page && <>in <span className="text-[#FFD700]">{activity.page}</span></>}
                          {activity.details && <span className="text-xs"> - {activity.details}</span>}
                        </p>
                      </div>
                      <span className="text-xs whitespace-nowrap" style={{ color: 'var(--muted-foreground)' }}>
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
