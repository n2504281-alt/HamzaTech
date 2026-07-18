import { createClient } from "@/lib/supabase/server";
import { Profile, Address, ServiceError } from "@/types/database";
import { AddressInput } from "@/lib/validations";

export const profileService = {
  // Fetch active user profile
  async getProfile(userId: string): Promise<{ data: Profile | null; error: ServiceError | null }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    return { data, error };
  },

  // Update profile variables
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ data: Profile | null; error: ServiceError | null }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    return { data, error };
  },

  // Fetch address list for a user profile
  async getAddresses(profileId: string): Promise<{ data: Address[] | null; error: ServiceError | null }> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("profile_id", profileId)
      .order("is_default", { ascending: false });

    return { data, error };
  },

  // Insert customer address
  async createAddress(profileId: string, input: AddressInput): Promise<{ data: Address | null; error: ServiceError | null }> {
    const supabase = await createClient();

    // If marked as default address, reset previous defaults first
    if (input.isDefault) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("profile_id", profileId);
    }

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        profile_id: profileId,
        street: input.street,
        city: input.city,
        state: input.state,
        postal_code: input.postalCode,
        country: input.country,
        is_default: input.isDefault,
      })
      .select()
      .single();

    return { data, error };
  },

  // Set address as default address
  async setDefaultAddress(profileId: string, addressId: string): Promise<{ success: boolean; error: ServiceError | null }> {
    const supabase = await createClient();
    
    // Reset defaults
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("profile_id", profileId);

    const { error } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", addressId);

    return { success: !error, error };
  },

  // Delete address
  async deleteAddress(addressId: string): Promise<{ success: boolean; error: ServiceError | null }> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", addressId);

    return { success: !error, error };
  },
};
