'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Award, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  const benefits = [
    'Comprehensive tracking for each athlete',
    'High-precision data analysis',
    'Instant exportable reports',
    'Advanced permissions system',
    'User-friendly interface',
    'Continuous updates',
    'Data protection and security'
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
          <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
            <Link href="/" className="flex items-center gap-3">
              <img src="/ittihad-logo.png" alt="Al-Ittihad FC Logo" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-white font-bold text-lg">Al-Ittihad FC</h1>
                <p className="text-white text-xs">Performance Management</p>
              </div>
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-[#FFD700] transition-colors">Home</Link>
            <Link href="/about" className="text-[#FFD700] font-medium">About</Link>
            <Link href="/login" className="text-gray-300 hover:text-[#FFD700] transition-colors">Login</Link>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/login" className="px-6 py-2 bg-[#FFD700] text-black font-semibold rounded-lg hover:bg-white transition-all shadow-lg shadow-[#FFD700]/30">
              Get Started
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-[#FFD700]/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Floating Shapes */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-[#FFD700]/20 rounded-full"
            style={{ left: `${10 + i * 10}%`, top: `${20 + (i % 3) * 20}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-2 bg-[#FFD700]/20 text-[#FFD700] rounded-full text-sm font-medium mb-6"
              >
                About the System
              </motion.span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                A Complete System for
                <span className="text-[#FFD700] block">Sports Performance</span>
              </h1>
              <p className="text-white text-lg mb-8 leading-relaxed">
                The Athlete Performance Management System is a comprehensive platform designed specifically for Al-Ittihad FC,
                aimed at tracking, analyzing, and developing athlete performance through advanced tools and modern technologies.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/login" className="px-10 py-4 bg-[#FFD700] text-black font-bold rounded-lg flex items-center gap-3 hover:bg-white transition-all shadow-xl">
                    <span>Try the System Now</span>
                    <ArrowRight size={20} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-[#FFD700]/30 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <img
                  src="/ittihad-logo.png"
                  alt="Al-Ittihad FC Logo"
                  className="relative w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-[#FFD700]/20 text-[#FFD700] rounded-full text-sm font-medium mb-6">
                Features
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose <span className="text-[#FFD700]">Our System?</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                We offer you a unique set of features that make managing athlete performance easier and more effective
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-white transition-all shadow-xl">
                  <span>Get Started</span>
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, x: 5 }}
                  className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10 hover:border-[#FFD700]/50 transition-all"
                >
                  <div className="w-8 h-8 bg-[#FFD700]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap size={16} className="text-[#FFD700]" />
                  </div>
                  <span className="text-white text-sm">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#FFD700] via-yellow-400 to-[#FFD700] relative overflow-hidden">
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
              <Award className="text-black" size={48} />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-black/70 text-xl mb-10">
              Join us today and start developing your athletes&apos; performance
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/login" className="inline-block px-12 py-5 bg-black text-[#FFD700] font-bold rounded-full text-lg hover:bg-gray-900 transition-all shadow-2xl">
                Sign In Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div className="flex items-center gap-4" whileHover={{ scale: 1.05 }}>
              <img src="/ittihad-logo.png" alt="Al-Ittihad FC Logo" className="w-14 h-14 object-contain" />
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
