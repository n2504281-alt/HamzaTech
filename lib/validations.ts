import { z } from "zod";

// 1. Newsletter subscription validation
export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address for updates"),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

// 2. Product review validation
export const reviewSchema = z.object({
  productId: z.string().uuid("Invalid product ID reference"),
  rating: z.number().int().min(1, "Rating must be at least 1 star").max(5, "Rating cannot exceed 5 stars"),
  review: z.string().min(5, "Please write a review of at least 5 characters"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

// 3. Customer address validation
export const addressSchema = z.object({
  street: z.string().min(3, "Please write a valid street address"),
  city: z.string().min(1, "City details are required"),
  state: z.string().min(1, "State details are required"),
  postalCode: z.string().min(3, "Please enter a valid zip code"),
  country: z.string().min(1, "Country details are required"),
  isDefault: z.boolean(),
});

export type AddressInput = z.infer<typeof addressSchema>;

// 4. Order Item schema helper
export const orderItemSchema = z.object({
  // productId can be any string or null — UUID sanitization happens in the
  // action layer before this schema runs, so we don’t enforce .uuid() here.
  // Enforcing uuid() caused false rejections for legacy/placeholder IDs still
  // sitting in users’ persisted localStorage carts.
  productId: z.string().nullable(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Item price must be positive"),
  variant: z.string().min(1, "Variant name is required"),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;

// 5. Orders validation schema
export const orderSchema = z.object({
  subtotal: z.number().min(0),
  shippingFee: z.number().min(0),
  discount: z.number().min(0),
  tax: z.number().min(0),
  grandTotal: z.number().min(0),
  shippingAddressId: z.string().uuid("Please select a shipping address").nullable(),
  orderNotes: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1, "Your order must contain at least 1 item"),
});

export type OrderInput = z.infer<typeof orderSchema>;

// 6. Coupons validation
export const couponSchema = z.object({
  code: z.string().min(1, "Coupon code cannot be empty"),
});

export type CouponInput = z.infer<typeof couponSchema>;
