"""Database models — SQLAlchemy ORM"""

from sqlalchemy import (
    Column, Integer, String, Numeric, BigInteger,
    Boolean, Text, Date, ARRAY, DateTime, JSON
)
from sqlalchemy.sql import func
from db.database import Base


class InstitutionalFlow(Base):
    __tablename__ = "institutional_flows"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, index=True)
    type = Column(String(3), nullable=False)  # FII / DII
    gross_buy = Column(Numeric(15, 2))
    gross_sell = Column(Numeric(15, 2))
    net_flow = Column(Numeric(15, 2))
    source = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Holding(Base):
    __tablename__ = "holdings"

    id = Column(Integer, primary_key=True, index=True)
    institution_name = Column(String(200), index=True)
    institution_type = Column(String(10))  # FII / DII
    company_ticker = Column(String(20), index=True)
    company_name = Column(String(200))
    sector = Column(String(100))
    shares_held = Column(BigInteger)
    pct_holding = Column(Numeric(5, 2))
    quarter = Column(String(10))
    as_of_date = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Deal(Base):
    __tablename__ = "deals"

    id = Column(Integer, primary_key=True, index=True)
    deal_date = Column(Date, index=True)
    deal_type = Column(String(10))  # BULK / BLOCK
    exchange = Column(String(5))
    symbol = Column(String(20), index=True)
    company_name = Column(String(200))
    client_name = Column(String(200))
    deal_side = Column(String(4))  # BUY / SELL
    quantity = Column(BigInteger)
    price = Column(Numeric(10, 2))
    value_cr = Column(Numeric(15, 2))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Insight(Base):
    __tablename__ = "insights"

    id = Column(Integer, primary_key=True, index=True)
    report_date = Column(Date, nullable=False, unique=True)
    title = Column(String(500))
    summary = Column(Text)
    full_report = Column(Text)
    key_points = Column(JSON)  # Changed from JSONB for SQLite compatibility
    sectors_mentioned = Column(JSON)  # Changed from ARRAY(Text) for SQLite compatibility
    smart_money_score = Column(Integer)
    sector_momentum = Column(Integer)
    institutional_confidence = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    alert_type = Column(String(50))
    institution_name = Column(String(200))
    company_name = Column(String(200))
    sector = Column(String(100))
    value_cr = Column(Numeric(15, 2))
    title = Column(String(500))
    description = Column(Text)
    severity = Column(String(10))  # HIGH / MEDIUM / LOW
    is_active = Column(Boolean, default=True)
    is_read = Column(Boolean, default=False)
    triggered_at = Column(DateTime(timezone=True), server_default=func.now())


class MarketIndex(Base):
    __tablename__ = "market_indices"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, unique=True, index=True)
    nifty50_value = Column(Numeric(12, 2))
    nifty50_change = Column(Numeric(10, 2))
    nifty50_change_pct = Column(Numeric(5, 2))
    sensex_value = Column(Numeric(12, 2))
    sensex_change = Column(Numeric(10, 2))
    sensex_change_pct = Column(Numeric(5, 2))
    nse_change_pct = Column(Numeric(5, 2))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class FiiDiiAnalysis(Base):
    __tablename__ = "fii_dii_analysis"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, unique=True, index=True)
    total_fii_inflow = Column(Numeric(15, 2))
    total_dii_inflow = Column(Numeric(15, 2))
    net_flow = Column(Numeric(15, 2))
    fii_sentiment = Column(String(20))
    dii_sentiment = Column(String(20))
    analysis = Column(Text)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class PipelineRun(Base):
    __tablename__ = "pipeline_runs"

    id = Column(Integer, primary_key=True, index=True)
    start_time = Column(DateTime(timezone=True))
    end_time = Column(DateTime(timezone=True))
    status = Column(String(20))
    message = Column(Text)
    deals_processed = Column(Integer)
    alerts_generated = Column(Integer)
    insights_generated = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

