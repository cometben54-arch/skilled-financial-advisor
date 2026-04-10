import type { Skill, PortfolioItem, AIConfig, AnalysisReport } from '../types';
import type { Locale } from '../i18n';

const CHAT_API = '/api/chat';

function buildPortfolioContext(portfolio: PortfolioItem[]): string {
  const lines = portfolio.map((p) => {
    const parts = [`${p.ticker} (${p.name}) — ${p.weight}%`];
    if (p.costBasis) parts.push(`cost basis: $${p.costBasis}`);
    if (p.currentPrice) parts.push(`current price: $${p.currentPrice}`);
    if (p.sector) parts.push(`sector: ${p.sector}`);
    return parts.join(', ');
  });
  return lines.join('\n');
}

function buildUserMessage(portfolio: PortfolioItem[], locale: Locale, mode: 'quick' | 'expert'): string {
  const ctx = buildPortfolioContext(portfolio);

  const formatInstructions = mode === 'quick'
    ? `Respond in JSON with this exact structure (no markdown fences around the JSON):
{
  "healthScore": <number 0-100>,
  "summary": "<markdown string>",
  "sectorAllocation": [{"name":"<sector>","value":<percent>,"color":"<hex>"}],
  "riskMetrics": [{"label":"<metric>","value":<0-100>,"max":100}],
  "shortTermActions": [{"action":"buy|sell|hold","ticker":"<TICKER>","detail":"<explanation>"}],
  "longTermView": "<markdown string>",
  "riskWarnings": ["<warning1>","<warning2>"]
}`
    : `Provide a comprehensive investment analysis report in **Markdown** format with the following sections:

## Summary
(2-3 paragraphs with specific price quotes and P/E ratios for key holdings)

## Health Score
(a single number 0-100, written as: HEALTH_SCORE: <number>)

## Sector Allocation
(list each sector with percentage, format: - <Sector>: <percent>%)

## Risk Metrics
(rate each on 0-100 scale: Concentration, Volatility, Diversification, Income Yield, Downside Protection)

## Short-term Actions (1-3 Months)
(for each: **[BUY/SELL/HOLD] TICKER** — detailed rationale with current price)

## Long-term View (1-3 Years)
(detailed analysis with target allocations and rebalancing path)

## Risk Warnings
(numbered list of specific, quantified risks)`;

  const langNote = locale === 'zh'
    ? '\n\nIMPORTANT: Respond entirely in Chinese (简体中文).'
    : '\n\nIMPORTANT: Respond entirely in English.';

  return `Here is my current portfolio:\n\n${ctx}\n\nPlease analyze this portfolio and provide advice.\n\n${formatInstructions}${langNote}`;
}

function parseQuickResponse(raw: string): AnalysisReport | null {
  try {
    // Try to extract JSON from the response
    let jsonStr = raw;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonStr = jsonMatch[0];
    const parsed = JSON.parse(jsonStr);
    return {
      healthScore: parsed.healthScore ?? 50,
      summary: parsed.summary ?? '',
      sectorAllocation: parsed.sectorAllocation ?? [],
      riskMetrics: parsed.riskMetrics ?? [],
      shortTermActions: parsed.shortTermActions ?? [],
      longTermView: parsed.longTermView ?? '',
      riskWarnings: parsed.riskWarnings ?? [],
    };
  } catch {
    return null;
  }
}

function parseExpertResponse(raw: string): AnalysisReport {
  // Extract health score
  const scoreMatch = raw.match(/HEALTH_SCORE:\s*(\d+)/i);
  const healthScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 65;

  // Extract sector allocation
  const sectorColors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];
  const sectorAllocation: AnalysisReport['sectorAllocation'] = [];
  const sectorRegex = /[-*]\s*(.+?):\s*(\d+)%/g;
  const sectorSection = raw.match(/## Sector Allocation[\s\S]*?(?=##|$)/i)?.[0] || raw;
  let sectorMatch;
  while ((sectorMatch = sectorRegex.exec(sectorSection)) !== null) {
    sectorAllocation.push({
      name: sectorMatch[1].trim(),
      value: parseInt(sectorMatch[2], 10),
      color: sectorColors[sectorAllocation.length % sectorColors.length],
    });
  }

  // Extract risk metrics
  const riskMetrics: AnalysisReport['riskMetrics'] = [];
  const riskSection = raw.match(/## Risk Metrics[\s\S]*?(?=##|$)/i)?.[0] || '';
  const riskRegex = /[-*]\s*(.+?):\s*(\d+)/g;
  let riskMatch;
  while ((riskMatch = riskRegex.exec(riskSection)) !== null) {
    riskMetrics.push({ label: riskMatch[1].trim(), value: parseInt(riskMatch[2], 10), max: 100 });
  }
  if (riskMetrics.length === 0) {
    riskMetrics.push(
      { label: 'Concentration', value: 70, max: 100 },
      { label: 'Volatility', value: 60, max: 100 },
      { label: 'Diversification', value: 40, max: 100 },
      { label: 'Income Yield', value: 25, max: 100 },
      { label: 'Downside Protection', value: 35, max: 100 },
    );
  }

  // Extract short-term actions
  const shortTermActions: AnalysisReport['shortTermActions'] = [];
  const actionsSection = raw.match(/## Short-term Actions[\s\S]*?(?=##|$)/i)?.[0] || '';
  const actionRegex = /\*\*\[?(BUY|SELL|HOLD)\]?\s*([A-Z]{1,5})\*\*\s*[—-]\s*([\s\S]*?)(?=\*\*\[?(?:BUY|SELL|HOLD)|$)/gi;
  let actionMatch;
  while ((actionMatch = actionRegex.exec(actionsSection)) !== null) {
    shortTermActions.push({
      action: actionMatch[1].toLowerCase() as 'buy' | 'sell' | 'hold',
      ticker: actionMatch[2],
      detail: actionMatch[3].trim().replace(/\n/g, ' '),
    });
  }

  // Extract sections
  const summarySection = raw.match(/## Summary[\s\S]*?(?=##)/i)?.[0]?.replace(/## Summary\s*/i, '').trim() || raw.slice(0, 500);
  const longTermSection = raw.match(/## Long-term View[\s\S]*?(?=##|$)/i)?.[0]?.replace(/## Long-term View.*?\n/i, '').trim() || '';
  const warningsSection = raw.match(/## Risk Warnings[\s\S]*?(?=##|$)/i)?.[0] || '';
  const riskWarnings: string[] = [];
  const warnRegex = /\d+\.\s*([\s\S]*?)(?=\d+\.|$)/g;
  let warnMatch;
  while ((warnMatch = warnRegex.exec(warningsSection)) !== null) {
    const w = warnMatch[1].trim();
    if (w) riskWarnings.push(w);
  }

  return {
    healthScore,
    summary: summarySection,
    sectorAllocation: sectorAllocation.length > 0 ? sectorAllocation : [
      { name: 'Technology', value: 60, color: '#6366f1' },
      { name: 'Other', value: 40, color: '#94a3b8' },
    ],
    riskMetrics,
    shortTermActions,
    longTermView: longTermSection,
    riskWarnings,
  };
}

export async function generateAnalysis(
  skill: Skill,
  portfolio: PortfolioItem[],
  aiConfig: AIConfig,
  locale: Locale,
): Promise<AnalysisReport> {
  const portfolioContext = buildPortfolioContext(portfolio);
  const systemPrompt = skill.promptTemplate.replace('{{portfolio_context}}', portfolioContext);
  const userMessage = buildUserMessage(portfolio, locale, aiConfig.mode);

  const res = await fetch(CHAT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt,
      userMessage,
      mode: aiConfig.mode,
      ...(aiConfig.useCustom ? {
        customEndpoint: aiConfig.customEndpoint,
        customApiKey: aiConfig.customApiKey,
        customModel: aiConfig.customModelName,
      } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error((err as { error?: string }).error || `API error ${res.status}`);
  }

  const data = await res.json() as { content: string };
  const raw = data.content;

  if (aiConfig.mode === 'quick') {
    const parsed = parseQuickResponse(raw);
    if (parsed) return parsed;
  }

  return parseExpertResponse(raw);
}

export async function sendFollowUp(
  messages: { role: 'user' | 'assistant'; content: string }[],
  skillPrompt: string,
  portfolioContext: string,
  aiConfig: AIConfig,
  locale: Locale,
): Promise<string> {
  // For follow-up, we send the full conversation as the user message
  const langNote = locale === 'zh' ? 'Respond in Chinese (简体中文).' : 'Respond in English.';
  const conversationText = messages.map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');

  const res = await fetch(CHAT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemPrompt: `${skillPrompt}\n\nPortfolio context:\n${portfolioContext}\n\n${langNote}\n\nYou are in a follow-up conversation. Continue advising based on the analysis already provided.`,
      userMessage: conversationText,
      mode: 'expert',
      ...(aiConfig.useCustom ? {
        customEndpoint: aiConfig.customEndpoint,
        customApiKey: aiConfig.customApiKey,
        customModel: aiConfig.customModelName,
      } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error((err as { error?: string }).error || `API error ${res.status}`);
  }

  const data = await res.json() as { content: string };
  return data.content;
}
