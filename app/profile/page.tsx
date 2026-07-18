"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { addressSchema, AddressInput } from "@/lib/validations";
import { Profile, Order, Address } from "@/types/database";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  Calendar,
  Shield,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  createAddressAction,
  setDefaultAddressAction,
  deleteAddressAction,
} from "@/actions/address";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "addresses">("overview");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Address validation form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      isDefault: false,
    },
  });

  const loadData = useCallback(async () => {
    try {
      // 1. Get User Auth
      const {
        data: { user },
        error: authErr,
      } = await supabase.auth.getUser();

      if (authErr || !user) {
        router.push("/login");
        return;
      }

      setEmail(user.email || "");

      // 2. Get profile details
      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profErr) {
        setProfile(prof);
      }

      // 3. Get orders list
      const { data: ords } = await supabase
        .from("orders")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false });

      setOrders(ords || []);

      // 4. Get address list
      const { data: addrs } = await supabase
        .from("addresses")
        .select("*")
        .eq("profile_id", user.id)
        .order("is_default", { ascending: false });

      setAddresses(addrs || []);
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : "Failed to load dashboard data.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message || "Failed to log out.");
      return;
    }
    toast.success("Logged out successfully.");
    router.push("/login");
    router.refresh();
  };

  const handleAddAddress = async (data: AddressInput) => {
    setActionLoading(true);
    const res = await createAddressAction(data);
    if (!res.success) {
      toast.error(res.error || "Failed to save address.");
      setActionLoading(false);
      return;
    }
    toast.success("Address added successfully!");
    reset();
    setShowAddressForm(false);
    loadData();
    setActionLoading(false);
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    const res = await setDefaultAddressAction(addressId);
    if (!res.success) {
      toast.error(res.error || "Failed to update default address.");
      return;
    }
    toast.success("Default address updated.");
    loadData();
  };

  const handleDeleteAddress = async (addressId: string) => {
    const res = await deleteAddressAction(addressId);
    if (!res.success) {
      toast.error(res.error || "Failed to delete address.");
      return;
    }
    toast.success("Address deleted.");
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center font-sans">
        <Loader2 className="h-8 w-8 text-accent animate-spin" />
        <span className="text-xs font-semibold text-muted-foreground mt-3">Loading Dashboard Data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4 text-left">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || "Profile"}
                  className="h-16 w-16 rounded-full border-2 border-accent/20 bg-muted"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-accent" />
                </div>
              )}
              <div>
                <h1 className="font-heading text-2xl font-black text-foreground tracking-tight">
                  {profile?.full_name || "Welcome!"}
                </h1>
                <p className="text-xs text-muted-foreground font-light">{email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="rounded-full border-border hover:bg-red-500/10 hover:text-red-500 text-xs font-semibold gap-2 h-10 px-5 text-foreground bg-background"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border/85 gap-6 mb-8 overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab("overview")}
              className={`text-xs font-bold uppercase tracking-wider pb-3 border-b-2 transition-all ${
                activeTab === "overview"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`text-xs font-bold uppercase tracking-wider pb-3 border-b-2 transition-all ${
                activeTab === "orders"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`text-xs font-bold uppercase tracking-wider pb-3 border-b-2 transition-all ${
                activeTab === "addresses"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Saved Addresses ({addresses.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 gap-8 text-left">
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile detail card */}
                <div className="md:col-span-2 glass-card border border-border/50 rounded-3xl p-6 bg-muted/5">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-4">Account Information</h3>
                  <div className="flex flex-col gap-4 text-sm font-semibold">
                    <div className="grid grid-cols-2 py-2 border-b border-border/10">
                      <span className="text-muted-foreground">Full Name</span>
                      <span>{profile?.full_name || "N/A"}</span>
                    </div>
                    <div className="grid grid-cols-2 py-2 border-b border-border/10">
                      <span className="text-muted-foreground">Registered Email</span>
                      <span>{email}</span>
                    </div>
                    <div className="grid grid-cols-2 py-2 border-b border-border/10">
                      <span className="text-muted-foreground">Phone Number</span>
                      <span>{profile?.phone || "Not provided"}</span>
                    </div>
                    <div className="grid grid-cols-2 py-2 border-b border-border/10">
                      <span className="text-muted-foreground">Profile Role</span>
                      <span className="flex items-center gap-1.5 capitalize">
                        <Shield className="h-4 w-4 text-accent" />
                        {profile?.role || "customer"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 py-2">
                      <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-accent" />
                        Joined Date
                      </span>
                      <span>
                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info summary sidebar */}
                <div className="flex flex-col gap-6">
                  <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black">{orders.length}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Orders</p>
                    </div>
                  </div>

                  <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black">{addresses.length}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Saved Addresses</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5">
                <h3 className="font-heading text-lg font-bold text-foreground mb-4">Order History</h3>
                {orders.length === 0 ? (
                  <div className="py-12 text-center flex flex-col items-center">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground/60 mb-3" />
                    <p className="text-xs text-muted-foreground font-light mb-4">You have not placed any orders yet.</p>
                    <Button onClick={() => router.push("/")} className="rounded-full bg-accent hover:bg-accent/90 text-white font-semibold text-xs h-10 px-6">
                      Explore Products
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                      <div key={order.id} className="p-4 rounded-2xl border border-border bg-background/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-accent">{order.order_number}</span>
                          <span className="text-[10px] text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-foreground">${order.grand_total.toFixed(2)}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            order.status === "delivered" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* List saved addresses */}
                <div className="md:col-span-2 flex flex-col gap-4">
                  {addresses.length === 0 ? (
                    <div className="glass-card border border-border/50 rounded-3xl p-8 bg-muted/5 text-center py-12 flex flex-col items-center">
                      <MapPin className="h-12 w-12 text-muted-foreground/60 mb-3" />
                      <p className="text-xs text-muted-foreground font-light">No saved addresses found.</p>
                    </div>
                  ) : (
                    addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`glass-card border rounded-3xl p-6 bg-muted/5 flex justify-between items-start gap-4 ${
                          address.is_default ? "border-accent/40 bg-accent/5" : "border-border/50"
                        }`}
                      >
                        <div className="flex flex-col gap-1 text-sm font-semibold">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-foreground">{address.street}</span>
                            {address.is_default && (
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">
                            {address.city}, {address.state} {address.postal_code}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium">{address.country}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {!address.is_default && (
                            <Button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              variant="ghost"
                              className="text-xs font-bold text-accent hover:underline h-8 px-3 rounded-full"
                            >
                              Make Default
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDeleteAddress(address.id)}
                            variant="ghost"
                            className="text-red-500 hover:bg-red-500/10 p-2 rounded-full h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Address Form Sidebar */}
                <div>
                  <Button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="w-full h-11 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-accent/15 mb-4"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Address
                  </Button>

                  {showAddressForm && (
                    <form
                      onSubmit={handleSubmit(handleAddAddress)}
                      className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-3 animate-fadeIn text-left"
                    >
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold uppercase text-foreground/75 tracking-wider">Street Address</label>
                        <Input
                          placeholder="123 Luxury Lane"
                          {...register("street")}
                          className="bg-background/40 border border-border/80 h-9 px-3 text-xs rounded-xl"
                        />
                        {errors.street && <span className="text-[9px] text-red-500">{errors.street.message}</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold uppercase text-foreground/75 tracking-wider">City</label>
                          <Input
                            placeholder="Beverly Hills"
                            {...register("city")}
                            className="bg-background/40 border border-border/80 h-9 px-3 text-xs rounded-xl"
                          />
                          {errors.city && <span className="text-[9px] text-red-500">{errors.city.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold uppercase text-foreground/75 tracking-wider">State</label>
                          <Input
                            placeholder="CA"
                            {...register("state")}
                            className="bg-background/40 border border-border/80 h-9 px-3 text-xs rounded-xl"
                          />
                          {errors.state && <span className="text-[9px] text-red-500">{errors.state.message}</span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold uppercase text-foreground/75 tracking-wider">Postal Code</label>
                          <Input
                            placeholder="90210"
                            {...register("postalCode")}
                            className="bg-background/40 border border-border/80 h-9 px-3 text-xs rounded-xl"
                          />
                          {errors.postalCode && <span className="text-[9px] text-red-500">{errors.postalCode.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold uppercase text-foreground/75 tracking-wider">Country</label>
                          <Input
                            placeholder="United States"
                            {...register("country")}
                            className="bg-background/40 border border-border/80 h-9 px-3 text-xs rounded-xl"
                          />
                          {errors.country && <span className="text-[9px] text-red-500">{errors.country.message}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          id="defaultAddress"
                          {...register("isDefault")}
                          className="h-4 w-4 rounded border-border/80 text-accent focus:ring-accent accent-accent cursor-pointer"
                        />
                        <label htmlFor="defaultAddress" className="text-xs font-semibold text-muted-foreground select-none cursor-pointer">
                          Set as default address
                        </label>
                      </div>

                      <Button
                        type="submit"
                        disabled={actionLoading}
                        className="w-full h-10 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold text-xs mt-2"
                      >
                        {actionLoading ? (
                          <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mx-auto" />
                        ) : (
                          "Save Address"
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
