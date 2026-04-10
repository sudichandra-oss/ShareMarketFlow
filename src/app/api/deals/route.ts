import { NextRequest, NextResponse } from 'next/server';
import { getDealsByDate, saveDeal } from '@/lib/db';

/**
 * GET /api/deals - Fetch deals for a specific date
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const deals = await getDealsByDate(date);
    
    return NextResponse.json({
      date,
      deals,
      count: deals.length,
    });
  } catch (error) {
    console.error('[v0] Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/deals - Save a deal
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const savedDeal = await saveDeal({
      pipeline_run_id: data.pipeline_run_id,
      symbol: data.symbol,
      company_name: data.company_name,
      sector: data.sector,
      deal_type: data.deal_type,
      fii_volume: data.fii_volume,
      dii_volume: data.dii_volume,
      net_flow: data.net_flow,
      price_impact: data.price_impact,
      confidence_score: data.confidence_score,
      analysis_json: data.analysis_json || {},
    });

    return NextResponse.json(savedDeal, { status: 201 });
  } catch (error) {
    console.error('[v0] Error saving deal:', error);
    return NextResponse.json(
      { error: 'Failed to save deal' },
      { status: 500 }
    );
  }
}
