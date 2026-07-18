export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  hover_image_url?: string;
  features?: string[];
  specs?: Record<string, string>;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: string;
  user_id?: string;
  email: string;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country: string;
  total_amount: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  order_items?: OrderItem[];
}
