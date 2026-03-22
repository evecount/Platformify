# Project Vision: Platformify

This document captures the original intent and requirements provided to bootstrap this project. Use this as a reference for AI agents to maintain consistency during future feature iterations.

## The Core Concept
Build a "Platform for Platforms." A white-label booking marketplace (SaaS) where a user can create an account and immediately launch multiple independent booking websites.

## Key Requirements

### 1. Multi-Tenant Infrastructure
- **Global Owner Dashboard:** A central place to manage multiple "Platforms."
- **Niche Marketplaces:** Each platform must have its own public-facing URL (simulated via `/p/[platformId]`) with custom branding (primary/accent colors).
- **Security:** Strict multi-tenancy. A customer on Platform A should never see data from Platform B. All data must be authorized via Firebase Security Rules.

### 2. Airbnb-Style Onboarding
- **The "Wizard" Experience:** Creating a listing should be a premium, multi-step process (Basics -> Location -> Amenities -> Marketing -> Pricing).
- **Progress Indicators:** Use visual cues to show completion status.

### 3. AI-Powered Marketing
- Integrate a Generative AI assistant to help platform owners write property descriptions.
- The AI should be "context-aware," using capacity, location, and amenities to paint a vivid picture for guests.

### 4. Real-Time Booking Engine
- Functional booking flow where guests can select dates and guest counts.
- Real-time updates so owners see new bookings on their dashboard immediately without refreshing.

### 5. Technical Constraints
- Use **Next.js 15** and **React 19**.
- Use **Firebase** for the entire backend (No traditional API layer).
- Use **Genkit** for AI flows.
- Adhere to **ShadCN** design patterns for a professional "SaaS" aesthetic.
