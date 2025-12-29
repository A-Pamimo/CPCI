
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

The CPCI utilizes a **stochastic behavioral model** grounded in recent econometric literature (ECB, NBER). It rejects the "Representative Agent" hypothesis in favor of a frequency-weighted perception model.

### 1. The Perceived Cost Index ($CPCI_t$)
The index is calculated using a **Frequency-Weighted** aggregation model with a **Shrinkflation Utility Penalty**:

$$CPCI_{t} = \sum_{i} \left[ \left( \alpha \phi_i + (1-\alpha)\theta_i \right) \cdot (1 + \lambda \mathbb{I}_{shrink}) \cdot \frac{P_{i,t}}{P_{i,t-1}} \right] \cdot M_{loc}$$

*   **$\alpha \approx 0.44$ (Frequency Bias Parameter)**: Derived from *Georganas, Healy, and Li (2014)*. Captures the cognitive overweighting of high-frequency purchases (e.g., fuel, milk).
*   **$\lambda$ (Utility Discontinuity)**: A penalty parameter applied when unit-volumes decrease ("Shrinkflation"), correcting for the cognitive search cost and utility loss not captured by standard unit-value adjustments (*Rojas et al., 2024*).
*   **$M_{loc}$ (Regional Friction)**: A spatial multiplier derived from **Housing Supply Elasticity** constraints (*Glaeser & Gyourko*), rather than simple population density.

### 2. Stochastic Policy Inference
Unlike deterministic models, the CPCI uses a probabilistic "Friction Cliff" forecaster to estimate the tipping point where "Felt Inflation" triggers systemic wage-price spirals.

## 🐍 Python Econometric Engine (`backend/`)

While the interface is built in React for accessibility, the core econometric modeling is isolated in a rigorous **Python** environment for academic auditing.

*   `backend/econometrics.py`: The core logic engine implementing the validated $CPCI_t$ formula.
*   `backend/main.py`: A **FastAPI** interface exposing the model for real-time analysis.

Run the engine locally:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

## 🛡 Verifiable Data Provenance
To ensure institutional trust, the platform implements:

1.  **Identity Vault**: Data commits are gated by a Zero-Trust identity handshake.
2.  **Audit Ledger**: Immutable record of shrinkflation audits.
3.  **Academic Grounding**: All methodologies are cited against peer-reviewed literature (ECB Working Papers, NBER).

## 📊 Technical Stack

- **Frontend**: React 19 / Tailwind CSS
- **Visualization**: Recharts Financial Suite
- **Intelligence**: Google Gemini API (Grounding & Heuristic Inference)
- **Data Persistence**: Content-Addressable Distributed Storage (Simulated)

---
*Disclaimer: CPCI is an independent econometric infrastructure. It serves as a verifiable mirror to official government reporting for educational, academic, and institutional analysis.*
