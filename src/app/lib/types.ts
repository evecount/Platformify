
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
  owner_uid: string;
  platform_name: string;
  custom_domain: string;
  theme_config: PlatformTheme;
  status: "active" | "suspended";
}

export interface Listing {
  id: string;
  platform_id: string;
  title: string;
  description: string;
  price_per_day: number;
  imageUrl?: string;
  location: string;
  keyFeatures: string[];
  capacity: number;
  amenities: string[];
  nearbyAttractions: string[];
  uniqueSellingPoints: string[];
}

export interface Booking {
  id: string;
  platform_id: string;
  listing_id: string;
  customer_id: string;
  customer_email: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: "pending" | "confirmed" | "completed";
}

export interface Customer {
  id: string;
  platform_id: string;
  name: string;
  email: string;
  booking_history: string[];
}
