import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Memo from '@/components/Memo'
import { COMPANIES_DATA } from '@/lib/companies'
import { storedMemo } from '@/lib/memo'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return Object.keys(COMPANIES_DATA).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const memo = storedMemo(slug.toLowerCase())
  if (!memo) return { title: 'Memo not found' }
  return {
    title: `${memo.name}: investment memo`,
    description: memo.summary,
  }
}

export default async function CompanyMemoPage({ params }: PageProps) {
  const { slug } = await params
  const memo = storedMemo(slug.toLowerCase())
  if (!memo) notFound()
  return <Memo data={memo} origin="sample" />
}
