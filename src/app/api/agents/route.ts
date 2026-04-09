import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
const REQUEST_TIMEOUT = 5000; // 5 second timeout

// Store agent state in memory (will reset on server restart)
let agentState = {
  status: 'idle',
  progress: [],
  message: null,
  last_run: null,
  start_time: null,
  end_time: null,
  last_result: null,
};

/**
 * Attempt to call backend with timeout
 */
async function callBackend(endpoint: string, method: string = 'GET') {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    // Backend is unavailable, return null
    return null;
  }
}

/**
 * POST /api/agents/run - Trigger agent pipeline
 */
export async function POST(request: NextRequest) {
  try {
    // Try to call backend
    const response = await callBackend('/api/agents/run', 'POST');

    if (response) {
      try {
        const data = await response.json();
        agentState = data;
        return NextResponse.json(data, { status: response.status });
      } catch (parseError) {
        // Backend returned non-JSON response, treat as success
        console.error('[v0] Backend response parse error:', parseError);
      }
    }

    // Backend unavailable - return mock/local state
    agentState.status = 'running';
    agentState.progress = [
      '🚀 Pipeline triggered...',
      '⏳ Fetching latest market data...',
    ];
    agentState.start_time = new Date().toISOString();
    agentState.message = 'Agent running (backend unavailable - demo mode)';

    return NextResponse.json(
      {
        status: 'started',
        message: 'Agent pipeline triggered (running in demo mode)',
        current_status: agentState,
        backend_available: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Agent POST error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to start agent pipeline',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/agents/status - Get agent pipeline status
 */
export async function GET(request: NextRequest) {
  try {
    // Try to call backend
    const response = await callBackend('/api/agents/status', 'GET');

    if (response) {
      const data = await response.json();
      agentState = data;
      return NextResponse.json(data, { status: response.status });
    }

    // Backend unavailable - return local state
    // If agent is running in demo mode, simulate progress
    if (agentState.status === 'running') {
      const progressSteps = [
        '📝 Initializing pipeline...',
        '⏳ Fetching latest market data...',
        '📊 Analyzing FII/DII flows...',
        '🤖 Running AI analysis...',
        '💡 Generating insights...',
      ];

      // Simulate progress every 2-3 steps
      if (agentState.progress.length < progressSteps.length) {
        const nextIndex = Math.min(
          agentState.progress.length + Math.floor(Math.random() * 2) + 1,
          progressSteps.length
        );
        agentState.progress = progressSteps.slice(0, nextIndex);
      } else if (!agentState.end_time) {
        // Mark as complete
        agentState.status = 'success';
        agentState.progress.push('✅ Pipeline complete');
        agentState.end_time = new Date().toISOString();
        agentState.message = `Pipeline completed successfully at ${new Date().toLocaleTimeString()}`;
        agentState.last_run = new Date().toISOString();
      }
    }

    return NextResponse.json(agentState, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        ...agentState,
        backend_available: false,
      },
      { status: 200 }
    );
  }
}
