export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export function relTime(d: Date | string) {
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function fmtDate(d: Date) {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

const AV_COLORS = [
  { bg: 'rgba(58,92,48,.13)',  fg: '#2a4422' },
  { bg: 'rgba(24,95,165,.13)', fg: '#0c3e6e' },
  { bg: 'rgba(201,125,42,.13)',fg: '#7a4d10' },
  { bg: 'rgba(163,45,45,.13)', fg: '#7a1f1f' },
  { bg: 'rgba(83,52,114,.13)', fg: '#3b2454' },
]
export function avColor(name: string) {
  return AV_COLORS[name.charCodeAt(0) % AV_COLORS.length]
}
