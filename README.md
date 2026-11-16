# InvestorPOV

**A first-read investment memo for any startup.**

Enter a company's domain. InvestorPOV reads its homepage and drafts a memo: summary, market, competitors, SWOT, risks, growth levers and a score out of 100.

Built in 48 hours at Cursor Hackathon Kashmir (NIT Srinagar, March 2026). Selected by the Round 1 jury and winner of the v0 by Vercel track for UI design.

## How it works

1. **You enter a domain**, for example `stripe.com`.
2. **The server reads the homepage.** It keeps the title, description, headings, paragraphs and list items, up to the first 3,000 characters. Nothing else is fetched.
3. **Gemini drafts the memo.** One request, routed through ZenMux, returns the six sections and a score.

What it does not do: read beyond the homepage, look up funding, revenue or team data, or give investment advice.

The site also includes 19 stored sample memos at `/company`. They were written in advance and are not refreshed.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, with the design tokens and component classes in `app/globals.css` |
| Font | Funnel Sans, loaded with `next/font` |
| AI model | Google Gemini 3.5 Flash, via ZenMux |
| Page reading | Cheerio |
| Hosting | Vercel, with Vercel Analytics |

## Project structure

```
app/
  api/analyze/route.ts    Reads the homepage and asks Gemini for the memo
  company/page.tsx        Directory of stored memos
  company/[slug]/page.tsx One stored memo, with its own title and address
  layout.tsx              Font, metadata, skip link
  not-found.tsx           404 page
  globals.css             Tokens, type scale, controls, motion
components/
  Memo.tsx                The memo page (used for stored and live memos)
  ScoreRing.tsx           Animated score
  Reveal.tsx              Scroll-triggered entrance
  DirectoryList.tsx       Searchable list of stored memos
  SiteNav.tsx, SiteFooter.tsx
  home/                   Landing page, analyze form, loader
lib/
  companies.ts            The 19 stored memos
  memo.ts                 Domain, score and market-size helpers
```

## Getting started

Requires Node.js 18+ and pnpm.

Create `.env.local` in the project root:

```env
ZENMUX_API_KEY=your_zenmux_api_key
```

```bash
pnpm install
```

```bash
pnpm dev
```

Open http://localhost:3000. Stored memos work without a key; drafting a new memo needs one.

## Deployment

Deployed on Vercel. Add `ZENMUX_API_KEY` in the Vercel project settings.

## License

MIT
