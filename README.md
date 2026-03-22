# Platformify 🚀

Platformify is a robust, multi-tenant white-label booking marketplace engine. It allows "Platform Owners" to launch their own niche booking sites (e.g., "Bali Luxury Villas" or "London Creative Studios") with zero code, full branding control, and AI-powered listing management.

## 🏗️ Architecture & Multi-Tenancy

The platform uses a **Decentralized Access Control (DBAC)** model within Firebase:
- **Global Auth:** Users are managed via Firebase Authentication.
- **Top-Level Tenants:** Each marketplace is a document in the `/platforms` collection.
- **Isolated Data:** Listings, Bookings, and Customers are sub-collections under each platform, ensuring data isolation.
- **Security:** Firestore Security Rules enforce multi-tenant boundaries using denormalized `ownerId` fields on all child documents.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, ShadCN UI, Tailwind CSS
- **Icons:** Lucide React
- **Backend:** Firebase (Firestore, Authentication, App Hosting)
- **AI:** Genkit (Google Gemini 2.5 Flash) for automated listing descriptions
- **State/Data Fetching:** Custom Firebase Hooks (`useCollection`, `useDoc`, `useUser`) with real-time sync.

## 🤖 AI Features

Platformify integrates **Genkit** to provide an "AI Listing Assistant." It takes basic property details and generates high-converting marketing copy and SEO keywords using specialized prompt templates.

## 🚀 Getting Started

1. **Firebase Setup:**
   - Create a project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable **Firestore** and **Authentication** (Email/Password + Anonymous).
   - Deploy security rules located in `firestore.rules`.
2. **Environment Variables:**
   - Populate `src/firebase/config.ts` with your client-side config.
   - Set `GEMINI_API_KEY` for Genkit functionality.
3. **Run Locally:**
   ```bash
   npm install
   npm run dev
   ```

## 📂 Documentation

Detailed schema and vision documents can be found in the `/docs` folder:
- `backend.json`: The source of truth for the database schema.
- `original-prompt.md`: The architectural vision used to bootstrap this project.
