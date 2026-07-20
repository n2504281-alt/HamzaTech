"use server";

import { createClient } from "@/lib/supabase/server";
import { orderSchema, OrderInput } from "@/lib/validations";
import { orderService } from "@/services/orderService";

export async function placeOrderAction(orderData: OrderInput) {
  try {
    const supabase = await createClient();

    // Check user session (optional for guest checkout)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user ? user.id : null;

    // Sanitize: map any non-UUID productId to null before Zod validation.
    // This prevents "Invalid product ID reference" for legacy slugs or
    // recommended accessory IDs that are not real database UUIDs.
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const sanitizedData = {
      ...orderData,
      items: orderData.items.map((item) => ({
        ...item,
        productId: item.productId && UUID_REGEX.test(item.productId) ? item.productId : null,
      })),
    };

    // Validate inputs
    const parsed = orderSchema.safeParse(sanitizedData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid order details",
      };
    }

    // Place order and deduct inventory stock
    const { data: newOrder, error } = await orderService.createOrder(parsed.data, userId);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to process and register your order details",
      };
    }

    return {
      success: true,
      data: newOrder,
    };
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "An unexpected error occurred during order authorization";
    return {
      success: false,
      error: errorMsg,
    };
  }
}
