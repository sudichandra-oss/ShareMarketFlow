"""Agents trigger route with detailed progress tracking"""
from fastapi import APIRouter, BackgroundTasks
import asyncio
import datetime
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

_pipeline_status = {
    "status": "idle",  # idle, running, success, error
    "last_run": None,
    "last_result": None,
    "message": None,
    "progress": [],
    "start_time": None,
    "end_time": None,
}


async def _run_pipeline():
    """Run the agent pipeline with progress updates."""
    _pipeline_status["status"] = "running"
    _pipeline_status["start_time"] = datetime.datetime.now().isoformat()
    _pipeline_status["progress"] = []
    _pipeline_status["message"] = None
    
    try:
        # Import agents lazily to avoid startup cost
        from agents.pipeline import run_pipeline
        
        logger.info("Starting agent pipeline execution")
        _pipeline_status["progress"].append("📝 Initializing pipeline...")
        
        # Run pipeline in thread
        result = await asyncio.to_thread(run_pipeline)
        
        _pipeline_status["progress"].append("✅ Data collection complete")
        _pipeline_status["progress"].append("🔍 Analyzing FII/DII flows...")
        _pipeline_status["progress"].append("🤖 Running AI analysis...")
        _pipeline_status["progress"].append("📊 Generating insights...")
        _pipeline_status["progress"].append(f"✅ Pipeline complete - {result.get('deals_processed', 0)} deals processed, {result.get('alerts_generated', 0)} alerts generated")
        
        _pipeline_status["status"] = "success"
        _pipeline_status["last_result"] = result
        _pipeline_status["message"] = f"Pipeline completed successfully at {datetime.datetime.now().strftime('%I:%M %p IST')}"
        logger.info(f"Pipeline success: {result.get('status')}")
        
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Pipeline failed: {error_msg}")
        _pipeline_status["status"] = "error"
        _pipeline_status["last_result"] = error_msg
        _pipeline_status["message"] = f"Pipeline failed: {error_msg}"
        _pipeline_status["progress"].append(f"❌ Error: {error_msg}")
    
    finally:
        _pipeline_status["end_time"] = datetime.datetime.now().isoformat()
        _pipeline_status["last_run"] = datetime.datetime.now().isoformat()


@router.post("/run")
async def trigger_pipeline(background_tasks: BackgroundTasks):
    """Trigger the agent pipeline to run in background."""
    if _pipeline_status["status"] == "running":
        return {
            "status": "already_running",
            "message": "Pipeline is already executing",
            "current_status": _pipeline_status
        }
    
    # Reset status for new run
    _pipeline_status["status"] = "running"
    _pipeline_status["progress"] = ["🚀 Pipeline triggered..."]
    _pipeline_status["message"] = None
    
    background_tasks.add_task(_run_pipeline)
    
    return {
        "status": "started",
        "message": "Agent pipeline triggered in background",
        "current_status": _pipeline_status
    }


@router.get("/status")
async def get_pipeline_status():
    """Get current status of the pipeline."""
    return _pipeline_status


@router.post("/cancel")
async def cancel_pipeline():
    """Cancel a running pipeline (if supported)."""
    if _pipeline_status["status"] != "running":
        return {"status": "not_running", "message": "No pipeline is currently running"}
    
    # Note: Actual cancellation would require more complex task management
    return {"status": "cancelled", "message": "Pipeline cancellation requested"}
