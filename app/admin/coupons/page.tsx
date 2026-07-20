"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Coupon } from "@/types/database";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Tag, Trash2, Power, CheckCircle, Percent } from "lucide-react";

export default function CouponManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Create modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load coupons";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("coupons").insert({
        code: code.trim().toUpperCase(),
        discount_percent: discountPercent,
        active: true,
      });

      if (error) throw error;

      toast.success(`Coupon "${code.toUpperCase()}" created successfully!`);
      setCode("");
      setDiscountPercent(10);
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to create coupon code";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("coupons")
        .update({ active: !currentActive })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Coupon status updated to ${!currentActive ? "Active" : "Inactive"}`);
      fetchCoupons();
    } catch {
      toast.error("Failed to toggle coupon status");
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon code?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
      toast.success("Coupon code deleted.");
      fetchCoupons();
    } catch {
      toast.error("Failed to delete coupon code");
    }
  };

  const columns = [
    {
      key: "code",
      label: "Coupon Code",
      sortable: true,
      render: (item: Coupon) => (
        <span className="font-heading font-black text-foreground uppercase tracking-wider bg-accent/10 text-accent px-3 py-1 rounded-full text-xs">
          {item.code}
        </span>
      ),
    },
    {
      key: "discount_percent",
      label: "Discount Rate",
      sortable: true,
      render: (item: Coupon) => (
        <span className="font-heading font-extrabold text-foreground text-sm flex items-center gap-1">
          <Percent className="h-3.5 w-3.5 text-accent" />
          {item.discount_percent}% OFF
        </span>
      ),
    },
    {
      key: "active",
      label: "Status",
      sortable: true,
      render: (item: Coupon) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
            item.active
              ? "bg-green-500/10 text-green-500 border border-green-500/20"
              : "bg-red-500/10 text-red-500 border border-red-500/20"
          }`}
        >
          {item.active ? "Active" : "Disabled"}
        </span>
      ),
    },
    {
      key: "created_at",
      label: "Created Date",
      sortable: true,
      render: (item: Coupon) => (
        <span className="text-xs text-muted-foreground font-light">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: Coupon) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleToggleActive(item.id, item.active)}
            className={`h-8 w-8 rounded-full border flex items-center justify-center transition ${
              item.active
                ? "border-green-500/30 text-green-500 bg-green-500/5 hover:bg-green-500/15"
                : "border-muted-foreground/30 text-muted-foreground bg-muted/10 hover:bg-muted/20"
            }`}
            title={item.active ? "Deactivate Coupon" : "Activate Coupon"}
          >
            <Power className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteCoupon(item.id)}
            className="h-8 w-8 rounded-full border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/15 flex items-center justify-center transition"
            title="Delete Coupon"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse text-left">
        <div className="h-8 w-64 bg-muted/20 rounded-full" />
        <div className="h-[300px] bg-muted/15 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full text-left select-none">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="font-heading text-2xl font-black text-foreground uppercase tracking-wider flex items-center gap-2">
            <Tag className="h-6 w-6 text-accent" /> Coupon & Promo Code Manager
          </h1>
          <p className="text-xs text-muted-foreground font-light mt-0.5">
            Create custom promo discount codes for customer checkout reductions.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-10 rounded-full bg-accent hover:bg-accent/90 text-white font-black text-xs px-5 shadow-lg shadow-accent/20 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </div>

      {/* Coupons Table */}
      <DataTable
        columns={columns}
        data={coupons}
        searchPlaceholder="Search coupon code..."
        searchKeys={["code"]}
      />

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-card border border-border bg-[#0B0B0B]/95 p-6 md:p-8 rounded-3xl w-full max-w-md shadow-2xl flex flex-col gap-6 text-left">
            <div className="flex justify-between items-center border-b border-border/20 pb-4">
              <h3 className="font-heading text-lg font-black text-white uppercase tracking-wide">
                Create Promo Code
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Coupon Code
                </label>
                <Input
                  type="text"
                  placeholder="e.g. AURA20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="uppercase font-bold tracking-widest bg-muted/10 border-border/50 h-11"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Discount Percentage (%)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="font-bold bg-muted/10 border-border/50 h-11"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end border-t border-border/20 pt-4 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 rounded-full text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 rounded-full bg-accent hover:bg-accent/90 text-white font-black text-xs px-6"
                >
                  {isSubmitting ? "Saving..." : "Save Promo Code"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
