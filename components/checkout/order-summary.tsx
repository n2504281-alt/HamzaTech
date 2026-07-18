"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface OrderSummaryProps {
  shippingFee: number;
  discountPercent: number;
  onApplyDiscount: (percent: number) => void;
}

export function OrderSummary({
  shippingFee,
  discountPercent,
  onApplyDiscount,
}: OrderSummaryProps) {
  const cartItems = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getTotalPrice());

  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(discountPercent > 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();

    if (code === "") {
      toast.error("Please enter a coupon code.");
      return;
    }

    if (code === "AURA20") {
      onApplyDiscount(20);
      setIsCouponApplied(true);
      toast.success("Coupon 'AURA20' applied! 20% Discount has been deducted.");
    } else {
      toast.error("Invalid coupon code. Try 'AURA20' for testing.");
    }
  };

  const handleRemoveCoupon = () => {
    onApplyDiscount(0);
    setIsCouponApplied(false);
    setCouponCode("");
    toast.info("Coupon code removed.");
  };

  // Calculations
  const discountAmount = subtotal * (discountPercent / 100);
  const taxAmount = subtotal * 0.08;
  const grandTotal = subtotal - discountAmount + taxAmount + shippingFee;

  const getColorVariant = (name: string, id: string) => {
    if (name.includes("Carbon Black") || id.includes("black")) {
      return "Carbon Black";
    }
    if (name.includes("Ceramic White") || id.includes("white")) {
      return "Ceramic White";
    }
    return "Orange Edition";
  };

  return (
    <div className="glass-card border border-border/50 rounded-3xl p-6 md:p-8 bg-muted/5 flex flex-col gap-6 text-left">
      <h3 className="font-heading text-lg font-black text-foreground uppercase tracking-wide border-b border-border/20 pb-4">
        Order Summary
      </h3>

      {/* Cart Items List */}
      <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-1">
        {cartItems.map((item) => (
          <div key={item.product.id} className="flex gap-4 items-center">
            {/* Image */}
            <div className="relative aspect-square w-14 h-14 rounded-xl border border-border/40 bg-muted/20 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
              <Image
                src={item.product.image_url}
                alt={item.product.name}
                fill
                className="object-contain p-1"
                sizes="56px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col text-left min-w-0">
              <h4 className="text-xs font-bold text-foreground truncate leading-tight">
                Aura X1
              </h4>
              <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Color: {getColorVariant(item.product.name, item.product.id)}
              </span>
              <span className="text-[10px] text-muted-foreground font-light">
                Qty: {item.quantity} x ${item.product.price.toFixed(2)}
              </span>
            </div>

            {/* Total */}
            <span className="text-xs font-extrabold text-foreground shrink-0">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Coupon Form inside summary card */}
      <div className="border-t border-border/20 pt-4 mt-1">
        {isCouponApplied ? (
          <div className="flex items-center justify-between border border-accent/20 bg-accent/5 rounded-2xl p-3 text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
              AURA20 Applied (20%)
            </span>
            <button
              onClick={handleRemoveCoupon}
              className="text-xs text-accent hover:underline font-bold"
              type="button"
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 bg-background border border-border/80 rounded-full h-10 px-4 text-xs font-semibold text-foreground focus:outline-none placeholder:text-muted-foreground/45 uppercase"
              aria-label="Coupon code input"
            />
            <Button
              type="submit"
              className="h-10 rounded-full px-4 bg-accent hover:bg-accent/90 text-white font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Apply
            </Button>
          </form>
        )}
      </div>

      {/* Totals Summary list */}
      <div className="flex flex-col gap-3 border-t border-border/20 pt-4 text-xs">
        <div className="flex justify-between font-semibold text-muted-foreground">
          <span>Subtotal</span>
          <span className="text-foreground">${subtotal.toFixed(2)}</span>
        </div>

        {discountPercent > 0 && (
          <div className="flex justify-between font-bold text-accent">
            <span>Promo Discount ({discountPercent}%)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold text-muted-foreground">
          <span>Shipping fee</span>
          <span className="text-foreground">
            {shippingFee === 0 ? (
              <span className="text-green-500 font-bold uppercase tracking-wider">Free Shipping</span>
            ) : (
              `$${shippingFee.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between font-semibold text-muted-foreground">
          <span>Estimated Sales Tax (8%)</span>
          <span className="text-foreground">${taxAmount.toFixed(2)}</span>
        </div>

        {/* Grand Total */}
        <div className="flex justify-between border-t border-border/20 pt-4 mt-1.5 items-baseline">
          <span className="font-heading text-sm font-extrabold text-foreground uppercase tracking-wide">
            Grand Total
          </span>
          <span className="font-heading text-2xl font-black text-accent">
            ${grandTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Security details badges */}
      <div className="flex flex-col gap-2.5 border-t border-border/20 pt-5 mt-1 text-[10px] font-medium text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
          <span>SSL Secured Encrypted Checkout</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Truck className="h-4 w-4 text-accent shrink-0" />
          <span>Tracked priority courier packaging</span>
        </div>
      </div>
    </div>
  );
}
