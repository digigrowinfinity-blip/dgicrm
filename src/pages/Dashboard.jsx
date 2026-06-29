import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, UserPlus, Phone, RefreshCw, UserX, Clock, PhoneOff, AlertCircle, CheckCircle2, TrendingUp, BarChart3, Target } from 'lucide-react'
import { StatCard, StatusBadge, Skeleton } from '../components/ui'
import { leadsAPI, teamAPI } from '../services/api'
import { statusColors } from '../data'

const statCards = [
  { title: 'Total Leads',   key: 'totalLeads',   icon: Users,        color: 'bg-primary-600' },
  { title: 'New Leads',     key: 'newLeads',      icon: UserPlus,     color: 'bg-violet-600' },
  { title: 'Contacted',     key: 'contacted',     icon: Phone,        color: 'bg-blue-600' },
  { title: 'Follow Up',     key: 'followUps',     icon: RefreshCw,    color: 'bg-yellow-500' },
  { title: 'Not Picked',    key: 'notPicked',     icon: PhoneOff,     color: 'bg-orange-500' },
  { title: 'Not Relevant',  key: 'notRelevant',   icon: UserX,        color: 'bg-slate-500' },
  { title: 'Busy',          key: 'busy',          icon: Clock,        color: 'bg-amber-500' },
  { title: 'Switch Off',    key: 'switchOff',     icon: PhoneOff,     color: 'bg-red-600' },
  { title: 'Wrong Number',  key: 'wrongNumber',   icon: AlertCircle,  color: 'bg-rose-600' },
  { title: 'Converted',     key: 'converted',     icon: CheckCircle2, color: 'bg-green-600' },
]

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          leadsAPI.stats(),
          leadsAPI.getAll({ page: 1, limit: 5 }),
        ])
        // Backend returns { success, stats: { totalLeads, newLeads, ... } }
        setStats(statsRes.stats)
        setRecentLeads(leadsRes.leads || [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const conversionRate = stats
    ? (((stats.converted || 0) / (stats.totalLeads || 1)) * 100).toFixed(1)
    : '0.0'

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array(10).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-64" />
    </div>
  )

  if (error) return (
    <div className="glass-card p-8 text-center">
      <p className="text-red-500 font-semibold mb-2">Error: {error}</p>
      <button onClick={() => window.location.reload()} className="btn-primary text-sm mt-2">Retry</button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's your lead overview.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={card.key} title={card.title} value={stats?.[card.key] || 0}
            icon={card.icon} color={card.color} delay={i * 0.06} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-primary-600" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Recent Leads</h2>
            </div>
            <Link to="/leads" className="text-sm text-primary-600 font-semibold">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            {recentLeads.length === 0 ? (
              <p className="text-center py-12 text-slate-400">Koi leads nahi hain abhi.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left bg-slate-50/80 dark:bg-slate-800/60">
                    {['Name', 'Status', 'Campaign', 'Assigned To'].map(h => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead, i) => (
                    <motion.tr key={lead.id}
                      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 + 0.3 }}
                      className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/leads/${lead.id}`} className="font-semibold text-slate-800 dark:text-slate-100 hover:text-primary-600 text-sm">{lead.name}</Link>
                        <p className="text-xs text-slate-400">{lead.phone}</p>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={lead.status} colors={statusColors} /></td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 max-w-[140px] truncate">{lead.campaign_name || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{lead.assigned_user?.name || '—'}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target size={18} className="text-green-600" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Conversion Rate</h2>
            </div>
            <div className="text-center py-4">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                  <motion.path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#22C55E" strokeWidth="3"
                    strokeDasharray={`${conversionRate}, 100`}
                    initial={{ strokeDasharray: '0, 100' }}
                    animate={{ strokeDasharray: `${conversionRate}, 100` }}
                    transition={{ duration: 1.2, delay: 0.5 }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{conversionRate}%</p>
                    <p className="text-xs text-slate-400">Rate</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500">{stats?.converted || 0} of {stats?.totalLeads || 0} converted</p>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={16} className="text-primary-600" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Status Overview</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Converted', val: stats?.converted || 0, color: 'bg-green-500' },
                { label: 'Follow Up', val: stats?.followUps || 0, color: 'bg-yellow-500' },
                { label: 'Contacted', val: stats?.contacted || 0, color: 'bg-blue-500' },
                { label: 'New', val: stats?.newLeads || 0, color: 'bg-violet-500' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.val}</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats?.totalLeads > 0 ? (item.val / stats.totalLeads) * 100 : 0}%` }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className={`h-full rounded-full ${item.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
