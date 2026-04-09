"""Database operations for storing agent results"""

import os
import psycopg2
from psycopg2.extras import Json
from datetime import datetime
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)

# Database connection string
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://localhost/sharemarketflow')


def get_db_connection():
    """Get a database connection"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        logger.error(f'Failed to connect to database: {e}')
        raise


def save_market_indices(data: Dict[str, Any]) -> bool:
    """Save market indices to database"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO market_indices 
            (date, nifty50_value, nifty50_change, nifty50_change_pct, 
             sensex_value, sensex_change, sensex_change_pct, nse_change_pct)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (date) DO UPDATE SET
            nifty50_value = EXCLUDED.nifty50_value,
            nifty50_change = EXCLUDED.nifty50_change,
            nifty50_change_pct = EXCLUDED.nifty50_change_pct,
            sensex_value = EXCLUDED.sensex_value,
            sensex_change = EXCLUDED.sensex_change,
            sensex_change_pct = EXCLUDED.sensex_change_pct,
            nse_change_pct = EXCLUDED.nse_change_pct,
            updated_at = NOW()
        """, (
            data.get('date'),
            data.get('nifty50_value'),
            data.get('nifty50_change'),
            data.get('nifty50_change_pct'),
            data.get('sensex_value'),
            data.get('sensex_change'),
            data.get('sensex_change_pct'),
            data.get('nse_change_pct'),
        ))
        
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        logger.error(f'Failed to save market indices: {e}')
        return False


def save_deals(deals: List[Dict[str, Any]]) -> bool:
    """Save deals to database"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        for deal in deals:
            cursor.execute("""
                INSERT INTO deals 
                (date, company, sector, deal_type, fii_value, dii_value, net_value, sentiment, analysis)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                deal.get('date'),
                deal.get('company'),
                deal.get('sector'),
                deal.get('deal_type'),
                deal.get('fii_value'),
                deal.get('dii_value'),
                deal.get('net_value'),
                deal.get('sentiment'),
                deal.get('analysis'),
            ))
        
        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f'Saved {len(deals)} deals to database')
        return True
    except Exception as e:
        logger.error(f'Failed to save deals: {e}')
        return False


def save_fii_dii_analysis(data: Dict[str, Any]) -> bool:
    """Save FII/DII analysis to database"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO fii_dii_analysis 
            (date, total_fii_inflow, total_dii_inflow, net_flow, fii_sentiment, dii_sentiment, analysis)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (date) DO UPDATE SET
            total_fii_inflow = EXCLUDED.total_fii_inflow,
            total_dii_inflow = EXCLUDED.total_dii_inflow,
            net_flow = EXCLUDED.net_flow,
            fii_sentiment = EXCLUDED.fii_sentiment,
            dii_sentiment = EXCLUDED.dii_sentiment,
            analysis = EXCLUDED.analysis,
            updated_at = NOW()
        """, (
            data.get('date'),
            data.get('total_fii_inflow'),
            data.get('total_dii_inflow'),
            data.get('net_flow'),
            data.get('fii_sentiment'),
            data.get('dii_sentiment'),
            data.get('analysis'),
        ))
        
        conn.commit()
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        logger.error(f'Failed to save FII/DII analysis: {e}')
        return False


def save_insights(insights: List[Dict[str, Any]]) -> bool:
    """Save insights to database"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        for insight in insights:
            cursor.execute("""
                INSERT INTO insights 
                (date, title, description, category, priority, actionable)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                insight.get('date'),
                insight.get('title'),
                insight.get('description'),
                insight.get('category'),
                insight.get('priority'),
                insight.get('actionable', False),
            ))
        
        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f'Saved {len(insights)} insights to database')
        return True
    except Exception as e:
        logger.error(f'Failed to save insights: {e}')
        return False


def save_alerts(alerts: List[Dict[str, Any]]) -> bool:
    """Save alerts to database"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        for alert in alerts:
            cursor.execute("""
                INSERT INTO alerts 
                (date, title, description, alert_type, severity, is_active)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                alert.get('date'),
                alert.get('title'),
                alert.get('description'),
                alert.get('alert_type'),
                alert.get('severity'),
                alert.get('is_active', True),
            ))
        
        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f'Saved {len(alerts)} alerts to database')
        return True
    except Exception as e:
        logger.error(f'Failed to save alerts: {e}')
        return False


def save_pipeline_run(start_time: str, end_time: str, status: str, 
                      deals_processed: int, alerts_generated: int, insights_generated: int,
                      message: str = None) -> bool:
    """Save pipeline run to database"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO pipeline_runs 
            (start_time, end_time, status, message, deals_processed, alerts_generated, insights_generated)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            start_time,
            end_time,
            status,
            message,
            deals_processed,
            alerts_generated,
            insights_generated,
        ))
        
        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f'Saved pipeline run - Status: {status}, Deals: {deals_processed}, Alerts: {alerts_generated}, Insights: {insights_generated}')
        return True
    except Exception as e:
        logger.error(f'Failed to save pipeline run: {e}')
        return False
