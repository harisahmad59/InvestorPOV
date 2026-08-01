import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface RiskItem {
  risk: string;
  severity: "High" | "Medium" | "Low";
  mitigation: string;
}

interface AnalysisResult {
  name: string;
  summary: string;
  market: string;
  tam: string;
  businessModel: string;
  competitors: string[];
  swot: SwotData;
  risks: RiskItem[];
  growthLevers: string[];
  verdict: string;
  score: number;
}

// ---------- Exa ----------
// ---------- Cheerio Web Scraping ----------
async function fetchWebsiteContent(url: string): Promise<string> {
  if (!url) return "";

  // Ensure protocol
  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  try {
    console.log("SCRAPING_URL:", targetUrl);

    // Set a timeout of 10 seconds for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`HTTP error status: ${response.status} for ${targetUrl}`);
      return "";
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove scripts, styles, images, inline SVG, etc. to get cleaner text
    $("script, style, svg, noscript, iframe, img, path").remove();

    const title = $("title").text().trim();
    const metaDescription = $("meta[name='description']").attr("content") || "";

    // Extract text from headings and paragraphs
    const textElements: string[] = [];

    // Get text from body paragraphs and headers
    $("h1, h2, h3, h4, h5, h6, p, li").each((_, element) => {
      const text = $(element).text().trim();
      if (text) {
        textElements.push(text);
      }
    });

    const bodyText = textElements.join("\n").replace(/\s+/g, " ").trim().slice(0, 3000);

    const context = `
Title: ${title}
Description: ${metaDescription}
Content:
${bodyText}
`.trim();

    console.log("SCRAPED_CONTENT_LENGTH:", context.length);
    return context;
  } catch (err) {
    console.error("SCRAPE_FAILED: Proceeding without website data", err);
    return "";
  }
}


export async function POST(request: Request) {
  try {
    console.log("API HIT");

    const body = await request.json();
    const { startup, mode } = body;

    if (
      !startup ||
      typeof startup !== "string" ||
      startup.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Missing or invalid 'startup' field. Please provide a domain.",
        },
        { status: 400 }
      );
    }

    // ── 1. Extract exact domain ──────────────────────────────────────────
    const domain = startup
      .trim()
      .replace(/^https?:\/\//i, "")
      .split("/")[0];

    // Validate domain format
    if (!domain.includes(".")) {
      return NextResponse.json(
        {
          error:
            "Invalid domain. Please enter a valid domain (e.g. stripe.com)",
        },
        { status: 400 }
      );
    }

    console.log("DOMAIN:", domain);

    const isBrutal = mode === "brutal";

    // ── 2. Fetch data — scrape the target domain directly ────────────────
    const urlToScrape = `https://${domain}`;
    const scrapedContent = await fetchWebsiteContent(urlToScrape);

    // ── 3. Build structured context with strict domain lock ──────────────
    const structuredContext = `
TARGET DOMAIN: ${domain}

STRICT RULE:
Only analyze this exact company. Do NOT include or mix data from other companies.

WEBSITE SCRAPED DATA:
${scrapedContent || "(not available)"}
`.trim();

    console.log("STRUCTURED_CONTEXT_LENGTH:", structuredContext.length);

    // ── 4. JSON schema ───────────────────────────────────────────────────
    const jsonSchema = `{
  "name": string,
  "summary": string,
  "market": string,
  "tam": string,
  "businessModel": string,
  "competitors": string[],
  "swot": {
    "strengths": string[],
    "weaknesses": string[],
    "opportunities": string[],
    "threats": string[]
  },
  "risks": [
    {
      "risk": string,
      "severity": "High" | "Medium" | "Low",
      "mitigation": string
    }
  ],
  "growthLevers": string[],
  "verdict": string,
  "score": number
}`;

    // ── 5. Prompts — domain-locked ───────────────────────────────────────
    const normalPrompt = `You are a senior venture capitalist.

Analyze ONLY the company at this domain: ${domain}

STRICT RULES:
- Do NOT mix with other startups
- Ignore irrelevant or conflicting data
- If data is unclear, say "insufficient data"
- Rely on WEBSITE SCRAPED DATA
- Stay grounded to this exact company

${structuredContext}

Return ONLY valid JSON:

${jsonSchema}

Rules:
- Summary must be sharp (1–2 lines)
- TAM must be highly realistic, conservative, and specific to the startup's actual niche, NOT the global broad industry (e.g. do NOT use the total AI market size for a niche AI tool; use the addressable niche customer base multiplied by average price). Avoid huge exaggerated numbers (like $500B or trillions) unless it's a massive legacy market. TAM must be ONLY a dollar amount with a suffix, like "$50B" or "$800M" or "$50M". Use $ sign, a number, and one letter (T/B/M). Do NOT write full words like "billion". Do NOT add extra text — just the value.
- Business model must describe how it makes money (e.g. "SaaS subscription per seat")
- Competitors must be real companies
- SWOT must be concise and realistic (2–3 items per section)
- Risks: Highlight 3-4 key business risks (severity: High, Medium, Low) and realistic mitigations.
- Growth Levers: Provide 3 highly actionable growth levers/ideas.
- Verdict: Write a sharp, 1–2 line investor verdict. It should sound like a real VC decision memo. Avoid labels like PASS/HOLD/BUY. Focus on insight, not classification.
- Score must be realistic (do not always give high scores), on a scale of 0 to 10`;

    const brutalPrompt = `You are a brutally honest venture capitalist.

Analyze ONLY the company at this domain: ${domain}

STRICT RULES:
- Do NOT mix with other startups
- Ignore irrelevant or conflicting data
- If data is unclear, say "insufficient data"
- Rely on WEBSITE SCRAPED DATA
- Stay grounded to this exact company
- Be extremely critical, direct, and harsh

${structuredContext}

Return ONLY valid JSON:

${jsonSchema}

Rules:
- Be blunt, not polite
- TAM must be highly critical, realistic, and conservative, refusing to accept exaggerated industry numbers. TAM must be ONLY a dollar amount with a suffix, like "$50B" or "$800M" or "$50M". Use $ sign, a number, and one letter (T/B/M). No extra text.
- Business model must describe how it makes money
- SWOT must be concise, realistic, and critical (2–3 items per section). Focus more on weaknesses and threats than strengths.
- Risks: Highlight 3-4 critical business risks (severity: High, Medium, Low) and direct mitigations. Be harsh on vulnerabilities.
- Growth Levers: Provide 3 critical, hard growth recommendations.
- Verdict: Write a sharp, 1–2 line investor verdict. Be brutally honest. It should sound like a blunt VC rejection or cautious pass. Avoid labels like PASS/HOLD/BUY. Focus on insight, not classification.
- Score realistically (often low), on a scale of 0 to 10
- No fluff`;

    // ── 6. Call ZenMux API (Gemini 3.5 Flash) ────────────────────────────
    const response = await fetch("https://zenmux.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ZENMUX_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3.5-flash",
        messages: [
          {
            role: "user",
            content: isBrutal ? brutalPrompt : normalPrompt,
          },
        ],
        temperature: isBrutal ? 0.9 : 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ZenMux API error: ${response.status} ${errorText}`);
    }

    const responseData = await response.json();
    const raw = responseData.choices?.[0]?.message?.content?.trim() || "";

    if (!raw) {
      return NextResponse.json(
        { error: "No response from AI. Please try again." },
        { status: 500 }
      );
    }

    // Strip markdown code fences if present
    const cleaned = raw
      .replace(/^```(?:json)?\s*\n?/i, "")
      .replace(/\n?```\s*$/i, "");

    let parsed: AnalysisResult;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // Validate core required fields
    if (
      typeof parsed.name !== "string" ||
      typeof parsed.summary !== "string" ||
      typeof parsed.market !== "string" ||
      !Array.isArray(parsed.competitors) ||
      typeof parsed.score !== "number"
    ) {
      return NextResponse.json(
        { error: "AI returned an invalid format. Please try again." },
        { status: 500 }
      );
    }

    // ── 7. Post-processing & validation ──────────────────────────────────

    // Override name if AI hallucinated a different company
    const nameLower = parsed.name.toLowerCase();
    const domainBase = domain.split(".")[0].toLowerCase();
    if (!nameLower.includes(domainBase) && !domainBase.includes(nameLower)) {
      console.warn(
        `NAME_MISMATCH: AI returned "${parsed.name}" for domain "${domain}" — overriding`
      );
      parsed.name = domain;
    }

    // Fallback for optional fields
    console.log("AI_TAM_RAW:", JSON.stringify(parsed.tam));
    if (typeof parsed.tam !== "string" || parsed.tam.trim().length === 0)
      parsed.tam = "";
    if (typeof parsed.businessModel !== "string")
      parsed.businessModel = "Not available";
    if (typeof parsed.verdict !== "string") parsed.verdict = "";
    if (!parsed.swot || typeof parsed.swot !== "object") {
      parsed.swot = {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
      };
    } else {
      if (!Array.isArray(parsed.swot.strengths)) parsed.swot.strengths = [];
      if (!Array.isArray(parsed.swot.weaknesses)) parsed.swot.weaknesses = [];
      if (!Array.isArray(parsed.swot.opportunities))
        parsed.swot.opportunities = [];
      if (!Array.isArray(parsed.swot.threats)) parsed.swot.threats = [];
    }

    if (!Array.isArray(parsed.risks)) {
      parsed.risks = [];
    } else {
      parsed.risks = parsed.risks.filter(
        (r: any) =>
          r &&
          typeof r.risk === "string" &&
          typeof r.mitigation === "string" &&
          (r.severity === "High" || r.severity === "Medium" || r.severity === "Low")
      );
    }

    if (!Array.isArray(parsed.growthLevers)) {
      parsed.growthLevers = [];
    } else {
      parsed.growthLevers = parsed.growthLevers.filter((g: any) => typeof g === "string");
    }

    // Clamp score to 0–10 range
    parsed.score = Math.max(0, Math.min(10, Math.round(parsed.score)));

    return NextResponse.json(parsed, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
