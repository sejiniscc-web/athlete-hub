'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { authenticateUser } from '@/context/UserContext'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, Shield, Users, Activity, BarChart3 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const currentUserId = localStorage.getItem('athlete_hub_current_user')
    if (currentUserId) {
      // User is already logged in, redirect to dashboard
      router.replace('/dashboard')
    } else {
      setCheckingAuth(false)
    }
  }, [router])

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full" />
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Authenticate user with email and password
      const result = authenticateUser(email, password)

      if (!result.success || !result.user) {
        setError(result.error || 'Authentication failed')
        return
      }

      // Save user ID to localStorage
      localStorage.setItem('athlete_hub_current_user', result.user.id)

      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500))

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    { icon: Users, title: 'Athlete Management', desc: 'Comprehensive athlete profiles and tracking' },
    { icon: Activity, title: 'Fitness Assessment', desc: 'Complete fitness tests and performance analysis' },
    { icon: Shield, title: 'Medical Records', desc: 'Secure health data and injury tracking' },
    { icon: BarChart3, title: 'Analytics & Reports', desc: 'Detailed reports and data visualization' },
  ]

  return (
    <div className="min-h-screen flex overflow-hidden" dir="ltr">
      {/* Left Side - Branding */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 50 }}
        className="hidden lg:flex flex-1 bg-gradient-to-br from-black via-gray-900 to-black items-center justify-center p-12 relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#FFD700]/30 rounded-full"
              style={{
                left: `${(i * 17 + 5) % 90 + 5}%`,
                top: `${(i * 23 + 10) % 80 + 10}%`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}

          {/* Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#FFD700]/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        <div className="text-center z-10 max-w-lg">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
            className="relative inline-block mb-10"
          >
            <motion.div
              className="absolute inset-0 bg-[#FFD700]/30 rounded-full blur-2xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <img
              src="/ittihad-logo.png"
              alt="Al-Ittihad FC Logo"
              className="relative w-40 h-40 object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-4xl font-bold mb-4 text-white"
          >
            Athlete Performance
            <span className="text-[#FFD700] block">Management System</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-gray-400 text-lg mb-4"
          >
            A comprehensive platform for tracking and analyzing athlete performance
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-[#FFD700] text-sm mb-10"
          >
            Al-Ittihad FC - The Tigers | The oldest sports club in Saudi Arabia since 1927
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="space-y-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ x: 10 }}
                className="flex items-center gap-4 bg-white/5 rounded-xl px-6 py-4 border border-white/10 backdrop-blur-sm text-left"
              >
                <div className="w-12 h-12 bg-[#FFD700]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="text-[#FFD700]" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FFD700] transition-colors mb-8 group">
              <motion.span
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowLeft size={20} />
              </motion.span>
              <span>Back to Home</span>
            </Link>
          </motion.div>

          {/* Logo & Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center mb-10"
          >
            <motion.div
              className="relative inline-block mb-6 lg:hidden"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="absolute inset-0 bg-[#FFD700]/30 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative w-24 h-24 bg-gradient-to-br from-[#FFD700] to-yellow-500 rounded-full flex items-center justify-center shadow-2xl shadow-[#FFD700]/30">
                <img
                  src="/ittihad-logo.png"
                  alt="Al-Ittihad FC Logo"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-500"
            >
              Sign in to access the dashboard
            </motion.p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleLogin}
            className="space-y-6"
          >
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2"
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    ⚠️
                  </motion.span>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <motion.div
                className="relative"
                animate={{
                  scale: focusedField === 'email' ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="example@email.com"
                  className={`w-full pl-4 pr-12 py-4 border-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all duration-300 ${
                    focusedField === 'email'
                      ? 'border-[#FFD700] ring-4 ring-[#FFD700]/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  required
                />
                <motion.div
                  animate={{
                    color: focusedField === 'email' ? '#FFD700' : '#9CA3AF'
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <Mail size={20} />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <motion.div
                className="relative"
                animate={{
                  scale: focusedField === 'password' ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white transition-all duration-300 ${
                    focusedField === 'password'
                      ? 'border-[#FFD700] ring-4 ring-[#FFD700]/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  required
                />
                <motion.div
                  animate={{
                    color: focusedField === 'password' ? '#FFD700' : '#9CA3AF'
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <Lock size={20} />
                </motion.div>
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FFD700] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Remember & Forgot */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-md border-gray-300 text-[#FFD700] focus:ring-[#FFD700] transition-all"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-[#FFD700] transition-colors">
                Forgot password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-black via-gray-900 to-black text-[#FFD700] font-bold text-lg rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/0 via-[#FFD700]/10 to-[#FFD700]/0"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-gray-400 text-sm mt-8"
          >
            Created by <span className="text-[#FFD700]">Abdulelah Sejini</span>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
