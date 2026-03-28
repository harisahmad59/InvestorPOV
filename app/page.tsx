"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Link2, Globe, Sparkles, FileText, CheckCircle2, Loader2, AlertCircle, Flame, Cpu, Database, X, Zap, Mail, Github } from "lucide-react"
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6"
import Report from "@/components/Report"

// Analysis result type
interface SwotData {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

interface AnalysisData {
  name: string
  summary: string
  market: string
  tam?: string
  businessModel?: string
  competitors: string[]
  swot?: SwotData
  verdict?: string
  score: number
}

// Navigation Component
function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-foreground tracking-tight hover:opacity-80 transition-opacity">InvestorPOV</a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#why-us" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Why us</a>
        </div>
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="rounded-full px-5 h-10 bg-foreground text-background hover:bg-foreground/90 hover:-translate-y-0.5 transition-all"
        >
          Analyze a Startup
        </Button>
      </div>
    </nav>
  )
}

// Loading Skeleton
function AnalysisSkeleton() {
  return (
    <section className="py-16 px-6 bg-background border-t border-border/50">
      <div className="max-w-5xl mx-auto animate-pulse">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-secondary rounded-xl" />
            <div className="h-4 w-72 bg-secondary rounded-lg" />
          </div>
          <div className="h-24 w-24 bg-secondary rounded-full" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 h-40 bg-secondary rounded-2xl" />
          <div className="md:col-span-4 h-40 bg-secondary rounded-2xl" />
          <div className="md:col-span-4 h-48 bg-secondary rounded-2xl" />
          <div className="md:col-span-4 h-48 bg-secondary rounded-2xl" />
          <div className="md:col-span-4 h-48 bg-secondary rounded-2xl" />
        </div>

        <div className="flex items-center justify-center gap-2 mt-10 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin text-accent" />
          <span className="text-sm font-medium">Researching and analyzing...</span>
        </div>
      </div>
    </section>
  )
}


// Branded example badges
const EXAMPLE_BADGES = [
  { domain: "cursor.com", icon: Sparkles, color: "#FF6B2B", bg: "rgba(255,107,43,0.08)", hoverBg: "rgba(255,107,43,0.15)" },
  { domain: "linkedin.com", icon: FaLinkedinIn, color: "#0A66C2", bg: "rgba(10,102,194,0.08)", hoverBg: "rgba(10,102,194,0.15)" },
  { domain: "nvidia.com", icon: Cpu, color: "#76B900", bg: "rgba(118,185,0,0.08)", hoverBg: "rgba(118,185,0,0.15)" },
  { domain: "oracle.com", icon: Database, color: "#F80000", bg: "rgba(248,0,0,0.08)", hoverBg: "rgba(248,0,0,0.15)" },
]

// Animated placeholder text
const PLACEHOLDER_TEXT = "Enter any website URL like stripe.com"

// URL Input Component (presentational — state managed by parent)
function UrlInput({
  variant = "hero",
  loading = false,
  onAnalyze,
  error,
  brutalMode = false,
  onToggleBrutalMode,
}: {
  variant?: "hero" | "footer"
  loading?: boolean
  onAnalyze?: (name: string) => void
  error?: string
  brutalMode?: boolean
  onToggleBrutalMode?: () => void
}) {
  const [startup, setStartup] = useState("")
  const [localError, setLocalError] = useState("")
  const [focused, setFocused] = useState(false)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayError = error || localError

  // Typing animation for placeholder
  useEffect(() => {
    if (startup || focused) return // stop when user types or focuses

    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => {
        if (prev >= PLACEHOLDER_TEXT.length) {
          // pause at end then restart
          setTimeout(() => setPlaceholderIdx(0), 1500)
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 60)

    return () => clearInterval(interval)
  }, [startup, focused, placeholderIdx])

  // Reset animation index when input is cleared
  useEffect(() => {
    if (!startup && !focused) setPlaceholderIdx(0)
  }, [startup, focused])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const domain = startup.trim().replace(/^https?:\/\//i, "")

    if (!domain) {
      setLocalError("Please enter a valid domain (e.g. stripe.com)")
      return
    }

    if (!domain.includes(".") || domain.includes(" ")) {
      setLocalError("Please enter a valid domain (e.g. stripe.com)")
      return
    }

    setLocalError("")
    onAnalyze?.(domain)
  }

  const animatedPlaceholder =
    startup || focused
      ? PLACEHOLDER_TEXT
      : PLACEHOLDER_TEXT.slice(0, placeholderIdx) + (placeholderIdx < PLACEHOLDER_TEXT.length ? "|" : "")

  return (
    <div className="w-full max-w-[680px] flex flex-col items-center">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Error — above input */}
        {displayError && (
          <div className="flex items-center justify-between gap-2 mb-3 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 animate-[fadeIn_0.2s_ease-out]">
            <p className="text-sm flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {displayError}
            </p>
            <button
              type="button"
              onClick={() => setLocalError("")}
              className="p-0.5 rounded-md hover:bg-red-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ── Unified container ─────────────────────────────────────────── */}
        <div
          className={`
            w-full bg-card rounded-[24px] px-5 pt-4 pb-3.5 transition-all duration-200
            shadow-[0_2px_16px_rgba(0,0,0,0.06)]
            ${focused
              ? "border border-accent/40 shadow-[0_0_0_3px_rgba(var(--accent-rgb,99,102,241),0.1),0_4px_24px_rgba(0,0,0,0.08)]"
              : "border border-border/40 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
            }
          `}
        >
          {/* Input field — borderless, large, transparent */}
          <input
            ref={inputRef}
            type="text"
            value={startup}
            onChange={(e) => setStartup(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={animatedPlaceholder}
            disabled={loading}
            className="w-full text-lg md:text-xl text-foreground placeholder:text-[#999] bg-transparent border-none outline-none mb-3 disabled:opacity-60"
          />

          {/* Bottom row: actions right-aligned */}
          <div className="flex items-center justify-end gap-3">
            {/* Brutal Mode Toggle */}
            <button
              type="button"
              onClick={onToggleBrutalMode}
              disabled={loading}
              className={`
                group relative flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all
                ${brutalMode
                  ? "bg-red-500/10 text-red-500 border border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                  : "bg-secondary text-muted-foreground border border-border/50 hover:border-red-500/30 hover:text-red-400"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <Flame className={`w-3.5 h-3.5 transition-transform ${brutalMode ? "animate-pulse" : "group-hover:scale-110"}`} />
              <span className="hidden sm:inline">Brutal</span>
              <div
                className={`
                  w-7 h-[16px] rounded-full transition-colors relative
                  ${brutalMode ? "bg-red-500" : "bg-secondary-foreground/20"}
                `}
              >
                <div
                  className={`
                    absolute top-[2px] w-[12px] h-[12px] rounded-full bg-white shadow transition-all
                    ${brutalMode ? "left-[13px]" : "left-[2px]"}
                  `}
                />
              </div>
            </button>

            {/* Analyze Button */}
            <Button
              type="submit"
              disabled={loading}
              className="group h-[40px] px-5 rounded-full bg-foreground text-background hover:bg-accent hover:text-accent-foreground transition-all font-medium disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing…
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Analyze
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Branded example badges — below the container */}
        <div className="flex flex-wrap justify-center gap-2.5 mt-4 animate-[fadeIn_0.5s_ease-out]">
          {EXAMPLE_BADGES.map(({ domain, icon: Icon, color, bg, hoverBg }) => (
            <button
              key={domain}
              type="button"
              onClick={() => setStartup(domain)}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: bg, color: "#333" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = bg)}
            >
              <Icon className="w-4 h-4" style={{ color }} />
              {domain}
            </button>
          ))}
        </div>

        {variant === "hero" && !loading && (
          <p className="text-[13px] text-muted-foreground mt-4 text-center">
            No account needed · Results in under 60 seconds
          </p>
        )}
      </form>
    </div>
  )
}

// Hook to manage analysis state
function useAnalysis() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<AnalysisData | null>(null)
  const [brutalMode, setBrutalMode] = useState(false)

  const toggleBrutalMode = () => setBrutalMode((prev) => !prev)

  const analyze = async (name: string) => {
    setError("")
    setResult(null)
    setLoading(true)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startup: name, mode: brutalMode ? "brutal" : "normal" }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Something went wrong. Please try again.")
        return
      }

      const data = await res.json()

      if (!data.name || typeof data.score !== "number") {
        setError(data.error || "Received incomplete data. Please try again.")
        return
      }

      setResult(data as AnalysisData)
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setResult(null)
    setError("")
  }

  return { loading, error, result, analyze, clear, brutalMode, toggleBrutalMode }
}

// Score Bar Component with Animation
function ScoreBar({ label, score, delay = 0 }: { label: string; score: number; delay?: number }) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), delay)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-24">{label}</span>
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
          style={{ width: animated ? `${score}%` : "0%" }}
        />
      </div>
      <span className="text-xs font-medium text-foreground w-8">{score}</span>
    </div>
  )
}

// Hero + Dashboard Section
function HeroWithDashboard() {
  const { loading, error, result, analyze, clear, brutalMode, toggleBrutalMode } = useAnalysis()
  const dashboardRef = useRef<HTMLDivElement>(null)

  // Scroll to dashboard when result appears
  useEffect(() => {
    if (result && dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [result])

  return (
    <>
      <section className="py-20 md:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="border-accent text-accent bg-card rounded-full px-4 py-1.5 mb-8 font-medium">
            STARTUP ANALYSIS IN SECONDS
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6 text-balance">
            Every startup, analyzed<br />
            like a <span className="text-accent">VC</span> would.
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-[520px] mx-auto mb-10 text-balance">
            Paste a URL. Get a full investment memo with scores, competitor analysis, and a verdict — in seconds.
          </p>
          
          <div className="flex flex-col items-center">
            <UrlInput
              variant="hero"
              loading={loading}
              onAnalyze={analyze}
              error={error}
              brutalMode={brutalMode}
              onToggleBrutalMode={toggleBrutalMode}
            />
          </div>
          
        </div>
      </section>

      {/* Loading skeleton */}
      {loading && <AnalysisSkeleton />}

      {/* Dashboard result */}
      {result && (
        <div ref={dashboardRef}>
          <Report data={result} onClose={clear} />
        </div>
      )}
    </>
  )
}

// How It Works Card
function HowItWorksCard({ 
  title, 
  description, 
  children 
}: { 
  title: string
  description: string
  children: React.ReactNode 
}) {
  return (
    <div className="bg-card rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border/30 flex flex-col">
      <div className="flex-1 mb-4 min-h-[120px] flex items-center justify-center">
        {children}
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function AnimatedScore({ target = 87, total = 100, duration = 2000, pauseMs = 3000 }: { target?: number; total?: number; duration?: number; pauseMs?: number }) {
  const [count, setCount] = useState(0)
  const circumference = 2 * Math.PI * 20 // r=20

  useEffect(() => {
    let frame: number
    let start: number | null = null
    let timeout: ReturnType<typeof setTimeout>

    const animate = (ts: number) => {
      if (!start) start = ts
      const elapsed = ts - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      } else {
        timeout = setTimeout(() => {
          setCount(0)
          start = null
          frame = requestAnimationFrame(animate)
        }, pauseMs)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timeout)
    }
  }, [target, duration, pauseMs])

  const strokeDash = (count / total) * circumference

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12 shrink-0">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-secondary" />
          <circle
            cx="24" cy="24" r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-accent transition-[stroke-dasharray] duration-100"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground tabular-nums">
          {count}
        </span>
      </div>
      <div className="min-w-[85px]">
        <p className="text-sm font-medium text-foreground tabular-nums">{count} / {total}</p>
        <Badge className={`border-0 text-[10px] px-2 py-0.5 rounded-full mt-1 transition-colors duration-300 min-w-[78px] justify-center ${count >= 80 ? "bg-emerald-100 text-emerald-700" : count >= 50 ? "bg-amber-100 text-amber-700" : "bg-secondary text-muted-foreground"}`}>
          {count >= 80 ? "STRONG BUY" : count >= 50 ? "HOLD" : count > 0 ? "ANALYZING..." : "—"}
        </Badge>
      </div>
    </div>
  )
}

const TYPING_URLS = ["https://stripe.com", "https://notion.so", "https://linear.app", "https://figma.com"]

function TypingLoop() {
  const [urlIdx, setUrlIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const url = TYPING_URLS[urlIdx]

    if (!deleting && charIdx < url.length) {
      const timer = setTimeout(() => setCharIdx((c) => c + 1), 60)
      return () => clearTimeout(timer)
    }

    if (!deleting && charIdx === url.length) {
      const timer = setTimeout(() => setDeleting(true), 2000)
      return () => clearTimeout(timer)
    }

    if (deleting && charIdx > 0) {
      const timer = setTimeout(() => setCharIdx((c) => c - 1), 30)
      return () => clearTimeout(timer)
    }

    if (deleting && charIdx === 0) {
      setDeleting(false)
      setUrlIdx((i) => (i + 1) % TYPING_URLS.length)
    }
  }, [charIdx, deleting, urlIdx])

  return (
    <span className="text-sm text-muted-foreground truncate">
      {TYPING_URLS[urlIdx].slice(0, charIdx)}
    </span>
  )
}

// How It Works Section
function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm font-medium text-accent uppercase tracking-wide mb-3">HOW IT WORKS</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-balance">
          From URL to investment memo in seconds.
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <HowItWorksCard
            title="Paste any startup URL"
            description="Drop in any company website. No forms, no signups."
          >
            <div className="w-full max-w-[240px] bg-secondary/50 rounded-xl p-3 border border-border/50">
              <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border">
                <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
                <TypingLoop />
                <span className="w-0.5 h-4 bg-accent animate-pulse ml-auto shrink-0" />
              </div>
            </div>
          </HowItWorksCard>
          
          {/* Card 2 */}
          <HowItWorksCard
            title="We scrape and research"
            description="InvestorPOV pulls product data, news, pricing, and competitor signals."
          >
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/20 to-transparent rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
              </div>
              <Globe className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 text-muted-foreground animate-[orbit_3s_linear_infinite]" style={{ transformOrigin: "center 48px" }} />
              <FileText className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 text-muted-foreground animate-[orbit_3s_linear_infinite_1s]" style={{ transformOrigin: "center 48px" }} />
              <Link2 className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 text-muted-foreground animate-[orbit_3s_linear_infinite_2s]" style={{ transformOrigin: "center 48px" }} />
            </div>
          </HowItWorksCard>
          
          {/* Card 3 */}
          <HowItWorksCard
            title="AI runs the analysis"
            description="GPT-4o processes everything like a senior analyst would."
          >
            <div className="w-full max-w-[220px] space-y-2">
              {[
                { label: "Scraping website", done: true },
                { label: "Researching market", done: true },
                { label: "Mapping competitors", done: true },
                { label: "Generating memo...", done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                  )}
                  <span className={item.done ? "text-muted-foreground" : "text-foreground font-medium"}>
                    {item.label}
                  </span>
                </div>
              ))}
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-2">
                <div className="h-full w-3/4 bg-accent rounded-full animate-pulse" />
              </div>
            </div>
          </HowItWorksCard>
          
          {/* Card 4 */}
          <HowItWorksCard
            title="Get your investment memo"
            description="A full VC-grade report with scores, risks, and a final verdict."
          >
            <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
              <AnimatedScore target={87} total={100} duration={2000} pauseMs={3000} />
            </div>
          </HowItWorksCard>
        </div>
      </div>
    </section>
  )
}

// Feature Bento Grid
function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm font-medium text-accent uppercase tracking-wide mb-3">FULL REPORT BREAKDOWN</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-balance">
          Six lenses. One clear verdict.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Row 1 */}
          <div className="md:col-span-7 bg-card rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border/30">
            <h3 className="font-semibold text-foreground mb-3">Business Fundamentals</h3>
            <p className="text-sm text-muted-foreground mb-4">Core problem, solution, and business model at a glance.</p>
            <div className="flex flex-wrap gap-2">
              {["Problem", "Solution", "Business Model", "Revenue", "Pricing"].map((chip) => (
                <span key={chip} className="px-3 py-1.5 bg-secondary text-xs text-muted-foreground rounded-full">
                  {chip}
                </span>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-5 bg-card rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border/30">
            <h3 className="font-semibold text-foreground mb-3">Market Sizing</h3>
            <p className="text-sm text-muted-foreground mb-4">TAM, SAM, SOM breakdown.</p>
            <div className="space-y-2">
              {[
                { label: "TAM", value: "$2.4T", width: "100%" },
                { label: "SAM", value: "$180B", width: "60%" },
                { label: "SOM", value: "$12B", width: "25%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-10">{item.label}</span>
                  <div className="flex-1 h-4 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: item.width }} />
                  </div>
                  <span className="text-xs font-medium text-foreground w-14 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Row 2 */}
          <div className="md:col-span-4 bg-card rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border/30">
            <h3 className="font-semibold text-foreground mb-3">Competitor Mapping</h3>
            <p className="text-sm text-muted-foreground mb-4">Key players and threat analysis.</p>
            <div className="space-y-2">
              {[
                { name: "Adyen", level: "High", color: "bg-red-100 text-red-700" },
                { name: "Square", level: "Med", color: "bg-amber-100 text-amber-700" },
                { name: "PayPal", level: "Low", color: "bg-emerald-100 text-emerald-700" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.color}`}>{item.level}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-4 bg-card rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border/30">
            <h3 className="font-semibold text-foreground mb-3">SWOT Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">Strengths, weaknesses, opportunities, threats.</p>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-emerald-50 rounded-lg p-2 text-center">
                <span className="text-xs font-medium text-emerald-700">S</span>
              </div>
              <div className="bg-amber-50 rounded-lg p-2 text-center">
                <span className="text-xs font-medium text-amber-700">W</span>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <span className="text-xs font-medium text-blue-700">O</span>
              </div>
              <div className="bg-red-50 rounded-lg p-2 text-center">
                <span className="text-xs font-medium text-red-700">T</span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-4 bg-card rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border/30">
            <h3 className="font-semibold text-foreground mb-3">Investment Scores</h3>
            <p className="text-sm text-muted-foreground mb-4">Four key metrics, objectively scored.</p>
            <div className="space-y-2">
              <ScoreBar label="Market" score={91} delay={0} />
              <ScoreBar label="Product" score={88} delay={100} />
              <ScoreBar label="Compete" score={79} delay={200} />
              <ScoreBar label="Execute" score={84} delay={300} />
            </div>
          </div>
          
          {/* Row 3 */}
          <div className="md:col-span-5 bg-card rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border/30">
            <h3 className="font-semibold text-foreground mb-3">Risk Assessment</h3>
            <p className="text-sm text-muted-foreground mb-4">Critical risks that could impact investment.</p>
            <div className="space-y-2">
              {["Market saturation", "Regulatory changes", "Competition"].map((risk, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-muted-foreground">{risk}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-7 bg-accent rounded-3xl p-6 relative overflow-hidden group">
            <ArrowRight className="absolute top-6 right-6 w-6 h-6 text-accent-foreground/70 group-hover:translate-x-1 transition-transform" />
            <h3 className="font-semibold text-accent-foreground mb-2">Final Verdict</h3>
            <p className="text-sm text-accent-foreground/80 mb-4">The bottom line for investors.</p>
            <span className="text-5xl font-bold text-accent-foreground">BUY</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// Why InvestorPOV Section
function WhyInvestorPOV() {
  const reasons = [
    {
      icon: <Cpu className="w-5 h-5 text-accent" />,
      title: "AI-powered, not opinion-powered",
      description:
        "Traditional due diligence relies on gut feel and biased networks. InvestorPOV uses structured AI analysis to surface what humans miss.",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-accent" />,
      title: "VC-grade reports in seconds",
      description:
        "What takes analysts weeks to compile — market sizing, competitor mapping, risk scoring — gets delivered in under a minute.",
    },
    {
      icon: <Database className="w-5 h-5 text-accent" />,
      title: "Data-driven conviction",
      description:
        "Every score, every verdict, every risk flag is backed by structured reasoning. No hand-waving, no fluff — just signal.",
    },
    {
      icon: <Globe className="w-5 h-5 text-accent" />,
      title: "Works for any startup",
      description:
        "Paste a pitch deck, a landing page, or a LinkedIn URL. InvestorPOV adapts to whatever context you have on a company.",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-accent" />,
      title: "Built for decision-makers",
      description:
        "Whether you're an angel, a VC partner, or a scout — get the clarity you need to say yes, no, or dig deeper.",
    },
    {
      icon: <Database className="w-5 h-5 text-accent" />,
      title: "Powered by real-time data",
      description:
        "Powered by Apify and Exa to scrape live product data, funding history, and competitive signals in real time.",
    },
  ]

  return (
    <section id="why-us" className="py-20 md:py-28 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm font-medium text-accent uppercase tracking-wide mb-3">
          WHY INVESTORPOV
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
          Due diligence shouldn&apos;t take weeks.
        </h2>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
          Most investors spend hours digging through decks, Crunchbase, and Google before forming an opinion. InvestorPOV gives you a structured, actionable analysis — instantly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="bg-card rounded-2xl p-6 border border-border/30 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:border-accent/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                {reason.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{reason.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border/30">
            <h3 className="font-semibold text-foreground mb-1">Analysis quality</h3>
            <p className="text-sm text-muted-foreground mb-6">Compared to manual research</p>
            <div className="relative h-32">
              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                <path
                  d="M 0 80 Q 75 70 100 60 T 200 30 T 300 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-accent"
                  strokeLinecap="round"
                />
                <circle cx="300" cy="10" r="5" className="fill-accent" />
              </svg>
              <div className="absolute top-0 right-4 bg-foreground text-background text-xs px-3 py-1.5 rounded-lg font-medium shadow-lg">
                +94% Analyst agreement
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border/30">
            <h3 className="font-semibold text-foreground mb-6">By the numbers</h3>
            <div className="space-y-4">
              {[
                { stat: "1,000+", label: "startups analyzed" },
                { stat: "60 sec", label: "average analysis time" },
                { stat: "40+", label: "countries with active users" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-2xl font-bold text-foreground">{item.stat}</span>
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="relative pt-20 pb-10 px-6 bg-card border-t border-border/50 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* CTA banner */}
        <div className="relative bg-foreground rounded-2xl p-8 md:p-10 mb-16 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-background mb-2">
                Ready to think like an investor?
              </h3>
              <p className="text-background/60 text-sm md:text-base">
                Paste any startup URL and get your analysis in under 60 seconds.
              </p>
            </div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) }}
              className="shrink-0 group flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-full font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <Zap className="w-4 h-4" />
              Start Analyzing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Footer grid */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-14">
          {/* Brand column */}
          <div className="max-w-sm">
            <a href="/" className="text-xl font-bold text-foreground tracking-tight">InvestorPOV</a>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              AI-powered startup analysis for investors who value speed and clarity.
            </p>
          </div>

          {/* Product column */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a></li>
              <li><a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#why-us" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Why us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} InvestorPOV. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Built with
            <span className="inline-block w-3 h-3 text-red-500">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </span>
            for better investment decisions
          </p>
        </div>
      </div>
    </footer>
  )
}

// Main Page Component
export default function InvestorPOVLandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroWithDashboard />
      <HowItWorksSection />
      <FeaturesSection />
      <WhyInvestorPOV />
      <Footer />
      
      <style jsx global>{`
        @keyframes orbit {
          from { transform: translateX(-50%) rotate(0deg); }
          to { transform: translateX(-50%) rotate(360deg); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </main>
  )
}
