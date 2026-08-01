export interface RiskItem {
  risk: string
  severity: "High" | "Medium" | "Low"
  mitigation: string
}

export interface SwotData {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

export interface AnalysisData {
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
  website?: string
}

export const TRUSTMRR_REPORT_DATA: AnalysisData = {
  name: "TrustMRR",
  score: 8.8,
  website: "https://trustmrr.com",
  verdict: "STRONG BUY. Exceptional capital efficiency with an 85% profit margin and a one-person team. Distribution is backed by Marc Lou's audience of 367K+ followers on X. Long-term defensibility relies on developing network effects as the largest verified revenue database.",
  summary: "TrustMRR enables founders to publicly verify their Stripe revenue and showcase it as a trust signal. Instead of saying 'We are doing $20k MRR', founders can prove it. TrustMRR helps SaaS companies solve the lack of traction proof, verify revenue for investors, and address customer doubts about marketing claims. It operates a verified startup revenue marketplace model.",
  market: "Verified Startup Revenue Marketplace. TrustMRR targets bootstrapped founders, SaaS founders, indie hackers, and AI startups who want to publicly verify their Stripe traction, with secondary audiences including agencies, startup directories, communities, and angel investors.",
  tam: "Total Addressable Market (TAM) is estimated at $15B-25B+, representing global businesses (SaaS, eCommerce, agencies, creators) needing trust signals. Serviceable Available Market (SAM) includes Stripe-based SaaS startups worldwide, estimated at 500,000+ ($800M-1.5B). Serviceable Obtainable Market (SOM) covers bootstrapped founders willing to publicly verify revenue, estimated at 10,000-30,000 customers ($5M-15M ARR potential). Key Calculations: ARR: ~$250,008; Average Revenue per active customer (ARPU): ~$1.3k/month; Estimated yearly profit: ~$212k.",
  businessModel: "Indie-hacker transparency SaaS database. Revenue streams include monthly and annual subscriptions, premium startup listings, revenue verification badges, and featured discovery marketplace placements. Built on a Next.js, React, Tailwind CSS frontend and MongoDB, Stripe, Vercel backend. Current metrics: MRR: $20,834, active subscriptions: 16, profit margin: 85%, revenue growth: +2% (Last Updated: Aug 1, 2026).",
  competitors: ["Indie Hackers", "Acquire.com", "Open Startups", "BuiltWith", "SimilarWeb", "Crunchbase"],
  swot: {
    strengths: [
      "Very high profit margin (85%) with 1-person team",
      "Marc Lou's strong founder personal brand and audience (367K+ on X)",
      "Stripe-verified revenue integration creates high trust",
      "Simple, focused product with frictionless onboarding",
      "First-mover advantage in verified revenue marketplace"
    ],
    weaknesses: [
      "Heavy reliance on founder's personal distribution channels",
      "Concentrated customer base (currently 16 active subscribers)",
      "Stripe-only verification limits addressable market scope",
      "Core functionality is technically straightforward to replicate"
    ],
    opportunities: [
      "Booming ecosystem of transparent indie & AI startups",
      "Investor-facing APIs for verified traction screening",
      "Startup leaderboards, badges, and verified benchmarks",
      "Ecosystem extensions (browser extensions, API marketplace)"
    ],
    threats: [
      "Stripe launching native public profile and verification widgets",
      "Competitors easily copying the core verification concept",
      "Founder burnout or shift in the public transparency trend"
    ]
  },
  risks: [
    {
      risk: "Founder Brand Concentration",
      severity: "High",
      mitigation: "Develop organic channels, startup leaderboards, and automated referral badges to build self-sustaining growth loops."
    },
    {
      risk: "Stripe Dependency & API Changes",
      severity: "Medium",
      mitigation: "Support alternative payment processor integrations (e.g. Paddle, Lemon Squeezy, Shopify) to expand the TAM and build redundancy."
    },
    {
      risk: "Low Technical Switching Costs",
      severity: "High",
      mitigation: "Build database network effects, historical trend tracking, benchmark reports, and developer APIs that competitors cannot easily clone."
    }
  ],
  growthLevers: [
    "Marc Lou's active X audience (367K+ followers)",
    "Product Hunt launches and startup directories",
    "Founder transparency culture integration (#buildinpublic)",
    "SEO rankings and domain rating authority (DR 69)",
    "Viral loop via trust badges displayed on verified startup sites"
  ]
}

export const CODEHYPE_REPORT_DATA: AnalysisData = {
  name: "CodeHype",
  score: 8.9,
  website: "https://codehype.ai",
  verdict: "STRONG BUY. CodeHype owns one of the hardest assets to build: a sizeable and engaged multi-platform community of 155K+ learners. Next-stage progression is converting attention to recurring SaaS revenue products. Long-term defensibility relies on custom AI learning roadmaps and network effects.",
  summary: "CodeHype simplifies the overwhelming AI learning ecosystem by curating news, tools, roadmaps, and high-quality educational resources. Founded by Haris Ahmad Kaboo in January 2023, CodeHype has grown a bootstrapped developer community of 155K+ (including 105K Instagram followers and 25K YouTube subscribers) with an active daily learning traffic of ~150 users.",
  market: "AI Education + AI Media + AI Discovery Platform. CodeHype targets developers, students, software engineers, and startup founders seeking curated learning roadmaps and AI tool recommendations.",
  tam: "Total Addressable Market (TAM) is estimated at $80B-120B+, covering the global AI education and software discovery market. Serviceable Available Market (SAM) includes English-speaking users actively adopting AI, estimated at 150M-250M ($10B-15B). Serviceable Obtainable Market (SOM) represents users seeking curated AI learning communities, estimated at 500,000-2M ($5M-20M ARR potential through subscriptions, sponsorships, and digital products).",
  businessModel: "Content + Digital Products + Services + SaaS Referrals. Current revenue streams include sponsorships, brand collaborations, website development services, and affiliate commissions. Future monetization plans target premium learning memberships, certified courses, recruiters' job boards, and enterprise training APIs.",
  competitors: ["AI Newsletters", "YouTube Creators", "Coursera / Udemy", "Product Hunt", "Developer Forums"],
  swot: {
    strengths: [
      "Established multi-channel community audience of 155K+",
      "Strong brand recognition and high organic credibility in AI education",
      "Lean bootstrapped operations with low overhead costs",
      "Founder technical expertise in web services and content creation"
    ],
    weaknesses: [
      "High dependency on founder-led content production",
      "Currently low recurring revenue stream maturity",
      "Website traffic is currently lower than social reach"
    ],
    opportunities: [
      "Surging demand for accessible, high-quality AI training",
      "Premium member community subscription launch",
      "Enterprise AI workspace training and certifications",
      "Personalized interactive AI learning roadmaps"
    ],
    threats: [
      "Saturation of AI educational content creators",
      "Algorithm changes on search and social distribution channels",
      "Rapid changes in AI tool lifecycles causing content deprecation"
    ]
  },
  risks: [
    {
      risk: "Creator Burnout & Dependency",
      severity: "High",
      mitigation: "Transition towards user-generated content tutorials, peer-reviewed leaderboards, and community-driven knowledge bases."
    },
    {
      risk: "Platform Algorithm Reliance",
      severity: "High",
      mitigation: "Prioritize growth of direct email list newsletters and standalone web forum traffic to build organic independence."
    },
    {
      risk: "Low Monetization Recurring Value",
      severity: "Medium",
      mitigation: "Introduce structured, premium cohorts, paid learning tracks, and interactive certifications to establish high-margin recurring MRR."
    }
  ],
  growthLevers: [
    "Short-form social media loops (105K+ Instagram followers)",
    "YouTube video tutorials (25K+ subscribers)",
    "Telegram community networking channel (25K+ members)",
    "SEO expansion on high-intent AI learning terms",
    "Affiliate SaaS partnership recommendations"
  ]
}

export const NVIDIA_REPORT_DATA: AnalysisData = {
  name: "Nvidia",
  score: 9.8,
  website: "https://www.nvidia.com",
  verdict: "STRONG BUY. The undisputed king of the AI infrastructure layer. Massive gross margins, a near-monopoly on high-end data center GPUs, and a massive developer moat through CUDA make it a foundation stone of the AI revolution.",
  summary: "NVIDIA designs graphic processing units (GPUs) and software APIs (CUDA) for high-performance computing, deep learning, and AI infrastructure. They power the vast majority of AI training workloads globally.",
  market: "AI Hardware Infrastructure & Accelerated Computing. NVIDIA provides critical chips and networking infrastructure for clouds, research labs, and enterprises scaling artificial intelligence workloads.",
  tam: "Total Addressable Market (TAM) is estimated at $1.2T+ by 2030, covering accelerated data center computing hardware, enterprise software suites, autonomous driving systems, and industrial robotics.",
  businessModel: "Accelerated computing platform model. Revenue is driven by GPU hardware sales (H100, B200), high-speed networking components (Mellanox InfiniBand), enterprise software subscriptions (NVIDIA AI Enterprise), and cloud computing allocations (DGX Cloud).",
  competitors: ["AMD", "Intel", "TPUs (Google)", "ASICs (Amazon, Meta)", "Cerebras"],
  swot: {
    strengths: [
      "CUDA software ecosystem creates a massive developer lock-in",
      "Near-monopoly in enterprise AI training chips (90%+ market share)",
      "Unmatched gross margin structure supported by pricing power",
      "High-speed interconnect tech (InfiniBand) prevents data choke points"
    ],
    weaknesses: [
      "Highly cyclical semiconductor market dynamics",
      "Dependence on third-party silicon fabrication (primarily TSMC)",
      "Vulnerability to export controls and geopolitics"
    ],
    opportunities: [
      "Sovereign AI builds globally as nations set up local clouds",
      "Enterprise AI software stacks and subscription growth",
      "Automotive self-driving algorithms and robotics platforms"
    ],
    threats: [
      "Hyperscalers building in-house chips (TPUs, Trainium, Maia)",
      "Competitors developing open software alternatives to CUDA (AMD ROCm)",
      "Global supply chain blockades"
    ]
  },
  risks: [
    {
      risk: "Supply Chain Concentration",
      severity: "High",
      mitigation: "Diversify manufacturing packaging facilities and expand fabricator contracts to reduce reliance on single-country operations."
    },
    {
      risk: "Hyperscaler Disintermediation",
      severity: "Medium",
      mitigation: "Move up the stack by selling full DGX cloud subscriptions and complete enterprise AI software platforms directly to developers."
    }
  ],
  growthLevers: [
    "Blackwell and next-generation architecture shipments",
    "Sovereign cloud compute setups with global governments",
    "CUDA software runtime licensing to enterprise applications"
  ]
}

export const PRODUCTHUNT_REPORT_DATA: AnalysisData = {
  name: "Product Hunt",
  score: 8.2,
  website: "https://www.producthunt.com",
  verdict: "HOLD. The premier launchpad for new software products, but growth has plateaued. Strong community network effects and SEO authority, but needs to diversify revenue beyond sponsorships.",
  summary: "Product Hunt is a curation platform for discovering new mobile apps, websites, hardware projects, and tech products. It serves as the primary distribution hub for early-stage startups.",
  market: "Tech Discovery & Startup Launch Ecosystem. Helps founders gain immediate visibility, users, and feedback while providing creators with a curated feed of new innovations.",
  tam: "Total Addressable Market (TAM) is estimated at $5B-10B, representing early-stage startup marketing budgets, developer launching ads, and job listing boards.",
  businessModel: "Discovery & Advertising Model. Product Hunt monetizes through sponsored listings, launching advertisements, job boards, newsletter sponsorships, and premium maker tools.",
  competitors: ["Reddit", "Indie Hackers", "BetaList", "LaunchYCombinator", "Hacker News"],
  swot: {
    strengths: [
      "Extremely strong domain rating (DR 90+) and search engine ranking",
      "Deeply embedded launching ritual within the developer community",
      "Unrivaled database of early-stage software and founder directories"
    ],
    weaknesses: [
      "Sponsorship inventory is limited by feed real estate",
      "High launch activity manipulation attempts (spam, fake upvotes)",
      "Struggles to retain everyday consumers beyond developer personas"
    ],
    opportunities: [
      "Launch helper services, premium advisory, and VC scout connections",
      "Founder-focused subscription tools (SaaS discount marketplace)",
      "AI-driven tool recommendations and personalized dashboards"
    ],
    threats: [
      "Decline in organic startup launches as platforms consolidate",
      "Alternative distribution tools (Twitter/X, LinkedIn newsletters)",
      "Community fatigue from repetitive launch formats"
    ]
  },
  risks: [
    {
      risk: "Trust Score Degradation",
      severity: "High",
      mitigation: "Implement strict, ML-powered anti-fraud upvote detection and verification filters for profiles."
    },
    {
      risk: "Revenue Concentration",
      severity: "Medium",
      mitigation: "Introduce recurring SaaS subscriptions for startups to monitor competitor tool stacks and launch statistics."
    }
  ],
  growthLevers: [
    "PH Newsletter expansion and brand sponsorships",
    "Founder software marketplace discounts subscription",
    "Creator tools API integrations"
  ]
}

export const SARVAM_REPORT_DATA: AnalysisData = {
  name: "Sarvam AI",
  score: 8.6,
  website: "https://www.sarvam.ai",
  verdict: "STRONG BUY. Developing full-stack LLMs optimized for India's multilingual needs. Backed by top VCs, they own the primary developer-first APIs and custom voice models for Indian vernaculars.",
  summary: "Sarvam AI builds foundational large language models, speech APIs, and voice interfaces optimized for Indian vernaculars, enabling highly localized AI applications in the subcontinent.",
  market: "Multilingual Indian Generative AI. Sarvam builds models that run efficiently on low-compute architectures and handle code-switching (Hinglish, etc.) natively.",
  tam: "Total Addressable Market (TAM) is estimated at $15B-25B, representing the growing enterprise AI and voice localization market in India.",
  businessModel: "API and Enterprise Platform Model. Revenue streams include voice API consumption fees, translation token packages, customized enterprise LLMs, and local cloud hosting services.",
  competitors: ["Krutrim (Ola)", "Hanooman AI", "OpenAI", "Google Gemini"],
  swot: {
    strengths: [
      "Optimized model sizes that reduce GPU hosting costs drastically",
      "Native voice-first focus suited for low-literacy markets",
      "Backed by top VCs (Lightspeed) with deep regional customer access"
    ],
    weaknesses: [
      "Fewer GPU compute clusters compared to global trillion-dollar giants",
      "Lower developer mindshare compared to generic OpenAI API wrappers",
      "Shortage of high-quality Indian regional language digital training data"
    ],
    opportunities: [
      "Indian public sector digitalization deployments",
      "Voice bot interfaces for regional banking and ecommerce customer support",
      "API integrations for vernacular education and healthcare portals"
    ],
    threats: [
      "Global LLMs (Gemini, Llama) improving vernacular accuracy rapidly",
      "Indian cloud infrastructure constraints",
      "High GPU hardware import costs"
    ]
  },
  risks: [
    {
      risk: "Data Resource Deficit",
      severity: "Medium",
      mitigation: "Partner with regional media outlets and university linguists to translate and clean offline Indian datasets."
    },
    {
      risk: "Hyper-Competition from Big Tech",
      severity: "High",
      mitigation: "Focus on voice-first, high-throughput, low-latency API models that are optimized for cellular network speeds."
    }
  ],
  growthLevers: [
    "Voice bot integrations with public banking services",
    "Sarvam regional translation API subscriptions",
    "Enterprise developer workshops and cloud credits"
  ]
}

export const OPENAI_REPORT_DATA: AnalysisData = {
  name: "OpenAI",
  score: 9.6,
  website: "https://openai.com",
  verdict: "STRONG BUY. The market maker for Generative AI. Highest developer mindshare, strong enterprise integration with Microsoft, and a world-class research talent pool.",
  summary: "OpenAI is an AI research and deployment company behind ChatGPT, DALL-E, Sora, and the GPT-4 family of large language models. They lead the global consumer AI race.",
  market: "Frontier General Purpose Artificial Intelligence. Providing state-of-the-art reasoning APIs and consumer assistants to millions worldwide.",
  tam: "Total Addressable Market (TAM) is estimated at $1.3T+ by 2030, covering automated software, corporate intelligence, search engines, and virtual agents.",
  businessModel: "Hybrid Consumer/Developer SaaS model. Generates revenue through ChatGPT Plus subscriptions, API developer token consumption fees, corporate custom models, and royalty splits with Microsoft.",
  competitors: ["Anthropic", "Google Gemini", "Meta (Llama)", "Mistral AI", "xAI"],
  swot: {
    strengths: [
      "Unrivaled brand equity (ChatGPT is synonymous with consumer AI)",
      "Vast developer ecosystem with heavy developer API stickiness",
      "Preferred access to Microsoft's Azure cloud computing cluster resources"
    ],
    weaknesses: [
      "High training and inference compute costs scaling exponentially",
      "Corporate governance structure complications",
      "Increasing data scrapability limits and copyright suits"
    ],
    opportunities: [
      "Search engine market share expansion with SearchGPT integration",
      "Agentic workspace automation platforms",
      "High-margin enterprise-tailored reasoning models"
    ],
    threats: [
      "Organisations switching to open-weight models (Llama 4) lowering API margins",
      "Regulatory restrictions on frontier models (EU AI Act)",
      "High-end AI hardware bottlenecks"
    ]
  },
  risks: [
    {
      risk: "Compute Costs & Financial Burn",
      severity: "High",
      mitigation: "Optimize inference architecture (e.g. model distillation, hardware-specific kernels) to lower compute costs per query."
    },
    {
      risk: "Safety & Alignment Incidents",
      severity: "Medium",
      mitigation: "Maintain world-class red-teaming teams and strict compliance monitoring dashboards."
    }
  ],
  growthLevers: [
    "SearchGPT global rollout and search monetization",
    "Enterprise customer workspace API contracts",
    "Sora video creator platform subscriptions"
  ]
}

export const PERPLEXITY_REPORT_DATA: AnalysisData = {
  name: "Perplexity",
  score: 9.2,
  website: "https://www.perplexity.ai",
  verdict: "STRONG BUY. Pioneering conversational search and direct answer engines. Stellar retention and query growth, but faces publisher copyright licensing costs and heavy competition.",
  summary: "Perplexity is an AI-powered conversational search engine that provides real-time information with inline citations. It acts as an instant research companion.",
  market: "AI Search and Information Curation. Replacing traditional ten-blue-links search engines with direct, synthesized text summaries.",
  tam: "Total Addressable Market (TAM) is estimated at $120B+, representing the global web search engine, corporate query, and digital advertising market.",
  businessModel: "Consumer & Enterprise Search Subscription. Generates revenue through Perplexity Pro subscriptions, API query integrations (Sonar), and native sponsored ad placements.",
  competitors: ["Google Search", "OpenAI SearchGPT", "Microsoft Bing", "You.com"],
  swot: {
    strengths: [
      "Stellar user retention and rapid query execution speed",
      "Interface design optimized for clean research (threads, collections)",
      "Highly responsive indexing of real-time search data"
    ],
    weaknesses: [
      "Dependence on third-party foundational model APIs (OpenAI, Anthropic) alongside internal models",
      "Vulnerability to publisher paywalls and copyright warnings",
      "High customer acquisition cost in a market dominated by Google"
    ],
    opportunities: [
      "Enterprise research licensing and collaborative workspaces",
      "Publisher revenue-share programs to build legal safety",
      "API integrations inside smart devices and vehicle consoles"
    ],
    threats: [
      "Google rolling out native Gemini search panels globally",
      "Publishers blocking scraping agents recursively",
      "OpenAI launching a unified SearchGPT product"
    ]
  },
  risks: [
    {
      risk: "Legal Publisher Challenges",
      severity: "High",
      mitigation: "Sign content licensing deals and set up revenue-share partnerships with major media organizations."
    },
    {
      risk: "Underlying API Dependence",
      severity: "Medium",
      mitigation: "Train and deploy custom in-house LLMs for routine query routing to reduce reliance on third-party models."
    }
  ],
  growthLevers: [
    "Perplexity Pro subscription renewals and corporate bundles",
    "Sponsored queries and search advertising partnerships",
    "Hardware bundling (e.g. mobile, smart wearable integrations)"
  ]
}

export const ANTHROPIC_REPORT_DATA: AnalysisData = {
  name: "Anthropic",
  score: 9.4,
  website: "https://www.anthropic.com",
  verdict: "STRONG BUY. The primary alternative to OpenAI for enterprise-grade safe, steerable models. Claude 3.5 Sonnet has captured massive developer market share through superior coding capabilities.",
  summary: "Anthropic is an AI safety and research company that develops the Claude series of steerable and reliable large language models, emphasizing constitutional AI principles.",
  market: "Steerable Enterprise Generative AI. Focuses on safe, helpful, and honest models for corporate deployments, financial research, and automated coding.",
  tam: "Total Addressable Market (TAM) is estimated at $1.3T+ by 2030, covering general enterprise automation, compliance analysis, and software engineering tools.",
  businessModel: "API and Developer SaaS model. Generates revenue through Claude Pro consumer subscriptions, enterprise workspace plans, and model API tokens served via AWS Bedrock and Google Vertex AI.",
  competitors: ["OpenAI", "Google Gemini", "Meta (Llama)", "Mistral AI"],
  swot: {
    strengths: [
      "Claude 3.5 Sonnet leading the market in coding capabilities and logical reasoning",
      "Constitutional AI training framework guarantees high steerability",
      "Strategic distribution partnerships with cloud giants AWS and Google"
    ],
    weaknesses: [
      "Lower consumer brand awareness compared to ChatGPT",
      "Heavy reliance on AWS and Google for cloud compute credits",
      "Absence of native voice/video models in current deployments"
    ],
    opportunities: [
      "Deep AWS/Amazon enterprise ecosystem customer integration",
      "Steerable agents via computer use API models",
      "Regulated industry automation (healthcare, legal, banking)"
    ],
    threats: [
      "OpenAI pricing pressure on API tokens",
      "Meta releasing free enterprise-grade Llama models",
      "Geopolitical GPU cluster allocation limits"
    ]
  },
  risks: [
    {
      risk: "Strategic Cloud Partner Overlap",
      severity: "Medium",
      mitigation: "Build out a direct developer API portal and independent sales channels to avoid complete reliance on AWS Bedrock."
    },
    {
      risk: "Frontier Compute Capital Burn",
      severity: "High",
      mitigation: "Secure long-term multi-billion dollar compute commitments from AWS and Google in exchange for equity models."
    }
  ],
  growthLevers: [
    "Claude Computer Use API adoption and licenses",
    "AWS enterprise sales team referrals",
    "Steerable compliance agent models"
  ]
}

export const CURSOR_REPORT_DATA: AnalysisData = {
  name: "Cursor",
  score: 9.5,
  website: "https://cursor.com",
  verdict: "STRONG BUY. The leading AI-first code editor. Seamless local IDE integration and superior context awareness have led to explosive adoption among developers worldwide.",
  summary: "Cursor is an AI-powered fork of VS Code built by Anysphere, designed to pair program with developers using deep contextual model integrations.",
  market: "AI-Assisted Software Development IDEs. Automates code drafting, bug fixes, refactoring, and multi-file codebases interactions.",
  tam: "Total Addressable Market (TAM) is estimated at $45B-60B, representing the global developer tools, IDEs, and AI software engineering market.",
  businessModel: "Developer SaaS model. Monetizes through tiered subscriptions (Pro for individuals, Business for engineering teams) with API query usage quotas.",
  competitors: ["GitHub Copilot", "Replit Agent", "Aider", "Windsurf (Codeium)", "Tabnine"],
  swot: {
    strengths: [
      "Deep IDE workspace context parsing (Cursor Tab is faster than Copilot)",
      "Zero friction migration path since it inherits all VS Code extensions",
      "Extremely strong developer word-of-mouth and organic adoption"
    ],
    weaknesses: [
      "High inference costs from routing queries to external frontier LLMs",
      "Dependence on Microsoft's open-source VS Code foundation",
      "Vulnerability to enterprise IP leakage concerns"
    ],
    opportunities: [
      "On-premise enterprise deployments with high security requirements",
      "Proprietary local autocomplete model training",
      "Collaborative AI debugging workspaces"
    ],
    threats: [
      "GitHub launching an equally seamless Copilot-native IDE",
      "API pricing updates from key model providers (OpenAI/Anthropic)",
      "Enterprises banning cloud code-completion tools due to privacy"
    ]
  },
  risks: [
    {
      risk: "Enterprise IP and Security Blocks",
      severity: "High",
      mitigation: "Offer zero-data retention endpoints and local context index processing to comply with corporate security reviews."
    },
    {
      risk: "Inference Cost Squeeze",
      severity: "Medium",
      mitigation: "Train and deploy specialized, hyper-fast local autocomplete models to reduce frontier model call frequencies."
    }
  ],
  growthLevers: [
    "Cursor Business seat licensing for engineering teams",
    "Local context indexing algorithms upgrades",
    "Multi-file codebase editing tools"
  ]
}

export const LOVABLE_REPORT_DATA: AnalysisData = {
  name: "Lovable",
  score: 9.1,
  website: "https://lovable.dev",
  verdict: "STRONG BUY. Rapidly building a leading AI software engineer that writes full-stack applications from prompts. Strong user activation loops and excellent developer workspace usability.",
  summary: "Lovable develops GPT Engineer and other full-stack AI development agents to turn prompts into clean, deployable applications instantly.",
  market: "No-Code / Low-Code AI App Builders. Enables non-technical creators and software designers to prototype and deploy complete web apps.",
  tam: "Total Addressable Market (TAM) is estimated at $30B-50B, representing the global low-code tools, app prototyping, and digital agency services market.",
  businessModel: "AI App SaaS model. Monetizes through user subscriptions, seat licenses, project hosting fees, custom domain integrations, and API call quotas.",
  competitors: ["Bolt.new", "v0 (Vercel)", "Replit Agent", "Webflow (AI)", "Anvil"],
  swot: {
    strengths: [
      "Clean, editable code generation that developers can export",
      "Fast live previews with built-in sandbox mock compilers",
      "Excellent onboarding workflow that simplifies complex project specs"
    ],
    weaknesses: [
      "App scaling limits once logic exceeds typical single-page patterns",
      "High cost of hosting client preview instances",
      "Heavy reliance on frontend-heavy code generation frameworks"
    ],
    opportunities: [
      "B2B agency workspaces for rapid client app prototyping",
      "Third-party API integration hubs",
      "Database schema auto-generation and backend code hooks"
    ],
    threats: [
      "Competitors copying sandbox execution engines (e.g. Bolt.new)",
      "Frontier models offering direct app sandboxes in-chat",
      "Users exporting code and cancelling subscriptions immediately"
    ]
  },
  risks: [
    {
      risk: "SaaS Retention & Churn",
      severity: "High",
      mitigation: "Introduce premium hosting packages and database storage options to incentivize keeping projects live on Lovable."
    },
    {
      risk: "Application Complexity Limits",
      severity: "Medium",
      mitigation: "Introduce modular, multi-file code editing views and direct GitHub sync capabilities."
    }
  ],
  growthLevers: [
    "GPT Engineer subscription models and team workspaces",
    "Figma-to-code layout conversion widgets",
    "GitHub hosting integrations"
  ]
}

export const REPLIT_REPORT_DATA: AnalysisData = {
  name: "Replit",
  score: 9.0,
  website: "https://replit.com",
  verdict: "STRONG BUY. The pioneer of collaborative cloud coding. Their Replit Agent product has democratized software creation, allowing non-technical users to build full-stack web apps.",
  summary: "Replit is a collaborative cloud IDE and software creation platform that lets users write, test, and deploy code directly in the browser.",
  market: "Cloud IDE & Collaborative AI Code Platforms. Focuses on bringing frictionless creation, hosting, and AI-assisted programming to developers.",
  tam: "Total Addressable Market (TAM) is estimated at $45B-60B, representing developers tools, school computing platforms, and digital workspace providers.",
  businessModel: "Cloud IDE and Workspace SaaS model. Monetizes through Replit Pro subscriptions, deployable server compute allocations (Repls hosting), and team workspace seats.",
  competitors: ["GitHub Codespaces", "Cursor", "Bolt.new", "Glitch", "StackBlitz"],
  swot: {
    strengths: [
      "Instant workspace environment booting with zero local configuration",
      "Replit Agent provides outstanding end-to-end full-stack app creation",
      "Massive student and global developer community base"
    ],
    weaknesses: [
      "Browser editor limits compared to fully-featured local IDEs (VS Code)",
      "High resource hosting cost for free-tier users",
      "Historically perceived as a learning tool rather than enterprise IDE"
    ],
    opportunities: [
      "Enterprise internal prototyping portals",
      "Replit Agent integrations for corporate IT automation",
      "Premium hosting deployments scaling capabilities"
    ],
    threats: [
      "GitHub Copilot Workspace integration in standard repos",
      "Local IDE extensions offering identical sandboxed execution",
      "Cloud hosting cost fluctuations"
    ]
  },
  risks: [
    {
      risk: "Monetizing Free Learners",
      severity: "Medium",
      mitigation: "Structure pricing around compute-hours and deployment resources, keeping basic editor access free but charging for server runtimes."
    },
    {
      risk: "Resource Scaling and Outages",
      severity: "Medium",
      mitigation: "Utilize dynamic container scaling and partner with primary cloud providers for computing credits."
    }
  ],
  growthLevers: [
    "Replit Agent subscriptions and API keys",
    "Team collaboration workspaces and server deployments",
    "Educational institution cloud licenses"
  ]
}

export const ELEVENLABS_REPORT_DATA: AnalysisData = {
  name: "ElevenLabs",
  score: 9.3,
  website: "https://elevenlabs.io",
  verdict: "STRONG BUY. The clear industry leader in synthetic audio generation, voice cloning, and text-to-speech. Massive voice library network effects and enterprise adoption.",
  summary: "ElevenLabs develops advanced generative voice and synthetic audio software utilizing deep learning models for speech synthesis, voice design, and localization.",
  market: "Generative Audio & Synthetic Voice Platforms. Targets content creators, game developers, audiobook publishers, and translation teams.",
  tam: "Total Addressable Market (TAM) is estimated at $20B-30B, representing synthetic voice creation, corporate localization, and digital media production.",
  businessModel: "Audio SaaS model. Monetizes through tiered character-quota subscriptions (Creator, Pro, Scale) and custom enterprise licensing.",
  competitors: ["OpenAI Voice Engine", "Play.ht", "Lovo.ai", "Microsoft Azure Speech", "ElevenLabs clones"],
  swot: {
    strengths: [
      "Industry-leading voice naturalness, emotional inflection, and cadence",
      "Voice library marketplace creates network effects (creators earn royalties)",
      "Supports over 30 languages with high accent preservation"
    ],
    weaknesses: [
      "Vulnerability to deepfake fraud and public relations backlash",
      "Compute-intensive training required for custom voice cloning",
      "High server bandwidth costs for real-time audio streaming"
    ],
    opportunities: [
      "Real-time video translation and automated dubbing",
      "Automated video game NPC voice rendering",
      "Corporate compliance, training, and customer service soundboards"
    ],
    threats: [
      "OpenAI releasing competitive synthetic voice APIs at lower prices",
      "Government regulations restricting deepfake voice systems",
      "Open-source TTS models (e.g. Bark) matching generation quality"
    ]
  },
  risks: [
    {
      risk: "Safety & Deepfake Abuse",
      severity: "High",
      mitigation: "Implement strict, cryptographic voice watermarking and instant KYC checks for custom voice clones."
    },
    {
      risk: "Big Tech Price Undercutting",
      severity: "Medium",
      mitigation: "Focus on voice library network effects, localization APIs, and specialized creator platform integrations."
    }
  ],
  growthLevers: [
    "Dubbing and video localization product subscriptions",
    "Voice library marketplace transactions commissions",
    "API integration contracts with gaming engines"
  ]
}

export const MOONSHOT_REPORT_DATA: AnalysisData = {
  name: "Moonshot AI",
  score: 8.8,
  website: "https://www.moonshot.ai",
  verdict: "STRONG BUY. Leading Chinese generative AI startup focusing on extremely long context windows. Kimi chatbot has captured massive user engagement in Asia.",
  summary: "Moonshot AI builds foundational large language models optimized for ultra-long context windows and Chinese linguistics. Their Kimi platform is a leading assistant in China.",
  market: "Large Context Multilingual Foundation Models. Serving the Asian market with advanced reasoning, document summarization, and local language search.",
  tam: "Total Addressable Market (TAM) is estimated at $40B-60B, covering the generative AI software, search, and enterprise automation market in the APAC region.",
  businessModel: "API and Consumer Chat SaaS. Monetizes through Kimi Premium chat features, developer API tokens, and localized enterprise LLM integrations.",
  competitors: ["Baichuan AI", "Zhipu AI", "DeepSeek", "Alibaba Qwen", "Baidu Ernie"],
  swot: {
    strengths: [
      "Pioneered massive context windows (200k+ tokens) in the local market",
      "Explosive consumer adoption of the Kimi Chat chatbot in China",
      "Backed by major tech companies (Alibaba) with deep distribution links"
    ],
    weaknesses: [
      "Access to global cloud and advanced hardware is heavily restricted",
      "Regulatory alignment requirements in the local market",
      "High customer acquisition cost in a crowded domestic chatbot market"
    ],
    opportunities: [
      "Long-context legal and financial document analysis tools",
      "Enterprise knowledge base searching setups",
      "Localized agentic frameworks for ecommerce businesses"
    ],
    threats: [
      "DeepSeek undercutting token prices aggressively",
      "Hyperscalers launching native LLM platforms in-house",
      "Tightening semiconductor hardware import limits"
    ]
  },
  risks: [
    {
      risk: "Geopolitical Hardware Access",
      severity: "High",
      mitigation: "Optimize model training architectures to achieve high reasoning capacity on lower-grade local GPU clusters."
    },
    {
      risk: "Local Market Price Wars",
      severity: "High",
      mitigation: "Focus on deep workflow integrations, client search history databases, and proprietary long-context document analysis moats."
    }
  ],
  growthLevers: [
    "Kimi Premium subscription plans",
    "Long-context document parsing developer APIs",
    "Alibaba Cloud enterprise referrals"
  ]
}

export const DEEPSEEK_REPORT_DATA: AnalysisData = {
  name: "DeepSeek",
  score: 9.4,
  website: "https://www.deepseek.com",
  verdict: "STRONG BUY. The hyper-efficient challenger in the LLM market. DeepSeek-V3 and R1 have shocked the industry by offering state-of-the-art reasoning at a fraction of competitors' cost.",
  summary: "DeepSeek is an AI research company that designs cost-efficient reasoning models and open-weight LLMs with advanced math/coding intelligence.",
  market: "Cost-Efficient Foundational Reasoning Models. DeepSeek builds open-source and API models optimized for maximum throughput and minimum compute footprint.",
  tam: "Total Addressable Market (TAM) is estimated at $1.3T+ by 2030, covering automated software, corporate APIs, global AI compute, and coding utilities.",
  businessModel: "High-Volume API and Open-Weight Model Support. Monetizes through ultra-cheap developer token consumption APIs and enterprise infrastructure support.",
  competitors: ["OpenAI", "Anthropic", "Google Gemini", "Meta (Llama)", "Qwen"],
  swot: {
    strengths: [
      "Multi-head Latent Attention (MLA) architecture achieves high quality with very low VRAM needs",
      "DeepSeek-R1 matches top models in coding and mathematical reasoning",
      "API pricing is 90%+ cheaper than Western competitors (e.g. $0.14/M tokens)"
    ],
    weaknesses: [
      "Lower profit margin per token due to aggressive pricing strategy",
      "Vulnerability to international cloud bans and hardware constraints",
      "Consumer chatbot interface has less global distribution than ChatGPT"
    ],
    opportunities: [
      "Global developer API migration due to massive cost savings",
      "Integration into local code completion tools and offline IDEs",
      "Reasoning LLM pipelines for high-volume automated data analysis"
    ],
    threats: [
      "Cloud providers restricting host access due to geopolitics",
      "Competitors launching distilled reasoning models",
      "Hardware import limitations slowing down model training speeds"
    ]
  },
  risks: [
    {
      risk: "Low-Margin API Sustainability",
      severity: "Medium",
      mitigation: "Monetize through enterprise on-prem deployments, model customization consulting, and dedicated private server hosting."
    },
    {
      risk: "Geopolitical Cloud Policy Changes",
      severity: "High",
      mitigation: "Offer decentralized API hosts, self-hostable open-weight model files, and multi-region server clusters."
    }
  ],
  growthLevers: [
    "DeepSeek-R1/V3 developer API token consumption volumes",
    "Open-weight model custom enterprise configurations",
    "AI agent tooling integrations"
  ]
}

export const QWEN_REPORT_DATA: AnalysisData = {
  name: "Qwen",
  score: 9.1,
  website: "https://qwen.ai",
  verdict: "STRONG BUY. Alibaba's open-weight model family. Highly competitive across global benchmarks, especially in multilingual capabilities and tool-use operations.",
  summary: "Qwen (Tongyi Qianwen) is Alibaba Cloud's flagship open-weight LLM family, offering advanced language, audio, and vision intelligence.",
  market: "Open-Source & Enterprise Foundation Models. Focuses on providing developer-friendly, multi-modal, and multilingual model parameters.",
  tam: "Total Addressable Market (TAM) is estimated at $1.3T+ by 2030, covering general enterprise automation, multi-modal search, and global developer tools.",
  businessModel: "Enterprise Cloud and Model API. Monetizes through Alibaba Cloud hosting allocations, model customization packages, API token fees, and enterprise deployments.",
  competitors: ["Meta (Llama)", "Mistral AI", "DeepSeek", "OpenAI", "Zhipu AI"],
  swot: {
    strengths: [
      "State-of-the-art multilingual and translation benchmark results",
      "Excellent multi-modal models (Qwen-VL) for image/video reasoning",
      "Backed by Alibaba's massive cloud computing and enterprise sales ecosystem"
    ],
    weaknesses: [
      "Western developer mindshare is divided between Llama and local options",
      "Lower brand visibility in standard consumer chatbot app stores",
      "Local regulatory compliance checks limit model deployment speed"
    ],
    opportunities: [
      "Default multilingual LLM platform for APAC businesses",
      "Edge device model integration inside local electronics (smartphones, IoT)",
      "Automated translation and international ecommerce automation tools"
    ],
    threats: [
      "DeepSeek undercutting developer API pricing",
      "Meta releasing larger Llama models for free",
      "Geopolitical boundaries limiting cloud data center expansion"
    ]
  },
  risks: [
    {
      risk: "Western Developer Mindshare Gap",
      severity: "Medium",
      mitigation: "Maintain active open-source model releases (HuggingFace), clear documentation, and easy integrations with local IDEs."
    },
    {
      risk: "GPU Resource Limits",
      severity: "Medium",
      mitigation: "Focus on model architecture efficiencies (MoE) to decrease compute requirements during training and inference."
    }
  ],
  growthLevers: [
    "Alibaba Cloud enterprise model hosting subscriptions",
    "Qwen multilingual API token consumption",
    "Visual reasoning models licensing contracts"
  ]
}

export const Z_REPORT_DATA: AnalysisData = {
  name: "Z.ai",
  score: 8.5,
  website: "https://z.ai",
  verdict: "STRONG BUY. A specialized AI-powered business development and marketing engine. Solves low conversion rates and cold outreach fatigue for modern enterprise teams.",
  summary: "Z.ai builds automated outreach, lead scoring, and B2B growth intelligence platforms powered by custom semantic models.",
  market: "B2B Marketing & AI Sales Automation. Automating customer prospecting, database lookup, and personalized email outreach copy generation.",
  tam: "Total Addressable Market (TAM) is estimated at $12B-18B, representing the CRM, B2B sales automation, and lead generation software market.",
  businessModel: "B2B SaaS subscription model. Monetizes through user seat subscriptions, lead search quotas, and campaign email credits.",
  competitors: ["Apollo.io", "Clay", "ZoomInfo", "Seamless.ai", "Instantly.ai"],
  swot: {
    strengths: [
      "High personalization engine accuracy reduces spam flag rates",
      "Frictionless database CRM integrations (Salesforce, HubSpot)",
      "High domain rotation automation keeps email delivery rates high"
    ],
    weaknesses: [
      "Dependence on third-party B2B contact database lookups",
      "Vulnerability to email provider algorithm filters",
      "High client churn when sales outreach goals are unmet"
    ],
    opportunities: [
      "Automated phone/voice bot outreach integrations",
      "AI-driven lead qualification scoring engines",
      "Enterprise custom client generation consulting"
    ],
    threats: [
      "Email clients blocking automated outbound pipelines completely",
      "Established CRMs (HubSpot) building native AI outreach flows",
      "Data privacy regulations (GDPR/CCPA) restricting lead scraping"
    ]
  },
  risks: [
    {
      risk: "Outbound Delivery Blocks",
      severity: "High",
      mitigation: "Implement automated inbox warm-up cycles and multi-domain sender rotations natively."
    },
    {
      risk: "Data Privacy Regulation Constraints",
      severity: "Medium",
      mitigation: "Limit database indices to publicly verified corporate emails and incorporate automated opt-out buttons."
    }
  ],
  growthLevers: [
    "User seat subscriptions and lead lookup credits",
    "Corporate CRM API integration licensing fees",
    "Partner referral commission splits"
  ]
}

export const KLINGAI_REPORT_DATA: AnalysisData = {
  name: "Kling AI",
  score: 8.9,
  website: "https://klingai.com",
  verdict: "STRONG BUY. Kuaishou's state-of-the-art text-to-video generation model. High physical accuracy, detailed cinematography, and robust multi-second video stitching capabilities.",
  summary: "Kling AI is a text-to-video generator capable of generating high-definition photorealistic videos with complex physical physics simulation.",
  market: "Generative Video & Digital Film Production. Focuses on providing creators, marketers, and film studios with photorealistic video outputs.",
  tam: "Total Addressable Market (TAM) is estimated at $45B-65B, representing professional digital video tools, advertising assets creation, and film workflows.",
  businessModel: "Video SaaS and Model API. Monetizes through credit packages for video generations, subscription tiers, and developer video generation APIs.",
  competitors: ["OpenAI Sora", "Runway Gen-3", "Luma Dream Machine", "Pika Labs", "Sora clones"],
  swot: {
    strengths: [
      "Industry-leading physics simulation and movement consistency",
      "Generates long video clips (up to 2 minutes) with high consistency",
      "Excellent multi-aspect ratio and high-resolution rendering capabilities"
    ],
    weaknesses: [
      "High GPU rendering time and cost per video clip",
      "Interface language support limits in global markets",
      "Inconsistent human finger and text rendering in complex motions"
    ],
    opportunities: [
      "Automated ad banner and social video generation tools",
      "Digital film pre-visualization workflows for production houses",
      "API integrations inside global video editing suites (Premiere, CapCut)"
    ],
    threats: [
      "OpenAI Sora releasing a mass-market public API",
      "Open-source text-to-video models (e.g. CogVideo) improving quickly",
      "High server hosting and GPU render cluster costs"
    ]
  },
  risks: [
    {
      risk: "GPU Rendering Cost Crunch",
      severity: "High",
      mitigation: "Train distilled video models and utilize low-cost inference clusters to decrease render unit economics."
    },
    {
      risk: "Copyright and Intellectual Property Concerns",
      severity: "Medium",
      mitigation: "Deploy a clean video generation filter and watermarking detection pipeline."
    }
  ],
  growthLevers: [
    "Video generation credit packages subscriptions",
    "Enterprise ad generator software license fees",
    "API integration token purchases"
  ]
}

export const HIGGSFIELD_REPORT_DATA: AnalysisData = {
  name: "Higgsfield",
  score: 8.7,
  website: "https://higgsfield.ai",
  verdict: "STRONG BUY. Building video generation models specifically designed for social media marketing. Their mobile-first creator tools provide unparalleled physical and camera control.",
  summary: "Higgsfield AI develops custom video generation foundation models and editing workflows designed for social creators and brand marketers.",
  market: "Creator-First Generative Video Tools. Providing mobile-first tools to draft, animate, and direct videos with high character consistency.",
  tam: "Total Addressable Market (TAM) is estimated at $25B-35B, representing social media advertising, short-form creator economy tools, and marketing assets.",
  businessModel: "Creator SaaS subscription. Monetizes through tiered mobile subscription packages, video hosting plans, and corporate team marketing workspaces.",
  competitors: ["Runway", "Kling AI", "Luma AI", "CapCut", "Kaiber"],
  swot: {
    strengths: [
      "Mobile-first app interface optimized for quick social creator pipelines",
      "Excellent character and facial preservation across video motions",
      "Unparalleled camera angle control tools (pan, zoom, tilt prompts)"
    ],
    weaknesses: [
      "Smaller foundation model training resources than trillion-dollar firms",
      "Dependence on iOS and Android app store distribution algorithms",
      "Lower resolution outputs in basic generation tiers"
    ],
    opportunities: [
      "Direct ecommerce product-to-ad video conversion tools",
      "Influencer digital double cloning video generation",
      "Brand marketing automation campaign templates"
    ],
    threats: [
      "CapCut building native advanced generative video tools for free",
      "High user churn when social video trends change",
      "GPU hosting credit costs rising"
    ]
  },
  risks: [
    {
      risk: "App Store Distribution Dependence",
      severity: "Medium",
      mitigation: "Maintain a responsive web app version and build direct enterprise API client contracts."
    },
    {
      risk: "High User Churn",
      severity: "High",
      mitigation: "Incentivize retention by building asset libraries, character templates, and saved brand voice presets."
    }
  ],
  growthLevers: [
    "Mobile app video generation pro plans",
    "Brand marketing campaign subscriptions",
    "Character asset library hosting fees"
  ]
}

export const MANUS_REPORT_DATA: AnalysisData = {
  name: "Manus",
  score: 9.0,
  website: "https://manus.im",
  verdict: "STRONG BUY. A leading AI agent system that acts as a virtual employee, browsing and operating the web to complete complex multi-hour operations on behalf of users.",
  summary: "Manus develops general-purpose AI agents that control browser environments to automate research, bookings, and data entry dynamically.",
  market: "Autonomous Browser & Desktop AI Agents. Replacing manual data scraping, corporate forms, and research workflows with autonomous agents.",
  tam: "Total Addressable Market (TAM) is estimated at $100B+, covering business process automation, digital assistant workspaces, and corporate workflows.",
  businessModel: "Agentic SaaS subscription. Monetizes through hourly active agent runtimes, custom enterprise workflow licenses, and token usage fees.",
  competitors: ["Anthropic Computer Use", "MultiOn", "Operator (OpenAI)", "Skyvern", "Cognition Devin"],
  swot: {
    strengths: [
      "High reliability in browser execution and error self-correction",
      "Capable of completing complex, multi-hour operations in background sandboxes",
      "Strong visual verification capabilities when checking web elements"
    ],
    weaknesses: [
      "High API compute costs from constantly running vision pipelines",
      "Vulnerability to anti-bot detection walls (CAPTCHAs)",
      "High latency on multi-step workflows compared to direct API calls"
    ],
    opportunities: [
      "Autonomous B2B market research and competitor price tracking",
      "Automated administrative task execution (invoicing, bookings)",
      "Developer tools for building custom browser automation templates"
    ],
    threats: [
      "Websites blocking agent browsers recursively via Cloudflare",
      "OpenAI launching a free browser control desktop client",
      "Security breaches from agents accessing private credentials"
    ]
  },
  risks: [
    {
      risk: "CAPTCHA and Anti-Bot Barriers",
      severity: "High",
      mitigation: "Integrate human-in-the-loop fallback screens and configure headless browsers with natural cursor movements."
    },
    {
      risk: "Credential Security & Privacy",
      severity: "High",
      mitigation: "Use encrypted sandbox vaults and limited session credentials for secure web transactions."
    }
  ],
  growthLevers: [
    "Agent runtime usage packages (agent-hour credits)",
    "Enterprise workflow templates licenses",
    "B2B research API subscription splits"
  ]
}

export const COMPANIES_DATA: Record<string, AnalysisData> = {
  trustmrr: TRUSTMRR_REPORT_DATA,
  codehype: CODEHYPE_REPORT_DATA,
  nvidia: NVIDIA_REPORT_DATA,
  producthunt: PRODUCTHUNT_REPORT_DATA,
  sarvam: SARVAM_REPORT_DATA,
  openai: OPENAI_REPORT_DATA,
  perplexity: PERPLEXITY_REPORT_DATA,
  anthropic: ANTHROPIC_REPORT_DATA,
  cursor: CURSOR_REPORT_DATA,
  lovable: LOVABLE_REPORT_DATA,
  replit: REPLIT_REPORT_DATA,
  elevenlabs: ELEVENLABS_REPORT_DATA,
  moonshot: MOONSHOT_REPORT_DATA,
  deepseek: DEEPSEEK_REPORT_DATA,
  qwen: QWEN_REPORT_DATA,
  z: Z_REPORT_DATA,
  klingai: KLINGAI_REPORT_DATA,
  higgsfield: HIGGSFIELD_REPORT_DATA,
  manus: MANUS_REPORT_DATA,
}
