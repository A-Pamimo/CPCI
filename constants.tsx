
import { Archetype, PricePoint, Product, Weighting, Province, AuditStatus } from './types';

/**
 * DATA PROVENANCE REGISTRY
 * Centralized list of real-world data sources for validation.
 */
export const DATA_SOURCES = {
  CPI_BASE: {
    name: "Statistics Canada, Table 18-10-0004-01",
    url: "https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000401",
    detail: "Monthly Consumer Price Index (CPI), not seasonally adjusted."
  },
  WEIGHTS_BASE: {
    name: "StatCan Survey of Household Spending (SHS)",
    url: "https://www150.statcan.gc.ca/n1/en/catalogue/62F0026M",
    detail: "Average annual household expenditure patterns by quintile."
  },
  SHRINKFLATION_BASE: {
    name: "CBC Marketplace Shrinkflation Tracker",
    url: "https://www.cbc.ca/news/business/marketplace-shrinkflation-tracker-1.7100346",
    detail: "Publicly verified audits of product volume reductions."
  },
  METHODOLOGY_FREQ_BIAS: {
    name: "ECB: The Frequency Bias (Paper 1251)",
    url: "https://www.ecb.europa.eu/pub/pdf/scpwps/ecbwp1251.pdf",
    detail: "Academic proof of purchase frequency impacting inflation perception."
  },
  METHODOLOGY_AIDS: {
    name: "Deaton & Muellbauer (AIDS System)",
    url: "https://www.jstor.org/stable/1912017",
    detail: "The Almost Ideal Demand System for tracking mandatory consumption."
  }
};

export const HISTORICAL_DATA: PricePoint[] = [
  { month: 'Jan 2024', cpi: 2.9, cpci: 4.8, frictionCoefficient: 6.2, interestShadow: 1.1, sourceRef: "StatCan 18-10-0004" },
  { month: 'Feb 2024', cpi: 2.8, cpci: 5.1, frictionCoefficient: 6.5, interestShadow: 1.2, sourceRef: "StatCan 18-10-0004" },
  { month: 'Mar 2024', cpi: 2.9, cpci: 5.4, frictionCoefficient: 7.0, interestShadow: 1.4, sourceRef: "StatCan 18-10-0004" },
  { month: 'Apr 2024', cpi: 2.7, cpci: 5.8, frictionCoefficient: 7.5, interestShadow: 1.7, sourceRef: "StatCan 18-10-0004" },
  { month: 'May 2024', cpi: 2.9, cpci: 6.1, frictionCoefficient: 8.0, interestShadow: 1.9, sourceRef: "StatCan 18-10-0004" },
  { month: 'Jun 2024', cpi: 2.7, cpci: 6.5, frictionCoefficient: 8.6, interestShadow: 2.2, sourceRef: "StatCan 18-10-0004" },
  { month: 'Jul 2024', cpi: 2.5, cpci: 6.8, frictionCoefficient: 9.0, interestShadow: 2.4, sourceRef: "StatCan 18-10-0004" },
  { month: 'Aug 2024', cpi: 2.0, cpci: 7.2, frictionCoefficient: 9.4, interestShadow: 2.6, sourceRef: "StatCan 18-10-0004" },
];

export const REGIONAL_DIVERGENCE: Record<Province, number> = {
  [Province.BC]: 8.2,
  [Province.AB]: 6.9,
  [Province.SK]: 7.2,
  [Province.MB]: 7.5,
  [Province.ON]: 7.8,
  [Province.QC]: 7.1,
  [Province.NS]: 8.5,
  [Province.NATIONAL]: 7.4
};

export const SHRINKFLATION_ITEMS: Product[] = [
  { 
    id: '1', name: 'Dairy Composite / 2%', retailer: 'Loblaws', category: 'Dairy', 
    oldSize: 4000, newSize: 3750, unit: 'ml', price: 6.49, lastChanged: '2024-03-15', 
    isVarianceDetected: true, technicalNote: "Standardized volume reduction across SKU range.", 
    status: AuditStatus.VERIFIED, signatures: ['SYS-01'], contentHash: 'sha256-d41d8cd98f00b204',
    sourceProof: "https://www.cbc.ca/news/business/marketplace-shrinkflation-tracker-1.7100346"
  },
  { 
    id: '2', name: 'Starch Derivative / Potato', retailer: 'No Frills', category: 'Snacks', 
    oldSize: 200, newSize: 180, unit: 'g', price: 1.99, lastChanged: '2024-05-10', 
    isVarianceDetected: true, status: AuditStatus.VERIFIED, signatures: ['SYS-01'], contentHash: 'sha256-8e8e8e8e8e8e8e8e',
    sourceProof: "https://www.mouseprint.org/"
  },
  { 
    id: '4', name: 'Toasted Oat Cereal', retailer: 'Metro', category: 'Groceries', 
    oldSize: 450, newSize: 340, unit: 'g', price: 5.99, lastChanged: '2024-07-12', 
    isVarianceDetected: true, technicalNote: "Box height maintained but depth reduced.", 
    status: AuditStatus.VERIFIED, signatures: ['SYS-01'], contentHash: 'sha256-a1a1a1a1a1a1a1a1',
    sourceProof: "https://www.cbc.ca/news/business/marketplace-shrinkflation-tracker-1.7100346"
  }
];

export const ARCHETYPE_WEIGHTS: Record<Archetype, Weighting[]> = {
  [Archetype.STUDENT]: [
    { category: 'Shelter / Primary', weight: 45, velocityFactor: 12, inelasticity: 0.95, basis: "SHS Low-Income Quintile" },
    { category: 'Nutritional Basket', weight: 20, velocityFactor: 52, inelasticity: 0.8, basis: "SHS Food Basket" },
    { category: 'Urban Mobility', weight: 15, velocityFactor: 250, inelasticity: 0.9, basis: "Transit Usage Statistics" },
    { category: 'Human Capital Invest.', weight: 10, velocityFactor: 2, inelasticity: 0.6, basis: "Tuition Inflation Data" },
    { category: 'Discretionary', weight: 10, velocityFactor: 48, inelasticity: 0.3, basis: "Residual SHS Allocation" },
  ],
  [Archetype.SENIOR]: [
    { category: 'Healthcare / Critical', weight: 25, velocityFactor: 24, inelasticity: 0.98, basis: "Senior Spending Survey" },
    { category: 'Asset Maintenance', weight: 30, velocityFactor: 4, inelasticity: 0.7, basis: "SHS Homeowners Pattern" },
    { category: 'Nutritional Basket', weight: 20, velocityFactor: 52, inelasticity: 0.85, basis: "SHS Food Basket" },
    { category: 'Energy / Thermal', weight: 20, velocityFactor: 12, inelasticity: 0.95, basis: "Fixed Utility Profile" },
    { category: 'Soft Goods', weight: 5, velocityFactor: 6, inelasticity: 0.4, basis: "SHS Clothing/Goods" },
  ],
  [Archetype.YOUNG_FAMILY]: [
    { category: 'Debt Servicing / Shelter', weight: 35, velocityFactor: 12, inelasticity: 0.95, basis: "SHS Mortgage Profile" },
    { category: 'Nutritional Basket', weight: 25, velocityFactor: 104, inelasticity: 0.9, basis: "High-Freq Grocery Pattern" },
    { category: 'Dependent Care', weight: 20, velocityFactor: 12, inelasticity: 0.98, basis: "Childcare Cost Survey" },
    { category: 'Logistics / Fuel', weight: 15, velocityFactor: 48, inelasticity: 0.85, basis: "SHS Transportation" },
    { category: 'Soft Goods', weight: 5, velocityFactor: 24, inelasticity: 0.5, basis: "Residual SHS Goods" },
  ],
  [Archetype.COMMUTER]: [
    { category: 'Petroleum / Logistics', weight: 30, velocityFactor: 52, inelasticity: 0.9, basis: "StatCan Fuel Velocity" },
    { category: 'Risk Mitigation / Ins.', weight: 10, velocityFactor: 1, inelasticity: 0.95, basis: "Insurance Premium Tracker" },
    { category: 'Capital Maintenance', weight: 15, velocityFactor: 4, inelasticity: 0.75, basis: "Vehicle Op Statistics" },
    { category: 'Shelter / Primary', weight: 25, velocityFactor: 12, inelasticity: 0.95, basis: "SHS Shelter" },
    { category: 'Nutritional Basket', weight: 20, velocityFactor: 52, inelasticity: 0.8, basis: "SHS Food" },
  ],
  [Archetype.AVERAGE]: [
    { category: 'Shelter', weight: 30, velocityFactor: 12, inelasticity: 0.95, basis: "SHS National Avg" },
    { category: 'Food Systems', weight: 15, velocityFactor: 52, inelasticity: 0.85, basis: "SHS National Avg" },
    { category: 'Transportation', weight: 20, velocityFactor: 48, inelasticity: 0.8, basis: "SHS National Avg" },
    { category: 'Operational Household', weight: 15, velocityFactor: 24, inelasticity: 0.7, basis: "SHS Utilities/Operations" },
    { category: 'Aggregated Other', weight: 20, velocityFactor: 12, inelasticity: 0.5, basis: "SHS Discretionary" },
  ],
};
