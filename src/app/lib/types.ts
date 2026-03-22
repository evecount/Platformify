
export type UserRole = "platform_owner" | "super_admin";

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  owned_platforms: string[];
}

export interface PlatformTheme {
  primaryColor: string;
  logoUrl?: string;
  accentColor: string;
}

export interface Platform {
  id: string;
  ownerId: string;
  name: string;
  customDomain: string;
  themeConfig: string; // JSON string
  status: "active" | "suspended";
  niche?: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  platformId: string;
  ownerId: string;
  title: string;
  description: string;
  pricePerDay: number;
  baseCost: number; // Raw operational cost for margin guarding (Sister Schema Requirement)
  imageUrl?: string;
  location: string;
  capacity: number;
  status: "active" | "inactive";
  createdAt: string;
  /**
   * AI Metadata: High-dimensional features like 'vibe', 'luxury_index'.
   * Used for the global cross-platform prediction engine.
   */
  aiMetadata?: Record<string, any>;
}

export interface Booking {
  id: string;
  platformId: string;
  ownerId: string;
  listingId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  calculatedMargin: number; // Recorded at booking for deep learning yield tracking
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  /**
   * Purchase Signals: Conversion triggers and behavioral markers (Sister Schema Requirement).
   * Maps to the Behavioral Taxonomy (urgency, intent, sensitivity).
   */
  purchaseContext?: {
    urgency?: 'low' | 'medium' | 'high';
    intent?: 'gift' | 'business' | 'celebration' | 'utility';
    sensitivity?: number;
    [key: string]: any;
  };
}

export interface Customer {
  id: string;
  platformId: string;
  ownerId: string;
  name: string;
  email: string;
  /**
   * Behavioral Persona: Calculated by the Orchestrator across all sisters.
   */
  aiPersona?: string;
  booking_history?: string[];
}
