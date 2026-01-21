'use client'

import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import Button from './Button'

export interface FieldConfig {
  key: string
  label: string
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'rating'
  options?: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
}

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Record<string, any>) => void
  title: string
  fields: FieldConfig[]
  initialData: Record<string, any>
}

export default function EditModal({
  isOpen,
  onClose,
  onSave,
  title,
  fields,
  initialData,
}: EditModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({ ...initialData })
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const renderField = (field: FieldConfig) => {
    const value = formData[field.key] ?? ''

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
            style={{ border: '1px solid var(--border)', color: 'var(--foreground)', backgroundColor: 'var(--card)' }}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
            style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
            placeholder={field.placeholder}
            required={field.required}
          />
        )

      case 'rating':
        return (
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={field.min || 1}
              max={field.max || 10}
              value={value}
              onChange={(e) => handleChange(field.key, parseInt(e.target.value))}
              className="flex-1 accent-[#FFD700]"
            />
            <span className="text-lg font-bold text-[#FFD700] w-12 text-center">{value}/{field.max || 10}</span>
          </div>
        )

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(field.key, field.step ? parseFloat(e.target.value) : parseInt(e.target.value))}
            className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
            style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            required={field.required}
          />
        )

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
            style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
            required={field.required}
          />
        )

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(field.key, e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-transparent focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
            style={{ border: '1px solid var(--border)', color: 'var(--foreground)' }}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#FFD700]">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FFD700]/20 rounded-lg transition-colors"
          >
            <X size={20} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <Button type="submit" variant="primary" leftIcon={<Save size={18} />}>
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
