"""
Prospect Assist AI - Synthetic Banking Data Generator
------------------------------------------------------
Simulates 6 months of transaction/behavioral data for retail banking
customers, mimicking patterns IDBI Bank's sandbox synthetic datasets
would provide (salary credits, UPI activity, EMIs, bill payments,
savings behavior). This lets the model + dashboard be demoed end-to-end
without needing real customer data.

Output: data/customers.csv  (one row per customer, with engineered
behavioral fields ready for feature engineering + labels for training)
"""

import numpy as np
import pandas as pd

rng = np.random.default_rng(42)
N = 2500

cities = ["Mumbai", "Pune", "Bengaluru", "Delhi", "Hyderabad", "Ahmedabad",
          "Chennai", "Kolkata", "Lucknow", "Jaipur", "Indore", "Surat"]
employment_types = ["Salaried-Private", "Salaried-Govt", "Self-Employed", "Business Owner"]
occupation_weights = [0.45, 0.15, 0.25, 0.15]

def clip(x, lo, hi):
    return np.clip(x, lo, hi)

# ---- Base demographics ----
age = rng.integers(23, 58, N)
city = rng.choice(cities, N)
employment_type = rng.choice(employment_types, N, p=occupation_weights)
tenure_at_bank_months = rng.integers(3, 180, N)
existing_customer = rng.choice([0, 1], N, p=[0.35, 0.65])

# ---- True (latent) income - this is what we are trying to *infer* from
# behavior, so it is intentionally NOT given directly as a feature ----
base_income = np.where(
    employment_type == "Salaried-Govt", rng.normal(55000, 12000, N),
    np.where(employment_type == "Salaried-Private", rng.normal(62000, 28000, N),
    np.where(employment_type == "Self-Employed", rng.normal(58000, 35000, N),
             rng.normal(90000, 60000, N)))
)
true_monthly_income = clip(base_income, 15000, 500000)

# Declared income on the loan application (often inflated, sometimes deflated
# for self-employed hiding true earnings) - this is the "traditional metric"
declared_income = true_monthly_income * rng.normal(1.0, 0.28, N)
declared_income = np.where(
    employment_type == "Self-Employed",
    declared_income * rng.normal(0.75, 0.15, N),  # under-declared for tax reasons
    declared_income
)
declared_income = clip(declared_income, 10000, 800000)

# ---- Behavioral / transactional signals derived from true income ----
# Salary credit regularity (salaried employees have very regular credits)
is_salaried = np.isin(employment_type, ["Salaried-Private", "Salaried-Govt"])
salary_credit_regularity = np.where(
    is_salaried, clip(rng.normal(0.93, 0.06, N), 0.4, 1.0),
    clip(rng.normal(0.55, 0.22, N), 0.05, 1.0)
)

avg_monthly_credits = true_monthly_income * rng.normal(1.05, 0.15, N)
avg_monthly_debits = avg_monthly_credits * clip(rng.normal(0.72, 0.18, N), 0.3, 1.15)
monthly_surplus = avg_monthly_credits - avg_monthly_debits

avg_savings_balance = clip(true_monthly_income * rng.normal(1.8, 1.5, N), 500, None)
savings_growth_rate_3m = clip(rng.normal(0.04, 0.08, N), -0.3, 0.6)  # % growth in balance

upi_txn_count_monthly = rng.poisson(clip(true_monthly_income / 3500, 5, 200), N)
upi_avg_ticket_size = clip(rng.normal(650, 500, N), 50, 8000)

# Existing obligations
has_existing_loan = rng.choice([0, 1], N, p=[0.55, 0.45])
existing_emi_amount = np.where(
    has_existing_loan == 1,
    clip(true_monthly_income * rng.uniform(0.05, 0.35, N), 500, None),
    0.0
)
existing_dti = existing_emi_amount / (true_monthly_income + 1)

bounce_count_6m = rng.poisson(clip(0.6 - salary_credit_regularity, 0.02, 1.5) * 3, N)
credit_bureau_score = clip(
    rng.normal(700, 90, N) - bounce_count_6m * 15 + salary_credit_regularity * 30,
    300, 900
).astype(int)

# Category-wise spend shares (must roughly sum to <=1 of debits)
rent_share = clip(rng.normal(0.18, 0.12, N), 0, 0.55)
auto_fuel_ev_share = clip(rng.normal(0.06, 0.06, N), 0, 0.3)
education_share = clip(rng.normal(0.04, 0.07, N), 0, 0.4)
healthcare_share = clip(rng.normal(0.03, 0.04, N), 0, 0.25)
discretionary_share = clip(1 - rent_share - auto_fuel_ev_share - education_share
                            - healthcare_share - existing_dti, 0.05, 0.9)

# Digital engagement (app logins, bill-pay autopay setups etc.)
mobile_app_logins_monthly = rng.poisson(clip(8 + salary_credit_regularity * 15, 1, 60), N)
autopay_mandates_active = rng.poisson(clip(salary_credit_regularity * 3, 0, 6), N)

# Recent large-ticket / big-purchase search-like behavior (proxy for intent,
# e.g., recurring transfers to a builder/dealer, EMI-shaped recent SIPs, etc.)
recent_large_txn_flag = rng.choice([0, 1], N, p=[0.82, 0.18])
recent_property_related_txn = rng.choice([0, 1], N, p=[0.90, 0.10])
recent_auto_dealer_txn = rng.choice([0, 1], N, p=[0.93, 0.07])

# ---- Repayment capacity (ground truth-ish, used to build labels) ----
disposable_income = clip(true_monthly_income - existing_emi_amount - (rent_share * true_monthly_income), 0, None)
repayment_capacity_ratio = disposable_income / (true_monthly_income + 1)

# ---- Conversion label: genuine, quantifiable, data-driven ----
# A prospect is a "high-quality lead" if they show real repayment capacity,
# healthy behavior, AND at least one intent signal - not just declared income.
intent_signal = (recent_large_txn_flag | recent_property_related_txn | recent_auto_dealer_txn).astype(int)

lead_score_raw = (
    0.30 * (repayment_capacity_ratio) +
    0.20 * (salary_credit_regularity) +
    0.15 * (credit_bureau_score - 300) / 600 +
    0.15 * intent_signal +
    0.10 * clip(savings_growth_rate_3m, -0.3, 0.6) +
    0.10 * (1 - clip(existing_dti, 0, 1))
    - 0.25 * clip(bounce_count_6m / 6, 0, 1)
)
lead_score_raw = clip(lead_score_raw, 0, 1.3)
noise = rng.normal(0, 0.07, N)
converted = ((lead_score_raw + noise) > np.quantile(lead_score_raw + noise, 0.70)).astype(int)

# Recommended product hint (used to validate the recommender's rule/label alignment)
def pick_product(i):
    if recent_property_related_txn[i] == 1 and true_monthly_income[i] > 45000:
        return "Home Loan"
    if recent_auto_dealer_txn[i] == 1:
        return "Auto Loan"
    if true_monthly_income[i] > 120000 and avg_savings_balance[i] > 300000:
        return "Mortgage Loan"
    return "Personal Loan"

recommended_product_true = [pick_product(i) for i in range(N)]

df = pd.DataFrame({
    "customer_id": [f"CUST{100000+i}" for i in range(N)],
    "age": age,
    "city": city,
    "employment_type": employment_type,
    "tenure_at_bank_months": tenure_at_bank_months,
    "existing_customer": existing_customer,
    "declared_income": declared_income.round(0),
    "true_monthly_income": true_monthly_income.round(0),  # kept for training/eval only
    "avg_monthly_credits": avg_monthly_credits.round(0),
    "avg_monthly_debits": avg_monthly_debits.round(0),
    "monthly_surplus": monthly_surplus.round(0),
    "salary_credit_regularity": salary_credit_regularity.round(3),
    "avg_savings_balance": avg_savings_balance.round(0),
    "savings_growth_rate_3m": savings_growth_rate_3m.round(3),
    "upi_txn_count_monthly": upi_txn_count_monthly,
    "upi_avg_ticket_size": upi_avg_ticket_size.round(0),
    "has_existing_loan": has_existing_loan,
    "existing_emi_amount": existing_emi_amount.round(0),
    "existing_dti": existing_dti.round(3),
    "bounce_count_6m": bounce_count_6m,
    "credit_bureau_score": credit_bureau_score,
    "rent_share": rent_share.round(3),
    "auto_fuel_ev_share": auto_fuel_ev_share.round(3),
    "education_share": education_share.round(3),
    "healthcare_share": healthcare_share.round(3),
    "discretionary_share": discretionary_share.round(3),
    "mobile_app_logins_monthly": mobile_app_logins_monthly,
    "autopay_mandates_active": autopay_mandates_active,
    "recent_large_txn_flag": recent_large_txn_flag,
    "recent_property_related_txn": recent_property_related_txn,
    "recent_auto_dealer_txn": recent_auto_dealer_txn,
    "repayment_capacity_ratio": repayment_capacity_ratio.round(3),
    "converted": converted,
    "recommended_product_true": recommended_product_true,
})

df.to_csv("/home/claude/prospect-assist-ai/data/customers.csv", index=False)
print("Generated", len(df), "synthetic customer records")
print(df["converted"].value_counts(normalize=True))
print(df["recommended_product_true"].value_counts())
