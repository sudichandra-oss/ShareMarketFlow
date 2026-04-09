import { NextRequest, NextResponse } from 'next/server';
import { getLatestMarketIndices, saveMarketIndices } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const data = await getLatestMarketIndices();
    
    if (!data) {
      return NextResponse.json(
        { error: 'No market data found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('[v0] Failed to get market data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    await saveMarketIndices(data);
    
    return NextResponse.json({ success: true, message: 'Market data saved' });
  } catch (error) {
    console.error('[v0] Failed to save market data:', error);
    return NextResponse.json(
      { error: 'Failed to save market data' },
      { status: 500 }
    );
  }
}
