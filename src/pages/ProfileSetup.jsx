import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, FileText, ArrowRight, CheckCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { authAPI } from '../services/api'

export default function ProfileSetup() {
  const { user, updateUser } = useApp()
  const navigate = useNavigate()

  const [businessName, setBusinessName] = useState('')
  const [gstNumber, setGstNumber] = useState('')
  const [panNumber, setPanNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!businessName.trim()) {
      setError('Business name is required.')
      return
    }
    if (!gstNumber.trim() && !panNumber.trim()) {
      setError('Please provide either GST number or PAN number.')
      return
    }

    setLoading(true)
    try {
      const res = await authAPI.submitBusinessProfile({
        business_name: businessName.trim(),
        gst_number: gstNumber.trim(),
        pan_number: panNumber.trim(),
      })
      updateUser(res.user)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please check your details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-slate-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
            <Building2 size={26} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Welcome, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Tell us about your business to start your <span className="font-semibold text-primary-600">7-day free trial</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Business Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. Sharma Real Estate"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              GST Number
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={gstNumber}
                onChange={e => setGstNumber(e.target.value.toUpperCase())}
                placeholder="e.g. 22AAAAA0000A1Z5"
                maxLength={15}
                className="input-field pl-10 uppercase"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              PAN Number
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={panNumber}
                onChange={e => setPanNumber(e.target.value.toUpperCase())}
                placeholder="e.g. AAAAA0000A"
                maxLength={10}
                className="input-field pl-10 uppercase"
              />
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Providing either GST or PAN helps us verify your business. Your info is kept private and secure.
          </p>

          {error && (
            <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {error}
            </motion.p>
          )}

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            type="submit" disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2">
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <>Start My Free Trial <ArrowRight size={16} /></>
            )}
          </motion.button>

          <div className="flex items-center gap-2 justify-center text-xs text-slate-400 pt-1">
            <CheckCircle size={14} className="text-primary-500" />
            No credit card required for trial
          </div>
        </form>
      </motion.div>
    </div>
  )
}
