'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchKeys?: (keyof T)[]
  pageSize?: number
  onRowClick?: (item: T) => void
}

export default function DataTable<T extends object>({
  data,
  columns,
  searchable = true,
  searchKeys = [],
  pageSize = 10,
  onRowClick,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filter data based on search
  const filteredData = data.filter((item) => {
    if (!search) return true
    return searchKeys.some((key) => {
      const value = item[key]
      if (typeof value === 'string') {
        return value.toLowerCase().includes(search.toLowerCase())
      }
      return false
    })
  })

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0
    const aValue = (a as Record<string, unknown>)[sortKey]
    const bValue = (b as Record<string, unknown>)[sortKey]
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  return (
    <div
      className="rounded-xl shadow-lg overflow-hidden transition-colors"
      style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      {searchable && (
        <div
          className="p-4 flex items-center justify-between gap-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-11 pr-4 py-2.5 text-base rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50"
              style={{
                backgroundColor: 'var(--muted)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)'
              }}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} size={20} />
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors hover:bg-[#FFD700]/10"
            style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
          >
            <Filter size={20} />
            <span className="text-base font-medium">Filter</span>
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-4 text-left text-base font-semibold text-[#FFD700] ${
                    column.sortable ? 'cursor-pointer hover:bg-black/50' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && sortKey === column.key && (
                      <span className="text-lg">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-base"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  No data available
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-[#FFD700]/5 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  style={{ borderBottom: '1px solid var(--border)' }}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 text-base"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] ?? '-')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="p-4 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-base" style={{ color: 'var(--muted-foreground)' }}>
            Showing {startIndex + 1} - {Math.min(startIndex + pageSize, sortedData.length)} of{' '}
            {sortedData.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-lg hover:bg-[#FFD700]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 py-2 text-base font-medium" style={{ color: 'var(--foreground)' }}>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-lg hover:bg-[#FFD700]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
