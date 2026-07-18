"use server";

import { newsletterSchema } from "@/lib/validations";
import { newsletterService } from "@/services/newsletterService";

export async function subscribeNewsletterAction(formData: { email: string }) {
  try {
    // Validate inputs
    const parsed = newsletterSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid email address",
      };
    }

    const { email } = parsed.data;
    const { data, error } = await newsletterService.subscribe(email);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to subscribe to newsletter",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "An unexpected error occurred during subscription";
    return {
      success: false,
      error: errorMsg,
    };
  }
}
