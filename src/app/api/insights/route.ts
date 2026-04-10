import { NextRequest, NextResponse } from 'next/server';
import { getTodayInsights, saveInsight } from '@/lib/db';

/**
 * GET /api/insights - Fetch insights for today
 */
export async function GET() {
  try {
    const insights = await getTodayInsights();
    
    return NextResponse.json({
      insights,
      count: insights.length,
    });
  } catch (error) {
    console.error('[v0] Error fetching insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/insights - Save an insight
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const savedInsight = await saveInsight({
      pipeline_run_id: data.pipeline_run_id,
      title: data.title,
      description: data.description,
      category: data.category,
      severity: data.severity,
      related_symbols: data.related_symbols || [],
      action_items: data.action_items || [],
      analysis_json: data.analysis_json || {},
    });

    return NextResponse.json(savedInsight, { status: 201 });
  } catch (error) {
    console.error('[v0] Error saving insight:', error);
    return NextResponse.json(
      { error: 'Failed to save insight' },
      { status: 500 }
    );
  }
}
