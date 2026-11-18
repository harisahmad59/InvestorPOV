'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import type { AnalysisData } from '@/lib/companies'
import { storedSlugForDomain } from '@/lib/memo'
import Memo from '@/components/Memo'
import Reveal from '@/components/Reveal'
import SiteFooter from '@/components/SiteFooter'
import Bento from '@/components/home/Bento'
import Hero from '@/components/home/Hero'
import Loader from '@/components/home/Loader'
import Steps from '@/components/home/Steps'
import Story from '@/components/home/Story'

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
        <Steps />
        <Bento />
        <Story preview />
        <Closing />
      </main>
      <SiteFooter onHome />
    </>
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
