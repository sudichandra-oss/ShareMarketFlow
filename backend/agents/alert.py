"""
Agent 5: Alert Agent
Triggers alerts when FII/DII activity exceeds configured thresholds.
"""

import json
import logging
from datetime import datetime
from crewai import Agent, Task

logger = logging.getLogger(__name__)

# Thresholds
FLOW_THRESHOLD_CR = 1000      # Alert if net flow > ₹1000 Cr
STAKE_CHANGE_PCT = 1.0        # Alert if stake change > 1%
DEAL_THRESHOLD_CR = 500       # Alert if single deal > ₹500 Cr


def check_flow_alerts(analysis: dict) -> list:
    """Check if flow thresholds are breached."""
    alerts = []
    fii_5d = abs(analysis.get("fii_5d_sum", 0))
    dii_5d = abs(analysis.get("dii_5d_sum", 0))

    if fii_5d > FLOW_THRESHOLD_CR:
        alerts.append({
            "type": "SECTOR_FLOW",
            "severity": "HIGH" if fii_5d > 5000 else "MEDIUM",
            "institution": "Multiple FIIs",
            "company": "Market Wide",
            "value_cr": round(fii_5d, 2),
            "description": f"FII 5-day net flow: ₹{fii_5d:,.0f} Cr — threshold exceeded",
            "triggered_at": datetime.now().isoformat(),
        })

    return alerts


def check_deal_alerts(deals: list) -> list:
    """Check if individual deals exceed threshold."""
    alerts = []
    for deal in deals:
        value = float(deal.get("value_cr", 0))
        if value >= DEAL_THRESHOLD_CR:
            alerts.append({
                "type": "LARGE_DEAL",
                "severity": "HIGH" if value >= 1000 else "MEDIUM",
                "institution": deal.get("client_name", "Unknown"),
                "company": deal.get("symbol", "Unknown"),
                "value_cr": value,
                "description": f"{deal.get('client_name')} {deal.get('side')} {deal.get('symbol')} worth ₹{value:,.0f} Cr",
                "triggered_at": datetime.now().isoformat(),
            })
    return alerts


def create_alert_agent() -> Agent:
    return Agent(
        role="Risk Monitor & Alert Specialist",
        goal="Detect significant institutional activity and trigger timely alerts for users",
        backstory="""You monitor institutional activity in real-time and detect unusual patterns
        that warrant immediate user attention. You understand threshold-based alerting and ensure
        alerts are meaningful — not too frequent, but never missing important events.""",
        tools=[],
        verbose=True,
        max_iter=2,
    )


def create_alert_task(agent: Agent, analysis: str) -> Task:
    return Task(
        description=f"""
        Review this market analysis and generate alerts for significant events:
        {analysis}

        Trigger alerts when:
        1. FII/DII net flow > ₹1,000 Cr (single session)
        2. Single institution deal > ₹500 Cr
        3. Stake change > 1% for any company
        4. New institution entry or complete exit
        5. Smart Money Score changes by > 10 points

        For each alert, specify:
        - Severity: HIGH / MEDIUM / LOW
        - Type: LARGE_DEAL / STAKE_CHANGE / SECTOR_FLOW / NEW_ENTRY
        - Clear, actionable description
        """,
        expected_output="""JSON list of alerts with:
        [
          {
            "type": str,
            "severity": str,
            "institution": str,
            "company": str,
            "value_cr": float,
            "description": str,
            "triggered_at": str
          }
        ]
        """,
        agent=agent,
    )
