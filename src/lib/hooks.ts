import { useState, useEffect } from 'react';

interface MarketData {
  date: string;
  nifty50_value: number;
  nifty50_change: number;
  nifty50_change_pct: number;
  sensex_value: number;
  sensex_change: number;
  sensex_change_pct: number;
  nse_change_pct: number;
}

interface Deal {
  id: string;
  date: string;
  company: string;
  sector: string;
  deal_type: string;
  fii_value: number;
  dii_value: number;
  net_value: number;
  sentiment: string;
  analysis: string;
}

interface Insight {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  actionable: boolean;
}

interface Alert {
  id: string;
  date: string;
  title: string;
  description: string;
  alert_type: string;
  severity: string;
  is_active: boolean;
}

/**
 * Fetch latest market data from database
 */
export function useMarketData() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data/market');
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
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Fetch deals for a specific date
 */
export function useDealsByDate(date?: string) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const queryDate = date || new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/data/deals?date=${queryDate}`);
      if (!response.ok) throw new Error('Failed to fetch deals');
      const { deals: dealsData } = await response.json();
      setDeals(dealsData || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [date]);

  return { deals, loading, error, refetch: fetchDeals };
}

/**
 * Fetch insights for a specific date
 */
export function useInsightsByDate(date?: string) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const queryDate = date || new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/data/insights?date=${queryDate}`);
      if (!response.ok) throw new Error('Failed to fetch insights');
      const { insights: insightsData } = await response.json();
      setInsights(insightsData || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [date]);

  return { insights, loading, error, refetch: fetchInsights };
}

/**
 * Fetch active alerts
 */
export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/data/alerts');
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const { alerts: alertsData } = await response.json();
      setAlerts(alertsData || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Refresh every 60 seconds
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  return { alerts, loading, error, refetch: fetchAlerts };
}

/**
 * Save market data to database
 */
export async function saveMarketData(data: MarketData) {
  try {
    const response = await fetch('/api/data/market', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save market data');
    return await response.json();
  } catch (error) {
    console.error('[v0] Error saving market data:', error);
    throw error;
  }
}

/**
 * Save deals to database
 */
export async function saveDeals(deals: Deal | Deal[]) {
  try {
    const response = await fetch('/api/data/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deals),
    });
    if (!response.ok) throw new Error('Failed to save deals');
    return await response.json();
  } catch (error) {
    console.error('[v0] Error saving deals:', error);
    throw error;
  }
}

/**
 * Save insights to database
 */
export async function saveInsights(insights: Insight | Insight[]) {
  try {
    const response = await fetch('/api/data/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(insights),
    });
    if (!response.ok) throw new Error('Failed to save insights');
    return await response.json();
  } catch (error) {
    console.error('[v0] Error saving insights:', error);
    throw error;
  }
}

/**
 * Save alerts to database
 */
export async function saveAlerts(alerts: Alert | Alert[]) {
  try {
    const response = await fetch('/api/data/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alerts),
    });
    if (!response.ok) throw new Error('Failed to save alerts');
    return await response.json();
  } catch (error) {
    console.error('[v0] Error saving alerts:', error);
    throw error;
  }
}
