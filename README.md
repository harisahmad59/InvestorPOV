# InvestorPOV

**AI-powered startup analysis for investors who value speed and clarity.**

Paste any startup URL and get a VC-grade investment memo — complete with market sizing, competitor mapping, SWOT analysis, risk scoring, and a final verdict — in under 60 seconds.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)

---

## How It Works

1. **Paste a URL** — Enter any startup's domain (e.g. `stripe.com`)
2. **Data collection** — Apify scrapes live website content while Exa pulls intelligent search results in parallel
3. **AI analysis** — Google Gemini processes the structured data and generates a comprehensive investment memo
4. **Get your verdict** — A full report with scores, risks, SWOT, and a final investment recommendation

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Full-stack React with API routes |
| **Language** | TypeScript | Type safety across the codebase |
| **Styling** | Tailwind CSS 4 + shadcn/ui | Utility-first CSS with accessible components |
| **AI Model** | Google Gemini 2.0 Flash | Structured analysis and JSON generation |
| **Web Scraping** | Apify | Deep website content crawling |
| **Search** | Exa | Intelligent semantic search for external context |
| **Deployment** | Vercel | Serverless hosting with edge functions |
| **Analytics** | Vercel Analytics | Privacy-friendly usage tracking |

## Tools Used in Development

### v0 by Vercel
The landing page UI was initially designed and prototyped using [v0](https://v0.dev), Vercel's generative UI tool. v0 generated the foundational React + Tailwind components — including the hero section, feature bento grid, how-it-works cards, and overall layout structure — which were then customized and extended.

### Cursor
The entire project was built and iterated on in [Cursor](https://cursor.com), an AI-powered code editor. Cursor was used for:
- Building the API route and data pipeline (Apify + Exa + Gemini)
- Refining and extending the landing page beyond v0's initial output
- Component creation, debugging, and iterative UI polish
- Git operations and deployment workflow

### Apify
[Apify](https://apify.com) powers the web scraping layer. When a user submits a startup URL, Apify's Website Content Crawler actor scrapes the live website to extract product descriptions, pricing info, and other structured content. This gives the AI model real, up-to-date data to work with rather than relying on training data alone.

### Exa
[Exa](https://exa.ai) provides intelligent semantic search. It fetches external context about the startup — news coverage, market positioning, and competitive landscape — to supplement the direct website data. Exa and Apify run in parallel to minimize latency.

### Google Gemini
[Google Gemini 2.0 Flash](https://ai.google.dev) is the AI backbone. It takes the structured context from Apify and Exa, then generates a comprehensive JSON-formatted investment analysis covering market sizing, business model, competitors, SWOT, and a scored verdict.

## Features

- **Instant analysis** — Full investment memo generated in under 60 seconds
- **Brutal Mode** — Toggle for a harsh, no-nonsense VC perspective
- **Six analysis lenses** — Business fundamentals, market sizing, competitor mapping, SWOT analysis, investment scores, and risk assessment
- **Smart input** — Accepts raw domains, full URLs, or partial inputs
- **Animated UI** — Typing animations, score counters, and smooth transitions
- **Responsive design** — Fully optimized for desktop and mobile

## Project Structure

```
InvestorPOV/
├── app/
│   ├── api/analyze/route.ts   # API endpoint (Apify + Exa + Gemini pipeline)
│   ├── page.tsx               # Landing page with all sections
│   ├── layout.tsx             # Root layout with metadata
│   └── globals.css            # Global styles and CSS variables
├── components/
│   ├── Report.tsx             # Analysis report dashboard component
│   └── ui/                    # shadcn/ui component library
├── public/                    # Static assets and favicons
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key
EXA_API_KEY=your_exa_api_key
APIFY_API_TOKEN=your_apify_api_token
```

### Installation

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build

```bash
pnpm build
pnpm start
```

## Deployment

The app is deployed on [Vercel](https://vercel.com). Push to `main` to trigger automatic deployments. Make sure to add the environment variables in your Vercel project settings.

## License

MIT
