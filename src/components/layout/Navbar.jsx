import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, Moon, Sun, ChevronDown, User as UserIcon, LogOut } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Navbar() {
  const { setSidebarOpen, darkMode, setDarkMode, user, logout } = useApp()
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  const notifications = [
    { id: 1, text: 'New lead from Meta Ads', time: '2 min ago', unread: true },
    { id: 2, text: 'Rahul Sharma follow up due', time: '1 hr ago', unread: true },
    { id: 3, text: 'Lead converted by Amit Kumar', time: '3 hrs ago', unread: false },
  ]

  const handleLogout = async () => {
    setUserMenuOpen(false)
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 px-4 lg:px-6 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative hidden sm:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search leads, campaigns..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-0 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Dark mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-12 w-80 glass-card z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200/60 dark:border-slate-700/60">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">Notifications</p>
                </div>
                {notifications.map(n => (
                  <div key={n.id} className={`flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${n.unread ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.unread ? 'bg-primary-500' : 'bg-transparent'}`} />
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{n.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-none">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400 mt-0.5">{user?.role || 'Admin'}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-12 w-56 glass-card z-20 overflow-hidden py-1">
                <button
                  onClick={() => { setUserMenuOpen(false); navigate('/profile') }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <UserIcon size={16} />
                  My Profile
                </button>
                <div className="border-t border-slate-200/60 dark:border-slate-700/60 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
