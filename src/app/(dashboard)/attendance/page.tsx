'use client'

import { useState } from 'react'
import { Calendar, Plus, CheckCircle, XCircle, Clock, AlertTriangle, Pencil } from 'lucide-react'
import Button from '@/components/ui/Button'
import EditModal, { FieldConfig } from '@/components/ui/EditModal'

const initialAttendance = [
  { id: '1', athlete_name: 'Mohammed Al-Omari', date: '2025-01-20', type: 'Training', status: 'Present', time_in: '08:00', time_out: '11:00' },
  { id: '2', athlete_name: 'Ahmed Al-Saeed', date: '2025-01-20', type: 'Training', status: 'Present', time_in: '08:05', time_out: '11:00' },
  { id: '3', athlete_name: 'Khalid Al-Mohammadi', date: '2025-01-20', type: 'Training', status: 'Injured', time_in: '-', time_out: '-' },
  { id: '4', athlete_name: 'Saad Al-Dosari', date: '2025-01-20', type: 'Training', status: 'Late', time_in: '08:30', time_out: '11:00' },
  { id: '5', athlete_name: 'Fahad Al-Otaibi', date: '2025-01-20', type: 'Training', status: 'Present', time_in: '07:55', time_out: '11:00' },
  { id: '6', athlete_name: 'Mohammed Al-Omari', date: '2025-01-19', type: 'Match', status: 'Present', time_in: '17:00', time_out: '20:00' },
  { id: '7', athlete_name: 'Ahmed Al-Saeed', date: '2025-01-19', type: 'Match', status: 'Present', time_in: '17:00', time_out: '20:00' },
]

const attendanceFields: FieldConfig[] = [
  { key: 'athlete_name', label: 'Athlete Name', type: 'text', required: true },
  { key: 'date', label: 'Date', type: 'date', required: true },
  {
    key: 'type',
    label: 'Type',
    type: 'select',
    required: true,
    options: [
      { value: 'Training', label: 'Training' },
      { value: 'Match', label: 'Match' },
      { value: 'Gym', label: 'Gym' },
      { value: 'Recovery', label: 'Recovery' }
    ]
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'Present', label: 'Present' },
      { value: 'Late', label: 'Late' },
      { value: 'Absent', label: 'Absent' },
      { value: 'Injured', label: 'Injured' },
      { value: 'Excused', label: 'Excused' }
    ]
  },
  { key: 'time_in', label: 'Time In', type: 'text', placeholder: 'e.g., 08:00' },
  { key: 'time_out', label: 'Time Out', type: 'text', placeholder: 'e.g., 11:00' }
]

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(initialAttendance)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<typeof initialAttendance[0] | null>(null)

  const presentToday = attendance.filter(a => a.date === '2025-01-20' && a.status === 'Present').length
  const lateToday = attendance.filter(a => a.date === '2025-01-20' && a.status === 'Late').length
  const absentToday = attendance.filter(a => a.date === '2025-01-20' && a.status === 'Absent').length
  const injuredToday = attendance.filter(a => a.date === '2025-01-20' && a.status === 'Injured').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return 'bg-green-500/20 text-green-500'
      case 'Late': return 'bg-yellow-500/20 text-yellow-500'
      case 'Absent': return 'bg-red-500/20 text-red-500'
      case 'Injured': return 'bg-orange-500/20 text-orange-500'
      case 'Excused': return 'bg-blue-500/20 text-blue-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present': return <CheckCircle size={16} className="text-green-500" />
      case 'Late': return <Clock size={16} className="text-yellow-500" />
      case 'Absent': return <XCircle size={16} className="text-red-500" />
      case 'Injured': return <AlertTriangle size={16} className="text-orange-500" />
      default: return null
    }
  }

  const handleSaveEdit = (data: Record<string, any>) => {
    setAttendance(prev => prev.map(record =>
      record.id === editingRecord?.id
        ? { ...record, ...data }
        : record
    ))
    setEditingRecord(null)
  }

  const handleAddNew = (data: Record<string, any>) => {
    const newRecord = {
      id: String(Date.now()),
      ...data
    } as typeof initialAttendance[0]
    setAttendance(prev => [...prev, newRecord])
    setShowAddModal(false)
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Attendance</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Al-Ittihad FC - Performance Management</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          Record Attendance
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Present Today</p>
              <p className="text-3xl font-bold text-green-500">{presentToday}</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Late Today</p>
              <p className="text-3xl font-bold text-yellow-500">{lateToday}</p>
            </div>
            <Clock className="text-yellow-500" size={32} />
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Absent Today</p>
              <p className="text-3xl font-bold text-red-500">{absentToday}</p>
            </div>
            <XCircle className="text-red-500" size={32} />
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Injured</p>
              <p className="text-3xl font-bold text-orange-500">{injuredToday}</p>
            </div>
            <AlertTriangle className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl shadow-lg overflow-hidden" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--table-header-bg)' }}>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Athlete Name</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Date</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Type</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Status</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Time In</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Time Out</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id} className="hover:bg-[#FFD700]/5 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-6 py-4 text-base font-medium" style={{ color: 'var(--foreground)' }}>{record.athlete_name}</td>
                  <td className="px-6 py-4 text-base" style={{ color: 'var(--foreground)' }}>{record.date}</td>
                  <td className="px-6 py-4 text-base" style={{ color: 'var(--foreground)' }}>{record.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)}
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-base" style={{ color: 'var(--foreground)' }}>{record.time_in}</td>
                  <td className="px-6 py-4 text-base" style={{ color: 'var(--foreground)' }}>{record.time_out}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setEditingRecord(record)}
                      className="p-2 rounded-lg hover:bg-[#FFD700]/20 transition-colors text-[#FFD700]"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={!!editingRecord}
        onClose={() => setEditingRecord(null)}
        onSave={handleSaveEdit}
        title="Edit Attendance Record"
        fields={attendanceFields}
        initialData={editingRecord || {}}
      />

      {/* Add Modal */}
      <EditModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddNew}
        title="Record New Attendance"
        fields={attendanceFields}
        initialData={{ date: new Date().toISOString().split('T')[0] }}
      />
    </div>
  )
}
