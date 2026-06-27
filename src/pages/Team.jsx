import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, Mail, Phone, Edit2, Trash2, TrendingUp, Users } from 'lucide-react'
import { Modal } from '../components/ui'
import { teamMembers as initialTeam } from '../data'

const roles = ['Admin', 'Manager', 'Agent']

function MemberCard({ member, onEdit, index }) {
  const convRate = ((member.converted / member.assignedLeads) * 100).toFixed(1)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-primary-500/25">
            {member.avatar}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">{member.name}</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">{member.role}</span>
          </div>
        </div>
        <button onClick={() => onEdit(member)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors">
          <Edit2 size={15} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Assigned', value: member.assignedLeads, color: 'text-slate-800 dark:text-slate-100' },
          { label: 'Follow Ups', value: member.followUps, color: 'text-yellow-600' },
          { label: 'Converted', value: member.converted, color: 'text-green-600' },
          { label: 'Conv. Rate', value: `${convRate}%`, color: 'text-primary-600' },
        ].map(stat => (
          <div key={stat.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Performance bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">Conversion Performance</span>
          <span className="font-semibold text-slate-600 dark:text-slate-400">{convRate}%</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${convRate}%` }}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-green-500"
          />
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <a href={`mailto:${member.email}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors">
          <Mail size={13} />Email
        </a>
        <a href={`tel:${member.phone}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium transition-colors">
          <Phone size={13} />Call
        </a>
      </div>
    </motion.div>
  )
}

export default function Team() {
  const [members, setMembers] = useState(initialTeam)
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'Agent' })

  const totalLeads = members.reduce((a, m) => a + m.assignedLeads, 0)
  const totalConverted = members.reduce((a, m) => a + m.converted, 0)
  const totalFollowUps = members.reduce((a, m) => a + m.followUps, 0)

  const handleAdd = () => {
    if (!form.name || !form.email) return
    const avatar = form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    setMembers(m => [...m, { id: Date.now(), ...form, avatar, assignedLeads: 0, followUps: 0, converted: 0, joinedAt: new Date().toISOString().split('T')[0] }])
    setForm({ name: '', email: '', phone: '', role: 'Agent' })
    setAddModal(false)
  }

  const handleEdit = (member) => {
    setSelectedMember(member)
    setForm({ name: member.name, email: member.email, phone: member.phone, role: member.role })
    setEditModal(true)
  }

  const handleSaveEdit = () => {
    setMembers(m => m.map(mb => mb.id === selectedMember.id ? { ...mb, ...form, avatar: form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() } : mb))
    setEditModal(false)
  }

  const handleRemove = (id) => setMembers(m => m.filter(mb => mb.id !== id))

  const MemberForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
        <input className="input-field" placeholder="John Doe" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
        <input type="email" className="input-field" placeholder="john@company.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
        <input className="input-field" placeholder="+91 98765 00000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
        <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="input-field">
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Team</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5">{members.length} team members</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => { setForm({ name: '', email: '', phone: '', role: 'Agent' }); setAddModal(true) }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <UserPlus size={15} />Add Member
        </motion.button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Assigned Leads', value: totalLeads, icon: Users, color: 'bg-primary-600' },
          { label: 'Total Follow Ups', value: totalFollowUps, icon: TrendingUp, color: 'bg-yellow-500' },
          { label: 'Total Converted', value: totalConverted, icon: TrendingUp, color: 'bg-green-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {members.map((member, i) => (
          <MemberCard key={member.id} member={member} onEdit={handleEdit} index={i} />
        ))}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {addModal && (
          <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Team Member">
            <MemberForm />
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => setAddModal(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleAdd} className="btn-primary text-sm">Add Member</button>
            </div>
          </Modal>
        )}
        {editModal && (
          <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Team Member">
            <MemberForm />
            <div className="flex gap-2 justify-end mt-6">
              <button onClick={() => { setEditModal(false); handleRemove(selectedMember?.id) }}
                className="btn-secondary text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                <Trash2 size={13} />Remove
              </button>
              <button onClick={() => setEditModal(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleSaveEdit} className="btn-primary text-sm">Save Changes</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
