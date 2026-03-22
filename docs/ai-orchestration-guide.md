
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
- **Goal:** Protect margins and optimize pricing. **ROI is the primary metric.**
- **Action:** Uses `Listing.baseCost` to ensure `Booking.calculatedMargin` meets the 25% threshold.
- **Tool Use:** Must call `predictYield` (Genkit flow) before proposing a price.

### B. The Signal Tracker (Behavioral Specialist)
- **Goal:** Populate the `purchaseContext` field.
- **Action:** Maps domain-specific noise (e.g., "I need flowers for my anniversary") to universal signals (e.g., `intent: celebration`, `urgency: high`).

### C. The Visual Renderer (GenAI Specialist)
- **Goal:** Increase conversion via visual proof.
- **Action:** Uses Imagen to render the "proposed arrangement" based on `Listing.aiMetadata`.

## 3. The "Sister Schema" Synthesis
The Orchestrator treats every independent platform as a "Data Probe."
- **Pattern Matching:** If the model sees a high conversion rate for "Last Minute" bookings in the Florist niche, it tests that weight in the Villa niche. 
- **The Global Rosetta Stone:** Standardized keys (`urgency`, `sensitivity`, `intent`) are the only language the model speaks.
