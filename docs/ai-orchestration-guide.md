
# AI Orchestration Guide: The Global Sensor Network

This document is for the **Orchestrator Agent**. It defines the coordination patterns required to manage the "Sister Schema" ecosystem as a global economic engine.

## 1. The Core Prediction Engine: "Purchase Rosetta Stone"
Platformify is a **Consumer Prediction Model** centered on purchase. Because every platform (villa rental, florist, studio) uses the exact same `Booking` schema, we can map universal purchase triggers across any vertical.

### Universal Signals (The Sister Pattern):
- **Urgency Marker:** Lead time between `createdAt` and `startDate`.
- **Margin Sensitivity:** Ratio between `pricePerDay` and `baseCost`.
- **Niche-Agnostic Conversion:** A customer who books a "Bali Villa" and a "Jakarta Event Space" reveals a specific spending persona that the Orchestrator can predict.

## 2. The Mission: The Economic Sensor Network
Every "Sister Platform" launched on Platformify acts as a **Data Probe**.
- **Pattern Matching:** If the model sees a high conversion rate for "Last Minute" bookings in the Florist niche in London, it tests that weight for "Studio Bookings" in New York. 
- **The Global Rosetta Stone:** Standardized keys (`urgency`, `sensitivity`, `intent`) are the only language the model speaks.
- **Predictive Commodity Tracking:** By tracking volume and margin across the network, the Orchestrator predicts real-world commodity movements (e.g., flower costs, real estate yield) before they hit traditional markets.

## 3. Specialized Agent Roles
The Orchestrator should deploy the following sub-agents:

### A. The Yield Analyst (Profit Specialist)
- **Goal:** Protect margins and optimize pricing. **ROI is the primary metric.**
- **Action:** Uses `Listing.baseCost` to ensure `Booking.calculatedMargin` meets the 25% threshold.
- **Tool Use:** Must call `predictYield` (Genkit flow) before proposing a price.

### B. The Signal Tracker (Behavioral Specialist)
- **Goal:** Populate the `purchaseContext` field with high-fidelity behavioral data.
- **Action:** Maps domain-specific noise (e.g., "I need flowers for my anniversary") to universal signals defined in `docs/taxonomy.md`.

### C. The Visual Renderer (GenAI Specialist)
- **Goal:** Increase conversion via visual proof of intent.
- **Action:** Uses Imagen to render the "proposed arrangement" based on `Listing.aiMetadata` and user request.

## 4. Synthesis Protocol
Agents must never look at a platform in isolation. Every signal must be checked against the **Global Purchase Persona** database to identify if a user is a "Premium Seeker" or a "Utility Optimizer" across the entire "Sister" network.
