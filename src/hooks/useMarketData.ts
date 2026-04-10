import { useEffect, useState } from 'react';

export interface MarketData {
  date: string;
  nifty50_value: number;
  nifty50_change: number;
  nifty50_change_pct: number;
  sensex_value: number;
  sensex_change: number;
  sensex_change_pct: number;
}

export function useMarketData() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/market');
      if (!response.ok) throw new Error('Failed to fetch market data');
      const marketData = await response.json();
      setData(marketData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    // Refetch every 5 minutes
    const interval = setInterval(fetch, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetch };
}
