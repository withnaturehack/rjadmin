import React, { useState } from 'react'
import { useStore } from '../../lib/store'
import { initials, fmtDate } from '../../lib/utils'
import { avColor } from '../../lib/utils'

const PAGE_TITLES: Record<string, string> = {
  dashboard:'Dashboard', analytics:'Analytics', members:'All Members',
  approvals:'Approvals', referrals:'Referrals', matches:'Matches',
  juliet:'Juliet Chats', romeo:'Romeo Engine', health:'System Health',
  security:'Security', settings:'Settings',
}

const NOTIFICATIONS = [
  { text: '12 profiles pending approval', page: 'approvals', time: '2m ago', unread: true },
  { text: 'Match #1042 expiring in 4h',   page: 'matches',   time: '1h ago', unread: true },
  { text: 'Juliet completion rate hit 82%',page: 'analytics', time: '3h ago', unread: false },
]

export function Topbar() {
  const { state, dispatch } = useStore()
  const [open, setOpen] = useState(false)
  const { user, page } = state
  const { bg, fg } = avColor(user?.name || 'Admin')

  return (
    <header style={{ height: 56, flexShrink: 0, background: '#fff', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'relative', zIndex: 20 }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-.01em' }}>
        {PAGE_TITLES[page] || page}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 11, color: 'rgba(107,100,87,.45)', marginRight: 4 }}>{fmtDate(new Date())}</div>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--forest)', animation: 'livePulse 2.2s infinite' }} />

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setOpen(v => !v)}
            style={{ padding: 7, border: 'none', background: 'none', cursor: 'pointer', borderRadius: 8, color: 'rgba(107,100,87,.6)', display: 'flex', alignItems: 'center', position: 'relative', transition: 'background .12s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: 'var(--forest)' }} />
          </button>

          {open && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setOpen(false)} />
              <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 280, background: '#fff', border: '0.5px solid var(--border)', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,.1)', zIndex: 100, animation: 'scaleIn .15s cubic-bezier(.16,1,.3,1)' }}>
                <div style={{ padding: '10px 14px', borderBottom: '0.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>Notifications</span>
                  <span style={{ fontSize: 10, color: 'var(--forest)', fontWeight: 500 }}>2 new</span>
                </div>
                {NOTIFICATIONS.map((n, i) => (
                  <div key={i} onClick={() => { dispatch({ type: 'NAV', payload: n.page as any }); setOpen(false) }}
                    style={{ padding: '10px 14px', borderBottom: i < NOTIFICATIONS.length - 1 ? '0.5px solid var(--border)' : 'none', cursor: 'pointer', background: n.unread ? 'rgba(58,92,48,.02)' : 'none', display: 'flex', gap: 8 }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = n.unread ? 'rgba(58,92,48,.02)' : 'none')}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.unread ? 'var(--forest)' : 'transparent', marginTop: 4, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 1.4 }}>{n.text}</div>
                      <div style={{ fontSize: 10, color: 'rgba(107,100,87,.5)', marginTop: 2 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, paddingLeft: 8, borderLeft: '0.5px solid var(--border)' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500 }}>
            {initials(user?.name || 'Admin')}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.1 }}>{user?.name}</div>
            <div style={{ fontSize: 10, color: 'rgba(107,100,87,.5)', marginTop: 1 }}>{user?.role.toLowerCase().replace('_', ' ')}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
