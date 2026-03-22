# Platformify 🚀

Platformify is a robust, multi-tenant **Booking Agnostic Consumer Prediction Model**. It allows "Platform Owners" to launch niche marketplaces while providing a "Deep Learning" engine that understands purchase intent across any vertical.

## 🏗️ Architecture & Sister Schemas

The platform uses a **Decentralized Access Control (DBAC)** model within Firebase:
- **Standardized "Sister Schemas":** Every tenant (whether booking villas, florists, or studios) uses the exact same data structure for Listings and Bookings.
- **The Prediction Engine:** Because the data is structured and consistent across all "Sister" platforms, the AI can perform cross-tenant analysis to predict purchase behavior and optimize yield.
- **Isolated Data:** Strict multi-tenant boundaries are enforced by Firestore Security Rules using denormalized `ownerId` and `platformId` fields.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, ShadCN UI, Tailwind CSS
- **Backend:** Firebase (Firestore, Authentication, App Hosting)
- **AI:** Genkit (Google Gemini 2.5 Flash) for automated listing descriptions and agentic orchestration.

## 🤖 AI Vision: The "Florist" Pattern

Platformify goes beyond "Chatbots." It enables **Intelligent Consultants** that:
- **Protect Profit Margins:** AI agents use tools to fetch `baseCost` metadata, ensuring listings maintain target margins.
- **Generative Previews:** Uses Imagen to render custom products or arrangements in real-time.
- **Yield Optimization:** Uses the cross-platform structured dataset to predict the most profitable pricing for any given time-slot.

## 📂 Documentation

Detailed blueprints for AI agents and the data engine can be found in:
- `docs/backend.json`: The "Sister Schema" source of truth.
- `docs/ai-orchestration-guide.md`: Blueprint for building the Prediction Model extensions.
- `docs/original-prompt.md`: The architectural vision.
