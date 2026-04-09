"""
Agent 4: Insight Generator (LLM-based)
Converts structured analysis into human-readable Smart Money Reports.
"""

import os
import json
import logging
from datetime import date
from crewai import Agent, Task

logger = logging.getLogger(__name__)

MOCK_REPORT = """## Executive Summary
Today marked a pivotal reversal in FII sentiment. After three consecutive sessions of outflows,
foreign institutions turned net buyers. The shift was broad-based across Banking, Telecom, and Pharma.

## Key Themes

### 🏦 Banking Thesis Intact
GIC Private Limited and BlackRock led bulk purchases in HDFC Bank and ICICI Bank.
Both stocks have corrected 8-12% from 52-week highs, creating attractive entry points.
NIM expansion expectations for Q1FY26 are supportive.

### 📡 Telecom — 5G Monetization Play
Temasek's block deal in Bharti Airtel signals strong conviction in 5G ARPU growth.
Reliance Jio's upcoming IPO news may be driving FII positioning.

### 🏗️ Infrastructure — DII Conviction Buy
LIC continues to be the dominant buyer in infrastructure (L&T, NTPC, Power Grid).
PSU infrastructure firms trading at 40% discount to private peers.

### ⚠️ IT Under Pressure
Vanguard and Fidelity both reduced IT exposure today. US tech spending slowdown
and AI disruption narratives weigh on outsourcing revenue visibility.

## Outlook
If FII buying sustains above ₹2,000 Cr for 3 sessions, Nifty could test 24,200.
Watch Banking sector for leadership. Key risk: US CPI data due Thursday.
"""


def create_insight_agent() -> Agent:
    openai_key = os.getenv("OPENAI_API_KEY", "")
    llm = "gpt-4o" if openai_key and not openai_key.startswith("your_") else None

    return Agent(
        role="Financial Research Analyst & Writer",
        goal="Convert structured FII/DII analysis into clear, insightful daily reports that help investors make better decisions",
        backstory="""You are a Bloomberg-style financial writer who specializes in institutional money analysis.
        You write in a clear, data-backed style — explaining WHY money is moving and what it means for retail investors.
        You correlate FII/DII data with macro news, sector trends, and historical patterns to generate actionable insights.""",
        tools=[],
        verbose=True,
        llm=llm,
        max_iter=2,
    )


def create_insight_task(agent: Agent, analysis: str) -> Task:
    return Task(
        description=f"""
        Based on this market analysis, write the daily Smart Money Report:
        {analysis}

        The report must include:
        1. An executive summary (2-3 sentences, lead with the most important insight)
        2. Key themes (3-5 thematic sections with emoji headers)
        3. Why money is moving (correlate with macro/news context)
        4. FII/DII flow summary table
        5. Outlook and risks
        6. 5-6 key bullet points for quick reading
        7. Smart Money Score explanation

        Writing style: Bloomberg terminal meets retail-friendly. Facts + narrative.
        Do NOT use generic filler text. Every sentence must be backed by the data.
        """,
        expected_output="""JSON with:
        - title: str (report title with date)
        - summary: str (executive summary 2-3 sentences)
        - key_points: list of dicts (icon + text for each bullet)
        - full_report: str (markdown formatted full report)
        - smart_money_score: int
        - sector_momentum: int
        - institutional_confidence: int
        - generated_at: str (ISO timestamp)
        """,
        agent=agent,
    )


def generate_mock_insight(analysis_data: dict) -> dict:
    """Fallback mock insight when no LLM is configured."""
    return {
        "title": f"Smart Money Report — {date.today().strftime('%B %d, %Y')}",
        "summary": "FIIs turned net buyers after 3 sessions of selling, pumping ₹2,847 Cr into Banking and Telecom. DIIs maintained aggressive accumulation in PSU and Infrastructure plays. Institutional breadth at 68% — historically bullish for Nifty50.",
        "key_points": [
            {"icon": "🏦", "text": "FIIs net bought ₹2,847 Cr — led by GIC and BlackRock in HDFC Bank and Reliance."},
            {"icon": "📡", "text": "Telecom sector saw record FII inflow of ₹2,340 Cr. 5G thesis builds."},
            {"icon": "🏗️", "text": "Infrastructure top DII pick for 3rd consecutive week. LIC added L&T shares."},
            {"icon": "💊", "text": "Pharma FII inflow ₹2,100 Cr — USD strength driving exports thesis."},
            {"icon": "⚠️", "text": "IT sector saw FII outflow of ₹1,240 Cr. Q4 guidance concerns persist."},
            {"icon": "🟢", "text": f"Smart Money Score: {analysis_data.get('smart_money_score', 74)}/100 — Strong accumulation signal."},
        ],
        "full_report": MOCK_REPORT,
        "smart_money_score": analysis_data.get("smart_money_score", 74),
        "sector_momentum": 67,
        "institutional_confidence": 68,
        "generated_at": date.today().isoformat(),
    }
