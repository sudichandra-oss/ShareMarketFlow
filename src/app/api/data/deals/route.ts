import { NextRequest, NextResponse } from 'next/server';
import { getDealsByDate, saveDeal } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    
    const deals = await getDealsByDate(date);
    
    return NextResponse.json({ date, deals, count: deals.length });
  } catch (error) {
    console.error('[v0] Failed to get deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const deals = await request.json();
    
    // Handle both single deal and array of deals
    const dealsArray = Array.isArray(deals) ? deals : [deals];
    
    for (const deal of dealsArray) {
      await saveDeal(deal);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `${dealsArray.length} deal(s) saved` 
    });
  } catch (error) {
    console.error('[v0] Failed to save deals:', error);
    return NextResponse.json(
      { error: 'Failed to save deals' },
      { status: 500 }
    );
  }
}
