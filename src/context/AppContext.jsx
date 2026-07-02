import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mlcrm_user')) } catch { return null }
  })
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('mlcrm_dark') === 'true')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('mlcrm_dark', darkMode)
  }, [darkMode])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('mlcrm_user', JSON.stringify(userData))
  }

  // Merge new fields (e.g. business_name, trial info) into existing user
  const updateUser = (partialData) => {
    setUser(prev => {
      const merged = { ...prev, ...partialData }
      localStorage.setItem('mlcrm_user', JSON.stringify(merged))
      return merged
    })
  }

  // Pull fresh profile from backend (business_name, trial status, etc.) and merge
  const refreshUser = async () => {
    try {
      const res = await authAPI.profile()
      if (res?.user) {
        updateUser(res.user)
      }
      return res?.user
    } catch {
      return null
    }
  }

  const logout = async () => {
    try { await authAPI.logout() } catch {}
    setUser(null)
    localStorage.removeItem('mlcrm_user')
  }

  return (
    <AppContext.Provider value={{ user, login, logout, updateUser, refreshUser, darkMode, setDarkMode, sidebarOpen, setSidebarOpen }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
