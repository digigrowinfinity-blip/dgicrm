import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Phone, MessageCircle, User, MapPin, Mail, Calendar,
  Megaphone, FileText, Clock, Plus, Check, Edit3, AlarmClock
} from 'lucide-react'
import { Modal, StatusBadge } from '../components/ui'
import { leads, leadStatuses, statusColors, teamMembers } from '../data'

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
  const lead = leads.find(l => l.id === Number(id))
  const [currentStatus, setCurrentStatus] = useState(lead?.status)
  const [notes, setNotes] = useState(lead?.notes || [])
  const [noteText, setNoteText] = useState('')
  const [noteModal, setNoteModal] = useState(false)
  const [assignModal, setAssignModal] = useState(false)
  const [statusModal, setStatusModal] = useState(false)
  const [followUpModal, setFollowUpModal] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState(lead?.assignedTo || '')
  const [assignedTo, setAssignedTo] = useState(lead?.assignedTo || '')
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpTime, setFollowUpTime] = useState('')
  const [followUpNote, setFollowUpNote] = useState('')
  const [currentFollowUp, setCurrentFollowUp] = useState(lead?.followUp)

  if (!lead) return (
    <div className="text-center py-24">
      <p className="text-slate-500 dark:text-slate-400 text-lg">Lead not found</p>
      <Link to="/leads" className="btn-primary mt-4 inline-flex items-center gap-2"><ArrowLeft size={15} /> Back to Leads</Link>
    </div>
  )

  const handleAddNote = () => {
    if (!noteText.trim()) return
    const newNote = { id: Date.now(), text: noteText, author: 'Admin User', date: new Date().toLocaleString() }
    setNotes(n => [newNote, ...n])
    setNoteText('')
    setNoteModal(false)
  }

  const handleAssign = () => { setAssignedTo(selectedAgent); setAssignModal(false) }
  const handleFollowUp = () => { setCurrentFollowUp({ date: followUpDate, time: followUpTime, note: followUpNote }); setFollowUpModal(false) }

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link to="/leads" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{lead.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-sm">Lead #{lead.id} · {lead.createdAt}</p>
        </div>
        <StatusBadge status={currentStatus} colors={statusColors} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setAssignModal(true)} className="btn-secondary text-sm flex items-center gap-2"><User size={14} />Assign</button>
        <button onClick={() => setStatusModal(true)} className="btn-secondary text-sm flex items-center gap-2"><Edit3 size={14} />Change Status</button>
        <button onClick={() => setNoteModal(true)} className="btn-secondary text-sm flex items-center gap-2"><Plus size={14} />Add Note</button>
        <button onClick={() => setFollowUpModal(true)} className="btn-secondary text-sm flex items-center gap-2"><AlarmClock size={14} />Follow Up</button>
        <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-green-500/25 hover:-translate-y-0.5">
          <MessageCircle size={14} />WhatsApp
        </a>
        <a href={`tel:${lead.phone}`}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-orange-500/25 hover:-translate-y-0.5">
          <Phone size={14} />Call
        </a>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Section A - Lead Info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={16} className="text-primary-600" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Lead Information</h2>
            </div>
            <InfoRow label="Name" value={lead.name} />
            <InfoRow label="Phone" value={lead.phone} />
            <InfoRow label="Email" value={lead.email} />
            <InfoRow label="City" value={lead.city} />
            <InfoRow label="Assigned To" value={assignedTo} />
            <InfoRow label="Status" value={currentStatus} />
          </motion.div>

          {/* Section B - Meta Info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Megaphone size={16} className="text-primary-600" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Meta Information</h2>
            </div>
            <InfoRow label="Campaign" value={lead.campaign} />
            <InfoRow label="Ad Name" value={lead.ad} />
            <InfoRow label="Ad Set" value={lead.adSet} />
            <InfoRow label="Form Name" value={lead.form} />
            <InfoRow label="Lead Date" value={lead.createdAt} />
          </motion.div>

          {/* Section C - Dynamic Meta Form */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-primary-600" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Form Responses</h2>
              <span className="ml-auto text-xs text-slate-400">{lead.metaAnswers.length} answers</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {lead.metaAnswers.map((qa, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 + 0.15 }}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{qa.q}</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{qa.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Section D - Notes Timeline */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Edit3 size={16} className="text-primary-600" />
                <h2 className="font-bold text-slate-800 dark:text-slate-100">Notes</h2>
              </div>
              <button onClick={() => setNoteModal(true)} className="text-xs btn-primary py-1.5 px-3 flex items-center gap-1">
                <Plus size={12} />Add
              </button>
            </div>
            {notes.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No notes yet. Add your first note!</p>
            ) : (
              <div className="space-y-3">
                {notes.map((note, i) => (
                  <motion.div key={note.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 text-xs font-bold shrink-0">
                      {note.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{note.author}</span>
                        <span className="text-xs text-slate-400">{note.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{note.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Section E - Activity */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-primary-600" />
              <h2 className="font-bold text-slate-800 dark:text-slate-100">Activity</h2>
            </div>
            {lead.activities.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">No activity yet</p>
            ) : (
              <div className="relative space-y-4">
                <div className="absolute left-3.5 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
                {lead.activities.map((act, i) => (
                  <div key={act.id} className="relative flex gap-4 pl-8">
                    <div className="absolute left-0 w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                      <Check size={12} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{act.type}</p>
                      <p className="text-xs text-slate-400">{act.desc}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{act.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Section F - Follow Up */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlarmClock size={16} className="text-primary-600" />
                <h2 className="font-bold text-slate-800 dark:text-slate-100">Follow Up</h2>
              </div>
              <button onClick={() => setFollowUpModal(true)} className="text-xs btn-primary py-1.5 px-3">Schedule</button>
            </div>
            {currentFollowUp ? (
              <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">{currentFollowUp.date} at {currentFollowUp.time}</span>
                </div>
                {currentFollowUp.note && <p className="text-xs text-yellow-600 dark:text-yellow-500">{currentFollowUp.note}</p>}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">No follow-up scheduled</p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {noteModal && (
          <Modal open={noteModal} onClose={() => setNoteModal(false)} title="Add Note">
            <textarea
              value={noteText} onChange={e => setNoteText(e.target.value)}
              placeholder="Write your note here..."
              rows={4}
              className="input-field resize-none mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setNoteModal(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleAddNote} className="btn-primary text-sm">Save Note</button>
            </div>
          </Modal>
        )}
        {assignModal && (
          <Modal open={assignModal} onClose={() => setAssignModal(false)} title="Assign Lead">
            <div className="space-y-2 mb-4">
              {teamMembers.map(m => (
                <button key={m.id} onClick={() => setSelectedAgent(m.name)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedAgent === m.name ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">{m.avatar}</div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.role}</p>
                  </div>
                  {selectedAgent === m.name && <Check size={16} className="ml-auto text-primary-600" />}
                </button>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setAssignModal(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleAssign} className="btn-primary text-sm">Assign</button>
            </div>
          </Modal>
        )}
        {statusModal && (
          <Modal open={statusModal} onClose={() => setStatusModal(false)} title="Change Status">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {leadStatuses.map(s => (
                <button key={s} onClick={() => { setCurrentStatus(s); setStatusModal(false) }}
                  className={`p-3 rounded-xl border text-sm font-semibold transition-all ${currentStatus === s ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                  {s}
                </button>
              ))}
            </div>
          </Modal>
        )}
        {followUpModal && (
          <Modal open={followUpModal} onClose={() => setFollowUpModal(false)} title="Schedule Follow Up">
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
                <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Time</label>
                <input type="time" value={followUpTime} onChange={e => setFollowUpTime(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Note</label>
                <input type="text" value={followUpNote} onChange={e => setFollowUpNote(e.target.value)} placeholder="Follow-up note..." className="input-field" />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setFollowUpModal(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleFollowUp} className="btn-primary text-sm">Schedule</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
