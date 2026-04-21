import React, { useEffect } from 'react'
import { useStore } from '../../lib/store'

export function ToastArea() {
  const { state, dispatch } = useStore()
  const { toast } = state

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 3200)
    return () => clearTimeout(t)
  }, [toast?.id])

  if (!toast) return null

  const colors = { ok: 'var(--forest)', err: 'var(--red)', info: 'var(--blue)' }
  const icons  = { ok: '✓', err: '✕', info: 'ℹ' }

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 999 }}>
      <div style={{
        background: '#fff', border: '0.5px solid rgba(0,0,0,.1)',
        borderLeft: `3px solid ${colors[toast.type]}`,
        borderRadius: 10, padding: '11px 16px',
        boxShadow: '0 6px 24px rgba(0,0,0,.1)',
        display: 'flex', alignItems: 'center', gap: 9,
        maxWidth: 300, fontSize: 13, animation: 'scaleIn .2s cubic-bezier(.16,1,.3,1)',
      }}>
        <span style={{ color: colors[toast.type], fontWeight: 600, fontSize: 14 }}>{icons[toast.type]}</span>
        <span style={{ color: 'var(--ink)' }}>{toast.msg}</span>
      </div>
    </div>
  )
}
