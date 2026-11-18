'use client'

import { useEffect, useId, useRef, useState, type MouseEvent } from 'react'
import Link from 'next/link'
import '@/app/nav.css'

type Props = {
  /** Which page we are on, so its link is marked. */
  current?: 'home' | 'updates'
  /** Home page: put the cursor in the address field instead of following the link. */
  onAnalyze?: () => void
  /** Live memo: links that lead back to the home page close the memo instead. */
  onLeave?: () => void
  /** Line the bar up with the narrower text column used outside the home page. */
  inWrap?: boolean
}

/** The site's top bar, from the Figma hero frame. Used on every page. */
export default function TopNav({ current, onAnalyze, onLeave, inWrap = false }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const sheetId = useId()
  const onHome = current === 'home'
  const to = (hash: string) => (onHome ? hash : `/${hash}`)

  const links = [
    { label: 'Home', href: '/', key: 'home', home: true },
    { label: 'Features', href: to('#how'), key: 'features', home: true, caret: true },
    { label: 'Updates', href: '/company', key: 'updates', home: false },
    { label: 'Why it exists', href: to('#about'), key: 'about', home: true },
  ]

  // Close the phone menu on Escape, on a tap outside it, and when the window gets wide.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const wide = window.matchMedia('(min-width: 1024px)')
    const onWide = () => wide.matches && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    wide.addEventListener('change', onWide)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
      wide.removeEventListener('change', onWide)
    }
  }, [open])

  const follow = (leadsHome: boolean) => (e: MouseEvent) => {
    setOpen(false)
    if (leadsHome && onLeave) {
      e.preventDefault()
      onLeave()
    }
  }
  const analyze = (e: MouseEvent) => {
    setOpen(false)
    if (onLeave) {
      e.preventDefault()
      onLeave()
    } else if (onAnalyze) {
      e.preventDefault()
      onAnalyze()
    }
  }

  return (
    <header ref={rootRef} className={`site-nav ${inWrap ? 'in-wrap' : ''}`}>
      <nav className="hero-nav" aria-label="Main">
        <Link href="/" className="hero-logo" translate="no" aria-label="InvestorPOV home" onClick={follow(true)}>
          <span>
            Investor<b>POV</b>
          </span>
        </Link>

        <div className="hero-menu">
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className={l.caret ? 'has-caret' : undefined}
              aria-current={current === l.key ? 'page' : undefined}
              onClick={follow(l.home)}
            >
              {l.label}
              {l.caret && <img src="/hero/icon-down.svg" alt="" width={20} height={20} />}
            </Link>
          ))}
        </div>

        <div className="nav-end">
          <Link href={to('#analyze')} className="hero-btn" onClick={analyze}>
            Analyze a startup
          </Link>
          <button
            type="button"
            className="nav-burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls={sheetId}
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        <div id={sheetId} className={`nav-sheet ${open ? 'is-open' : ''}`}>
          <ul>
            {links.map((l, i) => (
              <li key={l.key} style={{ ['--n' as string]: i }}>
                <Link href={l.href} aria-current={current === l.key ? 'page' : undefined} tabIndex={open ? undefined : -1} onClick={follow(l.home)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={to('#analyze')} className="hero-btn" tabIndex={open ? undefined : -1} onClick={analyze} style={{ ['--n' as string]: links.length }}>
            Analyze a startup
          </Link>
        </div>
      </nav>
    </header>
  )
}
