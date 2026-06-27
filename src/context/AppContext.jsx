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

  const logout = async () => {
    try { await authAPI.logout() } catch {}
    setUser(null)
    localStorage.removeItem('mlcrm_user')
  }

  return (
    <AppContext.Provider value={{ user, login, logout, darkMode, setDarkMode, sidebarOpen, setSidebarOpen }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
