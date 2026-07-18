// Database Type Definitions matching Supabase schema

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: "customer" | "admin";
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  price: number;
  compare_price: number | null;
  stock: number;
  sku: string;
  category: string;
  images: string[];
  specifications: Record<string, unknown>;
  features: string[];
  rating: number;
  review_count: number;
  status: "draft" | "published" | "out_of_stock";
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  profile_id: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  profile_id: string | null;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "unpaid" | "paid" | "refunded";
  shipping_status: "pending" | "shipped" | "delivered";
  subtotal: number;
  shipping_fee: number;
  discount: number;
  tax: number;
  grand_total: number;
  shipping_address_id: string | null;
  order_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price: number;
  variant: string;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  profile_id: string;
  rating: number;
  review: text;
  verified_purchase: boolean;
  created_at: string;
  updated_at: string;
}

export type text = string;

export interface WishlistItem {
  id: string;
  profile_id: string;
  product_id: string;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  active: boolean;
  created_at: string;
}

export interface ServiceError {
  message: string;
  code?: string;
  details?: string;
}
