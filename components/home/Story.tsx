'use client'

import { Fragment, useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import StoryBoard from '@/components/home/StoryBoard'
import CurvedLensCarousel, { type LensSlide } from '@/components/ui/curved-lens-carousel'
import '@/app/story.css'

/* ── Content ─────────────────────────────────────────────────────────────────
   The story is a list of paragraphs. Each paragraph is a list of chunks, and a
   chunk lights up as one piece. A chunk is made of plain text and small inline
   pieces (a profile circle, the jury logo, and so on). */

type Piece =
  | { a: 'avatar'; name: string; role: string; tone: 'dark' | 'accent' }
  | { a: 'clock' }
  | { a: 'list' }
  | { a: 'v0' }
  | { mark: string }
  | { sign: string }
type Part = string | Piece

const FAHEEM: Piece = { a: 'avatar', name: 'Faheem', role: 'Design', tone: 'accent' }
const HARIS: Piece = { a: 'avatar', name: 'Haris', role: 'Engineering', tone: 'dark' }

const STORY: Part[][][] = [
  [['In March 2026, this tool won Best UI design at Cursor’s first hackathon in India,'], ['at NIT Srinagar.']],
  [['It was built in one night by two people:'], ['me,', FAHEEM, 'Faheem,'], ['and', HARIS, 'Haris.']],
  [
    ['It started when Haris sent me a link to the hackathon.'],
    ['I’m a designer, and I thought hackathons were only for developers,'],
    ['so I wasn’t interested.'],
    ['Haris said we had nothing to lose.'],
    ['So I registered.'],
  ],
  [
    ['The brief was simple:'],
    ['build something meaningful with tools from the sponsors.'],
    ['Cursor, Convex, OpenAI, Mobbin, Apify, Exa and v0 by Vercel.'],
  ],
  [
    ['It was my first hackathon and his second.'],
    ['When the day came, we reached the venue and saw who we were up against.'],
    ['350+ people in 85+ teams, some flying in for it.'],
  ],
  [
    ['And if that wasn’t enough, the first-round jury was'],
    ['Adarsh Mittal from NVIDIA,'],
    ['Arun Anbumani from Oracle,'],
    ['Syam Dondapati from AIG,'],
    ['Srilakshmi Bharadwaj from LinkedIn'],
    ['and Ravindra Kadiyala from Dell EMC.'],
  ],
  [
    ['We had 24 hours', { a: 'clock' }],
    ['and spent the first twelve on the idea alone.'],
    ['We kept throwing ideas out until one line was left:'],
    ['in a gold rush, sell shovels.'],
  ],
  [
    ['Everyone in that hall was building a tool.'],
    ['Most of them would end up in a GitHub repo or a forgotten folder.'],
    ['So why not build the one that tells you whether an idea is worth pursuing?'],
  ],
  [
    ['Once we were happy with the idea, we finally opened v0.'],
    ['The first screen it gave us looked like AI slop.'],
    ['Nah, this can’t be it.'],
  ],
  [
    ['So I took charge.'],
    ['I fed it references and creative direction, and described the style I wanted,'],
    ['until we had something we would use ourselves.'],
    ['Five hours later, we submitted.'],
  ],
  [['Looking at the size of the room and the jury,'], ['we didn’t expect to be shortlisted, let alone noticed.']],
  [
    ['At 10 the next morning the top 15 were announced,'],
    [{ mark: 'and InvestorPOV was on the list.' }, { a: 'list' }],
    ['We were thrilled.'],
    ['We had about an hour to make a presentation, so we made one and presented it.'],
  ],
  [['We didn’t make the top five.'], ['But we won Best UI design, in the', { a: 'v0' }, 'track.']],
  [['The site you’re on is what we did next.']],
  [['“Take your chances.'], ['You never know what’s on the other side.”'], [{ sign: 'Faheem and Haris' }]],
]

/**
 * Pictures for the home page carousel: four photos from the hackathon, with
 * three screenshots standing in until the remaining photos arrive.
 */
const REEL: LensSlide[] = [
  { image: '/story/reel/pitch.webp', alt: 'InvestorPOV on the big screen during the presentation' },
  { image: '/story/reel/desk.webp', alt: 'Two participants working side by side on laptops in the lecture hall' },
  { image: '/story/reel/01.webp', alt: 'The first version of InvestorPOV, built at the hackathon' },
  { image: '/story/reel/hall.webp', alt: 'The opening session, a full hall facing the Cursor screen' },
  { image: '/story/reel/02.webp', alt: 'The first memo the tool produced, for Cursor' },
  { image: '/story/reel/laptops.webp', alt: 'Rows of participants building on their laptops' },
  { image: '/story/reel/05.webp', alt: 'InvestorPOV today, on a phone' },
]

/** The home page stops after this many paragraphs ("So I registered.") and hands over to /story. */
const PREVIEW = 3

/** The words of one paragraph, without its inline pieces. */
function plain(para: Part[][]): string {
  return para
    .flat()
    .filter((part): part is string => typeof part === 'string')
    .join(' ')
}

/* ── Inline pieces ───────────────────────────────────────────────────────── */

function Piece({ part, c }: { part: Piece; c: number }) {
  if ('mark' in part) {
    return (
      <span data-c={c} className="s-mark">
        {part.mark.split(' ').map((word, k) => (
          <Fragment key={k}>
            <span data-c={c} className="w">
              {word}
            </span>{' '}
          </Fragment>
        ))}
      </span>
    )
  }
  if ('sign' in part) {
    return (
      <span data-c={c} className="s-sign w">
        {part.sign}
      </span>
    )
  }
  switch (part.a) {
    case 'avatar':
      // Initials for now; swap the letter for a photo when there is one.
      return (
        <span data-c={c} className={`s-asset s-avatar ${part.tone}`}>
          <i aria-hidden="true">{part.name.charAt(0)}</i>
          <span className="tip">
            {part.name} <em>|</em> <small>{part.role}</small>
          </span>
        </span>
      )
    case 'clock':
      return <span data-c={c} className="s-asset s-clock" aria-hidden="true" />
    case 'list':
      return (
        <span data-c={c} className="s-asset s-list" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )
    case 'v0':
      return (
        <span data-c={c} className="s-asset s-v0">
          <span className="tri" aria-hidden="true" />
          v0 by Vercel
          <span className="bits" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        </span>
      )
  }
}

/* ── Section ─────────────────────────────────────────────────────────────── */

/**
 * Grey text that turns black a chunk at a time as you scroll.
 * `preview` is the home page version: it stops after the jury and links to the full page.
 */
export default function Story({ preview = false }: { preview?: boolean }) {
  const textRef = useRef<HTMLDivElement>(null)
  const paras = preview ? STORY.slice(0, PREVIEW) : STORY

  useEffect(() => {
    const root = textRef.current
    if (!root) return

    // Group every element by its chunk.
    const groups: HTMLElement[][] = []
    root.querySelectorAll<HTMLElement>('[data-c]').forEach((el) => {
      const c = Number(el.dataset.c)
      ;(groups[c] ||= []).push(el)
    })
    const lit: boolean[] = groups.map(() => false)
    let frame = 0

    const paint = () => {
      frame = 0
      const box = root.getBoundingClientRect()
      const line = parseFloat(getComputedStyle(root).lineHeight) || 60
      // A reading line 70% down the screen. A chunk lights when that line reaches
      // it; chunks further along the same row light a little later, in order.
      const trigger = window.innerHeight * 0.7
      for (let c = 0; c < groups.length; c++) {
        const r = groups[c][0].getBoundingClientRect()
        const along = Math.min(1, Math.max(0, (r.left - box.left) / box.width))
        const on = r.top + along * line < trigger
        if (on !== lit[c]) {
          lit[c] = on
          for (const el of groups[c]) el.classList.toggle('on', on)
        }
      }
      // The "keep reading" button arrives once the last chunk has lit.
      root.parentElement?.classList.toggle('is-done', lit[lit.length - 1])
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }

    root.classList.add('is-live')
    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  let c = -1
  return (
    <section id={preview ? 'about' : undefined} className={`story ${preview ? '' : 'is-full'}`}>
      <div className="story-inner">
        {!preview && <h1 className="story-kicker">The story behind InvestorPOV</h1>}
        <div ref={textRef} className="story-text">
          {paras.map((para, i) => (
            <Fragment key={i}>
            <p id={!preview && i === PREVIEW ? 'continue' : undefined}>
              {para.map((chunk, j) => {
                c++
                const id = c
                const out: ReactNode[] = []
                chunk.forEach((part, k) => {
                  if (typeof part === 'string') {
                    part.split(' ').forEach((word, n) => {
                      out.push(
                        <Fragment key={`${k}-${n}`}>
                          <span data-c={id} className="w">
                            {word}
                          </span>{' '}
                        </Fragment>
                      )
                    })
                  } else {
                    out.push(
                      <Fragment key={k}>
                        <Piece part={part} c={id} />{' '}
                      </Fragment>
                    )
                  }
                })
                return <Fragment key={j}>{out}</Fragment>
              })}
            </p>
            {/* The pinboard sits right after the opening line, on the full page only. */}
            {!preview && i === 0 && <StoryBoard />}
            {/* Home page only: the carousel follows "…me, Faheem, and Haris." */}
            {preview && i === 1 && <CurvedLensCarousel slides={REEL} label="Pictures of InvestorPOV, then and now" className="story-reel" />}
            </Fragment>
          ))}
        </div>

        {preview && (
          // The next paragraph trails off, and the button picks the story up on its own page.
          <div className="story-more">
            <p className="story-fade" aria-hidden="true">
              {plain(STORY[PREVIEW])} {plain(STORY[PREVIEW + 1])}
            </p>
            <Link href="/story#continue" className="story-cta">
              <span>Read the rest of the story</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
