'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/ui/Sidebar'
import { ActivityTrackerProvider } from '@/hooks/useActivityTracker'

// Session storage key
const SESSION_ID_KEY = 'athlete_hub_session_id'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const sessionStartedRef = useRef(false)
  const lastPageRef = useRef<string>('')

  // Start session on mount
  useEffect(() => {
    const startSession = async () => {
      if (sessionStartedRef.current) return
      sessionStartedRef.current = true

      try {
        const response = await fetch('/api/activity/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'start' })
        })
        const data = await response.json()
        if (data.sessionId) {
          sessionStorage.setItem(SESSION_ID_KEY, data.sessionId)
        }
      } catch (error) {
        console.error('Failed to start session:', error)
      }
    }

    const currentUserId = localStorage.getItem('athlete_hub_current_user')
    if (currentUserId) {
      startSession()
    }
  }, [])

  // Track page views
  useEffect(() => {
    const logPageView = async () => {
      if (!pathname || lastPageRef.current === pathname) return
      lastPageRef.current = pathname

      try {
        await fetch('/api/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'page_view',
            page: pathname
          })
        })
      } catch (error) {
        console.error('Failed to log page view:', error)
      }
    }

    const currentUserId = localStorage.getItem('athlete_hub_current_user')
    if (currentUserId && isAuthenticated) {
      logPageView()
    }
  }, [pathname, isAuthenticated])

  // End session on unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionId = sessionStorage.getItem(SESSION_ID_KEY)
      if (sessionId) {
        const data = JSON.stringify({ action: 'end', sessionId })
        navigator.sendBeacon('/api/activity/sessions', data)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  useEffect(() => {
    const currentUserId = localStorage.getItem('athlete_hub_current_user')
    if (!currentUserId) {
      // Not logged in, redirect to login
      router.replace('/login')
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background-secondary)' }}>
        <div className="animate-spin w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full" />
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <ActivityTrackerProvider>
      <div className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--background-secondary)' }}>
        <Sidebar />
        <main className="main-content min-h-screen">
          {children}
        </main>
      </div>
    </ActivityTrackerProvider>
  )
}
