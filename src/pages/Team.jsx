import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, Mail, Phone, Edit2, Trash2, Loader, TrendingUp, Users } from 'lucide-react'
import { Modal, Skeleton } from '../components/ui'
import { teamAPI } from '../services/api'

function MemberCard({ member, onEdit, index }) {
  const convRate = member.total > 0 ? ((member.converted / member.total) * 100).toFixed(1) : '0.0'
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }} whileHover={{ y: -4 }} className="glass-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-primary-500/25">
            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">{member.name}</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">{member.designation || 'Agent'}</span>
          </div>
        </div>
        <button onClick={() => onEdit(member)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors">
          <Edit2 size={15} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Assigned', value: member.assigned_leads || 0, color: 'text-slate-800 dark:text-slate-100' },
          { label: 'Follow Ups', value: member.follow_ups || 0, color: 'text-yellow-600' },
          { label: 'Converted', value: member.converted || 0, color: 'text-green-600' },
          { label: 'Conv. Rate', value: `${convRate}%`, color: 'text-primary-600' },
        ].map(stat => (
          <div key={stat.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">Conversion Performance</span>
          <span className="font-semibold text-slate-600 dark:text-slate-400">{convRate}%</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${convRate}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-green-500" />
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <a href={`mailto:${member.email}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors">
          <Mail size={13} />Email
        </a>
        {member.phone && (
          <a href={`tel:${member.phone}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors">
            <Phone size={13} />Call
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default function Team() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', designation: '', status: 'Active' })

  const loadTeam = async () => {
    setLoading(true)
    try {
      const res = await teamAPI.getAll({ limit: 50 })
      setMembers(res.members || [])
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadTeam() }, [])

  const handleAdd = async () => {
    if (!form.name || !form.email) return
    setSaving(true)
    try {
      await teamAPI.create(form)
      await loadTeam()
      setForm({ name: '', email: '', phone: '', designation: '', status: 'Active' })
      setAddModal(false)
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const handleEdit = (member) => {
    setSelectedMember(member)
    setForm({ name: member.name, email: member.email, phone: member.phone || '', designation: member.designation || '', status: member.status })
    setEditModal(true)
  }

  const handleSaveEdit = async () => {
    setSaving(true)
    try {
      await teamAPI.update(selectedMember.id, form)
      await loadTeam()
      setEditModal(false)
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Is member ko delete karna chahte ho?')) return
    try {
      await teamAPI.delete(id)
      await loadTeam()
      setEditModal(false)
    } catch (e) { alert(e.message) }
  }

  const MemberForm = () => (
    <div className="space-y-4">
      {[['name','Full Name','John Doe'],['email','Email','john@company.com'],['phone','Phone','+91 99999 88888'],['designation','Designation','Sales Agent']].map(([key, label, ph]) => (
        <div key={key}>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
          <input type={key === 'email' ? 'email' : 'text'} className="input-field" placeholder={ph}
            value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
        </div>
      ))}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
        <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="input-field">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  )

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-48" />
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-64" />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Team</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">{members.length} team members</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => { setForm({ name: '', email: '', phone: '', designation: '', status: 'Active' }); setAddModal(true) }}
          className="btn-primary flex items-center gap-2 text-sm">
          <UserPlus size={15} />Add Member
        </motion.button>
      </div>

      {error && <div className="glass-card p-4 border border-red-200 text-red-600 text-sm">{error}</div>}

      {members.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Users size={40} className="mx-auto mb-3 text-slate-300" />
          <p className="text-slate-400">Koi team member nahi hai. Pehla member add karo!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {members.map((m, i) => <MemberCard key={m.id} member={m} onEdit={handleEdit} index={i} />)}
        </div>
      )}

      <AnimatePresence>
        {addModal && (
          <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Team Member">
            <MemberForm />
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => setAddModal(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleAdd} disabled={saving} className="btn-primary text-sm flex items-center gap-2">
                {saving && <Loader size={14} className="animate-spin" />}Add Member
              </button>
            </div>
          </Modal>
        )}
        {editModal && (
          <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Team Member">
            <MemberForm />
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => handleDelete(selectedMember?.id)} className="btn-secondary text-sm text-red-500 flex items-center gap-1">
                <Trash2 size={13} />Remove
              </button>
              <button onClick={() => setEditModal(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleSaveEdit} disabled={saving} className="btn-primary text-sm flex items-center gap-2">
                {saving && <Loader size={14} className="animate-spin" />}Save Changes
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
