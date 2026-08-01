"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import Report from "@/components/Report"
import { COMPANIES_DATA } from "@/lib/companies"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function CompanyReportPage({ params }: PageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const slug = resolvedParams?.slug?.toLowerCase()

  const data = COMPANIES_DATA[slug]

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Company report not found</h1>
        <p className="text-muted-foreground text-sm mb-6">
          We haven&apos;t generated an investment report for this company yet.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-5 py-2.5 bg-foreground text-background rounded-full font-bold text-xs hover:opacity-90 transition-opacity"
        >
          Generate a new report
        </button>
      </div>
    )
  }

  // Render the full VC-grade report workspace standalone
  return (
    <div className="min-h-screen bg-background">
      <Report data={data} onClose={() => router.push("/")} />
    </div>
  )
}
