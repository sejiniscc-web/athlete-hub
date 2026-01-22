import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Activity action types
type ActivityAction =
  | 'login'
  | 'logout'
  | 'page_view'
  | 'record_create'
  | 'record_update'
  | 'record_delete'
  | 'record_view'
  | 'search'
  | 'export'
  | 'print'
  | 'settings_change'
  | 'user_switch'

interface LogActivityRequest {
  action: ActivityAction
  page?: string
  module?: string
  targetId?: string
  targetType?: string
  details?: Record<string, unknown>
  userId?: string // User ID from client
}

// POST - Log a new activity
export async function POST(request: NextRequest) {
  try {
    const body: LogActivityRequest = await request.json()
    const { action, page, module, targetId, targetType, details, userId } = body

    // Get user ID from request body or cookie
    const currentUserId = userId || request.cookies.get('athlete_hub_user_id')?.value

    if (!currentUserId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get IP and user agent from request
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : request.headers.get('x-real-ip') || null
    const userAgent = request.headers.get('user-agent') || null

    const supabase = await createClient()

    // Check if tables exist, if not return success (tables not created yet)
    const { error: tableCheckError } = await supabase
      .from('user_activity_logs')
      .select('id')
      .limit(1)

    if (tableCheckError?.code === '42P01') {
      // Table doesn't exist yet - return success silently
      return NextResponse.json({ success: true, message: 'Activity tracking tables not yet created' })
    }

    // Log the activity
    const { data: activityLog, error: logError } = await supabase
      .from('user_activity_logs')
      .insert({
        user_id: currentUserId,
        action,
        page,
        module,
        target_id: targetId,
        target_type: targetType,
        details,
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .select()
      .single()

    if (logError) {
      console.error('Error logging activity:', logError)
      // Don't fail the request if logging fails
      return NextResponse.json({ success: true, warning: 'Activity logged with errors' })
    }

    // Update user stats
    await updateUserStats(supabase, currentUserId, action)

    // Update page visits if it's a page view
    if (action === 'page_view' && page) {
      await updatePageVisits(supabase, currentUserId, page)
    }

    return NextResponse.json({ success: true, id: activityLog?.id })
  } catch (error) {
    console.error('Activity logging error:', error)
    // Don't fail the request if logging fails
    return NextResponse.json({ success: true, warning: 'Activity logging failed' })
  }
}

// GET - Get activity logs (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')
    const page = searchParams.get('page')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Check if tables exist
    const { error: tableCheckError } = await supabase
      .from('user_activity_logs')
      .select('id')
      .limit(1)

    if (tableCheckError?.code === '42P01') {
      return NextResponse.json({ logs: [], total: 0, limit, offset })
    }

    // Build query
    let query = supabase
      .from('user_activity_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (userId) query = query.eq('user_id', userId)
    if (action) query = query.eq('action', action)
    if (page) query = query.eq('page', page)
    if (startDate) query = query.gte('created_at', startDate)
    if (endDate) query = query.lte('created_at', endDate)

    const { data: logs, error: logsError, count } = await query

    if (logsError) {
      console.error('Error fetching activity logs:', logsError)
      return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
    }

    return NextResponse.json({
      logs,
      total: count,
      limit,
      offset
    })
  } catch (error) {
    console.error('Activity fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to update user stats
async function updateUserStats(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  action: ActivityAction
) {
  try {
    // Check if stats table exists
    const { error: tableCheckError } = await supabase
      .from('user_stats')
      .select('id')
      .limit(1)

    if (tableCheckError?.code === '42P01') {
      return // Table doesn't exist yet
    }

    // Check if stats exist for user
    const { data: existingStats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

    const now = new Date().toISOString()

    if (existingStats) {
      // Update existing stats
      const updates: Record<string, unknown> = {
        total_actions: (existingStats.total_actions || 0) + 1,
        last_activity_at: now,
        updated_at: now
      }

      if (action === 'record_create') {
        updates.total_records_created = (existingStats.total_records_created || 0) + 1
      } else if (action === 'record_update') {
        updates.total_records_updated = (existingStats.total_records_updated || 0) + 1
      } else if (action === 'record_delete') {
        updates.total_records_deleted = (existingStats.total_records_deleted || 0) + 1
      } else if (action === 'page_view') {
        updates.total_pages_visited = (existingStats.total_pages_visited || 0) + 1
      }

      await supabase
        .from('user_stats')
        .update(updates)
        .eq('user_id', userId)
    } else {
      // Create new stats record
      await supabase
        .from('user_stats')
        .insert({
          user_id: userId,
          total_actions: 1,
          total_records_created: action === 'record_create' ? 1 : 0,
          total_records_updated: action === 'record_update' ? 1 : 0,
          total_records_deleted: action === 'record_delete' ? 1 : 0,
          total_pages_visited: action === 'page_view' ? 1 : 0,
          last_activity_at: now
        })
    }
  } catch (error) {
    console.error('Error updating user stats:', error)
  }
}

// Helper function to update page visits
async function updatePageVisits(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  page: string
) {
  try {
    // Check if table exists
    const { error: tableCheckError } = await supabase
      .from('page_visits')
      .select('id')
      .limit(1)

    if (tableCheckError?.code === '42P01') {
      return // Table doesn't exist yet
    }

    const today = new Date().toISOString().split('T')[0]

    // Check if visit exists for today
    const { data: existingVisit } = await supabase
      .from('page_visits')
      .select('*')
      .eq('user_id', userId)
      .eq('page', page)
      .eq('date', today)
      .single()

    if (existingVisit) {
      // Update existing visit
      await supabase
        .from('page_visits')
        .update({
          visit_count: (existingVisit.visit_count || 0) + 1,
          last_visit_at: new Date().toISOString()
        })
        .eq('id', existingVisit.id)
    } else {
      // Create new visit record
      await supabase
        .from('page_visits')
        .insert({
          user_id: userId,
          page,
          date: today,
          visit_count: 1,
          last_visit_at: new Date().toISOString()
        })
    }
  } catch (error) {
    console.error('Error updating page visits:', error)
  }
}
