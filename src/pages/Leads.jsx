import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Download, RefreshCw, Eye, Edit2, MessageCircle, Phone, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { StatusBadge, tableRowVariants, Skeleton } from '../components/ui'
import { leadsAPI } from '../services/api'
import { leadStatuses, statusColors } from '../data'

const PER_PAGE = 10

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const res = await leadsAPI.getAll({ page, limit: PER_PAGE, status: status || undefined, search: search || undefined })
      setLeads(res.leads || [])
      setTotal(res.total || 0)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [page, status, search])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await leadsAPI.updateStatus(id, newStatus)
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l))
    } catch (e) {
      alert('Status update failed: ' + e.message)
    }
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Leads</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">{total} total leads</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2 text-sm" onClick={fetchLeads}>
            <RefreshCw size={15} />Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search name, phone..."
              className="input-field pl-9 text-sm" />
          </div>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }} className="input-field text-sm">
            <option value="">All Status</option>
            {leadStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div className="glass-card p-4 border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Desktop Table */}
      <div className="glass-card overflow-hidden hidden md:block">
        {loading ? (
          <div className="p-4 space-y-3">{Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : (
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
                  {leads.map((lead, i) => (
                    <motion.tr key={lead.id} custom={i} variants={tableRowVariants} initial="hidden" animate="visible"
                      className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/leads/${lead.id}`} className="font-semibold text-slate-800 dark:text-slate-100 hover:text-primary-600 text-sm">{lead.name}</Link>
                        <p className="text-xs text-slate-400 mt-0.5">{lead.phone}</p>
                        {lead.email && <p className="text-xs text-slate-400">{lead.email}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium max-w-[130px] truncate">{lead.campaign_name || '—'}</p>
                        {lead.ad_name && <p className="text-xs text-slate-400 truncate max-w-[130px]">{lead.ad_name}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <select value={lead.status} onChange={e => handleStatusChange(lead.id, e.target.value)}
                          className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500">
                          {leadStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{lead.assigned_user?.name || '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{lead.created_at?.split('T')[0] || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link to={`/leads/${lead.id}`} className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-500 hover:text-blue-600 transition-colors" title="View">
                            <Eye size={15} />
                          </Link>
                          <a href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                            className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-slate-500 hover:text-green-600 transition-colors" title="WhatsApp">
                            <MessageCircle size={15} />
                          </a>
                          <a href={`tel:${lead.phone}`}
                            className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-slate-500 hover:text-orange-600 transition-colors" title="Call">
                            <Phone size={15} />
                          </a>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {leads.length === 0 && !loading && (
              <div className="text-center py-16 text-slate-400">
                <Search size={40} className="mx-auto mb-3 opacity-30" />
                <p>Koi leads nahi mili</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      {!loading && (
        <div className="md:hidden space-y-3">
          {leads.map((lead, i) => (
            <motion.div key={lead.id} custom={i} variants={tableRowVariants} initial="hidden" animate="visible" className="glass-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link to={`/leads/${lead.id}`} className="font-bold text-slate-800 dark:text-slate-100 hover:text-primary-600">{lead.name}</Link>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{lead.phone}</p>
                </div>
                <StatusBadge status={lead.status} colors={statusColors} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{lead.campaign_name || '—'} · {lead.assigned_user?.name || 'Unassigned'}</p>
              <div className="flex items-center gap-2">
                <Link to={`/leads/${lead.id}`} className="flex-1 text-center btn-secondary text-xs py-1.5">View</Link>
                <a href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 text-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold text-xs py-1.5 rounded-xl">WhatsApp</a>
                <a href={`tel:${lead.phone}`} className="flex-1 text-center bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold text-xs py-1.5 rounded-xl">Call</a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between glass-card px-4 py-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-slate-600 dark:text-slate-400">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${n === page ? 'bg-primary-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-slate-600 dark:text-slate-400">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
