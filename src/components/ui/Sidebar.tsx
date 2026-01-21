'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Activity,
  Stethoscope,
  Brain,
  Heart,
  Utensils,
  Siren,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3
} from 'lucide-react'
import { useState } from 'react'
import UserSwitcher from './UserSwitcher'
import { useUser } from '@/context/UserContext'
import { hasFullAccess } from '@/types/database'

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Athletes', href: '/athletes', icon: Users },
  { name: 'Fitness', href: '/fitness', icon: Activity },
  { name: 'Medical Clinic', href: '/clinics', icon: Stethoscope },
  { name: 'Mindset', href: '/mindset', icon: Heart },
  { name: 'Mental Assessment', href: '/mental', icon: Brain },
  { name: 'Nutrition', href: '/nutrition', icon: Utensils },
  { name: 'Injuries', href: '/injuries', icon: Siren },
  { name: 'Coach Evaluation', href: '/coaches', icon: ClipboardList },
]

// Admin-only menu items
const adminMenuItems = [
  { name: 'User Analytics', href: '/user-analytics', icon: BarChart3 },
]

const bottomMenuItems = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Logout', href: '/logout', icon: LogOut },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { currentUser } = useUser()

  // Check if user is admin
  const isAdmin = currentUser && hasFullAccess(currentUser.role)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg lg:hidden"
        style={{ backgroundColor: 'var(--sidebar-bg)', color: '#FFD700' }}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          color: 'var(--sidebar-text)'
        }}
      >
        {/* Logo Section */}
        <div className="p-6" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-[#FFD700] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-black font-bold text-2xl">1</span>
            </div>
            <div>
              <h1 className="text-[#FFD700] font-bold text-xl">Al-Ittihad FC</h1>
              <p style={{ color: 'var(--sidebar-text-muted)', fontSize: '1rem' }}>The Dean - 1927</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto h-[calc(100vh-200px)]">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: isActive ? '#FFD700' : 'transparent',
                      color: isActive ? '#000000' : 'var(--sidebar-text)',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '1.1rem'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'
                        e.currentTarget.style.color = '#FFD700'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--sidebar-text)'
                      }
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={24} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}

            {/* Admin-only menu items */}
            {isAdmin && adminMenuItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: isActive ? '#FFD700' : 'transparent',
                      color: isActive ? '#000000' : 'var(--sidebar-text)',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '1.1rem'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'
                        e.currentTarget.style.color = '#FFD700'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = 'var(--sidebar-text)'
                      }
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={24} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Menu */}
        <div className="px-4 py-2" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
          <ul className="space-y-1">
            {bottomMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200"
                    style={{
                      color: 'var(--sidebar-text)',
                      fontSize: '1rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'
                      e.currentTarget.style.color = '#FFD700'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--sidebar-text)'
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={22} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* User Switcher */}
        <UserSwitcher />
      </aside>
    </>
  )
}
