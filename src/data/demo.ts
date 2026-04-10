import type { PortfolioItem, AnalysisReport } from '../types';
import type { Locale } from '../i18n';
import { zh } from '../i18n/zh';
import { en } from '../i18n/en';

export const demoPortfolio: PortfolioItem[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', weight: 25, costBasis: 145.0, currentPrice: 198.36, sector: 'Technology' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', weight: 20, costBasis: 310.0, currentPrice: 441.20, sector: 'Technology' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', weight: 15, costBasis: 220.0, currentPrice: 124.58, sector: 'Technology' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', weight: 12, costBasis: 130.0, currentPrice: 198.42, sector: 'Consumer Discretionary' },
  { ticker: 'JPM', name: 'JPMorgan Chase', weight: 8, costBasis: 155.0, currentPrice: 243.80, sector: 'Financials' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', weight: 7, costBasis: 165.0, currentPrice: 156.20, sector: 'Healthcare' },
  { ticker: 'VTI', name: 'Vanguard Total Stock', weight: 8, costBasis: 210.0, currentPrice: 281.45, sector: 'Broad Market ETF' },
  { ticker: 'BND', name: 'Vanguard Total Bond', weight: 5, costBasis: 74.0, currentPrice: 72.15, sector: 'Fixed Income' },
];

export function getDemoReport(locale: Locale, skillName?: string): AnalysisReport {
  const t = locale === 'zh' ? zh : en;
  const name = skillName || (locale === 'zh' ? '沃伦·巴菲特的价值投资' : "Warren Buffett's value investing");

  // Replace {skillName} placeholder in summary
  const summary = (t.demo_summary as string).replace(/\{skillName\}/g, name);

  return {
    healthScore: 72,
    sectorAllocation: [
      { name: t.sector_tech as string, value: 60, color: '#6366f1' },
      { name: t.sector_consumer as string, value: 12, color: '#f59e0b' },
      { name: t.sector_financials as string, value: 8, color: '#10b981' },
      { name: t.sector_healthcare as string, value: 7, color: '#ef4444' },
      { name: t.sector_broadMarket as string, value: 8, color: '#8b5cf6' },
      { name: t.sector_fixedIncome as string, value: 5, color: '#06b6d4' },
    ],
    riskMetrics: [
      { label: t.metric_concentration as string, value: 78, max: 100 },
      { label: t.metric_volatility as string, value: 65, max: 100 },
      { label: t.metric_diversification as string, value: 35, max: 100 },
      { label: t.metric_incomeYield as string, value: 22, max: 100 },
      { label: t.metric_downsideProtection as string, value: 30, max: 100 },
    ],
    shortTermActions: (t.demo_actions as unknown as { action: 'buy' | 'sell' | 'hold'; ticker: string; detail: string }[]).slice(),
    longTermView: t.demo_longTerm as string,
    riskWarnings: (t.demo_risks as unknown as string[]).slice(),
    summary,
  };
}
