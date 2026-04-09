"""Database connection — async SQLAlchemy"""

import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:password@localhost:5432/sharemarketflow")
# Convert sync URL to async for async engine
ASYNC_DATABASE_URL = DATABASE_URL
if ASYNC_DATABASE_URL.startswith("postgresql://"):
    ASYNC_DATABASE_URL = ASYNC_DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
elif ASYNC_DATABASE_URL.startswith("sqlite:///"):
    ASYNC_DATABASE_URL = ASYNC_DATABASE_URL.replace("sqlite:///", "sqlite+aiosqlite:///", 1)

# Sync URL for sync engine
SYNC_DATABASE_URL = DATABASE_URL
if SYNC_DATABASE_URL.startswith("postgresql+asyncpg://"):
    SYNC_DATABASE_URL = SYNC_DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://", 1)
elif SYNC_DATABASE_URL.startswith("sqlite+aiosqlite:///"):
    SYNC_DATABASE_URL = SYNC_DATABASE_URL.replace("sqlite+aiosqlite:///", "sqlite:///", 1)

# Engine parameters
engine_kwargs = {"echo": False}
if "sqlite" not in ASYNC_DATABASE_URL:
    engine_kwargs.update({"pool_size": 10, "max_overflow": 20})

engine = create_async_engine(ASYNC_DATABASE_URL, **engine_kwargs)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# Sync Engine and Session (Sync SQLite doesn't need many params)
sync_engine = create_engine(SYNC_DATABASE_URL, echo=False)
SessionLocal = sessionmaker(sync_engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def create_tables():
    """Create all tables on startup."""
    from db import models  # noqa: F401 — import to register models
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


def create_tables_sync():
    """Create all tables using sync engine."""
    from db import models  # noqa: F401
    Base.metadata.create_all(bind=sync_engine)


async def get_db():
    """Dependency: yields an async DB session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


def get_sync_db():
    """Yields a sync DB session."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
