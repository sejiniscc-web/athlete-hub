'use client'

import { useState } from 'react'
import { FileText, Plus, CheckCircle, AlertTriangle, Clock, Pencil } from 'lucide-react'
import Button from '@/components/ui/Button'
import EditModal, { FieldConfig } from '@/components/ui/EditModal'

const initialContracts = [
  {
    id: '1',
    athlete_name: 'Mohammed Al-Omari',
    contract_start: '2023-07-01',
    contract_end: '2026-06-30',
    salary: 500000,
    status: 'Active',
    days_remaining: 527
  },
  {
    id: '2',
    athlete_name: 'Ahmed Al-Saeed',
    contract_start: '2024-01-01',
    contract_end: '2025-12-31',
    salary: 350000,
    status: 'Active',
    days_remaining: 345
  },
  {
    id: '3',
    athlete_name: 'Khalid Al-Mohammadi',
    contract_start: '2022-07-01',
    contract_end: '2025-06-30',
    salary: 600000,
    status: 'Expiring Soon',
    days_remaining: 160
  },
  {
    id: '4',
    athlete_name: 'Saad Al-Dosari',
    contract_start: '2024-07-01',
    contract_end: '2027-06-30',
    salary: 200000,
    status: 'Active',
    days_remaining: 892
  },
  {
    id: '5',
    athlete_name: 'Fahad Al-Otaibi',
    contract_start: '2021-01-01',
    contract_end: '2025-01-31',
    salary: 550000,
    status: 'Expiring Soon',
    days_remaining: 10
  }
]

const contractFields: FieldConfig[] = [
  { key: 'athlete_name', label: 'Athlete Name', type: 'text', required: true },
  { key: 'contract_start', label: 'Start Date', type: 'date', required: true },
  { key: 'contract_end', label: 'End Date', type: 'date', required: true },
  { key: 'salary', label: 'Annual Salary (SAR)', type: 'number', required: true, placeholder: '500000' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Expiring Soon', label: 'Expiring Soon' },
      { value: 'Expired', label: 'Expired' },
      { value: 'Pending', label: 'Pending' }
    ]
  }
]

export default function ContractsPage() {
  const [contracts, setContracts] = useState(initialContracts)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingRecord, setEditingRecord] = useState<typeof initialContracts[0] | null>(null)

  const activeContracts = contracts.filter(c => c.status === 'Active').length
  const expiringContracts = contracts.filter(c => c.status === 'Expiring Soon').length
  const totalValue = contracts.reduce((acc, c) => acc + c.salary, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-500'
      case 'Expiring Soon': return 'bg-orange-500/20 text-orange-500'
      case 'Expired': return 'bg-red-500/20 text-red-500'
      case 'Pending': return 'bg-blue-500/20 text-blue-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(amount)
  }

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const today = new Date()
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  const handleSaveEdit = (data: Record<string, any>) => {
    setContracts(prev => prev.map(contract =>
      contract.id === editingRecord?.id
        ? {
            ...contract,
            ...data,
            salary: Number(data.salary),
            days_remaining: calculateDaysRemaining(data.contract_end)
          }
        : contract
    ))
    setEditingRecord(null)
  }

  const handleAddNew = (data: Record<string, any>) => {
    const newContract = {
      id: String(Date.now()),
      ...data,
      salary: Number(data.salary),
      days_remaining: calculateDaysRemaining(data.contract_end)
    } as typeof initialContracts[0]
    setContracts(prev => [...prev, newContract])
    setShowAddModal(false)
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Contracts</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Al-Ittihad FC - Performance Management</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          New Contract
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total Contracts</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>{contracts.length}</p>
            </div>
            <FileText className="text-[#FFD700]" size={32} />
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Active</p>
              <p className="text-3xl font-bold text-green-500">{activeContracts}</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Expiring Soon</p>
              <p className="text-3xl font-bold text-orange-500">{expiringContracts}</p>
            </div>
            <AlertTriangle className="text-orange-500" size={32} />
          </div>
        </div>
        <div className="rounded-xl p-4 shadow-lg" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total Value/Year</p>
              <p className="text-2xl font-bold text-[#FFD700]">{formatCurrency(totalValue)}</p>
            </div>
            <FileText className="text-[#FFD700]" size={32} />
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
                <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Start Date</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">End Date</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Annual Salary</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Status</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Days Remaining</th>
                <th className="px-6 py-4 text-left text-base font-semibold text-[#FFD700]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-[#FFD700]/5 transition-colors" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="px-6 py-4 text-base font-medium" style={{ color: 'var(--foreground)' }}>{contract.athlete_name}</td>
                  <td className="px-6 py-4 text-base" style={{ color: 'var(--foreground)' }}>{contract.contract_start}</td>
                  <td className="px-6 py-4 text-base" style={{ color: 'var(--foreground)' }}>{contract.contract_end}</td>
                  <td className="px-6 py-4 text-base font-medium text-[#FFD700]">{formatCurrency(contract.salary)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} style={{ color: contract.days_remaining < 180 ? 'var(--warning)' : 'var(--muted-foreground)' }} />
                      <span style={{ color: contract.days_remaining < 180 ? 'var(--warning)' : 'var(--foreground)' }}>
                        {contract.days_remaining} days
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setEditingRecord(contract)}
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
        title="Edit Contract"
        fields={contractFields}
        initialData={editingRecord || {}}
      />

      {/* Add Modal */}
      <EditModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddNew}
        title="New Contract"
        fields={contractFields}
        initialData={{ status: 'Active' }}
      />
    </div>
  )
}
