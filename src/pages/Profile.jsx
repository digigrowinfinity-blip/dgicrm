
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Shield, Building2, FileText, Calendar, CheckCircle, AlertTriangle, Save } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { authAPI } from '../services/api'

export default function Profile() {
  const { user, updateUser, refreshUser } = useApp()

  const [businessName, setBusinessName] = useState('')
  const [gstNumber, setGstNumber] = useState('')
  const [panNumber, setPanNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    refreshUser()
  }, [])

  useEffect(() => {
    setBusinessName(user?.business_name || '')
    setGstNumber(user?.gst_number || '')
    setPanNumber(user?.pan_number || '')
  }, [user?.business_name, user?.gst_number, user?.pan_number])

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

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
      setSuccess('Business details updated successfully.')
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  // ── Trial status badge logic ──────────────────────────────────────────
  const status = user?.subscription_status
  const daysRemaining = user?.days_remaining

  let badge = { label: 'Pending', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' }
  if (status === 'active') {
    badge = { label: 'Active Subscription', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' }
  } else if (status === 'trial') {
    if (daysRemaining !== null && daysRemaining <= 0) {
      badge = { label: 'Trial Expired', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
    } else {
      badge = { label: 'Trial Active', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
    }
  } else if (status === 'expired') {
    badge = { label: 'Trial Expired', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">My Profile</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Manage your personal and business information</p>

      {/* Personal Info */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <User size={18} className="text-primary-600" />
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Personal Information</h2>
        </div>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-primary-600 flex items-center justify-center text-white text-lg font-bold shrink-0">
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD'}
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{user?.name || '—'}</p>
            <p className="text-sm text-slate-400">{user?.email || '—'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Mail size={14} /> {user?.email || '—'}
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Shield size={14} /> Role: <span className="font-medium text-slate-700 dark:text-slate-300">{user?.role || '—'}</span>
          </div>
        </div>
      </motion.div>

      {/* Subscription / Trial Status */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-primary-600" />
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Subscription Status</h2>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${badge.color}`}>
            {badge.label}
          </span>

          {status === 'trial' && daysRemaining !== null && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {daysRemaining > 0
                ? <>⏳ <span className="font-semibold text-slate-700 dark:text-slate-200">{daysRemaining} day{daysRemaining !== 1 ? 's' : ''}</span> remaining in your trial</>
                : 'Your trial has ended'}
            </p>
          )}

          {status !== 'active' && (
            <button
              type="button"
              className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
              onClick={() => alert('Upgrade flow coming soon!')}
            >
              Upgrade Now
            </button>
          )}
        </div>

        {status === 'trial' && daysRemaining !== null && daysRemaining <= 2 && daysRemaining > 0 && (
          <div className="mt-4 flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-sm px-3 py-2.5 rounded-lg">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            Your trial is ending soon. Upgrade now to avoid losing access.
          </div>
        )}
      </motion.div>

      {/* Business Info (editable) */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-5">
          <Building2 size={18} className="text-primary-600" />
          <h2 className="font-semibold text-slate-800 dark:text-slate-100">Business Details</h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
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
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          {success && (
            <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg flex items-center gap-2">
              <CheckCircle size={14} /> {success}
            </motion.p>
          )}

          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            type="submit" disabled={loading}
            className="btn-primary px-5 py-2.5 flex items-center gap-2">
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <><Save size={16} /> Save Changes</>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
