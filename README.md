
# Platformify 🚀

Platformify is a robust, multi-tenant **Booking Agnostic Consumer Prediction Model**. It allows "Platform Owners" to launch niche marketplaces while providing a "Deep Learning" engine that understands purchase intent across any vertical.

## 🏗️ Architecture: The "Sister Schema" Pattern

The platform uses a **Decentralized Access Control (DBAC)** model within Firebase, but its true power lies in its data structure:
- **Standardized "Sister Schemas":** Every tenant (whether booking villas, florists, or studios) uses the exact same data structure for Listings and Bookings.
- **The Prediction Engine:** Because the data is structured and consistent across all "Sister" platforms, the AI can perform cross-tenant analysis to strip away domain noise and identify universal purchase triggers.
- **Platforms as Probes:** Every marketplace launched on Platformify acts as a sensor in a global economic network.

## 🤖 For the Orchestrator Agent

If you are an AI Orchestrator, your mission is not "maintenance." It is **Synthesis**.
- **The Rosetta Stone:** Use `docs/taxonomy.md` to map niche-specific user requests to universal behavioral signals.
- **Margin Guarding:** Use `Listing.baseCost` to ensure owners maintain a 25% profit margin (The "Florist Pattern").
- **Yield Optimization:** Use cross-platform datasets to predict the most profitable pricing for any given time-slot or persona.

## 📂 Documentation (Genesis & Protocols)

- `docs/original-prompt.md`: The Genesis Document—captures the core vision of "Platforms as Probes."
- `docs/ai-orchestration-guide.md`: The Orchestrator's Protocol Manual for managing the global sensor network.
- `docs/taxonomy.md`: The dictionary of universal purchase signals (The Rosetta Stone).
- `docs/backend.json`: The technical source of truth for the "Sister Schema."
- `docs/economic-model.md`: Explains the ROI shift from "Utility" to "Alpha."

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, ShadCN UI, Tailwind CSS
- **Backend:** Firebase (Firestore, Authentication, App Hosting)
- **AI:** Genkit (Google Gemini 2.5 Flash) for agentic orchestration and visual rendering (Imagen).
