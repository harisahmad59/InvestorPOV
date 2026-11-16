'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import type { AnalysisData } from '@/lib/companies'
import { COMPANIES_DATA } from '@/lib/companies'
import { scoreOutOf100, storedSlugForDomain, verdictText } from '@/lib/memo'
import Memo from '@/components/Memo'
import Reveal from '@/components/Reveal'
import SiteFooter from '@/components/SiteFooter'
import { useTypingLoop } from '@/components/home/AnalyzeForm'
import Hero from '@/components/home/Hero'
import Loader from '@/components/home/Loader'

const GENERIC_ERROR = 'The analysis could not be completed. Please try again in a moment.'

export default function Home() {
  const router = useRouter()
  const [brutal, setBrutal] = useState(false)
  const [error, setError] = useState('')
  const [loadingDomain, setLoadingDomain] = useState<string | null>(null)
  const [result, setResult] = useState<{ data: AnalysisData; domain: string } | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const analyze = useCallback(
    async (domain: string) => {
      setError('')

      // Stored memos have their own address. Brutal mode asks for a fresh draft.
      const slug = storedSlugForDomain(domain)
      if (slug && !brutal) {
        router.push(`/company/${slug}`)
        return
      }

      const controller = new AbortController()
      abortRef.current = controller
      setLoadingDomain(domain)
      window.scrollTo(0, 0)

      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startup: domain, mode: brutal ? 'brutal' : 'normal' }),
          signal: controller.signal,
        })
        const data = await res.json().catch(() => null)

        if (!res.ok || !data || !data.name || typeof data.score !== 'number') {
          setError((data && typeof data.error === 'string' && data.error) || GENERIC_ERROR)
          return
        }
        setResult({ data: data as AnalysisData, domain })
        // Give the memo a history entry so the Back button returns to the form.
        window.history.pushState({ memo: true }, '', '#memo')
        window.scrollTo(0, 0)
      } catch (err) {
        if ((err as Error)?.name !== 'AbortError') {
          setError('Could not reach the server. Check your connection and try again.')
        }
      } finally {
        setLoadingDomain(null)
        abortRef.current = null
      }
    },
    [brutal, router]
  )

  // Back button closes a live memo.
  useEffect(() => {
    const onPop = () => {
      if (!window.history.state?.memo) setResult(null)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const closeMemo = () => {
    if (window.history.state?.memo) window.history.back()
    else setResult(null)
  }

  if (result) return <Memo data={result.data} origin="live" domain={result.domain} onClose={closeMemo} />
  if (loadingDomain) return <Loader domain={loadingDomain} onCancel={() => abortRef.current?.abort()} />

  return (
    <>
      <main id="content">
        <Hero
          error={error}
          brutal={brutal}
          onToggleBrutal={() => setBrutal((b) => !b)}
          onAnalyze={analyze}
          onClearError={() => setError('')}
        />
        <HowItWorks />
        <Example />
        <About />
        <Closing />
      </main>
      <SiteFooter onHome />
    </>
  )
}

/* ── How it works ───────────────────────────────────────────────────────── */

const READS = ['Title', 'Description', 'Headings', 'Paragraphs', 'Lists']
const WRITES = ['Summary', 'Market', 'Competitors', 'SWOT', 'Risks', 'Growth levers']

function HowItWorks() {
  const typed = useTypingLoop(['stripe.com', 'linear.app', 'notion.so'])
  return (
    <section id="how" className="screen border-t">
      <div className="wrap">
        <Reveal as="h2" className="t-h2 max-w-[16ch]">
          From a domain to a memo, in one pass.
        </Reveal>

        <Reveal variant="line" className="mt-14 hidden h-px bg-foreground md:block" />

        <ol className="mt-10 grid gap-12 md:mt-0 md:grid-cols-3 md:gap-10">
          <Reveal as="li" i={1} className="md:pt-8">
            <span className="tnum t-label">1</span>
            <h3 className="t-h3 mt-3">You enter a domain</h3>
            <p className="t-body mt-2">No account and no form to fill in. Just the address of the company&rsquo;s site.</p>
            <div className="sheet mt-6 flex h-12 items-center px-4 text-[0.9375rem] text-ink-2" aria-hidden="true">
              {typed}
              <span className="caret" />
            </div>
          </Reveal>

          <Reveal as="li" i={2} className="md:pt-8">
            <span className="tnum t-label">2</span>
            <h3 className="t-h3 mt-3">It reads the homepage</h3>
            <p className="t-body mt-2">The server fetches that one page and keeps its text: the first 3,000 characters, nothing else.</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="What is read">
              {READS.map((r) => (
                <li key={r} className="rounded-full border bg-card px-3 py-1.5 text-[0.875rem] text-ink-2">
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="li" i={3} className="md:pt-8">
            <span className="tnum t-label">3</span>
            <h3 className="t-h3 mt-3">Gemini drafts the memo</h3>
            <p className="t-body mt-2">One request to Google&rsquo;s Gemini model turns that text into six sections and a score.</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.875rem] text-ink-2" aria-label="What is written">
              {WRITES.map((w) => (
                <li key={w} className="flex items-center gap-2">
                  <span className="h-1 w-3 rounded-full bg-accent" aria-hidden="true" />
                  {w}
                </li>
              ))}
            </ul>
          </Reveal>
        </ol>
      </div>
    </section>
  )
}

/* ── Example: real content from a stored memo ───────────────────────────── */

function Example() {
  const memo = COMPANIES_DATA.perplexity
  const risk = memo.risks?.[0]
  const total = Object.keys(COMPANIES_DATA).length
  return (
    <section id="example" className="screen border-t bg-secondary">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal as="h2" className="t-h2 max-w-[14ch]">
            What a memo contains.
          </Reveal>
          <Reveal as="p" i={1} className="t-lead max-w-md">
            Six sections on one page. These are excerpts from the stored memo for {memo.name}.
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <Reveal i={1} className="rounded-lg bg-foreground p-7 text-background lg:col-span-7">
            <div className="flex items-start justify-between gap-6">
              <p className="text-[0.8125rem] font-medium text-background/70">Verdict</p>
              <p className="tnum text-[0.9375rem] font-medium text-background/70">{scoreOutOf100(memo.score)} of 100</p>
            </div>
            <p className="mt-4 text-[1.25rem] font-medium leading-[1.4] tracking-[-0.015em] sm:text-[1.5rem]">{verdictText(memo.verdict)}</p>
          </Reveal>

          {risk && (
            <Reveal i={2} className="sheet p-7 lg:col-span-5">
              <p className="flex items-center gap-2 text-[0.875rem] font-medium text-bad">
                <span className="h-2 w-2 rounded-full bg-bad" aria-hidden="true" />
                {risk.severity} severity risk
              </p>
              <h3 className="t-h3 mt-2">{risk.risk}</h3>
              <p className="t-label mt-5">Suggested response</p>
              <p className="t-body mt-1.5">{risk.mitigation}</p>
            </Reveal>
          )}

          <Reveal i={3} className="sheet grid overflow-hidden sm:grid-cols-2 lg:col-span-12">
            <div className="p-7">
              <h3 className="t-h3">Strengths</h3>
              <ul className="mt-4 space-y-3">
                {memo.swot?.strengths.slice(0, 3).map((s) => (
                  <li key={s} className="t-body flex gap-3">
                    <span className="mt-[0.7em] h-1 w-3 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t p-7 sm:border-l sm:border-t-0">
              <h3 className="t-h3">Threats</h3>
              <ul className="mt-4 space-y-3">
                {memo.swot?.threats.slice(0, 3).map((s) => (
                  <li key={s} className="t-body flex gap-3">
                    <span className="mt-[0.7em] h-1 w-3 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal i={4} className="mt-8 flex flex-wrap gap-3">
          <Link href="/company/perplexity" className="btn btn-primary">
            Open this memo
            <ArrowRight className="arrow h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/company" className="btn btn-quiet">
            Browse all {total} stored memos
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

/* ── About: what it is and what it is not ───────────────────────────────── */

const DOES = [
  'Gives a structured first read from a single input.',
  'Asks the same six questions of every company.',
  'Works without an account.',
]
const DOES_NOT = [
  'Read anything beyond the homepage.',
  'Know funding, revenue or team details unless the homepage states them.',
  'Replace diligence. It is not investment advice.',
]

function About() {
  return (
    <section id="about" className="screen border-t">
      <div className="wrap grid gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal as="h2" className="t-h2">
            A first read, not a decision.
          </Reveal>
          <Reveal as="p" i={1} className="t-lead mt-6">
            InvestorPOV was built in 48 hours at Cursor Hackathon Kashmir, held at NIT Srinagar in March 2026. It was selected by the Round 1 jury and
            won the v0 by Vercel track for UI design.
          </Reveal>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7">
          <Reveal i={2}>
            <h3 className="t-h3 border-b border-foreground pb-3">What it does</h3>
            <ul>
              {DOES.map((d) => (
                <li key={d} className="t-body border-b py-4">
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal i={3}>
            <h3 className="t-h3 border-b border-foreground pb-3">What it does not do</h3>
            <ul>
              {DOES_NOT.map((d) => (
                <li key={d} className="t-body border-b py-4">
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ── Closing ────────────────────────────────────────────────────────────── */

function Closing() {
  return (
    <section className="border-t bg-foreground text-background">
      <div className="wrap flex flex-col items-start gap-8 py-24 md:flex-row md:items-end md:justify-between md:py-32">
        <Reveal as="h2" className="t-display max-w-[13ch]">
          Try it on a company you know.
        </Reveal>
        <Reveal i={1} className="flex flex-wrap gap-3">
          <a href="#analyze" className="btn bg-background text-foreground hover:bg-accent">
            Analyze a startup
            <ArrowRight className="arrow h-4 w-4" aria-hidden="true" />
          </a>
          <Link href="/company" className="btn border border-background/30 text-background hover:border-background">
            Browse stored memos
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
