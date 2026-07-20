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

    // Sanitize all IDs before Zod validation + DB insert.
    // Rules:
    //  1. Must match UUID format regex
    //  2. Must NOT be a fake/placeholder UUID (all-zeros pattern like 00000000-0000-0000-0000-000000000001)
    //     These are used as dummy IDs for hardcoded frontend products and are NOT in the DB.
    //  3. shippingAddressId follows same rules for guest checkout safety.
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    // Matches UUIDs where ALL hex digits are 0 except possibly the last few (placeholder pattern)
    const FAKE_UUID_REGEX = /^0{8}-0{4}-0{4}-0{4}-0+[0-9a-f]{0,4}$/i;

    const isRealUUID = (id: string | null | undefined): boolean => {
      if (!id) return false;
      if (!UUID_REGEX.test(id)) return false;
      if (FAKE_UUID_REGEX.test(id)) return false; // reject placeholder UUIDs
      return true;
    };

    const sanitizedData = {
      ...orderData,
      shippingAddressId: isRealUUID(orderData.shippingAddressId) ? orderData.shippingAddressId : null,
      items: orderData.items.map((item) => ({
        ...item,
        productId: isRealUUID(item.productId) ? item.productId : null,
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
