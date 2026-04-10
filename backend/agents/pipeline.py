"""
CrewAI Pipeline Orchestrator
Runs all 4 agents in sequence after market close.
"""

import json
import logging
import os
from datetime import date
from crewai import Crew, Process

from agents.collector import create_collector_agent, create_collection_task
from agents.cleaner import create_cleaner_agent, create_cleaning_task, clean_deal
from agents.analyzer import create_analyzer_agent, create_analysis_task
from agents.insights import create_insight_agent, create_insight_task, generate_mock_insight
from agents.alert import create_alert_agent, create_alert_task, check_flow_alerts, check_deal_alerts

logger = logging.getLogger(__name__)


def run_pipeline() -> dict:
    """
    Main pipeline entry point. 
    Runs all agents sequentially and returns final result.
    """
    logger.info("🚀 Starting ShareMarketFlow agent pipeline...")

    use_llm = bool(os.getenv("OPENAI_API_KEY", "").strip() and not os.getenv("OPENAI_API_KEY", "").startswith("your_"))

    if use_llm:
        return _run_with_crewai()
    else:
        return _run_mock_pipeline()


def _run_mock_pipeline() -> dict:
    """
    Fast mock pipeline when no LLM is configured.
    Uses deterministic logic instead of LLM calls.
    """
    logger.info("Running mock pipeline (no LLM configured)")

    # Step 1: Collect
    mock_deals = [
        {"mTradDt": str(date.today()), "scrpNm": "HDFCBANK", "clntNm": "GIC PRIVATE LIMITED", "BuySell": "BUY", "bd_qty": 14200000, "bd_trdVal": 261635000000},
        {"mTradDt": str(date.today()), "scrpNm": "RELIANCE", "clntNm": "BLACKROCK INC", "BuySell": "BUY", "bd_qty": 3800000, "bd_trdVal": 111758000000},
        {"mTradDt": str(date.today()), "scrpNm": "TCS", "clntNm": "VANGUARD GROUP", "BuySell": "SELL", "bd_qty": 2100000, "bd_trdVal": 86688000000},
    ]

    # Step 2: Clean
    clean_deals = [clean_deal(d) for d in mock_deals]

    # Step 3: Analyze
    analysis = {
        "top_fii_buyers": [{"name": "GIC Private Limited", "value_cr": 2616}, {"name": "BlackRock Inc.", "value_cr": 1117}],
        "top_dii_buyers": [{"name": "SBI Mutual Fund", "value_cr": 1024}, {"name": "LIC", "value_cr": 955}],
        "smart_money_score": 74,
        "sector_momentum": 67,
        "market_signal": "BULLISH",
        "fii_5d_sum": 2847,
        "dii_5d_sum": 3870,
    }

    # Step 4: Insights
    insight = generate_mock_insight(analysis)

    # Step 5: Alerts
    deal_alerts = check_deal_alerts(clean_deals)
    flow_alerts = check_flow_alerts(analysis)
    all_alerts = deal_alerts + flow_alerts

    result = {
        "status": "success",
        "pipeline_date": str(date.today()),
        "deals_processed": len(clean_deals),
        "alerts_generated": len(all_alerts),
        "insight": insight,
        "alerts": all_alerts,
        "analysis": analysis,
    }

    logger.info(f"✅ Pipeline complete: {len(clean_deals)} deals, {len(all_alerts)} alerts")
    return result


def _run_with_crewai() -> dict:
    """Full CrewAI pipeline with LLM."""
    try:
        # Create agents
        collector = create_collector_agent()
        cleaner = create_cleaner_agent()
        analyzer = create_analyzer_agent()
        insight_agent = create_insight_agent()

        # Create tasks (sequential)
        collect_task = create_collection_task(collector)
        clean_task = create_cleaning_task(cleaner, "{{collect_task.output}}")
        analyze_task = create_analysis_task(analyzer, "{{clean_task.output}}")
        insight_task = create_insight_task(insight_agent, "{{analyze_task.output}}")

        # Assemble crew
        crew = Crew(
            agents=[collector, cleaner, analyzer, insight_agent],
            tasks=[collect_task, clean_task, analyze_task, insight_task],
            process=Process.sequential,
            verbose=True,
        )

        result = crew.kickoff()
        return {
            "status": "success",
            "pipeline_date": str(date.today()),
            "result": str(result),
        }

    except Exception as e:
        logger.error(f"CrewAI pipeline failed: {e}, falling back to mock")
        return _run_mock_pipeline()
