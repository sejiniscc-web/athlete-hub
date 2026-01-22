'use client'

import { useCallback, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useUser } from '@/context/UserContext'

// Activity action types
export type ActivityAction =
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

// Module types
export type ActivityModule =
  | 'athletes'
  | 'fitness'
  | 'medical'
  | 'nutrition'
  | 'mental'
  | 'mindset'
  | 'injuries'
  | 'coaches'
  | 'settings'
  | 'dashboard'
  | 'contracts'
  | 'attendance'
  | 'analytics'

interface LogActivityParams {
  action: ActivityAction
  page?: string
  module?: ActivityModule
  targetId?: string
  targetType?: string
  details?: Record<string, unknown>
}

interface UseActivityTrackerReturn {
  logActivity: (params: LogActivityParams) => Promise<void>
  logPageView: () => Promise<void>
  logRecordCreate: (module: ActivityModule, targetId: string, targetType: string, details?: Record<string, unknown>) => Promise<void>
  logRecordUpdate: (module: ActivityModule, targetId: string, targetType: string, details?: Record<string, unknown>) => Promise<void>
  logRecordDelete: (module: ActivityModule, targetId: string, targetType: string, details?: Record<string, unknown>) => Promise<void>
  logRecordView: (module: ActivityModule, targetId: string, targetType: string) => Promise<void>
  logSearch: (query: string, module?: ActivityModule) => Promise<void>
  logExport: (module: ActivityModule, format: string) => Promise<void>
  logPrint: (module: ActivityModule, targetId?: string) => Promise<void>
  startSession: () => Promise<string | null>
  endSession: () => Promise<void>
}

// Session storage key
const SESSION_ID_KEY = 'athlete_hub_session_id'

// Map pathname to module
function getModuleFromPath(pathname: string): ActivityModule | undefined {
  const pathMap: Record<string, ActivityModule> = {
    '/dashboard': 'dashboard',
    '/athletes': 'athletes',
    '/fitness': 'fitness',
    '/clinics': 'medical',
    '/mindset': 'mindset',
    '/mental': 'mental',
    '/nutrition': 'nutrition',
    '/injuries': 'injuries',
    '/coaches': 'coaches',
    '/settings': 'settings',
    '/contracts': 'contracts',
    '/attendance': 'attendance',
    '/user-analytics': 'analytics'
  }

  return pathMap[pathname]
}

export function useActivityTracker(): UseActivityTrackerReturn {
  const pathname = usePathname()
  const { currentUser } = useUser()
  const lastPageRef = useRef<string>('')
  const sessionIdRef = useRef<string | null>(null)

  // Load session ID from storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionIdRef.current = sessionStorage.getItem(SESSION_ID_KEY)
    }
  }, [])

  // Log activity to API
  const logActivity = useCallback(async (params: LogActivityParams) => {
    if (!currentUser) return

    try {
      await fetch('/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: params.action,
          page: params.page || pathname,
          module: params.module || getModuleFromPath(pathname),
          targetId: params.targetId,
          targetType: params.targetType,
          details: params.details
        })
      })
    } catch (error) {
      console.error('Failed to log activity:', error)
    }
  }, [currentUser, pathname])

  // Log page view
  const logPageView = useCallback(async () => {
    if (!currentUser || !pathname) return
    if (lastPageRef.current === pathname) return // Don't log duplicate page views

    lastPageRef.current = pathname

    await logActivity({
      action: 'page_view',
      page: pathname,
      module: getModuleFromPath(pathname)
    })
  }, [currentUser, pathname, logActivity])

  // Auto-track page views
  useEffect(() => {
    logPageView()
  }, [pathname, logPageView])

  // Log record creation
  const logRecordCreate = useCallback(async (
    module: ActivityModule,
    targetId: string,
    targetType: string,
    details?: Record<string, unknown>
  ) => {
    await logActivity({
      action: 'record_create',
      module,
      targetId,
      targetType,
      details
    })
  }, [logActivity])

  // Log record update
  const logRecordUpdate = useCallback(async (
    module: ActivityModule,
    targetId: string,
    targetType: string,
    details?: Record<string, unknown>
  ) => {
    await logActivity({
      action: 'record_update',
      module,
      targetId,
      targetType,
      details
    })
  }, [logActivity])

  // Log record deletion
  const logRecordDelete = useCallback(async (
    module: ActivityModule,
    targetId: string,
    targetType: string,
    details?: Record<string, unknown>
  ) => {
    await logActivity({
      action: 'record_delete',
      module,
      targetId,
      targetType,
      details
    })
  }, [logActivity])

  // Log record view
  const logRecordView = useCallback(async (
    module: ActivityModule,
    targetId: string,
    targetType: string
  ) => {
    await logActivity({
      action: 'record_view',
      module,
      targetId,
      targetType
    })
  }, [logActivity])

  // Log search
  const logSearch = useCallback(async (query: string, module?: ActivityModule) => {
    await logActivity({
      action: 'search',
      module,
      details: { query }
    })
  }, [logActivity])

  // Log export
  const logExport = useCallback(async (module: ActivityModule, format: string) => {
    await logActivity({
      action: 'export',
      module,
      details: { format }
    })
  }, [logActivity])

  // Log print
  const logPrint = useCallback(async (module: ActivityModule, targetId?: string) => {
    await logActivity({
      action: 'print',
      module,
      targetId,
      targetType: 'document'
    })
  }, [logActivity])

  // Start session
  const startSession = useCallback(async (): Promise<string | null> => {
    if (!currentUser) return null

    try {
      const response = await fetch('/api/activity/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'start' })
      })

      const data = await response.json()

      if (data.sessionId) {
        sessionIdRef.current = data.sessionId
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(SESSION_ID_KEY, data.sessionId)
        }
        return data.sessionId
      }

      return null
    } catch (error) {
      console.error('Failed to start session:', error)
      return null
    }
  }, [currentUser])

  // End session
  const endSession = useCallback(async () => {
    const sessionId = sessionIdRef.current

    if (!sessionId) return

    try {
      await fetch('/api/activity/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'end',
          sessionId
        })
      })

      sessionIdRef.current = null
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(SESSION_ID_KEY)
      }
    } catch (error) {
      console.error('Failed to end session:', error)
    }
  }, [])

  // End session on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionIdRef.current) {
        // Use sendBeacon for reliable delivery during unload
        const data = JSON.stringify({
          action: 'end',
          sessionId: sessionIdRef.current
        })
        navigator.sendBeacon('/api/activity/sessions', data)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return {
    logActivity,
    logPageView,
    logRecordCreate,
    logRecordUpdate,
    logRecordDelete,
    logRecordView,
    logSearch,
    logExport,
    logPrint,
    startSession,
    endSession
  }
}

// Context for activity tracker to share across components
import { createContext, useContext, ReactNode } from 'react'

const ActivityTrackerContext = createContext<UseActivityTrackerReturn | null>(null)

export function ActivityTrackerProvider({ children }: { children: ReactNode }) {
  const tracker = useActivityTracker()

  return (
    <ActivityTrackerContext.Provider value={tracker}>
      {children}
    </ActivityTrackerContext.Provider>
  )
}

export function useActivityTrackerContext() {
  const context = useContext(ActivityTrackerContext)
  if (!context) {
    throw new Error('useActivityTrackerContext must be used within ActivityTrackerProvider')
  }
  return context
}
