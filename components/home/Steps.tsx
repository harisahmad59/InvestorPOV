'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { COMPANIES_DATA } from '@/lib/companies'
import { scoreOutOf100 } from '@/lib/memo'
import ScoreRing from '@/components/ScoreRing'
import { useTypingLoop } from '@/components/home/AnalyzeForm'
import '@/app/steps.css'

const READS = ['Title', 'Description', 'Headings', 'Paragraphs', 'Lists']
const WRITES = ['Summary', 'Market', 'Competitors', 'SWOT', 'Risks', 'Growth levers']

/** Adds "is-in" the first time the element is on screen. */
function useInView<T extends HTMLElement>(threshold: number) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return ref
}

function Arrow() {
  return (
    <svg className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Check() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 5.2 4.2 7.4 8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** One card. The list item stays put (it is what we watch); the card inside it moves. */
function Step({ media, title, text, link }: { media: ReactNode; title: string; text: string; link: ReactNode }) {
  const ref = useInView<HTMLLIElement>(0.3)
  return (
    <li ref={ref} className="step">
      <div className="step-card">
        <div className="step-media" aria-hidden="true">
          {media}
        </div>
        <div className="step-body">
          <h3>{title}</h3>
          <p>{text}</p>
          {link}
        </div>
      </div>
    </li>
  )
}

/** "How it works": three cards dealt from a deck, each showing its step. */
export default function Steps() {
  const head = useInView<HTMLDivElement>(0.6)
  const typed = useTypingLoop(['cursor.com', 'nvidia.com', 'perplexity.ai'])
  const memo = COMPANIES_DATA.cursor

  return (
    <section id="how" className="steps">
      <div className="steps-inner">
        <div ref={head} className="steps-head">
          <h2>
            <span className="line">
              <span>From a domain to a memo</span>
            </span>
            <span className="line soft">
              <span>in one pass</span>
            </span>
          </h2>
          <p>
            Type a company&rsquo;s web address and InvestorPOV does the rest. It reads the homepage and has Gemini write a six-section investment
            memo with a score.
          </p>
        </div>

        <ol className="steps-deck">
          <Step
            title="Enter a domain"
            text="No account and no form to fill in. Just the address of the company’s site."
            link={
              <a href="#analyze" className="step-link">
                Try it now <Arrow />
              </a>
            }
            media={
              <div className="m m-sheet m-url">
                <p className="m-label">Website URL</p>
                <div className="m-field">
                  <span>
                    {typed}
                    <i className="caret" />
                  </span>
                  <span className="m-go">
                    <Arrow />
                  </span>
                </div>
                <p className="m-label m-label-2">Try one of these</p>
                <div className="m-chips">
                  <span>
                    <img src="/hero/chip-cursor.svg" alt="" width={14} height={14} />
                    cursor.com
                  </span>
                  <span>
                    <img src="/hero/chip-nvidia.svg" alt="" width={14} height={14} />
                    nvidia.com
                  </span>
                </div>
              </div>
            }
          />

          <Step
            title="It reads the homepage"
            text="The server fetches that one page and keeps its text: the first 3,000 characters, nothing else."
            link={
              <a href="#about" className="step-link">
                What it can&rsquo;t see <Arrow />
              </a>
            }
            media={
              <>
                <div className="m m-sheet m-page">
                  <div className="m-pagebar">
                    <i />
                    <i />
                    <i />
                    <span>cursor.com</span>
                  </div>
                  <div className="m-lines">
                    <b className="title" />
                    <b style={{ width: '92%' }} />
                    <b style={{ width: '74%' }} />
                    <b className="head" />
                    <b style={{ width: '88%' }} />
                    <b style={{ width: '96%' }} />
                    <b style={{ width: '58%' }} />
                    <b className="head" style={{ width: '38%' }} />
                    <b style={{ width: '80%' }} />
                    <b style={{ width: '66%' }} />
                  </div>
                  <span className="m-scan" />
                </div>
                <div className="m m-dark" style={{ ['--d' as string]: '0.25s' }}>
                  <p>Kept as text</p>
                  <ul>
                    {READS.map((r, i) => (
                      <li key={r} style={{ ['--n' as string]: i }}>
                        <span className="tick">
                          <Check />
                        </span>
                        {r}
                      </li>
                    ))}
                  </ul>
                  <p className="m-count">First 3,000 characters</p>
                </div>
              </>
            }
          />

          <Step
            title="Gemini drafts the memo"
            text="One request to Google’s Gemini model turns that text into six sections and a score."
            link={
              <Link href="/company/cursor" className="step-link">
                Open a sample memo <Arrow />
              </Link>
            }
            media={
              <>
                <div className="m m-sheet m-memo">
                  <div className="m-memo-head">
                    <div>
                      <p className="m-label">Investment memo</p>
                      <p className="m-name">{memo.name}</p>
                      <p className="m-domain">cursor.com</p>
                    </div>
                    <ScoreRing value={scoreOutOf100(memo.score)} size={88} delay={1500} />
                  </div>
                  <ul className="m-sections">
                    {WRITES.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
                <div className="m-pill">
                  <span className="tick">
                    <Check />
                  </span>
                  Memo ready
                </div>
              </>
            }
          />
        </ol>
      </div>
    </section>
  )
}
