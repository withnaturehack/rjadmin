import React, { useEffect, useRef, ReactNode } from 'react'
import { initials, avColor, cn } from '../../lib/utils'

// ── Avatar ──────────────────────────────────────────────────
export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const { bg, fg } = avColor(name)
  const sz = { sm: 26, md: 32, lg: 40 }[size]
  const fs = { sm: 10, md: 12, lg: 14 }[size]
  return (
    <div style={{
      width: sz, height: sz, borderRadius: '50%', background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: fs, fontWeight: 500, flexShrink: 0,
    }}>
      {initials(name)}
    </div>
  )
}

// ── Badge ────────────────────────────────────────────────────
const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  green:  { bg: 'rgba(58,92,48,.1)',   color: '#2a4422' },
  amber:  { bg: 'rgba(201,125,42,.1)', color: '#7a4d10' },
  red:    { bg: 'rgba(163,45,45,.1)',  color: '#7a1f1f' },
  blue:   { bg: 'rgba(24,95,165,.1)',  color: '#0c3e6e' },
  gray:   { bg: 'rgba(0,0,0,.06)',     color: '#6B6457' },
  teal:   { bg: 'rgba(15,110,86,.1)',  color: '#085041' },
  purple: { bg: 'rgba(83,52,114,.1)',  color: '#3b2454' },
}
export function Badge({ v = 'gray', children }: { v?: string; children: ReactNode }) {
  const s = BADGE_STYLES[v] || BADGE_STYLES.gray
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '2px 8px',
      borderRadius: 20, fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap',
      background: s.bg, color: s.color,
    }}>
      {children}
    </span>
  )
}

// ── CompatBar ────────────────────────────────────────────────
export function CompatBar({ score, h = 6 }: { score: number; h?: number }) {
  return (
    <div style={{ height: h, borderRadius: 3, background: 'rgba(0,0,0,.07)', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 3, background: 'var(--forest)',
        width: `${Math.min(100, Math.max(0, score))}%`,
        transition: 'width .6s cubic-bezier(.16,1,.3,1)',
      }} />
    </div>
  )
}

// ── MetricCard ───────────────────────────────────────────────
export function MetricCard({ label, value, change, ct = 'neutral' }: {
  label: string; value: string | number; change?: string; ct?: 'up' | 'down' | 'neutral'
}) {
  const changeColor = ct === 'up' ? 'var(--forest)' : ct === 'down' ? 'var(--red)' : 'rgba(107,100,87,.55)'
  return (
    <div className="card metric-card">
      <div className="label">{label}</div>
      <div className="val">{value}</div>
      {change && <div style={{ fontSize: 11, color: changeColor, marginTop: 2 }}>{change}</div>}
    </div>
  )
}

// ── Skeleton ─────────────────────────────────────────────────
export function Skel({ w, h, r = 6 }: { w: string | number; h: number; r?: number }) {
  return <div className="skel" style={{ width: w, height: h, borderRadius: r, flexShrink: 0 }} />
}

export function MetricsSkel() {
  return (
    <div className="metric-grid" style={{ marginBottom: 20 }}>
      {[0,1,2,3].map(i => (
        <div key={i} className="card metric-card">
          <Skel w="60%" h={10} /><Skel w="40%" h={28} style={{ margin: '6px 0 4px' } as any} /><Skel w="50%" h={9} />
        </div>
      ))}
    </div>
  )
}

// ── Modal ────────────────────────────────────────────────────
export function Modal({ open, onClose, title, desc, children, maxW = 460 }: {
  open: boolean; onClose: () => void; title?: string; desc?: string
  children: ReactNode; maxW?: number
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-box" style={{ maxWidth: maxW }}>
        {(title || desc) && (
          <div className="modal-header">
            <div>
              {title && <div className="modal-title">{title}</div>}
              {desc  && <div className="modal-desc">{desc}</div>}
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

// ── Toggle ───────────────────────────────────────────────────
export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch" aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
        background: on ? 'var(--forest)' : 'var(--pebble)',
        position: 'relative', transition: 'background .2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: on ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,.15)',
        transition: 'left .2s cubic-bezier(.16,1,.3,1)',
      }} />
    </button>
  )
}

// ── Slider ───────────────────────────────────────────────────
export function Slider({ val, min, max, step, onChange }: {
  val: number; min: number; max: number; step: number; onChange: (v: number) => void
}) {
  const pct = ((val - min) / (max - min)) * 100
  return (
    <input type="range" min={min} max={max} step={step} value={val}
      onChange={e => onChange(parseInt(e.target.value))}
      style={{
        width: '100%', height: 4, borderRadius: 2, outline: 'none', cursor: 'pointer',
        accentColor: 'var(--forest)',
        background: `linear-gradient(to right, var(--forest) ${pct}%, rgba(0,0,0,.1) ${pct}%)`,
      }}
    />
  )
}

// ── EmptyState ───────────────────────────────────────────────
export function EmptyState({ icon, title, desc }: { icon: string; title: string; desc?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', gap: 8, textAlign: 'center' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(58,92,48,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{title}</div>
      {desc && <div style={{ fontSize: 12, color: 'rgba(107,100,87,.6)', maxWidth: 260 }}>{desc}</div>}
    </div>
  )
}

// ── Pill filter ──────────────────────────────────────────────
export function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 13px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
      border: `0.5px solid ${active ? 'rgba(58,92,48,.3)' : 'rgba(0,0,0,.13)'}`,
      background: active ? 'rgba(58,92,48,.08)' : '#fff',
      color: active ? 'var(--forest)' : 'var(--warm)',
      fontWeight: active ? 500 : 400,
      fontFamily: 'inherit', transition: 'all .15s',
    }}>
      {label}
    </button>
  )
}

// ── Card wrapper ─────────────────────────────────────────────
export function Card({ children, style, className }: { children: ReactNode; style?: React.CSSProperties; className?: string }) {
  return <div className={cn('card', className)} style={style}>{children}</div>
}

// ── Section header ───────────────────────────────────────────
export function SectionLabel({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(107,100,87,.5)', fontWeight: 500, marginBottom: 16 }}>{children}</div>
}
