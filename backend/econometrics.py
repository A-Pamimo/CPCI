
import numpy as np
import pandas as pd
from typing import List, Dict, Optional

class CPCIEngine:
    """
    Perceived Cost Index (CPCI) Econometric Engine.
    
    Academic Basis:
    - Frequency Bias Parameter (alpha = 0.44): Georganas, Healy, and Li (2014)
    - Regional Friction Multiplier: Glaeser, Gyourko, and Saiz
    - Shrinkflation Utility Discontinuity: Rojas, Jaenicke, and Page (2024)
    """
    
    # Frequency bias parameter from Georganas et al. (2014)
    ALPHA: float = 0.44
    
    def __init__(self):
        pass

    def calculate_cpci(
        self, 
        profile_weights: List[Dict], 
        inflation_data: List[Dict], 
        regional_elasticity: float = 1.0
    ) -> Dict:
        """
        Calculates the CPCI for a given time period t.
        
        Formula:
        CPCI_t = sum( 
            [ (alpha * phi_i + (1 - alpha) * theta_i) * (1 + lambda * I_shrink) * (P_it / P_it-1) ] 
        ) * M_loc
        
        Args:
            profile_weights: List of category weights.
                - category: Name of category
                - theta: Standard Expenditure Share (0-1)
                - velocity: Purchase frequency per year (e.g., 52 for weekly)
            inflation_data: List of price changes.
                - category: Name of category
                - price_relative: (P_t / P_t-1)
                - is_shrinkflation: boolean (triggers Utility Discontinuity)
                - shrink_penalty: float (lambda, usually ~0.039 based on Rojas gap)
            regional_elasticity: M_loc multiplier (default 1.0 for National Average)
            
        Returns:
            Dict containing the CPCI index and component breakdown.
        """
        
        # Merge data on category
        df_weights = pd.DataFrame(profile_weights)
        df_inflation = pd.DataFrame(inflation_data)
        
        # Merge, assume categories match
        df = pd.merge(df_weights, df_inflation, on='category', how='inner')
        
        # 1. Calculate Frequency Weight (phi_i)
        # Normalize velocity to a relative weight (share of total frequency volume)
        total_velocity = df['velocity'].sum()
        df['phi'] = df['velocity'] / total_velocity
        
        # 2. Calculate Composite Weight (W_i)
        # W_i = alpha * phi_i + (1 - alpha) * theta
        df['composite_weight'] = (self.ALPHA * df['phi']) + ((1 - self.ALPHA) * df['theta'])
        
        # Normalize composite weights to sum to 1.0 (Standard Index Practice)
        df['composite_weight_norm'] = df['composite_weight'] / df['composite_weight'].sum()
        
        # 3. Calculate Shrinkflation Multiplier
        # (1 + lambda * I_shrink)
        # Verify if 'shrink_penalty' is provided, else default to Rojas estimate (0.039)
        ROJAS_GAP = 0.039
        df['shrink_mult'] = 1.0
        mask_shrink = df['is_shrinkflation'] == True
        df.loc[mask_shrink, 'shrink_mult'] = 1.0 + df.loc[mask_shrink, 'shrink_penalty'].fillna(ROJAS_GAP)
        
        # 4. Calculate Component Contribution
        # Contribution = Weight * ShrinkMult * PriceRelative
        df['contribution'] = df['composite_weight_norm'] * df['shrink_mult'] * df['price_relative']
        
        # 5. Sum and Apply Regional Multiplier (M_loc)
        raw_index = df['contribution'].sum()
        final_cpci = raw_index * regional_elasticity
        
        # 6. Metadata and Audit
        # Calculate the "Perception Gap" (CPCI - Standard CPI)
        # Standard CPI roughly assumes alpha=0 and no shrink penalty beyond unit price
        # We approximate a "Standard CPI" using just theta and price_relative
        df['standard_contribution'] = df['theta'] * df['price_relative']
        standard_cpi_approx = df['standard_contribution'].sum() * regional_elasticity # Assuming CPI scales regionally too? Or national? usually national.
        # Check if regional_elasticity applies to CPI. Usually CPI is regional. Let's assume yes.
        
        return {
            "cpci_index": round(final_cpci * 100, 2), # Index base 100
            "standard_cpi_approx": round(standard_cpi_approx * 100, 2),
            "perception_gap": round((final_cpci - standard_cpi_approx) * 100, 2),
            "regional_multiplier": regional_elasticity,
            "breakdown": df[['category', 'phi', 'theta', 'composite_weight_norm', 'contribution']].to_dict(orient='records')
        }

if __name__ == "__main__":
    # Sanity Check / Unit Test
    engine = CPCIEngine()
    
    # Test Data: "Student" Profile (High Frequency Transit/Food)
    weights = [
        {"category": "Shelter", "theta": 0.45, "velocity": 12},      # Monthly rent
        {"category": "Food", "theta": 0.20, "velocity": 150},        # 3x/day meals? or items? let's say 150 visits/items
        {"category": "Transit", "theta": 0.15, "velocity": 600},     # 2x/day bus
        {"category": "Tuition", "theta": 0.10, "velocity": 2},       # Semester
        {"category": "Other", "theta": 0.10, "velocity": 50},
    ]
    
    inflation = [
        {"category": "Shelter", "price_relative": 1.05, "is_shrinkflation": False, "shrink_penalty": 0.0},
        {"category": "Food", "price_relative": 1.08, "is_shrinkflation": True, "shrink_penalty": 0.04}, # Shrinkflation!
        {"category": "Transit", "price_relative": 1.10, "is_shrinkflation": False, "shrink_penalty": 0.0}, # Fare hike
        {"category": "Tuition", "price_relative": 1.03, "is_shrinkflation": False, "shrink_penalty": 0.0},
        {"category": "Other", "price_relative": 1.02, "is_shrinkflation": False, "shrink_penalty": 0.0},
    ]
    
    result = engine.calculate_cpci(weights, inflation, regional_elasticity=1.0)
    print("CPCI Calculation Result:")
    print(result)
