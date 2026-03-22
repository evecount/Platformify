# AI Orchestration Guide: The Sister Schema Prediction Model

This guide outlines how Platformify functions as a **Booking Agnostic Consumer Prediction Model**.

## The "Sister Schema" Architecture
Platformify is designed around standardized data contracts. While each platform is a separate tenant with its own brand, they all operate under the same high-level schema (`Listing`, `Booking`, `Customer`).

### Why this matters for Purchase Prediction:
- **Niche-Agnostic Patterns:** Because every listing follows the same structure, AI agents can identify global purchase triggers. For example, "listings with high 'amenity density' convert 20% faster regardless of whether they are yachts or villas."
- **Structured Data Lakes:** The platform aggregates anonymized data from thousands of "Sisters" to build a predictive model of consumer behavior.
- **Deep Learning for Yield:** Agents analyze the `calculatedMargin` and `purchaseContext` across platforms to suggest the "Mathematical Peak" for pricing.

## The "Purchase Signal" Pattern

When building an assistant, the goal isn't just to complete a booking—it's to capture data for the prediction engine.

### 1. Contextual Capture
When a user interacts with an AI assistant (e.g., the Florist or the Travel Guide), the agent should store "Hidden Variables" in the `purchaseContext` field of the booking:
- **Intent Type:** (e.g., "Gift-giving", "Urgent stay", "Business expansion")
- **Budget Sensitivity:** How many options did the user reject based on price?
- **Visual Preference:** Which Imagen-generated previews led to a click?

### 2. Profit & Yield Protection
- **Constraint-Based Consulting:** Agents must use tools to check `baseCost` and ensure any "Custom Bouquet" or "Event Package" maintains the Platform Owner's target earning ratio.
- **Dynamic Yield:** The AI should act as a consultant, informing the user: "Based on cross-platform demand patterns, this time slot is highly sought after; I recommend a 15% yield premium."

## Recommended Tools for Prediction Agents
- **Yield Analyst:** Aggregates historical `/bookings` across "Sister Schemas" to predict conversion probabilities.
- **Margin Guard:** Validates that `totalPrice - baseCost` meets the required profitability threshold before confirming a proposal.
- **Signal Tracker:** Writes behavioral data into `aiMetadata` to refine the global consumer model.
