'use client'

import Link from 'next/link'
import ProfileCard from '@/components/ui/ProfileCard'
import '@/app/footer.css'

/** The two people behind the site. No portraits yet: add `avatarUrl` when there are photos. */
const PEOPLE = [
  { name: 'Mohammad Faheem', title: 'Designer', handle: 'faheemnotfayeem', status: 'Design', url: 'https://github.com/faheemnotfayeem' },
  { name: 'Haris Ahmad', title: 'Entrepreneur', handle: 'harisahmad59', status: 'Engineering', url: 'https://github.com/harisahmad59' },
]

/** Site footer, built from Figma frame 59:2286. */
export default function SiteFooter() {
  return (
    <footer className="foot">
      {/* the wordmark, three times, filling the footer's height */}
      <div className="foot-rows" aria-hidden="true" />

      <div className="foot-panel">
        <Link href="/" className="foot-mark" aria-label="InvestorPOV home">
          <img src="/footer/wordmark.svg" alt="" width={414} height={65} />
        </Link>

        <div className="foot-info">
          <p className="foot-about">A first-read investment memo for any startup, drafted from the company&rsquo;s own homepage.</p>
          <nav aria-label="Footer" className="foot-nav">
            <h2>Explore</h2>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/story">Story Mode</Link>
              </li>
            </ul>
          </nav>
          <p className="foot-copy">&copy; {new Date().getFullYear()} InvestorPOV</p>
        </div>

        <div className="foot-people">
          {PEOPLE.map((p) => (
            <ProfileCard
              key={p.handle}
              name={p.name}
              title={p.title}
              handle={p.handle}
              status={p.status}
              statusColor="#ff6b2b"
              contactText="Contact"
              holo={0.8}
              glare={0.5}
              tiltStrength={12}
              parallax={8}
              radius={16}
              theme="dark"
              onContactClick={() => window.open(p.url, '_blank', 'noopener,noreferrer')}
            />
          ))}
        </div>
      </div>
    </footer>
  )
}
