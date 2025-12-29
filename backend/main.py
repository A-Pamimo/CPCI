
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from .econometrics import CPCIEngine

app = FastAPI(
    title="CPCI Econometric Engine",
    description="API for the Canadian Perceived Cost Index (Behavioral Macroeconomics)",
    version="3.1.0"
)

# Initialize Engine
engine = CPCIEngine()

# --- Pydantic Models for Validation ---

class CategoryWeight(BaseModel):
    category: str
    theta: float  # Expenditure share (0-1)
    velocity: float # Purchases per year

class InflationPoint(BaseModel):
    category: str
    price_relative: float # P_t / P_t-1 (e.g., 1.05 for 5% inflation)
    is_shrinkflation: bool = False
    shrink_penalty: Optional[float] = 0.0

class CPCIRequest(BaseModel):
    profile_weights: List[CategoryWeight]
    inflation_data: List[InflationPoint]
    regional_elasticity: float = 1.0

# --- Endpoints ---

@app.get("/")
def health_check():
    return {"status": "active", "engine": "CPCI v3.1 (Behavioral)", "alpha": engine.ALPHA}

@app.post("/calculate")
def calculate_cpci(request: CPCIRequest):
    """
    Calculate the Perceived Cost Index based on the specific profile and market data.
    """
    try:
        # Convert Pydantic models to dicts for the engine
        weights_dict = [w.dict() for w in request.profile_weights]
        inflation_dict = [i.dict() for i in request.inflation_data]
        
        result = engine.calculate_cpci(
            profile_weights=weights_dict,
            inflation_data=inflation_dict,
            regional_elasticity=request.regional_elasticity
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
