
import json
import random
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from econometrics import AcademicCPCI

def generate_series():
    """
    Generates a synthetic history of CPCI vs CPI from 2023-01-01 to Today.
    This runs daily in GitHub Actions to 'refresh' the dataset.
    """
    
    # Initialize Engine
    engine = AcademicCPCI(alpha=0.44) # Georganas Parameter
    
    # Date Range
    start_date = datetime(2023, 1, 1)
    end_date = datetime.now()
    dates = pd.date_range(start_date, end_date, freq='M') # Monthly points
    
    data_points = []
    
    # Base Index
    base_cpi = 100.0
    base_cpci = 100.0
    
    # Volatility Settings
    cpi_trend = 0.002 # Slow, steady 0.2% MoM
    cpci_volatility = 0.008 # Higher volatility for "Felt" inflation
    
    current_cpi = base_cpi
    current_cpci = base_cpci
    
    for date in dates:
        # 1. Simulate Official CPI (Smoothed)
        # Random walk with positive drift
        shock_cpi = np.random.normal(0.002, 0.001)
        current_cpi = current_cpi * (1 + shock_cpi)
        
        # 2. Simulate CPCI (Felt Inflation)
        # "Frequency Bias" means it reacts more to volatile shocks (Fuel/Food)
        # We simulate a "Frequency Shock" (e.g. Gas price spike)
        freq_shock = np.random.normal(0.004, 0.006) 
        
        # Shrinkflation Event (Random 10% chance)
        is_shrink = random.random() < 0.10
        shrink_impact = engine.LAMBDA_ROJAS if is_shrink else 0.0
        
        # Formula proxy for simulation:
        # growth = (Alpha * Freq_Shock) + ((1-Alpha) * CPI_Shock) + Shrink_Impact
        growth_cpci = (engine.alpha * freq_shock) + ((1 - engine.alpha) * shock_cpi) + (shrink_impact * 0.02)
        
        current_cpci = current_cpci * (1 + growth_cpci)
        
        data_points.append({
            "date": date.strftime("%Y-%m-%d"),
            "cpi_official": round(current_cpi, 2),
            "cpci_felt": round(current_cpci, 2),
            "divergence": round(current_cpci - current_cpi, 2)
        })
    
    # Output to frontend public folder
    output_path = "../public/data/cpci_series.json"
    
    # Ensure directory exists (in local dev)
    import os
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w") as f:
        json.dump(data_points, f, indent=2)
        
    print(f"Generated {len(data_points)} data points up to {end_date.strftime('%Y-%m-%d')}")

if __name__ == "__main__":
    generate_series()
