import { createClient } from "@/lib/supabase/server";
import { Product, ServiceError } from "@/types/database";

export const productService = {
  // Fetch all published products
  async getProducts(): Promise<{ data: Product[] | null; error: ServiceError | null }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    return { data, error };
  },

  // Fetch product by slug
  async getProductBySlug(slug: string): Promise<{ data: Product | null; error: ServiceError | null }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    return { data, error };
  },

  // Fetch product by ID
  async getProductById(id: string): Promise<{ data: Product | null; error: ServiceError | null }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    return { data, error };
  },

  // Update stock level of product (decrements on order success)
  async deductStock(productId: string, quantity: number): Promise<{ success: boolean; error: ServiceError | null }> {
    const supabase = await createClient();
    
    // Fetch current product stock
    const { data: product, error: fetchErr } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .single();

    if (fetchErr || !product) {
      return { success: false, error: fetchErr || new Error("Product not found") };
    }

    if (product.stock < quantity) {
      return { success: false, error: new Error("Insufficient inventory stock") };
    }

    const { error: updateErr } = await supabase
      .from("products")
      .update({ stock: product.stock - quantity })
      .eq("id", productId);

    return { success: !updateErr, error: updateErr };
  },
};
