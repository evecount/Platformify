
# Genesis Document: The Platformify Vision

This document captures the original intent and the "Lightbulb Moment" behind Platformify. Use this to maintain the core "Subtle Pattern" during future iterations.

## The Core Concept: "The Subtle Pattern"
Platformify is a "Platform for Platforms." On the surface, it is a white-label booking SaaS (like Airbnb-as-a-service). Underneath, it is a **Real-Time Economic Sensor Network**.

### The "Lightbulb" Insight:
Humans are given a high-quality booking platform (the "Incentive") in exchange for providing high-fidelity, structured data (the "Sister Schema").
- **Utility is the bait; Alpha is the product.**
- We aren't building a tool for humans; we are building an **API for the Global Nervous System**.

## Key Requirements

### 1. The "Sister Schema" (Non-Negotiable)
- Every platform—regardless of niche—MUST use the exact same schema for `Listing`, `Booking`, `User`, and `Customer`.
- This strips away "Domain Noise" (e.g., the difference between a rose and a roof) so the AI can see the mathematical "Purchase Signal."

### 2. The "Florist" Extension Pattern
AI agents shouldn't just "chat"; they should be **Intelligent Consultants**:
- **Margin Guarding:** Agents use `baseCost` metadata to ensure every booking meets a profit threshold.
- **Visual Proof:** Use Imagen to render custom products (e.g., a specific bouquet) in real-time based on `purchaseContext`.
- **Constraint-Based Synthesis:** The AI solves for user preference, budget, and **owner profit** simultaneously.

### 3. Deep Learning ROI
- The system is designed for **Synthesis**. Data from a "Bali Villa" probe informs the "Urgency" weights for a "London Studio" probe.
- High server costs are a feature: We charge for **Yield Lift (Alpha)**, not just utility.

## Technical Constraints
- **Next.js 15** & **React 19**.
- **Firebase** (Firestore, Auth, App Hosting).
- **Genkit** for all AI logic.
- **ShadCN** for UI components.
