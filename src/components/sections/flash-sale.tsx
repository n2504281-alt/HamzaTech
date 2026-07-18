"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { PRODUCTS } from "@/lib/mockData";

export function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = PRODUCTS.filter((p) => p.isFlashSale).slice(0, 4);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <section className="py-16 sm:py-24 bg-muted/20 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Countdown */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="space-y-4 text-center md:text-left">
            <span className="text-xs font-semibold text-red-600 uppercase tracking-widest font-heading flex items-center justify-center md:justify-start gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              Limited Time Only
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
              Aura Flash Event
            </h2>
            <p className="text-sm text-muted-foreground max-w-md font-sans">
              Exclusive pricing on select premium batches. Prices return to standard once timer expires.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center justify-center gap-3">
            <Timer className="h-5 w-5 text-red-600" />
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <span className="bg-primary text-primary-foreground text-lg sm:text-xl font-bold font-heading px-3 py-1.5 rounded-lg shadow-sm">
                  {formatNumber(timeLeft.hours)}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">hrs</span>
              </div>
              <span className="text-xl font-bold text-foreground -mt-5">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-primary text-primary-foreground text-lg sm:text-xl font-bold font-heading px-3 py-1.5 rounded-lg shadow-sm">
                  {formatNumber(timeLeft.minutes)}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">min</span>
              </div>
              <span className="text-xl font-bold text-foreground -mt-5">:</span>
              <div className="flex flex-col items-center">
                <span className="bg-primary text-primary-foreground text-lg sm:text-xl font-bold font-heading px-3 py-1.5 rounded-lg shadow-sm">
                  {formatNumber(timeLeft.seconds)}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">sec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashSaleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
