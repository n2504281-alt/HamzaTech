import { createClient } from "@/lib/supabase/server";
import { Order, OrderItem, ServiceError } from "@/types/database";
import { OrderInput } from "@/lib/validations";
import { productService } from "./productService";

export const orderService = {
  // Create order transaction
  async createOrder(input: OrderInput, userId: string | null): Promise<{ data: Order | null; error: ServiceError | null }> {
    const supabase = await createClient();

    // 1. Verify inventory stock for all products
    for (const item of input.items) {
      if (!item.productId) continue;
      const { data: prod } = await productService.getProductById(item.productId);
      if (!prod) {
        return { data: null, error: new Error(`Product reference not found: ${item.productId}`) };
      }
      if (prod.stock < item.quantity) {
        return { data: null, error: new Error(`Insufficient stock for product: ${prod.name}`) };
      }
    }

    // 2. Generate unique order number
    const randNum = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `HT-${randNum}-AX1`;

    // 3. Insert order record
    const { data: newOrder, error: orderErr } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        profile_id: userId,
        status: "pending",
        payment_status: "unpaid",
        shipping_status: "pending",
        subtotal: input.subtotal,
        shipping_fee: input.shippingFee,
        discount: input.discount,
        tax: input.tax,
        grand_total: input.grandTotal,
        shipping_address_id: input.shippingAddressId,
        order_notes: input.orderNotes,
      })
      .select()
      .single();

    if (orderErr || !newOrder) {
      return { data: null, error: orderErr || new Error("Failed to insert order record") };
    }

    // 4. Insert order items & deduct stock level
    const itemsData = input.items.map((item) => ({
      order_id: newOrder.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      variant: item.variant,
    }));

    const { error: itemsErr } = await supabase.from("order_items").insert(itemsData);

    if (itemsErr) {
      // Cleanup order on item insert failure
      await supabase.from("orders").delete().eq("id", newOrder.id);
      return { data: null, error: itemsErr };
    }

    // Deduct stock levels in parallel
    for (const item of input.items) {
      if (!item.productId) continue;
      await productService.deductStock(item.productId, item.quantity);
    }

    return { data: newOrder, error: null };
  },

  // Fetch orders list for a profile
  async getProfileOrders(profileId: string): Promise<{ data: Order[] | null; error: ServiceError | null }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    return { data, error };
  },

  // Fetch specific order details including line items
  async getOrderDetails(orderId: string): Promise<{ data: (Order & { items: OrderItem[] }) | null; error: ServiceError | null }> {
    const supabase = await createClient();
    
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderErr || !order) {
      return { data: null, error: orderErr || new Error("Order not found") };
    }

    const { data: items, error: itemsErr } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (itemsErr) {
      return { data: null, error: itemsErr };
    }

    return {
      data: {
        ...order,
        items: items || [],
      },
      error: null,
    };
  },
};
