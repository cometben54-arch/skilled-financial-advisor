import type { Skill, PortfolioItem, AIConfig, AnalysisReport } from '../types';
import type { Locale } from '../i18n';

const CHAT_API = '/api/chat';

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
    ? '\n\nIMPORTANT: Respond entirely in Chinese (简体中文).'
    : '\n\nIMPORTANT: Respond entirely in English.';
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

// ── Phase 1: Summary + Sector Allocation + Risk Metrics + Health Score ──

const PHASE1_PROMPT = `Respond ONLY in valid JSON (no markdown fences). Analyze the portfolio and provide:
{
  "healthScore": <number 0-100>,
  "summary": "<2-3 paragraph markdown analysis with specific prices and P/E ratios>",
  "sectorAllocation": [{"name":"<sector>","value":<percent integer>,"color":"<hex color>"}],
  "riskMetrics": [{"label":"<metric name>","value":<0-100>,"max":100}]
}
Include exactly 5 risk metrics: Concentration, Volatility, Diversification, Income Yield, Downside Protection.
Include all sectors present in the portfolio with their percentage weights.`;

// ── Phase 2: Short-term Actions ──

const PHASE2_PROMPT = `Based on the portfolio below and this prior analysis summary:
{priorSummary}

Respond ONLY in valid JSON (no markdown fences). Provide short-term trading actions (1-3 months):
{
  "shortTermActions": [{"action":"buy|sell|hold","ticker":"<TICKER>","detail":"<detailed rationale with current price, P/E, and specific % adjustment>"}]
}
Provide 5-7 actions. Each detail should be 1-2 sentences with specific price targets.`;

// ── Phase 3: Long-term View + Risk Warnings ──

const PHASE3_PROMPT = `Based on the portfolio below and this prior analysis summary:
{priorSummary}

Respond ONLY in valid JSON (no markdown fences). Provide long-term analysis:
{
  "longTermView": "<detailed markdown analysis (3-5 paragraphs) with target allocations, rebalancing path, valuation diagnosis per holding, and timeline>",
  "riskWarnings": ["<specific quantified risk 1>","<specific quantified risk 2>",...]
}
Provide 5-7 risk warnings. The long-term view should include per-stock valuation analysis.`;

function tryParseJson(raw: string): Record<string, unknown> | null {
  try {
    let str = raw;
    const m = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (m) str = m[1];
    else {
      const jm = raw.match(/\{[\s\S]*\}/);
      if (jm) str = jm[0];
    }
    return JSON.parse(str);
  } catch {
    return null;
  }
}

export type PhaseCallback = (phase: number, partial: Partial<AnalysisReport>) => void;

export async function generateAnalysisPhased(
  skill: Skill,
  portfolio: PortfolioItem[],
  aiConfig: AIConfig,
  locale: Locale,
  onPhase: PhaseCallback,
): Promise<AnalysisReport> {
  const ctx = buildPortfolioContext(portfolio);
  const systemPrompt = skill.promptTemplate.replace('{{portfolio_context}}', ctx);
  const lang = langNote(locale);
  const custom = customKeyPayload(aiConfig);

  // ── Phase 1 ──
  const p1Raw = await callChat({
    systemPrompt,
    userMessage: `Portfolio:\n${ctx}\n\n${PHASE1_PROMPT}${lang}`,
    mode: aiConfig.mode,
    ...custom,
  });

  const p1 = tryParseJson(p1Raw);
  const phase1: Partial<AnalysisReport> = {
    healthScore: (p1?.healthScore as number) ?? 65,
    summary: (p1?.summary as string) ?? p1Raw.slice(0, 800),
    sectorAllocation: (p1?.sectorAllocation as AnalysisReport['sectorAllocation']) ?? [],
    riskMetrics: (p1?.riskMetrics as AnalysisReport['riskMetrics']) ?? [],
  };
  onPhase(1, phase1);

  // ── Phase 2 ──
  const summaryBrief = (phase1.summary ?? '').slice(0, 300);
  const p2Raw = await callChat({
    systemPrompt,
    userMessage: `Portfolio:\n${ctx}\n\n${PHASE2_PROMPT.replace('{priorSummary}', summaryBrief)}${lang}`,
    mode: aiConfig.mode,
    ...custom,
  });

  const p2 = tryParseJson(p2Raw);
  const phase2: Partial<AnalysisReport> = {
    shortTermActions: (p2?.shortTermActions as AnalysisReport['shortTermActions']) ?? [],
  };
  onPhase(2, phase2);

  // ── Phase 3 ──
  const p3Raw = await callChat({
    systemPrompt,
    userMessage: `Portfolio:\n${ctx}\n\n${PHASE3_PROMPT.replace('{priorSummary}', summaryBrief)}${lang}`,
    mode: aiConfig.mode,
    ...custom,
  });

  const p3 = tryParseJson(p3Raw);
  const phase3: Partial<AnalysisReport> = {
    longTermView: (p3?.longTermView as string) ?? '',
    riskWarnings: (p3?.riskWarnings as string[]) ?? [],
  };
  onPhase(3, phase3);

  return {
    healthScore: phase1.healthScore!,
    summary: phase1.summary!,
    sectorAllocation: phase1.sectorAllocation!,
    riskMetrics: phase1.riskMetrics!,
    shortTermActions: phase2.shortTermActions!,
    longTermView: phase3.longTermView!,
    riskWarnings: phase3.riskWarnings!,
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
