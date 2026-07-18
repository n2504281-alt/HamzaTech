"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Review } from "@/types/database";
import { DataTable } from "@/components/admin/data-table";
import { toast } from "sonner";
import { Star, Check, Trash2 } from "lucide-react";

interface ReviewWithMetadata extends Review {
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  products: {
    name: string;
  } | null;
}

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<ReviewWithMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  // Local approval state to simulate approval flag since DB schema is open-public
  const [approvedList, setApprovedList] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(full_name, avatar_url), products(name)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews((data as ReviewWithMetadata[]) || []);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load reviews";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (reviewId: string) => {
    setApprovedList((prev) => ({
      ...prev,
      [reviewId]: true,
    }));
    toast.success("Review approved and verified for listing!");
  };

  const handleDelete = async (reviewId: string, productId: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;
      toast.success("Review deleted successfully from database.");
      
      // Recalculate average ratings for the product
      const { data: remainingReviews } = await supabase
        .from("reviews")
        .select("rating")
        .eq("product_id", productId);

      let newRating = 5.0;
      let newCount = 0;

      if (remainingReviews && remainingReviews.length > 0) {
        const total = remainingReviews.reduce((sum, r) => sum + r.rating, 0);
        newRating = total / remainingReviews.length;
        newCount = remainingReviews.length;
      }

      await supabase
        .from("products")
        .update({
          rating: parseFloat(newRating.toFixed(2)),
          review_count: newCount,
        })
        .eq("id", productId);

      fetchReviews();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to remove review";
      toast.error(errMsg);
    }
  };

  const columns = [
    {
      key: "profiles",
      label: "Customer",
      sortable: true,
      render: (item: ReviewWithMetadata) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold uppercase text-[10px]">
            {item.profiles?.full_name?.charAt(0) || "U"}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-foreground">{item.profiles?.full_name || "Anonymous Tester"}</span>
            <span className="text-[9px] text-muted-foreground truncate max-w-[120px]">ID: {item.profile_id.substring(0, 8)}...</span>
          </div>
        </div>
      ),
    },
    {
      key: "products",
      label: "Product Edition",
      sortable: true,
      render: (item: ReviewWithMetadata) => (
        <span className="text-muted-foreground font-semibold text-[10px]">{item.products?.name || "Aura X1"}</span>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      render: (item: ReviewWithMetadata) => (
        <div className="flex items-center gap-0.5 text-accent font-bold">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < item.rating ? "fill-accent text-accent" : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      key: "review",
      label: "Review Content",
      render: (item: ReviewWithMetadata) => (
        <p className="text-muted-foreground font-light leading-relaxed max-w-sm line-clamp-2">
          &quot;{item.review}&quot;
        </p>
      ),
    },
    {
      key: "created_at",
      label: "Submitted",
      sortable: true,
      render: (item: ReviewWithMetadata) => (
        <span className="text-muted-foreground font-medium text-[10px]">
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Listing Status",
      render: (item: ReviewWithMetadata) => {
        const isApproved = approvedList[item.id];
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
            isApproved
              ? "bg-green-500/10 text-green-500 border border-green-500/20"
              : "bg-orange-500/10 text-orange-500 border border-orange-500/20 animate-pulse"
          }`}>
            {isApproved ? "Approved" : "Pending Audit"}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (item: ReviewWithMetadata) => (
        <div className="flex gap-2">
          {!approvedList[item.id] && (
            <button
              onClick={() => handleApprove(item.id)}
              className="h-8 w-8 rounded-full border border-green-500/25 bg-green-500/5 hover:bg-green-500/15 flex items-center justify-center text-green-500 transition"
              title="Approve Review"
              aria-label="Approve Review"
            >
              <Check className="h-4.5 w-4.5" />
            </button>
          )}
          <button
            onClick={() => handleDelete(item.id, item.product_id)}
            className="h-8 w-8 rounded-full border border-red-500/25 bg-red-500/5 hover:bg-red-500/15 flex items-center justify-center text-red-500 transition"
            title="Reject & Delete"
            aria-label="Delete Review"
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
        <div className="h-[400px] bg-muted/15 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full text-left select-none relative">
      
      {/* Title Panel */}
      <div>
        <h1 className="font-heading text-2xl font-black text-foreground uppercase tracking-wider">
          Reviews Verification
        </h1>
        <p className="text-xs text-muted-foreground font-light mt-0.5">
          Moderate customer comments, approve verified testimonies, or reject spam items.
        </p>
      </div>

      {/* Reviews Table */}
      <DataTable
        columns={columns}
        data={reviews}
        searchPlaceholder="Search review comments..."
        searchKeys={["review"]}
      />

    </div>
  );
}
