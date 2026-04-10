import { useEffect, useState } from 'react';

export interface Insight {
  id: string;
  pipeline_run_id: string;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  related_symbols: string[];
  action_items: string[];
  created_at: string;
}

export function useInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/insights');
      if (!response.ok) throw new Error('Failed to fetch insights');
      const data = await response.json();
      setInsights(data.insights || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    // Refetch every 10 minutes
    const interval = setInterval(fetch, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { insights, loading, error, refetch: fetch };
}
