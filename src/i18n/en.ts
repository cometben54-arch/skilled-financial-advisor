import type { TranslationKey } from './zh';

export const en: Record<TranslationKey, unknown> = {
  // Header
  beta: 'BETA',
  model: 'Model',
  mode: 'Mode',
  quick: 'Quick',
  expert: 'Expert',

  // Skill Marketplace
  skillMarketplace: 'Skill Marketplace',
  skillMarketplaceDesc: "Select an investment master's mindset",
  searchSkills: 'Search skills...',
  all: 'All',
  popular: 'Popular',
  latest: 'Latest',
  topLiked: 'Top Liked',
  uploadNewSkill: 'Upload New Skill',
  noSkillsFound: 'No skills found matching your search.',
  official: 'Official',
  community: 'Community',
  by: 'by',

  // Upload Modal
  uploadSkillTitle: 'Upload New Skill',
  skillName: 'Skill Name',
  skillNamePlaceholder: 'e.g. Momentum Trader',
  description: 'Description',
  descriptionPlaceholder: 'A short description of the investment philosophy...',
  promptTemplate: 'Prompt Template',
  promptTemplatePlaceholder: 'You are an investment advisor with a specific philosophy...\n\nAnalyze: {{portfolio_context}}',
  promptTemplateHint: '(use {{portfolio_context}} as placeholder)',
  tags: 'Tags',
  addTag: 'Add',
  addTagPlaceholder: 'Add a tag...',
  makePublic: 'Make this skill public',
  cancel: 'Cancel',
  uploadSkill: 'Upload Skill',

  // Portfolio Input
  portfolio: 'Portfolio',
  positions: 'positions',
  collapseInput: 'Collapse input',
  activeSkillLabel: 'Active: ',
  dragDropText: 'Drag & drop a portfolio screenshot here, or',
  browse: 'browse',
  ocrHint: 'Supports screenshots from brokers — OCR will extract holdings',
  portfolioQuestions: 'Portfolio & Questions',
  portfolioPlaceholder: 'Enter your holdings and questions, e.g.:\n\nAAPL 25%, MSFT 20%, NVDA 15%\n\nShould I reduce my tech concentration?',
  holdingsDetail: 'Holdings Detail',
  addPosition: 'Add Position',
  ticker: 'Ticker',
  name: 'Name',
  weightPct: 'Weight %',
  cost: 'Cost',
  generateAdvice: 'Generate Advice',
  analyzingPortfolio: 'Analyzing Portfolio...',
  selectSkillFirst: 'Select a skill from the marketplace to begin',

  // Report
  analysisReport: 'Analysis Report',
  copy: 'Copy',
  copied: 'Copied!',
  share: 'Share',
  sectorAllocation: 'Sector Allocation',
  riskProfile: 'Risk Profile',
  healthScore: 'Health Score',
  strong: 'Strong',
  moderate: 'Moderate',
  needsWork: 'Needs Work',
  shortTermActions: 'Short-term Actions (1-3 Months)',
  longTermView: 'Long-term Asset Allocation View (1-3 Years)',
  riskWarnings: 'Risk Warnings',
  allocation: 'Allocation',

  // Loading
  parsingHoldings: 'Parsing holdings...',
  evaluatingRisk: 'Evaluating risk metrics...',
  generatingRecs: 'Generating recommendations...',
  expertModeHint: 'This may take a moment in Expert mode',

  // AI Config
  aiEngine: 'AI Engine',
  aiEngineDesc: 'Configure model and analysis mode',
  defaultModel: 'Default Model',
  freeCredits: 'Free Credits',
  useYourOwnKey: 'Use your own key',
  apiEndpoint: 'API Endpoint URL',
  apiKey: 'API Key',
  modelName: 'Model Name',
  testConnection: 'Test Connection',
  testing: 'Testing...',
  connected: 'Connected!',
  connectionFailed: 'Failed — check credentials',
  keyStorageHint: 'Key stored in browser localStorage only (encrypted)',
  analysisMode: 'Analysis Mode',
  quickMode: 'Quick',
  quickModeDesc: 'Structured JSON, single call',
  expertMode: 'Expert',
  expertModeDesc: 'Chain of thought, multi-step',
  quickModeDetail: 'Quick mode: Limits token output, returns structured recommendations in a single LLM call. Best for fast portfolio scans.',
  expertModeDetail: 'Expert mode: Enables chain-of-thought reasoning with multi-step analysis. May trigger additional API calls for news search and metric calculation. Outputs detailed research-style reports.',

  // Chat
  followUpDiscussion: 'Follow-up Discussion',
  contextLabel: 'Context: current analysis session',
  askFollowUp: 'Ask follow-up questions about the analysis above',
  askPlaceholder: 'Ask a follow-up question...',
  suggestedQ1: 'What if I want to be more conservative?',
  suggestedQ2: 'How would this change with a 5-year horizon?',
  suggestedQ3: 'What about adding crypto exposure?',

  // Actions
  buy: 'BUY',
  sell: 'SELL',
  hold: 'HOLD',

  // Skill descriptions
  skill_buffett_name: 'Warren Buffett',
  skill_buffett_desc: 'Value investing — focus on intrinsic value, moats, and margin of safety',
  skill_cathie_name: 'Cathie Wood',
  skill_cathie_desc: 'Disruptive innovation — AI, genomics, fintech, robotics, and energy storage',
  skill_bridgewater_name: 'Bridgewater All Weather',
  skill_bridgewater_desc: 'Risk parity — balance across economic regimes for all-weather performance',
  skill_swensen_name: 'David Swensen',
  skill_swensen_desc: 'Yale Endowment Model — diversify with alternative assets and rebalance',
  skill_lynch_name: 'Peter Lynch',
  skill_lynch_desc: 'Growth at reasonable price — invest in what you know, PEG ratio focus',
  skill_bogle_name: 'Jack Bogle',
  skill_bogle_desc: 'Index investing — low cost, broad diversification, stay the course',

  // Demo report
  demo_summary: `Based on **Warren Buffett's value investing** principles, your portfolio contains quality businesses but suffers from excessive concentration in technology. While companies like Apple and Microsoft possess durable competitive moats, the 60% tech allocation violates the margin-of-safety principle at current valuations. I recommend gradually rebalancing toward a more diversified allocation that includes undervalued sectors and protective fixed-income positions.`,
  demo_longTerm: `**Asset Allocation Thesis (1-3 Year Horizon)**

Your portfolio is heavily tilted toward large-cap technology (60% combined weight). While these are quality businesses with durable competitive advantages, the concentration creates significant drawdown risk during sector rotations.

**Recommended Target Allocation:**
- Technology: 35-40% (reduce from 60%)
- Broad Market / International: 20% (increase from 8%)
- Fixed Income: 15-20% (increase from 5%)
- Real Assets (REITs, Commodities): 5-10% (new allocation)
- Healthcare / Defensive: 10% (increase from 7%)

**Rationale:** Current market cycle favors gradual diversification. Technology valuations have expanded significantly, and a more balanced allocation will provide better risk-adjusted returns through a full market cycle while preserving upside participation.`,
  demo_actions: [
    { action: 'sell', ticker: 'NVDA', detail: 'Trim 5% — position exceeds single-stock concentration threshold at current valuation' },
    { action: 'buy', ticker: 'VTI', detail: 'Add 3% — increase broad market diversification to reduce single-name risk' },
    { action: 'buy', ticker: 'BND', detail: 'Add 5% — increase fixed income allocation for portfolio stability' },
    { action: 'buy', ticker: 'GLD', detail: 'Initiate 3% position — add inflation hedge and uncorrelated asset' },
    { action: 'hold', ticker: 'AAPL', detail: 'Maintain position — strong cash flow, reasonable valuation, and share buyback program' },
  ],
  demo_risks: [
    'Sector concentration: 60% technology exposure creates significant drawdown risk during sector rotations',
    'Low fixed income: 5% bonds is inadequate for portfolio stability — target 15-20% for moderate risk tolerance',
    'No international diversification: 100% US exposure misses global growth opportunities and adds geographic concentration risk',
    'Limited inflation protection: No real assets or TIPS allocation leaves portfolio vulnerable to sustained inflation',
  ],
  demo_chatResponse: `Great question! Based on the **{skill}** framework and your portfolio analysis:\n\nYour portfolio's tech concentration at 60% does create meaningful risk. A more **conservative approach** would shift toward a 40/30/20/10 split (equities/bonds/alternatives/cash).\n\nKey adjustments:\n- Reduce NVDA and AAPL by 5% each\n- Add 5% to BND and 5% to a short-term treasury ETF (SHV)\n- Consider adding 3% international exposure via VXUS\n\nThis would bring your health score from **72 to ~81** while maintaining growth potential.`,

  // Sector names
  sector_tech: 'Technology',
  sector_consumer: 'Consumer',
  sector_financials: 'Financials',
  sector_healthcare: 'Healthcare',
  sector_broadMarket: 'Broad Market',
  sector_fixedIncome: 'Fixed Income',

  // Risk metrics
  metric_concentration: 'Concentration',
  metric_volatility: 'Volatility',
  metric_diversification: 'Diversification',
  metric_incomeYield: 'Income Yield',
  metric_downsideProtection: 'Downside Protection',
};
