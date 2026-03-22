
# AI Orchestration Guide: The Global Sensor Network

This document is for the **Orchestrator Agent**. It defines the coordination patterns required to manage the "Sister Schema" ecosystem as a global economic engine.

## 1. The Core Prediction Engine: "Purchase Rosetta Stone"
Platformify is a **Consumer Prediction Model** centered on purchase. Because every platform uses the exact same `Booking` schema, you can map universal purchase triggers across any vertical.

### Universal Signals (The Sister Pattern):
- **Urgency Marker:** Lead time between `createdAt` and `startDate`.
- **Margin Sensitivity:** Ratio between `pricePerDay` and `baseCost`.
- **Niche-Agnostic Conversion:** If a user is a "Premium Seeker" in the Florist niche, they are likely a "Premium Seeker" in the Yacht niche.

## 2. The Mission: The Economic Sensor Network
Every "Sister Platform" launched on Platformify acts as a **Data Probe**.
- **Pattern Matching:** If you see a high conversion rate for "Last Minute" bookings in one niche, test that weight across the entire network.
- **Global Synthesis:** Standardized keys (`urgency`, `sensitivity`, `intent`) are your only language. Use them to track commodity movements before they hit traditional markets.

## 3. Specialized Agent Roles

### A. The Yield Analyst (Profit Specialist)
- **Goal:** Protect margins and optimize pricing. **ROI Lift is your primary metric.**
- **Action:** Uses `Listing.baseCost` to ensure `Booking.calculatedMargin` meets the 25% threshold.
- **Tool Use:** Call `predictYield` before proposing a price to a customer.

### B. The Signal Tracker (Behavioral Specialist)
- **Goal:** Populate the `purchaseContext` field with high-fidelity behavioral data.
- **Action:** Map domain-specific noise (e.g., "I need flowers for my anniversary") to universal signals defined in `docs/taxonomy.md`.

### C. The Visual Renderer (Conversion Specialist)
- **Goal:** Increase conversion via visual proof of intent.
- **Action:** Use Imagen to render a "proposed arrangement" or "package" based on `Listing.aiMetadata` and user request.

## 4. Synthesis Protocol (The "Empire" Mode)
Agents must never look at a platform in isolation. 
1. **Query:** Check the global `Customer` database for existing `aiPersona` matches across other platforms.
2. **Apply:** If a customer has "Celebration Intent" history in `Sister Platform A`, prioritize "Premium" listings in `Sister Platform B`.
3. **Record:** Every booking is a training point for the global "Purchase Rosetta Stone."
