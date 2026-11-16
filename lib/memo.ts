import { COMPANIES_DATA, type AnalysisData } from './companies'

/** "https://www.Stripe.com/pricing" -> "stripe.com" */
export function cleanDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/[/?#].*$/, '')
}

export function isValidDomain(domain: string): boolean {
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(domain)
}

/** "stripe.com" -> "stripe". Matches the keys used for stored memos. */
export function slugFromDomain(input: string): string {
  return cleanDomain(input).replace(/\.[a-z0-9-]+$/i, '')
}

export function storedMemo(slug: string): AnalysisData | undefined {
  return Object.prototype.hasOwnProperty.call(COMPANIES_DATA, slug)
    ? COMPANIES_DATA[slug]
    : undefined
}

/** Finds a stored memo by the company's actual domain, not by a guessed name. */
export function storedSlugForDomain(domain: string): string | undefined {
  const target = cleanDomain(domain)
  return Object.keys(COMPANIES_DATA).find((slug) => {
    const site = COMPANIES_DATA[slug].website
    return !!site && cleanDomain(site) === target
  })
}

/**
 * Stored memos open with a trading-style label ("STRONG BUY."). The memo is a
 * first read, not a recommendation, so the label is dropped on display.
 */
export function verdictText(verdict: string | undefined): string {
  return (verdict ?? '').replace(/^\s*(STRONG BUY|BUY|HOLD|PASS|SELL)\s*[.:—-]\s*/i, '').trim()
}

/** The memo scores out of 10; the page shows it out of 100. */
export function scoreOutOf100(score: number | undefined): number {
  const s = Math.max(0, Math.min(10, score ?? 0))
  return Math.round(s * 10)
}

export type ScoreBand = { label: string; tone: 'good' | 'caution' | 'bad' }

export function scoreBand(score100: number): ScoreBand {
  if (score100 >= 80) return { label: 'Strong', tone: 'good' }
  if (score100 >= 60) return { label: 'Mixed', tone: 'caution' }
  return { label: 'Weak', tone: 'bad' }
}

/**
 * Pulls the headline figure out of a market-size sentence, exactly as written.
 * "…estimated at $45B-60B, representing…" -> "$45B-60B"
 * Returns null when the text has no dollar figure; nothing is ever made up.
 */
export function tamHeadline(tam: string | undefined): string | null {
  if (!tam) return null
  const m = tam.match(
    /\$\s?[\d.,]+\s?(?:[TBMK]|trillion|billion|million)?\+?(?:\s?[-–]\s?\$?[\d.,]+\s?(?:[TBMK]|trillion|billion|million)?\+?)?/i
  )
  if (!m) return null
  return m[0].replace(/\s+/g, '').replace(/[.,]$/, '')
}

export function displayDomain(url: string | undefined): string {
  return url ? cleanDomain(url) : ''
}
