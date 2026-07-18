"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  discountPercent: number;
}

export function OrderSummary({ subtotal, discountPercent }: OrderSummaryProps) {
  const router = useRouter();

  // Tax is a fixed placeholder (e.g. 8% of subtotal)
  const tax = subtotal * 0.08;
  const shippingFee = subtotal > 150 ? 0 : 15.0; // Free shipping over $150
  const discountAmount = subtotal * (discountPercent / 100);
  const grandTotal = subtotal - discountAmount + tax + shippingFee;

  const handleCheckoutProceed = () => {
    router.push("/checkout");
  };

  return (
    <div className="glass-card border border-border/50 rounded-3xl p-6 md:p-8 bg-muted/5 flex flex-col gap-6 text-left">
      <h3 className="font-heading text-lg font-black text-foreground uppercase tracking-wide border-b border-border/20 pb-4">
        Order Summary
      </h3>

      {/* Pricing Lines */}
      <div className="flex flex-col gap-3.5">
        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
          <span>Subtotal</span>
          <span className="text-foreground">${subtotal.toFixed(2)}</span>
        </div>

        {discountPercent > 0 && (
          <div className="flex justify-between text-xs font-bold text-accent">
            <span>Promo Discount ({discountPercent}%)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
          <span>Estimated Shipping</span>
          <span className="text-foreground">
            {shippingFee === 0 ? (
              <span className="text-green-500 font-bold uppercase tracking-wider">Free Shipping</span>
            ) : (
              `$${shippingFee.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-xs font-semibold text-muted-foreground">
          <span>Estimated Sales Tax (8%)</span>
          <span className="text-foreground">${tax.toFixed(2)}</span>
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

      {/* Proceed CTA */}
      <Button
        onClick={handleCheckoutProceed}
        className="w-full h-13 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md shadow-accent/15 mt-2"
      >
        Proceed to Checkout
        <ArrowRight className="h-4.5 w-4.5" />
      </Button>

      {/* Trust Badges under checkout */}
      <div className="flex flex-col gap-2.5 border-t border-border/20 pt-5 mt-2 text-[10px] font-medium text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
          <span>Fully Secure 256-bit SSL Checkout Gateway</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Truck className="h-4 w-4 text-accent shrink-0" />
          <span>Priority Express Insured Dispatch Included</span>
        </div>
        <div className="flex items-center gap-2.5">
          <RotateCcw className="h-4 w-4 text-accent shrink-0" />
          <span>30-Day Complied Circular Refund Guarantee</span>
        </div>
      </div>
    </div>
  );
}
