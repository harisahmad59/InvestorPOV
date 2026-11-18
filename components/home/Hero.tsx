'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { COMPANIES_DATA } from '@/lib/companies'
import { cleanDomain, isValidDomain, scoreOutOf100, verdictText } from '@/lib/memo'
import ScoreRing from '@/components/ScoreRing'
import TopNav from '@/components/TopNav'
import '@/app/hero.css'

const CHIPS = [
  { domain: 'cursor.com', icon: '/hero/chip-cursor.svg' },
  { domain: 'linkedin.com', icon: '/hero/chip-linkedin.svg' },
  { domain: 'nvidia.com', icon: '/hero/chip-nvidia.svg' },
  { domain: 'oracle.com', icon: '/hero/chip-oracle.svg' },
]

type Props = {
  error: string
  brutal: boolean
  onToggleBrutal: () => void
  onAnalyze: (domain: string) => void
  onClearError: () => void
}

/** Above-the-fold section, built from Figma frame 10:8609. */
export default function Hero({ error, brutal, onToggleBrutal, onAnalyze, onClearError }: Props) {
  const [value, setValue] = useState('')
  const [localError, setLocalError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const errorId = useId()
  const shownError = localError || error

  // "Analyze a startup" links point at #analyze: put the cursor in the field.
  useEffect(() => {
    const focusIfTargeted = () => {
      if (window.location.hash === '#analyze') inputRef.current?.focus()
    }
    focusIfTargeted()
    window.addEventListener('hashchange', focusIfTargeted)
    return () => window.removeEventListener('hashchange', focusIfTargeted)
  }, [])

  const submit = (raw: string) => {
    const domain = cleanDomain(raw)
    if (!isValidDomain(domain)) {
      setLocalError('Enter a company domain, like stripe.com.')
      inputRef.current?.focus()
      return
    }
    setLocalError('')
    onAnalyze(domain)
  }

  return (
    <section className="hero">
      <HeroArt />

      <div className="hero-inner">
        <TopNav current="home" onAnalyze={() => inputRef.current?.focus()} />

        <div className="hero-copy">
          <h1 className="hero-title">
            {/* 1440 design: two lines */}
            <span className="title-wide">
              <span className="enter-line" style={{ ['--i' as string]: 0 }}>
                Every startup, analyzed
              </span>
              <span className="enter-line accent" style={{ ['--i' as string]: 1 }}>
                like a VC would
              </span>
            </span>
            {/* Phone: three lines, breaking after "like a" */}
            <span className="title-narrow">
              <span className="enter-line" style={{ ['--i' as string]: 0 }}>
                Every startup,
              </span>
              <span className="enter-line" style={{ ['--i' as string]: 1 }}>
                analyzed <em>like a</em>
              </span>
              <span className="enter-line accent" style={{ ['--i' as string]: 2 }}>
                VC would
              </span>
            </span>
          </h1>
          <p className="hero-sub enter" style={{ ['--i' as string]: 4 }}>
            Paste any website URL and get a full VC style investment memo with scores,
            <br /> competitor analysis and a verdict in seconds.
          </p>
        </div>

        <form
          id="analyze"
          className="hero-form enter"
          style={{ ['--i' as string]: 6 }}
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            submit(value)
          }}
        >
          <div className={`hero-card ${shownError ? 'is-error' : ''}`}>
            <label htmlFor={inputId} className="sr-only">
              Website URL
            </label>
            <input
              ref={inputRef}
              id={inputId}
              className="hero-input"
              name="domain"
              type="text"
              inputMode="url"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Enter any website URL like stripe.com"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                if (shownError) {
                  setLocalError('')
                  onClearError()
                }
              }}
              aria-invalid={shownError ? true : undefined}
              aria-describedby={shownError ? errorId : undefined}
            />
            <div className="hero-actions">
              <button type="button" role="switch" aria-checked={brutal} onClick={onToggleBrutal} className="hero-brutal">
                <span className="label">
                  {brutal ? (
                    'Brutal Mode on'
                  ) : (
                    <>
                      <span className="wide">Try </span>Brutal Mode
                    </>
                  )}
                </span>
                <span className="knob" aria-hidden="true">
                  <img src="/hero/icon-flame.svg" alt="" width={15.833} height={15} />
                </span>
              </button>
              <button type="submit" className="hero-go">
                <span>
                  Analyze<span className="wide"> a startup</span>
                </span>
                <span className="knob" aria-hidden="true">
                  <img src="/hero/icon-arrow.svg" alt="" width={15.833} height={15} />
                </span>
              </button>
            </div>
          </div>
          {shownError && (
            <p id={errorId} role="alert" className="hero-error pop">
              {shownError}
            </p>
          )}

          <div className="hero-chips">
            <span className="lead">Try one of these</span>
            {CHIPS.map((c, i) => (
              <button key={c.domain} type="button" className={`hero-chip ${i > 1 ? 'wide-only' : ''}`} onClick={() => submit(c.domain)}>
                <img src={c.icon} alt="" width={16} height={16} />
                {c.domain}
              </button>
            ))}
          </div>
        </form>

        <HeroWindow />
      </div>
    </section>
  )
}

/** The lit, striped-glass background. Every layer comes from the Figma frame. */
function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="hero-blobs">
        <img src="/hero/bg-blobs.svg" alt="" />
      </div>
      <div className="hero-wash-linear" />
      <div className="hero-wash-radial" />
      <img className="hero-topfade" src="/hero/top-fade.png" alt="" />
      <div className="hero-stripes">
        {Array.from({ length: 24 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <img className="hero-lights" src="/hero/lights.webp" alt="" />
    </div>
  )
}

/** Browser window from the design, showing the real memo page for one company. */
function HeroWindow() {
  const memo = COMPANIES_DATA.cursor
  return (
    <div className="hero-window" aria-hidden="true">
      <div className="hero-window-mid">
        <div className="hero-window-box">
          <div className="win-bar">
            <span className="win-dots">
              <i style={{ background: '#e25454' }} />
              <i style={{ background: '#f2c94c' }} />
              <i style={{ background: '#00b473' }} />
            </span>
            <img className="win-icon hide-sm" style={{ left: 85.37 }} src="/hero/win-sidebar.svg" alt="" />
            <img className="win-icon hide-sm" style={{ left: 133.63 }} src="/hero/win-back.svg" alt="" />
            <img className="win-icon hide-sm" style={{ left: 167.04 }} src="/hero/win-forward.svg" alt="" />
            <img className="win-icon hide-sm" style={{ left: 200.44 }} src="/hero/win-reload.svg" alt="" />
            <span className="win-url">
              <img src="/hero/win-lock.svg" alt="" />
              <span>investorpov.com</span>
              <img src="/hero/win-link.svg" alt="" />
            </span>
            <img className="win-icon hide-sm" style={{ right: 52.39 }} src="/hero/win-download.svg" alt="" />
            <img className="win-icon" style={{ right: 18.98 }} src="/hero/win-plus.svg" alt="" />
          </div>
          <div className="win-body">
            <div className="win-page">
              <div className="win-memo">
                <ul className="win-memo-index">
                  <li className="on">Summary</li>
                  <li>Market</li>
                  <li>Competitors</li>
                  <li>SWOT</li>
                  <li>Risks</li>
                  <li>Growth levers</li>
                </ul>
                <div>
                  <div className="win-memo-head">
                    <div>
                      <p className="win-memo-kicker">Stored sample memo</p>
                      <p className="win-memo-name">{memo.name}</p>
                      <p className="win-memo-domain">cursor.com</p>
                    </div>
                    <ScoreRing value={scoreOutOf100(memo.score)} size={120} delay={1500} />
                  </div>
                  <div className="win-memo-verdict">
                    <small>Verdict</small>
                    <p>{verdictText(memo.verdict)}</p>
                  </div>
                  <p className="win-memo-summary">Summary</p>
                  <p className="win-memo-text">{memo.summary}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
