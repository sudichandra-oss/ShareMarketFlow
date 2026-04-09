"""
ShareMarketFlow FastAPI Backend
FII/DII Intelligence Platform
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from api.routes import flows, institutions, sectors, insights, alerts, agents
from db.database import create_tables
from scheduler import start_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    await create_tables()
    scheduler = start_scheduler()
    yield
    scheduler.shutdown()


app = FastAPI(
    title="ShareMarketFlow API",
    description="FII/DII Intelligence Platform — AI-powered institutional investor tracker",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(flows.router, prefix="/api/flows", tags=["Flows"])
app.include_router(institutions.router, prefix="/api", tags=["Institutions"])
app.include_router(sectors.router, prefix="/api/sectors", tags=["Sectors"])
app.include_router(insights.router, prefix="/api/insights", tags=["Insights"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(agents.router, prefix="/api/agents", tags=["Agents"])


@app.get("/")
async def root():
    return {"status": "ok", "service": "ShareMarketFlow API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
