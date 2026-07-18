"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, X, Check } from "lucide-react";
import { toast } from "sonner";

interface CouponBoxProps {
  onApplyDiscount: (percent: number) => void;
  activeDiscount: number;
}

export function CouponBox({ onApplyDiscount, activeDiscount }: CouponBoxProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isApplied, setIsApplied] = useState(activeDiscount > 0);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();

    if (cleanCode === "") {
      toast.error("Please enter a coupon code.");
      return;
    }

    if (cleanCode === "AURA20") {
      onApplyDiscount(20);
      setIsApplied(true);
      toast.success("Coupon 'AURA20' applied! 20% Discount has been deducted.");
    } else {
      toast.error("Invalid coupon code. Try entering 'AURA20' for verification.");
    }
  };

  const handleRemove = () => {
    onApplyDiscount(0);
    setIsApplied(false);
    setCouponCode("");
    toast.info("Coupon code removed.");
  };

  return (
    <div className="glass-card border border-border/50 rounded-3xl p-5 md:p-6 bg-muted/5 flex flex-col gap-4 text-left">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4.5 w-4.5 text-accent animate-pulse" />
        <h4 className="font-heading text-sm font-bold text-foreground uppercase tracking-wide">
          Promotional Code
        </h4>
      </div>

      {isApplied ? (
        <div className="flex items-center justify-between border border-accent/20 bg-accent/5 rounded-2xl p-4 transition-all duration-300">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-full bg-accent/15 text-accent">
              <Check className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground">AURA20 Applied</span>
              <span className="text-[10px] text-muted-foreground font-light mt-0.5">20% Promo Discount</span>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-muted-foreground hover:text-red-500 transition-colors p-1.5 hover:bg-muted rounded-full"
            aria-label="Remove coupon"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2 w-full">
          <input
            type="text"
            placeholder="e.g. AURA20"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 bg-background border border-border/80 rounded-full h-11 px-4 text-xs font-semibold text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/40 placeholder:text-muted-foreground/50 uppercase"
            aria-label="Coupon code input"
          />
          <Button
            type="submit"
            className="h-11 rounded-full px-5 bg-accent hover:bg-accent/90 text-white font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Apply
          </Button>
        </form>
      )}

      <span className="text-[10px] text-muted-foreground/75 font-light">
        * Enter code <span className="font-semibold text-accent uppercase">AURA20</span> to save 20% on checkout orders instantly.
      </span>
    </div>
  );
}
