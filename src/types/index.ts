export interface Skill {
  id: string;
  name: string;
  description: string;
  nameKey?: string;
  descriptionKey?: string;
  icon: string;
  tags: string[];
  creator: string;
  isSystem: boolean;
  likes: number;
  uses: number;
  liked: boolean;
  promptTemplate: string;
}

export interface PortfolioItem {
  ticker: string;
  name: string;
  weight: number;
  costBasis?: number;
  currentPrice?: number;
  sector?: string;
}

export interface AIConfig {
  model: string;
  mode: 'quick' | 'expert';
  customEndpoint?: string;
  customApiKey?: string;
  customModelName?: string;
  useCustom: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AnalysisReport {
  healthScore: number;
  sectorAllocation: { name: string; value: number; color: string }[];
  riskMetrics: { label: string; value: number; max: number }[];
  shortTermActions: { action: 'buy' | 'sell' | 'hold'; ticker: string; detail: string }[];
  longTermView: string;
  riskWarnings: string[];
  summary: string;
}

export type SortMode = 'popular' | 'newest' | 'most-liked';
