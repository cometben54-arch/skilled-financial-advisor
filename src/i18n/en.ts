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
  demo_summary: `Based on **{skillName}** principles, your portfolio contains quality businesses but suffers from excessive concentration in technology (60%). Apple currently trades at ~$198.36 (P/E 32.1x), Microsoft at ~$441.20 (P/E 36.8x), and NVIDIA at ~$124.58 (P/E 64.2x) — all above historical averages. While these companies possess durable competitive moats (brand, ecosystem, AI infrastructure monopoly), the 60% tech allocation poses significant risk at current valuations. Meanwhile, your fixed income is only 5% (BND ~$72.15), far below the 15-20% needed for a resilient portfolio. I recommend gradually rebalancing to include undervalued sectors and protective fixed-income positions to maintain resilience through the next market correction.`,
  demo_longTerm: `**Asset Allocation Thesis (1-3 Year Horizon)**

Your portfolio is heavily tilted toward large-cap technology (60% combined weight). While these are quality businesses with durable competitive advantages, the concentration creates significant drawdown risk during sector rotations. In 2022, for example, the NASDAQ fell 33% — a similar portfolio would have experienced drawdowns far exceeding the broad market.

**Current Holdings Valuation Diagnosis:**
- AAPL $198.36 — P/E 32.1x (5yr avg 27x), FCF yield 3.1%, ~19% above fair value
- MSFT $441.20 — P/E 36.8x (5yr avg 31x), strong AI cloud growth but largely priced in
- NVDA $124.58 — P/E 64.2x, dominant AI chip position but valuation embeds significant future growth
- AMZN $198.42 — P/E 58.3x, AWS margin expansion continues, e-commerce stabilizing
- JPM $243.80 — P/E 12.1x, fairly valued, net interest margin benefits from higher rates
- JNJ $156.20 — P/E 14.8x, strong defensive qualities, 3.2% dividend yield, attractively valued

**Recommended Target Allocation:**
- Technology: 35-40% (reduce from 60%) — retain core tech but reduce single-name concentration
- Broad Market / International: 20% (increase from 8%) — add VXUS (international) and VTI (broad)
- Fixed Income: 15-20% (increase from 5%) — BND + short-term treasury ETF (SHV)
- Real Assets (REITs, Commodities): 5-10% (new) — VNQ (REITs) + GLD (gold)
- Healthcare / Defensive: 10% (increase from 7%) — JNJ + XLV (healthcare ETF)

**Rebalancing Path:** Recommend adjusting over 3-6 months rather than a single large shift. Trim tech by 3-5% per month, simultaneously adding to fixed income and international. Use market pullbacks to accelerate rebalancing — avoid chasing at valuation peaks.

**Rationale:** The current market cycle is in the late stages of an AI-driven tech bull market, with valuation expansion sustained for 18 months. Historical data shows that gradual diversification at this stage delivers better risk-adjusted returns (Sharpe ratio improvement of 0.3-0.5) through a full market cycle, while maintaining 70-80% upside participation.`,
  demo_actions: [
    { action: 'sell', ticker: 'NVDA', detail: 'Trim 5% (current $124.58, P/E 64.2x) — single position at 15% exceeds concentration threshold. AI chip dominance is unquestioned, but current valuation has priced in 2-3 years of future growth. Target 10% weight, lock in partial profits' },
    { action: 'sell', ticker: 'AAPL', detail: 'Trim 3% (current $198.36, P/E 32.1x) — iPhone growth slowing, but Services at 72% gross margin provides stable cash flow. Reduce from 25% to 22%, freeing capital for low-correlation assets' },
    { action: 'buy', ticker: 'BND', detail: 'Add 5% (current $72.15, yield to maturity 4.8%) — bond yields at 15-year highs in current rate environment. Lock in high yields while providing downside protection. Target 10% allocation' },
    { action: 'buy', ticker: 'VXUS', detail: 'Initiate 4% (current $57.82) — add international exposure. European and EM valuations (P/E 13-14x) far below US equities, offering valuation recovery opportunity and geographic diversification' },
    { action: 'buy', ticker: 'GLD', detail: 'Initiate 3% (current $241.50) — amid geopolitical uncertainty and sticky inflation, gold provides uncorrelated inflation hedge. Central banks continue to accumulate gold reserves' },
    { action: 'hold', ticker: 'JPM', detail: 'Maintain (current $243.80, P/E 12.1x, yield 2.1%) — fairly valued, net interest margin benefits from higher rates, strong capital return program. Banking sector provides low correlation with tech' },
    { action: 'hold', ticker: 'JNJ', detail: 'Maintain (current $156.20, P/E 14.8x, yield 3.2%) — defensive blue-chip, 62 consecutive years of dividend increases. Provides cushion in market downturns, pipeline includes multiple potential blockbusters' },
  ],
  demo_risks: [
    'Sector concentration risk: 60% tech exposure creates significant drawdown risk during sector rotations. In 2022, NASDAQ fell 33% — a similar portfolio would face -25% to -30% max drawdown',
    'Valuation risk: NVDA P/E 64.2x, MSFT P/E 36.8x are both in historically elevated ranges. If AI growth expectations fail to materialize, valuation compression could drive 20-30% corrections',
    'Severe fixed income deficit: 5% bond allocation far below prudent portfolio standard (15-20%). In a recession scenario, lack of fixed income cushion amplifies overall volatility',
    'Zero international diversification: 100% US equity exposure misses global growth (Europe/EM P/E 13-14x vs US 22x) and creates full currency risk exposure if USD weakens',
    'Missing inflation protection: No real assets (REITs, commodities) or TIPS allocation. If inflation persists above 3%, real purchasing power erodes continuously',
    'Single-stock concentration: AAPL (25%) and NVDA (15%) single positions are excessive — a black swan event at either company (regulation, product failure) would severely impact the portfolio',
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

  // Admin panel
  adminSettings: 'Admin Settings',
  adminPasswordPrompt: 'Enter admin password',
  adminPasswordPlaceholder: 'Enter password...',
  adminLogin: 'Login',
  adminPasswordWrong: 'Wrong password. Please try again.',
  adminModelDesc: 'Configure default AI models and API keys. Models without API keys will not appear on the frontend.',
  adminAddModel: 'Add Model',
  adminNoModels: 'No models configured. Click "Add Model" to get started.',
  adminModelName: 'Model Name',
  adminProvider: 'Provider',
  adminModelId: 'Model ID',
  adminSave: 'Save',
  adminEdit: 'Edit',
  adminSetDefault: 'Set Default',

  // Admin skill management
  adminTabModels: 'AI Models',
  adminTabSkills: 'Skill Management',
  adminSkillDesc: 'Manage default system skills. Add, edit, or delete preset investment master strategies.',
  adminAddSkill: 'Add Skill',
  adminNoSkills: 'No skills configured. Click "Add Skill" to get started.',
  adminResetSkills: 'Reset Defaults',
  adminSkillIcon: 'Icon',
  adminSkillUntitled: 'Untitled Skill',
  adminSaving: 'Syncing...',

  // AI fallback
  aiFallbackNotice: 'AI API unavailable — showing demo report. Check admin AI model configuration',

  // Report — price & detail
  currentPrice: 'Current Price',
  priceAsOf: 'as of',
  costBasisLabel: 'Cost',
  returnPct: 'Return',
  holdingDetail: 'Holdings Detail',

  // Investment quotes
  quote_1: '"Price is what you pay. Value is what you get." — Warren Buffett',
  quote_2: '"The most important quality for an investor is temperament, not intellect." — Warren Buffett',
  quote_3: '"Be fearful when others are greedy, and greedy when others are fearful." — Warren Buffett',
  quote_4: '"The stock market is a device for transferring money from the impatient to the patient." — Warren Buffett',
  quote_5: '"Knowing what you don\'t know is more useful than being brilliant." — Charlie Munger',
  quote_6: '"Diversification is protection against ignorance." — Warren Buffett',
  quote_7: '"Time is the friend of the wonderful business, the enemy of the mediocre." — Warren Buffett',
  quote_8: '"In the short run the market is a voting machine, in the long run it is a weighing machine." — Benjamin Graham',
  quote_9: '"The best investment you can make is in yourself." — Warren Buffett',
  quote_10: '"Compound interest is the eighth wonder of the world." — Albert Einstein',
};
