import React, { useState } from 'react'
import { useStore } from '../../lib/store'
import { MATCHES, CHATS, AUDIT_LOG, MATCH_LABELS } from '../../lib/data'
import { relTime } from '../../lib/utils'
import { Avatar, Badge, MetricCard, CompatBar, EmptyState, Pill, Modal, Toggle, Slider, SectionLabel, Card } from '../ui/index'
import { LineChart } from '../ui/Charts'

// ────────────────────────────────────────────────────────────
// Matches
// ────────────────────────────────────────────────────────────
const MATCH_BADGE: Record<string, string> = {
  PROPOSED:'gray', PENDING_ONE:'amber', MUTUAL:'green', REJECTED:'red', EXPIRED:'gray'
}

export function Matches() {
  const { state, dispatch } = useStore()
  const { matchFilter } = state
  const [view, setView] = useState<'grid'|'table'>('grid')

  const filtered = matchFilter ? MATCHES.filter(m => m.status === matchFilter) : MATCHES
  const mutual = MATCHES.filter(m => m.status === 'MUTUAL').length
  const expiring = MATCHES.filter(m => m.status !== 'MUTUAL' && m.status !== 'EXPIRED' && new Date(m.expires).getTime() - Date.now() < 12 * 3600000 && new Date(m.expires).getTime() > Date.now()).length

  return (
    <div className="page-anim">
      <div className="metric-grid stagger">
        <MetricCard label="Total Matches"     value={MATCHES.length} change="All time" />
        <MetricCard label="Mutual"            value={mutual} change="Both accepted" ct="up" />
        <MetricCard label="Expiring Soon"     value={expiring} change="Within 12h" ct={expiring > 0 ? 'down' : 'neutral'} />
        <MetricCard label="Today's Proposals" value={23} change="↑ 5 vs avg" ct="up" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[['','All'],['PROPOSED','Proposed'],['PENDING_ONE','Pending'],['MUTUAL','Mutual ✓'],['EXPIRED','Expired']].map(([v,l]) => (
            <Pill key={v} label={l} active={matchFilter === v} onClick={() => dispatch({ type: 'SET_MATCH_FILTER', payload: v })} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 2, padding: 4, borderRadius: 8, border: '0.5px solid var(--border)', background: '#fff' }}>
          {(['grid','table'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '5px 12px', borderRadius: 6, border: 'none', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', background: view === v ? 'rgba(0,0,0,.06)' : 'none', color: view === v ? 'var(--ink)' : 'var(--warm)', fontWeight: view === v ? 500 : 400, transition: 'all .15s' }}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="💞" title="No matches found" desc="Try adjusting your filter." />
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }} className="stagger">
          {filtered.map((m, i) => <MatchCard key={m.id} match={m} delay={i * 45} />)}
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Member A</th><th>Member B</th><th>Score</th><th>Status</th><th>Proposed</th><th>Expires</th></tr></thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id}>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar name={m.a.name} size="sm" />{m.a.name}</div></td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar name={m.b.name} size="sm" />{m.b.name}</div></td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 80 }}><CompatBar score={m.score} h={5} /></div><span style={{ fontSize: 12, fontWeight: 500 }}>{m.score}%</span></div></td>
                  <td><Badge v={MATCH_BADGE[m.status] || 'gray'}>{MATCH_LABELS[m.status] || m.status}</Badge></td>
                  <td style={{ fontSize: 12, color: 'var(--warm)' }}>{relTime(m.proposed)}</td>
                  <td style={{ fontSize: 12, color: 'var(--warm)' }}>{relTime(m.expires)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function MatchCard({ match: m, delay }: { match: typeof MATCHES[0]; delay: number }) {
  const expiring = m.status !== 'MUTUAL' && m.status !== 'EXPIRED' && new Date(m.expires).getTime() - Date.now() < 12 * 3600000 && new Date(m.expires).getTime() > Date.now()
  return (
    <div className="card" style={{ padding: 16, animation: `fadeUp .3s ${delay}ms both`, transition: 'box-shadow .2s, border-color .2s', borderColor: expiring ? '#f5d0a0' : undefined }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,.08)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '' }}>
      {expiring && <div style={{ fontSize: 10, color: 'var(--amber)', fontWeight: 500, marginBottom: 8 }}>⏰ Expiring soon</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
          <Avatar name={m.a.name} size="sm" />
          <span style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.a.name}</span>
        </div>
        <span style={{ fontSize: 11, color: 'var(--pebble)', flexShrink: 0 }}>♡</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0, justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.b.name}</span>
          <Avatar name={m.b.name} size="sm" />
        </div>
      </div>
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 600, lineHeight: 1 }}>{m.score}%</span>
        <span style={{ fontSize: 11, color: 'rgba(107,100,87,.5)', marginLeft: 5 }}>compatibility</span>
      </div>
      <CompatBar score={m.score} h={5} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
        {Object.entries(m.breakdown).map(([k, v]) => (
          <div key={k}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 3 }}>
              <span style={{ color: 'rgba(107,100,87,.55)', textTransform: 'capitalize' }}>{k}</span>
              <span style={{ color: 'var(--warm)' }}>{v}%</span>
            </div>
            <CompatBar score={v} h={3} />
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: 'rgba(107,100,87,.65)', fontStyle: 'italic', borderLeft: '2px solid var(--forest)', paddingLeft: 8, lineHeight: 1.55, marginTop: 10 }}>"{m.note}"</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '0.5px solid var(--border)' }}>
        <Badge v={MATCH_BADGE[m.status] || 'gray'}>{MATCH_LABELS[m.status] || m.status}</Badge>
        <span style={{ fontSize: 10, color: 'rgba(107,100,87,.45)' }}>{relTime(m.proposed)}</span>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Juliet Chats
// ────────────────────────────────────────────────────────────
const CHAT_BADGE: Record<string, string> = {
  IN_PROGRESS:'green', COMPLETED:'blue', PAUSED:'amber', ABANDONED:'red'
}

export function Juliet() {
  const { state, dispatch } = useStore()
  const { chatFilter } = state
  const filtered = chatFilter ? CHATS.filter(c => c.status === chatFilter) : CHATS
  const active    = CHATS.filter(c => c.status === 'IN_PROGRESS').length
  const completed = CHATS.filter(c => c.status === 'COMPLETED').length

  return (
    <div className="page-anim">
      <div className="metric-grid stagger">
        <MetricCard label="Active Sessions"  value={active}     change="Live right now" ct="up" />
        <MetricCard label="Completed"        value={completed}  change="↑ full profiles" ct="up" />
        <MetricCard label="Completion Rate"  value="72%"        change="of started chats" ct="up" />
        <MetricCard label="Avg Duration"     value="14 min"     change="per session" />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {[['','All'],['IN_PROGRESS','Active'],['COMPLETED','Completed'],['PAUSED','Paused'],['ABANDONED','Abandoned']].map(([v,l]) => (
          <Pill key={v} label={l} active={chatFilter === v} onClick={() => dispatch({ type: 'SET_CHAT_FILTER', payload: v })} />
        ))}
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <EmptyState icon="💬" title="No chats found" desc="Try adjusting the filter." />
        ) : filtered.map((c, i) => {
          const prog = Math.round(c.q / c.total * 100)
          const mins = Math.round(c.secs / 60)
          return (
            <div key={c.id} style={{ padding: '13px 18px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, animation: `fadeUp .3s ${i * 40}ms both` }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,.01)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
              <Avatar name={c.member.name} size="md" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{c.member.name}</span>
                  <span style={{ fontSize: 11, color: 'rgba(107,100,87,.5)' }}>{c.member.city}</span>
                  <Badge v={CHAT_BADGE[c.status] || 'gray'}>{c.status === 'IN_PROGRESS' ? 'Active' : c.status.toLowerCase().replace('_', ' ')}</Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, maxWidth: 180 }}><CompatBar score={prog} h={6} /></div>
                  <span style={{ fontSize: 11, fontWeight: 500 }}>Q {c.q}<span style={{ fontWeight: 400, color: 'rgba(107,100,87,.5)' }}> of {c.total}</span></span>
                  <span style={{ fontSize: 11, color: 'rgba(107,100,87,.5)' }}>{mins} min</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: 'rgba(107,100,87,.5)' }}>{relTime(c.updated)}</div>
                {c.status === 'IN_PROGRESS' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 3 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--forest)', display: 'inline-block', animation: 'livePulse 2s infinite' }} />
                    <span style={{ fontSize: 10, color: 'rgba(107,100,87,.45)' }}>Live</span>
                  </div>
                )}
                {c.status === 'COMPLETED' && <div style={{ fontSize: 10, color: 'var(--forest)', marginTop: 3 }}>✓ Complete</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Romeo Engine
// ────────────────────────────────────────────────────────────
const DIMS = [
  { label: 'Values alignment',    score: 82, desc: 'Core beliefs, ethics, what matters most in life' },
  { label: 'Communication style', score: 74, desc: 'Direct vs nuanced, verbal vs written, conflict handling' },
  { label: 'Lifestyle fit',       score: 68, desc: 'Social patterns, pace of life, daily rhythms' },
  { label: 'Long-term goals',     score: 91, desc: 'Family, career, geography, life milestones' },
  { label: 'Emotional depth',     score: 77, desc: 'Vulnerability, empathy, emotional intelligence' },
  { label: 'Curiosity & growth',  score: 85, desc: 'Intellectual openness, learning, adaptability' },
]
const SERVICES = [
  { status:'ok',   name:'Embedding pipeline',       detail:'Running · last updated 4 min ago' },
  { status:'ok',   name:'Matching scheduler',        detail:'2 pairs queued' },
  { status:'ok',   name:'pgvector DB',               detail:'2,418 embeddings indexed' },
  { status:'ok',   name:'Romeo voice (ElevenLabs)',  detail:'Connected · voice ID configured' },
  { status:'ok',   name:'Juliet voice (ElevenLabs)', detail:'Connected · voice ID configured' },
  { status:'ok',   name:'Compatibility scorer',      detail:'Model v2.1 loaded' },
  { status:'warn', name:'Profile embedder',          detail:'Re-indexing 14 profiles…' },
]

export function Romeo() {
  return (
    <div className="page-anim">
      <div className="metric-grid stagger">
        <MetricCard label="Profiles in Queue" value={143}   change="Awaiting match" />
        <MetricCard label="Avg Compat Score"  value="79%"   change="Across all pairs" ct="up" />
        <MetricCard label="Proposals Today"   value={23}    change="↑ +12% WoW" ct="up" />
        <MetricCard label="Embeddings"        value="2.4k"  change="in pgvector" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="card" style={{ padding: 18 }}>
          <SectionLabel>Compatibility dimensions</SectionLabel>
          <p style={{ fontSize: 11, color: 'rgba(107,100,87,.6)', marginBottom: 16 }}>Average weights Romeo applies across all matched pairs</p>
          {DIMS.map((d, i) => (
            <div key={d.label} style={{ marginBottom: 16, animation: `fadeUp .3s ${i * 55}ms both` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{d.label}</div>
                  <div style={{ fontSize: 10, color: 'rgba(107,100,87,.5)', marginTop: 1 }}>{d.desc}</div>
                </div>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, marginLeft: 12, flexShrink: 0 }}>{d.score}%</span>
              </div>
              <CompatBar score={d.score} h={7} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ padding: 18 }}>
            <SectionLabel>Engine services</SectionLabel>
            {SERVICES.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '0.5px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(107,100,87,.55)', marginTop: 1 }}>{s.detail}</div>
                </div>
                <span style={{ fontSize: 16, color: s.status === 'ok' ? 'var(--forest)' : 'var(--amber)' }}>
                  {s.status === 'ok' ? '✓' : '⚠'}
                </span>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 18 }}>
            <SectionLabel>Sample Romeo introduction</SectionLabel>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, fontStyle: 'italic', lineHeight: 1.75, color: 'var(--ink)' }}>
              "You share a rare combination of intellectual curiosity and emotional groundedness. Where you differ — she leans into structure, you into spontaneity — the data suggests this creates complementarity rather than conflict."
            </p>
            <div style={{ fontSize: 11, color: 'rgba(107,100,87,.4)', marginTop: 10 }}>Generated for match #1042 · 91% compatibility</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Health
// ────────────────────────────────────────────────────────────
const SVCS = [
  { status:'ok',   name:'Next.js frontend',         detail:'Vercel Edge',          uptime:'99.98%', lat:'42ms'  },
  { status:'ok',   name:'API routes',                detail:'Vercel Serverless',    uptime:'99.95%', lat:'142ms' },
  { status:'ok',   name:'PostgreSQL + pgvector',     detail:'Supabase',             uptime:'99.99%', lat:'8ms'   },
  { status:'ok',   name:'ElevenLabs (Juliet)',       detail:'ElevenLabs CDN',       uptime:'99.90%', lat:'310ms' },
  { status:'ok',   name:'ElevenLabs (Romeo)',        detail:'ElevenLabs CDN',       uptime:'99.90%', lat:'295ms' },
  { status:'warn', name:'SendGrid email',            detail:'SendGrid',             uptime:'99.60%', lat:'1.2s'  },
  { status:'ok',   name:'Pusher realtime',           detail:'Pusher ap2',           uptime:'99.92%', lat:'55ms'  },
  { status:'ok',   name:'S3 / R2 photo storage',    detail:'Cloudflare R2',        uptime:'99.99%', lat:'120ms' },
]
const API_DATA = [120,90,70,85,210,340,310,280,320,380,350,210]
const HR_LABELS = ['00','02','04','06','08','10','12','14','16','18','20','22']
const ERR_DATA  = [0.02,0.01,0.03,0.05,0.04,0.02,0.03,0.02,0.04,0.03,0.02,0.01]

export function Health() {
  const degraded = SVCS.filter(s => s.status === 'warn').length
  return (
    <div className="page-anim">
      <div className="metric-grid stagger">
        <MetricCard label="Uptime (30d)"        value="99.8%"  change="All systems nominal" ct="up" />
        <MetricCard label="Avg API Latency"      value="142ms"  change="↓ fast"             ct="up" />
        <MetricCard label="Error Rate"           value="0.04%"  change="Well within bounds"  ct="up" />
        <MetricCard label="Active Connections"   value={318} />
      </div>

      <div className="table-wrap" style={{ marginBottom: 14, borderLeft: `3px solid ${degraded > 0 ? 'var(--amber)' : 'var(--forest)'}` }}>
        <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>{degraded > 0 ? '⚠' : '✅'}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{degraded > 0 ? `${degraded} service degraded` : 'All systems operational'}</div>
            <div style={{ fontSize: 11, color: 'rgba(107,100,87,.6)', marginTop: 1 }}>{SVCS.length - degraded} of {SVCS.length} services healthy · Last checked just now</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="table-wrap" style={{ marginBottom: 0 }}>
          <div className="table-head"><div className="tbl-label">Service health</div></div>
          {SVCS.map(s => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 18px', borderBottom: '0.5px solid var(--border)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,.01)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.status === 'ok' ? 'var(--forest)' : 'var(--amber)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(107,100,87,.5)' }}>{s.detail}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{s.lat}</div>
                <div style={{ fontSize: 10, color: s.status === 'warn' ? 'var(--amber)' : 'rgba(107,100,87,.5)' }}>{s.uptime} uptime</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ padding: 18 }}>
            <SectionLabel>API requests · today</SectionLabel>
            <LineChart data={API_DATA} color="#185fa5" height={130} labels={HR_LABELS} />
          </div>
          <div className="card" style={{ padding: 18 }}>
            <SectionLabel>Error rate % · today</SectionLabel>
            <LineChart data={ERR_DATA} color="#a32d2d" height={100} labels={HR_LABELS} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Security
// ────────────────────────────────────────────────────────────
const SEC_CHECKS = [
  { ok:true,  name:'NextAuth JWT sessions',          note:'HS256 signed, 30-day expiry, httpOnly cookies' },
  { ok:true,  name:'bcrypt password hashing',        note:'Cost factor 10, salted per-user' },
  { ok:true,  name:'Route middleware protection',    note:'All /dashboard/* and /api/* routes guarded' },
  { ok:true,  name:'Rate limiting on all routes',    note:'Per-IP sliding window, 60 req/min default' },
  { ok:true,  name:'Input sanitization',             note:'All inputs stripped of HTML, length-bounded' },
  { ok:true,  name:'Secure HTTP headers',            note:'CSP, HSTS, X-Frame-Options, XSS protection' },
  { ok:true,  name:'Role-based access control',      note:'SUPER_ADMIN > ADMIN > MODERATOR hierarchy' },
  { ok:true,  name:'Audit logging',                  note:'All write actions logged with admin ID + IP' },
  { ok:true,  name:'SQL injection prevention',       note:'Prisma ORM parameterized queries throughout' },
  { ok:true,  name:'Config key whitelist',           note:'Only allowed keys can be updated via API' },
  { ok:false, name:'Secrets in environment',         note:'Ensure .env.local is in .gitignore — review before deploy' },
  { ok:true,  name:'CORS policy',                    note:'Configured via Next.js headers, no wildcard origins' },
]

const ACTION_BADGE: Record<string, string> = {
  APPROVE_MEMBER:'green', REJECT_MEMBER:'red', UPDATE_CONFIG:'amber',
  CREATE_REFERRAL:'teal', SIGN_IN:'gray', UPDATE_MEMBER:'blue',
}

export function Security() {
  const { state } = useStore()
  if (state.user?.role !== 'SUPER_ADMIN') return (
    <div className="page-anim">
      <EmptyState icon="🔒" title="Access restricted" desc="Security dashboard requires Super Admin access." />
    </div>
  )

  return (
    <div className="page-anim">
      <div style={{ background: '#fff', border: '0.5px solid var(--border)', borderLeft: '3px solid var(--forest)', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>🛡</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Security overview</div>
          <div style={{ fontSize: 11, color: 'rgba(107,100,87,.65)', marginTop: 1 }}>All requests authenticated, rate-limited, and logged. Super admin access required.</div>
        </div>
      </div>

      <div className="metric-grid stagger" style={{ marginBottom: 20 }}>
        <MetricCard label="Total Audit Events"  value={48}   change="All time" />
        <MetricCard label="Admin Actions Today" value={12}   change="↑ normal" ct="up" />
        <MetricCard label="Failed Auth (24h)"   value={3}    change="Low" ct="up" />
        <MetricCard label="Rate Limit Hits"     value={7}    change="Past 24h" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="table-wrap" style={{ marginBottom: 0 }}>
          <div className="table-head"><div className="tbl-label">Security controls</div></div>
          {SEC_CHECKS.map(c => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderBottom: '0.5px solid var(--border)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,.01)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, color: c.ok ? 'var(--forest)' : 'var(--amber)' }}>{c.ok ? '✓' : '⚠'}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(107,100,87,.55)', marginTop: 1 }}>{c.note}</div>
                </div>
              </div>
              <Badge v={c.ok ? 'green' : 'amber'}>{c.ok ? 'Active' : 'Review'}</Badge>
            </div>
          ))}
        </div>

        <div className="table-wrap" style={{ marginBottom: 0 }}>
          <div className="table-head">
            <div className="tbl-label">Recent audit log</div>
            <span style={{ fontSize: 11, color: 'rgba(107,100,87,.4)' }}>48 total events</span>
          </div>
          <table>
            <thead><tr><th>Action</th><th>Entity</th><th>Admin</th><th>When</th></tr></thead>
            <tbody>
              {AUDIT_LOG.map((l, i) => (
                <tr key={i}>
                  <td><Badge v={ACTION_BADGE[l.action] || 'gray'}>{l.action.replace(/_/g, ' ').toLowerCase()}</Badge></td>
                  <td><span style={{ fontSize: 12, color: 'var(--warm)' }}>{l.entity}</span> <span style={{ fontSize: 10, color: 'rgba(107,100,87,.4)' }}>{l.meta}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--warm)' }}>{l.admin}</td>
                  <td style={{ fontSize: 12, color: 'var(--warm)' }}>{relTime(l.when)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Settings
// ────────────────────────────────────────────────────────────
const FMTS: Record<string, (v: number) => string> = {
  thresh: v => `${v}%`, window: v => `${v}h`, intro: v => String(v),
  questions: v => `${v} questions`, checkin: v => `Every ${v}h`,
}

export function Settings() {
  const { state, dispatch } = useStore()
  const [cfg, setCfg] = useState({ ...state.settings })
  const dirty = JSON.stringify(cfg) !== JSON.stringify(state.settings)

  function update<K extends keyof typeof cfg>(k: K, v: typeof cfg[K]) {
    setCfg(p => ({ ...p, [k]: v }))
  }
  function save() {
    dispatch({ type: 'SAVE_SETTINGS', payload: cfg })
    dispatch({ type: 'TOAST', payload: { msg: 'Settings saved successfully', type: 'ok' } })
  }
  function discard() {
    setCfg({ ...state.settings })
    dispatch({ type: 'TOAST', payload: { msg: 'Changes discarded', type: 'info' } })
  }

  return (
    <div className="page-anim" style={{ maxWidth: 640 }}>
      {dirty && (
        <div style={{ background: '#fff', border: '0.5px solid var(--border)', borderLeft: '3px solid var(--forest)', borderRadius: 10, padding: '12px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeUp .2s both' }}>
          <span style={{ fontSize: 13, color: 'var(--warm)' }}>You have unsaved changes</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={discard}>↩ Discard</button>
            <button className="btn btn-p btn-sm" onClick={save}>💾 Save</button>
          </div>
        </div>
      )}

      {[
        { title: 'Matching controls', fields: [
          { key:'thresh',    label:'Minimum compatibility threshold', desc:'Romeo only proposes matches above this score',              min:50, max:95, step:5  },
          { key:'window',    label:'Accept window',                   desc:'Hours each member has to respond to a match',             min:12, max:72, step:12 },
          { key:'intro',     label:'Max introductions per user',      desc:'Active matches a user can hold at one time',              min:1,  max:3,  step:1  },
        ]},
        { title: 'Juliet configuration', fields: [
          { key:'questions', label:'Questions per session',           desc:'Questions Juliet asks before building a Taste Profile',   min:10, max:20, step:1  },
          { key:'checkin',   label:'Check-in interval',               desc:'How often Juliet sends reassurance updates while waiting', min:12, max:72, step:12 },
        ]},
      ].map(section => (
        <div key={section.title} className="card" style={{ padding: 20, marginBottom: 14 }}>
          <SectionLabel>{section.title}</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {section.fields.map(f => (
              <div key={f.key}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{f.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(107,100,87,.55)', marginTop: 2 }}>{f.desc}</div>
                  </div>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, marginLeft: 12, flexShrink: 0, lineHeight: 1 }}>
                    {FMTS[f.key]((cfg as any)[f.key])}
                  </span>
                </div>
                <Slider val={(cfg as any)[f.key]} min={f.min} max={f.max} step={f.step} onChange={v => update(f.key as any, v)} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(107,100,87,.4)', marginTop: 2 }}>
                  <span>{FMTS[f.key](f.min)}</span><span>{FMTS[f.key](f.max)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <SectionLabel>Feature flags</SectionLabel>
        {[
          { key:'voice', label:'Voice mode default',  desc:'New users start Juliet chat with voice enabled' },
          { key:'gate',  label:'Referral gate',        desc:'Require a code or application to access onboarding' },
        ].map(f => (
          <div key={f.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', borderBottom: '0.5px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{f.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(107,100,87,.55)', marginTop: 2 }}>{f.desc}</div>
            </div>
            <Toggle on={(cfg as any)[f.key]} onChange={v => update(f.key as any, v)} />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button className="btn btn-s" onClick={discard} disabled={!dirty}>Discard changes</button>
        <button className="btn btn-p" onClick={save}    disabled={!dirty}>💾 Save changes</button>
      </div>
    </div>
  )
}
