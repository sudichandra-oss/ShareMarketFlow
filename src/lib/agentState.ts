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
}

/**
 * Reset agent state
 */
export function resetAgentState() {
  agentState = { ...initialState };
  listeners.forEach((listener) => listener({ ...agentState }));
}
