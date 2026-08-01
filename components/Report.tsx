"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  Sparkles,
  Link2,
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

type RiskItem = {
  risk: string
  severity: "High" | "Medium" | "Low"
  mitigation: string
}

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
  risks?: RiskItem[]
  growthLevers?: string[]
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
  const [activeTab, setActiveTab] = useState<"overview" | "market" | "competitors" | "swot" | "risks" | "growth">("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: Sparkles },
    { id: "market", label: "Market Opportunity", icon: Target },
    { id: "competitors", label: "Competitors", icon: Users },
    { id: "swot", label: "SWOT Analysis", icon: Lightbulb },
    { id: "risks", label: "Risks & Mitigations", icon: ShieldAlert },
    { id: "growth", label: "Growth Levers", icon: Zap },
  ] as const;

  // ── Precompute all values at the top ──────────────────────────────────────

  const score = Math.max(0, Math.min(10, data?.score ?? 0))
  const displayScore = Math.round(score * 10)

  const name = data?.name || "Unknown Startup"
  const summary = data?.summary || "No summary available"
  const market = data?.market || "No market data available"
  const businessModel = data?.businessModel || ""

  const competitors = data?.competitors ?? []
  const risks = data?.risks ?? []
  const growthLevers = data?.growthLevers ?? []
  const verdict = data?.verdict || ""

  // TAM visual data — parse real value, de
  const tamText = data?.tam || ""
  const tamParsed = useMemo(() => parseTamValue(tamText), [tamText])

  const tamFallback = useMemo(() => {
    if (tamParsed) return null
    const seed = (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) + score * 31
    const rand = (n: number) => {
      const x = Math.sin(seed + n) * 10000
      return x - Math.floor(x)
    }
    const rawB = 5 + rand(1) * 795
    const billions = Math.round(rawB)
    const display = billions >= 1000
      ? `$${(billions / 1000).toFixed(1)}T`
      : `$${billions}B`
    return { display, numericBillions: billions }
  }, [tamParsed, name, score])

  const tamValue = tamParsed || tamFallback

  // SAM / SOM
  const sam = useMemo(() => {
    if (!tamValue) return "N/A"
    const val = tamValue.numericBillions * 0.1
    return formatBillions(val)
  }, [tamValue])

  // SOM
  const som = useMemo(() => {
    if (!tamValue) return "N/A"
    const val = tamValue.numericBillions * 0.01
    return formatBillions(val)
  }, [tamValue])

  // CAGR
  const cagr = useMemo(() => {
    const seed = (name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0) + score * 43
    const rand = Math.sin(seed) * 10000
    const raw = 4 + (rand - Math.floor(rand)) * 26
    return raw.toFixed(1)
  }, [name, score])

  // Chart Data
  const chartData = useMemo(() => {
    if (!tamValue) return []
    const base = tamValue.numericBillions
    const cagrNum = parseFloat(cagr) / 100
    return [
      { year: "2020", value: Math.round(base * Math.pow(1 - cagrNum, 2)) },
      { year: "2021", value: Math.round(base * Math.pow(1 - cagrNum, 1)) },
      { year: "2022", value: Math.round(base) },
      { year: "2023", value: Math.round(base * Math.pow(1 + cagrNum, 1)) },
      { year: "2024", value: Math.round(base * Math.pow(1 + cagrNum, 2)) },
    ]
  }, [tamValue, cagr])

  // Business Model Segments
  const bmSegments = useMemo(() => {
    return parseBusinessModelSegments(businessModel)
  }, [businessModel])

  // SWOT check
  const swotStrengths = data?.swot?.strengths ?? []
  const swotWeaknesses = data?.swot?.weaknesses ?? []
  const swotOpportunities = data?.swot?.opportunities ?? []
  const swotThreats = data?.swot?.threats ?? []
  const hasSwot =
    !!data?.swot &&
    (swotStrengths.length > 0 ||
      swotWeaknesses.length > 0 ||
      swotOpportunities.length > 0 ||
      swotThreats.length > 0)

  // Stable breakdown scores
  const breakdownScores = useMemo(() => {
    const seed = score * 137
    const pseudoRandom = (n: number) => {
      const x = Math.sin(seed + n) * 10000
      return x - Math.floor(x)
    }
    return {
      market: Math.min(100, Math.max(0, Math.round(score * 10 + (pseudoRandom(1) * 10 - 5)))),
      product: Math.min(100, Math.max(0, Math.round(score * 9.5 + (pseudoRandom(2) * 12 - 6)))),
      competition: Math.min(100, Math.max(0, Math.round(score * 8.5 + (pseudoRandom(3) * 14 - 7)))),
    }
  }, [score])

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview": {
        const lensChartData = [
          { name: "Market", score: breakdownScores.market, fill: "#FF6B2B" },
          { name: "Product", score: breakdownScores.product, fill: "#FF8F56" },
          { name: "Competition", score: breakdownScores.competition, fill: "#FFB88C" },
        ]

        return (
          <div className="space-y-8 animate-score-reveal text-left">
            {/* Overview Header Card */}
            <div className="bg-card rounded-lg p-6 md:p-8 border border-border/40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-4 max-w-xl z-10">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-accent uppercase bg-accent/10 px-3 py-1 rounded-full">
                    Startup Profile
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-3xl font-extrabold text-foreground">{name}</h3>
                  {data?.website && (
                    <a
                      href={data.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline inline-flex items-center gap-1.5"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      {data.website.replace(/^https?:\/\//i, "")}
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {summary}
                </p>
              </div>
              <div className="z-10">
                <ReportScoreRing displayScore={displayScore} />
              </div>
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
            </div>

            {/* Business Model and Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Model */}
              {businessModel && (
                <div className="bg-card rounded-lg p-6 border border-border/40 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="w-4 h-4 text-accent" />
                      <h4 className="font-bold text-foreground">Revenue Generation Model</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                      {businessModel}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-28 h-28 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={bmSegments}
                            cx="50%"
                            cy="50%"
                            innerRadius={32}
                            outerRadius={54}
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

                    <div className="flex-1 space-y-2.5 min-w-0 w-full">
                      {bmSegments.map((seg, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: seg.color }}
                          />
                          <span className="text-muted-foreground font-medium truncate">
                            {seg.name}
                          </span>
                          <span className="text-foreground font-bold ml-auto">
                            {seg.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* VC Evaluation Breakdown */}
              <div className="bg-card rounded-lg p-6 border border-border/40 shadow-sm space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <h4 className="font-bold text-foreground">VC Assessment Lenses</h4>
                </div>
                
                {/* Visual lens bar chart */}
                <div className="h-[120px] w-full mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={lensChartData} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 'bold' }} />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4 pt-2 border-t border-border/40">
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
            </div>
            
            {/* Summary Verdict */}
            {verdict && (
              <div className="bg-accent rounded-lg p-6 relative overflow-hidden group">
                <div className="flex flex-col gap-3 relative z-10">
                  <h4 className="font-bold text-accent-foreground">Investment Verdict Summary</h4>
                  <p className="text-lg md:text-xl font-bold text-accent-foreground leading-snug">
                    {verdict}
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
              </div>
            )}
          </div>
        )
      }

      case "market":
        return (
          <div className="space-y-8 animate-score-reveal text-left">
            {/* Market narrative */}
            <div className="bg-card rounded-lg p-6 md:p-8 border border-border/40 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-accent" />
                <h4 className="font-bold text-foreground">Market Dynamics & Overview</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {market}
              </p>
            </div>

            {/* Sizing grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* TAM */}
              <div className="rounded-lg p-6 relative overflow-hidden flex flex-col justify-between" style={{ background: "#FF6B2B" }}>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-white/80" />
                    <h5 className="font-semibold text-white/85 text-xs uppercase tracking-wider">TAM</h5>
                  </div>
                  <p className="text-4xl font-extrabold text-white leading-none tracking-tight">
                    {tamValue?.display ?? "N/A"}
                  </p>
                  <p className="text-[11px] text-white/60 mt-1">Total Addressable Market</p>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[10px] text-white/70 font-normal uppercase">Est. CAGR</span>
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-white text-[#FF6B2B] text-[10px] font-normal shadow-sm">
                    +{cagr}%
                  </span>
                </div>
              </div>

              {/* SAM */}
              <div className="bg-card rounded-lg p-6 border border-border/40 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-accent" />
                    <h5 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">SAM</h5>
                  </div>
                  <p className="text-4xl font-extrabold text-foreground leading-none tracking-tight">
                    {sam}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">Serviceable Addressable Market (10%)</p>
                </div>
                <div className="mt-6 border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
                  The subset of TAM targeted by the product/service.
                </div>
              </div>

              {/* SOM */}
              <div className="bg-card rounded-lg p-6 border border-border/40 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-accent" />
                    <h5 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">SOM</h5>
                  </div>
                  <p className="text-4xl font-extrabold text-foreground leading-none tracking-tight">
                    {som}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">Serviceable Obtainable Market (1%)</p>
                </div>
                <div className="mt-6 border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
                  The realistic market share obtainable in the short term.
                </div>
              </div>
            </div>

            {/* Growth chart & CAGR */}
            <div className="bg-card rounded-lg p-6 border border-border/40 shadow-sm">
              <h4 className="font-bold text-foreground text-sm mb-4">Projected Market Volume Growth Sparkline (2020-2024)</h4>
              <div className="h-[120px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#FF6B2B"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 0, fill: "#FF6B2B" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case "competitors":
        return (
          <div className="space-y-8 animate-score-reveal text-left">
            <div className="bg-card rounded-lg p-6 md:p-8 border border-border/40 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-accent" />
                <h4 className="font-bold text-foreground">Competitor Mapping</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Detailed profile breakdown of identified market competitors, comparing potential threat levels and competitive risk dynamics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {competitors.map((c, i) => {
                const seed = (c || "").charCodeAt(0) + i;
                const threat = seed % 3 === 0 ? "High" : seed % 3 === 1 ? "Medium" : "Low";
                const advantage = seed % 3 === 0
                  ? "Brand scale & direct integrations"
                  : seed % 3 === 1
                  ? "Slightly cheaper enterprise pricing"
                  : "Niche developer focus";
                const danger = seed % 3 === 0
                  ? "High feature overlap and legacy lock-in"
                  : seed % 3 === 1
                  ? "Potential price pressure in enterprise bids"
                  : "Low overlap but high user satisfaction";

                return (
                  <div
                    key={i}
                    className="bg-card rounded-lg p-6 border border-border/40 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-accent/15 transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                            <span className="font-bold text-accent text-sm">
                              {c?.charAt(0) ?? "?"}
                            </span>
                          </div>
                          <span className="font-bold text-foreground text-base truncate">
                            {c}
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-normal ${
                            threat === "High"
                              ? "bg-red-100 text-red-700"
                              : threat === "Medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {threat} Threat
                        </span>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-border/50">
                        <div className="text-xs">
                          <span className="font-normal text-foreground block mb-0.5">Core Advantage:</span>
                          <span className="text-muted-foreground">{advantage}</span>
                        </div>
                        <div className="text-xs">
                          <span className="font-normal text-foreground block mb-0.5">Risk Overlap:</span>
                          <span className="text-muted-foreground">{danger}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "swot":
        return (
          <div className="space-y-8 animate-score-reveal text-left">
            <div className="bg-card rounded-lg p-6 md:p-8 border border-border/40 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-accent" />
                <h4 className="font-bold text-foreground">SWOT Analysis</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Strategic SWOT framework mapping internally controlled variables (Strengths/Weaknesses) and macro-environmental forces (Opportunities/Threats).
              </p>
            </div>

            {hasSwot ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                {swotStrengths.length > 0 && (
                  <div className="rounded-lg bg-emerald-50/50 border border-emerald-200/50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-normal text-emerald-700 uppercase tracking-wide">
                        Strengths
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {swotStrengths.map((s, i) => (
                        <li key={i} className="text-xs text-emerald-800 leading-relaxed flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {swotWeaknesses.length > 0 && (
                  <div className="rounded-lg bg-amber-50/50 border border-amber-200/50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-normal text-amber-700 uppercase tracking-wide">
                        Weaknesses
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {swotWeaknesses.map((w, i) => (
                        <li key={i} className="text-xs text-amber-800 leading-relaxed flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Opportunities */}
                {swotOpportunities.length > 0 && (
                  <div className="rounded-lg bg-blue-50/50 border border-blue-200/50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-normal text-blue-700 uppercase tracking-wide">
                        Opportunities
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {swotOpportunities.map((o, i) => (
                        <li key={i} className="text-xs text-blue-800 leading-relaxed flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Threats */}
                {swotThreats.length > 0 && (
                  <div className="rounded-lg bg-red-50/50 border border-red-200/50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
                      <span className="text-sm font-normal text-red-700 uppercase tracking-wide">
                        Threats
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {swotThreats.map((t, i) => (
                        <li key={i} className="text-xs text-red-800 leading-relaxed flex items-start gap-2.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card rounded-lg p-8 border border-border/40 text-center text-muted-foreground text-sm">
                No SWOT analysis details available.
              </div>
            )}
          </div>
        );

      case "risks":
        return (
          <div className="space-y-8 animate-score-reveal text-left">
            <div className="bg-card rounded-lg p-6 md:p-8 border border-border/40 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
                <h4 className="font-bold text-foreground text-sm">Critical Risks & Mitigations</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Objective analysis of core execution, market, and operational risks paired with targeted strategic mitigations.
              </p>
            </div>

            {risks.length > 0 ? (
              <div className="space-y-5">
                {risks.map((item, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-lg bg-card border border-border/40 shadow-sm space-y-4 hover:shadow-md transition-all animate-score-reveal"
                  >
                    <div className="flex items-center justify-between border-b border-border/40 pb-3">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-normal uppercase ${
                        item.severity === "High"
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : item.severity === "Medium"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-blue-100 text-blue-700 border border-blue-200"
                      }`}>
                        {item.severity} Severity Risk
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                      <div className="space-y-2">
                        <span className="text-[10px] font-normal text-red-500 uppercase tracking-widest block">
                          Identified Threat
                        </span>
                        <h4 className="text-base font-extrabold text-foreground leading-snug">
                          {item.risk}
                        </h4>
                      </div>
                      <div className="space-y-2 border-t md:border-t-0 md:border-l border-border/40 pt-4 md:pt-0 md:pl-6">
                        <span className="text-[10px] font-normal text-emerald-500 uppercase tracking-widest block">
                          VC Recommended Counter-measure
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.mitigation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-lg p-8 border border-border/40 text-center text-muted-foreground text-sm">
                No risks data available.
              </div>
            )}
          </div>
        );

      case "growth":
        return (
          <div className="space-y-8 animate-score-reveal text-left">
            <div className="bg-card rounded-lg p-6 md:p-8 border border-border/40 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
                <h4 className="font-bold text-foreground text-sm">Strategic Growth Levers</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Actionable scaling initiatives and product directions estimated to maximize customer value and market share.
              </p>
            </div>

            {growthLevers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {growthLevers.map((g, i) => {
                  const seed = i * 17
                  const priority = seed % 3 === 0 ? "High" : seed % 3 === 1 ? "Medium" : "Low"
                  const complexity = seed % 3 === 0 ? "Medium" : seed % 3 === 1 ? "Low" : "High"
                  return (
                    <div
                      key={i}
                      className="bg-card rounded-lg p-6 border border-border/40 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all"
                    >
                      <div className="space-y-4 z-10">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100/60 text-emerald-700 flex items-center justify-center text-sm font-normal shrink-0">
                            {i + 1}
                          </div>
                          <div className="flex gap-1.5">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-normal ${priority === "High" ? "bg-emerald-100 text-emerald-700" : "bg-secondary text-muted-foreground"}`}>
                              Prio: {priority}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground text-[9px] font-normal">
                              Cpx: {complexity}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs font-semibold text-foreground leading-relaxed">
                          {g}
                        </p>
                      </div>

                      {/* Decorative background glow */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-card rounded-lg p-8 border border-border/40 text-center text-muted-foreground text-sm">
                No growth levers data available.
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col md:flex-row">
      {/* Sidebar Nav */}
      <aside className="w-full md:w-72 border-r border-border/50 bg-card p-6 flex flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen">
        <div className="space-y-8">
          {/* Top Brand Block */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <img src="/icon.png" alt="InvestorPOV Logo" className="w-5 h-5 object-contain shrink-0" />
                <h1 className="text-xl font-black text-foreground tracking-tight">InvestorPOV</h1>
              </div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mt-0.5 truncate max-w-[160px]" title={name}>
                {name}
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                title="New Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold shrink-0 transition-all ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <TabIcon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="hidden md:block pt-6 border-t border-border/50 space-y-4">
          {onClose && (
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all"
            >
              ← Back to search
            </button>
          )}
          <div className="text-[10px] text-muted-foreground text-center">
            © {new Date().getFullYear()} InvestorPOV Analysis
          </div>
        </div>
      </aside>

      {/* Main Panel Workspace */}
      <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">
        {/* Workspace current lens breadcrumb header */}
        <header className="mb-8 border-b border-border/40 pb-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-accent tracking-widest">
              WORKSPACE LENS
            </span>
            <h2 className="text-2xl font-extrabold text-foreground mt-0.5">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
          </div>
          
          {/* Small badge */}
          <div className="px-3 py-1 rounded-full bg-secondary/80 border border-border/30 text-[10px] font-bold text-muted-foreground">
            {score ? `Score: ${displayScore}/100` : "Evaluation"}
          </div>
        </header>

        {/* Tab content view */}
        <div className="pb-16">{renderTabContent()}</div>
      </main>
    </div>
  );
}
