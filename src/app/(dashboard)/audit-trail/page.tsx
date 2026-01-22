'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/ui/Header'
import { useUser } from '@/context/UserContext'
import { ROLE_DISPLAY_NAMES, HIDDEN_SYSTEM_ADMIN_EMAIL } from '@/types/database'
import {
  Shield,
  ShieldAlert,
  Search,
  Filter,
  Download,
  RefreshCw,
  Loader2,
  User,
  FileText,
  Edit3,
  Trash2,
  Eye,
  LogIn,
  LogOut,
  Settings,
  Users,
  Activity,
  Calendar,
  Clock,
  MapPin,
  Monitor,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react'

// Audit log entry type
interface AuditLogEntry {
  id: string
  user_id: string
  user_name: string
  user_email: string
  user_role: string
  action: string
  action_type: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'settings' | 'other'
  module: string
  page: string
  target_id?: string
  target_type?: string
  target_name?: string
  details?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  timestamp: string
  severity: 'info' | 'warning' | 'critical'
}

// Filter options
interface AuditFilters {
  search: string
  action: string
  module: string
  user: string
  severity: string
  dateFrom: string
  dateTo: string
}

export default function AuditTrailPage() {
  const { currentUser, isLoading: userLoading } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([])
  const [expandedLog, setExpandedLog] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filters
  const [filters, setFilters] = useState<AuditFilters>({
    search: '',
    action: 'all',
    module: 'all',
    user: 'all',
    severity: 'all',
    dateFrom: '',
    dateTo: ''
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const logsPerPage = 50

  // Check if user is the hidden system admin
  const isSystemAdmin = currentUser?.email?.toLowerCase() === HIDDEN_SYSTEM_ADMIN_EMAIL.toLowerCase()

  // Fetch audit logs
  const fetchAuditLogs = useCallback(async (showRefreshing = false) => {
    if (!isSystemAdmin) return

    if (showRefreshing) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }
    setError(null)

    try {
      const response = await fetch('/api/audit-trail')

      if (!response.ok) {
        throw new Error('Failed to fetch audit logs')
      }

      const data = await response.json()
      setAuditLogs(data.logs || [])
    } catch (err) {
      console.error('Error fetching audit logs:', err)
      setError('Failed to load audit trail data')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [isSystemAdmin])

  // Fetch data on mount
  useEffect(() => {
    if (isSystemAdmin) {
      fetchAuditLogs()
    } else {
      setIsLoading(false)
    }
  }, [isSystemAdmin, fetchAuditLogs])

  // Apply filters
  useEffect(() => {
    let result = [...auditLogs]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(log =>
        log.user_name.toLowerCase().includes(searchLower) ||
        log.user_email.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        log.module.toLowerCase().includes(searchLower) ||
        log.page.toLowerCase().includes(searchLower) ||
        (log.target_name && log.target_name.toLowerCase().includes(searchLower))
      )
    }

    // Action filter
    if (filters.action !== 'all') {
      result = result.filter(log => log.action_type === filters.action)
    }

    // Module filter
    if (filters.module !== 'all') {
      result = result.filter(log => log.module === filters.module)
    }

    // User filter
    if (filters.user !== 'all') {
      result = result.filter(log => log.user_id === filters.user)
    }

    // Severity filter
    if (filters.severity !== 'all') {
      result = result.filter(log => log.severity === filters.severity)
    }

    // Date filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      result = result.filter(log => new Date(log.timestamp) >= fromDate)
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999)
      result = result.filter(log => new Date(log.timestamp) <= toDate)
    }

    setFilteredLogs(result)
    setCurrentPage(1)
  }, [auditLogs, filters])

  // Get unique values for filters
  const uniqueModules = [...new Set(auditLogs.map(log => log.module))].filter(Boolean)
  const uniqueUsers = [...new Map(auditLogs.map(log => [log.user_id, { id: log.user_id, name: log.user_name }])).values()]

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  )

  // Get action icon
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return <FileText className="text-green-500" size={18} />
      case 'update':
        return <Edit3 className="text-blue-500" size={18} />
      case 'delete':
        return <Trash2 className="text-red-500" size={18} />
      case 'view':
        return <Eye className="text-gray-500" size={18} />
      case 'login':
        return <LogIn className="text-green-500" size={18} />
      case 'logout':
        return <LogOut className="text-gray-400" size={18} />
      case 'settings':
        return <Settings className="text-purple-500" size={18} />
      default:
        return <Activity className="text-[#FFD700]" size={18} />
    }
  }

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-500 flex items-center gap-1">
            <AlertTriangle size={12} />
            Critical
          </span>
        )
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500 flex items-center gap-1">
            <AlertTriangle size={12} />
            Warning
          </span>
        )
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-500 flex items-center gap-1">
            <CheckCircle size={12} />
            Info
          </span>
        )
    }
  }

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'system_admin':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'super_admin':
        return 'bg-[#FFD700]/20 text-[#D4AF00] dark:bg-[#FFD700]/30 dark:text-[#FFD700]'
      case 'admin':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'doctor':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Timestamp', 'User', 'Email', 'Role', 'Action', 'Module', 'Page', 'Target', 'IP Address', 'Severity']
    const rows = filteredLogs.map(log => [
      log.timestamp,
      log.user_name,
      log.user_email,
      log.user_role,
      log.action,
      log.module,
      log.page,
      log.target_name || '',
      log.ip_address || '',
      log.severity
    ])

    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-trail-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full" />
      </div>
    )
  }

  // Access denied for non-system admin users
  if (!isSystemAdmin) {
    return (
      <div>
        <Header
          title="Audit Trail"
          userName={currentUser?.full_name || 'User'}
          userRole={currentUser ? ROLE_DISPLAY_NAMES[currentUser.role] : 'Unknown'}
        />
        <div className="p-6">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShieldAlert className="text-red-500 mb-4" size={64} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              Access Denied
            </h2>
            <p className="text-lg" style={{ color: 'var(--muted-foreground)' }}>
              This page is restricted to system administrators only.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header
        title="Audit Trail"
        userName={currentUser?.full_name || 'User'}
        userRole={currentUser ? ROLE_DISPLAY_NAMES[currentUser.role] : 'Unknown'}
      />

      <div className="p-6 space-y-6">
        {/* System Admin Badge */}
        <div
          className="p-4 rounded-xl flex items-center gap-4"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
        >
          <Shield className="text-red-500 flex-shrink-0" size={24} />
          <div className="flex-1">
            <p className="font-medium text-red-500">
              System Administrator Access
            </p>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Complete audit trail of all system activities - visible only to you
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:bg-red-500/10 text-red-500"
              style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              <Download size={18} />
              <span className="text-sm">Export CSV</span>
            </button>
            <button
              onClick={() => fetchAuditLogs(true)}
              disabled={isRefreshing}
              className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:bg-red-500/10 text-red-500"
              style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              {isRefreshing ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <RefreshCw size={18} />
              )}
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="rounded-xl shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          {/* Search and Filter Toggle */}
          <div className="p-4 flex items-center gap-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by user, action, module, or target..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-transparent"
                style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${showFilters ? 'bg-[#FFD700] text-black' : 'hover:bg-[#FFD700]/10'}`}
              style={!showFilters ? { border: '1px solid var(--border)', color: 'var(--foreground)' } : undefined}
            >
              <Filter size={18} />
              <span className="text-sm">Filters</span>
              {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Action Type</label>
                <select
                  value={filters.action}
                  onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-transparent text-sm"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  <option value="all">All Actions</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                  <option value="view">View</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                  <option value="settings">Settings</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Module</label>
                <select
                  value={filters.module}
                  onChange={(e) => setFilters({ ...filters, module: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-transparent text-sm"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  <option value="all">All Modules</option>
                  {uniqueModules.map(module => (
                    <option key={module} value={module}>{module}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>User</label>
                <select
                  value={filters.user}
                  onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-transparent text-sm"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  <option value="all">All Users</option>
                  {uniqueUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Severity</label>
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-transparent text-sm"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  <option value="all">All Severities</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-transparent text-sm"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>To Date</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-transparent text-sm"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                />
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="px-4 py-3 flex items-center justify-between text-sm" style={{ backgroundColor: 'var(--muted)' }}>
            <span style={{ color: 'var(--muted-foreground)' }}>
              Showing {paginatedLogs.length} of {filteredLogs.length} entries
            </span>
            {filteredLogs.length !== auditLogs.length && (
              <button
                onClick={() => setFilters({
                  search: '',
                  action: 'all',
                  module: 'all',
                  user: 'all',
                  severity: 'all',
                  dateFrom: '',
                  dateTo: ''
                })}
                className="text-[#FFD700] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Audit Log Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            {paginatedLogs.length === 0 ? (
              <div className="p-8 text-center" style={{ color: 'var(--muted-foreground)' }}>
                No audit logs found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#FFD700]">Timestamp</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#FFD700]">User</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#FFD700]">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#FFD700]">Module / Page</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#FFD700]">Target</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#FFD700]">Severity</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-[#FFD700]">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.map((log) => {
                      const { date, time } = formatTimestamp(log.timestamp)
                      const isExpanded = expandedLog === log.id

                      return (
                        <>
                          <tr
                            key={log.id}
                            className="hover:bg-[#FFD700]/5 transition-colors cursor-pointer"
                            style={{ borderBottom: '1px solid var(--border)' }}
                            onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                          >
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{date}</span>
                                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{time}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
                                  <User className="text-[#FFD700]" size={16} />
                                </div>
                                <div>
                                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{log.user_name}</p>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getRoleBadgeColor(log.user_role)}`}>
                                    {ROLE_DISPLAY_NAMES[log.user_role as keyof typeof ROLE_DISPLAY_NAMES] || log.user_role}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {getActionIcon(log.action_type)}
                                <span className="text-sm" style={{ color: 'var(--foreground)' }}>{log.action}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-[#FFD700]">{log.module}</span>
                                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{log.page}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {log.target_name ? (
                                <span className="text-sm" style={{ color: 'var(--foreground)' }}>{log.target_name}</span>
                              ) : (
                                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>-</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {getSeverityBadge(log.severity)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button className="p-1 rounded hover:bg-[#FFD700]/10">
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </td>
                          </tr>

                          {/* Expanded Details Row */}
                          {isExpanded && (
                            <tr style={{ backgroundColor: 'var(--muted)' }}>
                              <td colSpan={7} className="px-4 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="text-gray-400" size={16} />
                                    <div>
                                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>IP Address</span>
                                      <p style={{ color: 'var(--foreground)' }}>{log.ip_address || 'Unknown'}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Monitor className="text-gray-400" size={16} />
                                    <div>
                                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>User Agent</span>
                                      <p className="truncate max-w-xs" style={{ color: 'var(--foreground)' }} title={log.user_agent}>
                                        {log.user_agent || 'Unknown'}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User className="text-gray-400" size={16} />
                                    <div>
                                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Email</span>
                                      <p style={{ color: 'var(--foreground)' }}>{log.user_email}</p>
                                    </div>
                                  </div>
                                  {log.details && Object.keys(log.details).length > 0 && (
                                    <div className="md:col-span-3">
                                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Additional Details</span>
                                      <pre className="mt-1 p-2 rounded bg-black/20 text-xs overflow-auto" style={{ color: 'var(--foreground)' }}>
                                        {JSON.stringify(log.details, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  Previous
                </button>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
