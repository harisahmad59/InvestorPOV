'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Gauge, Globe, Swords, TriangleAlert, TrendingUp } from 'lucide-react'
import { COMPANIES_DATA } from '@/lib/companies'
import { scoreOutOf100, tamHeadline, verdictText } from '@/lib/memo'
import { useInView } from '@/components/home/Steps'
import '@/app/bento.css'

function Arrow() {
  return (
    <svg className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const MARKS: Record<string, ReactNode> = {
  good: <path d="M3 6.3 5.2 8.5 9 4.2" />,
  bad: <path d="M6 3v3.6M6 8.9v.1" />,
  open: <path d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4" />,
}

/** A small card: title, short description, and three real lines from the memo. */
function Swot({ kind, title, text, items, i }: { kind: 'good' | 'bad' | 'open'; title: string; text: string; items: string[]; i: number }) {
  return (
    <article className={`b-card b-swot b-${kind}`} style={{ ['--i' as string]: i }}>
      <span className="b-grid" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{text}</p>
      <ul className="b-slips">
        {items.slice(0, 3).map((item, n) => (
          <li key={item} style={{ ['--n' as string]: n }}>
            <span className="mark" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                {MARKS[kind]}
              </svg>
            </span>
            {item}
          </li>
        ))}
      </ul>
    </article>
  )
}

/** "What a memo contains": a bento of real excerpts from one stored memo. */
export default function Bento() {
  const head = useInView<HTMLDivElement>(0.6)
  const rowA = useInView<HTMLDivElement>(0.25)
  const rowB = useInView<HTMLDivElement>(0.2)

  const memo = COMPANIES_DATA.perplexity
  const total = Object.keys(COMPANIES_DATA).length
  const tam = tamHeadline(memo.tam)
  const chips: { icon: ReactNode; label: string }[] = [
    { icon: <Gauge />, label: `Score ${scoreOutOf100(memo.score)} of 100` },
    ...(tam ? [{ icon: <Globe />, label: `${tam} market` }] : []),
    { icon: <Swords />, label: `${memo.competitors?.length ?? 0} competitors` },
    { icon: <TriangleAlert />, label: `${memo.risks?.length ?? 0} risks flagged` },
    { icon: <TrendingUp />, label: `${memo.growthLevers?.length ?? 0} growth levers` },
  ]

  return (
    <section id="example" className="bento">
      <div className="bento-inner">
        <div ref={head} className="steps-head">
          <h2>
            <span className="line">
              <span>What a memo contains</span>
            </span>
            <span className="line soft">
              <span>six sections on one page</span>
            </span>
          </h2>
          <p>
            Every memo answers the same questions in the same order. These are real excerpts from the stored memo for {memo.name}.
          </p>
        </div>

        <div ref={rowA} className="bento-row bento-row-a">
          <article className="b-card b-verdict" style={{ ['--i' as string]: 0 }}>
            <div className="b-folder" aria-hidden="true">
              <span className="back" />
              <span className="page p1" />
              <span className="page p2">
                <b />
                <b />
                <b />
              </span>
              <span className="front" />
            </div>
            <h3>The verdict</h3>
            <p>{verdictText(memo.verdict)}</p>
            <ul className="b-chips">
              {chips.map((c) => (
                <li key={c.label}>
                  {c.icon}
                  {c.label}
                </li>
              ))}
            </ul>
            <div className="b-links">
              <Link href="/company/perplexity" className="step-link">
                Open this memo <Arrow />
              </Link>
              <Link href="/company" className="step-link quiet">
                Browse all {total} stored memos
              </Link>
            </div>
          </article>

          <div className="b-card b-image" style={{ ['--i' as string]: 1 }}>
            <img className="b-phone" src="/home/memo-phone.webp" alt="InvestorPOV open on a phone" width={520} height={385} loading="lazy" />
          </div>
        </div>

        <div ref={rowB} className="bento-row bento-row-b">
          <Swot
            i={0}
            kind="good"
            title="Strengths"
            text="What the company already does well, taken from how it describes itself."
            items={memo.swot?.strengths ?? []}
          />
          <Swot
            i={1}
            kind="bad"
            title="Threats"
            text="Outside forces that could hurt it: rivals, platform shifts and regulation."
            items={memo.swot?.threats ?? []}
          />
          <Swot
            i={2}
            kind="open"
            title="Opportunities"
            text="Openings it could still take, from new customers to new product lines."
            items={memo.swot?.opportunities ?? []}
          />
        </div>
      </div>
    </section>
  )
}
