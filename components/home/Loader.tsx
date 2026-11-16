'use client'

import { useEffect, useState } from 'react'

/** Shown while a memo is being drafted. The only number on it is real elapsed time. */
export default function Loader({ domain, onCancel }: { domain: string; onCancel: () => void }) {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const started = Date.now()
    const t = setInterval(() => setSeconds(Math.floor((Date.now() - started) / 1000)), 250)
    return () => clearInterval(t)
  }, [])

  return (
    <main id="content" className="flex min-h-screen flex-col items-center justify-center px-5 py-16 text-center" aria-busy="true">
      <div className="relative h-36 w-36" aria-hidden="true">
        <span className="absolute inset-0 rounded-full border border-line-strong" style={{ animation: 'orbit 9s linear infinite' }}>
          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-foreground" />
        </span>
        <span className="absolute inset-5 rounded-full border border-dashed border-line-strong" style={{ animation: 'orbit-rev 6s linear infinite' }}>
          <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent" />
        </span>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="tnum text-[1.75rem] font-semibold tracking-tight">{seconds}s</span>
        </span>
      </div>

      <h1 className="t-h2 mt-10 max-w-[18ch]">
        <span className="enter-line" style={{ ['--i' as string]: 0 }}>
          Drafting a memo for
        </span>
        <span className="enter-line break-all text-accent-ink" style={{ ['--i' as string]: 1 }}>
          {domain}
        </span>
      </h1>
      <p className="enter t-body mt-5 max-w-md" style={{ ['--i' as string]: 3 }} role="status">
        Reading the homepage, then one pass through Gemini. This can take up to a minute.
      </p>

      <div className="enter relative mt-8 h-1 w-56 overflow-hidden rounded-full bg-secondary" style={{ ['--i' as string]: 4 }} aria-hidden="true">
        <span className="absolute inset-y-0 left-0 w-2/5 rounded-full bg-foreground" style={{ animation: 'sweep 1.6s cubic-bezier(0.45, 0, 0.55, 1) infinite' }} />
      </div>

      <button type="button" onClick={onCancel} className="enter btn btn-quiet mt-10" style={{ ['--i' as string]: 5 }}>
        Cancel
      </button>
    </main>
  )
}
