import { useState, useEffect, useCallback } from 'react';
import type { Cryptocurrency, ChartData, AISignal } from '@/types/crypto';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export function useCryptoData() {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
      );
      if (!response.ok) throw new Error('Failed to fetch crypto data');
      const data = await response.json();
      setCryptos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Fallback to mock data if API fails
      setCryptos(getMockCryptos());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCryptos();
    const interval = setInterval(fetchCryptos, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [fetchCryptos]);

  return { cryptos, loading, error, refetch: fetchCryptos };
}

export function useChartData(symbol: string, days: number = 30) {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${COINGECKO_API}/coins/${symbol.toLowerCase()}/ohlc?vs_currency=usd&days=${days}`
        );
        if (!response.ok) throw new Error('Failed to fetch chart data');
        const rawData = await response.json();
        const formattedData: ChartData[] = rawData.map((candle: number[]) => ({
          time: candle[0] / 1000,
          open: candle[1],
          high: candle[2],
          low: candle[3],
          close: candle[4],
          volume: 0,
        }));
        setData(formattedData);
      } catch (err) {
        // Generate mock chart data
        setData(generateMockChartData(days));
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchChartData();
    }
  }, [symbol, days]);

  return { data, loading };
}

export function useAISignals() {
  const [signals, setSignals] = useState<AISignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate AI signals based on mock analysis
    const generateSignals = () => {
      const mockSignals: AISignal[] = [
        {
          id: '1',
          symbol: 'bitcoin',
          recommendation: 'LONG',
          confidence: 78,
          entryPrice: 67234.50,
          targetPrice: 72500.00,
          stopLoss: 64500.00,
          timeframe: '4H',
          reasoning: 'Bullish divergence on RSI, strong support at current level, volume increasing. EMA crossover indicates upward momentum.',
          indicators: {
            rsi: 52.4,
            macd: 'Bullish Crossover',
            ema: 'Above 50 EMA',
            volume: 'Increasing',
          },
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          symbol: 'ethereum',
          recommendation: 'SHORT',
          confidence: 65,
          entryPrice: 3456.78,
          targetPrice: 3200.00,
          stopLoss: 3650.00,
          timeframe: '1H',
          reasoning: 'Bearish engulfing pattern formed, resistance at 3500 holding, MACD showing bearish divergence.',
          indicators: {
            rsi: 68.2,
            macd: 'Bearish Divergence',
            ema: 'Below 20 EMA',
            volume: 'Decreasing',
          },
          timestamp: new Date().toISOString(),
        },
        {
          id: '3',
          symbol: 'solana',
          recommendation: 'LONG',
          confidence: 82,
          entryPrice: 145.23,
          targetPrice: 168.50,
          stopLoss: 132.00,
          timeframe: '1D',
          reasoning: 'Strong breakout from consolidation, high volume surge, institutional buying detected.',
          indicators: {
            rsi: 58.7,
            macd: 'Strong Bullish',
            ema: 'Above 200 EMA',
            volume: 'High',
          },
          timestamp: new Date().toISOString(),
        },
        {
          id: '4',
          symbol: 'cardano',
          recommendation: 'NEUTRAL',
          confidence: 45,
          entryPrice: 0.45,
          targetPrice: 0.52,
          stopLoss: 0.38,
          timeframe: '4H',
          reasoning: 'Consolidating in range, waiting for clear breakout direction. Low volatility period.',
          indicators: {
            rsi: 48.5,
            macd: 'Flat',
            ema: 'At 50 EMA',
            volume: 'Low',
          },
          timestamp: new Date().toISOString(),
        },
      ];
      setSignals(mockSignals);
      setLoading(false);
    };

    generateSignals();
  }, []);

  return { signals, loading };
}

// Mock data helpers
function getMockCryptos(): Cryptocurrency[] {
  return [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      current_price: 67234.50,
      market_cap: 1325000000000,
      market_cap_rank: 1,
      fully_diluted_valuation: 1412000000000,
      total_volume: 28500000000,
      high_24h: 68500.00,
      low_24h: 66100.00,
      price_change_24h: 1234.50,
      price_change_percentage_24h: 1.87,
      market_cap_change_24h: 25000000000,
      market_cap_change_percentage_24h: 1.92,
      circulating_supply: 19700000,
      total_supply: 21000000,
      max_supply: 21000000,
      ath: 73738.00,
      ath_change_percentage: -8.82,
      ath_date: '2024-03-14T00:00:00.000Z',
      atl: 67.81,
      atl_change_percentage: 99000.25,
      atl_date: '2013-07-06T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString(),
    },
    {
      id: 'ethereum',
      symbol: 'eth',
      name: 'Ethereum',
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      current_price: 3456.78,
      market_cap: 415000000000,
      market_cap_rank: 2,
      fully_diluted_valuation: 415000000000,
      total_volume: 15200000000,
      high_24h: 3520.00,
      low_24h: 3380.00,
      price_change_24h: -45.22,
      price_change_percentage_24h: -1.29,
      market_cap_change_24h: -5400000000,
      market_cap_change_percentage_24h: -1.28,
      circulating_supply: 120000000,
      total_supply: 120000000,
      max_supply: null,
      ath: 4878.26,
      ath_change_percentage: -29.15,
      ath_date: '2021-11-10T00:00:00.000Z',
      atl: 0.432979,
      atl_change_percentage: 798000.15,
      atl_date: '2015-10-20T00:00:00.000Z',
      roi: {
        times: 68.5,
        currency: 'btc',
        percentage: 6850.25,
      },
      last_updated: new Date().toISOString(),
    },
    {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana',
      image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
      current_price: 145.23,
      market_cap: 68500000000,
      market_cap_rank: 5,
      fully_diluted_valuation: 84500000000,
      total_volume: 3200000000,
      high_24h: 152.40,
      low_24h: 141.80,
      price_change_24h: 8.45,
      price_change_percentage_24h: 6.18,
      market_cap_change_24h: 3980000000,
      market_cap_change_percentage_24h: 6.16,
      circulating_supply: 471000000,
      total_supply: 581000000,
      max_supply: null,
      ath: 259.96,
      ath_change_percentage: -44.13,
      ath_date: '2021-11-06T00:00:00.000Z',
      atl: 0.500801,
      atl_change_percentage: 28900.25,
      atl_date: '2020-05-11T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString(),
    },
    {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
      current_price: 0.4523,
      market_cap: 16200000000,
      market_cap_rank: 10,
      fully_diluted_valuation: 20350000000,
      total_volume: 425000000,
      high_24h: 0.4680,
      low_24h: 0.4410,
      price_change_24h: -0.0089,
      price_change_percentage_24h: -1.93,
      market_cap_change_24h: -318000000,
      market_cap_change_percentage_24h: -1.92,
      circulating_supply: 35800000000,
      total_supply: 45000000000,
      max_supply: 45000000000,
      ath: 3.09,
      ath_change_percentage: -85.35,
      ath_date: '2021-09-02T00:00:00.000Z',
      atl: 0.01925276,
      atl_change_percentage: 2248.15,
      atl_date: '2020-03-13T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString(),
    },
    {
      id: 'binancecoin',
      symbol: 'bnb',
      name: 'BNB',
      image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
      current_price: 589.45,
      market_cap: 86000000000,
      market_cap_rank: 4,
      fully_diluted_valuation: 86000000000,
      total_volume: 1200000000,
      high_24h: 598.00,
      low_24h: 582.00,
      price_change_24h: 5.23,
      price_change_percentage_24h: 0.89,
      market_cap_change_24h: 765000000,
      market_cap_change_percentage_24h: 0.90,
      circulating_supply: 146000000,
      total_supply: 146000000,
      max_supply: 200000000,
      ath: 690.93,
      ath_change_percentage: -14.68,
      ath_date: '2021-05-10T00:00:00.000Z',
      atl: 0.0398177,
      atl_change_percentage: 1479000.25,
      atl_date: '2017-10-19T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString(),
    },
    {
      id: 'ripple',
      symbol: 'xrp',
      name: 'XRP',
      image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
      current_price: 0.6234,
      market_cap: 34500000000,
      market_cap_rank: 7,
      fully_diluted_valuation: 62340000000,
      total_volume: 1850000000,
      high_24h: 0.6450,
      low_24h: 0.6080,
      price_change_24h: 0.0123,
      price_change_percentage_24h: 2.01,
      market_cap_change_24h: 680000000,
      market_cap_change_percentage_24h: 2.01,
      circulating_supply: 55300000000,
      total_supply: 100000000000,
      max_supply: 100000000000,
      ath: 3.40,
      ath_change_percentage: -81.67,
      ath_date: '2018-01-07T00:00:00.000Z',
      atl: 0.00268621,
      atl_change_percentage: 23100.15,
      atl_date: '2014-05-22T00:00:00.000Z',
      roi: null,
      last_updated: new Date().toISOString(),
    },
  ];
}

function generateMockChartData(days: number): ChartData[] {
  const data: ChartData[] = [];
  const now = Date.now() / 1000;
  const daySeconds = 86400;
  let price = 65000;

  for (let i = days; i >= 0; i--) {
    const time = now - i * daySeconds;
    const volatility = 0.03;
    const change = (Math.random() - 0.5) * volatility;
    price = price * (1 + change);
    
    const open = price * (1 + (Math.random() - 0.5) * 0.01);
    const close = price;
    const high = Math.max(open, close) * (1 + Math.random() * 0.015);
    const low = Math.min(open, close) * (1 - Math.random() * 0.015);
    
    data.push({
      time,
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000000000 + 500000000,
    });
  }

  return data;
}
