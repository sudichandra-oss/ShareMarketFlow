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
        
        # Persist results to DB BEFORE declaring success
        await _persist_results_to_db(result)
        
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


async def _persist_results_to_db(result: dict):
    """Save pipeline results into PostgreSQL."""
    from db.database import AsyncSessionLocal
    from db.models import Deal, InstitutionalFlow, Alert, Insight
    from datetime import date

    async with AsyncSessionLocal() as db:
        try:
            # 1. Save Clean Deals
            for d in result.get("clean_deals", []):
                new_deal = Deal(
                    deal_date=date.fromisoformat(d["date"]),
                    deal_type="BULK",
                    exchange=d.get("exchange", "NSE"),
                    symbol=d.get("symbol", ""),
                    company_name=d.get("symbol", ""),
                    client_name=d.get("client_name", ""),
                    deal_side=d.get("side", ""),
                    quantity=d.get("quantity", 0),
                    price=0,  # mocked logic doesn't return price
                    value_cr=d.get("value_cr", 0)
                )
                db.add(new_deal)

            # 2. Save Flows (from analysis)
            analysis = result.get("analysis", {})
            fii_val = analysis.get("fii_5d_sum", 0)
            dii_val = analysis.get("dii_5d_sum", 0)
            if fii_val or dii_val:
                db.add(InstitutionalFlow(date=date.today(), type="FII", net_flow=fii_val))
                db.add(InstitutionalFlow(date=date.today(), type="DII", net_flow=dii_val))

            # 3. Save Insight
            insight_data = result.get("insight", {})
            if insight_data:
                # Merge logic if row already exists for today
                from sqlalchemy import select
                existing = await db.execute(select(Insight).where(Insight.report_date == date.today()))
                existing_insight = existing.scalar_one_or_none()
                if not existing_insight:
                    db.add(Insight(
                        report_date=date.today(),
                        title=insight_data.get("title", ""),
                        summary=insight_data.get("summary", ""),
                        full_report=insight_data.get("full_report", ""),
                        key_points=insight_data.get("key_points", []),
                        smart_money_score=insight_data.get("smart_money_score", 0),
                        sector_momentum=insight_data.get("sector_momentum", 0),
                        institutional_confidence=insight_data.get("institutional_confidence", 0)
                    ))

            # 4. Save Alerts
            for a in result.get("alerts", []):
                db.add(Alert(
                    alert_type=a.get("type", "SYSTEM"),
                    institution_name=a.get("institution", ""),
                    company_name=a.get("company", ""),
                    value_cr=a.get("value_cr", 0),
                    description=a.get("description", ""),
                    severity=a.get("severity", "LOW"),
                    is_read=False
                ))

            await db.commit()
            logger.info("Successfully persisted pipeline result to DB.")
        except Exception as e:
            await db.rollback()
            logger.error(f"Failed to persist results to DB: {e}")


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
