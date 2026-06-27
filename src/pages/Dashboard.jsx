import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, UserPlus, Phone, RefreshCw, UserX, XCircle, Clock,
  PhoneOff, AlertCircle, CheckCircle2, TrendingUp, BarChart3, Target
} from 'lucide-react'
import { StatCard, StatusBadge } from '../components/ui'
import { leads, dashboardStats, campaigns, teamMembers, statusColors } from '../data'

const statCards = [
  { title: 'Total Leads', key: 'totalLeads', icon: Users, color: 'bg-primary-600' },
  { title: 'New Leads', key: 'newLeads', icon: UserPlus, color: 'bg-violet-600' },
  { title: 'Contacted', key: 'contacted', icon: Phone, color: 'bg-blue-600' },
  { title: 'Follow Up', key: 'followUp', icon: RefreshCw, color: 'bg-yellow-500' },
  { title: 'Not Picked', key: 'notPicked', icon: PhoneOff, color: 'bg-orange-500' },
  { title: 'Not Relevant', key: 'notRelevant', icon: UserX, color: 'bg-slate-500' },
  { title: 'Busy', key: 'busy', icon: Clock, color: 'bg-amber-500' },
  { title: 'Switch Off', key: 'switchOff', icon: PhoneOff, color: 'bg-red-600' },
  { title: 'Wrong Number', key: 'wrongNumber', icon: AlertCircle, color: 'bg-rose-600' },
  { title: 'Converted', key: 'converted', icon: CheckCircle2, color: 'bg-green-600' },
]

const recentLeads = leads.slice(0, 5)
const todayLeads = leads.filter(l => l.createdAt === '2024-03-16' || l.createdAt === '2024-03-15').slice(0, 4)

export default function Dashboard() {
  const conversionRate = ((dashboardStats.converted / dashboardStats.totalLeads) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here's your lead overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <StatCard
            key={card.key}
            title={card.title}
            value={dashboardStats[card.key]}
            icon={card.icon}
            color={card.color}
            delay={i * 0.06}
          />
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Leads Table */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-primary-600" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Recent Leads</h2>
            </div>
            <Link to="/leads" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-slate-50/80 dark:bg-slate-800/60">
                  {['Name', 'Status', 'Campaign', 'Assigned To'].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead, i) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 + 0.3 }}
                    className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link to={`/leads/${lead.id}`} className="font-semibold text-slate-800 dark:text-slate-100 hover:text-primary-600 text-sm">{lead.name}</Link>
                      <p className="text-xs text-slate-400">{lead.phone}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} colors={statusColors} /></td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 max-w-[140px] truncate">{lead.campaign}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{lead.assignedTo}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conversion Widget */}
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
                  <motion.path
                    d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#22C55E" strokeWidth="3"
                    strokeDasharray={`${conversionRate}, 100`}
                    initial={{ strokeDasharray: '0, 100' }}
                    animate={{ strokeDasharray: `${conversionRate}, 100` }}
                    transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{conversionRate}%</p>
                    <p className="text-xs text-slate-400">Rate</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{dashboardStats.converted} of {dashboardStats.totalLeads} leads converted</p>
            </div>
          </div>

          {/* Lead Status Overview mini */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={16} className="text-primary-600" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Status Overview</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Converted', val: dashboardStats.converted, max: dashboardStats.totalLeads, color: 'bg-green-500' },
                { label: 'Follow Up', val: dashboardStats.followUp, max: dashboardStats.totalLeads, color: 'bg-yellow-500' },
                { label: 'Contacted', val: dashboardStats.contacted, max: dashboardStats.totalLeads, color: 'bg-blue-500' },
                { label: 'New', val: dashboardStats.newLeads, max: dashboardStats.totalLeads, color: 'bg-violet-500' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.val}</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.val / item.max) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Campaign Performance */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200/60 dark:border-slate-700/60">
            <TrendingUp size={18} className="text-primary-600" />
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Campaign Performance</h2>
          </div>
          <div className="p-4 space-y-3">
            {campaigns.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.leads} leads · CPL: {c.cpl}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{c.converted}</p>
                  <p className="text-xs text-slate-400">converted</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200/60 dark:border-slate-700/60">
            <Users size={18} className="text-primary-600" />
            <h2 className="font-bold text-slate-800 dark:text-slate-100">Team Performance</h2>
          </div>
          <div className="p-4 space-y-3">
            {teamMembers.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{m.name}</p>
                  <p className="text-xs text-slate-400">{m.assignedLeads} leads</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{((m.converted / m.assignedLeads) * 100).toFixed(0)}%</p>
                  <p className="text-xs text-slate-400">conv. rate</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Leads */}
      <div className="glass-card overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200/60 dark:border-slate-700/60">
          <Clock size={18} className="text-primary-600" />
          <h2 className="font-bold text-slate-800 dark:text-slate-100">Today's Leads</h2>
          <span className="ml-auto bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-bold px-2 py-0.5 rounded-full">{todayLeads.length} new</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {todayLeads.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 + 0.2 }}
              whileHover={{ y: -2 }}
            >
              <Link to={`/leads/${lead.id}`} className="block p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 text-xs font-bold">
                    {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <StatusBadge status={lead.status} colors={statusColors} />
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{lead.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{lead.campaign}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
