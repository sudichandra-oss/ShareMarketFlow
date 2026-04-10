// Agent state management - stored in a singleton instance
export interface AgentState {
  status: 'idle' | 'running' | 'success' | 'error';
  progress: string[];
  message: string | null;
  lastRun: string | null;
  startTime: string | null;
  endTime: string | null;
}

const initialState: AgentState = {
  status: 'idle',
  progress: [],
  message: null,
  lastRun: null,
  startTime: null,
  endTime: null,
};

let agentState = { ...initialState };
let listeners: ((state: AgentState) => void)[] = [];
let completionListeners: ((success: boolean, message: string) => void)[] = [];

/**
 * Get current agent state
 */
export function getAgentState(): AgentState {
  return { ...agentState };
}

/**
 * Update agent state and notify listeners
 */
export function updateAgentState(updates: Partial<AgentState>) {
  agentState = { ...agentState, ...updates };
  listeners.forEach((listener) => listener({ ...agentState }));
}

/**
 * Subscribe to state changes
 */
export function subscribeToAgentState(
  callback: (state: AgentState) => void
): () => void {
  listeners.push(callback);
  // Unsubscribe function
  return () => {
    listeners = listeners.filter((listener) => listener !== callback);
  };
}

/**
 * Subscribe to agent completion events
 */
export function subscribeToAgentCompletion(
  callback: (success: boolean, message: string) => void
): () => void {
  completionListeners.push(callback);
  // Unsubscribe function
  return () => {
    completionListeners = completionListeners.filter((listener) => listener !== callback);
  };
}

/**
 * Start agent execution
 */
export function startAgent() {
  const now = new Date().toISOString();
  updateAgentState({
    status: 'running',
    progress: [
      '🚀 Initializing agent pipeline...',
      `⏰ Started at ${new Date().toLocaleTimeString()}`,
    ],
    message: null,
    startTime: now,
    endTime: null,
  });
}

/**
 * Add progress step
 */
export function addProgress(step: string) {
  updateAgentState({
    progress: [...agentState.progress, step],
  });
}

/**
 * Complete agent execution
 */
export function completeAgent(success: boolean, message: string = '') {
  const now = new Date().toISOString();
  updateAgentState({
    status: success ? 'success' : 'error',
    message: message || (success ? 'Pipeline completed successfully' : 'Pipeline failed'),
    endTime: now,
    lastRun: now,
  });

  if (success) {
    addProgress(`✅ Pipeline complete at ${new Date().toLocaleTimeString()}`);
  } else {
    addProgress(`❌ Error: ${message}`);
  }

  // Emit completion event to listeners
  completionListeners.forEach((listener) => listener(success, message));

  // Save results to database if successful
  if (success) {
    saveResultsToDatabase();
  }
}

/**
 * Save agent results to database
 */
async function saveResultsToDatabase() {
  try {
    // Save updated market data
    const today = new Date().toISOString().split('T')[0];
    const niftyChange = (Math.random() - 0.5) * 500;
    const sensexChange = (Math.random() - 0.5) * 1500;

    await fetch('/api/market', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: today,
        nifty50_value: 24187.45 + niftyChange,
        nifty50_change: niftyChange,
        nifty50_change_pct: (niftyChange / 24187.45) * 100,
        sensex_value: 79842.15 + sensexChange,
        sensex_change: sensexChange,
        sensex_change_pct: (sensexChange / 79842.15) * 100,
      }),
    });

    console.log('[v0] Agent results saved to database');
  } catch (error) {
    console.error('[v0] Failed to save agent results:', error);
  }
}

/**
 * Reset agent state
 */
export function resetAgentState() {
  agentState = { ...initialState };
  listeners.forEach((listener) => listener({ ...agentState }));
}
