
export enum Archetype {
  STUDENT = 'Low-Asset / Academic',
  SENIOR = 'Fixed-Income / Pensioner',
  YOUNG_FAMILY = 'Multi-Person / High-Liability',
  COMMUTER = 'Transport-Dependent / Transit-Urban',
  AVERAGE = 'National Composite'
}

export enum Province {
  BC = 'British Columbia',
  AB = 'Alberta',
  SK = 'Saskatchewan',
  MB = 'Manitoba',
  ON = 'Ontario',
  QC = 'Quebec',
  NS = 'Nova Scotia',
  NATIONAL = 'National Composite'
}

export enum AuditStatus {
  PENDING = 'PENDING_REVIEW',
  VERIFIED = 'VERIFIED_CONSENSUS',
  REJECTED = 'AUDIT_FAILED'
}

export enum UserRole {
  OBSERVER = 'OBSERVER',
  ANALYST = 'CREDENTIALED_ANALYST',
  AUDITOR = 'SENIOR_AUDITOR'
}

export enum SignificanceLevel {
  OPTIMAL = 'OPTIMAL_STABILITY',
  MODERATE = 'ELEVATED_FRICTION',
  HIGH = 'SIGNIFICANT_STRESS',
  CRITICAL = 'SYSTEMIC_DANGER'
}

export interface AuditLogEntry {
  timestamp: string;
  actorId: string;
  action: string;
  details: string;
  checksum: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
}

export interface UserIdentity {
  id: string;
  name: string;
  role: UserRole;
  institution: string;
  authorizedAt: string;
  mfaEnabled: boolean;
  status: 'ACTIVE' | 'REVOKED' | 'PENDING';
}

export interface PricePoint {
  month: string;
  cpi: number;
  cpci: number;
  frictionCoefficient: number;
  interestShadow: number;
  sourceRef?: string;
}

export interface Product {
  id: string;
  name: string;
  retailer: string;
  category: string;
  oldSize: number;
  newSize: number;
  unit: string;
  price: number;
  lastChanged: string;
  isVarianceDetected: boolean;
  technicalNote?: string;
  status: AuditStatus;
  signatures: string[];
  contentHash: string;
  sourceProof?: string; // Link to receipt, news report, or community audit
}

export interface Weighting {
  category: string;
  weight: number;
  velocityFactor: number;
  inelasticity: number;
  basis?: string; // Reference to SHS or other study
}
