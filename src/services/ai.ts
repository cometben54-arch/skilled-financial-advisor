import type { Skill, PortfolioItem, AIConfig, AnalysisReport } from '../types';
import type { Locale } from '../i18n';

const CHAT_API = '/api/chat';

// ── Utilities ──

function buildPortfolioContext(portfolio: PortfolioItem[]): string {
  return portfolio.map((p) => {
    const parts = [`${p.ticker} (${p.name}) — ${p.weight}%`];
    if (p.costBasis) parts.push(`cost basis: $${p.costBasis}`);
    if (p.currentPrice) parts.push(`current price: $${p.currentPrice}`);
    if (p.sector) parts.push(`sector: ${p.sector}`);
    return parts.join(', ');
  }).join('\n');
}

function langNote(locale: Locale) {
  return locale === 'zh'
    ? '\n\nCRITICAL: Respond entirely in Chinese (简体中文). All string values must be in Chinese.'
    : '\n\nCRITICAL: Respond entirely in English.';
}

function customKeyPayload(aiConfig: AIConfig) {
  return aiConfig.useCustom ? {
    customEndpoint: aiConfig.customEndpoint,
    customApiKey: aiConfig.customApiKey,
    customModel: aiConfig.customModelName,
  } : {};
}

async function callChat(payload: Record<string, unknown>): Promise<string> {
  const res = await fetch(CHAT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error((err as { error?: string }).error || `API error ${res.status}`);
  }
  const data = await res.json() as { content: string };
  return data.content;
}

// ── Credits ──

const CREDITS_KEY = 'pp-credits';
const DEFAULT_CREDITS = 50;

export function getCredits(): number {
  try {
    const raw = localStorage.getItem(CREDITS_KEY);
    if (raw === null) return DEFAULT_CREDITS;
    return parseInt(raw, 10);
  } catch {
    return DEFAULT_CREDITS;
  }
}

export function deductCredits(amount: number): number {
  const current = getCredits();
  const next = Math.max(0, current - amount);
  localStorage.setItem(CREDITS_KEY, String(next));
  return next;
}

export function hasEnoughCredits(mode: 'quick' | 'expert'): boolean {
  const cost = mode === 'quick' ? 1 : 2;
  return getCredits() >= cost;
}

// ── Robust JSON extraction ──

/**
 * Extract the first valid JSON object from text, handling:
 * - Raw JSON
 * - JSON wrapped in ```json fences
 * - JSON with prose before/after
 * - Multiple brace nesting levels
 */
function extractJson(raw: string): Record<string, unknown> | null {
  // Strategy 1: Code fence
  const fenceMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch { /* fall through */ }
  }

  // Strategy 2: Balanced brace matching — find the largest valid JSON object
  const startIdx = raw.indexOf('{');
  if (startIdx === -1) return null;

  // Try to find a balanced JSON object starting from each '{'
  for (let i = startIdx; i < raw.length; i++) {
    if (raw[i] !== '{') continue;
    let depth = 0;
    let inString = false;
    let escape = false;
    for (let j = i; j < raw.length; j++) {
      const ch = raw[j];
      if (escape) { escape = false; continue; }
      if (ch === '\\') { escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (inString) continue;
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          const candidate = raw.slice(i, j + 1);
          try {
            return JSON.parse(candidate);
          } catch { break; }
        }
      }
    }
  }

  return null;
}

// ── Fallback regex-based extraction for when JSON fails ──

function extractShortTermActionsFromText(raw: string): AnalysisReport['shortTermActions'] {
  const actions: AnalysisReport['shortTermActions'] = [];
  // Match patterns like: **[BUY] TICKER** — detail, or BUY TICKER: detail, or - BUY TICKER - detail
  // Also handles Chinese: 买入/卖出/持有 TICKER
  const patterns = [
    /\*{0,2}\[?(BUY|SELL|HOLD|买入|卖出|持有|减仓|加仓|建仓|维持)\]?\s*([A-Z]{1,5})\*{0,2}\s*[—\-:：]\s*([^\n]+(?:\n(?!\s*\*|\s*\d+\.|\s*[-*]\s*\*{0,2}\[?(?:BUY|SELL|HOLD|买入|卖出|持有|减仓|加仓|建仓|维持)).*)*)/gi,
    /["']action["']\s*:\s*["'](buy|sell|hold)["'][^}]*?["']ticker["']\s*:\s*["']([A-Z]+)["'][^}]*?["']detail["']\s*:\s*["']([^"']+)["']/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(raw)) !== null) {
      const rawAction = match[1].toLowerCase();
      let action: 'buy' | 'sell' | 'hold';
      if (['buy', '买入', '加仓', '建仓'].includes(rawAction)) action = 'buy';
      else if (['sell', '卖出', '减仓'].includes(rawAction)) action = 'sell';
      else action = 'hold';

      actions.push({
        action,
        ticker: match[2].toUpperCase(),
        detail: match[3].trim().replace(/\s+/g, ' ').slice(0, 400),
      });
      if (actions.length >= 10) break;
    }
    if (actions.length > 0) break;
  }

  return actions;
}

function extractRiskWarningsFromText(raw: string): string[] {
  const warnings: string[] = [];

  // Strategy 1: Numbered list
  const numbered = raw.match(/\d+[.、]\s*([^\n]+(?:\n(?!\s*\d+[.、]).*)*)/g);
  if (numbered && numbered.length >= 2) {
    for (const item of numbered) {
      const cleaned = item.replace(/^\d+[.、]\s*/, '').trim().replace(/\s+/g, ' ');
      if (cleaned.length > 10 && cleaned.length < 500) warnings.push(cleaned);
    }
  }

  // Strategy 2: Bullet list
  if (warnings.length === 0) {
    const bullets = raw.match(/[-*•]\s*([^\n]+(?:\n(?![-*•\d]).*)*)/g);
    if (bullets) {
      for (const item of bullets) {
        const cleaned = item.replace(/^[-*•]\s*/, '').trim().replace(/\s+/g, ' ');
        if (cleaned.length > 10 && cleaned.length < 500) warnings.push(cleaned);
      }
    }
  }

  // Strategy 3: Lines separated by newlines
  if (warnings.length === 0) {
    const lines = raw.split(/\n\n+/).filter((l) => l.trim().length > 20 && l.trim().length < 500);
    warnings.push(...lines.slice(0, 7));
  }

  return warnings.slice(0, 8);
}

function extractLongTermFromText(raw: string): string {
  // Remove obvious JSON artifacts
  const cleaned = raw
    .replace(/```(?:json)?[\s\S]*?```/g, '')
    .replace(/^\s*\{[\s\S]*?\}\s*$/gm, '')
    .trim();
  return cleaned.slice(0, 3000);
}

// ── Prompts ──

function jsonDirective(): string {
  return `

=== RESPONSE FORMAT ===
You MUST respond with ONLY valid JSON. No explanation, no prose, no markdown fences, nothing before or after the JSON object. Start your response with { and end with }.`;
}

const PHASE1_PROMPT = `Analyze the portfolio and output this exact JSON structure:
{
  "healthScore": <integer 0-100>,
  "summary": "<2-3 paragraph analysis with specific current prices and P/E ratios for key holdings>",
  "sectorAllocation": [{"name":"<sector name>","value":<integer percent>,"color":"#6366f1"}],
  "riskMetrics": [{"label":"<metric name>","value":<integer 0-100>,"max":100}]
}

REQUIREMENTS:
- Include exactly 5 risk metrics with these labels: Concentration, Volatility, Diversification, Income Yield, Downside Protection
- Include all sectors present in the portfolio
- Use these colors in order: #6366f1, #f59e0b, #10b981, #ef4444, #8b5cf6, #06b6d4, #f97316, #ec4899
- Summary must be in the active skill's voice but factual`;

const PHASE2_PROMPT = `Output this exact JSON structure with short-term trading actions (1-3 months):
{
  "shortTermActions": [
    {"action": "buy", "ticker": "AAPL", "detail": "Rationale with current price and specific % adjustment"}
  ]
}

REQUIREMENTS:
- action must be exactly "buy", "sell", or "hold" (lowercase, English)
- ticker must be uppercase letters only
- detail must be 1-3 sentences with specific price targets and % adjustments
- Provide 5-7 actions total
- Prior context: {priorSummary}`;

const PHASE3_PROMPT = `Output this exact JSON structure with long-term view and risk warnings:
{
  "longTermView": "Detailed 3-5 paragraph markdown analysis with target allocations, rebalancing path, valuation diagnosis per holding, and timeline",
  "riskWarnings": [
    "Specific quantified risk 1 with numbers",
    "Specific quantified risk 2 with numbers"
  ]
}

REQUIREMENTS:
- longTermView: detailed markdown with section headers (use **bold** for emphasis)
- riskWarnings: array of 5-7 specific quantified risks
- Prior context: {priorSummary}`;

// ── Main phased generation ──

export type PhaseCallback = (phase: number, partial: Partial<AnalysisReport>) => void;

async function callPhase(
  systemPrompt: string,
  userMessage: string,
  mode: 'quick' | 'expert',
  custom: Record<string, unknown>,
): Promise<{ parsed: Record<string, unknown> | null; raw: string }> {
  // Append JSON directive directly to the system prompt to override skill-level formatting
  const effectiveSystem = systemPrompt + jsonDirective();

  const raw = await callChat({
    systemPrompt: effectiveSystem,
    userMessage,
    mode,
    ...custom,
  });

  return { parsed: extractJson(raw), raw };
}

export async function generateAnalysisPhased(
  skill: Skill,
  portfolio: PortfolioItem[],
  aiConfig: AIConfig,
  locale: Locale,
  onPhase: PhaseCallback,
): Promise<AnalysisReport> {
  const ctx = buildPortfolioContext(portfolio);
  const baseSystem = skill.promptTemplate.replace('{{portfolio_context}}', ctx);
  const lang = langNote(locale);
  const custom = customKeyPayload(aiConfig);

  // ── Phase 1 ──
  const p1 = await callPhase(
    baseSystem,
    `Portfolio:\n${ctx}\n\n${PHASE1_PROMPT}${lang}`,
    aiConfig.mode,
    custom,
  );

  const phase1: Partial<AnalysisReport> = {
    healthScore: (p1.parsed?.healthScore as number) ?? 65,
    summary: (p1.parsed?.summary as string) ?? p1.raw.slice(0, 1000),
    sectorAllocation: (p1.parsed?.sectorAllocation as AnalysisReport['sectorAllocation']) ?? [],
    riskMetrics: (p1.parsed?.riskMetrics as AnalysisReport['riskMetrics']) ?? [],
  };
  onPhase(1, phase1);

  // ── Phase 2 — Short-term actions ──
  const summaryBrief = (phase1.summary ?? '').slice(0, 400);
  let phase2: Partial<AnalysisReport> = { shortTermActions: [] };
  try {
    const p2 = await callPhase(
      baseSystem,
      `Portfolio:\n${ctx}\n\n${PHASE2_PROMPT.replace('{priorSummary}', summaryBrief)}${lang}`,
      aiConfig.mode,
      custom,
    );

    let actions = (p2.parsed?.shortTermActions as AnalysisReport['shortTermActions']) ?? [];
    // Fallback: if parse gave nothing, try regex on raw text
    if (!actions || actions.length === 0) {
      actions = extractShortTermActionsFromText(p2.raw);
    }
    phase2 = { shortTermActions: actions };
  } catch (err) {
    console.warn('Phase 2 failed:', err);
  }
  onPhase(2, phase2);

  // ── Phase 3 — Long-term + risks ──
  let phase3: Partial<AnalysisReport> = { longTermView: '', riskWarnings: [] };
  try {
    const p3 = await callPhase(
      baseSystem,
      `Portfolio:\n${ctx}\n\n${PHASE3_PROMPT.replace('{priorSummary}', summaryBrief)}${lang}`,
      aiConfig.mode,
      custom,
    );

    let longTermView = (p3.parsed?.longTermView as string) ?? '';
    let riskWarnings = (p3.parsed?.riskWarnings as string[]) ?? [];

    // Fallback: if either is missing, extract from raw text
    if (!longTermView || longTermView.length < 50) {
      longTermView = extractLongTermFromText(p3.raw);
    }
    if (!riskWarnings || riskWarnings.length === 0) {
      riskWarnings = extractRiskWarningsFromText(p3.raw);
    }

    phase3 = { longTermView, riskWarnings };
  } catch (err) {
    console.warn('Phase 3 failed:', err);
  }
  onPhase(3, phase3);

  return {
    healthScore: phase1.healthScore!,
    summary: phase1.summary!,
    sectorAllocation: phase1.sectorAllocation!,
    riskMetrics: phase1.riskMetrics!,
    shortTermActions: phase2.shortTermActions ?? [],
    longTermView: phase3.longTermView ?? '',
    riskWarnings: phase3.riskWarnings ?? [],
  };
}

export async function sendFollowUp(
  messages: { role: 'user' | 'assistant'; content: string }[],
  skillPrompt: string,
  portfolioContext: string,
  aiConfig: AIConfig,
  locale: Locale,
): Promise<string> {
  const lang = locale === 'zh' ? 'Respond in Chinese (简体中文).' : 'Respond in English.';
  const conversationText = messages.map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');

  return callChat({
    systemPrompt: `${skillPrompt}\n\nPortfolio context:\n${portfolioContext}\n\n${lang}\n\nYou are in a follow-up conversation. Continue advising based on the analysis already provided.`,
    userMessage: conversationText,
    mode: 'expert',
    ...customKeyPayload(aiConfig),
  });
}
