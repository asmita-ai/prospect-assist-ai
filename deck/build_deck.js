const pptxgen = require("pptxgenjs");
const fs = require("fs");

const metrics = JSON.parse(fs.readFileSync("/home/claude/prospect-assist-ai/models/metrics.json"));

// ---- Palette ----
const TEAL_DARK = "0D4F44";
const TEAL = "0D5C4E";
const TEAL_LIGHT = "E4F1EC";
const ORANGE = "E8732C";
const ORANGE_LIGHT = "FBE3D0";
const INK = "1A2E29";
const MUTED = "5B7268";
const WHITE = "FFFFFF";
const OFFWHITE = "F7F9F8";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
const PGW = 13.33, PGH = 7.5;

const HEAD = "Cambria";
const BODY = "Calibri";

function bgSlide(bgColor = OFFWHITE) {
  const s = pres.addSlide();
  s.background = { color: bgColor };
  return s;
}

function footer(s, pageLabel) {
  s.addText("IDBI Innovate 2026  |  Prospect Assist AI", {
    x: 0.5, y: 7.14, w: 8, h: 0.3, fontFace: BODY, fontSize: 9, color: MUTED, margin: 0,
  });
  s.addText(pageLabel, {
    x: 11.5, y: 7.14, w: 1.4, h: 0.3, fontFace: BODY, fontSize: 9, color: MUTED,
    align: "right", margin: 0,
  });
}

function sectionHeader(s, kicker, title) {
  s.addText(kicker.toUpperCase(), {
    x: 0.6, y: 0.42, w: 8, h: 0.3, fontFace: BODY, fontSize: 12, color: ORANGE,
    bold: true, charSpacing: 2, margin: 0,
  });
  s.addText(title, {
    x: 0.6, y: 0.68, w: 12, h: 0.7, fontFace: HEAD, fontSize: 30, color: TEAL_DARK,
    bold: true, margin: 0,
  });
}

function pillLogoBar(s, dark = false) {
  const color = dark ? WHITE : TEAL_DARK;
  s.addText([
    { text: "IDBI ", options: { color, bold: true } },
    { text: "Innovate 2026", options: { color: dark ? ORANGE : ORANGE, bold: true } },
  ], { x: 0.55, y: 0.22, w: 5, h: 0.35, fontFace: HEAD, fontSize: 15, margin: 0 });
}

// =========================================================
// SLIDE 1 — Cover / Team Details
// =========================================================
{
  const s = pres.addSlide();
  s.background = { color: TEAL_DARK };
  // Decorative orange arc block (motif, not a stripe/border)
  s.addShape(pres.ShapeType.ellipse, { x: 9.6, y: -2.5, w: 7, h: 7, fill: { color: TEAL, transparency: 40 }, line: { type: "none" } });
  s.addShape(pres.ShapeType.ellipse, { x: 10.6, y: -1.3, w: 4.6, h: 4.6, fill: { color: ORANGE, transparency: 55 }, line: { type: "none" } });

  s.addText("IDBI INNOVATE 2026", { x: 0.7, y: 0.6, w: 8, h: 0.4, fontFace: BODY, fontSize: 14, color: ORANGE, bold: true, charSpacing: 3, margin: 0 });
  s.addText("Prospect Assist AI", { x: 0.65, y: 1.05, w: 10, h: 1.1, fontFace: HEAD, fontSize: 46, color: WHITE, bold: true, margin: 0 });
  s.addText("AI-driven lead intelligence for retail lending — replacing self-reported\nincome with behavior-verified repayment capacity and conversion-ready leads.", {
    x: 0.68, y: 2.05, w: 9.2, h: 0.9, fontFace: BODY, fontSize: 15, color: TEAL_LIGHT, margin: 0, lineSpacingMultiple: 1.25,
  });

  const cardY = 3.35;
  const cards = [
    ["Team Name", "[Your Team Name]"],
    ["Team Leader", "[Team Leader Name]"],
    ["Problem Statement", "PS 2 — Prospect Assist AI"],
  ];
  cards.forEach((c, i) => {
    const x = 0.68 + i * 4.1;
    s.addShape(pres.ShapeType.roundRect, { x, y: cardY, w: 3.8, h: 1.35, rectRadius: 0.12, fill: { color: WHITE, transparency: 92 }, line: { color: WHITE, transparency: 70, width: 1 } });
    s.addText(c[0].toUpperCase(), { x: x + 0.25, y: cardY + 0.18, w: 3.3, h: 0.3, fontFace: BODY, fontSize: 10.5, color: ORANGE, bold: true, charSpacing: 1, margin: 0 });
    s.addText(c[1], { x: x + 0.25, y: cardY + 0.5, w: 3.35, h: 0.75, fontFace: HEAD, fontSize: 15.5, color: WHITE, bold: true, margin: 0 });
  });

  s.addText("Build. Integrate. Transform.", { x: 0.68, y: 6.7, w: 6, h: 0.4, fontFace: HEAD, fontSize: 14, italic: true, color: ORANGE, margin: 0 });
  s.addText("Knowledge Partner: AWS   |   Powered by: H2S   |   Technology Partner: ACC", {
    x: 0.68, y: 7.08, w: 9, h: 0.3, fontFace: BODY, fontSize: 10, color: TEAL_LIGHT, margin: 0,
  });
}

// =========================================================
// SLIDE 2 — Brief about the idea
// =========================================================
{
  const s = bgSlide();
  pillLogoBar(s);
  sectionHeader(s, "The Idea", "Brief about the Idea");

  s.addText(
    "Prospect Assist AI turns every customer's existing bank relationship into a live underwriting "
    + "signal. Instead of scoring leads on declared income and demographic guesswork, it reads salary "
    + "credit regularity, UPI spend patterns, savings growth, existing EMI load, and recent big-ticket "
    + "behaviour (e.g. property or dealer-related transfers) to answer two questions banks actually "
    + "need answered before they call a prospect:",
    { x: 0.6, y: 1.55, w: 7.1, h: 1.9, fontFace: BODY, fontSize: 14.5, color: INK, margin: 0, lineSpacingMultiple: 1.3 }
  );

  const qs = [
    ["Can they genuinely repay?", "A behavior-verified income & repayment-capacity estimate — not a self-reported number."],
    ["Are they actually interested — right now?", "A conversion-probability score built from real transaction intent signals, refreshed continuously."],
  ];
  let qy = 3.55;
  qs.forEach((q) => {
    s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: qy, w: 7.1, h: 1.15, rectRadius: 0.1, fill: { color: TEAL_LIGHT }, line: { type: "none" } });
    s.addText(q[0], { x: 0.85, y: qy + 0.13, w: 6.6, h: 0.35, fontFace: HEAD, fontSize: 15, bold: true, color: TEAL_DARK, margin: 0 });
    s.addText(q[1], { x: 0.85, y: qy + 0.5, w: 6.6, h: 0.55, fontFace: BODY, fontSize: 12.5, color: MUTED, margin: 0 });
    qy += 1.35;
  });

  // Right visual: outcome stat card
  s.addShape(pres.ShapeType.roundRect, { x: 8.15, y: 1.55, w: 4.6, h: 5.05, rectRadius: 0.14, fill: { color: TEAL_DARK }, line: { type: "none" } });
  s.addText("TARGETED OUTCOME", { x: 8.5, y: 1.85, w: 3.9, h: 0.3, fontFace: BODY, fontSize: 11, bold: true, color: ORANGE, charSpacing: 2, margin: 0 });
  s.addText(">30%", { x: 8.5, y: 2.15, w: 3.9, h: 1.0, fontFace: HEAD, fontSize: 54, bold: true, color: WHITE, margin: 0 });
  s.addText("conversion rate target set by IDBI Bank for generated leads", { x: 8.5, y: 3.05, w: 3.9, h: 0.6, fontFace: BODY, fontSize: 12, color: TEAL_LIGHT, margin: 0 });

  s.addShape(pres.ShapeType.line, { x: 8.5, y: 3.8, w: 3.6, h: 0, line: { color: WHITE, transparency: 75, width: 1 } });

  s.addText(`${metrics.lead_scorer.conversion_rate_among_flagged_leads_pct}%`, { x: 8.5, y: 3.95, w: 3.9, h: 0.65, fontFace: HEAD, fontSize: 34, bold: true, color: ORANGE, margin: 0 });
  s.addText("achieved by our prototype model on held-out synthetic data — nearly 2x the base conversion rate", { x: 8.5, y: 4.6, w: 3.9, h: 0.7, fontFace: BODY, fontSize: 11.5, color: TEAL_LIGHT, margin: 0 });

  s.addShape(pres.ShapeType.line, { x: 8.5, y: 5.5, w: 3.6, h: 0, line: { color: WHITE, transparency: 75, width: 1 } });
  s.addText(`${metrics.income_estimator.improvement_over_declared_pct}%`, { x: 8.5, y: 5.65, w: 3.9, h: 0.65, fontFace: HEAD, fontSize: 34, bold: true, color: ORANGE, margin: 0 });
  s.addText("more accurate income estimation than trusting self-declared income", { x: 8.5, y: 6.3, w: 3.9, h: 0.6, fontFace: BODY, fontSize: 11.5, color: TEAL_LIGHT, margin: 0 });

  footer(s, "02");
}

// =========================================================
// SLIDE 3 — Opportunities
// =========================================================
{
  const s = bgSlide();
  pillLogoBar(s);
  sectionHeader(s, "Why This Wins", "Opportunities");

  const cols = [
    {
      q: "How is this different?",
      body: "Most lead-scoring tools re-package CRM/demographic data or trust declared income. Prospect Assist AI is behavior-first: it derives repayment capacity and intent directly from transaction cash-flow, closing the gap between what a customer says and what their account actually shows.",
    },
    {
      q: "How does it solve the problem?",
      body: "It replaces two weak, manual signals (declared income, generic demographics) with three model-driven ones — verified income, a calibrated conversion probability, and a product-fit recommendation — so RMs call the right customer, about the right product, with the right amount in mind.",
    },
    {
      q: "USP of the solution",
      body: "Explainable-by-design (SHAP-style contribution for every score, audit-ready for underwriting), tunable to the bank's own risk appetite via one threshold, and deployable directly on IDBI's sandbox APIs and synthetic datasets with no architecture change.",
    },
  ];

  cols.forEach((c, i) => {
    const x = 0.6 + i * 4.15;
    s.addShape(pres.ShapeType.roundRect, { x, y: 1.65, w: 3.9, h: 5.0, rectRadius: 0.12, fill: { color: WHITE }, line: { color: TEAL_LIGHT, width: 1.5 }, shadow: { type: "outer", color: "223229", opacity: 0.12, blur: 8, offset: 3, angle: 90 } });
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.3, y: 1.95, w: 0.55, h: 0.55, fill: { color: i === 2 ? ORANGE : TEAL }, line: { type: "none" } });
    s.addText(String(i + 1), { x: x + 0.3, y: 1.95, w: 0.55, h: 0.55, fontFace: HEAD, fontSize: 20, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
    s.addText(c.q, { x: x + 0.3, y: 2.65, w: 3.3, h: 0.7, fontFace: HEAD, fontSize: 16.5, bold: true, color: TEAL_DARK, margin: 0 });
    s.addText(c.body, { x: x + 0.3, y: 3.4, w: 3.3, h: 3.1, fontFace: BODY, fontSize: 12.5, color: INK, margin: 0, lineSpacingMultiple: 1.28 });
  });

  footer(s, "03");
}

// =========================================================
// SLIDE 4 — Features
// =========================================================
{
  const s = bgSlide();
  pillLogoBar(s);
  sectionHeader(s, "Capabilities", "List of Features Offered by the Solution");

  const feats = [
    ["Behavior-Verified Income", "Estimates true monthly income from cash-flow patterns — independent of what's declared on the form."],
    ["Real-Time Lead Scoring", "0–100 conversion-probability score per customer, recomputed as new transactions arrive."],
    ["Product-Fit Recommendation", "Auto-matches each lead to Personal / Home / Auto / Mortgage Loan based on behavioral fit."],
    ["Explainable Scoring", "Every prediction ships with top feature contributions — audit-ready for underwriting."],
    ["RM Lead Queue Dashboard", "Ranked, filterable, exportable list of high-quality leads for relationship managers."],
    ["Portfolio Analytics", "City-wise, product-wise lead distribution and declared-vs-estimated income gap analysis."],
    ["Configurable Risk Threshold", "One tunable cutoff lets the bank trade off lead volume vs. conversion quality."],
    ["Sandbox-Ready Integration", "Built to plug directly into IDBI Bank's sandbox APIs and synthetic datasets."],
  ];

  const cw = 5.9, ch = 1.18, gx = 0.35, gy = 0.22;
  feats.forEach((f, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * (cw + gx);
    const y = 1.62 + row * (ch + gy);
    s.addShape(pres.ShapeType.roundRect, { x, y, w: cw, h: ch, rectRadius: 0.1, fill: { color: WHITE }, line: { color: TEAL_LIGHT, width: 1.25 } });
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.22, y: y + 0.28, w: 0.42, h: 0.42, fill: { color: TEAL_LIGHT }, line: { type: "none" } });
    s.addText(String(i + 1), { x: x + 0.22, y: y + 0.28, w: 0.42, h: 0.42, fontFace: HEAD, fontSize: 13, bold: true, color: TEAL_DARK, align: "center", valign: "middle", margin: 0 });
    s.addText(f[0], { x: x + 0.78, y: y + 0.13, w: cw - 1.0, h: 0.35, fontFace: HEAD, fontSize: 13.5, bold: true, color: TEAL_DARK, margin: 0 });
    s.addText(f[1], { x: x + 0.78, y: y + 0.48, w: cw - 1.0, h: 0.62, fontFace: BODY, fontSize: 10.8, color: MUTED, margin: 0, lineSpacingMultiple: 1.15 });
  });

  footer(s, "04");
}

// =========================================================
// SLIDE 5 — Process flow diagram
// =========================================================
{
  const s = bgSlide();
  pillLogoBar(s);
  sectionHeader(s, "How It Works", "Process Flow Diagram");

  const steps = [
    ["Customer Data Ingest", "Salary credits, UPI, EMIs, bills, savings pulled from sandbox APIs"],
    ["Feature Engineering", "25+ behavioral signals: regularity, DTI, spend mix, intent flags"],
    ["AI Scoring Engine", "Income Estimator + Lead Scorer + Product Recommender run in parallel"],
    ["Explainability Layer", "SHAP-style contribution generated for every score"],
    ["RM Dashboard", "Ranked, filterable lead queue delivered to relationship managers"],
    ["Outcome Feedback", "Converted / not-converted outcome flows back to retrain the model"],
  ];

  const boxW = 1.95, boxH = 1.55, gap = 0.15;
  const startX = 0.6, y = 2.55;
  steps.forEach((st, i) => {
    const x = startX + i * (boxW + gap);
    const isAI = i >= 1 && i <= 3;
    s.addShape(pres.ShapeType.roundRect, { x, y, w: boxW, h: boxH, rectRadius: 0.09, fill: { color: isAI ? TEAL_DARK : WHITE }, line: { color: isAI ? TEAL_DARK : TEAL, width: 1.5 } });
    s.addText(String(i + 1), { x: x + 0.12, y: y + 0.08, w: 0.5, h: 0.35, fontFace: HEAD, fontSize: 13, bold: true, color: isAI ? ORANGE : ORANGE, margin: 0 });
    s.addText(st[0], { x: x + 0.12, y: y + 0.4, w: boxW - 0.24, h: 0.55, fontFace: HEAD, fontSize: 12, bold: true, color: isAI ? WHITE : TEAL_DARK, margin: 0, lineSpacingMultiple: 1.05 });
    s.addText(st[1], { x: x + 0.12, y: y + 0.95, w: boxW - 0.24, h: 0.55, fontFace: BODY, fontSize: 8.8, color: isAI ? TEAL_LIGHT : MUTED, margin: 0, lineSpacingMultiple: 1.1 });
    if (i < steps.length - 1) {
      s.addText("→", { x: x + boxW - 0.02, y: y + boxH / 2 - 0.25, w: gap + 0.3, h: 0.5, fontFace: BODY, fontSize: 20, bold: true, color: ORANGE, align: "center", margin: 0 });
    }
  });

  s.addText("Loop: Outcome Feedback (6) continuously retrains the AI Scoring Engine (3), improving precision each cycle.", {
    x: 0.6, y: 4.55, w: 11.5, h: 0.4, fontFace: BODY, italic: true, fontSize: 12, color: MUTED, margin: 0,
  });

  s.addText("Use-case: Retail RM logs in every morning to a queue of the day's highest-probability, behavior-verified leads — instead of cold-calling a static branch list.", {
    x: 0.6, y: 5.3, w: 11.3, h: 1.1, fontFace: BODY, fontSize: 13, color: INK, margin: 0, lineSpacingMultiple: 1.3,
  });

  footer(s, "05");
}

// =========================================================
// SLIDE 6 — Wireframes (low-fi concept, pre-build)
// =========================================================
{
  const s = bgSlide();
  pillLogoBar(s);
  sectionHeader(s, "Design Concept", "Wireframes of the Proposed Solution");

  s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 1.55, w: 12.1, h: 5.15, rectRadius: 0.1, fill: { color: WHITE }, line: { color: TEAL_LIGHT, width: 1.5 } });

  // Top nav bar
  s.addShape(pres.ShapeType.rect, { x: 0.6, y: 1.55, w: 12.1, h: 0.55, fill: { color: TEAL_DARK }, line: { type: "none" } });
  s.addText("Prospect Assist AI — RM Console", { x: 0.85, y: 1.62, w: 6, h: 0.4, fontFace: HEAD, fontSize: 13, bold: true, color: WHITE, margin: 0 });
  ["Lead Queue", "Deep-Dive", "Insights"].forEach((t, i) => {
    s.addText(t, { x: 8.5 + i * 1.3, y: 1.62, w: 1.25, h: 0.4, fontFace: BODY, fontSize: 10, color: i === 0 ? ORANGE : TEAL_LIGHT, bold: i === 0, margin: 0 });
  });

  // Left filter panel
  s.addShape(pres.ShapeType.rect, { x: 0.6, y: 2.1, w: 2.4, h: 4.6, fill: { color: TEAL_LIGHT }, line: { type: "none" } });
  s.addText("FILTERS", { x: 0.8, y: 2.25, w: 2, h: 0.3, fontFace: BODY, fontSize: 10, bold: true, color: TEAL_DARK, charSpacing: 1, margin: 0 });
  ["Product", "City", "Min. Income", "Lead Score"].forEach((t, i) => {
    const y = 2.65 + i * 0.75;
    s.addText(t, { x: 0.8, y, w: 2, h: 0.25, fontFace: BODY, fontSize: 9.5, color: MUTED, margin: 0 });
    s.addShape(pres.ShapeType.roundRect, { x: 0.8, y: y + 0.27, w: 1.9, h: 0.3, rectRadius: 0.15, fill: { color: WHITE }, line: { color: TEAL, width: 1 } });
  });

  // KPI cards
  ["Prospects Scored", "High-Quality Leads", "Conversion Rate", "Income Accuracy"].forEach((t, i) => {
    const x = 3.2 + i * 2.4;
    s.addShape(pres.ShapeType.roundRect, { x, y: 2.25, w: 2.2, h: 0.85, rectRadius: 0.08, fill: { color: OFFWHITE }, line: { color: TEAL_LIGHT, width: 1 } });
    s.addText(t, { x: x + 0.15, y: 2.32, w: 1.9, h: 0.3, fontFace: BODY, fontSize: 8.5, color: MUTED, margin: 0 });
    s.addShape(pres.ShapeType.rect, { x: x + 0.15, y: 2.68, w: 1.4, h: 0.22, fill: { color: TEAL_LIGHT }, line: { type: "none" } });
  });

  // Table skeleton
  s.addShape(pres.ShapeType.roundRect, { x: 3.2, y: 3.3, w: 8.3, h: 3.2, rectRadius: 0.08, fill: { color: OFFWHITE }, line: { color: TEAL_LIGHT, width: 1 } });
  s.addText("Ranked Lead Queue", { x: 3.4, y: 3.42, w: 4, h: 0.3, fontFace: HEAD, fontSize: 11, bold: true, color: TEAL_DARK, margin: 0 });
  for (let r = 0; r < 5; r++) {
    const ry = 3.85 + r * 0.5;
    s.addShape(pres.ShapeType.rect, { x: 3.4, y: ry, w: 7.9, h: 0.36, fill: { color: WHITE }, line: { color: TEAL_LIGHT, width: 0.75 } });
    s.addShape(pres.ShapeType.roundRect, { x: 9.7, y: ry + 0.06, w: 1.4, h: 0.24, rectRadius: 0.12, fill: { color: r < 2 ? TEAL : ORANGE_LIGHT }, line: { type: "none" } });
  }

  footer(s, "06");
}

// =========================================================
// SLIDE 7 — Architecture diagram
// =========================================================
{
  const s = bgSlide();
  pillLogoBar(s);
  sectionHeader(s, "System Design", "Architecture Diagram of the Proposed Solution");

  const rows = [
    { label: "SOURCES", color: MUTED, items: ["Core Banking", "UPI Switch", "Bureau Feed", "CRM"] },
    { label: "INGEST & FEATURE STORE", color: TEAL, items: ["AWS Glue / Kinesis ETL", "SageMaker Feature Store"] },
    { label: "AI MODEL LAYER", color: TEAL_DARK, items: ["Income Estimator", "Lead Scorer", "Product Recommender", "SHAP Explainability"] },
    { label: "SERVING", color: TEAL, items: ["FastAPI on ECS Fargate / Lambda"] },
    { label: "EXPERIENCE", color: ORANGE, items: ["RM Dashboard (Streamlit/React)", "CRM Lead Integration"] },
  ];

  let y = 1.55;
  const rowH = [0.85, 0.85, 0.95, 0.75, 0.85];
  rows.forEach((r, ri) => {
    s.addShape(pres.ShapeType.rect, { x: 0.6, y, w: 1.65, h: rowH[ri], fill: { color: r.color }, line: { type: "none" } });
    s.addText(r.label, { x: 0.68, y, w: 1.5, h: rowH[ri], fontFace: BODY, fontSize: 9.5, bold: true, color: WHITE, valign: "middle", align: "center", margin: 0, lineSpacingMultiple: 1.05 });
    const n = r.items.length;
    const boxW = (11.05 / n) - 0.15;
    r.items.forEach((it, ii) => {
      const x = 2.4 + ii * (boxW + 0.15);
      s.addShape(pres.ShapeType.roundRect, { x, y: y + 0.08, w: boxW, h: rowH[ri] - 0.16, rectRadius: 0.07, fill: { color: WHITE }, line: { color: r.color, width: 1.5 } });
      s.addText(it, { x: x + 0.08, y: y + 0.08, w: boxW - 0.16, h: rowH[ri] - 0.16, fontFace: BODY, fontSize: 10, color: INK, align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.05 });
    });
    if (ri < rows.length - 1) {
      s.addText("↓", { x: 6.5, y: y + rowH[ri] - 0.05, w: 0.4, h: 0.25, fontFace: BODY, fontSize: 14, bold: true, color: ORANGE, align: "center", margin: 0 });
    }
    y += rowH[ri] + 0.18;
  });

  s.addText("Feedback loop: RM-confirmed outcomes (converted / not) flow back into SageMaker Pipelines to retrain all three models on a rolling schedule.", {
    x: 0.6, y: 6.75, w: 12.1, h: 0.4, fontFace: BODY, italic: true, fontSize: 11, color: MUTED, margin: 0,
  });

  footer(s, "07");
}

// =========================================================
// SLIDE 8 — Technologies
// =========================================================
{
  const s = bgSlide();
  pillLogoBar(s);
  sectionHeader(s, "Stack", "Technologies Used in the Solution");

  const groups = [
    ["Data & ML", ["Python", "Pandas / NumPy", "XGBoost", "SHAP", "scikit-learn"]],
    ["Serving & App", ["FastAPI", "Streamlit", "Plotly", "Joblib"]],
    ["Cloud & Infra (production)", ["AWS SageMaker", "AWS Lambda / ECS Fargate", "AWS Glue / Kinesis", "AWS S3 / Redshift"]],
    ["Bank Integration", ["IDBI Sandbox APIs", "Synthetic Banking Datasets", "CRM / Lead Management System"]],
  ];

  groups.forEach((g, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 6.1, y = 1.6 + row * 2.65;
    s.addShape(pres.ShapeType.roundRect, { x, y, w: 5.75, h: 2.4, rectRadius: 0.1, fill: { color: WHITE }, line: { color: TEAL_LIGHT, width: 1.5 } });
    s.addShape(pres.ShapeType.rect, { x, y, w: 0.12, h: 2.4, fill: { color: TEAL }, line: { type: "none" } }); // small tab, not a full stripe motif
    s.addText(g[0], { x: x + 0.35, y: y + 0.2, w: 5.2, h: 0.4, fontFace: HEAD, fontSize: 15, bold: true, color: TEAL_DARK, margin: 0 });
    g[1].forEach((tech, ti) => {
      const tx = x + 0.35 + (ti % 3) * 1.85;
      const ty = y + 0.75 + Math.floor(ti / 3) * 0.62;
      s.addShape(pres.ShapeType.roundRect, { x: tx, y: ty, w: 1.7, h: 0.42, rectRadius: 0.21, fill: { color: TEAL_LIGHT }, line: { type: "none" } });
      s.addText(tech, { x: tx, y: ty, w: 1.7, h: 0.42, fontFace: BODY, fontSize: 9.5, bold: true, color: TEAL_DARK, align: "center", valign: "middle", margin: 0 });
    });
  });

  footer(s, "08");
}

// =========================================================
// SLIDE 9 — Estimated implementation cost (optional)
// =========================================================
{
  const s = bgSlide();
  pillLogoBar(s);
  sectionHeader(s, "Investment", "Estimated Implementation Cost (Optional)");

  const rows = [
    ["Sandbox PoC (3 months)", "AWS SageMaker + Lambda/Fargate (dev-tier), 2 ML engineers, 1 designer", "₹9 – 12 L"],
    ["Pilot at 2–3 branches (6 months)", "Model retraining pipeline, CRM integration, monitoring & MLOps", "₹18 – 25 L"],
    ["Bank-wide rollout (annual run-rate)", "Production AWS infra, compliance/audit tooling, ongoing model ops", "₹35 – 50 L / yr"],
  ];

  s.addShape(pres.ShapeType.roundRect, { x: 0.6, y: 1.7, w: 12.1, h: 0.55, rectRadius: 0.06, fill: { color: TEAL_DARK }, line: { type: "none" } });
  ["Phase", "Scope", "Est. Cost"].forEach((h, i) => {
    const widths = [3.6, 6.5, 2.0];
    const x = 0.85 + [0, 3.6, 10.1][i];
    s.addText(h, { x, y: 1.7, w: widths[i], h: 0.55, fontFace: HEAD, fontSize: 12.5, bold: true, color: WHITE, valign: "middle", margin: 0 });
  });

  let y = 2.35;
  rows.forEach((r, i) => {
    s.addShape(pres.ShapeType.rect, { x: 0.6, y, w: 12.1, h: 1.05, fill: { color: i % 2 === 0 ? WHITE : OFFWHITE }, line: { color: TEAL_LIGHT, width: 0.75 } });
    s.addText(r[0], { x: 0.85, y, w: 3.4, h: 1.05, fontFace: HEAD, fontSize: 12.5, bold: true, color: TEAL_DARK, valign: "middle", margin: 0 });
    s.addText(r[1], { x: 4.35, y, w: 5.9, h: 1.05, fontFace: BODY, fontSize: 11, color: INK, valign: "middle", margin: 0, lineSpacingMultiple: 1.15 });
    s.addText(r[2], { x: 10.35, y, w: 2.15, h: 1.05, fontFace: HEAD, fontSize: 13, bold: true, color: ORANGE, valign: "middle", margin: 0 });
    y += 1.05;
  });

  s.addText("Indicative, hackathon-stage estimate for planning discussion only — final costing depends on IDBI Bank's sandbox infra terms and data-access scope.", {
    x: 0.6, y: 5.75, w: 12.1, h: 0.4, fontFace: BODY, italic: true, fontSize: 10.5, color: MUTED, margin: 0,
  });

  footer(s, "09");
}

// =========================================================
// SLIDE 10 — Snapshots of the prototype
// =========================================================
{
  const s = bgSlide();
  pillLogoBar(s);
  sectionHeader(s, "Working Prototype", "Snapshots of the Prototype");

  s.addImage({ path: "/home/claude/prospect-assist-ai/shots/tab1_queue.png", x: 0.6, y: 1.55, w: 7.65, h: 4.85, sizing: { type: "contain", w: 7.65, h: 4.85 } });
  s.addText("Ranked Lead Queue", { x: 0.6, y: 6.42, w: 7.65, h: 0.3, fontFace: HEAD, fontSize: 12, bold: true, color: TEAL_DARK, align: "center", margin: 0 });

  s.addImage({ path: "/home/claude/prospect-assist-ai/shots/tab2_deepdive.png", x: 8.4, y: 1.55, w: 4.35, h: 2.3, sizing: { type: "contain", w: 4.35, h: 2.3 } });
  s.addText("Lead Deep-Dive & Explainability", { x: 8.4, y: 3.87, w: 4.35, h: 0.3, fontFace: BODY, fontSize: 10.5, bold: true, color: TEAL_DARK, align: "center", margin: 0 });

  s.addImage({ path: "/home/claude/prospect-assist-ai/shots/tab3_insights.png", x: 8.4, y: 4.3, w: 4.35, h: 2.1, sizing: { type: "contain", w: 4.35, h: 2.1 } });
  s.addText("Portfolio Insights", { x: 8.4, y: 6.42, w: 4.35, h: 0.3, fontFace: BODY, fontSize: 10.5, bold: true, color: TEAL_DARK, align: "center", margin: 0 });

  footer(s, "10");
}

// =========================================================
// SLIDE 11 — Prototype Performance report/Benchmarking
// =========================================================
{
  const s = bgSlide();
  pillLogoBar(s);
  sectionHeader(s, "Validated Results", "Prototype Performance Report / Benchmarking");

  const stats = [
    [`${metrics.lead_scorer.conversion_rate_among_flagged_leads_pct}%`, "Conversion rate among AI-flagged leads", "vs. 30% target — nearly 2x lift over base rate", ORANGE],
    [`${metrics.lead_scorer.auc}`, "Lead Scorer AUC-ROC", "on held-out synthetic test data", TEAL],
    [`${metrics.income_estimator.improvement_over_declared_pct}%`, "More accurate than declared income", "MAE ₹5,789 vs ₹15,066 for the declared-income baseline", TEAL],
    [`${(metrics.income_estimator.r2 * 100).toFixed(1)}%`, "Income variance explained (R²)", "by the behavior-only income estimator", ORANGE],
    [`${(metrics.product_recommender.accuracy * 100).toFixed(1)}%`, "Product-recommendation accuracy", "Personal / Home / Auto / Mortgage classification", TEAL],
    [`${metrics.lead_scorer.pct_flagged_as_leads}%`, "Of base flagged as high-quality leads", "large enough pipeline for RM teams to act on daily", ORANGE],
  ];

  stats.forEach((st, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.15, y = 1.65 + row * 2.55;
    s.addShape(pres.ShapeType.roundRect, { x, y, w: 3.9, h: 2.35, rectRadius: 0.12, fill: { color: WHITE }, line: { color: TEAL_LIGHT, width: 1.5 }, shadow: { type: "outer", color: "223229", opacity: 0.1, blur: 6, offset: 2, angle: 90 } });
    s.addText(st[0], { x: x + 0.25, y: y + 0.2, w: 3.4, h: 0.75, fontFace: HEAD, fontSize: 32, bold: true, color: st[3], margin: 0 });
    s.addText(st[1], { x: x + 0.25, y: y + 0.98, w: 3.4, h: 0.55, fontFace: HEAD, fontSize: 12.5, bold: true, color: TEAL_DARK, margin: 0, lineSpacingMultiple: 1.1 });
    s.addText(st[2], { x: x + 0.25, y: y + 1.52, w: 3.4, h: 0.7, fontFace: BODY, fontSize: 9.8, color: MUTED, margin: 0, lineSpacingMultiple: 1.15 });
  });

  footer(s, "11");
}

// =========================================================
// SLIDE 12 — Additional Details / Future Development
// =========================================================
{
  const s = bgSlide();
  pillLogoBar(s);
  sectionHeader(s, "Roadmap", "Additional Details / Future Development");

  const items = [
    ["Bureau + GST data fusion", "Blend bureau pulls and GST returns (for self-employed/MSME) with transaction features for even sharper income estimation."],
    ["Real-time scoring API", "Move from batch scoring to an event-driven API that re-scores a customer the moment a qualifying transaction lands."],
    ["Active-learning feedback loop", "RM-confirmed conversion outcomes automatically retrain the models weekly, closing the loop shown in the architecture."],
    ["Multi-lingual RM assistant", "A conversational layer so RMs can ask \"who are my top 10 home-loan leads in Pune this week\" in natural language."],
    ["Fairness & bias monitoring", "Continuous fairness audits across gender, geography, and employment type before any production rollout."],
    ["Early-warning cross-sell", "Extend the same behavioral engine to flag credit-card, FD, and insurance cross-sell opportunities."],
  ];

  items.forEach((it, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.6 + col * 6.1, y = 1.62 + row * 1.75;
    s.addShape(pres.ShapeType.ellipse, { x, y: y + 0.06, w: 0.4, h: 0.4, fill: { color: i % 2 === 0 ? TEAL : ORANGE }, line: { type: "none" } });
    s.addText(String(i + 1), { x, y: y + 0.06, w: 0.4, h: 0.4, fontFace: HEAD, fontSize: 13, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
    s.addText(it[0], { x: x + 0.55, y, w: 5.3, h: 0.4, fontFace: HEAD, fontSize: 13.5, bold: true, color: TEAL_DARK, margin: 0 });
    s.addText(it[1], { x: x + 0.55, y: y + 0.42, w: 5.3, h: 1.1, fontFace: BODY, fontSize: 11, color: INK, margin: 0, lineSpacingMultiple: 1.22 });
  });

  footer(s, "12");
}

// =========================================================
// SLIDE 13 — Links
// =========================================================
{
  const s = bgSlide();
  pillLogoBar(s);
  sectionHeader(s, "Submission", "Provide Links To Your");

  const links = [
    ["GitHub Public Repository", "[ paste your public repo URL here ]"],
    ["Demo Video Link (3 Minutes)", "[ paste your unlisted/public video URL here ]"],
    ["Final Product Link", "[ paste your deployed Streamlit Cloud URL here ]"],
  ];
  links.forEach((l, i) => {
    const y = 1.8 + i * 1.45;
    s.addShape(pres.ShapeType.roundRect, { x: 0.6, y, w: 12.1, h: 1.15, rectRadius: 0.1, fill: { color: WHITE }, line: { color: TEAL_LIGHT, width: 1.5 } });
    s.addShape(pres.ShapeType.ellipse, { x: 0.9, y: y + 0.3, w: 0.55, h: 0.55, fill: { color: TEAL }, line: { type: "none" } });
    s.addText(String(i + 1), { x: 0.9, y: y + 0.3, w: 0.55, h: 0.55, fontFace: HEAD, fontSize: 18, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0 });
    s.addText(l[0], { x: 1.7, y: y + 0.15, w: 10, h: 0.4, fontFace: HEAD, fontSize: 15.5, bold: true, color: TEAL_DARK, margin: 0 });
    s.addText(l[1], { x: 1.7, y: y + 0.58, w: 10, h: 0.4, fontFace: BODY, italic: true, fontSize: 12, color: MUTED, margin: 0 });
  });

  footer(s, "13");
}

// =========================================================
// SLIDE 14 — Thank you
// =========================================================
{
  const s = pres.addSlide();
  s.background = { color: TEAL_DARK };
  s.addShape(pres.ShapeType.ellipse, { x: -2, y: 4, w: 6, h: 6, fill: { color: TEAL, transparency: 45 }, line: { type: "none" } });
  s.addShape(pres.ShapeType.ellipse, { x: 10.5, y: -2, w: 5.5, h: 5.5, fill: { color: ORANGE, transparency: 55 }, line: { type: "none" } });

  s.addText("Thank You", { x: 0, y: 2.9, w: 13.33, h: 1.2, fontFace: HEAD, fontSize: 52, bold: true, color: WHITE, align: "center", margin: 0 });
  s.addText("Prospect Assist AI  —  Team [Your Team Name]", { x: 0, y: 4.05, w: 13.33, h: 0.5, fontFace: BODY, fontSize: 16, color: ORANGE, align: "center", margin: 0 });
  s.addText("IDBI Innovate 2026  •  Build. Integrate. Transform.", { x: 0, y: 4.55, w: 13.33, h: 0.4, fontFace: BODY, fontSize: 12, color: TEAL_LIGHT, align: "center", margin: 0 });
}

pres.writeFile({ fileName: "/home/claude/prospect-assist-ai/deck/IDBI_Innovate_ProspectAssistAI_Deck.pptx" }).then(() => {
  console.log("Deck written.");
});
