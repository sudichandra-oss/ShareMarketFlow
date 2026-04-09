"""Database operations for storing agent results — Unified with SQLAlchemy"""

import logging
from datetime import datetime
from typing import Dict, List, Any
from sqlalchemy.orm import Session
from sqlalchemy import select

from db.database import SessionLocal
from db import models

logger = logging.getLogger(__name__)


def get_db_session() -> Session:
    """Get a sync database session"""
    return SessionLocal()


def save_market_indices(data: Dict[str, Any]) -> bool:
    """Save market indices to database using SQLAlchemy"""
    try:
        with get_db_session() as session:
            # Check for existing record by date
            target_date = datetime.strptime(data.get('date'), '%Y-%m-%d').date() if isinstance(data.get('date'), str) else data.get('date')
            stmt = select(models.MarketIndex).where(models.MarketIndex.date == target_date)
            existing = session.execute(stmt).scalar_one_or_none()
            
            if existing:
                existing.nifty50_value = data.get('nifty50_value')
                existing.nifty50_change = data.get('nifty50_change')
                existing.nifty50_change_pct = data.get('nifty50_change_pct')
                existing.sensex_value = data.get('sensex_value')
                existing.sensex_change = data.get('sensex_change')
                existing.sensex_change_pct = data.get('sensex_change_pct')
                existing.nse_change_pct = data.get('nse_change_pct')
            else:
                new_idx = models.MarketIndex(
                    date=target_date,
                    nifty50_value=data.get('nifty50_value'),
                    nifty50_change=data.get('nifty50_change'),
                    nifty50_change_pct=data.get('nifty50_change_pct'),
                    sensex_value=data.get('sensex_value'),
                    sensex_change=data.get('sensex_change'),
                    sensex_change_pct=data.get('sensex_change_pct'),
                    nse_change_pct=data.get('nse_change_pct')
                )
                session.add(new_idx)
            
            session.commit()
            return True
    except Exception as e:
        logger.error(f'Failed to save market indices: {e}')
        return False


def save_deals(deals: List[Dict[str, Any]]) -> bool:
    """Save deals to database using SQLAlchemy"""
    try:
        with get_db_session() as session:
            for deal_data in deals:
                target_date = datetime.strptime(deal_data.get('date'), '%Y-%m-%d').date() if isinstance(deal_data.get('date'), str) else deal_data.get('date')
                new_deal = models.Deal(
                    deal_date=target_date,
                    symbol=deal_data.get('symbol'),
                    company_name=deal_data.get('company_name', deal_data.get('company', '')),
                    client_name=deal_data.get('client_name'),
                    deal_side=deal_data.get('side', deal_data.get('BuySell', 'BUY')),
                    deal_type=deal_data.get('deal_type', 'BULK'),
                    quantity=deal_data.get('quantity', 0),
                    value_cr=deal_data.get('value_cr', 0),
                    exchange=deal_data.get('exchange', 'NSE')
                )
                session.add(new_deal)
            
            session.commit()
            logger.info(f'Saved {len(deals)} deals to database')
            return True
    except Exception as e:
        logger.error(f'Failed to save deals: {e}')
        return False


def save_fii_dii_analysis(data: Dict[str, Any]) -> bool:
    """Save FII/DII analysis to database using SQLAlchemy"""
    try:
        with get_db_session() as session:
            target_date = datetime.strptime(data.get('date'), '%Y-%m-%d').date() if isinstance(data.get('date'), str) else data.get('date')
            stmt = select(models.FiiDiiAnalysis).where(models.FiiDiiAnalysis.date == target_date)
            existing = session.execute(stmt).scalar_one_or_none()
            
            if existing:
                existing.total_fii_inflow = data.get('total_fii_inflow')
                existing.total_dii_inflow = data.get('total_dii_inflow')
                existing.net_flow = data.get('net_flow')
                existing.fii_sentiment = data.get('fii_sentiment')
                existing.dii_sentiment = data.get('dii_sentiment')
                existing.analysis = data.get('analysis')
            else:
                new_analysis = models.FiiDiiAnalysis(
                    date=target_date,
                    total_fii_inflow=data.get('total_fii_inflow'),
                    total_dii_inflow=data.get('total_dii_inflow'),
                    net_flow=data.get('net_flow'),
                    fii_sentiment=data.get('fii_sentiment'),
                    dii_sentiment=data.get('dii_sentiment'),
                    analysis=data.get('analysis')
                )
                session.add(new_analysis)
            
            session.commit()
            return True
    except Exception as e:
        logger.error(f'Failed to save FII/DII analysis: {e}')
        return False


def save_insights(insights: List[Dict[str, Any]]) -> bool:
    """Save insights to database using SQLAlchemy"""
    try:
        with get_db_session() as session:
            for insight_data in insights:
                dt_str = insight_data.get('date') or insight_data.get('generated_at')
                target_date = datetime.strptime(dt_str, '%Y-%m-%d').date() if isinstance(dt_str, str) else dt_str
                
                # Check for uniqueness if date is primary key or unique
                stmt = select(models.Insight).where(models.Insight.report_date == target_date)
                existing = session.execute(stmt).scalar_one_or_none()
                
                if existing:
                    existing.title = insight_data.get('title')
                    existing.summary = insight_data.get('summary', insight_data.get('description', ''))
                    existing.smart_money_score = insight_data.get('priority', insight_data.get('smart_money_score', 0))
                else:
                    new_insight = models.Insight(
                        report_date=target_date,
                        title=insight_data.get('title'),
                        summary=insight_data.get('summary', insight_data.get('description', '')),
                        smart_money_score=insight_data.get('priority', insight_data.get('smart_money_score', 0))
                    )
                    session.add(new_insight)
            
            session.commit()
            logger.info(f'Saved {len(insights)} insights to database')
            return True
    except Exception as e:
        logger.error(f'Failed to save insights: {e}')
        return False


def save_alerts(alerts: List[Dict[str, Any]]) -> bool:
    """Save alerts to database using SQLAlchemy"""
    try:
        with get_db_session() as session:
            for alert_data in alerts:
                target_date = datetime.strptime(alert_data.get('date'), '%Y-%m-%d').date() if isinstance(alert_data.get('date'), str) else alert_data.get('date')
                new_alert = models.Alert(
                    date=target_date,
                    title=alert_data.get('title'),
                    description=alert_data.get('description'),
                    alert_type=alert_data.get('alert_type', 'GENERAL'),
                    severity=alert_data.get('severity', 'MEDIUM'),
                    is_active=alert_data.get('is_active', True)
                )
                session.add(new_alert)
            
            session.commit()
            logger.info(f'Saved {len(alerts)} alerts to database')
            return True
    except Exception as e:
        logger.error(f'Failed to save alerts: {e}')
        return False


def save_pipeline_run(start_time: str, end_time: str, status: str, 
                      deals_processed: int, alerts_generated: int, insights_generated: int,
                      message: str = None) -> bool:
    """Save pipeline run to database using SQLAlchemy"""
    try:
        with get_db_session() as session:
            new_run = models.PipelineRun(
                start_time=datetime.fromisoformat(start_time) if isinstance(start_time, str) else start_time,
                end_time=datetime.fromisoformat(end_time) if isinstance(end_time, str) else end_time,
                status=status,
                message=message,
                deals_processed=deals_processed,
                alerts_generated=alerts_generated,
                insights_generated=insights_generated
            )
            session.add(new_run)
            session.commit()
            logger.info(f'Saved pipeline run - Status: {status}')
            return True
    except Exception as e:
        logger.error(f'Failed to save pipeline run: {e}')
        return False
