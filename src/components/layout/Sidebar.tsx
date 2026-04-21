import React from 'react'
import { useStore, Page } from '../../lib/store'

const NAV_GROUPS = [
  { label: 'Overview', items: [
    { id: 'dashboard',  icon: '◈', label: 'Dashboard' },
    { id: 'analytics',  icon: '◉', label: 'Analytics' },
  ]},
  { label: 'Members', items: [
    { id: 'members',    icon: '◎', label: 'All Members',  badge: '2.4k' },
    { id: 'approvals',  icon: '◐', label: 'Approvals',    badge: '12', alert: true },
    { id: 'referrals',  icon: '◇', label: 'Referrals' },
  ]},
  { label: 'Matching', items: [
    { id: 'matches',    icon: '♡', label: 'Matches' },
    { id: 'juliet',     icon: '◌', label: 'Juliet Chats' },
    { id: 'romeo',      icon: '◆', label: 'Romeo Engine' },
  ]},
  { label: 'System', items: [
    { id: 'health',     icon: '◉', label: 'Health' },
    { id: 'security',   icon: '🛡', label: 'Security' },
    { id: 'settings',   icon: '⚙', label: 'Settings' },
  ]},
] as const

export function Sidebar() {
  const { state, dispatch } = useStore()
  const { page, sidebarCollapsed: c, user } = state

  function navTo(id: string) {
    if (id === 'security' && user?.role !== 'SUPER_ADMIN') {
      dispatch({ type: 'TOAST', payload: { msg: 'Super Admin access required', type: 'err' } })
      return
    }
    dispatch({ type: 'NAV', payload: id as Page })
  }

  return (
    <aside style={{
      width: c ? 56 : 220, flexShrink: 0, background: '#fff',
      borderRight: '0.5px solid var(--border)',
      display: 'flex', flexDirection: 'column', height: '100%',
      overflow: 'hidden', transition: 'width .25s cubic-bezier(.16,1,.3,1)',
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px 14px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 64, flexShrink: 0 }}>
        {!c && (
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              Romeo & Juliet
            </div>
            <div style={{ fontSize: 10, color: 'rgba(107,100,87,.4)', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 2 }}>
              Admin Portal
            </div>
          </div>
        )}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          style={{ padding: 6, border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(107,100,87,.5)', borderRadius: 7, display: 'flex', flexShrink: 0, marginLeft: c ? 'auto' : 0, marginRight: c ? 'auto' : 0, transition: 'background .12s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,.05)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: c ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }}>
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px' }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label} style={{ marginBottom: 12 }}>
            {!c && (
              <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(107,100,87,.38)', fontWeight: 500, padding: '0 10px 5px', whiteSpace: 'nowrap' }}>
                {group.label}
              </div>
            )}
            {group.items.map(item => {
              const active = page === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => navTo(item.id)}
                  title={c ? item.label : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: c ? 0 : 9,
                    justifyContent: c ? 'center' : 'flex-start',
                    padding: c ? '8px 0' : '7px 10px',
                    width: '100%', borderRadius: 8, border: 'none',
                    cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                    marginBottom: 2, position: 'relative', overflow: 'hidden',
                    background: active ? 'rgba(58,92,48,.08)' : 'none',
                    color: active ? 'var(--forest)' : 'var(--warm)',
                    fontWeight: active ? 500 : 400,
                    transition: 'background .12s, color .12s',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(0,0,0,.04)'; e.currentTarget.style.color = 'var(--ink)' } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--warm)' } }}
                >
                  {active && !c && (
                    <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, borderRadius: '0 2px 2px 0', background: 'var(--forest)' }} />
                  )}
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                  {!c && (
                    <>
                      <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap' }}>{item.label}</span>
                      {(item as any).badge && (
                        <span style={{
                          fontSize: 10, fontWeight: 500, padding: '1px 6px', borderRadius: 10,
                          background: (item as any).alert && !active ? 'rgba(220,38,38,.08)' : active ? 'rgba(58,92,48,.15)' : 'rgba(0,0,0,.06)',
                          color: (item as any).alert && !active ? '#b91c1c' : active ? 'var(--forest)' : 'var(--warm)',
                        }}>
                          {(item as any).badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '8px 8px 12px', borderTop: '0.5px solid var(--border)', flexShrink: 0 }}>
        <button
          onClick={() => dispatch({ type: 'LOGOUT' })}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: c ? '8px 0' : '7px 10px',
            justifyContent: c ? 'center' : 'flex-start',
            width: '100%', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: 13, fontFamily: 'inherit', color: 'rgba(107,100,87,.6)',
            background: 'none', transition: 'background .12s, color .12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,.06)'; e.currentTarget.style.color = '#b91c1c' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(107,100,87,.6)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!c && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  )
}
