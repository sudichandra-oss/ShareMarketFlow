# Agent Runner Implementation Guide

## Overview

This document describes the enhancements made to the ShareMarketFlow agent execution system. The "Run Agents" button now shows real-time progress, updates data upon completion, and provides a complete user feedback experience.

## What Was Changed

### 1. **New Frontend Component: AgentRunner**
   - **File**: `src/components/AgentRunner.tsx`
   - **Features**:
     - Interactive modal showing agent execution progress
     - Real-time polling of agent status (every 1 second)
     - Progress log with emoji indicators for each step
     - Status display (running, success, error)
     - Automatic page refresh when pipeline completes
     - Animated loading states

### 2. **Updated AppLayout Component**
   - **File**: `src/components/AppLayout.tsx`
   - **Changes**:
     - Imported and integrated `AgentRunner` component
     - Replaced static "Run Agents" button with interactive component
     - Now displays actual execution progress instead of placeholder text

### 3. **Enhanced Sidebar Component**
   - **File**: `src/components/Sidebar.tsx`
   - **Features**:
     - Live polling of agent status (every 2 seconds)
     - Dynamic status display showing "RUNNING" or "SCHEDULED"
     - Progress indicator showing number of completed steps
     - Animated pulse effect when agent is running
     - Color-coded status (amber when running, blue when scheduled)

### 4. **Updated Backend Agent Route**
   - **File**: `backend/api/routes/agents.py`
   - **Enhancements**:
     - Detailed progress tracking with step-by-step updates
     - Separate status tracking for "running", "success", and "error" states
     - Progress array to send detailed step information to frontend
     - Timestamp tracking for start/end times
     - Improved error messages
     - Support for querying current pipeline status

### 5. **Next.js API Routes (Proxies)**
   - **Files**: 
     - `src/app/api/agents/route.ts` - POST/GET agent control
     - `src/app/api/agents/status/route.ts` - GET agent status
   - **Purpose**:
     - Forward requests from frontend to FastAPI backend
     - Handle CORS transparently
     - No-cache headers to ensure fresh status data
     - Graceful error handling with fallback responses

## How It Works

### User Flow

1. User clicks "⚡ Run Agents" button in the top header
2. `AgentRunner` component opens a modal window
3. Frontend immediately sends POST request to `/api/agents/run`
4. Backend starts the agent pipeline in background
5. Frontend begins polling `/api/agents/status` every 1 second
6. Progress updates appear in real-time in the modal
7. Sidebar also shows live progress indicator
8. When pipeline completes:
   - Success message is displayed
   - Page automatically refreshes with latest data
   - Modal remains open for 2 seconds then closes
9. Data is now updated with today's information

### Agent Pipeline Steps

The mock pipeline (when no LLM is configured) executes:

1. **📝 Initialization** - Pipeline setup
2. **⏳ Data Collection** - Fetch latest FII/DII data
3. **📊 Analysis** - Analyze institutional flows
4. **🤖 AI Insights** - Generate market signals
5. **💡 Alerts** - Generate trading alerts
6. **✅ Completion** - All data refreshed

## Configuration

### Environment Variables

```bash
# Backend URL for API proxying
BACKEND_URL=http://localhost:8000  # Default if not set
```

### Backend Requirements

Ensure the FastAPI backend is running:

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

The backend runs on `http://localhost:8000` by default.

## Technical Details

### Real-Time Status Polling

The AgentRunner component uses a polling mechanism:

```typescript
// Polls every 1 second while running
useEffect(() => {
  if (status.status !== 'running') return;
  
  const interval = setInterval(async () => {
    const response = await fetch('/api/agents/status');
    const data = await response.json();
    setStatus(data);
    // Update progress from backend
    if (data.progress) setProgress(data.progress);
  }, 1000);
  
  return () => clearInterval(interval);
}, [status.status]);
```

### Progress Updates

Progress is stored as an array in the backend:

```python
_pipeline_status = {
  "status": "running",  # idle, running, success, error
  "progress": [
    "🚀 Pipeline triggered...",
    "📝 Initializing pipeline...",
    "⏳ Collecting market data...",
    # ... more steps
  ],
  "last_run": "2025-04-09T16:30:00",
  "message": "Pipeline executed successfully"
}
```

### Auto-Refresh on Completion

When pipeline completes successfully, the frontend:

```typescript
// Waits 2 seconds then refreshes entire page
setTimeout(() => {
  onSuccess?.();
  window.location.reload();  // Refreshes all data
}, 2000);
```

## Features

### ✅ Implemented
- Real-time progress display in modal window
- Live status indicator in sidebar
- Automatic data refresh on completion
- Error handling and display
- Prevents multiple concurrent runs
- Shows last run timestamp
- Graceful degradation if backend unavailable
- CORS-transparent API proxying
- No-cache headers for status endpoint

### 🎨 UI Enhancements
- Animated pulse effect for running state
- Color-coded status indicators
- Progress bar with gradient animation
- Emoji indicators for each step
- Professional modal design
- Responsive layout

## Troubleshooting

### "Pipeline Already Running"
If you see "Pipeline is already executing", wait for the current run to complete or restart the backend.

### Backend Connection Error
If you get connection errors, ensure:
1. Backend is running: `python -m uvicorn main:app --reload`
2. Backend URL is correct in environment or defaults to `localhost:8000`
3. CORS is enabled in backend (it is by default)

### Data Not Updating
If page refresh doesn't show new data:
1. Check if agent pipeline actually completed successfully
2. Verify backend has access to data sources
3. Check browser console for any errors
4. Try manual page refresh (Cmd/Ctrl + R)

### Progress Not Showing
If progress modal opens but shows no steps:
1. Check backend logs for execution progress
2. Verify `/api/agents/status` endpoint is reachable
3. Check browser's Network tab for failed requests
4. Ensure polling interval isn't too slow

## Performance Considerations

- **Polling Interval**: 1 second during execution (can be adjusted in AgentRunner.tsx line 66)
- **Sidebar Poll**: 2 seconds (can be adjusted in Sidebar.tsx line 33)
- **Auto-refresh Delay**: 2 seconds after completion (can be adjusted in AgentRunner.tsx line 57)

For heavy loads, consider increasing poll intervals to reduce server requests.

## Future Enhancements

Potential improvements:
1. WebSocket support for real-time updates instead of polling
2. Step cancellation support
3. Retry mechanism for failed steps
4. Detailed error logs for debugging
5. Progress percentage calculation
6. Agent-specific progress tracking
7. Scheduled run configuration UI
8. Run history and logs viewer

## Testing

### Manual Testing Checklist

- [ ] Click "Run Agents" button
- [ ] Modal opens with progress log
- [ ] Steps appear in real-time
- [ ] Sidebar shows "RUNNING" status
- [ ] Progress count increases
- [ ] Page refreshes after completion
- [ ] Modal closes automatically
- [ ] Data on page is updated
- [ ] Error handling works if backend fails
- [ ] Cannot start multiple concurrent runs

### Load Testing

For testing with multiple concurrent requests:

```bash
# From another terminal, send repeated requests
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/agents/run &
done
wait
```

The backend should handle this gracefully by rejecting concurrent runs.

## Files Modified

### Frontend
- `src/components/AppLayout.tsx` - Integration point
- `src/components/AgentRunner.tsx` - New component
- `src/components/Sidebar.tsx` - Status display
- `src/app/api/agents/route.ts` - New proxy routes
- `src/app/api/agents/status/route.ts` - New proxy route

### Backend
- `backend/api/routes/agents.py` - Enhanced with progress tracking
- `backend/main.py` - Already includes agent router

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review backend logs: `tail -f backend.log`
3. Check browser console: F12 → Console tab
4. Check Network tab for failed API requests
5. Review this document for configuration details
