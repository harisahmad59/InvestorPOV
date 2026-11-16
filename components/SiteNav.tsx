import Link from 'next/link'

/** Top navigation shared by the home page and the memo directory. */
export default function SiteNav({ onHome = false }: { onHome?: boolean }) {
  const base = onHome ? '' : '/'
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <nav aria-label="Main" className="wrap flex h-[var(--nav-h)] items-center justify-between gap-2">
        <Link href="/" className="flex min-h-11 items-center gap-2 text-[1.0625rem] font-semibold tracking-tight" translate="no">
          <img src="/icon.png" alt="" width={24} height={24} className="h-6 w-6 shrink-0" />
          InvestorPOV
        </Link>
        <div className="flex items-center gap-1 sm:gap-6">
          <a href={`${base}#how`} className="nav-link hidden md:inline-flex">
            <span className="link">How it works</span>
          </a>
          <a href={`${base}#example`} className="nav-link hidden md:inline-flex">
            <span className="link">Example</span>
          </a>
          <Link href="/company" className="nav-link mr-1 sm:mr-0">
            <span className="link">Memos</span>
          </Link>
          <a href={`${base}#analyze`} className="btn btn-primary">
            <span className="sm:hidden">Analyze</span>
            <span className="hidden sm:inline">Analyze a startup</span>
          </a>
        </div>
      </nav>
    </header>
  )
}
