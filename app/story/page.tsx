import type { Metadata } from 'next'
import SiteFooter from '@/components/SiteFooter'
import TopNav from '@/components/TopNav'
import Story from '@/components/home/Story'

export const metadata: Metadata = {
  title: 'The story',
  description:
    'How InvestorPOV was built in one night at Cursor Hackathon Kashmir, by a designer at his first hackathon and an engineer at his second.',
}

export default function StoryPage() {
  return (
    <>
      <TopNav inWrap />
      <main id="content">
        <Story />
      </main>
      <SiteFooter />
    </>
  )
}
