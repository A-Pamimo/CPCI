
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
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
    price_current: float  # Current price
    price_ref: float      # Reference/previous price
    is_shrinkflation: bool = False

class CPCIRequest(BaseModel):
    basket: List[dict]  # Combined weight + price data
    regional_elasticity: float = 1.0

# --- Endpoints ---

@app.get("/")
def health_check():
    return {
        "status": "active", 
        "engine": "CPCI v3.1 (Academic Synthesis)", 
        "alpha": engine.alpha,
        "lambda_shrink": engine.LAMBDA_ROJAS
    }

@app.post("/calculate")
def calculate_cpci(request: CPCIRequest):
    """
    Calculate the Perceived Cost Index based on the specific profile and market data.
    
    Expected basket format (list of dicts):
    [
        {
            "category": "Groceries",
            "price_current": 105.0,
            "price_ref": 100.0,
            "weight_expenditure": 0.15,
            "frequency_annual": 52,
            "is_shrinkflation": false
        },
        ...
    ]
    """
    try:
        # Convert request to DataFrame for engine
        df = pd.DataFrame(request.basket)
        
        result = engine.compute_index(
            basket=df,
            regional_elasticity=request.regional_elasticity
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/elasticity-map")
def get_elasticity_map():
    """Returns housing supply elasticity multipliers by city type."""
    return CPCIEngine.glaeser_elasticity_map()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
