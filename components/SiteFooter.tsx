import Link from 'next/link'

export default function SiteFooter({ onHome = false }: { onHome?: boolean }) {
  const base = onHome ? '' : '/'
  return (
    <footer className="border-t">
      <div className="wrap flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="flex min-h-11 items-center gap-2 text-[1.0625rem] font-semibold tracking-tight" translate="no">
            <img src="/icon.png" alt="" width={24} height={24} className="h-6 w-6 shrink-0" />
            InvestorPOV
          </Link>
          <p className="t-small mt-2">
            A first-read investment memo for any startup, drafted from the company&rsquo;s own homepage. Not investment advice.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-1">
            <li>
              <a href={`${base}#how`} className="nav-link">
                <span className="link">How it works</span>
              </a>
            </li>
            <li>
              <a href={`${base}#example`} className="nav-link">
                <span className="link">Example</span>
              </a>
            </li>
            <li>
              <a href={`${base}#about`} className="nav-link">
                <span className="link">About</span>
              </a>
            </li>
            <li>
              <Link href="/company" className="nav-link">
                <span className="link">Memos</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="wrap border-t py-6">
        <p className="t-small">&copy; {new Date().getFullYear()} InvestorPOV</p>
      </div>
    </footer>
  )
}
