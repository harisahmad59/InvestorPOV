import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Exa from "exa-js";
import { ApifyClient } from "apify-client";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const exa = new Exa(process.env.EXA_API_KEY!);
const apify = new ApifyClient({ token: process.env.APIFY_API_TOKEN! });

interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface AnalysisResult {
  name: string;
  summary: string;
  market: string;
  tam: string;
  businessModel: string;
  competitors: string[];
  swot: SwotData;
  verdict: string;
  score: number;
}

// ---------- Exa ----------
async function fetchExaContext(domain: string): Promise<string> {
  try {
    const exaQuery = `${domain} official website what does ${domain} do`;
    console.log("EXA_QUERY:", exaQuery);

    const response = await exa.searchAndContents(exaQuery, {
      numResults: 3,
      text: true,
    });

    const context = response.results
      .map((r: any) => `${r.title}: ${r.text?.slice(0, 200)}`)
      .join("\n\n");

    console.log("EXA_CONTEXT:", context.slice(0, 200));
    return context || "";
  } catch (err) {
    console.log(
      "EXA_FALLBACK: Exa search failed, proceeding without context",
      err
    );
    return "";
  }
}

// ---------- Apify ----------
async function fetchApifyContent(url: string): Promise<string> {
  if (!url) return "";

  try {
    console.log("APIFY_CRAWL:", url);

    const run = await apify.actor("apify/website-content-crawler").call({
      startUrls: [{ url }],
      maxPagesPerCrawl: 1,
    });

    const { items } = await apify.dataset(run.defaultDatasetId).listItems();

    const apifyText = items
      .map((item: any) => item.text || item.markdown || "")
      .join("\n\n")
      .slice(0, 1000);

    console.log("APIFY_TEXT:", apifyText.slice(0, 200));
    return apifyText;
  } catch (err) {
    console.log(
      "APIFY_FALLBACK: Apify crawl failed, proceeding without website data",
      err
    );
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

    // ── 2. Fetch data — locked to this domain ────────────────────────────

    // Apify always crawls the exact domain (never overridden by Exa)
    const apifyUrl = `https://${domain}`;

    // Run Exa + Apify in parallel
    const [exaContext, apifyText] = await Promise.all([
      fetchExaContext(domain),
      fetchApifyContent(apifyUrl),
    ]);

    // Safety checks
    if (!exaContext) console.warn("EXA returned empty data");
    if (!apifyText) console.warn("APIFY returned empty data");

    // Clean and limit inputs
    const cleanedApify = apifyText.replace(/\s+/g, " ").trim().slice(0, 1000);
    const cleanedExa = exaContext.replace(/\s+/g, " ").trim().slice(0, 700);

    // ── 3. Build structured context with strict domain lock ──────────────
    const structuredContext = `
TARGET DOMAIN: ${domain}

STRICT RULE:
Only analyze this exact company. Do NOT include or mix data from other companies.

WEBSITE DATA (primary source):
${cleanedApify || "(not available)"}

EXTERNAL DATA (supporting context, must match domain):
${cleanedExa || "(not available)"}
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
- Prioritize WEBSITE DATA over EXTERNAL DATA
- Stay grounded to this exact company

${structuredContext}

Return ONLY valid JSON:

${jsonSchema}

Rules:
- Summary must be sharp (1–2 lines)
- TAM must be ONLY a dollar amount with a suffix, like "$50B" or "$2.5T" or "$800M". Use $ sign, a number, and one letter (T/B/M). Do NOT write full words like "billion". Do NOT add extra text — just the value.
- Business model must describe how it makes money (e.g. "SaaS subscription per seat")
- Competitors must be real companies
- SWOT must be concise and realistic (2–3 items per section)
- Verdict: Write a sharp, 1–2 line investor verdict. It should sound like a real VC decision memo. Avoid labels like PASS/HOLD/BUY. Focus on insight, not classification.
- Score must be realistic (do not always give high scores), on a scale of 0 to 10`;

    const brutalPrompt = `You are a brutally honest venture capitalist.

Analyze ONLY the company at this domain: ${domain}

STRICT RULES:
- Do NOT mix with other startups
- Ignore irrelevant or conflicting data
- If data is unclear, say "insufficient data"
- Prioritize WEBSITE DATA over EXTERNAL DATA
- Stay grounded to this exact company
- Be extremely critical, direct, and harsh

${structuredContext}

Return ONLY valid JSON:

${jsonSchema}

Rules:
- Be blunt, not polite
- TAM must be ONLY a dollar amount with a suffix, like "$50B" or "$2.5T" or "$800M". Use $ sign, a number, and one letter (T/B/M). No extra text.
- Business model must describe how it makes money
- SWOT must be concise, realistic, and critical (2–3 items per section). Focus more on weaknesses and threats than strengths.
- Verdict: Write a sharp, 1–2 line investor verdict. Be brutally honest. It should sound like a blunt VC rejection or cautious pass. Avoid labels like PASS/HOLD/BUY. Focus on insight, not classification.
- Score realistically (often low), on a scale of 0 to 10
- No fluff`;

    // ── 6. Call Gemini ───────────────────────────────────────────────────
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: isBrutal ? brutalPrompt : normalPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: isBrutal ? 0.9 : 0.7,
      },
    });

    const raw = result.response.text().trim();

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

    // Clamp score to 0–10 range
    parsed.score = Math.max(0, Math.min(10, Math.round(parsed.score)));

    return NextResponse.json(parsed, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
