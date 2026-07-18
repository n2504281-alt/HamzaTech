import { createClient } from "@/lib/supabase/server";
import { NewsletterSubscriber, ServiceError } from "@/types/database";

export const newsletterService = {
  // Subscribe email
  async subscribe(email: string): Promise<{ data: NewsletterSubscriber | null; error: ServiceError | null }> {
    const supabase = await createClient();

    // Check if email already exists
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("email", email)
      .single();

    if (existing) {
      if (!existing.active) {
        // Reactivate
        const { data, error } = await supabase
          .from("newsletter_subscribers")
          .update({ active: true })
          .eq("email", email)
          .select()
          .single();
        return { data, error };
      }
      return { data: existing, error: null };
    }

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, active: true })
      .select()
      .single();

    return { data, error };
  },

  // Unsubscribe email
  async unsubscribe(email: string): Promise<{ success: boolean; error: ServiceError | null }> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ active: false })
      .eq("email", email);

    return { success: !error, error };
  },
};
