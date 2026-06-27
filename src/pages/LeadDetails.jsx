import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Phone, MessageCircle, User, Edit3, AlarmClock, Plus, Check, Loader } from 'lucide-react'
import { Modal, StatusBadge, Skeleton } from '../components/ui'
import { leadsAPI } from '../services/api'
import { leadStatuses, statusColors } from '../data'

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider sm:w-36 shrink-0">{label}</span>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{value || '—'}</span>
    </div>
  )
}

export default function LeadDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [statusModal, setStatusModal] = useState(false)
  const [noteModal, setNoteModal] = useState(false)
  const [followUpModal, setFollowUpModal] = useState(false)

  const [noteText, setNoteText] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await leadsAPI.getById(id)
        setLead(res.lead)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleStatusChange = async (newStatus) => {
    setSaving(true)
    try {
      const res = await leadsAPI.updateStatus(id, newStatus)
      setLead(res.lead)
      setStatusModal(false)
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const handleSaveNote = async () => {
    if (!noteText.trim()) return
    setSaving(true)
    try {
      const existingNotes = lead.notes ? lead.notes + '\n\n---\n' : ''
      const newNote = `[${new Date().toLocaleString()}] ${noteText}`
      const res = await leadsAPI.update(id, { notes: existingNotes + newNote })
      setLead(res.lead)
      setNoteText('')
      setNoteModal(false)
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const handleFollowUp = async () => {
    if (!followUpDate) return
    setSaving(true)
    try {
      const res = await leadsAPI.update(id, { followup_date: followUpDate })
      setLead(res.lead)
      setFollowUpModal(false)
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div className="space-y-4 max-w-4xl">
      <Skeleton className="h-12 w-64" />
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48" />)}</div>
        <Skeleton className="h-64" />
      </div>
    </div>
  )

  if (error || !lead) return (
    <div className="glass-card p-8 text-center max-w-lg mx-auto">
      <p className="text-red-500 font-semibold mb-3">{error || 'Lead nahi mila'}</p>
      <Link to="/leads" className="btn-primary inline-flex items-center gap-2 text-sm"><ArrowLeft size={14} />Wapas Leads pe</Link>
    </div>
  )

  const noteLines = lead.notes ? lead.notes.split('\n\n---\n') : []

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link to="/leads" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{lead.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-sm">Lead #{lead.id} · {lead.created_at?.split('T')[0]}</p>
        </div>
        <StatusBadge status={lead.status} colors={statusColors} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setStatusModal(true)} className="btn-secondary text-sm flex items-center gap-2"><Edit3 size={14} />Change Status</button>
        <button onClick={() => setNoteModal(true)} className="btn-secondary text-sm flex items-center gap-2"><Plus size={14} />Add Note</button>
        <button onClick={() => setFollowUpModal(true)} className="btn-secondary text-sm flex items-center gap-2"><AlarmClock size={14} />Follow Up</button>
        <a href={`https://wa.me/${lead.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md hover:-translate-y-0.5">
          <MessageCircle size={14} />WhatsApp
        </a>
        <a href={`tel:${lead.phone}`}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md hover:-translate-y-0.5">
          <Phone size={14} />Call
        </a>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Lead Info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={16} className="text-primary-600" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Lead Information</h2>
            </div>
            <InfoRow label="Name" value={lead.name} />
            <InfoRow label="Phone" value={lead.phone} />
            <InfoRow label="Email" value={lead.email} />
            <InfoRow label="City" value={lead.city} />
            <InfoRow label="Assigned To" value={lead.assigned_user?.name} />
            <InfoRow label="Status" value={lead.status} />
          </motion.div>

          {/* Meta Info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Edit3 size={16} className="text-primary-600" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Meta Information</h2>
            </div>
            <InfoRow label="Campaign" value={lead.campaign_name} />
            <InfoRow label="Ad Name" value={lead.ad_name} />
            <InfoRow label="Ad Set" value={lead.adset_name} />
            <InfoRow label="Form Name" value={lead.form_name} />
            <InfoRow label="Lead Date" value={lead.created_at?.split('T')[0]} />
          </motion.div>

          {/* Notes */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Edit3 size={16} className="text-primary-600" />
                <h2 className="font-bold text-slate-800 dark:text-slate-100">Notes</h2>
              </div>
              <button onClick={() => setNoteModal(true)} className="text-xs btn-primary py-1.5 px-3 flex items-center gap-1"><Plus size={12} />Add</button>
            </div>
            {noteLines.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">Koi notes nahi hain. Pehla note add karo!</p>
            ) : (
              <div className="space-y-3">
                {noteLines.map((note, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{note}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlarmClock size={16} className="text-primary-600" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Follow Up</h2>
            </div>
            {lead.followup_date ? (
              <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">{lead.followup_date}</p>
                <p className="text-xs text-yellow-600 mt-0.5">Scheduled follow-up</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">Koi follow-up schedule nahi hai</p>
            )}
            <button onClick={() => setFollowUpModal(true)} className="w-full btn-secondary text-sm mt-3">Schedule</button>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {statusModal && (
          <Modal open={statusModal} onClose={() => setStatusModal(false)} title="Change Status">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {leadStatuses.map(s => (
                <button key={s} onClick={() => handleStatusChange(s)}
                  className={`p-3 rounded-xl border text-sm font-semibold transition-all ${lead.status === s ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  {saving ? <Loader size={14} className="animate-spin mx-auto" /> : s}
                </button>
              ))}
            </div>
          </Modal>
        )}
        {noteModal && (
          <Modal open={noteModal} onClose={() => setNoteModal(false)} title="Add Note">
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
              placeholder="Note likhein yahan..." rows={4} className="input-field resize-none mb-4" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setNoteModal(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleSaveNote} disabled={saving} className="btn-primary text-sm flex items-center gap-2">
                {saving ? <Loader size={14} className="animate-spin" /> : null} Save Note
              </button>
            </div>
          </Modal>
        )}
        {followUpModal && (
          <Modal open={followUpModal} onClose={() => setFollowUpModal(false)} title="Schedule Follow Up">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Follow-up Date</label>
              <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="input-field" />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setFollowUpModal(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleFollowUp} disabled={saving} className="btn-primary text-sm flex items-center gap-2">
                {saving ? <Loader size={14} className="animate-spin" /> : null} Schedule
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
