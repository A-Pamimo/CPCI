
import numpy as np
import pandas as pd
from typing import List, Dict, Optional
from datetime import datetime

class AcademicCPCI:
    """
    The Perceived Cost Index (CPCI) - Academic Synthesis Implementation (v2.0).
    
    Source of Truth: 'The Perceived Cost Index: Behavioral Macroeconomics...' (Oct 26, 2023)
    
    Governing Equation (Part V):
    CPCI_t = Sum [ (alpha * phi_i + (1-alpha) * theta_i) * (1 + lambda * I_shrink) * (P_t / P_t-1) ] * M_loc
    """
    
    # --- CONSTANTS FROM LITERATURE ---
    
    # 1. Frequency Bias Parameter (alpha)
    # Source: Georganas, Healy, and Li (2014)
    # "Consumers place roughly 44% weight on frequency-based aggregation."
    ALPHA_DEFAULT = 0.44
    
    # 2. Shrinkflation Utility Discontinuity (lambda)
    # Source: Rojas, Jaenicke, and Page (2024)
    # "Missing up to 3.9 percentage points of welfare loss."
    # We calibrate lambda such that a standard shrink event (~10%) reflects a ~4% utility penalty.
    LAMBDA_ROJAS = 0.39 # Calibrated coeff
    
    def __init__(self, alpha: float = ALPHA_DEFAULT):
        self.alpha = alpha

    def compute_index(self, 
                      basket: pd.DataFrame, 
                      regional_elasticity: float = 1.0) -> Dict:
        """
        Computes the CPCI for a single time period.
        
        Args:
            basket (pd.DataFrame): Must contain:
                - 'price_current' (P_t)
                - 'price_ref' (P_t-1)
                - 'weight_expenditure' (theta)
                - 'frequency_annual' (derived phi)
                - 'is_shrinkflation' (bool)
            regional_elasticity (float): M_loc (Housing Supply Elasticity Multiplier)
        """
        df = basket.copy()
        
        # 1. Calculate Price Relative (P_t / P_t-1)
        df['price_relative'] = df['price_current'] / df['price_ref']
        
        # 2. Calculate Frequency Weight (phi)
        # Phi is the "Purchase Frequency Weight". We normalize frequency share.
        total_freq = df['frequency_annual'].sum()
        df['phi'] = df['frequency_annual'] / total_freq
        
        # 3. Calculate Composite Weight (W_i)
        # alpha * phi + (1-alpha) * theta
        df['composite_weight'] = (self.alpha * df['phi']) + ((1 - self.alpha) * df['weight_expenditure'])
        
        # Normalize weights to sum to 1.0 (Standard Index Axiom)
        w_sum = df['composite_weight'].sum()
        df['w_normalized'] = df['composite_weight'] / w_sum
        
        # 4. Calculate Shrinkflation Penalty (1 + lambda * I)
        # If shrinkflation detected, apply utility discontinuity penalty
        df['shrink_multiplier'] = 1.0
        mask_shrink = df['is_shrinkflation'] == True
        df.loc[mask_shrink, 'shrink_multiplier'] = 1.0 + self.LAMBDA_ROJAS
        
        # 5. Aggregation
        # Contribution = Weight * ShrinkPenalty * PriceRelative
        df['contribution'] = df['w_normalized'] * df['shrink_multiplier'] * df['price_relative']
        
        raw_index = df['contribution'].sum()
        
        # 6. Apply Regional Friction (M_loc)
        final_index = raw_index * regional_elasticity
        
        return {
            "cpci": round(final_index * 100, 2), # Base 100
            "alpha_used": self.alpha,
            "regional_multiplier": regional_elasticity,
            "basket_analysis": df[['phi', 'weight_expenditure', 'w_normalized', 'shrink_multiplier', 'contribution']].to_dict(orient='records')
        }

    @staticmethod
    def glaeser_elasticity_map() -> Dict[str, float]:
        """
        Returns M_loc multipliers based on Glaeser et al. Housing Supply Elasticity.
        Inelastic markets (SF, Vancouver) have high multipliers.
        """
        return {
            "GLOBAL_AVG": 1.0,
            "HIGH_ELASTICITY_CITY": 0.95, # e.g. Houston (Sprawl allowed)
            "LOW_ELASTICITY_CITY": 1.35,  # e.g. Vancouver/NYC (Zoning constrained)
        }

# Alias for backward compatibility with main.py
CPCIEngine = AcademicCPCI
