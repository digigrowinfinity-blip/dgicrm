import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight, CheckCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { authAPI } from '../services/api'

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 4.99 3.224 9.241 7.688 10.777v-7.625H5.338V12.07h2.35V9.795c0-2.323 1.385-3.607 3.504-3.607.989 0 2.022.177 2.022.177v2.226h-1.14c-1.123 0-1.47.696-1.47 1.41v1.692h2.5l-.4 2.976H10.6v7.625C14.776 21.314 24 17.06 24 12.073z"/>
    </svg>
  )
}

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authAPI.login(email, password)
      login({ ...data.user, token: data.token })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
  setFbLoading(true)
  setError('')
  try {
    const res = await fetch('https://meta-crm-backend.onrender.com/api/facebook/login-url')
    const data = await res.json()
    if (data.success && data.url) {
      window.location.href = data.url
    } else {
      setError('Facebook login setup mein error hai.')
      setFbLoading(false)
    }
  } catch (err) {
    setError('Facebook se connect nahi ho paya. Dobara try karo.')
    setFbLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-surface dark:bg-slate-950 flex">
      <motion.div
        initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex flex-1 bg-sidebar relative overflow-hidden items-center justify-center"
      >
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}
              className="absolute rounded-full bg-primary-500"
              style={{ width: `${200 + i * 80}px`, height: `${200 + i * 80}px`, left: `${-60 + i * 30}px`, top: `${-60 + i * 20}px` }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center px-12 max-w-md">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-500/40">
            <Zap size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">Meta Lead<br /><span className="text-primary-400">CRM</span></h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">Capture, manage, and convert your Meta ad leads with intelligent automation.</p>
          <div className="space-y-3">
            {['Automated lead capture from Meta Ads', 'Smart assignment & follow-up tracking', 'Real-time team performance analytics'].map((f, i) => (
              <motion.div key={f} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.15 }}
                className="flex items-center gap-3 text-left">
                <CheckCircle size={18} className="text-primary-400 shrink-0" />
                <span className="text-slate-300 text-sm">{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex-1 lg:max-w-lg flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center"><Zap size={18} className="text-white" /></div>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100">Meta Lead CRM</span>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400">Sign in to your CRM dashboard</p>
          </div>

      <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={fbLoading}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold py-3 px-6 rounded-xl mb-6 transition-colors"
          >
            {fbLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            ) : (
              <><FacebookIcon />Continue with Facebook</>
            )}
      </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-sm text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@gmail.com" className="input-field pl-10" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="input-field pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded accent-primary-600" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Forgot password?</button>
            </div>
            {error && (
              <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                {error}
              </motion.p>
            )}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (<>Sign In <ArrowRight size={16} /></>)}
            </motion.button>
          </form>
          <p className="text-xs text-slate-400 text-center mt-6">Contact your administrator to create an account.</p>
        </div>
      </motion.div>
    </div>
  )
}
