import { NextRequest, NextResponse } from 'next/server';
import { getTodayAlerts, saveAlert } from '@/lib/db';

/**
 * GET /api/alerts - Fetch active alerts for today
 */
export async function GET() {
  try {
    const alerts = await getTodayAlerts();
    
    return NextResponse.json({
      alerts,
      count: alerts.length,
    });
  } catch (error) {
    console.error('[v0] Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/alerts - Save an alert
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const savedAlert = await saveAlert({
      pipeline_run_id: data.pipeline_run_id,
      symbol: data.symbol,
      alert_type: data.alert_type,
      message: data.message,
      priority: data.priority,
      threshold_breached: data.threshold_breached,
      current_value: data.current_value,
      threshold_value: data.threshold_value,
      recommended_action: data.recommended_action,
    });

    return NextResponse.json(savedAlert, { status: 201 });
  } catch (error) {
    console.error('[v0] Error saving alert:', error);
    return NextResponse.json(
      { error: 'Failed to save alert' },
      { status: 500 }
    );
  }
}
