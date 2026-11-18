'use client'

import { useEffect, useRef } from 'react'

/** What holds a print to the board. */
type Fix = 'pin-red' | 'pin-green' | 'clip' | 'clip-right' | 'tape' | 'staple'

type Print = {
  id: string
  caption: string
  fix: Fix
  /** A real picture, or nothing yet: then the print shows what photo belongs there. */
  src?: string
  alt?: string
  wanted?: string
  /** 'hover' prints shift a little under the pointer; 'sway' swings gently by itself. */
  motion?: 'hover' | 'sway'
}

const PRINTS: Print[] = [
  { id: 'a', caption: 'Day one, on a phone', fix: 'pin-red', src: '/story/first-phone.webp', alt: 'The first version of InvestorPOV on a phone' },
  { id: 'b', caption: 'Faheem & Haris', fix: 'clip', wanted: 'Photo of the two of us', motion: 'hover' },
  { id: 'c', caption: 'What we submitted', fix: 'pin-green', src: '/story/first-version.webp', alt: 'The landing page as it was submitted at the hackathon' },
  { id: 'd', caption: 'Two v0 T-shirts', fix: 'tape', wanted: 'Photo of the T-shirts' },
  { id: 'e', caption: 'The first memo', fix: 'staple', src: '/story/first-memo.webp', alt: 'The first investment memo the tool produced', motion: 'hover' },
  { id: 'f', caption: 'Where it is now', fix: 'clip-right', src: '/story/now-phone.webp', alt: 'InvestorPOV today, on a phone', motion: 'sway' },
]

function Clip() {
  return (
    <svg viewBox="0 0 30 74" fill="none" aria-hidden="true">
      <path
        d="M21 20v34a8 8 0 0 1-16 0V14a11 11 0 0 1 22 0v42"
        stroke="#9a979c"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M21 20v34a8 8 0 0 1-16 0V14a11 11 0 0 1 22 0v42" stroke="#fff" strokeOpacity="0.55" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  )
}

/** A pinboard of prints from the hackathon, set into the story. */
export default function StoryBoard() {
  const ref = useRef<HTMLDivElement>(null)

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
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="board" role="group" aria-label="Pictures from the hackathon">
      {PRINTS.map((p, i) => (
        <figure key={p.id} className={`print print-${p.id} ${p.motion ?? ''}`} style={{ ['--i' as string]: i }}>
          <div className="print-card">
            <span className={`fix ${p.fix}`} aria-hidden="true">
              {(p.fix === 'clip' || p.fix === 'clip-right') && <Clip />}
            </span>
            <div className="print-photo">
              {p.src ? (
                <img src={p.src} alt={p.alt} loading="lazy" />
              ) : (
                <span className="print-wanted">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4z" />
                    <circle cx="12" cy="13" r="3.4" />
                  </svg>
                  {p.wanted}
                </span>
              )}
            </div>
            <figcaption>{p.caption}</figcaption>
          </div>
        </figure>
      ))}
    </div>
  )
}
