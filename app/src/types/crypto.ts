export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: null | {
    times: number;
    currency: string;
    percentage: number;
  };
  last_updated: string;
}

export interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AISignal {
  id: string;
  symbol: string;
  recommendation: 'LONG' | 'SHORT' | 'NEUTRAL';
  confidence: number;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  timeframe: string;
  reasoning: string;
  indicators: {
    rsi: number;
    macd: string;
    ema: string;
    volume: string;
  };
  timestamp: string;
}

export interface GridBotConfig {
  id?: string;
  symbol: string;
  upperPrice: number;
  lowerPrice: number;
  gridCount: number;
  investment: number;
  mode: 'arithmetic' | 'geometric';
  status: 'active' | 'paused' | 'stopped';
  createdAt?: string;
  profit?: number;
  profitPercentage?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tradingAdvice?: {
    recommendation: 'LONG' | 'SHORT' | 'WAIT';
    timeframe: string;
    confidence: number;
  };
}

export interface TechnicalIndicator {
  name: string;
  value: string | number;
  signal: 'buy' | 'sell' | 'neutral';
}
