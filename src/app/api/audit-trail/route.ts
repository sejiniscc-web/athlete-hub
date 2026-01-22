import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAllUsers } from '@/context/UserContext'
import { HIDDEN_SYSTEM_ADMIN_EMAIL, isHiddenUser } from '@/types/database'

// Severity levels for different actions
const actionSeverity: Record<string, 'low' | 'medium' | 'high' | 'critical'> = {
  'page_view': 'low',
  'record_view': 'low',
  'search': 'low',
  'login': 'medium',
  'logout': 'medium',
  'record_create': 'medium',
  'record_update': 'medium',
  'export': 'high',
  'print': 'high',
  'record_delete': 'high',
  'settings_change': 'high',
  'user_switch': 'critical'
}

// GET - Get audit trail logs (system admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify system admin access
    const requestUserId = request.cookies.get('athlete_hub_user_id')?.value
    const allUsers = getAllUsers()
    const requestUser = allUsers.find(u => u.id === requestUserId)

    // Only allow access for the hidden system admin
    if (!requestUser || requestUser.email.toLowerCase() !== HIDDEN_SYSTEM_ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const supabase = await createClient()

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')
    const module = searchParams.get('module')
    const severity = searchParams.get('severity')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const search = searchParams.get('search')

    // Check if tables exist
    const { error: tableCheckError } = await supabase
      .from('user_activity_logs')
      .select('id')
      .limit(1)

    if (tableCheckError?.code === '42P01') {
      // Table doesn't exist - return mock data for testing
      return NextResponse.json({
        logs: [],
        total: 0,
        limit,
        offset,
        message: 'Activity tracking tables not yet created'
      })
    }

    // Build query
    let query = supabase
      .from('user_activity_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (userId) query = query.eq('user_id', userId)
    if (action) query = query.eq('action', action)
    if (module) query = query.eq('module', module)
    if (startDate) query = query.gte('created_at', startDate)
    if (endDate) query = query.lte('created_at', endDate)

    // Get all logs first to apply severity filter and search
    const { data: allLogs, error: logsError, count: totalCount } = await query

    if (logsError) {
      console.error('Error fetching audit logs:', logsError)
      return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 })
    }

    // Enrich logs with user info and severity
    let enrichedLogs = (allLogs || []).map(log => {
      const user = allUsers.find(u => u.id === log.user_id)
      return {
        ...log,
        user_name: user?.full_name || 'Unknown User',
        user_email: user?.email || 'unknown@email.com',
        user_role: user?.role || 'unknown',
        severity: actionSeverity[log.action] || 'low'
      }
    })

    // Filter out hidden system admin's activities from audit trail if needed
    // (optional - you may want to include them for complete auditing)

    // Apply severity filter
    if (severity) {
      enrichedLogs = enrichedLogs.filter(log => log.severity === severity)
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      enrichedLogs = enrichedLogs.filter(log =>
        log.user_name.toLowerCase().includes(searchLower) ||
        log.user_email.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        (log.page && log.page.toLowerCase().includes(searchLower)) ||
        (log.module && log.module.toLowerCase().includes(searchLower)) ||
        (log.target_type && log.target_type.toLowerCase().includes(searchLower))
      )
    }

    // Apply pagination after filtering
    const total = enrichedLogs.length
    const paginatedLogs = enrichedLogs.slice(offset, offset + limit)

    // Get summary stats
    const stats = {
      totalLogs: totalCount || 0,
      filteredLogs: total,
      byAction: {} as Record<string, number>,
      bySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      } as Record<string, number>,
      uniqueUsers: new Set(enrichedLogs.map(l => l.user_id)).size
    }

    enrichedLogs.forEach(log => {
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1
    })

    // Get list of unique actions and modules for filter dropdowns
    const uniqueActions = [...new Set((allLogs || []).map(l => l.action))]
    const uniqueModules = [...new Set((allLogs || []).filter(l => l.module).map(l => l.module))]

    return NextResponse.json({
      logs: paginatedLogs,
      total,
      limit,
      offset,
      stats,
      filterOptions: {
        actions: uniqueActions,
        modules: uniqueModules,
        severities: ['low', 'medium', 'high', 'critical'],
        users: allUsers
          .filter(u => !isHiddenUser(u.email))
          .map(u => ({ id: u.id, name: u.full_name, email: u.email }))
      }
    })
  } catch (error) {
    console.error('Audit trail fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
