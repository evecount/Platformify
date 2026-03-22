# Project Vision: Platformify

This document captures the original intent and requirements provided to bootstrap this project. Use this as a reference for AI agents to maintain consistency during future feature iterations.

## The Core Concept
Build a "Platform for Platforms." A white-label booking marketplace (SaaS) where a user can create an account and immediately launch multiple independent booking websites.

## Key Requirements

### 1. Multi-Tenant Infrastructure
- **Global Owner Dashboard:** A central place to manage multiple "Platforms."
- **Niche Marketplaces:** Each platform must have its own public-facing URL (simulated via `/p/[platformId]`) with custom branding.
- **Security:** Strict multi-tenancy via Firestore Security Rules and denormalized `ownerId` fields.

### 2. Airbnb-Style Onboarding
- **The "Wizard" Experience:** Multi-step flows for platform creation and listing management (Basics -> Location -> Amenities -> Marketing -> Pricing).

### 3. AI-Powered Marketing & Operations
- **Genkit Integration:** Use Gemini 2.5 Flash for high-speed, cost-effective content generation.
- **Context-Aware Prompting:** AI must use specific listing metadata (capacity, price, amenities) to ensure accuracy.

### 4. Agentic AI Extension Patterns (New)
*For future AI Orchestrators:*
- **Niche Assistants:** Each platform can define "AI Tools" via `themeConfig` or specific collection metadata.
- **Constraint-Based Generation:** AI flows should not just "generate text" but act as "Consultants" (e.g., a Florist AI balancing budget vs. flower availability).
- **Tool-Calling:** Use `ai.defineTool` to allow agents to query current inventory or pricing before making recommendations.

## Technical Constraints
- **Next.js 15** & **React 19**.
- **Firebase** (Firestore, Auth, App Hosting).
- **Genkit** for all AI logic.
- **ShadCN** for UI components.
