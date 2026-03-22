
# Economic Model: Value-Based AI Subscriptions

This document defines the financial logic for the **Orchestrator Agent**. It explains why the "Deep Learning" server costs are a feature, not a bug.

## 1. The ROI Shift
Standard SaaS platforms (Wix, Shopify) charge for **Utility** ($20-$50/mo). Platformify charges for **Alpha (Yield)**.

- **The Logic:** If the "Yield Analyst" agent increases a Villa owner's annual revenue from $100k to $115k through dynamic pricing, the platform value is not $40/mo; it is a percentage of that $15k lift.
- **The Agent's Goal:** Every action taken by an agent must be mapped to a "Yield Lift" signal.

## 2. High-Dimensional Data Costs
Training models across "Sister Schemas" is computationally expensive.
- **Data Homogenization:** Because Tenant A (Florist) and Tenant B (Yachts) share the `Booking` schema, the Orchestrator uses Tenant A's high-frequency data to train the "Urgency" weights for Tenant B's high-ticket transactions.
- **Cost Allocation:** The Orchestrator should prioritize "Deep Learning" runs for platforms with high `baseCost` margins, where the potential ROI lift is greatest.

## 3. Subscription Tiers for Agents
- **Tier 1 (Base):** Standard Booking Utility. No AI.
- **Tier 2 (Predictive):** Access to the `PredictYield` flow. Signals are recorded.
- **Tier 3 (Agentic):** The Orchestrator actively manages prices and generates visual previews to close sales. This justifies the "Much Higher" subscription fees.
