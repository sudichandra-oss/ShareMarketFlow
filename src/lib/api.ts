// Frontend API Client

// Use the local Next.js proxy by default to completely bypass CORS / DNS issues
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/backend';

export interface Flow {
  date: string;
  fii_buy: number;
  fii_sell: number;
  fii_net: number;
  dii_buy: number;
  dii_sell: number;
  dii_net: number;
}

export interface InstitutionActivity {
  name: string;
  country?: string;
  type?: string;
  aum_cr: number;
  change_cr: number;
  change_pct: number;
  sectors?: string[];
  top_picks?: string[];
  holdings_count?: number;
  trend: string;
}

export interface SectorData {
  name: string;
  fii_flow: number;
  dii_flow: number;
  total_flow: number;
  momentum: number;
  weight_pct: number;
  change_pct: number;
}

export interface BulkDeal {
  date: string;
  symbol: string;
  company: string;
  client: string;
  side: string;
  qty: number;
  price: number;
  value_cr: number;
  exchange: string;
}

export interface Insight {
  report_date: string;
  title: string;
  summary: string;
  key_points: Array<{ icon: string; text: string }>;
  smart_money_score: number;
  sector_momentum: number;
  institutional_confidence: number;
  full_report?: string;
}

export interface AppAlert {
  id: number;
  type: string;
  severity: string;
  institution: string;
  company: string;
  value_cr: number;
  description: string;
  time: string;
  is_read: boolean;
}

export interface Company {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change_pct: number;
  fii_pct: number;
  dii_pct: number;
  promoter_pct: number;
  public_pct: number;
  smart_score: number;
}

export const api = {
  getDailyFlows: async (days: number = 30): Promise<Flow[]> => {
    const res = await fetch(`${API_BASE}/flows/daily?days=${days}`);
    if (!res.ok) throw new Error('Failed to fetch flows');
    return res.json();
  },
  
  getTopFII: async (limit: number = 10): Promise<InstitutionActivity[]> => {
    const res = await fetch(`${API_BASE}/fii/top?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch FII');
    return res.json();
  },

  getTopDII: async (limit: number = 10): Promise<InstitutionActivity[]> => {
    const res = await fetch(`${API_BASE}/dii/top?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch DII');
    return res.json();
  },

  getSectors: async (sortBy: string = 'momentum'): Promise<SectorData[]> => {
    const res = await fetch(`${API_BASE}/sectors?sort_by=${sortBy}`);
    if (!res.ok) throw new Error('Failed to fetch sectors');
    return res.json();
  },

  getDeals: async (): Promise<BulkDeal[]> => {
    const res = await fetch(`${API_BASE}/deals`);
    if (!res.ok) throw new Error('Failed to fetch deals');
    return res.json();
  },

  getLatestInsight: async (): Promise<Insight> => {
    const res = await fetch(`${API_BASE}/insights/latest`);
    if (!res.ok) throw new Error('Failed to fetch insight');
    return res.json();
  },

  getAlerts: async (): Promise<AppAlert[]> => {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  getCompanies: async (): Promise<Company[]> => {
    const res = await fetch(`${API_BASE}/companies`);
    if (!res.ok) throw new Error('Failed to fetch companies');
    return res.json();
  },

  markAlertRead: async (id: number): Promise<void> => {
    await fetch(`${API_BASE}/alerts/${id}/read`, { method: 'PATCH' });
  },

  markAllAlertsRead: async (): Promise<void> => {
    await fetch(`${API_BASE}/alerts/mark-all-read`, { method: 'PATCH' });
  },

  triggerAgent: async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/agents/run`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => 'No text');
      console.error(`Failed to trigger agent: ${res.status} ${res.statusText}`, errText);
      throw new Error(`Failed to trigger agent: ${res.status} ${errText}`);
    }
    return res.json();
  },

  getAgentStatus: async (): Promise<any> => {
    const res = await fetch(`${API_BASE}/agents/status`);
    if (!res.ok) throw new Error('Failed to get agent status');
    return res.json();
  }
};
