'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/ui/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
    <div className="min-h-screen transition-colors" style={{ backgroundColor: 'var(--background-secondary)' }}>
      <Sidebar />
      <main className="main-content min-h-screen">
        {children}
      </main>
    </div>
  )
}
