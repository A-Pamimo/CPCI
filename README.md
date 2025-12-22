
# CPCI Infrastructure: Canadian Perceived Cost Index (v3.1)

**High-Concurrency Econometric Analysis & Deterministic Policy Monitoring.**

The Canadian Perceived Cost Index (CPCI) Infrastructure is a distributed analytical engine designed for total transparency in cost-of-living metrics. It bridges the gap between official macroeconomic reports (CPI) and the microeconomic friction of Canadian households through a verifiable, identity-gated consensus framework.

## 🏛 Framework Overview

The infrastructure is built to reconcile "Headline Inflation" with "Perceived Friction"—the actual economic stress experienced at the household level.

- **00 National Pulse Snapshot**: A real-time executive dashboard synthesizing national divergence trends, regional stress heatmaps, and active shrinkflation audits.
- **01 Macro Analysis**: Longitudinal reporting of composite indices vs. StatCan 18-10-0004-01 baselines.
- **02 Impact Modeler**: Archetypal assessment engine that applies frequency-weighted baskets to specific lifestyle profiles (Student, Senior, Young Family).
- **03 Volume Registry**: A peer-verified ledger for tracking "Hidden Inflation" (Shrinkflation) through unit-relative valuation.

## 📐 Governing Mathematical Models

The CPCI is not a subjective metric; it is grounded in deterministic mathematical frameworks detailed in **Section 07: Technical Notes**.

### 1. The Primary CPCI Equation
The index is calculated by summing price relatives across $k$ categories, adjusted by velocity and inelasticity coefficients:
`CPCI_t = Σ [ (P_kt / P_k0) × W_k × (V_k / 10) × E_k ] + S_t + ML_adj`

### 2. Regional Variance Modeling (R_c)
Regional stress is derived through a jurisdictional variance coefficient:
`R_c = (Tax_p + Fuel_c + Util_r) × Density_i`
*   **Tax_p**: Provincial sales tax friction.
*   **Fuel_c**: Regional carbon adjustment coefficients.
*   **Util_r**: Regulatory utility pricing weight.
*   **Density_i**: Housing density inelasticity factor.

### 3. The "Friction Cliff" Forecaster
A non-linear trend extrapolation model that identifies the point of systemic breakage in household purchasing power by measuring the acceleration of the Divergence Spread.

## 🛡 Security & Compliance (SOC 2 Readiness)

To ensure institutional trust, the platform implements:

1.  **Identity Vault**: All data commits are gated by a Zero-Trust identity handshake (Peer IDs).
2.  **Audit Ledger**: An immutable, non-repudiable record of every system action, including actor ID and cryptographic checksums.
3.  **AI Grounding Engine**: Integration with Gemini 3 Pro/Flash for automated literature reviews and search-grounded academic verification of economic theories.

## 📊 Technical Stack

- **Frontend**: React 19 / Tailwind CSS
- **Visualization**: Recharts Financial Suite
- **Intelligence**: Google Gemini API (Grounding & Heuristic Inference)
- **Data Persistence**: Content-Addressable Distributed Storage (Simulated)

---
*Disclaimer: CPCI is an independent econometric infrastructure. It serves as a verifiable mirror to official government reporting for educational, academic, and institutional analysis.*
