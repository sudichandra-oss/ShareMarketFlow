import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * GET /api/agents/status - Get agent pipeline status
 */
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/agents/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Don't cache this endpoint - we want fresh data
      cache: 'no-store',
    });

    const data = await response.json();
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[v0] Failed to get agent status:', error);
    
    // Return a default idle status if backend is unreachable
    return NextResponse.json(
      { 
        status: 'idle',
        message: error instanceof Error ? error.message : 'Backend unavailable',
        progress: [],
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}
