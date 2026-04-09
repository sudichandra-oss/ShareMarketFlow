"""
APScheduler — runs agent pipeline daily at 4:00 PM IST (10:30 UTC)
"""

import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import pytz

logger = logging.getLogger(__name__)
IST = pytz.timezone("Asia/Kolkata")


def _run_daily_pipeline():
    """Scheduled job: run agent pipeline after market close."""
    logger.info("⏰ Scheduled pipeline triggered — 4:00 PM IST")
    try:
        from agents.pipeline import run_pipeline
        result = run_pipeline()
        logger.info(f"✅ Scheduled pipeline complete: {result.get('status')}")
    except Exception as e:
        logger.error(f"❌ Scheduled pipeline failed: {e}")


def start_scheduler() -> BackgroundScheduler:
    scheduler = BackgroundScheduler(timezone=IST)

    # Run at 4:00 PM IST every weekday (Mon-Fri)
    scheduler.add_job(
        _run_daily_pipeline,
        trigger=CronTrigger(
            hour=16, minute=0, second=0,
            day_of_week="mon-fri",
            timezone=IST,
        ),
        id="daily_pipeline",
        name="Daily FII/DII Agent Pipeline",
        replace_existing=True,
    )

    scheduler.start()
    logger.info("✅ Scheduler started — next run: weekdays at 4:00 PM IST")
    return scheduler
