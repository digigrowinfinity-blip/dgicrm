import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import LeadDetails from './pages/LeadDetails'
import Team from './pages/Team'
import Settings from './pages/Settings'
import FacebookCallback from './pages/FacebookCallback'
import ProfileSetup from './pages/ProfileSetup'

function PrivateRoute({ children }) {
  const { user } = useApp()
  return user ? children : <Navigate to="/login" replace />
}

function ProfileGate({ children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  if (!user.business_name) return <Navigate to="/setup-profile" replace />
  return children
}

function AppRoutes() {
  const { user } = useApp()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/facebook-callback" element={<FacebookCallback />} />
      <Route path="/setup-profile" element={<PrivateRoute><ProfileSetup /></PrivateRoute>} />
      <Route path="/" element={<PrivateRoute><ProfileGate><Layout /></ProfileGate></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="leads/:id" element={<LeadDetails />} />
        <Route path="team" element={<Team />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
