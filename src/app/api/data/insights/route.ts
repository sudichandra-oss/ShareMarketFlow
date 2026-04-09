import { NextRequest, NextResponse } from 'next/server';
import { getInsightsByDate, saveInsight } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    
    const insights = await getInsightsByDate(date);
    
    return NextResponse.json({ date, insights, count: insights.length });
  } catch (error) {
    console.error('[v0] Failed to get insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const insights = await request.json();
    
    // Handle both single insight and array of insights
    const insightsArray = Array.isArray(insights) ? insights : [insights];
    
    for (const insight of insightsArray) {
      await saveInsight(insight);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `${insightsArray.length} insight(s) saved` 
    });
  } catch (error) {
    console.error('[v0] Failed to save insights:', error);
    return NextResponse.json(
      { error: 'Failed to save insights' },
      { status: 500 }
    );
  }
}
