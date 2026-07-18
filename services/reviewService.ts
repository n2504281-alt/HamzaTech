import { createClient } from "@/lib/supabase/server";
import { Review, ServiceError } from "@/types/database";
import { ReviewInput } from "@/lib/validations";

export const reviewService = {
  // Add product review
  async createReview(profileId: string, input: ReviewInput): Promise<{ data: Review | null; error: ServiceError | null }> {
    const supabase = await createClient();

    // 1. Insert review
    const { data: newReview, error: reviewErr } = await supabase
      .from("reviews")
      .insert({
        product_id: input.productId,
        profile_id: profileId,
        rating: input.rating,
        review: input.review,
        verified_purchase: true, // Mock verified purchases for checkout testers
      })
      .select()
      .single();

    if (reviewErr || !newReview) {
      return { data: null, error: reviewErr || new Error("Failed to post review details") };
    }

    // 2. Recalculate and refresh product aggregate ratings
    const { data: allReviews, error: aggErr } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", input.productId);

    if (!aggErr && allReviews && allReviews.length > 0) {
      const totalRatings = allReviews.reduce((sum, item) => sum + item.rating, 0);
      const averageRating = totalRatings / allReviews.length;

      // Update product table with aggregated values
      await supabase
        .from("products")
        .update({
          rating: parseFloat(averageRating.toFixed(2)),
          review_count: allReviews.length,
        })
        .eq("id", input.productId);
    }

    return { data: newReview, error: null };
  },

  // Fetch reviews for a specific product
  async getProductReviews(productId: string): Promise<{ data: Review[] | null; error: ServiceError | null }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*, profiles(full_name, avatar_url)")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    return { data, error };
  },
};
