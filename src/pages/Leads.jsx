import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Download, RefreshCw, Eye, Edit2, MessageCircle, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import { StatusBadge, tableRowVariants, Select } from '../components/ui'
import { leads as allLeads, leadStatuses, statusColors, teamMembers, campaigns } from '../data'

const PER_PAGE = 7

export default function Leads() {
  const [search, setSearch] = useState('')
  const [campaign, setCampaign] = useState('')
  const [status, setStatus] = useState('')
  const [assigned, setAssigned] = useState('')
  const [page, setPage] = useState(1)
  const [editStatus, setEditStatus] = useState({})

  const filtered = useMemo(() => allLeads.filter(l => {
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.phone.includes(search) && !l.email.toLowerCase().includes(search.toLowerCase())) return false
    if (campaign && l.campaign !== campaign) return false
    if (status && (editStatus[l.id] ?? l.status) !== status) return false
    if (assigned && l.assignedTo !== assigned) return false
    return true
  }), [search, campaign, status, assigned, editStatus])

  const total = filtered.length
  const totalPages = Math.ceil(total / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleStatusChange = (id, s) => setEditStatus(p => ({ ...p, [id]: s }))

  const statusOpts = [{ value: '', label: 'All Status' }, ...leadStatuses.map(s => ({ value: s, label: s }))]
  const campaignOpts = [{ value: '', label: 'All Campaigns' }, ...campaigns.map(c => ({ value: c.name, label: c.name }))]
  const assignedOpts = [{ value: '', label: 'All Agents' }, ...teamMembers.map(m => ({ value: m.name, label: m.name }))]
  const statusDropdownOpts = leadStatuses.map(s => ({ value: s, label: s }))

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Leads</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">{total} total leads</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <Download size={15} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="btn-secondary flex items-center gap-2 text-sm" onClick={() => { setSearch(''); setCampaign(''); setStatus(''); setAssigned(''); setPage(1) }}>
            <RefreshCw size={15} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search name, phone, email..."
              className="input-field pl-9 text-sm"
            />
          </div>
          <Select value={campaign} onChange={v => { setCampaign(v); setPage(1) }} options={campaignOpts} />
          <Select value={status} onChange={v => { setStatus(v); setPage(1) }} options={statusOpts} />
          <Select value={assigned} onChange={v => { setAssigned(v); setPage(1) }} options={assignedOpts} />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="glass-card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 sticky top-0">
              <tr>
                {['Name & Contact', 'Campaign', 'Status', 'Assigned To', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paged.map((lead, i) => (
                  <motion.tr
                    key={lead.id}
                    custom={i}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <Link to={`/leads/${lead.id}`} className="font-semibold text-slate-800 dark:text-slate-100 hover:text-primary-600 text-sm">{lead.name}</Link>
                      <p className="text-xs text-slate-400 mt-0.5">{lead.phone}</p>
                      <p className="text-xs text-slate-400">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium max-w-[130px] truncate">{lead.campaign}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[130px]">{lead.ad}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={editStatus[lead.id] ?? lead.status}
                        onChange={e => handleStatusChange(lead.id, e.target.value)}
                        className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        {leadStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{lead.assignedTo}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{lead.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to={`/leads/${lead.id}`} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-500 hover:text-blue-600 transition-colors" title="View">
                          <Eye size={15} />
                        </Link>
                        <button className="p-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 text-slate-500 hover:text-violet-600 transition-colors" title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                          className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-slate-500 hover:text-green-600 transition-colors" title="WhatsApp">
                          <MessageCircle size={15} />
                        </a>
                        <a href={`tel:${lead.phone}`} className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-slate-500 hover:text-orange-600 transition-colors" title="Call">
                          <Phone size={15} />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {paged.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Search size={40} className="mx-auto mb-3 opacity-30" />
              <p>No leads found</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        <AnimatePresence>
          {paged.map((lead, i) => (
            <motion.div
              key={lead.id}
              custom={i}
              variants={tableRowVariants}
              initial="hidden"
              animate="visible"
              className="glass-card p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link to={`/leads/${lead.id}`} className="font-bold text-slate-800 dark:text-slate-100 hover:text-primary-600">{lead.name}</Link>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{lead.phone}</p>
                </div>
                <StatusBadge status={editStatus[lead.id] ?? lead.status} colors={statusColors} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{lead.campaign} · {lead.assignedTo}</p>
              <div className="flex items-center gap-2">
                <Link to={`/leads/${lead.id}`} className="flex-1 text-center btn-secondary text-xs py-1.5">View</Link>
                <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 text-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold text-xs py-1.5 rounded-xl hover:bg-green-200 transition-colors">WhatsApp</a>
                <a href={`tel:${lead.phone}`} className="flex-1 text-center bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold text-xs py-1.5 rounded-xl hover:bg-orange-200 transition-colors">Call</a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between glass-card px-4 py-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400 transition-colors">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${n === page ? 'bg-primary-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-400 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
