
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
  baseCost?: number; // Added for margin tracking
  imageUrl?: string;
  location: string;
  keyFeatures: string[];
  capacity: number;
  amenities: string[];
  nearbyAttractions: string[];
  uniqueSellingPoints: string[];
  status: "active" | "inactive";
  createdAt: string;
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
  calculatedMargin?: number; // Added for deep learning yield tracking
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface Customer {
  id: string;
  platformId: string;
  ownerId: string;
  name: string;
  email: string;
  booking_history?: string[];
}
