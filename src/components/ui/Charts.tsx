import React, { useEffect, useRef } from 'react'

interface CanvasChartProps { width?: number; height: number }

// ── Area/Line Chart ──────────────────────────────────────────
export function AreaChart({ data, labels, color = '#3A5C30', height }: {
  data: number[]; labels?: string[]; color?: string; height: number
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const W = c.offsetWidth, H = height
    c.width = W * devicePixelRatio; c.height = H * devicePixelRatio
    c.style.width = W + 'px'; c.style.height = H + 'px'
    const ctx = c.getContext('2d')!
    ctx.scale(devicePixelRatio, devicePixelRatio)
    draw(ctx, W, H)
  })
  function draw(ctx: CanvasRenderingContext2D, W: number, H: number) {
    const pad = { t: 10, r: 12, b: labels ? 26 : 10, l: 44 }
    const dW = W - pad.l - pad.r, dH = H - pad.t - pad.b
    const min = Math.min(...data) * 0.97, max = Math.max(...data) * 1.02
    ctx.clearRect(0, 0, W, H)
    // Grid lines
    ctx.strokeStyle = 'rgba(0,0,0,.04)'; ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + dH * (1 - i / 4)
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke()
      const v = min + (max - min) * i / 4
      ctx.fillStyle = 'rgba(107,100,87,.45)'; ctx.font = '9px DM Sans,sans-serif'
      ctx.textAlign = 'right'; ctx.fillText(Math.round(v).toLocaleString(), pad.l - 5, y + 3)
    }
    // X labels
    if (labels) {
      ctx.fillStyle = 'rgba(107,100,87,.45)'; ctx.textAlign = 'center'
      const step = Math.ceil(labels.length / 8)
      labels.forEach((l, i) => {
        if (i % step !== 0) return
        const x = pad.l + dW * i / (data.length - 1)
        ctx.fillText(l, x, H - 6)
      })
    }
    const pts = data.map((v, i) => ({ x: pad.l + dW * i / (data.length - 1), y: pad.t + dH * (1 - (v - min) / (max - min)) }))
    // Area fill
    const r = parseInt(color.slice(1,3),16), g = parseInt(color.slice(3,5),16), b = parseInt(color.slice(5,7),16)
    ctx.beginPath(); ctx.moveTo(pts[0].x, pad.t + dH)
    pts.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(pts[pts.length-1].x, pad.t + dH); ctx.closePath()
    ctx.fillStyle = `rgba(${r},${g},${b},.08)`; ctx.fill()
    // Line
    ctx.beginPath(); pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke()
    // Dots
    pts.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI*2); ctx.fillStyle = color; ctx.fill() })
  }
  return <canvas ref={ref} style={{ width: '100%', height, display: 'block' }} />
}

// ── Donut Chart ──────────────────────────────────────────────
export function DonutChart({ data, colors, height }: {
  data: { label: string; value: number }[]; colors: string[]; height: number
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const W = c.offsetWidth, H = height
    c.width = W * devicePixelRatio; c.height = H * devicePixelRatio
    c.style.width = W + 'px'; c.style.height = H + 'px'
    const ctx = c.getContext('2d')!
    ctx.scale(devicePixelRatio, devicePixelRatio)
    const total = data.reduce((s, d) => s + d.value, 0)
    const cx = W / 2, cy = H / 2, r = Math.min(cx, cy) - 8, ir = r * .58
    let start = -Math.PI / 2
    ctx.clearRect(0, 0, W, H)
    data.forEach((d, i) => {
      const sweep = (d.value / total) * Math.PI * 2
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, start + sweep)
      ctx.closePath(); ctx.fillStyle = colors[i % colors.length]; ctx.fill()
      start += sweep
    })
    ctx.beginPath(); ctx.arc(cx, cy, ir, 0, Math.PI*2); ctx.fillStyle = '#fff'; ctx.fill()
    ctx.fillStyle = '#1E1E1A'; ctx.font = `bold 16px 'Cormorant Garamond',serif`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(total.toLocaleString(), cx, cy - 8)
    ctx.fillStyle = 'rgba(107,100,87,.5)'; ctx.font = '10px DM Sans,sans-serif'
    ctx.fillText('members', cx, cy + 9)
  })
  return <canvas ref={ref} style={{ width: '100%', height, display: 'block' }} />
}

// ── Bar Chart ────────────────────────────────────────────────
export function BarChart({ data, height }: {
  data: { label: string; accepted: number; rejected: number }[]; height: number
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const W = c.offsetWidth, H = height
    c.width = W * devicePixelRatio; c.height = H * devicePixelRatio
    c.style.width = W + 'px'; c.style.height = H + 'px'
    const ctx = c.getContext('2d')!
    ctx.scale(devicePixelRatio, devicePixelRatio)
    ctx.clearRect(0, 0, W, H)
    const pad = { t: 10, r: 10, b: 28, l: 36 }
    const dW = W - pad.l - pad.r, dH = H - pad.t - pad.b
    const maxV = Math.max(...data.map(d => Math.max(d.accepted, d.rejected))) * 1.1
    const n = data.length, gap = dW / n, bw = Math.floor(gap * .28)
    ctx.strokeStyle = 'rgba(0,0,0,.04)'; ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + dH * (1 - i / 4)
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke()
    }
    data.forEach((d, i) => {
      const cx = pad.l + gap * i + gap / 2
      const ah = Math.round(d.accepted / maxV * dH)
      const rh = Math.round(d.rejected / maxV * dH)
      ctx.fillStyle = '#3A5C30'
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(cx - bw - 2, pad.t + dH - ah, bw, ah, 2); else ctx.rect(cx - bw - 2, pad.t + dH - ah, bw, ah); ctx.fill()
      ctx.fillStyle = '#a32d2d'
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(cx + 2, pad.t + dH - rh, bw, rh, 2); else ctx.rect(cx + 2, pad.t + dH - rh, bw, rh); ctx.fill()
      ctx.fillStyle = 'rgba(107,100,87,.5)'; ctx.font = '10px DM Sans,sans-serif'; ctx.textAlign = 'center'
      ctx.fillText(d.label, cx, H - 8)
    })
  })
  return <canvas ref={ref} style={{ width: '100%', height, display: 'block' }} />
}

// ── Line Chart (health) ──────────────────────────────────────
export function LineChart({ data, color, height, labels }: {
  data: number[]; color: string; height: number; labels?: string[]
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const W = c.offsetWidth, H = height
    c.width = W * devicePixelRatio; c.height = H * devicePixelRatio
    c.style.width = W + 'px'; c.style.height = H + 'px'
    const ctx = c.getContext('2d')!
    ctx.scale(devicePixelRatio, devicePixelRatio)
    ctx.clearRect(0, 0, W, H)
    const pad = { t: 8, r: 10, b: labels ? 24 : 8, l: 38 }
    const dW = W - pad.l - pad.r, dH = H - pad.t - pad.b
    const minV = 0, maxV = Math.max(...data) * 1.1 || 1
    ctx.strokeStyle = 'rgba(0,0,0,.04)'; ctx.lineWidth = 1
    for (let i = 0; i <= 3; i++) {
      const y = pad.t + dH * (1 - i/3)
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W-pad.r, y); ctx.stroke()
      ctx.fillStyle = 'rgba(107,100,87,.4)'; ctx.font = '9px DM Sans,sans-serif'; ctx.textAlign = 'right'
      ctx.fillText((minV + (maxV-minV)*i/3).toFixed(maxV < 1 ? 2 : 0), pad.l-3, y+3)
    }
    if (labels) {
      const step = Math.ceil(labels.length / 6)
      labels.forEach((l, i) => {
        if (i % step !== 0) return
        ctx.fillStyle = 'rgba(107,100,87,.4)'; ctx.textAlign = 'center'
        ctx.fillText(l, pad.l + dW*i/(data.length-1), H-6)
      })
    }
    const pts = data.map((v, i) => ({ x: pad.l + dW*i/(data.length-1), y: pad.t + dH*(1-(v-minV)/(maxV-minV)) }))
    const r = parseInt(color.slice(1,3),16), g = parseInt(color.slice(3,5),16), b = parseInt(color.slice(5,7),16)
    ctx.beginPath(); ctx.moveTo(pts[0].x, pad.t+dH)
    pts.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.lineTo(pts[pts.length-1].x, pad.t+dH); ctx.closePath()
    ctx.fillStyle = `rgba(${r},${g},${b},.08)`; ctx.fill()
    ctx.beginPath(); pts.forEach((p,i) => i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y))
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke()
  })
  return <canvas ref={ref} style={{ width: '100%', height, display: 'block' }} />
}
