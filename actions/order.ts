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

    // Validate inputs
    console.log("Order Data:", JSON.stringify(orderData, null, 2));
    const parsed = orderSchema.safeParse(orderData);
    if (!parsed.success) {
      console.error("Validation failed:", parsed.error.format());
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
