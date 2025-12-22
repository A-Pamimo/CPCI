
// Fix: Import HISTORICAL_DATA from constants and Weighting/Archetype from types
import { HISTORICAL_DATA } from '../constants';
import { Archetype, Weighting } from '../types';

/**
 * Local Heuristic Engine for CPCI Profile Inference
 * Maps user keywords to econometric factors without calling an API.
 */
export const inferProfileFromDescription = (description: string): any[] => {
  const desc = description.toLowerCase();
  
  // Default base weights
  let weights = [
    { category: 'Shelter / Primary', weight: 30, velocityFactor: 12, inelasticity: 0.9 },
    { category: 'Nutritional Basket', weight: 20, velocityFactor: 52, inelasticity: 0.8 },
    { category: 'Transportation', weight: 15, velocityFactor: 48, inelasticity: 0.7 },
    { category: 'Energy & Utilities', weight: 15, velocityFactor: 12, inelasticity: 0.95 },
    { category: 'Discretionary', weight: 20, velocityFactor: 24, inelasticity: 0.4 }
  ];

  // Heuristic adjustments
  if (desc.includes('rent') || desc.includes('apartment') || desc.includes('downtown')) {
    weights[0].weight += 15;
    weights[0].inelasticity = 0.98;
    weights[4].weight -= 15;
  }
  if (desc.includes('car') || desc.includes('commute') || desc.includes('gas') || desc.includes('drive')) {
    weights[2].weight += 10;
    weights[2].velocityFactor = 104; // Weekly fuel
    weights[2].inelasticity = 0.9;
    weights[4].weight -= 10;
  }
  if (desc.includes('kids') || desc.includes('family') || desc.includes('children')) {
    weights[1].weight += 10;
    weights[1].velocityFactor = 150; // High frequency groceries
    weights[3].weight += 5;
    weights[4].weight -= 15;
  }
  if (desc.includes('student') || desc.includes('university') || desc.includes('tuition')) {
    weights[0].weight += 10;
    weights[2].category = 'Transit / Urban Mobility';
    weights[2].velocityFactor = 250; // Daily transit
  }

  // Normalize to 100
  const total = weights.reduce((acc, w) => acc + w.weight, 0);
  return weights.map(w => ({ ...w, weight: Math.round((w.weight / total) * 100) }));
};

/**
 * Local Predictive Divergence Model
 * Calculates the 'Friction Cliff' using historical trend acceleration.
 */
export const calculateFrictionCliff = (historicalData: any[]): string => {
  const latest = historicalData[historicalData.length - 1];
  const previous = historicalData[historicalData.length - 2];
  
  const currentDelta = latest.cpci - latest.cpi;
  const prevDelta = previous.cpci - previous.cpi;
  const acceleration = currentDelta - prevDelta;
  
  if (acceleration > 0) {
    const monthsToCliff = Math.max(1, Math.round((10 - latest.cpci) / (acceleration || 0.1)));
    return `Systemic Divergence detected. At current acceleration (+${acceleration.toFixed(2)}% MoM), a localized Friction Cliff is projected in ${monthsToCliff} months.`;
  } else {
    return "Divergence is currently plateauing. Market friction remains elevated but non-accelerating.";
  }
};
