import { NextRequest, NextResponse } from 'next/server';
import { getActiveAlerts, saveAlert } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const alerts = await getActiveAlerts();
    
    return NextResponse.json({ alerts, count: alerts.length });
  } catch (error) {
    console.error('[v0] Failed to get alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const alerts = await request.json();
    
    // Handle both single alert and array of alerts
    const alertsArray = Array.isArray(alerts) ? alerts : [alerts];
    
    for (const alert of alertsArray) {
      await saveAlert(alert);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `${alertsArray.length} alert(s) saved` 
    });
  } catch (error) {
    console.error('[v0] Failed to save alerts:', error);
    return NextResponse.json(
      { error: 'Failed to save alerts' },
      { status: 500 }
    );
  }
}
