import type { MetadataRoute } from 'next'
import { COMPANIES_DATA } from '@/lib/companies'

const BASE = 'https://www.investorpov.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/company`, changeFrequency: 'monthly', priority: 0.7 },
    ...Object.keys(COMPANIES_DATA).map((slug) => ({
      url: `${BASE}/company/${slug}`,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ]
}
