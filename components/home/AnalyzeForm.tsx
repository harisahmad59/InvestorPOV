'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { AlertCircle, ArrowRight, Flame } from 'lucide-react'
import { cleanDomain, isValidDomain } from '@/lib/memo'

const EXAMPLES = ['stripe.com', 'linear.app', 'notion.so', 'figma.com']
const SAMPLES = ['cursor.com', 'openai.com', 'nvidia.com', 'perplexity.ai']

/** Types and deletes a list of words, one after another, forever. */
export function useTypingLoop(words: string[], paused = false) {
  const [word, setWord] = useState(0)
  const [chars, setChars] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (paused) return
    const full = words[word]
    let delay = deleting ? 35 : 75
    if (!deleting && chars === full.length) delay = 1800
    if (deleting && chars === 0) delay = 350

    const t = setTimeout(() => {
      if (!deleting && chars === full.length) setDeleting(true)
      else if (deleting && chars === 0) {
        setDeleting(false)
        setWord((w) => (w + 1) % words.length)
      } else setChars((c) => c + (deleting ? -1 : 1))
    }, delay)
    return () => clearTimeout(t)
  }, [chars, deleting, word, words, paused])

  return words[word].slice(0, chars)
}

type Props = {
  busy: boolean
  error: string
  brutal: boolean
  onToggleBrutal: () => void
  onAnalyze: (domain: string) => void
  onClearError: () => void
}

export default function AnalyzeForm({ busy, error, brutal, onToggleBrutal, onAnalyze, onClearError }: Props) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [localError, setLocalError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const errorId = useId()
  const hintId = useId()

  const typed = useTypingLoop(EXAMPLES, focused || value.length > 0)
  const shownError = localError || error

  // The "Analyze" links in the nav and footer point at #analyze: focus the field.
  useEffect(() => {
    const focusIfTargeted = () => {
      if (window.location.hash === '#analyze') inputRef.current?.focus({ preventScroll: true })
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
    <form
      id="analyze"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        submit(value)
      }}
      className="w-full"
    >
      <div
        className={`sheet sheet-raised p-2 transition-[border-color,box-shadow] duration-300 ${
          focused ? 'border-foreground' : ''
        } ${shownError ? 'border-bad' : ''}`}
      >
        <label htmlFor={inputId} className="sr-only">
          Company domain
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <input
              ref={inputRef}
              id={inputId}
              name="domain"
              type="text"
              inputMode="url"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={value}
              disabled={busy}
              onChange={(e) => {
                setValue(e.target.value)
                if (shownError) {
                  setLocalError('')
                  onClearError()
                }
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-invalid={shownError ? true : undefined}
              aria-describedby={`${hintId}${shownError ? ` ${errorId}` : ''}`}
              placeholder={focused ? 'company.com' : ''}
              className="h-14 w-full rounded-md bg-transparent px-4 text-[1.125rem] text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
            />
            {!focused && value.length === 0 && (
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[1.125rem] text-muted-foreground" aria-hidden="true">
                {typed}
                <span className="caret" />
              </span>
            )}
          </div>
          <button type="submit" disabled={busy} className="btn btn-primary h-14 px-6 text-[1rem]">
            {busy ? 'Analyzing…' : 'Analyze'}
            <ArrowRight className="arrow h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {shownError && (
        <p id={errorId} role="alert" className="pop mt-3 flex items-start gap-2 text-[0.9375rem] text-bad">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {shownError}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <button
          type="button"
          role="switch"
          aria-checked={brutal}
          disabled={busy}
          onClick={onToggleBrutal}
          className="group flex min-h-11 items-center gap-3 text-[0.9375rem] text-ink-2 disabled:opacity-60"
        >
          <span
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${brutal ? 'bg-foreground' : 'bg-line-strong'}`}
            aria-hidden="true"
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                brutal ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </span>
          <Flame className={`h-4 w-4 transition-colors duration-300 ${brutal ? 'text-accent' : 'text-muted-foreground'}`} aria-hidden="true" />
          Brutal mode
        </button>
        <p id={hintId} className="t-small">
          {brutal ? 'A harsher read: same facts, blunter tone.' : 'No account needed.'}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="t-small w-full">Or open a stored memo:</span>
        {SAMPLES.map((d) => (
          <button key={d} type="button" disabled={busy} onClick={() => submit(d)} className="chip">
            {d}
          </button>
        ))}
      </div>
    </form>
  )
}
