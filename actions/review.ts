"use server";

import { createClient } from "@/lib/supabase/server";
import { reviewSchema } from "@/lib/validations";
import { reviewService } from "@/services/reviewService";

export async function submitReviewAction(formData: {
  productId: string;
  rating: number;
  review: string;
}) {
  try {
    const supabase = await createClient();

    // 1. Get authenticated user
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return {
        success: false,
        error: "You must be logged in to submit a product review",
      };
    }

    // 2. Validate inputs
    const parsed = reviewSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid review inputs",
      };
    }

    // 3. Post review details
    const { data, error } = await reviewService.createReview(user.id, parsed.data);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to post review data",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "An unexpected error occurred during review submission";
    return {
      success: false,
      error: errorMsg,
    };
  }
}
