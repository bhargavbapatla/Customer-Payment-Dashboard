import './App.css'
import DataTable from './components/table/page'
import { Toaster } from "@/components/ui/sonner"
import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'

function App() {
  const [showDashboard, setShowDashboard] = useState(() => {
    return window.location.hash === '#dashboard'
  })

  useEffect(() => {
    const handlePopState = () => {
      const isDashboard = window.location.hash === '#dashboard'
      setShowDashboard(isDashboard)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (showDashboard) {
      if (window.location.hash !== '#dashboard') {
        window.history.pushState({ view: 'dashboard' }, '', '#dashboard')
      }
    } else {
      if (window.location.hash === '#dashboard') {
        window.history.pushState(null, '', window.location.pathname)
      }
    }
  }, [showDashboard])

  return (
    <>
      {showDashboard ? (
        <div className="card space-y-4 animate-in fade-in duration-500">
          <DataTable />
        </div>
      ) : (
        <LandingPage onEnter={() => setShowDashboard(true)} />
      )}
      <Toaster position="top-right" />
    </>
  )
}

export default App
