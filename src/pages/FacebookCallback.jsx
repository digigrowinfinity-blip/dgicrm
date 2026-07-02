import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function FacebookCallback() {
  const { login, refreshUser } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  useEffect(() => {
    const run = async () => {
      const token = params.get('token')
      const name = params.get('name')
      const role = params.get('role')
      const id = params.get('id')
      const email = params.get('email')

      if (token) {
        login({ id, name, role, email, token })
        // Fetch full profile (business_name, trial info) before routing
        await refreshUser()
        navigate('/')
      } else {
        navigate('/login?error=facebook_failed')
      }
    }
    run()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-slate-950">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400">Signing you in with Facebook...</p>
      </div>
    </div>
  )
}
