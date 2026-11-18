import type { Metadata } from 'next'
import DirectoryList from '@/components/DirectoryList'
import SiteFooter from '@/components/SiteFooter'
import TopNav from '@/components/TopNav'

export const metadata: Metadata = {
  title: 'Stored memos',
  description: 'Sample investment memos for well-known startups, written in advance and kept as examples of what InvestorPOV produces.',
}

export default function DirectoryPage() {
  return (
    <>
      <TopNav current="updates" inWrap />
      <main id="content" className="wrap pb-28 pt-14 sm:pt-20">
        <h1 className="t-display max-w-[12ch]">
          <span className="enter-line" style={{ ['--i' as string]: 0 }}>
            Stored memos
          </span>
        </h1>
        <p className="enter t-lead mt-6 max-w-xl" style={{ ['--i' as string]: 3 }}>
          Sample memos for companies you probably know. They were written in advance as examples and are not refreshed.
        </p>
        <DirectoryList />
      </main>
      <SiteFooter />
    </>
  )
}
