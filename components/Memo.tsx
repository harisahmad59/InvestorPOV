'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Check, Link2 } from 'lucide-react'
import type { AnalysisData } from '@/lib/companies'
import { displayDomain, scoreBand, scoreOutOf100, tamHeadline, verdictText } from '@/lib/memo'
import Reveal from '@/components/Reveal'
import ScoreRing from '@/components/ScoreRing'

const SECTIONS = [
  { id: 'summary', label: 'Summary' },
  { id: 'market', label: 'Market' },
  { id: 'competitors', label: 'Competitors' },
  { id: 'swot', label: 'SWOT' },
  { id: 'risks', label: 'Risks' },
  { id: 'growth', label: 'Growth levers' },
] as const

const SEVERITY: Record<string, string> = {
  High: 'var(--bad)',
  Medium: 'var(--caution)',
  Low: 'var(--good)',
}

type MemoProps = {
  data: AnalysisData
  /** "sample" is a stored memo with its own address; "live" was just drafted. */
  origin: 'sample' | 'live'
  /** Domain the visitor typed, for live memos. */
  domain?: string
  onClose?: () => void
}

export default function Memo({ data, origin, domain, onClose }: MemoProps) {
  const [active, setActive] = useState<string>('summary')
  const [copied, setCopied] = useState(false)

  const score = scoreOutOf100(data.score)
  const band = scoreBand(score)
  const site = displayDomain(data.website) || domain || ''
  const verdict = verdictText(data.verdict)
  const tamFigure = tamHeadline(data.tam)
  const tamIsSentence = !!data.tam && data.tam.trim().length > (tamFigure?.length ?? 0) + 6

  const swot = [
    { key: 'Strengths', items: data.swot?.strengths ?? [] },
    { key: 'Weaknesses', items: data.swot?.weaknesses ?? [] },
    { key: 'Opportunities', items: data.swot?.opportunities ?? [] },
    { key: 'Threats', items: data.swot?.threats ?? [] },
  ]
  const hasSwot = swot.some((q) => q.items.length > 0)
  const risks = data.risks ?? []
  const levers = data.growthLevers ?? []
  const competitors = data.competitors ?? []

  // Highlight the section currently being read.
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-25% 0px -60% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href.split('#')[0])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable: leave the button as it is */
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
        <div className="wrap flex h-[var(--nav-h)] items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              aria-label="InvestorPOV home"
              className="flex min-h-11 min-w-11 items-center justify-center gap-2 font-semibold tracking-tight sm:justify-start"
              translate="no"
            >
              <img src="/icon.png" alt="" width={24} height={24} className="h-6 w-6 shrink-0" />
              <span className="hidden sm:inline">InvestorPOV</span>
            </Link>
            <span className="text-line-strong" aria-hidden="true">
              /
            </span>
            <span className="truncate text-[0.9375rem] text-ink-2">{data.name}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {origin === 'sample' && (
              <button type="button" onClick={copyLink} className="btn btn-quiet" aria-live="polite">
                {copied ? <Check className="pop h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
                <span className="hidden sm:inline">{copied ? 'Link copied' : 'Copy link'}</span>
                <span className="sr-only sm:hidden">{copied ? 'Link copied' : 'Copy link'}</span>
              </button>
            )}
            {onClose ? (
              <button type="button" onClick={onClose} className="btn btn-primary">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                New analysis
              </button>
            ) : (
              <Link href="/#analyze" className="btn btn-primary">
                <span className="sm:hidden">Analyze</span>
                <span className="hidden sm:inline">Analyze a startup</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Section index, phone and tablet ─────────────────────────────── */}
      <nav
        aria-label="Memo sections"
        className="no-scrollbar sticky top-[var(--nav-h)] z-30 overflow-x-auto border-b bg-background/90 backdrop-blur-md lg:hidden"
        style={{ maskImage: 'linear-gradient(to right, #000 calc(100% - 40px), transparent)' }}
      >
        <ul className="flex w-max gap-1 px-3 pr-10">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? 'true' : undefined}
                className={`flex min-h-11 items-center whitespace-nowrap border-b-2 px-3 text-[0.9375rem] transition-colors ${
                  active === s.id ? 'border-accent font-medium text-foreground' : 'border-transparent text-muted-foreground'
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="wrap grid gap-x-16 pb-28 pt-10 sm:pt-16 lg:grid-cols-[11rem_minmax(0,46rem)] lg:justify-center">
        {/* ── Section index, desktop ───────────────────────────────────── */}
        <nav aria-label="Memo sections" className="hidden lg:block">
          <ul className="sticky top-[calc(var(--nav-h)+4rem)] space-y-1 border-l">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={active === s.id ? 'true' : undefined}
                  className={`-ml-px flex min-h-11 items-center border-l-2 pl-4 text-[0.9375rem] transition-[color,border-color,padding] duration-300 ${
                    active === s.id
                      ? 'border-accent pl-5 font-medium text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <article id="content" className="min-w-0">
          {/* ── Header ─────────────────────────────────────────────────── */}
          <header className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="enter t-label" style={{ ['--i' as string]: 0 }}>
                {origin === 'sample' ? 'Stored sample memo' : 'First-read memo'}
              </p>
              <h1 className="t-display mt-3">
                <span className="enter-line" style={{ ['--i' as string]: 0 }}>
                  {data.name}
                </span>
              </h1>
              {site && (
                <p className="enter mt-4" style={{ ['--i' as string]: 3 }}>
                  <a
                    href={data.website || `https://${site}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 text-accent-ink"
                  >
                    <span className="link">{site}</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </p>
              )}
            </div>
            <div className="enter flex items-center gap-4 sm:flex-col sm:items-end sm:gap-3" style={{ ['--i' as string]: 4 }}>
              <ScoreRing value={score} delay={500} />
              <p className="text-[0.9375rem] font-medium" style={{ color: `var(--${band.tone})` }}>
                {band.label}
              </p>
            </div>
          </header>

          {/* ── Verdict ────────────────────────────────────────────────── */}
          {verdict && (
            <div className="enter mt-10 rounded-lg bg-foreground p-6 text-background sm:p-8" style={{ ['--i' as string]: 6 }}>
              <h2 className="text-[0.8125rem] font-medium text-background/70">Verdict</h2>
              <p className="mt-3 text-[1.25rem] font-medium leading-[1.4] tracking-[-0.015em] sm:text-[1.5rem]">{verdict}</p>
            </div>
          )}

          {/* ── Summary ────────────────────────────────────────────────── */}
          <Section id="summary" title="Summary">
            <p className="t-lead">{data.summary || 'No summary was returned.'}</p>
            {data.businessModel && data.businessModel !== 'Not available' && (
              <Reveal className="mt-8 border-t pt-6">
                <h3 className="t-h3">How it makes money</h3>
                <p className="t-body mt-2">{data.businessModel}</p>
              </Reveal>
            )}
          </Section>

          {/* ── Market ─────────────────────────────────────────────────── */}
          <Section id="market" title="Market">
            <p className="t-body">{data.market || 'No market description was returned.'}</p>
            {data.tam && (
              <Reveal className="mt-8 grid gap-6 border-t pt-6 sm:grid-cols-[auto_1fr] sm:gap-10">
                {tamFigure && (
                  <div>
                    <p className="t-label">Market size, as stated in the memo</p>
                    <p className="tnum mt-2 text-[2.5rem] font-semibold leading-none tracking-[-0.03em] sm:text-[3rem]">{tamFigure}</p>
                  </div>
                )}
                {(tamIsSentence || !tamFigure) && <p className="t-body self-end">{data.tam}</p>}
              </Reveal>
            )}
          </Section>

          {/* ── Competitors ────────────────────────────────────────────── */}
          <Section id="competitors" title="Competitors">
            {competitors.length > 0 ? (
              <ol className="border-t">
                {competitors.map((c, i) => (
                  <Reveal as="li" key={`${c}-${i}`} i={i} className="flex items-baseline gap-5 border-b py-4">
                    <span className="tnum w-6 shrink-0 text-[0.875rem] text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[1.125rem] font-medium tracking-[-0.01em]">{c}</span>
                  </Reveal>
                ))}
              </ol>
            ) : (
              <Empty>No competitors were named.</Empty>
            )}
          </Section>

          {/* ── SWOT ───────────────────────────────────────────────────── */}
          <Section id="swot" title="SWOT">
            {hasSwot ? (
              <div className="grid overflow-hidden rounded-lg border sm:grid-cols-2">
                {swot.map((q, qi) => (
                  <Reveal
                    key={q.key}
                    i={qi}
                    className={`bg-card p-6 ${qi > 0 ? 'border-t' : ''} ${qi === 1 ? 'sm:border-t-0' : ''} ${qi % 2 === 1 ? 'sm:border-l' : ''}`}
                  >
                    <h3 className="t-h3">{q.key}</h3>
                    {q.items.length > 0 ? (
                      <ul className="mt-4 space-y-3">
                        {q.items.map((item, i) => (
                          <li key={i} className="t-body flex gap-3">
                            <span className="mt-[0.7em] h-1 w-3 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="t-small mt-4">None listed.</p>
                    )}
                  </Reveal>
                ))}
              </div>
            ) : (
              <Empty>No SWOT was returned.</Empty>
            )}
          </Section>

          {/* ── Risks ──────────────────────────────────────────────────── */}
          <Section id="risks" title="Risks">
            {risks.length > 0 ? (
              <ul className="border-t">
                {risks.map((r, i) => (
                  <Reveal as="li" key={i} i={i} className="grid gap-x-10 gap-y-3 border-b py-6 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                    <div>
                      <p className="flex items-center gap-2 text-[0.875rem] font-medium" style={{ color: SEVERITY[r.severity] }}>
                        <span className="h-2 w-2 rounded-full" style={{ background: SEVERITY[r.severity] }} aria-hidden="true" />
                        {r.severity} severity
                      </p>
                      <h3 className="t-h3 mt-2">{r.risk}</h3>
                    </div>
                    <div>
                      <p className="t-label">Suggested response</p>
                      <p className="t-body mt-2">{r.mitigation}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            ) : (
              <Empty>No risks were returned.</Empty>
            )}
          </Section>

          {/* ── Growth levers ──────────────────────────────────────────── */}
          <Section id="growth" title="Growth levers">
            {levers.length > 0 ? (
              <ol className="border-t">
                {levers.map((g, i) => (
                  <Reveal as="li" key={i} i={i} className="flex items-baseline gap-5 border-b py-4">
                    <span className="tnum w-6 shrink-0 text-[0.875rem] text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                    <span className="t-body text-foreground">{g}</span>
                  </Reveal>
                ))}
              </ol>
            ) : (
              <Empty>No growth levers were returned.</Empty>
            )}
          </Section>

          {/* ── How this was made ──────────────────────────────────────── */}
          <Reveal as="footer" className="mt-20 rounded-lg bg-secondary p-6 sm:p-8">
            <h2 className="t-h3">How this memo was made</h2>
            <p className="t-body mt-2">
              {origin === 'sample'
                ? 'This is a stored sample, written in advance and not refreshed. Facts in it may be out of date.'
                : `Drafted in one pass by Gemini from the text of ${site || 'the company'}'s homepage. It has no access to funding, revenue or team data unless the homepage states it, and it can be wrong.`}{' '}
              Treat it as a first read. It is not investment advice.
            </p>
          </Reveal>
        </article>
      </div>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-20">
      <Reveal as="h2" className="t-h2 mb-6">
        {title}
      </Reveal>
      {children}
    </section>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="t-body rounded-lg border border-dashed p-6 text-muted-foreground">{children}</p>
}
