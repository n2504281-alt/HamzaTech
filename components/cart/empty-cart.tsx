"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 max-w-lg mx-auto text-center">
      
      {/* Volumetric Glowing Illustration Container */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Glow Ring backdrop */}
        <div className="absolute w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse" />
        
        {/* Main Icon */}
        <div className="relative h-20 w-20 rounded-full bg-muted/20 border border-border/60 flex items-center justify-center text-accent/80 shadow-inner">
          <ShoppingBag className="h-9 w-9" />
        </div>
      </div>

      {/* Message blocks */}
      <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
        Your Cart is Empty
      </h2>
      <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed font-sans mb-8">
        It looks like you haven&apos;t added any HamzaTech Aura X1 editions to your shopping list yet. Explore our flagship acoustic gear to get started.
      </p>

      {/* Action links */}
      <Link
        href="/"
        className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all gap-2.5 shadow-md shadow-accent/15"
      >
        <ArrowLeft className="h-4 w-4" />
        Continue Shopping
      </Link>

    </div>
  );
}
