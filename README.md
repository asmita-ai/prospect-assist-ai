# 🏦 Prospect Assist AI
### IDBI Innovate 2026 — Problem Statement 2: Prospect Assist AI

AI-driven lead intelligence for IDBI Bank's retail lending business. Instead of relying on
traditional, self-reported metrics, Prospect Assist AI mines **transaction and behavioral
signals** to (1) estimate a prospect's *true* repayment capacity, independent of declared
income, and (2) rank prospects by genuine, data-backed conversion likelihood — for Personal,
Home, Mortgage, and Auto Loans.

## Why this matters

> Bank's retail lending relies on traditional metrics, resulting in low conversions and
> limited insight into customer intent. **Expected outcome:** >30% conversion rate on
> generated leads, plus accurate income assessment for prudent underwriting.

Declared income on a loan form is self-reported, easy to inflate, and blind to a customer's
actual cash-flow behavior. Prospect Assist AI instead scores every customer directly from
their bank relationship — salary credit regularity, UPI activity, savings growth, existing
EMI load, bounce history, spend category mix — to produce a defensible, auditable estimate
of repayment capacity and lead quality.

## What's in this repo

```
prospect-assist-ai/
├── data/
│   └── generate_synthetic_data.py   # synthetic banking dataset (2,500 customers)
├── src/
│   └── train_models.py              # trains 3 models + saves metrics
├── models/                          # trained models + scored dataset (generated)
├── app/
│   └── dashboard.py                 # Streamlit RM-facing dashboard
├── requirements.txt
└── README.md
```

## The three AI components

1. **Income Estimator** (XGBoost Regression)
   Predicts true monthly income from 25 behavioral/transactional features — *without* using
   declared income as an input. On held-out data it is **~62% more accurate than trusting
   declared income outright** (MAE ₹5,789 vs ₹15,066), explaining ~94.5% of income variance (R²).

2. **Lead Scorer** (XGBoost Classification)
   Outputs a 0–1 probability that a prospect is a genuine, convertible, creditworthy lead,
   combining repayment capacity, salary regularity, credit bureau score, recent intent
   signals (e.g. property/dealer-related transactions), and existing debt burden.
   Tuned to flag leads with a **55% actual conversion rate** — well above the 30% target —
   while still surfacing a large, actionable pipeline (~45% of the base).

3. **Product Recommender** (XGBoost multi-class)
   Matches each lead to Personal / Home / Auto / Mortgage Loan based on behavioral fit
   (e.g. recurring property-related transfers → Home Loan prospect; high income + large
   savings → Mortgage; recent auto-dealer transaction → Auto Loan). ~99% test accuracy on
   synthetic labels.

Every prediction is explainable via SHAP-style per-feature contributions, shown directly
in the dashboard — critical for underwriting transparency and RBI/audit compliance.

## Running it locally

```bash
pip install -r requirements.txt
python data/generate_synthetic_data.py   # generates data/customers.csv
python src/train_models.py               # trains models, writes models/*.joblib + metrics.json
streamlit run app/dashboard.py           # launches the RM dashboard
```

## Deploying (for submission link)

The fastest free path for a hackathon demo:
1. Push this repo to GitHub (public).
2. Go to [share.streamlit.io](https://share.streamlit.io) → "New app" → point at this repo,
   branch `main`, file `app/dashboard.py`.
3. Streamlit Cloud installs `requirements.txt` and gives you a public `*.streamlit.app` URL —
   use that as your "Final Product Link".

(In a real IDBI Bank sandbox deployment, this would instead run as a containerized service
on AWS — see Architecture below — reading from the bank's sandbox APIs instead of the
synthetic CSV.)

## Architecture (production vision)

```
Core Banking / UPI Switch / Bureau Feed  (IDBI sandbox APIs)
              │
              ▼
   AWS Kinesis / Glue ETL  →  Feature Store (SageMaker Feature Store / Redshift)
              │
              ▼
  ┌───────────────────────────────┐
  │  Model Layer (SageMaker)      │
  │  • Income Estimator            │
  │  • Lead Scorer                 │
  │  • Product Recommender         │
  │  • SHAP Explainability service │
  └───────────────────────────────┘
              │
              ▼
   FastAPI Inference Layer (on AWS Lambda / ECS Fargate)
              │
              ▼
  RM Dashboard (Streamlit/React) ── CRM / Lead-Management System integration
              │
              ▼
   Feedback loop: RM outcome (converted / not) → retraining pipeline (SageMaker Pipelines)
```

## Data & privacy note

All data in this prototype is **synthetically generated** (`data/generate_synthetic_data.py`,
seeded, reproducible) — no real customer data is used. In production, this pipeline is
designed to run entirely within IDBI Bank's sandbox, on IDBI-provided synthetic/anonymized
datasets, under the bank's data-governance and RBI compliance controls.

## Team

- Team name: _[fill in]_
- Team leader: _[fill in]_
- Problem Statement: 2 — Prospect Assist AI
