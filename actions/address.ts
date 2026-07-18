"use server";

import { createClient } from "@/lib/supabase/server";
import { addressSchema } from "@/lib/validations";
import { profileService } from "@/services/profileService";

// 1. Add Address
export async function createAddressAction(formData: {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return {
        success: false,
        error: "Unauthorized session. Please log in to manage addresses.",
      };
    }

    // Validate inputs
    const parsed = addressSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid address parameters",
      };
    }

    const { data, error } = await profileService.createAddress(user.id, parsed.data);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to create address record",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "An unexpected error occurred while adding address";
    return {
      success: false,
      error: errorMsg,
    };
  }
}

// 2. Set Default Address
export async function setDefaultAddressAction(addressId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return {
        success: false,
        error: "Unauthorized session",
      };
    }

    const { success, error } = await profileService.setDefaultAddress(user.id, addressId);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to update default address settings",
      };
    }

    return { success };
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "An unexpected error occurred while setting default address";
    return {
      success: false,
      error: errorMsg,
    };
  }
}

// 3. Delete Address
export async function deleteAddressAction(addressId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return {
        success: false,
        error: "Unauthorized session",
      };
    }

    const { success, error } = await profileService.deleteAddress(addressId);

    if (error) {
      return {
        success: false,
        error: error.message || "Failed to delete address record",
      };
    }

    return { success };
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "An unexpected error occurred while deleting address";
    return {
      success: false,
      error: errorMsg,
    };
  }
}
