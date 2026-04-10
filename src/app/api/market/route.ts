import { NextRequest, NextResponse } from 'next/server';
import { getLatestMarketIndices, saveMarketIndices } from '@/lib/db';

/**
 * GET /api/market - Fetch latest market indices
 */
export async function GET() {
  try {
    const marketData = await getLatestMarketIndices();
    
    if (!marketData) {
      // Return default data if none exists
      return NextResponse.json({
        date: new Date().toISOString().split('T')[0],
        nifty50_value: 24187.45,
        nifty50_change: -101.30,
        nifty50_change_pct: -0.42,
        sensex_value: 79842.15,
        sensex_change: -303.60,
        sensex_change_pct: -0.38,
      });
    }

    return NextResponse.json(marketData);
  } catch (error) {
    console.error('[v0] Error fetching market data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/market - Save market indices data
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const savedData = await saveMarketIndices({
      date: data.date || new Date().toISOString().split('T')[0],
      nifty50_value: data.nifty50_value,
      nifty50_change: data.nifty50_change,
      nifty50_change_pct: data.nifty50_change_pct,
      sensex_value: data.sensex_value,
      sensex_change: data.sensex_change,
      sensex_change_pct: data.sensex_change_pct,
    });

    return NextResponse.json(savedData, { status: 201 });
  } catch (error) {
    console.error('[v0] Error saving market data:', error);
    return NextResponse.json(
      { error: 'Failed to save market data' },
      { status: 500 }
    );
  }
}
