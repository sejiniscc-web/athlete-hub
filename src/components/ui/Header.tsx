'use client'

import { Bell, Search, User, X, Check } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import ThemeToggle from './ThemeToggle'

interface Notification {
  id: string
  message: string
  time: string
  read: boolean
  type: 'fitness' | 'medical' | 'nutrition' | 'injury' | 'general'
}

interface HeaderProps {
  title: string
  userName?: string
  userRole?: string
}

export default function Header({ title, userName = 'User', userRole = 'Admin' }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'New fitness evaluation added for Mohammed Al-Omari', time: '5 minutes ago', read: false, type: 'fitness' },
    { id: '2', message: 'Medical checkup scheduled for Ahmed Al-Saeed', time: '1 hour ago', read: false, type: 'medical' },
    { id: '3', message: 'Nutrition plan updated for Khalid Al-Mohammadi', time: '3 hours ago', read: false, type: 'nutrition' },
    { id: '4', message: 'Injury report filed for Saad Al-Dosari', time: '5 hours ago', read: true, type: 'injury' },
  ])

  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'fitness': return 'bg-green-500'
      case 'medical': return 'bg-blue-500'
      case 'nutrition': return 'bg-orange-500'
      case 'injury': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <header style={{ backgroundColor: 'var(--header-bg)' }} className="border-b px-6 py-4 transition-colors" >
      <div className="flex items-center justify-between">
        {/* Title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--foreground)' }}>{title}</h1>
          <p className="text-sm md:text-base" style={{ color: 'var(--foreground-secondary)' }}>Al-Ittihad FC - Performance Management</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-4 pr-10 py-2.5 text-base rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
              style={{
                backgroundColor: 'var(--muted)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} size={20} />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowProfile(false)
              }}
              className="relative p-2.5 rounded-lg transition-colors hover:bg-[#FFD700]/10"
              style={{ color: 'var(--foreground)' }}
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 top-full mt-2 w-96 rounded-xl shadow-2xl z-50 overflow-hidden"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm font-medium text-[#FFD700] hover:underline flex items-center gap-1"
                    >
                      <Check size={16} />
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center" style={{ color: 'var(--muted-foreground)' }}>
                      <Bell size={48} className="mx-auto mb-3 opacity-50" />
                      <p className="text-base">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 cursor-pointer transition-colors relative group ${!notification.read ? 'bg-[#FFD700]/5' : ''}`}
                        style={{ borderBottom: '1px solid var(--border)' }}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-3 h-3 rounded-full mt-1.5 ${getTypeColor(notification.type)}`}></div>
                          <div className="flex-1">
                            <p className="text-base" style={{ color: 'var(--foreground)', fontWeight: notification.read ? 400 : 600 }}>
                              {notification.message}
                            </p>
                            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{notification.time}</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id) }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                          >
                            <X size={18} className="text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <button className="w-full py-2 text-center text-[#FFD700] text-base font-semibold hover:bg-[#FFD700]/10 rounded-lg transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfile(!showProfile)
                setShowNotifications(false)
              }}
              className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-[#FFD700]/10"
            >
              <div className="w-11 h-11 bg-[#FFD700] rounded-full flex items-center justify-center shadow-md">
                <User size={22} className="text-black" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>{userName}</p>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{userRole}</p>
              </div>
            </button>

            {showProfile && (
              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl z-50 overflow-hidden"
                style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
                  <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>{userName}</p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{userRole}</p>
                </div>
                <div className="p-2">
                  <a
                    href="/profile"
                    className="block px-4 py-2.5 text-base rounded-lg transition-colors hover:bg-[#FFD700]/10"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Profile
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2.5 text-base rounded-lg transition-colors hover:bg-[#FFD700]/10"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Settings
                  </a>
                </div>
                <div className="p-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <a
                    href="/logout"
                    className="block px-4 py-2.5 text-base text-red-500 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
