"""
Prospect Assist AI - RM Dashboard
-----------------------------------
Streamlit app for IDBI Bank Relationship Managers to see AI-ranked,
explainable retail lending leads: predicted true income, repayment
capacity, conversion probability, and recommended loan product.

Run: streamlit run app/dashboard.py
"""
import json
import joblib
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

st.set_page_config(page_title="Prospect Assist AI | IDBI Innovate 2026",
                    page_icon="🏦", layout="wide")

MODEL_DIR = "/home/claude/prospect-assist-ai/models"
IDBI_TEAL = "#0d5c4e"
IDBI_ORANGE = "#e8732c"

# ---------------- Theming ----------------
st.markdown(f"""
<style>
    .stApp {{ background-color: #f7f9f8; }}
    .main-header {{
        background: linear-gradient(90deg, {IDBI_TEAL} 0%, {IDBI_ORANGE} 100%);
        padding: 1.4rem 2rem; border-radius: 10px; margin-bottom: 1.2rem;
    }}
    .main-header h1 {{ color: white; margin: 0; font-size: 1.8rem; }}
    .main-header p {{ color: #eaf3f0; margin: 0.2rem 0 0 0; font-size: 0.95rem; }}
    div[data-testid="stMetric"] {{
        background: white; padding: 0.9rem 1rem; border-radius: 10px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }}
</style>
""", unsafe_allow_html=True)

st.markdown("""
<div class="main-header">
  <h1>🏦 Prospect Assist AI</h1>
  <p>AI-driven lead intelligence for retail lending &nbsp;|&nbsp; IDBI Innovate 2026 — Problem Statement 2</p>
</div>
""", unsafe_allow_html=True)


@st.cache_data
def load_data():
    df = pd.read_csv(f"{MODEL_DIR}/scored_customers.csv")
    with open(f"{MODEL_DIR}/metrics.json") as f:
        metrics = json.load(f)
    return df, metrics


@st.cache_resource
def load_models():
    income_model = joblib.load(f"{MODEL_DIR}/income_model.joblib")
    lead_model = joblib.load(f"{MODEL_DIR}/lead_model.joblib")
    return income_model, lead_model


df, metrics = load_data()
income_model, lead_model = load_models()

with open(f"{MODEL_DIR}/feature_list.json") as f:
    FEATURES = json.load(f)

# ---------------- Sidebar filters ----------------
st.sidebar.header("🔎 Filter Leads")
product_filter = st.sidebar.multiselect(
    "Loan Product", options=sorted(df["predicted_product"].unique()),
    default=sorted(df["predicted_product"].unique())
)
city_filter = st.sidebar.multiselect(
    "City", options=sorted(df["city"].unique()), default=[]
)
min_income = st.sidebar.slider(
    "Min. AI-estimated monthly income (₹)", 0, 300000, 0, step=5000
)
only_high_quality = st.sidebar.checkbox("Show only high-quality leads", value=True)
min_score = st.sidebar.slider("Min. lead score", 0.0, 1.0, 0.0, 0.01)

filtered = df.copy()
if product_filter:
    filtered = filtered[filtered["predicted_product"].isin(product_filter)]
if city_filter:
    filtered = filtered[filtered["city"].isin(city_filter)]
filtered = filtered[filtered["predicted_income"] >= min_income]
filtered = filtered[filtered["lead_probability"] >= min_score]
if only_high_quality:
    filtered = filtered[filtered["is_high_quality_lead"] == 1]

# ---------------- KPI row ----------------
c1, c2, c3, c4, c5 = st.columns(5)
c1.metric("Total Prospects Scored", f"{len(df):,}")
c2.metric("High-Quality Leads Flagged", f"{int(df['is_high_quality_lead'].sum()):,}",
          f"{metrics['lead_scorer']['pct_flagged_as_leads']}% of base")
c3.metric("Conversion Rate (flagged leads)",
          f"{metrics['lead_scorer']['conversion_rate_among_flagged_leads_pct']}%",
          "target >30% ✅")
c4.metric("Income Estimation Accuracy",
          f"{100 - metrics['income_estimator']['mae_pct_of_mean_income']:.1f}%",
          f"{metrics['income_estimator']['improvement_over_declared_pct']}% better than declared income")
c5.metric("Model AUC (lead quality)", f"{metrics['lead_scorer']['auc']:.3f}")

st.markdown("<br>", unsafe_allow_html=True)

tab1, tab2, tab3 = st.tabs(["📋 Ranked Lead Queue", "🔍 Lead Deep-Dive", "📊 Portfolio Insights"])

# ============== TAB 1: Ranked Lead Queue ==============
with tab1:
    st.subheader(f"Ranked Prospects for RM Outreach ({len(filtered):,} matching filters)")
    show_cols = {
        "customer_id": "Customer ID",
        "city": "City",
        "employment_type": "Employment",
        "declared_income": "Declared Income (₹)",
        "predicted_income": "AI-Estimated Income (₹)",
        "repayment_capacity_ratio": "Repayment Capacity",
        "lead_probability": "Lead Score",
        "predicted_product": "Recommended Product",
        "credit_bureau_score": "Bureau Score",
    }
    display_df = filtered[list(show_cols.keys())].rename(columns=show_cols).sort_values(
        "Lead Score", ascending=False
    ).reset_index(drop=True)
    display_df.index = display_df.index + 1
    display_df["AI-Estimated Income (₹)"] = display_df["AI-Estimated Income (₹)"].round(0).astype(int)
    display_df["Declared Income (₹)"] = display_df["Declared Income (₹)"].round(0).astype(int)
    display_df["Lead Score"] = (display_df["Lead Score"] * 100).round(1).astype(str) + "%"
    display_df["Repayment Capacity"] = (display_df["Repayment Capacity"] * 100).round(1).astype(str) + "%"

    st.dataframe(display_df, use_container_width=True, height=480)
    st.download_button(
        "⬇️ Export lead list (CSV)",
        display_df.to_csv().encode("utf-8"),
        "prospect_assist_leads.csv", "text/csv"
    )

# ============== TAB 2: Lead Deep-Dive ==============
with tab2:
    st.subheader("Individual Lead Explainability")
    cust_id = st.selectbox("Select a Customer ID", filtered["customer_id"].tolist() if len(filtered) else df["customer_id"].tolist())
    row = df[df["customer_id"] == cust_id].iloc[0]

    colA, colB, colC = st.columns([1, 1, 1.3])
    with colA:
        st.metric("Declared Income", f"₹{row['declared_income']:,.0f}")
        st.metric("AI-Estimated True Income", f"₹{row['predicted_income']:,.0f}",
                   f"{(row['predicted_income']-row['declared_income'])/row['declared_income']*100:+.1f}% vs declared")
        st.metric("Repayment Capacity Ratio", f"{row['repayment_capacity_ratio']*100:.1f}%")
    with colB:
        st.metric("Lead Score (conversion probability)", f"{row['lead_probability']*100:.1f}%")
        st.metric("Recommended Product", row["predicted_product"])
        st.metric("Credit Bureau Score", f"{int(row['credit_bureau_score'])}")
    with colC:
        gauge = go.Figure(go.Indicator(
            mode="gauge+number", value=row["lead_probability"] * 100,
            title={"text": "Lead Quality Score"},
            gauge={"axis": {"range": [0, 100]},
                   "bar": {"color": IDBI_TEAL},
                   "steps": [{"range": [0, 40], "color": "#f6d5c4"},
                             {"range": [40, 70], "color": "#fbe8b5"},
                             {"range": [70, 100], "color": "#c9e8d8"}]}
        ))
        gauge.update_layout(height=260, margin=dict(t=40, b=10, l=20, r=20))
        st.plotly_chart(gauge, use_container_width=True)

    st.markdown("#### Why this score? (Feature contribution)")
    explainer_row = row[FEATURES].to_frame().T.astype(float)
    contrib = income_model.get_booster().predict(
        xgb_dmatrix := __import__("xgboost").DMatrix(explainer_row), pred_contribs=True
    )[0]
    contrib_df = pd.DataFrame({"feature": FEATURES + ["base_value"], "contribution": contrib})
    contrib_df = contrib_df[contrib_df["feature"] != "base_value"]
    contrib_df["abs"] = contrib_df["contribution"].abs()
    top_contrib = contrib_df.sort_values("abs", ascending=False).head(8).sort_values("contribution")

    fig = px.bar(top_contrib, x="contribution", y="feature", orientation="h",
                 color="contribution", color_continuous_scale=["#c0392b", "#1e8f6f"],
                 title="Top drivers of AI-estimated income (SHAP-style contribution, ₹)")
    fig.update_layout(height=380, showlegend=False, coloraxis_showscale=False)
    st.plotly_chart(fig, use_container_width=True)

# ============== TAB 3: Portfolio Insights ==============
with tab3:
    col1, col2 = st.columns(2)
    with col1:
        prod_counts = df[df["is_high_quality_lead"] == 1]["predicted_product"].value_counts().reset_index()
        prod_counts.columns = ["Product", "Leads"]
        fig1 = px.pie(prod_counts, names="Product", values="Leads", hole=0.5,
                      color_discrete_sequence=[IDBI_TEAL, IDBI_ORANGE, "#f2c14e", "#7fb3a3"],
                      title="High-Quality Leads by Recommended Product")
        st.plotly_chart(fig1, use_container_width=True)
    with col2:
        fig2 = px.scatter(df.sample(min(600, len(df)), random_state=1),
                          x="declared_income", y="predicted_income",
                          color="is_high_quality_lead",
                          color_discrete_map={0: "#c7c7c7", 1: IDBI_TEAL},
                          labels={"declared_income": "Declared Income (₹)",
                                  "predicted_income": "AI-Estimated Income (₹)",
                                  "is_high_quality_lead": "High-Quality Lead"},
                          title="Declared vs AI-Estimated Income (gap = underwriting risk/opportunity)")
        fig2.add_shape(type="line", x0=0, y0=0, x1=300000, y1=300000,
                        line=dict(color="gray", dash="dash"))
        st.plotly_chart(fig2, use_container_width=True)

    col3, col4 = st.columns(2)
    with col3:
        city_summary = df[df["is_high_quality_lead"] == 1].groupby("city").size().reset_index(name="Leads").sort_values("Leads", ascending=True)
        fig3 = px.bar(city_summary, x="Leads", y="city", orientation="h",
                     color_discrete_sequence=[IDBI_TEAL],
                     title="High-Quality Leads by City")
        st.plotly_chart(fig3, use_container_width=True)
    with col4:
        fig4 = px.histogram(df, x="lead_probability", color="converted" if "converted" in df.columns else None,
                            nbins=30, color_discrete_sequence=[IDBI_ORANGE, IDBI_TEAL],
                            title="Lead Score Distribution (validated against actual conversion)")
        st.plotly_chart(fig4, use_container_width=True)

st.markdown("---")
st.caption("Prototype built for IDBI Innovate 2026 — Problem Statement 2: Prospect Assist AI. "
           "All data shown is synthetically generated for demonstration; production deployment "
           "would run on IDBI Bank's sandbox APIs and synthetic/real banking datasets under full data-governance controls.")
