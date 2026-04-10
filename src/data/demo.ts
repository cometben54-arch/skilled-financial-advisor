import type { PortfolioItem, AnalysisReport } from '../types';

export const demoPortfolio: PortfolioItem[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', weight: 25, costBasis: 145.0, sector: 'Technology' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', weight: 20, costBasis: 310.0, sector: 'Technology' },
  { ticker: 'NVDA', name: 'NVIDIA Corp.', weight: 15, costBasis: 220.0, sector: 'Technology' },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', weight: 12, costBasis: 130.0, sector: 'Consumer Discretionary' },
  { ticker: 'JPM', name: 'JPMorgan Chase', weight: 8, costBasis: 155.0, sector: 'Financials' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', weight: 7, costBasis: 165.0, sector: 'Healthcare' },
  { ticker: 'VTI', name: 'Vanguard Total Stock', weight: 8, costBasis: 210.0, sector: 'Broad Market ETF' },
  { ticker: 'BND', name: 'Vanguard Total Bond', weight: 5, costBasis: 74.0, sector: 'Fixed Income' },
];

export const demoReport: AnalysisReport = {
  healthScore: 72,
  sectorAllocation: [
    { name: 'Technology', value: 60, color: '#6366f1' },
    { name: 'Consumer', value: 12, color: '#f59e0b' },
    { name: 'Financials', value: 8, color: '#10b981' },
    { name: 'Healthcare', value: 7, color: '#ef4444' },
    { name: 'Broad Market', value: 8, color: '#8b5cf6' },
    { name: 'Fixed Income', value: 5, color: '#06b6d4' },
  ],
  riskMetrics: [
    { label: 'Concentration', value: 78, max: 100 },
    { label: 'Volatility', value: 65, max: 100 },
    { label: 'Diversification', value: 35, max: 100 },
    { label: 'Income Yield', value: 22, max: 100 },
    { label: 'Downside Protection', value: 30, max: 100 },
  ],
  shortTermActions: [
    { action: 'sell', ticker: 'NVDA', detail: 'Trim 5% — position exceeds single-stock concentration threshold at current valuation' },
    { action: 'buy', ticker: 'VTI', detail: 'Add 3% — increase broad market diversification to reduce single-name risk' },
    { action: 'buy', ticker: 'BND', detail: 'Add 5% — increase fixed income allocation for portfolio stability' },
    { action: 'buy', ticker: 'GLD', detail: 'Initiate 3% position — add inflation hedge and uncorrelated asset' },
    { action: 'hold', ticker: 'AAPL', detail: 'Maintain position — strong cash flow, reasonable valuation, and share buyback program' },
  ],
  longTermView: `**Asset Allocation Thesis (1-3 Year Horizon)**

Your portfolio is heavily tilted toward large-cap technology (60% combined weight). While these are quality businesses with durable competitive advantages, the concentration creates significant drawdown risk during sector rotations.

**Recommended Target Allocation:**
- Technology: 35-40% (reduce from 60%)
- Broad Market / International: 20% (increase from 8%)
- Fixed Income: 15-20% (increase from 5%)
- Real Assets (REITs, Commodities): 5-10% (new allocation)
- Healthcare / Defensive: 10% (increase from 7%)

**Rationale:** Current market cycle favors gradual diversification. Technology valuations have expanded significantly, and a more balanced allocation will provide better risk-adjusted returns through a full market cycle while preserving upside participation.`,
  riskWarnings: [
    'Sector concentration: 60% technology exposure creates significant drawdown risk during sector rotations',
    'Low fixed income: 5% bonds is inadequate for portfolio stability — target 15-20% for moderate risk tolerance',
    'No international diversification: 100% US exposure misses global growth opportunities and adds geographic concentration risk',
    'Limited inflation protection: No real assets or TIPS allocation leaves portfolio vulnerable to sustained inflation',
  ],
  summary: `Based on **Warren Buffett's value investing** principles, your portfolio contains quality businesses but suffers from excessive concentration in technology. While companies like Apple and Microsoft possess durable competitive moats, the 60% tech allocation violates the margin-of-safety principle at current valuations. I recommend gradually rebalancing toward a more diversified allocation that includes undervalued sectors and protective fixed-income positions.`,
};
