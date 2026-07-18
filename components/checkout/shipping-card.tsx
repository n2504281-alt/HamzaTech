"use client";

import React from "react";
import { Check, Truck, Clock, Sparkles } from "lucide-react";

export type DeliveryTier = "standard" | "express" | "nextday";

interface ShippingCardProps {
  selectedTier: DeliveryTier;
  onTierChange: (tier: DeliveryTier, fee: number) => void;
}

export function ShippingCard({ selectedTier, onTierChange }: ShippingCardProps) {
  
  // Format dynamic dates
  const getEtaDate = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const deliveryOptions = [
    {
      id: "standard" as DeliveryTier,
      name: "Standard Ground Delivery",
      price: 0,
      eta: `Delivered by ${getEtaDate(6)}`,
      desc: "Fully tracked economy courier service.",
      icon: Clock,
    },
    {
      id: "express" as DeliveryTier,
      name: "Priority Express Shipping",
      price: 15.0,
      eta: `Delivered by ${getEtaDate(3)}`,
      desc: "Priority express airfreight courier package.",
      icon: Truck,
    },
    {
      id: "nextday" as DeliveryTier,
      name: "Next Day Air Dispatch",
      price: 35.0,
      eta: `Delivered tomorrow, ${getEtaDate(1)}`,
      desc: "Signature courier dispatch within 24 hours.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      <h3 className="font-heading text-lg font-black text-foreground uppercase tracking-wide border-b border-border/20 pb-4">
        Delivery Method
      </h3>

      <div className="flex flex-col gap-3.5">
        {deliveryOptions.map((opt) => {
          const IconComp = opt.icon;
          const isSelected = selectedTier === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => onTierChange(opt.id, opt.price)}
              type="button"
              className={`glass-card border rounded-3xl p-4 flex items-center justify-between transition-all duration-300 hover:scale-[1.01] text-left w-full ${
                isSelected
                  ? "border-accent bg-accent/5 ring-1 ring-accent"
                  : "border-border/60 hover:border-accent/40 bg-muted/5"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Active Indicator Icon */}
                <div
                  className={`h-10 w-10 rounded-2xl border flex items-center justify-center transition-all ${
                    isSelected ? "bg-accent/15 text-accent border-accent/20" : "bg-muted/10 text-muted-foreground border-border/40"
                  }`}
                >
                  <IconComp className="h-5 w-5" />
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-foreground">{opt.name}</span>
                  <span className="text-[10px] text-muted-foreground font-light">{opt.desc}</span>
                  <span className="text-[10px] font-bold text-accent mt-0.5">{opt.eta}</span>
                </div>
              </div>

              {/* Price Tag & Radio dot */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-xs font-extrabold text-foreground">
                  {opt.price === 0 ? "FREE" : `$${opt.price.toFixed(2)}`}
                </span>
                
                <div
                  className={`h-5.5 w-5.5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected ? "border-accent bg-accent" : "border-border/60 bg-transparent"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 text-white stroke-[3.5]" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
