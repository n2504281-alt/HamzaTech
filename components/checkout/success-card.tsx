"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Sparkles, ArrowRight, Download, Calendar, Mail } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { Reveal } from "@/components/animations/reveal";

interface SuccessCardProps {
  email: string;
  orderNumber?: string;
}

export function SuccessCard({ email, orderNumber: propOrderNumber }: SuccessCardProps) {
  const clearCart = useCartStore((state) => state.clearCart);
  const [orderNumber, setOrderNumber] = useState(propOrderNumber || "");

  useEffect(() => {
    if (!propOrderNumber) {
      // Generate mock order number on mount if not provided
      const num = Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(`HT-${num}-AX1`);
    }
    // Clear items in checkout store
    clearCart();
  }, [clearCart, propOrderNumber]);

  const handleDownloadInvoice = () => {
    toast.success("Downloading invoice PDF... (Simulated file download).");
  };

  // ETA Calculation
  const getEtaDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3); // 3 days default
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 max-w-xl mx-auto text-center">
      
      {/* Volumetric Glowing Success Badge */}
      <Reveal direction="down" delay={0.1}>
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse" />
          <div className="relative h-20 w-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500 shadow-inner">
            <CheckCircle className="h-10 w-10" />
          </div>
        </div>
      </Reveal>

      {/* Thank you details */}
      <Reveal direction="up" delay={0.2}>
        <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mx-auto mb-3">
          <Sparkles className="h-3.5 w-3.5 text-accent animate-spin" style={{ animationDuration: "6s" }} />
          Order Placed Successfully
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
          Thank You For Your Order!
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed font-sans mb-8">
          Your payment has been completed. A confirmation email with invoice details was sent to <span className="font-semibold text-foreground">{email || "your-email@example.com"}</span>.
        </p>
      </Reveal>

      {/* Order info details box */}
      <Reveal direction="up" delay={0.3}>
        <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-4 text-left w-full mb-8">
          
          <div className="flex justify-between items-center text-sm border-b border-border/20 pb-3">
            <span className="text-muted-foreground font-medium">Order Number:</span>
            <span className="font-heading font-extrabold text-foreground">{orderNumber}</span>
          </div>

          <div className="flex items-start gap-3.5 text-xs text-muted-foreground">
            <Calendar className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-foreground block">Estimated Delivery ETA</span>
              <span className="font-light mt-0.5 block">Estimated arrival by {getEtaDate()} via Priority Express.</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 text-xs text-muted-foreground">
            <Mail className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-foreground block">Confirmation Dispatch</span>
              <span className="font-light mt-0.5 block">Order updates and live shipment tracking codes will follow shortly.</span>
            </div>
          </div>

        </div>
      </Reveal>

      {/* Actions */}
      <Reveal direction="up" delay={0.4}>
        <div className="flex flex-col sm:flex-row gap-4 w-full items-center justify-center">
          <button
            onClick={handleDownloadInvoice}
            className="w-full sm:w-auto h-12 px-6 rounded-full border border-border bg-card hover:bg-muted font-semibold text-xs text-foreground transition-all flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Invoice
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-accent/15"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>

    </div>
  );
}
