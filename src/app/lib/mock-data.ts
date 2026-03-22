
import { Platform, Listing, Booking, Customer } from './types';

export const MOCK_USER = {
  uid: 'user_123',
  email: 'admin@platformify.com',
  role: 'platform_owner',
  owned_platforms: ['bali-weddings', 'jakarta-venues']
};

export const MOCK_PLATFORMS: Platform[] = [
  {
    id: 'bali-weddings',
    owner_uid: 'user_123',
    platform_name: 'Bali Wedding Venues',
    custom_domain: 'baliweddings.com',
    theme_config: {
      primaryColor: '#20A2FF',
      accentColor: '#3347CC'
    },
    status: 'active'
  },
  {
    id: 'jakarta-venues',
    owner_uid: 'user_123',
    platform_name: 'Jakarta Event Hub',
    custom_domain: 'jakartahub.id',
    theme_config: {
      primaryColor: '#FF5A5F',
      accentColor: '#484848'
    },
    status: 'active'
  }
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'listing_1',
    platform_id: 'bali-weddings',
    title: 'Cliff-top Infinity Villa',
    description: 'Breathtaking views over the Indian Ocean. Perfect for intimate weddings.',
    price_per_day: 1200,
    imageUrl: 'https://picsum.photos/seed/v1/800/600',
    location: 'Uluwatu, Bali',
    keyFeatures: ['Infinity Pool', 'Ocean View', 'Private Chef'],
    capacity: 20,
    amenities: ['Wi-Fi', 'Air Conditioning', 'Sound System'],
    nearbyAttractions: ['Uluwatu Temple', 'Padang Padang Beach'],
    uniqueSellingPoints: ['Voted #1 Sunset Spot', 'Award-winning architecture']
  },
  {
    id: 'listing_2',
    platform_id: 'jakarta-venues',
    title: 'Industrial Loft Space',
    description: 'Raw brick walls and high ceilings in the heart of SCBD.',
    price_per_day: 450,
    imageUrl: 'https://picsum.photos/seed/v2/800/600',
    location: 'Senopati, Jakarta',
    keyFeatures: ['High Ceilings', 'City View', 'Valet Parking'],
    capacity: 100,
    amenities: ['Bar Setup', 'AC', 'Security'],
    nearbyAttractions: ['Pacific Place Mall', 'Senayan Park'],
    uniqueSellingPoints: ['24/7 Access', 'Customizable Lighting']
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'booking_1',
    platform_id: 'bali-weddings',
    listing_id: 'listing_1',
    customer_id: 'cust_1',
    customer_email: 'sarah.j@example.com',
    start_date: '2024-06-15',
    end_date: '2024-06-17',
    total_price: 2400,
    status: 'confirmed'
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust_1',
    platform_id: 'bali-weddings',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    booking_history: ['booking_1']
  }
];
