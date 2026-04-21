import React, { useState, useEffect } from 'react'
import { useStore } from '../../lib/store'

export function Login() {
  const { dispatch } = useStore()
  const [email, setEmail]     = useState('')
  const [pw, setPw]           = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t) }, [])

  const locked = attempts >= 5

  function fill(role: 'admin' | 'mod') {
    setEmail(role === 'admin' ? 'admin@romeoandjuliet.app' : 'mod@romeoandjuliet.app')
    setPw('admin123')
  }

  async function login(e: React.FormEvent) {
    e.preventDefault()
    if (locked || loading) return
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pw }),
      })

      if (res.ok) {
        const data = await res.json()
        const user = data.user

        dispatch({ type: 'LOGIN', payload: user })
        dispatch({ type: 'TOAST', payload: { msg: `Welcome back, ${user.name}`, type: 'ok' } })
        return
      }

      const nextAttempts = attempts + 1
      setAttempts(nextAttempts)

      dispatch({
        type: 'TOAST',
        payload: {
          msg: nextAttempts >= 5 ? 'Account locked' : 'Invalid credentials',
          type: 'err',
        },
      })
    } catch {
      dispatch({
        type: 'TOAST',
        payload: { msg: 'Unable to reach auth service. Try again.', type: 'err' },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--cream)' }}>
      <div style={{ width: 380, flexShrink: 0, background: 'var(--forest)', padding: '44px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: '#fff', fontWeight: 300, fontStyle: 'italic' }}>Romeo & Juliet</div>
          <div style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)', marginTop: 4 }}>Admin Portal</div>
        </div>
        <div>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", color: 'rgba(255,255,255,.7)', fontSize: 15, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 28 }}>
            "What's in a name? That which we call a match by any other algorithm would be just as meaningful."
          </p>
          {[['🔒','JWT session management'],['🔐','Role-based access control'],['📋','Full audit logging'],['🛡','Rate limiting on all routes']].map(([icon,text]) => (
            <div key={String(text)} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 11, color: 'rgba(255,255,255,.45)', marginBottom: 7 }}>
              <span>{icon}</span><span>{text}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.2)' }}>v1.0 · April 2026 · Confidential</div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 340, opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(10px)', transition: 'opacity .4s, transform .4s' }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Sign in</h1>
          <p style={{ fontSize: 12, color: 'rgba(107,100,87,.6)', marginBottom: 24 }}>Access the admin portal</p>

          <form onSubmit={login}>
            <div style={{ marginBottom: 14 }}>
              <label htmlFor="login-email" style={{ display: 'block', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(107,100,87,.6)', fontWeight: 500, marginBottom: 5 }}>Email</label>
              <input id="login-email" className="inp" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@romeoandjuliet.app" required disabled={locked} autoComplete="email" />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label htmlFor="login-password" style={{ display: 'block', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(107,100,87,.6)', fontWeight: 500, marginBottom: 5 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input id="login-password" className="inp" type={showPw ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" required disabled={locked} style={{ paddingRight: 36 }} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(107,100,87,.4)', fontSize: 13 }}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {locked && (
              <div style={{ fontSize: 11, color: 'var(--red)', background: 'rgba(163,45,45,.07)', border: '0.5px solid rgba(163,45,45,.15)', borderRadius: 8, padding: '8px 10px', marginBottom: 10 }}>
                🔒 Account locked. Please try again later.
              </div>
            )}
            {attempts > 0 && !locked && (
              <div style={{ fontSize: 11, color: 'var(--amber)', marginBottom: 10 }}>
                ⚠ {5 - attempts} attempt{5 - attempts === 1 ? '' : 's'} remaining
              </div>
            )}

            <button type="submit" disabled={loading || locked} className="btn btn-p" style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: 13 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                  <span className="spin-ring" />Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <div style={{ marginTop: 20, border: '0.5px dashed var(--pebble)', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(107,100,87,.4)', fontWeight: 500, marginBottom: 8 }}>Demo credentials — click to fill</div>
            {([['admin','Super Admin','admin@romeoandjuliet.app'],['mod','Moderator','mod@romeoandjuliet.app']] as const).map(([role,label,em]) => (
              <button key={role} onClick={() => fill(role)} className="demo-btn">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>{label}</div>
                    <div style={{ fontSize: 10, color: 'rgba(107,100,87,.5)', fontFamily: 'monospace' }}>{em}</div>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--forest)', fontWeight: 500 }}>Fill →</span>
                </div>
              </button>
            ))}
            <div style={{ fontSize: 10, color: 'rgba(107,100,87,.35)', marginTop: 4 }}>Password for both: admin123</div>
          </div>
        </div>
      </div>
    </div>
  )
}
