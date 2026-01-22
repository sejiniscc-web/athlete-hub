'use client'

import Header from '@/components/ui/Header'
import StatCard from '@/components/ui/StatCard'
import { useUser } from '@/context/UserContext'
import { ROLE_DISPLAY_NAMES } from '@/types/database'
import {
  Users,
  Activity,
  Stethoscope,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Award,
  Target
} from 'lucide-react'

// Mock data - will be replaced with real data from Supabase
const stats = [
  { title: 'Total Athletes', value: 45, icon: Users, change: { value: 12, isPositive: true } },
  { title: 'Fitness Evaluations', value: 128, icon: Activity, change: { value: 8, isPositive: true } },
  { title: 'Medical Checkups', value: 89, icon: Stethoscope, change: { value: 5, isPositive: true } },
  { title: 'Active Injuries', value: 3, icon: AlertTriangle, color: 'error' as const },
]

const recentActivities = [
  { type: 'fitness', athlete: 'Mohammed Al-Omari', action: 'New fitness evaluation added', time: '5 minutes ago' },
  { type: 'clinic', athlete: 'Ahmed Al-Saeed', action: 'Routine medical checkup', time: '1 hour ago' },
  { type: 'injury', athlete: 'Khalid Al-Mohammadi', action: 'Injury status updated', time: '2 hours ago' },
  { type: 'nutrition', athlete: 'Saad Al-Dosari', action: 'Nutrition plan updated', time: '3 hours ago' },
  { type: 'mental', athlete: 'Fahad Al-Otaibi', action: 'Mental assessment session', time: '4 hours ago' },
]

const topAthletes = [
  { name: 'Mohammed Al-Omari', sport: 'Football', rating: 9.2, trend: 'up' },
  { name: 'Ahmed Al-Saeed', sport: 'Football', rating: 8.8, trend: 'up' },
  { name: 'Khalid Al-Mohammadi', sport: 'Football', rating: 8.5, trend: 'stable' },
  { name: 'Saad Al-Dosari', sport: 'Football', rating: 8.3, trend: 'down' },
]

const upcomingEvents = [
  { title: 'First Team Training', date: 'Today - 4:00 PM', type: 'training' },
  { title: 'Routine Medical Checkups', date: 'Tomorrow - 9:00 AM', type: 'medical' },
  { title: 'Friendly Match', date: 'Friday - 8:00 PM', type: 'match' },
  { title: 'Technical Staff Meeting', date: 'Saturday - 10:00 AM', type: 'meeting' },
]

export default function DashboardPage() {
  const { currentUser, isLoading } = useUser()

  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <Header
        title="Dashboard"
        userName={currentUser.full_name}
        userRole={ROLE_DISPLAY_NAMES[currentUser.role]}
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              change={stat.change}
              color={stat.color}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div
            className="lg:col-span-2 rounded-xl shadow-lg p-6 transition-colors"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Recent Activities</h2>
              <a href="/activities" className="text-[#FFD700] hover:underline text-base font-medium">
                View All
              </a>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-[#FFD700]/5 transition-colors"
                  style={{ backgroundColor: 'var(--activity-bg)' }}
                >
                  <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center">
                    {activity.type === 'fitness' && <Activity className="text-[#FFD700]" size={24} />}
                    {activity.type === 'clinic' && <Stethoscope className="text-blue-500" size={24} />}
                    {activity.type === 'injury' && <AlertTriangle className="text-red-500" size={24} />}
                    {activity.type === 'nutrition' && <Target className="text-green-500" size={24} />}
                    {activity.type === 'mental' && <Award className="text-purple-500" size={24} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>{activity.athlete}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{activity.action}</p>
                  </div>
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Athletes */}
          <div
            className="rounded-xl shadow-lg p-6 transition-colors"
            style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Top Athletes</h2>
              <a href="/athletes" className="text-[#FFD700] hover:underline text-base font-medium">
                View All
              </a>
            </div>
            <div className="space-y-4">
              {topAthletes.map((athlete, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#FFD700]/5 transition-colors"
                >
                  <div className="w-11 h-11 bg-[#FFD700] rounded-full flex items-center justify-center text-black font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>{athlete.name}</p>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{athlete.sport}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-[#FFD700]">{athlete.rating}</span>
                    {athlete.trend === 'up' && <TrendingUp className="text-green-500" size={18} />}
                    {athlete.trend === 'down' && <TrendingUp className="text-red-500 rotate-180" size={18} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div
          className="rounded-xl shadow-lg p-6 transition-colors"
          style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>Upcoming Events</h2>
            <a href="/calendar" className="text-[#FFD700] hover:underline text-base font-medium">
              View Calendar
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="p-5 rounded-xl hover:border-[#FFD700] hover:shadow-lg transition-all cursor-pointer"
                style={{ backgroundColor: 'var(--activity-bg)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="text-[#FFD700]" size={22} />
                  <span className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{event.date}</span>
                </div>
                <p className="text-base font-semibold mb-3" style={{ color: 'var(--foreground)' }}>{event.title}</p>
                <span
                  className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${
                    event.type === 'training'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : event.type === 'medical'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : event.type === 'match'
                      ? 'bg-[#FFD700]/20 text-[#B8860B]'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {event.type === 'training' && 'Training'}
                  {event.type === 'medical' && 'Medical'}
                  {event.type === 'match' && 'Match'}
                  {event.type === 'meeting' && 'Meeting'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
