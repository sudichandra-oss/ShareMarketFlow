'use client';

import { useState, useCallback, useEffect } from 'react';
import { Zap, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface AgentStatus {
  status: 'idle' | 'running' | 'error' | 'success';
  last_run?: string;
  last_result?: string;
  message?: string;
}

interface AgentRunnerProps {
  onSuccess?: () => void;
}

export default function AgentRunner({ onSuccess }: AgentRunnerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<AgentStatus>({ status: 'idle' });
  const [progress, setProgress] = useState<string[]>([]);

  // Poll agent status
  useEffect(() => {
    if (status.status !== 'running') return;

    let isCompleted = false;

    const pollStatus = async () => {
      if (isCompleted) return;

      try {
        const response = await fetch('/api/agents/status');
        if (!response.ok) {
          return; // Silently skip if endpoint fails
        }

        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          // If response isn't JSON, continue polling
          return;
        }

        setStatus(data);

        // Update progress from backend
        if (data.progress && Array.isArray(data.progress)) {
          setProgress(data.progress);
        }

        // Check if agent finished
        if (data.status === 'success' || data.status === 'error') {
          isCompleted = true;

          if (data.status === 'success') {
            // Agent finished successfully
            setProgress((prev) => {
              const updated = [...prev];
              if (!updated[updated.length - 1]?.includes('Pipeline complete')) {
                updated.push(`✅ Pipeline complete at ${new Date().toLocaleTimeString()}`);
              }
              return updated;
            });
            
            // Wait a moment then reload
            setTimeout(() => {
              onSuccess?.();
              window.location.reload();
            }, 2000);
          } else if (data.status === 'error') {
            setProgress((prev) => {
              const updated = [...prev];
              if (!updated[updated.length - 1]?.includes('Error')) {
                updated.push(`❌ Error: ${data.message || data.last_result}`);
              }
              return updated;
            });
          }
        }
      } catch (error) {
        // Silently fail - no need to log
      }
    };

    // Initial poll
    pollStatus();

    // Set up interval for subsequent polls (only if not completed)
    const interval = setInterval(() => {
      if (!isCompleted) {
        pollStatus();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [status.status, onSuccess]);

  const handleRunAgent = useCallback(async () => {
    try {
      setIsOpen(true);
      setProgress(['🚀 Initializing agent pipeline...', `⏰ Started at ${new Date().toLocaleTimeString()}`]);
      setStatus({ status: 'running' });

      const response = await fetch('/api/agents/run', { method: 'POST' });
      
      if (!response.ok) {
        throw new Error(`Failed to start agent: ${response.statusText}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // Response wasn't JSON, assume success
        data = {
          status: 'started',
          message: 'Agent pipeline started',
          current_status: { progress: [] },
        };
      }

      if (data.status === 'started') {
        // Use backend progress if available
        if (data.current_status?.progress && Array.isArray(data.current_status.progress)) {
          setProgress(data.current_status.progress);
        } else {
          setProgress((prev) => [
            ...prev,
            '📝 Pipeline execution started',
            '⏳ Fetching latest market data...',
            '📊 Analyzing FII/DII institutional flows...',
            '🤖 Running advanced AI analysis...',
            '💡 Generating insights and alerts...',
          ]);
        }
        setStatus({ status: 'running', message: data.current_status?.message || 'Agent running...' });
      } else if (data.status === 'already_running') {
        setProgress((prev) => [...prev, '⚠️ Agent pipeline already running, connecting to existing run...']);
        // Use existing status
        if (data.current_status?.progress) {
          setProgress(data.current_status.progress);
        }
        setStatus({ status: 'running', message: data.message || 'Connecting to running agent...' });
      } else {
        throw new Error(data.message || 'Unexpected response from agent API');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setStatus({ status: 'error', message: errorMsg });
      setProgress((prev) => [...prev, `❌ Error: ${errorMsg}`]);
    }
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleRunAgent}
        disabled={status.status === 'running'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 14px',
          background: status.status === 'running' 
            ? 'rgba(59, 130, 246, 0.2)' 
            : 'rgba(59, 130, 246, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 20,
          color: '#3b82f6',
          fontSize: 11,
          fontWeight: 600,
          cursor: status.status === 'running' ? 'not-allowed' : 'pointer',
          opacity: status.status === 'running' ? 0.8 : 1,
          transition: 'all 0.2s',
        }}
      >
        <Zap 
          size={13} 
          style={{
            animation: status.status === 'running' ? 'pulse 1.5s infinite' : 'none',
          }}
        />
        {status.status === 'running' ? 'Running...' : 'Run Agents'}
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
              {status.status === 'running' && (
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
              {status.status === 'success' && (
                <CheckCircle size={24} color="#10b981" />
              )}
              {status.status === 'error' && (
                <AlertCircle size={24} color="#ef4444" />
              )}
              <h2 style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#e8f4fd',
                margin: 0,
              }}>
                {status.status === 'running' && 'Agent Pipeline Running'}
                {status.status === 'success' && 'Pipeline Complete'}
                {status.status === 'error' && 'Error'}
                {status.status === 'idle' && 'Agent Status'}
              </h2>
            </div>

            {/* Last Run Info */}
            {status.last_run && (
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
                  Last run: {new Date(status.last_run).toLocaleString()}
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
            {status.message && (
              <div style={{
                padding: 12,
                background: status.status === 'error' 
                  ? 'rgba(239, 68, 68, 0.08)' 
                  : 'rgba(59, 130, 246, 0.08)',
                border: `1px solid ${status.status === 'error' 
                  ? 'rgba(239, 68, 68, 0.2)' 
                  : 'rgba(59, 130, 246, 0.2)'}`,
                borderRadius: 8,
                fontSize: 12,
                color: status.status === 'error' ? '#ef4444' : '#3b82f6',
                marginBottom: 16,
              }}>
                {status.message}
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
              {status.status === 'running' ? 'Keep Running' : 'Close'}
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
