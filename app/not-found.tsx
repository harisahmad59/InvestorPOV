import type { Metadata } from 'next'
import Link from 'next/link'
import SiteNav from '@/components/SiteNav'

export const metadata: Metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main id="content" className="wrap flex min-h-[calc(100svh-var(--nav-h))] flex-col justify-center py-20">
        <p className="enter tnum t-label" style={{ ['--i' as string]: 0 }}>
          404
        </p>
        <h1 className="t-display mt-4 max-w-[14ch]">
          <span className="enter-line" style={{ ['--i' as string]: 0 }}>
            There&rsquo;s no page
          </span>
          <span className="enter-line text-muted-foreground" style={{ ['--i' as string]: 1 }}>
            or memo here.
          </span>
        </h1>
        <p className="enter t-lead mt-6 max-w-md" style={{ ['--i' as string]: 4 }}>
          The address may be mistyped, or there is no stored memo for that company yet.
        </p>
        <div className="enter mt-9 flex flex-wrap gap-3" style={{ ['--i' as string]: 6 }}>
          <Link href="/#analyze" className="btn btn-primary">
            Analyze a startup
          </Link>
          <Link href="/company" className="btn btn-quiet">
            Browse stored memos
          </Link>
        </div>
      </main>
    </>
  )
}
