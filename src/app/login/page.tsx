'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('حدث خطأ غير متوقع')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-bold text-3xl">1</span>
            </div>
            <h1 className="text-3xl font-bold text-black">نادي الاتحاد</h1>
            <p className="text-gray-500 mt-2">نظام إدارة أداء الرياضيين</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@ittihad.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                  required
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#FFD700] focus:ring-[#FFD700]"
                />
                <span className="text-sm text-gray-600">تذكرني</span>
              </label>
              <a href="/forgot-password" className="text-sm text-[#FFD700] hover:underline">
                نسيت كلمة المرور؟
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              تسجيل الدخول
            </Button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            نادي الاتحاد السعودي - العميد منذ 1927
          </p>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-black items-center justify-center p-8 relative overflow-hidden">
        {/* Tiger Stripes Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="tiger-stripes-vertical w-full h-full"></div>
        </div>

        <div className="text-center z-10">
          <div className="w-48 h-48 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <span className="text-black font-bold text-8xl">1</span>
          </div>
          <h2 className="text-[#FFD700] text-4xl font-bold mb-4">النمور</h2>
          <p className="text-white text-xl mb-2">نادي الاتحاد السعودي</p>
          <p className="text-gray-400">أقدم نادي رياضي في المملكة</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="w-16 h-1 bg-[#FFD700]"></div>
            <span className="text-[#FFD700] font-bold">1927</span>
            <div className="w-16 h-1 bg-[#FFD700]"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
