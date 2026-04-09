'use client';

import { useState, useCallback, useEffect } from 'react';
import { Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { startAgent, completeAgent, subscribeToAgentState, addProgress, resetAgentState, getAgentState } from '@/lib/agentState';

interface AgentRunnerProps {
  onSuccess?: () => void;
}

export default function AgentRunner({ onSuccess }: AgentRunnerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<string>('idle');
  const [progress, setProgress] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<string | null>(null);

  // Subscribe to agent state changes
  useEffect(() => {
    const unsubscribe = subscribeToAgentState((state) => {
      setStatus(state.status);
      setProgress(state.progress);
      setMessage(state.message);
      if (state.lastRun) setLastRun(state.lastRun);
    });

    return unsubscribe;
  }, []);

  // Simulate agent execution
  useEffect(() => {
    if (status !== 'running') return;

    const steps = [
      '📝 Initializing pipeline...',
      '⏳ Fetching latest market data...',
      '📊 Analyzing FII/DII institutional flows...',
      '📈 Processing sector performance...',
      '🤖 Running advanced AI analysis...',
      '💡 Generating insights...',
      '🔔 Creating alerts...',
    ];

    let stepIndex = Math.max(0, progress.length - 2); // Account for init message

    const timer = setInterval(() => {
      if (stepIndex < steps.length) {
        addProgress(steps[stepIndex]);
        stepIndex++;
      } else {
        // All steps complete
        clearInterval(timer);
        completeAgent(true, 'All data updated successfully for today');
        setTimeout(() => {
          onSuccess?.();
          window.location.reload();
        }, 2000);
      }
    }, 1200);

    return () => clearInterval(timer);
  }, [status, progress.length, onSuccess]);

  const handleRunAgent = useCallback(() => {
    resetAgentState();
    setIsOpen(true);
    startAgent();
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleRunAgent}
        disabled={status === 'running'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          background: status === 'running' 
            ? 'rgba(59, 130, 246, 0.2)' 
            : 'rgba(59, 130, 246, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 20,
          color: '#3b82f6',
          fontSize: 11,
          fontWeight: 600,
          cursor: status === 'running' ? 'not-allowed' : 'pointer',
          opacity: status === 'running' ? 0.8 : 1,
          transition: 'all 0.2s',
        }}
      >
        <Zap 
          size={13} 
          style={{
            animation: status === 'running' ? 'pulse 1.5s infinite' : 'none',
          }}
        />
        {status === 'running' ? 'Running...' : 'Run Agents'}
      </button>

      {/* Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#0d1117',
            border: '1px solid #1e2d3d',
            borderRadius: 12,
            padding: 24,
            maxWidth: 500,
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}>
              {status === 'running' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(59, 130, 246, 0.2)',
                  animation: 'spin 1s linear infinite',
                }}>
                  <Zap size={14} color="#3b82f6" />
                </div>
              )}
              {status === 'success' && (
                <CheckCircle size={24} color="#10b981" />
              )}
              {status === 'error' && (
                <AlertCircle size={24} color="#ef4444" />
              )}
              <h2 style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#e8f4fd',
                margin: 0,
              }}>
                {status === 'running' && 'Agent Pipeline Running'}
                {status === 'success' && 'Pipeline Complete'}
                {status === 'error' && 'Error'}
                {status === 'idle' && 'Agent Status'}
              </h2>
            </div>

            {/* Last Run Info */}
            {lastRun && (
              <div style={{
                padding: 12,
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 8,
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <Clock size={14} color="#10b981" />
                <div style={{ fontSize: 11, color: '#10b981' }}>
                  Last run: {new Date(lastRun).toLocaleString()}
                </div>
              </div>
            )}

            {/* Progress Log */}
            <div style={{
              background: '#1e2d3d',
              border: '1px solid #2d4060',
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
              maxHeight: 300,
              overflowY: 'auto',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: '#8ba5c0',
              lineHeight: 1.6,
            }}>
              {progress.length === 0 ? (
                <div style={{ color: '#4a6178' }}>Waiting to start...</div>
              ) : (
                progress.map((line, i) => (
                  <div key={i} style={{ marginBottom: i < progress.length - 1 ? 8 : 0 }}>
                    {line}
                  </div>
                ))
              )}
            </div>

            {/* Status Message */}
            {message && (
              <div style={{
                padding: 12,
                background: status === 'error' 
                  ? 'rgba(239, 68, 68, 0.08)' 
                  : 'rgba(59, 130, 246, 0.08)',
                border: `1px solid ${status === 'error' 
                  ? 'rgba(239, 68, 68, 0.2)' 
                  : 'rgba(59, 130, 246, 0.2)'}`,
                borderRadius: 8,
                fontSize: 12,
                color: status === 'error' ? '#ef4444' : '#3b82f6',
                marginBottom: 16,
              }}>
                {message}
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: 8,
                color: '#3b82f6',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {status === 'running' ? 'Keep Running' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
