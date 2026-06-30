import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Building2, Tag, Shield, Bell, Plus, X, Check, Save, Loader, Upload } from 'lucide-react'
import { settingsAPI } from '../services/api'

function Section({ title, icon: Icon, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200/60 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-800/40">
        <Icon size={18} className="text-primary-600" />
        <h2 className="font-bold text-slate-800 dark:text-slate-100">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  )
}

const timezones = ['Asia/Kolkata (IST)', 'America/New_York (EST)', 'Europe/London (GMT)', 'Asia/Dubai (GST)']
const rolePermissions = {
  Admin: ['View All Leads', 'Edit All Leads', 'Delete Leads', 'Manage Team', 'View Reports', 'Manage Settings'],
  Manager: ['View All Leads', 'Edit All Leads', 'Assign Leads', 'View Reports'],
  Agent: ['View Assigned Leads', 'Edit Assigned Leads', 'Add Notes'],
}

export default function Settings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [error, setError] = useState('')
  const [savedMsg, setSavedMsg] = useState(false)
  const fileInputRef = useRef(null)

  const [company, setCompany] = useState({ name: '', timezone: '', logo_url: '' })
  const [statuses, setStatuses] = useState([])
  const [newStatus, setNewStatus] = useState('')
  const [sources, setSources] = useState([])
  const [notifications, setNotifications] = useState({})

  useEffect(() => {
    const load = async () => {
      try {
        const res = await settingsAPI.get()
        const s = res.settings
        setCompany({ name: s.company_name || '', timezone: s.timezone || 'Asia/Kolkata (IST)', logo_url: s.logo_url || '' })
        setStatuses(s.lead_statuses || [])
        setSources(s.lead_sources || [])
        setNotifications(s.notifications || {})
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingsAPI.update({
        company_name: company.name,
        timezone: company.timezone,
        lead_statuses: statuses,
        lead_sources: sources,
        notifications,
      })
      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 2000)
    } catch (e) {
      alert('Save nahi hua: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogoClick = () => {
    fileInputRef.current?.click()
  }

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo 2MB se chota hona chahiye')
      return
    }

    setUploadingLogo(true)
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const res = await settingsAPI.uploadLogo(base64, file.name, file.type)
      setCompany(c => ({ ...c, logo_url: res.logo_url }))
    } catch (err) {
      alert('Logo upload nahi hua: ' + err.message)
    } finally {
      setUploadingLogo(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const addStatus = () => {
    if (newStatus.trim() && !statuses.includes(newStatus.trim())) {
      setStatuses(s => [...s, newStatus.trim()])
      setNewStatus('')
    }
  }

  const removeStatus = (s) => setStatuses(st => st.filter(x => x !== s))

  const toggleSource = (name) => {
    setSources(prev => prev.map(s => s.name === name ? { ...s, enabled: !s.enabled } : s))
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center max-w-lg">
        <p className="text-red-500 font-semibold mb-2">Settings load nahi hue</p>
        <p className="text-slate-400 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">Configure your CRM workspace</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          {saving ? <Loader size={15} className="animate-spin" /> : savedMsg ? <Check size={15} /> : <Save size={15} />}
          {saving ? 'Saving...' : savedMsg ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>

      {/* Company Info */}
      <Section title="Company Information" icon={Building2} delay={0}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Company Name</label>
            <input className="input-field" value={company.name} onChange={e => setCompany(c => ({ ...c, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Company Logo</label>
            <div className="flex items-center gap-4">
              {company.logo_url ? (
                <img src={company.logo_url} alt="logo" className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-700" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-xl">
                  {company.name.slice(0, 2).toUpperCase() || 'ML'}
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              <button onClick={handleLogoClick} disabled={uploadingLogo} className="btn-secondary text-sm flex items-center gap-2">
                {uploadingLogo ? <Loader size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Timezone</label>
            <select value={company.timezone} onChange={e => setCompany(c => ({ ...c, timezone: e.target.value }))} className="input-field">
              {timezones.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </Section>

      {/* Lead Management */}
      <Section title="Lead Management" icon={Tag} delay={0.08}>
        <div>
          <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">Lead Statuses</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {statuses.map(s => (
              <motion.div
                key={s}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full group"
              >
                <span className="text-sm text-slate-700 dark:text-slate-300">{s}</span>
                <button onClick={() => removeStatus(s)} className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <X size={12} />
                </button>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="input-field flex-1 text-sm"
              placeholder="Add new status..."
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addStatus()}
            />
            <button onClick={addStatus} className="btn-primary text-sm flex items-center gap-1.5"><Plus size={14} />Add</button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">Lead Sources</h3>
          <div className="space-y-2">
            {sources.map(src => (
              <div key={src.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-sm text-slate-700 dark:text-slate-300">{src.name}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={src.enabled} onChange={() => toggleSource(src.name)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-slate-300 peer-checked:bg-primary-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Roles & Permissions */}
      <Section title="Roles & Permissions" icon={Shield} delay={0.16}>
        <div className="space-y-4">
          {Object.entries(rolePermissions).map(([role, perms]) => (
            <div key={role} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">{role}</h4>
              <div className="flex flex-wrap gap-2">
                {perms.map(p => (
                  <span key={p} className="text-xs bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-2.5 py-1 rounded-full font-medium">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notification Settings" icon={Bell} delay={0.24}>
        <div className="space-y-3">
          {[
            { key: 'newLead', label: 'New lead received', desc: 'Alert when a new lead comes from Meta Ads' },
            { key: 'followUp', label: 'Follow-up due', desc: 'Remind when a follow-up is scheduled' },
            { key: 'conversion', label: 'Lead converted', desc: 'Alert when a lead is marked as converted' },
            { key: 'teamUpdate', label: 'Team activity', desc: 'Notify when team members add notes' },
            { key: 'dailyReport', label: 'Daily report', desc: 'Receive daily performance summary' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!notifications[item.key]}
                  onChange={e => setNotifications(n => ({ ...n, [item.key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-300 peer-checked:bg-primary-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
