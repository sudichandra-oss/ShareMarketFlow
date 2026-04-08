"""
Agent 3: Market Analyst
Identifies trends, top buyers/sellers, sector rotation, and generates structured analysis.
"""

from crewai import Agent, Task
from crewai_tools import BaseTool
import json


class TrendAnalysisTool(BaseTool):
    name: str = "Trend Analyzer"
    description: str = "Analyzes FII/DII flow patterns to identify trends and sector rotation"

    def _run(self, data: str) -> str:
        try:
            flows = json.loads(data)
        except Exception:
            return json.dumps({"error": "invalid input"})

        # Compute basic stats
        fii_net_vals = [d.get("fii_net", 0) for d in flows if isinstance(d, dict)]
        dii_net_vals = [d.get("dii_net", 0) for d in flows if isinstance(d, dict)]

        def trend_signal(vals):
            if len(vals) < 2:
                return "NEUTRAL"
            recent = vals[-3:]
            if all(v > 0 for v in recent):
                return "STRONG_BUY"
            if sum(recent) > 0:
                return "BUY"
            if all(v < 0 for v in recent):
                return "SELL"
            return "NEUTRAL"

        return json.dumps({
            "fii_signal": trend_signal(fii_net_vals),
            "dii_signal": trend_signal(dii_net_vals),
            "fii_5d_sum": round(sum(fii_net_vals[-5:]), 2),
            "dii_5d_sum": round(sum(dii_net_vals[-5:]), 2),
            "smart_money_score": min(100, max(0, int(60 + (sum(fii_net_vals[-3:]) / 500)))),
        })


def create_analyzer_agent() -> Agent:
    return Agent(
        role="Senior Market Analyst",
        goal="Identify institutional money flow trends, sector rotation, and generate Smart Money Score",
        backstory="""You are a veteran market analyst with 15+ years in Indian equity markets.
        You specialize in tracking smart money — FII/DII patterns that precede major market moves.
        You can read bulk deal data and instantly identify accumulation/distribution patterns,
        sector rotation signals, and institutional conviction levels.""",
        tools=[TrendAnalysisTool()],
        verbose=True,
        max_iter=3,
    )


def create_analysis_task(agent: Agent, clean_data: str) -> Task:
    return Task(
        description=f"""
        Analyze the following clean FII/DII data and generate comprehensive market analysis:
        {clean_data}

        Produce:
        1. Top 5 FII buyers today with sector concentration
        2. Top 5 DII buyers today
        3. Sector rotation signals (where money is moving from/to)
        4. Smart Money Score (0-100) based on:
           - FII net buy/sell momentum (40% weight)
           - DII conviction level (30% weight)
           - Sector breadth (30% weight)
        5. Any noteworthy stake changes (>0.5%)
        6. Sector Momentum Score for top 5 sectors
        """,
        expected_output="""JSON with:
        - top_fii_buyers: list
        - top_dii_buyers: list
        - sector_rotation: dict (from_sectors, to_sectors)
        - smart_money_score: int (0-100)
        - sector_momentum: dict
        - stake_changes: list
        - market_signal: str (BULLISH/BEARISH/NEUTRAL)
        """,
        agent=agent,
    )
