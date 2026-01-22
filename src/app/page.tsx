'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Activity, Users, Shield, BarChart3, Clock, Globe, ChevronDown, Star, Trophy, Target } from 'lucide-react'

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const features = [
    { icon: Users, title: 'Athlete Management', desc: 'Comprehensive profiles for each athlete including personal, physical, and sports data' },
    { icon: Activity, title: 'Fitness Assessment', desc: 'Complete fitness tests with progress tracking over time' },
    { icon: Shield, title: 'Medical Records', desc: 'Track health status, injuries, and treatments for each athlete' },
    { icon: BarChart3, title: 'Analytics & Reports', desc: 'Detailed reports and comprehensive statistics for data-driven decisions' },
    { icon: Clock, title: 'Real-time Updates', desc: 'Instant updates and notifications for all activities and changes' },
    { icon: Globe, title: 'Multi-role Access', desc: 'Custom permissions for doctors, coaches, administrators, and athletes' },
  ]

  const stats = [
    { value: '1927', label: 'Year Founded', icon: Trophy },
    { value: '6', label: 'Integrated Services', icon: Target },
    { value: '4', label: 'User Types', icon: Users },
    { value: '24/7', label: 'Continuous Monitoring', icon: Clock },
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden" dir="ltr">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.img
              src="/ittihad-logo.png"
              alt="Al-Ittihad FC Logo"
              className="w-12 h-12 object-contain"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <div>
              <h1 className="text-white font-bold text-lg">Al-Ittihad FC</h1>
              <p className="text-white text-xs">Performance Management</p>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-[#FFD700] font-medium hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="text-gray-300 hover:text-[#FFD700] transition-colors">About</Link>
            <Link href="/login" className="text-gray-300 hover:text-[#FFD700] transition-colors">Login</Link>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/login"
              className="px-8 py-3 bg-[#FFD700] text-black font-semibold rounded-lg hover:bg-white transition-all shadow-lg shadow-[#FFD700]/30"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#FFD700]/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Gradient Orbs */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FFD700]/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            className="relative inline-block mb-8"
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
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Athlete Performance{' '}
            <motion.span
              className="text-[#FFD700] inline-block"
              animate={{
                textShadow: ['0 0 20px #FFD700', '0 0 40px #FFD700', '0 0 20px #FFD700']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Management
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-6"
          >
            A comprehensive platform for tracking and evaluating athlete performance at Al-Ittihad FC
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-[#FFD700] mb-16"
          >
            The Tigers since 1927
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-20"
          >
            <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/login"
                className="px-14 py-5 bg-[#FFD700] text-black font-bold rounded-lg text-lg hover:bg-white transition-all shadow-2xl shadow-[#FFD700]/40 flex items-center gap-4"
              >
                <span>Get Started</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/about"
                className="px-14 py-5 border-2 border-white/30 text-white font-bold rounded-lg text-lg hover:border-[#FFD700] hover:text-[#FFD700] transition-all backdrop-blur-sm"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-10"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-white/50 flex flex-col items-center gap-2"
            >
              <span className="text-sm">Discover More</span>
              <ChevronDown size={24} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50 relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent" />

        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-2 bg-[#FFD700]/10 text-[#B8960B] rounded-full text-sm font-medium mb-4"
            >
              System Features
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need in <span className="text-[#FFD700]">One Place</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A comprehensive system for managing all aspects of athlete performance
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
              >
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#FFD700]/10 transition-colors"
                />
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-16 h-16 bg-gradient-to-br from-[#FFD700] to-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#FFD700]/30"
                >
                  <feature.icon className="text-black" size={28} />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 relative">{feature.title}</h3>
                <p className="text-gray-600 relative">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #FFD700 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FFD700]/20 transition-colors"
                >
                  <stat.icon className="text-[#FFD700]" size={28} />
                </motion.div>
                <motion.p
                  className="text-5xl font-bold text-[#FFD700] mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-white text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-[#FFD700] via-yellow-400 to-[#FFD700] relative overflow-hidden">
        {/* Animated Shapes */}
        <motion.div
          className="absolute top-10 right-10 w-32 h-32 border-4 border-black/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-24 h-24 bg-black/5 rounded-2xl"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Star className="text-black" size={48} fill="black" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Start Developing Your Athletes Today
            </h2>
            <p className="text-black/70 text-xl mb-10">
              Join Al-Ittihad FC&apos;s sports performance management system
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/login"
                className="inline-block px-12 py-5 bg-black text-[#FFD700] font-bold rounded-full text-lg hover:bg-gray-900 transition-all shadow-2xl"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div
              className="flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/ittihad-logo.png"
                alt="Al-Ittihad FC Logo"
                className="w-14 h-14 object-contain"
              />
              <div>
                <p className="text-[#FFD700] font-bold text-lg">Al-Ittihad FC</p>
                <p className="text-gray-400 text-sm">The Tigers - The Nation&apos;s Club</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-8">
              <Link href="/" className="text-gray-400 hover:text-[#FFD700] transition-colors">Home</Link>
              <Link href="/about" className="text-gray-400 hover:text-[#FFD700] transition-colors">About</Link>
              <Link href="/login" className="text-gray-400 hover:text-[#FFD700] transition-colors">Login</Link>
            </div>

            <p className="text-gray-400 text-sm">
              Created by <span className="text-[#FFD700]">Abdulelah Sejini</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
