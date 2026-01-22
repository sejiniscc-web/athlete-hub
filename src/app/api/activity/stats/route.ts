import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mockUsers, getAllUsers } from '@/context/UserContext'
import { ROLE_DISPLAY_NAMES, hasFullAccess, isHiddenUser } from '@/types/database'

// GET - Get user stats and analytics
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'week' // today, week, month, all

    // Calculate date range
    let startDate: Date | null = null
    const now = new Date()

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'all':
        startDate = null
        break
    }

    // Get all users (from mock users - filter out hidden system admin)
    const allUsers = getAllUsers().filter(u => !isHiddenUser(u.email))

    // Check if activity tables exist
    let hasActivityTables = true
    const { error: tableCheckError } = await supabase
      .from('user_activity_logs')
      .select('id')
      .limit(1)

    if (tableCheckError?.code === '42P01') {
      hasActivityTables = false
    }

    // Initialize stats from mock data if tables don't exist
    let userStatsFromDb: Record<string, {
      total_logins: number
      total_actions: number
      total_pages_visited: number
      total_records_created: number
      total_records_updated: number
      login_streak: number
      avg_session_duration: number
      last_activity_at: string | null
    }> = {}

    let activitiesFromDb: {
      user_id: string
      action: string
      page: string | null
      created_at: string
    }[] = []

    let pageVisitsFromDb: {
      page: string
      visit_count: number
      date: string
    }[] = []

    if (hasActivityTables) {
      // Get user stats from database
      const { data: dbStats } = await supabase
        .from('user_stats')
        .select('*')

      if (dbStats) {
        dbStats.forEach(stat => {
          userStatsFromDb[stat.user_id] = {
            total_logins: stat.total_logins || 0,
            total_actions: stat.total_actions || 0,
            total_pages_visited: stat.total_pages_visited || 0,
            total_records_created: stat.total_records_created || 0,
            total_records_updated: stat.total_records_updated || 0,
            login_streak: stat.login_streak || 0,
            avg_session_duration: stat.avg_session_duration || 0,
            last_activity_at: stat.last_activity_at
          }
        })
      }

      // Get activity logs for the period
      let activityQuery = supabase
        .from('user_activity_logs')
        .select('user_id, action, page, created_at')
        .order('created_at', { ascending: false })
        .limit(100)

      if (startDate) {
        activityQuery = activityQuery.gte('created_at', startDate.toISOString())
      }

      const { data: activities } = await activityQuery
      if (activities) {
        activitiesFromDb = activities
      }

      // Get page visits
      let pageQuery = supabase
        .from('page_visits')
        .select('page, visit_count, date')

      if (startDate) {
        pageQuery = pageQuery.gte('date', startDate.toISOString().split('T')[0])
      }

      const { data: pageVisits } = await pageQuery
      if (pageVisits) {
        pageVisitsFromDb = pageVisits
      }
    }

    // Combine users with their stats
    const usersWithStats = allUsers.map(u => {
      const dbStats = userStatsFromDb[u.id] || {}

      // Calculate performance score
      const loginStreak = dbStats.login_streak || 0
      const totalActions = dbStats.total_actions || 0
      const recordsCreated = dbStats.total_records_created || 0
      const recordsUpdated = dbStats.total_records_updated || 0
      const lastActivity = dbStats.last_activity_at ? new Date(dbStats.last_activity_at) : null

      let performanceScore = 0
      performanceScore += Math.min(loginStreak * 2, 30) // Max 30 points for streak
      performanceScore += Math.min(totalActions * 0.3, 30) // Max 30 points for actions
      performanceScore += Math.min((recordsCreated + recordsUpdated) * 0.5, 25) // Max 25 points for records

      // Activity recency bonus
      if (lastActivity) {
        const daysSinceActivity = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
        if (daysSinceActivity < 1) performanceScore += 15
        else if (daysSinceActivity < 3) performanceScore += 10
        else if (daysSinceActivity < 7) performanceScore += 5
      }

      performanceScore = Math.min(100, Math.round(performanceScore))

      // Calculate trend
      let trend: 'up' | 'down' | 'stable' = 'stable'
      if (lastActivity) {
        const daysSinceActivity = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
        if (daysSinceActivity < 1 && loginStreak > 3) trend = 'up'
        else if (daysSinceActivity > 7 || loginStreak === 0) trend = 'down'
      } else {
        trend = 'down'
      }

      return {
        id: u.id,
        full_name: u.full_name,
        email: u.email,
        role: u.role,
        is_active: u.is_active,
        total_logins: dbStats.total_logins || 0,
        total_actions: dbStats.total_actions || 0,
        pages_visited: dbStats.total_pages_visited || 0,
        records_created: dbStats.total_records_created || 0,
        records_edited: dbStats.total_records_updated || 0,
        last_login: dbStats.last_activity_at || u.updated_at,
        avg_session_duration: dbStats.avg_session_duration || 0,
        login_streak: loginStreak,
        performance_score: performanceScore,
        trend
      }
    })

    // Calculate page usage
    const pageUsageMap = new Map<string, number>()
    pageVisitsFromDb.forEach(pv => {
      const current = pageUsageMap.get(pv.page) || 0
      pageUsageMap.set(pv.page, current + pv.visit_count)
    })

    const totalPageVisits = Array.from(pageUsageMap.values()).reduce((a, b) => a + b, 0)
    const pageUsage = Array.from(pageUsageMap.entries())
      .map(([page, visits]) => ({
        page: formatPageName(page),
        visits,
        percentage: totalPageVisits > 0 ? Math.round((visits / totalPageVisits) * 100) : 0
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10)

    // Calculate recent activities
    const recentActivities = activitiesFromDb
      .slice(0, 20)
      .map(activity => {
        const activityUser = allUsers.find(u => u.id === activity.user_id)
        return {
          id: activity.user_id + activity.created_at,
          user_id: activity.user_id,
          user_name: activityUser?.full_name || 'Unknown',
          user_role: activityUser?.role || 'unknown',
          action: formatAction(activity.action),
          page: formatPageName(activity.page || ''),
          timestamp: activity.created_at
        }
      })

    // Calculate overall stats
    const activeUsers = usersWithStats.filter(u => u.is_active).length
    const totalUsers = usersWithStats.length
    const totalActions = usersWithStats.reduce((sum, u) => sum + u.total_actions, 0)
    const totalLogins = usersWithStats.reduce((sum, u) => sum + u.total_logins, 0)
    const avgPerformance = totalUsers > 0
      ? Math.round(usersWithStats.reduce((sum, u) => sum + u.performance_score, 0) / totalUsers)
      : 0
    const avgSessionDuration = totalUsers > 0
      ? Math.round(usersWithStats.reduce((sum, u) => sum + u.avg_session_duration, 0) / totalUsers)
      : 0

    return NextResponse.json({
      overallStats: {
        activeUsers,
        totalUsers,
        totalActions,
        totalLogins,
        avgPerformance,
        avgSessionDuration
      },
      userStats: usersWithStats,
      pageUsage,
      recentActivities
    })
  } catch (error) {
    console.error('Stats fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper to format page names
function formatPageName(path: string): string {
  if (!path) return 'Unknown'

  const pageMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/athletes': 'Athletes',
    '/fitness': 'Fitness',
    '/clinics': 'Medical Clinic',
    '/mindset': 'Mindset',
    '/mental': 'Mental Assessment',
    '/nutrition': 'Nutrition',
    '/injuries': 'Injuries',
    '/coaches': 'Coach Evaluation',
    '/settings': 'Settings',
    '/user-analytics': 'User Analytics',
    '/contracts': 'Contracts',
    '/attendance': 'Attendance'
  }

  return pageMap[path] || path.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

// Helper to format action names
function formatAction(action: string): string {
  const actionMap: Record<string, string> = {
    'login': 'Logged in',
    'logout': 'Logged out',
    'page_view': 'Viewed page',
    'record_create': 'Created record',
    'record_update': 'Updated record',
    'record_delete': 'Deleted record',
    'record_view': 'Viewed record',
    'search': 'Searched',
    'export': 'Exported data',
    'print': 'Printed document',
    'settings_change': 'Changed settings',
    'user_switch': 'Switched user'
  }

  return actionMap[action] || action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}
