import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, RefreshCw, Eye, MessageCircle, Phone, ChevronLeft, ChevronRight, Plus, Upload, X } from 'lucide-react'
import { StatusBadge, tableRowVariants, Skeleton, Modal } from '../components/ui'
import { leadsAPI } from '../services/api'
import { leadStatuses, statusColors } from '../data'

const PER_PAGE = 10

const emptyForm = {
  name: '', phone: '', email: '', city: '',
  campaign_name: '', ad_name: '', adset_name: '', form_name: '',
  status: 'New', notes: ''
}

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  // Modals
  const [addModal, setAddModal] = useState(false)
  const [csvModal, setCsvModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [csvFile, setCsvFile] = useState(null)
  const [csvPreview, setCsvPreview] = useState([])
  const [csvUploading, setCsvUploading] = useState(false)

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
    } catch (e) { alert('Status update failed: ' + e.message) }
  }

  const handleAddLead = async () => {
    if (!form.name || !form.phone) return alert('Name aur Phone zaroori hai!')
    setSaving(true)
    try {
      await leadsAPI.create(form)
      setForm(emptyForm)
      setAddModal(false)
      fetchLeads()
    } catch (e) { alert('Lead add nahi hua: ' + e.message) }
    finally { setSaving(false) }
  }

  // CSV Parse
  const handleCSVFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCsvFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target.result
      const lines = text.split('\n').filter(l => l.trim())
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'))
      const rows = lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.trim())
        const obj = {}
        headers.forEach((h, i) => { obj[h] = vals[i] || '' })
        return obj
      }).filter(r => r.name && r.phone)
      setCsvPreview(rows.slice(0, 5))
    }
    reader.readAsText(file)
  }

  const handleCSVUpload = async () => {
    if (!csvFile) return
    setCsvUploading(true)
    try {
      const reader = new FileReader()
      reader.onload = async (ev) => {
        const text = ev.target.result
        const lines = text.split('\n').filter(l => l.trim())
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'))
        const rows = lines.slice(1).map(line => {
          const vals = line.split(',').map(v => v.trim())
          const obj = {}
          headers.forEach((h, i) => { obj[h] = vals[i] || null })
          return obj
        }).filter(r => r.name && r.phone)

        let success = 0
        for (const row of rows) {
          try {
            await leadsAPI.create({ ...row, status: row.status || 'New' })
            success++
          } catch {}
        }
        alert(`${success} leads successfully import hue!`)
        setCsvFile(null)
        setCsvPreview([])
        setCsvModal(false)
        fetchLeads()
      }
      reader.readAsText(csvFile)
    } catch (e) { alert('CSV upload failed: ' + e.message) }
    finally { setCsvUploading(false) }
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  const InputField = ({ label, field, type = 'text', required = false }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{label}{required && ' *'}</label>
      <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        className="input-field text-sm" placeholder={label} />
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Leads</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">{total} total leads</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCsvModal(true)}
            className="btn-secondary flex items-center gap-2 text-sm">
            <Upload size={15} />CSV Import
          </button>
          <button onClick={() => setAddModal(true)}
            className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} />Add Lead
          </button>
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

      {error && <div className="glass-card p-4 border border-red-200 text-red-600 text-sm">{error}</div>}

      {/* Table */}
      <div className="glass-card overflow-hidden hidden md:block">
        {loading ? (
          <div className="p-4 space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 sticky top-0">
                <tr>
                  {['Name & Contact', 'Campaign', 'Status', 'Assigned To', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
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
                      </td>
                      <td className="px-4 py-3">
                        <select value={lead.status} onChange={e => handleStatusChange(lead.id, e.target.value)}
                          className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2 py-1 focus:outline-none">
                          {leadStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{lead.assigned_user?.name || '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{lead.created_at?.split('T')[0] || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link to={`/leads/${lead.id}`} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-colors"><Eye size={15} /></Link>
                          <a href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                            className="p-1.5 rounded-lg hover:bg-green-50 text-slate-500 hover:text-green-600 transition-colors"><MessageCircle size={15} /></a>
                          <a href={`tel:${lead.phone}`} className="p-1.5 rounded-lg hover:bg-orange-50 text-slate-500 hover:text-orange-600 transition-colors"><Phone size={15} /></a>
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
                <button onClick={() => setAddModal(true)} className="btn-primary text-sm mt-4 inline-flex items-center gap-2">
                  <Plus size={14} />Pehli Lead Add Karo
                </button>
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
                  <Link to={`/leads/${lead.id}`} className="font-bold text-slate-800 dark:text-slate-100">{lead.name}</Link>
                  <p className="text-sm text-slate-500">{lead.phone}</p>
                </div>
                <StatusBadge status={lead.status} colors={statusColors} />
              </div>
              <div className="flex gap-2">
                <Link to={`/leads/${lead.id}`} className="flex-1 text-center btn-secondary text-xs py-1.5">View</Link>
                <a href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 text-center bg-green-100 text-green-700 font-semibold text-xs py-1.5 rounded-xl">WhatsApp</a>
                <a href={`tel:${lead.phone}`} className="flex-1 text-center bg-orange-100 text-orange-700 font-semibold text-xs py-1.5 rounded-xl">Call</a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between glass-card px-4 py-3">
          <p className="text-sm text-slate-500">{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-40"><ChevronLeft size={16} /></button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded-lg text-sm font-semibold ${n === page ? 'bg-primary-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>{n}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-40"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      <AnimatePresence>
        {addModal && (
          <Modal open={addModal} onClose={() => setAddModal(false)} title="New Lead Add Karo" size="lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Name" field="name" required />
              <InputField label="Phone" field="phone" required />
              <InputField label="Email" field="email" type="email" />
              <InputField label="City" field="city" />
              <InputField label="Campaign Name" field="campaign_name" />
              <InputField label="Ad Name" field="ad_name" />
              <InputField label="Ad Set Name" field="adset_name" />
              <InputField label="Form Name" field="form_name" />
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="input-field text-sm">
                  {leadStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={3} className="input-field text-sm resize-none" placeholder="Koi note likhein..." />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => setAddModal(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleAddLead} disabled={saving} className="btn-primary text-sm flex items-center gap-2">
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                Lead Add Karo
              </button>
            </div>
          </Modal>
        )}

        {/* CSV Import Modal */}
        {csvModal && (
          <Modal open={csvModal} onClose={() => { setCsvModal(false); setCsvFile(null); setCsvPreview([]) }} title="CSV Import" size="lg">
            <div className="space-y-4">
              {/* CSV Format Guide */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">CSV Format (pehli line headers honi chahiye):</p>
                <code className="text-xs text-blue-600 dark:text-blue-300">
                  name,phone,email,city,campaign_name,ad_name,status
                </code>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">CSV File Select Karo</label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('csv-input').click()}>
                  <Upload size={24} className="mx-auto mb-2 text-slate-400" />
                  <p className="text-sm text-slate-500">{csvFile ? csvFile.name : 'CSV file yahan drop karo ya click karo'}</p>
                  <input id="csv-input" type="file" accept=".csv" className="hidden" onChange={handleCSVFile} />
                </div>
              </div>

              {/* Preview */}
              {csvPreview.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Preview (pehle 5 rows):</p>
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                          {Object.keys(csvPreview[0]).slice(0, 5).map(h => (
                            <th key={h} className="px-3 py-2 text-left font-semibold text-slate-500">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreview.map((row, i) => (
                          <tr key={i} className="border-t border-slate-100 dark:border-slate-700">
                            {Object.values(row).slice(0, 5).map((v, j) => (
                              <td key={j} className="px-3 py-2 text-slate-600 dark:text-slate-400 truncate max-w-[100px]">{v || '—'}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => { setCsvModal(false); setCsvFile(null); setCsvPreview([]) }} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleCSVUpload} disabled={!csvFile || csvUploading} className="btn-primary text-sm flex items-center gap-2">
                {csvUploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                Import Karo
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
