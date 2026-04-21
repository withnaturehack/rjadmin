import React, { useEffect } from 'react'
import { StoreProvider, useStore } from './lib/store'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { ToastArea } from './components/ui/Toast'
import { Login } from './components/pages/Login'
import { Dashboard, Analytics, Members, Approvals, Referrals } from './components/pages/Pages1'
import { Matches, Juliet, Romeo, Health, Security, Settings } from './components/pages/Pages2'

const PAGES: Record<string, React.FC> = {
  dashboard: Dashboard,
  analytics:  Analytics,
  members:    Members,
  approvals:  Approvals,
  referrals:  Referrals,
  matches:    Matches,
  juliet:     Juliet,
  romeo:      Romeo,
  health:     Health,
  security:   Security,
  settings:   Settings,
}

function Portal() {
  const { state, dispatch } = useStore()
  const { user, page } = state
  const Page = PAGES[page] || Dashboard

  useEffect(() => {
    let active = true

    async function loadBootstrap() {
      try {
        const res = await fetch('/api/bootstrap', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (!active) return

        dispatch({
          type: 'HYDRATE_DATA',
          payload: {
            members: Array.isArray(data.members) ? data.members : [],
            referrals: Array.isArray(data.referrals) ? data.referrals : [],
          },
        })
      } catch {
        // Keep in-memory fallback data when API bootstrap fails.
      }
    }

    void loadBootstrap()
    return () => {
      active = false
    }
  }, [dispatch])

  if (!user) return <Login />

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: 'auto', padding: 24, background: 'var(--cream)' }}>
          <Page key={page} />
        </main>
      </div>
    </div>
  )
}

export function App() {
  return (
    <StoreProvider>
      <Portal />
      <ToastArea />
    </StoreProvider>
  )
}
