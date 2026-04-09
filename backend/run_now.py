import sys
import os
import asyncio

# Add the backend directory to system path so absolute imports work
sys.path.append(os.path.join(os.path.dirname(__file__)))

from api.routes.agents import _run_pipeline, _pipeline_status

async def main():
    print("Running pipeline...")
    await _run_pipeline()
    print("Status:", _pipeline_status)

if __name__ == "__main__":
    asyncio.run(main())
