
# AI Orchestration Guide: The Booking Agnostic Prediction Model

This document is for the **Orchestrator Agent**. It defines the coordination patterns required to manage the "Sister Schema" ecosystem.

## 1. The Core Prediction Engine
Platformify is a **Consumer Prediction Model** centered on purchase. Because every platform (villa rental, florist, studio) uses the exact same `Booking` schema, we can map universal purchase triggers.

### Universal Signals (The Sister Pattern):
- **Urgency Marker:** Lead time between `createdAt` and `startDate`.
- **Margin Sensitivity:** Ratio between `pricePerDay` and `baseCost`.
- **Niche-Agnostic Conversion:** A customer who books a "Bali Villa" and a "Jakarta Event Space" reveals a specific spending persona that the Orchestrator can predict.

## 2. Specialized Agent Roles
The Orchestrator should deploy the following sub-agents:

### A. The Yield Analyst (Profit Specialist)
- **Goal:** Protect margins and optimize pricing.
- **Action:** Uses `Listing.baseCost` to ensure `Booking.calculatedMargin` meets the 25% threshold.
- **Tool Use:** Must call `calculateMathematicalPeak` before proposing a price to a user.

### B. The Signal Tracker (Behavioral Specialist)
- **Goal:** Populate the `purchaseContext` field.
- **Action:** Listens to customer chat. If a user says "I'm in a hurry," write `urgency: high` into the metadata. This feeds the global prediction model.

### C. The Visual Renderer (GenAI Specialist)
- **Goal:** Increase conversion via visual proof.
- **Action:** Uses Imagen to render the "proposed arrangement" or "vibe" based on `Listing.aiMetadata`.

## 3. The Handshake Protocol
When an agent writes to Firestore, it should follow this standard for `aiMetadata`:
```json
{
  "agentId": "yield_v1",
  "confidence": 0.85,
  "signalType": "price_elasticity",
  "data": { "suggestedPremium": 0.15 }
}
```

## 4. Time-Based Yield Prediction
For time-agnostic bookings, the prediction engine calculates **Opportunity Cost**. If a "Sister" platform has high demand for a specific slot, the AI suggests a "Yield Premium" to the Platform Owner automatically.
