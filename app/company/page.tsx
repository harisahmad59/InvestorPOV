"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { COMPANIES_DATA } from "@/lib/companies"
import { Button } from "@/components/ui/button"
import { ArrowRight, Link2, Sparkles, Target, Users } from "lucide-react"

export default function CompaniesDirectoryPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const companies = Object.keys(COMPANIES_DATA).map((slug) => ({
    slug,
    ...COMPANIES_DATA[slug],
  }))

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-xl font-bold text-foreground tracking-tight hover:opacity-80 transition-opacity">
              <img src="/icon.png" alt="InvestorPOV Logo" className="w-6 h-6 object-contain shrink-0" />
              <span>InvestorPOV</span>
            </a>
            <Button
              onClick={() => router.push("/")}
              className="rounded-full px-5 h-10 bg-foreground text-background hover:bg-foreground/90 hover:-translate-y-0.5 transition-all text-xs"
            >
              Analyze a Startup
            </Button>
          </div>
        </nav>

        {/* Directory Header */}
        <section className="py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="max-w-5xl mx-auto text-left z-10 relative">
            <span className="text-[11px] font-normal text-accent uppercase tracking-widest block mb-4">
              • STARTUP DIRECTORY
            </span>
            <h1 className="text-4xl md:text-[56px] font-semibold text-foreground tracking-tight leading-[1.1] mb-6">
              Popular Startups<br />
              <span className="text-muted-foreground/60">VC Investment Memos.</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl mb-10">
              Browse VC-grade research memos and investment reports for startups verified by the InvestorPOV engine.
            </p>

            {/* Filter Search Bar */}
            <div className="w-full max-w-md bg-card rounded-full pl-5 pr-1.5 py-1.5 flex items-center border border-border shadow-sm focus-within:border-accent/40 focus-within:shadow-[0_4px_24px_rgba(255,107,43,0.04)] transition-all duration-200">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search verified startups..."
                className="flex-1 text-sm text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/40 pr-4"
              />
            </div>
          </div>
        </section>

        {/* Directory Grid */}
        <section className="py-12 px-6 max-w-5xl mx-auto">
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCompanies.map((company) => {
                const displayScore = Math.round(company.score * 10)
                
                return (
                  <div
                    key={company.slug}
                    onClick={() => router.push(`/company/${company.slug}`)}
                    className="group bg-card border border-border/80 rounded-lg p-6 hover:shadow-md hover:border-accent/30 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Info Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                            {company.name}
                          </h3>
                          {company.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-muted-foreground hover:text-accent hover:underline block mt-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {company.website.replace(/^https?:\/\//i, "")}
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-normal uppercase">
                            Score: {displayScore}
                          </span>
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                        {company.summary}
                      </p>
                    </div>

                    {/* View Report Button */}
                    <div className="flex items-center text-xs font-bold text-accent group-hover:translate-x-1.5 transition-transform duration-200">
                      View VC Memo
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border p-12 text-center text-muted-foreground text-sm">
              No verified startups match your search criteria.
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="relative pt-20 pb-10 px-6 bg-card border-t border-border/50 overflow-hidden mt-20">
        <div className="relative max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-14">
            <div className="max-w-sm">
              <a href="/" className="flex items-center gap-2 text-xl font-bold text-foreground tracking-tight">
                <img src="/icon.png" alt="InvestorPOV Logo" className="w-6 h-6 object-contain shrink-0" />
                <span>InvestorPOV</span>
              </a>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                AI-powered startup analysis for investors who value speed and clarity.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Product</h4>
              <ul className="space-y-2.5">
                <li><a href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a></li>
                <li><a href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="/#why-us" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Why us</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} InvestorPOV. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
