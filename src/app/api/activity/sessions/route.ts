import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST - Start or end a session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, sessionId } = body

    // Get user ID from request body
    const currentUserId = userId || request.cookies.get('athlete_hub_user_id')?.value

    if (!currentUserId && action === 'start') {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get IP and user agent
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : request.headers.get('x-real-ip') || null
    const userAgent = request.headers.get('user-agent') || null

    const supabase = await createClient()

    // Check if tables exist
    const { error: tableCheckError } = await supabase
      .from('user_sessions')
      .select('id')
      .limit(1)

    if (tableCheckError?.code === '42P01') {
      // Table doesn't exist yet - return success silently
      return NextResponse.json({ success: true, message: 'Session tables not yet created' })
    }

    if (action === 'start') {
      // End any existing active sessions
      await supabase
        .from('user_sessions')
        .update({
          is_active: false,
          session_end: new Date().toISOString()
        })
        .eq('user_id', currentUserId)
        .eq('is_active', true)

      // Create new session
      const { data: session, error: sessionError } = await supabase
        .from('user_sessions')
        .insert({
          user_id: currentUserId,
          ip_address: ipAddress,
          user_agent: userAgent,
          is_active: true
        })
        .select()
        .single()

      if (sessionError) {
        console.error('Error creating session:', sessionError)
        return NextResponse.json({ success: true, warning: 'Session creation failed' })
      }

      // Update login streak
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

      // Check if user_stats table exists
      const { error: statsTableError } = await supabase
        .from('user_stats')
        .select('id')
        .limit(1)

      if (statsTableError?.code !== '42P01') {
        const { data: stats } = await supabase
          .from('user_stats')
          .select('last_login_date, login_streak, total_logins')
          .eq('user_id', currentUserId)
          .single()

        let newStreak = 1
        if (stats) {
          if (stats.last_login_date === yesterday) {
            newStreak = (stats.login_streak || 0) + 1
          } else if (stats.last_login_date === today) {
            newStreak = stats.login_streak || 1
          }

          // Update existing stats
          await supabase
            .from('user_stats')
            .update({
              total_logins: (stats.total_logins || 0) + 1,
              login_streak: newStreak,
              last_login_date: today,
              last_activity_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', currentUserId)
        } else {
          // Create new stats
          await supabase
            .from('user_stats')
            .insert({
              user_id: currentUserId,
              total_logins: 1,
              login_streak: 1,
              last_login_date: today,
              last_activity_at: new Date().toISOString()
            })
        }
      }

      // Log login activity
      const { error: activityTableError } = await supabase
        .from('user_activity_logs')
        .select('id')
        .limit(1)

      if (activityTableError?.code !== '42P01') {
        await supabase
          .from('user_activity_logs')
          .insert({
            user_id: currentUserId,
            action: 'login',
            ip_address: ipAddress,
            user_agent: userAgent
          })
      }

      return NextResponse.json({
        success: true,
        sessionId: session?.id
      })
    } else if (action === 'end') {
      if (!sessionId && !currentUserId) {
        return NextResponse.json({ success: true })
      }

      // End the session
      if (sessionId) {
        const { data: session } = await supabase
          .from('user_sessions')
          .update({
            is_active: false,
            session_end: new Date().toISOString()
          })
          .eq('id', sessionId)
          .select()
          .single()

        // Calculate session duration and update stats
        if (session) {
          const sessionStart = new Date(session.session_start).getTime()
          const sessionEnd = new Date().getTime()
          const durationMinutes = Math.round((sessionEnd - sessionStart) / 60000)

          // Update session with duration
          await supabase
            .from('user_sessions')
            .update({ duration_minutes: durationMinutes })
            .eq('id', session.id)

          // Update user stats
          const { data: currentStats } = await supabase
            .from('user_stats')
            .select('total_session_minutes, total_logins')
            .eq('user_id', session.user_id)
            .single()

          if (currentStats) {
            const totalMinutes = (currentStats.total_session_minutes || 0) + durationMinutes
            const avgDuration = Math.round(totalMinutes / Math.max(currentStats.total_logins || 1, 1))

            await supabase
              .from('user_stats')
              .update({
                total_session_minutes: totalMinutes,
                avg_session_duration: avgDuration,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', session.user_id)
          }
        }
      } else if (currentUserId) {
        // End any active session for this user
        await supabase
          .from('user_sessions')
          .update({
            is_active: false,
            session_end: new Date().toISOString()
          })
          .eq('user_id', currentUserId)
          .eq('is_active', true)
      }

      // Log logout activity
      if (currentUserId) {
        const { error: activityTableError } = await supabase
          .from('user_activity_logs')
          .select('id')
          .limit(1)

        if (activityTableError?.code !== '42P01') {
          await supabase
            .from('user_activity_logs')
            .insert({
              user_id: currentUserId,
              action: 'logout',
              ip_address: ipAddress,
              user_agent: userAgent
            })
        }
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ success: true, warning: 'Session operation failed' })
  }
}

// GET - Get current session info
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('athlete_hub_user_id')?.value

    if (!userId) {
      return NextResponse.json({ session: null })
    }

    const supabase = await createClient()

    // Check if table exists
    const { error: tableCheckError } = await supabase
      .from('user_sessions')
      .select('id')
      .limit(1)

    if (tableCheckError?.code === '42P01') {
      return NextResponse.json({ session: null })
    }

    // Get active session
    const { data: session } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('session_start', { ascending: false })
      .limit(1)
      .single()

    return NextResponse.json({ session: session || null })
  } catch (error) {
    console.error('Session fetch error:', error)
    return NextResponse.json({ session: null })
  }
}
