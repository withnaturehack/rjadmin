import React, { useState, useCallback } from 'react'
import { useStore } from '../../lib/store'
import { MATCHES, GROWTH, WEEKS, DAILY, PHASE_LABELS } from '../../lib/data'
import { relTime, initials, avColor } from '../../lib/utils'
import { Avatar, Badge, MetricCard, CompatBar, MetricsSkel, EmptyState, Pill, Modal, SectionLabel } from '../ui/index'
import { AreaChart, DonutChart, BarChart } from '../ui/Charts'

// ────────────────────────────────────────────────────────────
// Dashboard
// ────────────────────────────────────────────────────────────
export function Dashboard() {
  const { state, dispatch } = useStore()
  const { members } = state
  const pending = members.filter(m => m.status === 'PENDING').length
  const approved = members.filter(m => m.status === 'APPROVED').length

  const phaseData = [
    { label: 'Onboarding', value: members.filter(m => m.phase === 'ONBOARDING').length || 182 },
    { label: 'Waiting',    value: members.filter(m => m.phase === 'WAITING').length || 168 },
    { label: 'Matched',    value: members.filter(m => m.phase === 'MATCHED').length || 98 },
    { label: 'In chat',    value: members.filter(m => m.phase === 'CHATTING').length || 46 },
    { label: 'Juliet',     value: members.filter(m => m.phase === 'CHAT').length || 40 },
  ]

  return (
    <div className="page-anim">
      <div className="metric-grid stagger">
        <MetricCard label="Total Members"     value={(2418 - 12 + members.length - 12).toLocaleString()} change="↑ 48 this week" ct="up" />
        <MetricCard label="Active Matches"    value={MATCHES.filter(m => m.status !== 'EXPIRED').length} change="↑ 3 today" ct="up" />
        <MetricCard label="Accept Rate"       value="68%" change="↑ 4% vs last month" ct="up" />
        <MetricCard label="Pending Approvals" value={pending} change={pending > 0 ? `${pending} need review` : 'All clear'} ct={pending > 0 ? 'down' : 'up'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginBottom: 20 }}>
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <SectionLabel>Member growth · 12 weeks</SectionLabel>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--forest)' }}>↑ 34%</span>
          </div>
          <AreaChart data={GROWTH} labels={WEEKS} height={160} />
        </div>
        <div className="card" style={{ padding: 18 }}>
          <SectionLabel>Phase breakdown</SectionLabel>
          <DonutChart data={phaseData} colors={['#3A5C30','#c97d2a','#185fa5','#7a3472','#888']} height={130} />
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {phaseData.map((p, i) => (
              <div key={p.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, display: 'inline-block', background: ['#3A5C30','#c97d2a','#185fa5','#7a3472','#888'][i] }} />
                  <span style={{ color: 'var(--warm)' }}>{p.label}</span>
                </div>
                <span style={{ fontWeight: 500 }}>{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-head">
          <div className="tbl-label">Recent signups</div>
          <button className="btn btn-ghost" onClick={() => dispatch({ type: 'NAV', payload: 'members' })}>View all →</button>
        </div>
        <table>
          <thead><tr><th>Member</th><th>Phase</th><th>Referral</th><th>Joined</th><th>Status</th></tr></thead>
          <tbody>
            {members.slice(0, 8).map(m => (
              <tr key={m.id} onClick={() => dispatch({ type: 'NAV', payload: 'members' })}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <Avatar name={m.name} size="sm" />
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(107,100,87,.55)' }}>{m.email}</div>
                    </div>
                  </div>
                </td>
                <td><Badge v={m.phase === 'MATCHED' ? 'blue' : m.phase === 'CHATTING' ? 'green' : m.phase === 'WAITING' ? 'amber' : 'gray'}>{PHASE_LABELS[m.phase] || m.phase}</Badge></td>
                <td><span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--warm)' }}>{m.ref || '—'}</span></td>
                <td style={{ fontSize: 12, color: 'var(--warm)' }}>{relTime(m.joined)}</td>
                <td><Badge v={m.status === 'APPROVED' ? 'green' : m.status === 'REJECTED' ? 'red' : 'amber'}>{m.status.charAt(0) + m.status.slice(1).toLowerCase()}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Analytics
// ────────────────────────────────────────────────────────────
export function Analytics() {
  const { state } = useStore()
  const { members } = state
  const funnel = [
    { label: 'Profiles submitted', n: members.length + 2406, pct: 100 },
    { label: 'Juliet completed',   n: 1982, pct: 82 },
    { label: 'Match proposed',     n: 1306, pct: 54 },
    { label: 'Accepted by user',   n: 895,  pct: 37 },
    { label: 'Mutual match',       n: 580,  pct: 24 },
  ]
  const dailyData = DAILY.labels.map((l, i) => ({ label: l, accepted: DAILY.accepted[i], rejected: DAILY.rejected[i] }))

  return (
    <div className="page-anim">
      <div className="metric-grid stagger">
        <MetricCard label="Match Rate"        value="1 in 3"  change="↑ improving"    ct="up" />
        <MetricCard label="Mutual Rate"       value="47%"     change="↑ 6% MoM"       ct="up" />
        <MetricCard label="Avg Compat Score"  value="79%"     change="Across all pairs" />
        <MetricCard label="Juliet Completion" value="82%"     change="of started chats" ct="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
        <div className="card" style={{ padding: 18 }}>
          <SectionLabel>Match funnel</SectionLabel>
          {funnel.map((f, i) => (
            <div key={f.label} style={{ marginBottom: 12, animation: `fadeUp .3s ${i * 60}ms both` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: 'var(--warm)' }}>{f.label}</span>
                <span style={{ fontWeight: 500 }}>{f.n.toLocaleString()}</span>
              </div>
              <div style={{ height: 22, borderRadius: 4, background: 'rgba(0,0,0,.05)', overflow: 'hidden' }}>
                <div style={{ width: `${f.pct}%`, height: '100%', background: 'var(--forest)', borderRadius: 4, display: 'flex', alignItems: 'center', paddingLeft: 8, transition: 'width .8s cubic-bezier(.16,1,.3,1)' }}>
                  <span style={{ fontSize: 10, color: '#fff', fontWeight: 500 }}>{f.pct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 18 }}>
          <SectionLabel>Accepts vs rejects · 7 days</SectionLabel>
          <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
            {[['#3A5C30','Accepted'],['#a32d2d','Rejected']].map(([c,l]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--warm)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: 'inline-block' }} />{l}
              </span>
            ))}
          </div>
          <BarChart data={dailyData} height={200} />
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-head"><div className="tbl-label">Phase breakdown</div></div>
        <table>
          <thead><tr><th>Phase</th><th>Members</th><th>% of total</th></tr></thead>
          <tbody>
            {[['Onboarding',919],['Waiting',701],['Matched',420],['In chat',196],['Juliet chat',182]].map(([p,n]: any[]) => {
              const pct = Math.round(n / 2418 * 100)
              return (
                <tr key={p}>
                  <td style={{ fontWeight: 500 }}>{p}</td>
                  <td>{n.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, maxWidth: 120 }}><CompatBar score={pct} h={6} /></div>
                      <span style={{ fontSize: 11, color: 'var(--warm)', width: 28 }}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Members
// ────────────────────────────────────────────────────────────
export function Members() {
  const { state, dispatch } = useStore()
  const { members, memberSearch, memberStatusFilter } = state
  const [selected, setSelected] = useState<typeof members[0] | null>(null)

  const filtered = members.filter(m => {
    const q = memberSearch.toLowerCase()
    const matchQ = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.city.toLowerCase().includes(q)
    const matchS = !memberStatusFilter || m.status === memberStatusFilter
    return matchQ && matchS
  })

  return (
    <div className="page-anim">
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <input className="inp" placeholder="Search by name, email or city…"
            value={memberSearch}
            onChange={e => dispatch({ type: 'SET_MEMBER_SEARCH', payload: e.target.value })}
            style={{ paddingLeft: 32 }} />
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(107,100,87,.4)', fontSize: 13 }}>⌕</span>
        </div>
        <select className="inp" style={{ width: 'auto' }}
          value={memberStatusFilter}
          onChange={e => dispatch({ type: 'SET_MEMBER_STATUS', payload: e.target.value })}>
          <option value="">All statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <span style={{ fontSize: 12, color: 'rgba(107,100,87,.5)', whiteSpace: 'nowrap' }}>{filtered.length} members</span>
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <EmptyState icon="👥" title="No members found" desc="Try adjusting your search or filter." />
        ) : (
          <table>
            <thead><tr><th>Member</th><th>Phase</th><th>Status</th><th>City</th><th>Referral</th><th>Joined</th><th></th></tr></thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} onClick={() => setSelected(m)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <Avatar name={m.name} size="sm" />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(107,100,87,.55)' }}>{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><Badge v={m.phase === 'MATCHED' ? 'blue' : m.phase === 'CHATTING' ? 'green' : m.phase === 'WAITING' ? 'amber' : 'gray'}>{PHASE_LABELS[m.phase] || m.phase}</Badge></td>
                  <td><Badge v={m.status === 'APPROVED' ? 'green' : m.status === 'REJECTED' ? 'red' : 'amber'}>{m.status.charAt(0) + m.status.slice(1).toLowerCase()}</Badge></td>
                  <td style={{ fontSize: 12, color: 'var(--warm)' }}>{m.city}</td>
                  <td><span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--warm)' }}>{m.ref || '—'}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--warm)' }}>{relTime(m.joined)}</td>
                  <td><button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); setSelected(m) }}>View →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} maxW={500}
        title={selected?.name || ''} desc={selected?.email || ''}>
        {selected && <MemberDetail member={selected} onClose={() => setSelected(null)} />}
      </Modal>
    </div>
  )
}

function MemberDetail({ member: m, onClose }: { member: any; onClose: () => void }) {
  const { dispatch } = useStore()
  const { bg, fg } = avColor(m.name)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 500, flexShrink: 0 }}>{initials(m.name)}</div>
        <div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            <Badge v={m.phase === 'MATCHED' ? 'blue' : m.phase === 'CHATTING' ? 'green' : m.phase === 'WAITING' ? 'amber' : 'gray'}>{PHASE_LABELS[m.phase] || m.phase}</Badge>
            <Badge v={m.status === 'APPROVED' ? 'green' : m.status === 'REJECTED' ? 'red' : 'amber'}>{m.status}</Badge>
          </div>
          <div style={{ fontSize: 12, color: 'var(--warm)' }}>{m.city} · {m.age}y · {m.gender === 'F' ? 'Female' : 'Male'}{m.ref ? ` · ${m.ref}` : ''}</div>
        </div>
      </div>
      {m.bio && <p style={{ fontSize: 13, color: 'var(--warm)', lineHeight: 1.6, marginBottom: 16, fontStyle: 'italic' }}>"{m.bio}"</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ background: 'rgba(0,0,0,.02)', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(107,100,87,.5)', marginBottom: 6 }}>Photos</div>
          <div style={{ fontSize: 22, fontFamily: "'Cormorant Garamond',serif", fontWeight: 600 }}>{m.photos}</div>
          <div style={{ fontSize: 11, color: 'var(--warm)' }}>uploaded</div>
        </div>
        <div style={{ background: 'rgba(0,0,0,.02)', borderRadius: 8, padding: '10px 12px' }}>
          <div style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(107,100,87,.5)', marginBottom: 6 }}>Joined</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>{relTime(m.joined)}</div>
        </div>
      </div>
      {m.status === 'PENDING' && (
        <div style={{ background: 'rgba(58,92,48,.04)', border: '0.5px solid rgba(58,92,48,.15)', borderRadius: 8, padding: '12px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ fontSize: 13, color: 'var(--ink)' }}>Profile awaiting review</div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button className="btn btn-p btn-sm" onClick={() => { dispatch({ type: 'APPROVE_MEMBER', payload: m.id }); dispatch({ type: 'TOAST', payload: { msg: `✓ ${m.name} approved`, type: 'ok' } }); onClose() }}>✓ Approve</button>
            <button className="btn btn-d btn-sm"  onClick={() => { dispatch({ type: 'REJECT_MEMBER',  payload: m.id }); dispatch({ type: 'TOAST', payload: { msg: `${m.name} rejected`, type: 'info' } }); onClose() }}>Reject</button>
          </div>
        </div>
      )}
      <button className="btn btn-s" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>Close</button>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Approvals
// ────────────────────────────────────────────────────────────
export function Approvals() {
  const { state, dispatch } = useStore()
  const { members, approvalsDone } = state
  const pending = members.filter(m => m.status === 'PENDING')

  function approve(id: string, name: string) {
    dispatch({ type: 'APPROVE_MEMBER', payload: id })
    dispatch({ type: 'TOAST', payload: { msg: `✓ ${name} approved and moved to waiting pool`, type: 'ok' } })
  }
  function reject(id: string, name: string) {
    dispatch({ type: 'REJECT_MEMBER', payload: id })
    dispatch({ type: 'TOAST', payload: { msg: `${name} rejected`, type: 'info' } })
  }

  return (
    <div className="page-anim">
      <div className="metric-grid stagger">
        <MetricCard label="Pending Review"   value={pending.length}  change={pending.length > 0 ? 'Needs attention' : 'All clear'} ct={pending.length > 0 ? 'down' : 'up'} />
        <MetricCard label="Approved Today"   value={Object.values(approvalsDone).filter(v => v === 'approved').length + 5} change="↑ 3 vs avg" ct="up" />
        <MetricCard label="Rejected Today"   value={Object.values(approvalsDone).filter(v => v === 'rejected').length + 2} />
        <MetricCard label="Avg Review Time"  value="4.2h" />
      </div>

      <div className="table-wrap">
        <div className="table-head">
          <div className="tbl-label">Pending profile approvals</div>
          <span style={{ fontSize: 11, color: 'rgba(107,100,87,.45)' }}>{pending.length} remaining</span>
        </div>
        {pending.length === 0 ? (
          <EmptyState icon="✅" title="All caught up" desc="No profiles pending review right now." />
        ) : (
          pending.map(m => {
            const done = approvalsDone[m.id]
            return (
              <div key={m.id} style={{ padding: '14px 18px', borderBottom: '0.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, opacity: done ? 0.45 : 1, background: done === 'approved' ? 'rgba(58,92,48,.02)' : done === 'rejected' ? 'rgba(163,45,45,.02)' : 'none', transition: 'all .3s' }}>
                <Avatar name={m.name} size="md" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{m.name}</span>
                    {m.ref ? <Badge v="green">{m.ref}</Badge> : <Badge v="amber">No referral · applied via form</Badge>}
                    {done && <Badge v={done === 'approved' ? 'green' : 'red'}>{done}</Badge>}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(107,100,87,.6)' }}>
                    {m.email} · {m.city} · {m.age}y · Applied {relTime(m.joined)} · {m.photos} photo{m.photos !== 1 ? 's' : ''} uploaded
                  </div>
                </div>
                {!done && (
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button className="btn btn-p btn-sm" onClick={() => approve(m.id, m.name)}>✓ Approve</button>
                    <button className="btn btn-d btn-sm"  onClick={() => reject(m.id, m.name)}>Reject</button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Referrals
// ────────────────────────────────────────────────────────────
export function Referrals() {
  const { state, dispatch } = useStore()
  const { referrals } = state
  const [showModal, setShowModal] = useState(false)
  const [code, setCode]   = useState('')
  const [label, setLabel] = useState('')
  const [maxUses, setMax] = useState('')

  const totalUsed = referrals.reduce((s, r) => s + r.used, 0)
  const totalConv = referrals.reduce((s, r) => s + r.conv, 0)
  const convRate  = totalUsed > 0 ? Math.round(totalConv / totalUsed * 100) : 0

  function createCode(e: React.FormEvent) {
    e.preventDefault()
    const c = code.toUpperCase().trim()
    if (!/^[A-Z0-9-]{4,20}$/.test(c)) { dispatch({ type: 'TOAST', payload: { msg: 'Invalid code format. Use uppercase letters, numbers, hyphens. 4–20 chars.', type: 'err' } }); return }
    if (referrals.find(r => r.code === c)) { dispatch({ type: 'TOAST', payload: { msg: 'Code already exists', type: 'err' } }); return }
    dispatch({ type: 'ADD_REFERRAL', payload: { id: 'r' + Date.now(), code: c, label: label.trim(), by: 'Admin', used: 0, conv: 0, active: true, max: maxUses ? parseInt(maxUses) : null, created: 'Apr 2026' } })
    dispatch({ type: 'TOAST', payload: { msg: `Referral code created: ${c}`, type: 'ok' } })
    setCode(''); setLabel(''); setMax(''); setShowModal(false)
  }

  function copyCode(c: string) {
    navigator.clipboard?.writeText(c).then(() => dispatch({ type: 'TOAST', payload: { msg: `Copied: ${c}`, type: 'ok' } }))
  }

  return (
    <div className="page-anim">
      <div className="metric-grid stagger">
        <MetricCard label="Active Codes"    value={referrals.filter(r => r.active).length} />
        <MetricCard label="Total Used"      value={totalUsed.toLocaleString()} />
        <MetricCard label="Conversions"     value={totalConv.toLocaleString()} change="↑ joining rate" ct="up" />
        <MetricCard label="Conv Rate"       value={`${convRate}%`} ct="up" />
      </div>

      <div className="table-wrap">
        <div className="table-head">
          <div className="tbl-label">Referral codes</div>
          <button className="btn btn-p btn-sm" onClick={() => setShowModal(true)}>+ Generate code</button>
        </div>
        <table>
          <thead><tr><th>Code</th><th>Label</th><th>By</th><th>Used</th><th>Conv</th><th>Rate</th><th>Max</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {referrals.map(r => {
              const rate = r.used > 0 ? Math.round(r.conv / r.used * 100) : 0
              return (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }} className="ref-code-row">
                      <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 500 }}>{r.code}</span>
                      <button className="btn btn-ghost" style={{ padding: '2px 6px', fontSize: 11, opacity: 0 }} onClick={() => copyCode(r.code)} data-copy>⎘ Copy</button>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--warm)' }}>{r.label || '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--warm)' }}>{r.by}</td>
                  <td style={{ fontWeight: 500 }}>{r.used.toLocaleString()}</td>
                  <td style={{ fontWeight: 500 }}>{r.conv.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 60 }}><CompatBar score={rate} h={5} /></div>
                      <span style={{ fontSize: 11, color: 'var(--warm)' }}>{rate}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--warm)' }}>{r.max || '∞'}</td>
                  <td><Badge v={r.active ? 'green' : 'gray'}>{r.active ? 'Active' : 'Paused'}</Badge></td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => { dispatch({ type: 'TOGGLE_REFERRAL', payload: r.id }); dispatch({ type: 'TOAST', payload: { msg: `Code ${r.active ? 'paused' : 'activated'}`, type: 'info' } }) }}>
                      {r.active ? 'Pause' : 'Activate'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Generate referral code" desc="Create a new code to share with prospective members." maxW={420}>
        <form onSubmit={createCode}>
          <div style={{ marginBottom: 14 }}>
            <label className="field-label">Code *</label>
            <input className="inp" placeholder="ROMEO-XXX" value={code} onChange={e => setCode(e.target.value.toUpperCase())} style={{ fontFamily: 'monospace' }} required />
            <div style={{ fontSize: 10, color: 'rgba(107,100,87,.45)', marginTop: 3 }}>Uppercase letters, numbers, hyphens. 4–20 chars.</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label className="field-label">Label</label>
            <input className="inp" placeholder="e.g. Spring 2026 batch" value={label} onChange={e => setLabel(e.target.value)} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Max uses</label>
            <input className="inp" type="number" placeholder="Leave blank for unlimited" value={maxUses} onChange={e => setMax(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-p" style={{ flex: 1, justifyContent: 'center' }}>Create code</button>
            <button type="button" className="btn btn-s" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
