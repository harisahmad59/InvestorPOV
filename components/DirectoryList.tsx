'use client'

import { useId, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import { COMPANIES_DATA } from '@/lib/companies'
import { displayDomain, scoreOutOf100 } from '@/lib/memo'

export default function DirectoryList() {
  const [query, setQuery] = useState('')
  const inputId = useId()

  const all = useMemo(
    () =>
      Object.keys(COMPANIES_DATA)
        .map((slug) => ({ slug, ...COMPANIES_DATA[slug] }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  )
  const q = query.trim().toLowerCase()
  const shown = q ? all.filter((c) => c.name.toLowerCase().includes(q) || displayDomain(c.website).includes(q)) : all

  return (
    <>
      <div className="enter mt-10 max-w-md" style={{ ['--i' as string]: 4 }}>
        <label htmlFor={inputId} className="t-label">
          Search memos
        </label>
        <div className="sheet mt-2 flex h-12 items-center gap-3 px-4 transition-colors duration-300 focus-within:border-foreground">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            id={inputId}
            type="search"
            name="q"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Company or domain…"
            className="h-full w-full bg-transparent text-[1rem] outline-none placeholder:text-muted-foreground"
          />
        </div>
        <p className="t-small mt-2" aria-live="polite">
          {shown.length} of {all.length} memos
        </p>
      </div>

      {shown.length > 0 ? (
        <ul className="mt-10 border-t border-foreground">
          {shown.map((c, i) => (
            <li key={c.slug} className="enter border-b" style={{ ['--i' as string]: Math.min(i, 12) * 0.5 + 5 }}>
              <Link
                href={`/company/${c.slug}`}
                className="row-link group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 px-1 py-5 sm:grid-cols-[14rem_minmax(0,1fr)_auto_auto] sm:px-3"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[1.25rem] font-semibold tracking-[-0.015em]">{c.name}</span>
                  <span className="t-small block truncate">{displayDomain(c.website)}</span>
                </span>
                <span className="t-body col-span-2 line-clamp-2 sm:col-span-1">{c.summary}</span>
                <span className="tnum col-start-2 row-start-1 text-right text-[1.25rem] font-semibold sm:col-start-3">
                  {scoreOutOf100(c.score)}
                  <span className="t-small ml-1 font-normal">/ 100</span>
                </span>
                <ArrowRight
                  className="hidden h-5 w-5 text-muted-foreground transition-[transform,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-foreground sm:block"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-lg border border-dashed p-10 text-center">
          <p className="t-body">No stored memo matches &ldquo;{query}&rdquo;.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => setQuery('')} className="btn btn-quiet">
              Clear search
            </button>
            <Link href="/#analyze" className="btn btn-primary">
              Analyze a startup
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
