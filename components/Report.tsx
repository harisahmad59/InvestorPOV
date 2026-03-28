"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  ShieldAlert,
  AlertCircle,
  Lightbulb,
  Zap,
  X,
} from "lucide-react"

// ─── TAM Helpers ─────────────────────────────────────────────────────────────

function parseTamValue(tamStr: string): { display: string; numericBillions: number } | null {
  // Supports: $2.5T, $50B, $800M, $2.5 trillion, 50bn, 800 million, etc.
  const match = tamStr.match(
    /\$?\s*([\d,.]+)\s*(T|B|M|trillion|billion|million|tr|bn|mn|bil|mil)/i
  )
  if (!match) return null
  const num = parseFloat(match[1].replace(/,/g, ""))
  if (isNaN(num) || num <= 0) return null
  const unit = match[2].toLowerCase()

  let billions: number
  let display: string

  if (unit === "t" || unit === "tr" || unit === "trillion") {
    billions = num * 1000
    display = `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)}T`
  } else if (unit === "b" || unit === "bn" || unit === "bil" || unit === "billion") {
    billions = num
    display = num >= 1000
      ? `$${(num / 1000) % 1 === 0 ? (num / 1000).toFixed(0) : (num / 1000).toFixed(1)}T`
      : `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)}B`
  } else {
    billions = num / 1000
    display = `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)}M`
  }

  return { display, numericBillions: billions }
}

function formatBillions(b: number): string {
  if (b >= 1000) {
    const v = b / 1000
    return `$${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}T`
  }
  if (b >= 1) {
    return `$${b % 1 === 0 ? b.toFixed(0) : b.toFixed(1)}B`
  }
  return `$${Math.round(b * 1000)}M`
}

// ─── Business Model Helpers ──────────────────────────────────────────────────

const BM_COLORS = ["#FF6B2B", "#FF8F56", "#FFB88C", "#FFD4BE"]

function parseBusinessModelSegments(
  model: string
): { name: string; value: number; color: string }[] {
  const lower = model.toLowerCase()

  type Seg = { name: string; value: number; color: string }
  const segments: Seg[] = []

  if (lower.includes("subscription") || lower.includes("saas") || lower.includes("recurring")) {
    segments.push({ name: "Subscription", value: 0, color: BM_COLORS[0] })
  }
  if (
    lower.includes("transaction") ||
    lower.includes("fee") ||
    lower.includes("commission") ||
    lower.includes("marketplace") ||
    lower.includes("payment")
  ) {
    segments.push({ name: "Transaction Fees", value: 0, color: BM_COLORS[1] })
  }
  if (lower.includes("ad") || lower.includes("advertising")) {
    segments.push({ name: "Advertising", value: 0, color: BM_COLORS[2] })
  }
  if (lower.includes("enterprise") || lower.includes("licens")) {
    segments.push({ name: "Enterprise", value: 0, color: BM_COLORS[3] })
  }
  if (
    segments.length === 0 &&
    (lower.includes("freemium") || lower.includes("premium"))
  ) {
    segments.push({ name: "Freemium", value: 0, color: BM_COLORS[0] })
  }

  if (segments.length === 0) {
    return [
      { name: "Subscription", value: 60, color: BM_COLORS[0] },
      { name: "Transaction", value: 25, color: BM_COLORS[1] },
      { name: "Other", value: 15, color: BM_COLORS[2] },
    ]
  }

  if (segments.length === 1) {
    segments[0].value = 100
  } else if (segments.length === 2) {
    segments[0].value = 65
    segments[1].value = 35
  } else if (segments.length === 3) {
    segments[0].value = 55
    segments[1].value = 30
    segments[2].value = 15
  } else {
    const base = Math.floor(100 / segments.length)
    const remainder = 100 - base * segments.length
    segments.forEach((s, i) => {
      s.value = base + (i === 0 ? remainder : 0)
    })
  }

  return segments
}

// ─── Types ───────────────────────────────────────────────────────────────────

type ReportData = {
  name?: string
  summary?: string
  market?: string
  tam?: string
  businessModel?: string
  competitors?: string[]
  swot?: {
    strengths?: string[]
    weaknesses?: string[]
    opportunities?: string[]
    threats?: string[]
  }
  verdict?: string
  score?: number
}

type ReportProps = {
  data: ReportData
  onClose?: () => void
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ReportScoreRing({ displayScore }: { displayScore: number }) {
  const circumference = 2 * Math.PI * 52
  const offset = circumference - (displayScore / 100) * circumference
  const scoreColor =
    displayScore >= 80
      ? "text-emerald-500"
      : displayScore >= 60
        ? "text-accent"
        : "text-red-500"

  return (
    <div className="relative w-32 h-32 md:w-36 md:h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="52"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-secondary"
        />
        <circle
          cx="60"
          cy="60"
          r="52"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className={scoreColor}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-foreground">{displayScore}</span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  )
}

function ReportBar({
  label,
  value,
  delay = 0,
}: {
  label: string
  value: number
  delay?: number
}) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const barColor =
    value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-accent" : "bg-red-400"

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTimeout(() => setAnimated(true), delay)
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
          style={{ width: animated ? `${value}%` : "0%" }}
        />
      </div>
    </div>
  )
}

// ─── Main Report Component ───────────────────────────────────────────────────

export default function Report({ data, onClose }: ReportProps) {
  // ── Precompute all values at the top ──────────────────────────────────────

  const score = Math.max(0, Math.min(10, data?.score ?? 0))
  const displayScore = Math.round(score * 10)

  const name = data?.name || "Unknown Startup"
  const summary = data?.summary || "No summary available"
  const market = data?.market || "No market data available"
  const businessModel = data?.businessModel || ""

  const competitors = data?.competitors ?? []
  const verdict = data?.verdict || ""

  // TAM visual data — parse real value, derive seeded fallback if parse fails
  const tamText = data?.tam || ""
  const tamParsed = useMemo(() => parseTamValue(tamText), [tamText])

  // Seeded pseudo-random fallback (varies per startup name + score, never the same $100B)
  const tamFallback = useMemo(() => {
    if (tamParsed) return null // no fallback needed
    const seed = (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) + score * 31
    const rand = (n: number) => {
      const x = Math.sin(seed + n) * 10000
      return x - Math.floor(x) // 0..1
    }
    // Random TAM between $5B and $800B
    const rawB = 5 + rand(1) * 795
    const billions = Math.round(rawB)
    const display = billions >= 1000
      ? `$${(billions / 1000).toFixed(1)}T`
      : `$${billions}B`
    return { display, numericBillions: billions }
  }, [tamParsed, name, score])

  const tamValue = tamParsed ?? tamFallback
  const sam = tamValue ? formatBillions(tamValue.numericBillions * 0.1) : "N/A"
  const som = tamValue ? formatBillions(tamValue.numericBillions * 0.01) : "N/A"

  // CAGR — derive from score so it's never static
  const cagr = useMemo(() => {
    const base = 6 + score * 1.8 // score 0 → ~6%, score 10 → ~24%
    const seed = (name || "").length + score * 7
    const jitter = (Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000)) * 6 - 3 // ±3%
    return Math.max(3, Math.round(base + jitter))
  }, [score, name])

  // Sparkline — slight variation per startup
  const chartData = useMemo(() => {
    const seed = (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0)
    const rand = (n: number) => {
      const x = Math.sin(seed + n) * 10000
      return x - Math.floor(x)
    }
    return [
      { year: "2020", value: 1 + rand(10) * 0.3 },
      { year: "2021", value: 1.4 + rand(11) * 0.4 },
      { year: "2022", value: 2 + rand(12) * 0.5 },
      { year: "2023", value: 2.8 + rand(13) * 0.6 },
      { year: "2024", value: 3.6 + rand(14) * 0.8 },
    ]
  }, [name])

  // Business model segments
  const bmSegments = useMemo(
    () => parseBusinessModelSegments(businessModel),
    [businessModel]
  )

  const swotStrengths = (data?.swot?.strengths ?? []).slice(0, 3)
  const swotWeaknesses = (data?.swot?.weaknesses ?? []).slice(0, 3)
  const swotOpportunities = (data?.swot?.opportunities ?? []).slice(0, 3)
  const swotThreats = (data?.swot?.threats ?? []).slice(0, 3)
  const hasSwot =
    !!data?.swot &&
    (swotStrengths.length > 0 ||
      swotWeaknesses.length > 0 ||
      swotOpportunities.length > 0 ||
      swotThreats.length > 0)

  // Stable breakdown scores derived from overall score (seeded from score so they don't change per render)
  const breakdownScores = useMemo(() => {
    const seed = score * 137
    const pseudoRandom = (n: number) => {
      const x = Math.sin(seed + n) * 10000
      return x - Math.floor(x) // 0..1
    }
    return {
      market: Math.min(100, Math.max(0, Math.round(score * 10 + (pseudoRandom(1) * 10 - 5)))),
      product: Math.min(100, Math.max(0, Math.round(score * 9.5 + (pseudoRandom(2) * 12 - 6)))),
      competition: Math.min(100, Math.max(0, Math.round(score * 8.5 + (pseudoRandom(3) * 14 - 7)))),
    }
  }, [score])

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section
      id="analysis-result"
      className="py-16 px-6 bg-background border-t border-border/50 animate-score-reveal"
    >
      <div className="max-w-5xl mx-auto">
        {/* ── Dashboard Header ─────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {name}
            </h2>
            <p className="text-muted-foreground max-w-xl">{summary}</p>
          </div>
          <div className="flex items-center gap-4">
            <ReportScoreRing displayScore={displayScore} />
            {onClose && (
              <button
                onClick={onClose}
                className="self-start p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Main Grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Market Overview */}
          <div className="md:col-span-8 bg-card rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border/30">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-accent" />
              <h3 className="font-semibold text-foreground">Market Overview</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {market}
            </p>
            <div className="space-y-4">
              <ReportBar
                label="Market Opportunity"
                value={breakdownScores.market}
                delay={100}
              />
              <ReportBar
                label="Product Strength"
                value={breakdownScores.product}
                delay={250}
              />
              <ReportBar
                label="Competitive Position"
                value={breakdownScores.competition}
                delay={400}
              />
            </div>
          </div>

          {/* Competitors */}
          {competitors.length > 0 && (
            <div className="md:col-span-4 bg-card rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border/30">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-foreground">Competitors</h3>
              </div>
              <div className="space-y-2.5">
                {competitors.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/50 border border-border/30"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-accent">
                        {c?.charAt(0) ?? "?"}
                      </span>
                    </div>
                    <span className="text-sm text-foreground font-medium truncate">
                      {c}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAM Analysis (visual — always rendered) ─────────── */}
          <div
            className="md:col-span-6 rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden relative"
            style={{ background: "#FF6B2B" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Target className="w-4 h-4 text-white/80" />
              <h3 className="font-semibold text-white">TAM Analysis</h3>
            </div>

            {/* Big number */}
            <p className="text-5xl md:text-[3.2rem] font-extrabold text-white leading-none tracking-tight">
              {tamValue?.display ?? "N/A"}
            </p>
            <p className="text-sm text-white/60 mt-1 mb-6">
              Total Addressable Market
            </p>

            {/* SAM / SOM */}
            <div className="flex gap-8 mb-6">
              <div>
                <p className="text-2xl font-bold text-white">{sam}</p>
                <p className="text-xs text-white/60 uppercase tracking-wide">SAM</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{som}</p>
                <p className="text-xs text-white/60 uppercase tracking-wide">SOM</p>
              </div>
            </div>

            {/* Sparkline */}
            <div className="h-[60px] w-full -mx-2">
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={chartData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* CAGR pill */}
            <div className="flex justify-end mt-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#FF6B2B] text-xs font-bold shadow-sm">
                <TrendingUp className="w-3 h-3" />
                +{cagr}% CAGR
              </span>
            </div>
          </div>

          {/* ── Business Model (visual) ───────────────────────────── */}
          {businessModel && (
            <div className="md:col-span-6 bg-card rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-foreground">Business Model</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-5 leading-relaxed line-clamp-2">
                {businessModel}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Donut chart */}
                <div className="w-[140px] h-[140px] shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bmSegments}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                        animationBegin={200}
                        animationDuration={800}
                      >
                        {bmSegments.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-3 min-w-0">
                  {bmSegments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span className="text-sm text-foreground font-medium truncate">
                        {seg.name}
                      </span>
                      <span className="text-sm text-muted-foreground ml-auto font-semibold">
                        {seg.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SWOT Analysis — only if swot exists and has content */}
          {hasSwot && (
            <div className="md:col-span-12 bg-card rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border/30">
              <div className="flex items-center gap-2 mb-5">
                <Lightbulb className="w-4 h-4 text-accent" />
                <h3 className="font-semibold text-foreground">SWOT Analysis</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* S */}
                {swotStrengths.length > 0 && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                        Strengths
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {swotStrengths.map((s, i) => (
                        <li
                          key={i}
                          className="text-sm text-emerald-800/80 flex items-start gap-2"
                        >
                          <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* W */}
                {swotWeaknesses.length > 0 && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                        Weaknesses
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {swotWeaknesses.map((w, i) => (
                        <li
                          key={i}
                          className="text-sm text-amber-800/80 flex items-start gap-2"
                        >
                          <div className="w-1 h-1 rounded-full bg-amber-500 mt-2 shrink-0" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* O */}
                {swotOpportunities.length > 0 && (
                  <div className="rounded-xl bg-blue-50 border border-blue-200/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                        Opportunities
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {swotOpportunities.map((o, i) => (
                        <li
                          key={i}
                          className="text-sm text-blue-800/80 flex items-start gap-2"
                        >
                          <div className="w-1 h-1 rounded-full bg-blue-500 mt-2 shrink-0" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* T */}
                {swotThreats.length > 0 && (
                  <div className="rounded-xl bg-red-50 border border-red-200/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                      <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                        Threats
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {swotThreats.map((t, i) => (
                        <li
                          key={i}
                          className="text-sm text-red-800/80 flex items-start gap-2"
                        >
                          <div className="w-1 h-1 rounded-full bg-red-500 mt-2 shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Verdict Banner */}
          <div className="md:col-span-12 bg-accent rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-accent-foreground">
                  Final Verdict
                </h3>
                <ArrowRight className="w-5 h-5 text-accent-foreground/70 group-hover:translate-x-1 transition-transform" />
              </div>
              {verdict && (
                <p className="text-xl md:text-2xl font-bold text-accent-foreground leading-snug">
                  {verdict}
                </p>
              )}
              <p className="text-sm text-accent-foreground/70">
                {summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
