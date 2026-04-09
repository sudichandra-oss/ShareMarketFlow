"""Agents trigger route"""
from fastapi import APIRouter, BackgroundTasks
import asyncio

router = APIRouter()
_pipeline_status = {"status": "idle", "last_run": None, "last_result": None}


async def _run_pipeline():
    _pipeline_status["status"] = "running"
    try:
        # Import agents lazily to avoid startup cost
        from agents.pipeline import run_pipeline
        result = await asyncio.to_thread(run_pipeline)
        _pipeline_status["status"] = "idle"
        _pipeline_status["last_result"] = result
        import datetime
        _pipeline_status["last_run"] = datetime.datetime.now().isoformat()
    except Exception as e:
        _pipeline_status["status"] = "error"
        _pipeline_status["last_result"] = str(e)


@router.post("/run")
async def trigger_pipeline(background_tasks: BackgroundTasks):
    if _pipeline_status["status"] == "running":
        return {"status": "already_running", "message": "Pipeline is already executing"}
    background_tasks.add_task(_run_pipeline)
    return {"status": "started", "message": "Agent pipeline triggered in background"}


@router.get("/status")
async def get_pipeline_status():
    return _pipeline_status
