'use client'

import { useEffect, useRef, useState } from 'react'
import { scoreBand } from '@/lib/memo'

const TONE: Record<string, string> = {
  good: 'var(--good)',
  caution: 'var(--caution)',
  bad: 'var(--bad)',
}

/**
 * The memo's score out of 100. The ring draws and the number counts up once,
 * the first time it is on screen.
 */
export default function ScoreRing({
  value,
  size = 136,
  delay = 0,
}: {
  value: number
  size?: number
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(0)
  const [drawn, setDrawn] = useState(false)
  const band = scoreBand(value)

  const stroke = Math.max(6, Math.round(size / 17))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    let timer: ReturnType<typeof setTimeout>

    const run = () => {
      setDrawn(true)
      const start = performance.now()
      const dur = 1400
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        const eased = 1 - Math.pow(1 - p, 4)
        setShown(Math.round(eased * value))
        if (p < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(run, delay)
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [value, delay])

  return (
    <div
      ref={ref}
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Score ${value} out of 100: ${band.label}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--secondary)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={TONE[band.tone]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={drawn ? c - (value / 100) * c : c}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <span
          className="tnum font-semibold leading-none tracking-tight"
          style={{ fontSize: Math.round(size * 0.3) }}
        >
          {shown}
        </span>
        <span className="tnum mt-1 text-muted-foreground" style={{ fontSize: Math.max(12, Math.round(size * 0.1)) }}>
          of 100
        </span>
      </div>
    </div>
  )
}
