import { useEffect, useState } from 'react';

export interface Deal {
  id: string;
  pipeline_run_id: string;
  symbol: string;
  company_name: string;
  sector: string;
  deal_type: string;
  fii_volume: number;
  dii_volume: number;
  net_flow: number;
  price_impact: number;
  confidence_score: number;
  created_at: string;
}

export function useDeals(date?: string) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const url = new URL('/api/deals', window.location.origin);
      if (date) {
        url.searchParams.append('date', date);
      }
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch deals');
      const data = await response.json();
      setDeals(data.deals || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    // Refetch every 5 minutes
    const interval = setInterval(fetch, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [date]);

  return { deals, loading, error, refetch: fetch };
}
