"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Link2, Globe, Sparkles, FileText, CheckCircle2, Loader2, AlertCircle, Flame, Cpu, Database, X, Zap, Mail, Github, TrendingUp, Users, Target, Lightbulb, ShieldAlert } from "lucide-react"
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6"
import Report from "@/components/Report"
import { COMPANIES_DATA } from "@/lib/companies"

// Analysis result type
interface SwotData {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

interface RiskItem {
  risk: string
  severity: "High" | "Medium" | "Low"
  mitigation: string
}

interface AnalysisData {
  name: string
  summary: string
  market: string
  tam?: string
  businessModel?: string
  competitors: string[]
  swot?: SwotData
  risks?: RiskItem[]
  growthLevers?: string[]
  verdict?: string
  score: number
}

// Navigation Component
function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold text-foreground tracking-tight hover:opacity-80 transition-opacity">
          <img src="/icon.png" alt="InvestorPOV Logo" className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0" />
          <span>InvestorPOV</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#why-us" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Why us</a>
        </div>
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="rounded-full px-3 sm:px-5 h-9 sm:h-10 bg-foreground text-background hover:bg-foreground/90 hover:-translate-y-0.5 transition-all text-xs sm:text-sm"
        >
          <span className="hidden sm:inline">Analyze a Startup</span>
          <span className="sm:hidden">Analyze</span>
        </Button>
      </div>
    </nav>
  )
}

// Full Screen Interactive Loader
function FullScreenLoader() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const steps = [
    "Initializing secure AI engine handshake...",
    "Reading startup website contents...",
    "Extracting business model and core values...",
    "Analyzing key product features...",
    "Calculating niche TAM, SAM, and SOM sizes...",
    "Synthesizing SWOT matrix parameters...",
    "Formulating risks and mitigation strategies...",
    "Compiling VC memo and investment verdict..."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIdx((idx) => (idx < steps.length - 1 ? idx + 1 : idx))
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  const progressPercent = Math.round(((currentStepIdx + 1) / steps.length) * 100)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative max-w-lg w-full flex flex-col items-center text-center space-y-10 z-10">
        {/* Glowing Radar Scanning Core */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-accent/20 animate-ping duration-1000" />
          <div className="absolute inset-3 rounded-full border border-accent/30 animate-[orbit_3s_linear_infinite]" />
          <div className="absolute inset-6 rounded-full border border-dashed border-accent/40 animate-[orbit_5s_linear_infinite_reverse]" />
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center shadow-lg shadow-accent/25 border border-accent/30 animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Text indicators */}
        <div className="space-y-3 w-full">
          <span className="text-[10px] font-extrabold uppercase text-accent tracking-widest bg-accent/10 px-3.5 py-1 rounded-full">
            ANALYSIS IN PROGRESS ({progressPercent}%)
          </span>
          <h2 className="text-2xl font-black text-foreground tracking-tight">
            Synthesizing Investment POV
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Please wait while our AI engine scrapes the website, maps competitors, sizes the market, and compiles your memo.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-secondary/80 border border-border/40 p-1 rounded-full h-4 overflow-hidden relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-accent to-orange-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step stack details */}
        <div className="w-full bg-card/60 border border-border/80 rounded-lg p-5 text-left space-y-3.5 shadow-sm max-w-md backdrop-blur-sm">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIdx
            const isActive = idx === currentStepIdx
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                  isCompleted ? "opacity-100" : isActive ? "opacity-100" : "opacity-30"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : isActive ? (
                  <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0 ml-1.5" />
                )}
                <span
                  className={
                    isActive
                      ? "text-accent font-bold animate-pulse"
                      : isCompleted
                      ? "text-muted-foreground font-medium"
                      : "text-muted-foreground"
                  }
                >
                  {step}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
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
          <div className="flex items-center justify-between gap-2 mb-3 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 animate-[fadeIn_0.2s_ease-out]">
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

    const cleanName = name.trim().toLowerCase()
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .replace(/\/+$/, "")
    const slug = cleanName.replace(/\.[a-z0-9]+$/i, "")

    if (COMPANIES_DATA[slug]) {
      setTimeout(() => {
        setResult(COMPANIES_DATA[slug] as any)
        setLoading(false)
      }, 600)
      return
    }

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
function HeroWithDashboard({
  analysisState
}: {
  analysisState: ReturnType<typeof useAnalysis>
}) {
  const { loading, error, analyze, brutalMode, toggleBrutalMode } = analysisState

  return (
    <>
      <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden bg-background">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        {/* Fine grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-secondary/80 border border-border/80 text-[10px] sm:text-xs font-normal rounded-full shadow-sm mb-6 sm:mb-8 flex-wrap justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-muted-foreground">AI-Powered VC Engine</span>
            <span className="text-border hidden sm:inline">|</span>
            <span className="text-foreground hidden sm:inline">1,240+ investor reports generated today</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-[56px] font-semibold tracking-tight mb-4 sm:mb-6 text-balance leading-[1.15] sm:leading-[1.1] text-foreground">
            Every startup, analyzed<br />
            like a <span className="bg-gradient-to-r from-accent to-orange-500 bg-clip-text text-transparent">VC partner</span> would.
          </h1>
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-[520px] mx-auto mb-8 sm:mb-10 text-balance">
            Paste a URL. Get a full investment memo with scores, competitor analysis, and a verdict in seconds.
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
    </>
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPercent, setScrollPercent] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Start growing when top of timeline is at 75% of viewport height
      // Stop growing when bottom of timeline is at 25% of viewport height
      const startThreshold = windowHeight * 0.75
      const endThreshold = windowHeight * 0.25
      
      const totalSpan = rect.height
      const currentProgress = startThreshold - rect.top
      
      let percent = (currentProgress / totalSpan) * 100
      percent = Math.max(0, Math.min(100, percent))
      setScrollPercent(percent)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
    // Run initial check
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  const steps = [
    {
      num: "01",
      title: "Paste any startup URL",
      description: "Drop in any company website. No forms, no complex decks.",
      element: (
        <div className="w-full max-w-sm flex flex-col gap-4 text-left">
          {/* Mock URL input bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border shadow-sm text-xs w-full">
            <Link2 className="w-4 h-4 text-accent shrink-0" />
            <TypingLoop />
            <span className="w-0.5 h-3.5 bg-accent animate-pulse ml-auto shrink-0" />
          </div>

          {/* Source tag pills */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-accent/10 border border-accent/20 text-[10px] font-normal text-accent shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-accent" />
              Landing Page
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-accent/10 border border-accent/20 text-[10px] font-normal text-accent shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-accent" />
              SEO Metadata
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-accent/10 border border-accent/20 text-[10px] font-normal text-accent shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-accent" />
              Core Subpages
            </span>
          </div>
        </div>
      )
    },
    {
      num: "02",
      title: "Direct web scraping",
      description: "We extract headers, clean tags, and scrape core paragraphs dynamically.",
      element: (
        <div className="relative w-full max-w-sm h-48 flex items-center justify-center">
          {/* Outer dotted circles */}
          <div className="absolute w-36 h-36 rounded-full border border-dashed border-border/80 animate-[orbit_12s_linear_infinite]" />
          <div className="absolute w-24 h-24 rounded-full border border-dashed border-accent/20 animate-[orbit_8s_linear_infinite_reverse]" />

          {/* Central Scraper Radar Core */}
          <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center shadow-lg shadow-accent/5 z-10 animate-pulse">
            <Globe className="w-5 h-5 text-accent" />
          </div>

          {/* Orbiting scrape tags */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded bg-card border border-border shadow flex items-center justify-center text-[10px] font-normal text-foreground">
            HTML
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded bg-card border border-border shadow flex items-center justify-center text-[10px] font-normal text-foreground">
            P
          </div>
          <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-card border border-border shadow flex items-center justify-center text-[10px] font-normal text-foreground">
            META
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-card border border-border shadow flex items-center justify-center text-[10px] font-normal text-foreground">
            H1
          </div>
        </div>
      )
    },
    {
      num: "03",
      title: "AI runs the analysis",
      description: "Gemini 3.5 Flash processes the context through multi-lens frameworks.",
      element: (
        <div className="w-full max-w-sm flex flex-col sm:flex-row gap-4 items-center relative text-left">
          {/* Raw Scraped Text Box */}
          <div className="flex-1 bg-card rounded-lg p-4 border border-border shadow-sm space-y-3 w-full">
            <div className="flex items-center gap-2 border-b border-border pb-2">
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-normal text-accent shrink-0">
                AI
              </div>
              <span className="text-[10px] font-normal text-foreground">POV_ENGINE</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              "Stripe is a technology company that builds economic infrastructure for the internet. Companies of every size use our software to accept payments..."
            </p>
            <div className="flex items-center gap-1.5 text-[9px] text-accent font-normal">
              <Loader2 className="w-3 h-3 animate-spin" />
              AI sorting...
            </div>
          </div>

          {/* Checklist framework tags */}
          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-border text-[9px] font-normal text-foreground bg-card shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Market Sizing
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-border text-[9px] font-normal text-foreground bg-card shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Competitor Map
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-border text-[9px] font-normal text-foreground bg-card shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              SWOT Quadrant
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-border text-[9px] font-normal text-foreground bg-card shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              Risk Severity
            </span>
          </div>
        </div>
      )
    },
    {
      num: "04",
      title: "Get your memo",
      description: "A comprehensive VC-grade report with scores, risks, and a verdict.",
      element: (
        <div className="w-full max-w-sm flex flex-col sm:flex-row items-center gap-6 text-left">
          {/* Score dial ring / verdict */}
          <div className="flex flex-col items-center gap-2 text-center shrink-0">
            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" stroke="var(--secondary)" strokeWidth="6" fill="none" />
                <circle cx="50" cy="50" r="44" stroke="var(--accent)" strokeWidth="6" strokeDasharray="276" strokeDashoffset="55" strokeLinecap="round" fill="none" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-normal text-foreground">80</span>
                <span className="text-[9px] text-muted-foreground">/ 100</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-emerald-100 border border-emerald-200 text-[9px] font-normal text-emerald-700 uppercase tracking-wider shadow-sm">
              STRONG BUY
            </span>
          </div>

          {/* Actions stack */}
          <div className="flex-1 grid grid-cols-2 gap-2 w-full">
            <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-accent hover:bg-accent/90 text-white text-[10px] font-normal shadow-sm shadow-accent/15 transition-all">
              <FileText className="w-3.5 h-3.5" />
              Export memo
            </button>
            <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-[10px] font-normal text-foreground shadow-sm transition-all">
              <ArrowRight className="w-3.5 h-3.5" />
              Download PDF
            </button>
            <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-[10px] font-normal text-foreground shadow-sm transition-all col-span-2">
              <Globe className="w-3.5 h-3.5" />
              Share with Partners
            </button>
          </div>
        </div>
      )
    }
  ]

  return (
    <section id="how-it-works" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-secondary/15 border-t border-b border-border/50 relative overflow-hidden">
      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-14 sm:mb-24 text-left">
          <span className="text-[11px] font-normal text-accent uppercase tracking-widest block mb-4">
            • FROM URL TO ACTION
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-[56px] font-semibold text-foreground tracking-tight leading-[1.1] sm:leading-[1.05] mb-4 sm:mb-6">
            From URL to <br />
            <span className="text-muted-foreground/60">investment memo in seconds.</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            InvestorPOV scrapes any startup website, filters semantic markup, and leverages Gemini 3.5 Flash to generate VC-grade investment reports instantly.
          </p>
        </div>
        
        {/* Timeline Steps Grid */}
        <div className="space-y-14 sm:space-y-24 relative" ref={containerRef}>
          {/* Main vertical line background */}
          <div className="hidden md:block absolute left-[4.17%] top-6 bottom-6 w-[1.5px] bg-border/60 -translate-x-[0.75px]" />
          
          {/* Main vertical line overlay progress color */}
          <div 
            className="hidden md:block absolute left-[4.17%] top-6 w-[1.5px] bg-accent -translate-x-[0.75px] transition-all duration-150 ease-out origin-top" 
            style={{ height: `${scrollPercent}%`, maxHeight: 'calc(100% - 48px)' }} 
          />

          {steps.map((step, idx) => {
            // Determine if active step based on scroll progress
            const isActive = (idx === 0) || 
                             (idx === 1 && scrollPercent >= 28) || 
                             (idx === 2 && scrollPercent >= 60) || 
                             (idx === 3 && scrollPercent >= 92);

            return (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 relative items-center">
                {/* Timeline Node Column (Width: 1/12 on md+) */}
                <div className="hidden md:flex md:col-span-1 justify-center items-start h-full relative">
                  {/* Circle step number indicator */}
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-normal z-10 bg-background transition-all duration-300 ${
                    isActive
                      ? "border-accent text-accent shadow-sm shadow-accent/15 scale-105"
                      : "border-border text-muted-foreground"
                  }`}>
                    {step.num}
                  </div>
                </div>

                {/* Text Details Column (Width: 5/12) */}
                <div className="md:col-span-5 space-y-3 text-left">
                  {/* Mobile indicator badge */}
                  <div className="flex md:hidden items-center gap-2 mb-2">
                    <span className="text-xs font-normal text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                      Step {step.num}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Interactive Illustration Column (Width: 6/12) */}
                <div className="md:col-span-6 flex justify-start md:justify-end">
                  {step.element}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Feature Bento Grid
function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-background relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto z-10 relative">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-20">
          <p className="text-sm font-normal text-accent uppercase tracking-wider mb-3">FULL REPORT BREAKDOWN</p>
          <h2 className="text-2xl sm:text-3xl md:text-[56px] font-semibold text-foreground tracking-tight text-balance">
            Six lenses. One clear verdict.
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 sm:gap-6">
          {/* Row 1: Business Fundamentals & Market Sizing */}
          <div className="sm:col-span-2 md:col-span-7 bg-card rounded-lg p-5 sm:p-6 border border-border/40 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-accent/15 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-foreground text-sm">Business Fundamentals</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                Core startup fundamentals structured into a linear VC logic model.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full bg-secondary/30 p-3 rounded-md border border-border/40">
              <span className="px-2.5 py-1 bg-card text-[10px] font-bold text-foreground border border-border rounded shadow-sm">Problem</span>
              <span className="text-muted-foreground text-xs font-semibold">➔</span>
              <span className="px-2.5 py-1 bg-card text-[10px] font-bold text-foreground border border-border rounded shadow-sm">Solution</span>
              <span className="text-muted-foreground text-xs font-semibold">➔</span>
              <span className="px-2.5 py-1 bg-card text-[10px] font-bold text-foreground border border-border rounded shadow-sm">Monetization</span>
            </div>
          </div>
          
          <div className="sm:col-span-2 md:col-span-5 bg-card rounded-lg p-5 sm:p-6 border border-border/40 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-accent/15 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-foreground text-sm">Market Opportunity</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                TAM, SAM, and SOM estimations calculated conservatively.
              </p>
            </div>
            <div className="space-y-2.5 w-full">
              {[
                { label: "TAM", value: "$420B", width: "100%" },
                { label: "SAM", value: "$42B", width: "50%" },
                { label: "SOM", value: "$4.2B", width: "15%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-muted-foreground w-8">{item.label}</span>
                  <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: item.width }} />
                  </div>
                  <span className="text-[10px] font-bold text-foreground w-12 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Row 2: Competitors, SWOT, Investment Scores */}
          <div className="md:col-span-4 bg-card rounded-lg p-6 border border-border/40 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-accent/15 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-foreground text-sm">Competitor Mapping</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Profile dynamics of identified players.
              </p>
            </div>
            <div className="space-y-2">
              {[
                { name: "Competitor A", level: "High", color: "text-red-700 bg-red-100/80" },
                { name: "Competitor B", level: "Med", color: "text-amber-700 bg-amber-100/80" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between text-[11px] p-2 bg-secondary/30 rounded border border-border/40">
                  <span className="text-muted-foreground font-semibold">{item.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${item.color}`}>{item.level}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-4 bg-card rounded-lg p-6 border border-border/40 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-accent/15 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-foreground text-sm">SWOT Analysis</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Internal dynamics and external factors.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { l: "S", bg: "bg-emerald-50 text-emerald-700 border-emerald-100" },
                { l: "W", bg: "bg-amber-50 text-amber-700 border-amber-100" },
                { l: "O", bg: "bg-blue-50 text-blue-700 border-blue-100" },
                { l: "T", bg: "bg-red-50 text-red-700 border-red-100" },
              ].map((item) => (
                <div key={item.l} className={`border rounded p-2 text-center font-bold text-xs ${item.bg}`}>
                  {item.l}
                </div>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-4 bg-card rounded-lg p-6 border border-border/40 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-accent/15 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-foreground text-sm">Investment Scores</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Key validation metrics evaluated.
              </p>
            </div>
            <div className="space-y-2">
              <ScoreBar label="Market" score={91} delay={0} />
              <ScoreBar label="Product" score={88} delay={100} />
            </div>
          </div>
          
          {/* Row 3: Risk Assessment & Final Verdict */}
          <div className="md:col-span-5 bg-card rounded-lg p-6 border border-border/40 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-accent/15 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-foreground text-sm">Risk Assessment</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Critical execution and market saturation alerts.
              </p>
            </div>
            <div className="space-y-2">
              {["High customer concentration", "Direct feature replication"].map((risk, i) => (
                <div key={i} className="flex items-center gap-2 text-xs p-2 bg-secondary/30 rounded border border-border/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-muted-foreground font-semibold">{risk}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="sm:col-span-2 md:col-span-7 bg-accent rounded-lg p-5 sm:p-6 border border-accent/20 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group">
            <div className="flex items-start justify-between z-10">
              <div>
                <div className="flex items-center gap-1 text-accent-foreground/75 font-semibold text-xs uppercase tracking-wider mb-2">
                  <span>Final Decision recommendation</span>
                </div>
                <h3 className="font-extrabold text-2xl text-accent-foreground leading-tight max-w-sm">
                  Structured investment signal recommendation sheet
                </h3>
              </div>
              <ArrowRight className="w-5 h-5 text-accent-foreground/70 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-4 z-10">
              <span className="text-xs text-accent-foreground/80 font-medium">Verdict summary tag</span>
              <span className="px-4 py-1.5 rounded bg-white text-[#FF6B2B] text-xs font-black shadow-lg">
                STRONG BUY
              </span>
            </div>
            {/* Background design */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
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
        "What takes analysts weeks to compile (including market sizing, competitor mapping, and risk scoring) is delivered in under a minute.",
    },
    {
      icon: <Database className="w-5 h-5 text-accent" />,
      title: "Data-driven conviction",
      description:
        "Every score, every verdict, and every risk flag is backed by structured reasoning. No hand-waving, no fluff: just signal.",
    },
    {
      icon: <Globe className="w-5 h-5 text-accent" />,
      title: "Works for any startup",
      description:
        "Paste any website URL. InvestorPOV extracts data dynamically, adapting to whatever context you have on a company.",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-accent" />,
      title: "Built for decision-makers",
      description:
        "Whether you're an angel, a VC partner, or a scout: get the clarity you need to say yes, no, or dig deeper.",
    },
  ]

  return (
    <section id="why-us" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column (Sticky info + stats) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 h-fit space-y-6 sm:space-y-8">
            <div>
              <p className="text-sm font-normal text-accent uppercase tracking-wider mb-3">
                WHY INVESTORPOV
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-[56px] font-semibold text-foreground leading-tight tracking-tight mb-4">
                Due diligence shouldn&apos;t take weeks.
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Most investors spend hours digging through decks, Crunchbase, and Google before forming an opinion. InvestorPOV gives you a structured, actionable analysis, instantly.
              </p>
            </div>
            
            {/* By the numbers (Integrated into Left Column) */}
            <div className="pt-8 border-t border-border/50 space-y-4">
              {[
                { stat: "1,000+", label: "startups analyzed" },
                { stat: "60 sec", label: "average analysis time" },
                { stat: "40+", label: "countries with active users" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-2xl font-extrabold text-foreground">{item.stat}</span>
                  <span className="text-sm text-muted-foreground font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Minimalist list stack) */}
          <div className="lg:col-span-7 space-y-6">
            {reasons.map((reason, idx) => (
              <div
                key={reason.title}
                className="group flex gap-5 p-6 rounded-lg bg-card border border-border/40 shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/5 border border-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/10 group-hover:border-accent/20 transition-colors">
                  {reason.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-accent transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Analysis Quality Chart card */}
            <div className="p-6 rounded-lg bg-card border border-border/40 shadow-sm relative overflow-hidden">
              <h3 className="font-bold text-foreground mb-1">Analysis quality</h3>
              <p className="text-xs text-muted-foreground mb-6">Compared to manual research</p>
              <div className="relative h-28">
                <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <path
                    d="M 0 80 Q 75 70 100 60 T 200 30 T 300 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-accent"
                    strokeLinecap="round"
                  />
                  <circle cx="300" cy="10" r="5" className="fill-accent animate-ping" />
                  <circle cx="300" cy="10" r="4" className="fill-accent" />
                </svg>
                <div className="absolute top-0 right-4 bg-foreground text-background text-[11px] px-2.5 py-1.5 rounded-lg font-bold shadow-lg">
                  +94% Analyst agreement
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Redesigned CTA Section matching the screenshot layout
function CtaSection({ analysisState }: { analysisState: any }) {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const domain = url.trim().replace(/^https?:\/\//i, "")
    
    if (!domain) {
      setError("Please enter a valid domain (e.g. stripe.com)")
      return
    }

    if (!domain.includes(".") || domain.includes(" ")) {
      setError("Please enter a valid domain (e.g. stripe.com)")
      return
    }

    setError("")
    analysisState.analyze(domain)
  }

  return (
    <section className="relative py-16 sm:py-28 px-4 sm:px-6 bg-background border-t border-border/40 overflow-hidden text-center">
      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto z-10">
        <span className="text-[11px] font-normal text-accent uppercase tracking-widest block mb-4">
          • START ANALYZING
        </span>
        
        <h2 className="text-3xl sm:text-4xl md:text-[56px] font-semibold text-foreground tracking-tight leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6">
          Ready to think like an investor?<br />
          <span className="text-muted-foreground/60">Start analyzing.</span>
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[480px] mx-auto mb-8 sm:mb-10 text-balance">
          AI-powered startup analysis that takes under 60 seconds. No complex forms. No pitch decks required.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto flex flex-col items-center gap-3">
          <div className="w-full bg-card rounded-2xl sm:rounded-full pl-4 sm:pl-5 pr-1.5 py-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 border border-border shadow-sm focus-within:border-accent/40 focus-within:shadow-[0_4px_24px_rgba(255,107,43,0.04)] transition-all duration-200">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter startup domain (e.g. stripe.com)"
                className="flex-1 text-sm text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/40 pr-2 sm:pr-4 py-2 sm:py-0"
              />
            </div>
            <button
              type="submit"
              className="bg-foreground hover:bg-foreground/90 text-background dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/95 px-6 py-2.5 rounded-full text-xs font-normal transition-all shrink-0 flex items-center justify-center gap-1.5"
            >
              Start analyzing
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {error && (
            <span className="text-xs text-red-500 mt-1 animate-[fadeIn_0.2s_ease-out]">
              {error}
            </span>
          )}
        </form>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="relative pt-14 sm:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 bg-card border-t border-border/50 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Footer grid */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 sm:gap-10 mb-10 sm:mb-14">
          {/* Brand column */}
          <div className="max-w-sm">
            <a href="/" className="flex items-center gap-2 text-xl font-bold text-foreground tracking-tight">
              <img src="/icon.png" alt="InvestorPOV Logo" className="w-6 h-6 object-contain shrink-0" />
              <span>InvestorPOV</span>
            </a>
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
              <li><a href="/company" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Popular Brands</a></li>
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
  const analysisState = useAnalysis()
  const { result, clear, loading } = analysisState

  return (
    <main className="min-h-screen bg-background">
      {result ? (
        <Report data={result} onClose={clear} />
      ) : loading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Navigation />
          <HeroWithDashboard analysisState={analysisState} />
          <HowItWorksSection />
          <FeaturesSection />
          <WhyInvestorPOV />
          <CtaSection analysisState={analysisState} />
          <Footer />
        </>
      )}
      
      <style jsx global>{`
        @keyframes orbit {
          from { transform: translateX(-50%) rotate(0deg); }
          to { transform: translateX(-50%) rotate(360deg); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </main>
  )
}
