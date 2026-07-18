"use client";

import React from "react";
import { ShieldCheck, Lock, Award, RotateCcw, Truck } from "lucide-react";

export function TrustBadges() {
  const badges = [
    { icon: Lock, title: "SSL Encrypted", desc: "256-bit protocol" },
    { icon: ShieldCheck, title: "Secure Checkout", desc: "Fully compliant gateway" },
    { icon: Award, title: "3 Year Warranty", desc: "Signature replacement" },
    { icon: RotateCcw, title: "30-Day Returns", desc: "Zero hassle returns" },
    { icon: Truck, title: "Insured Shipping", desc: "Fully priority dispatch" },
  ];

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-5 gap-4 border-t border-border/40 pt-10 mt-10">
      {badges.map((b, idx) => {
        const IconComp = b.icon;
        return (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border/40 bg-muted/5 text-center gap-2 hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="p-2 rounded-xl bg-accent/5 text-accent shrink-0">
              <IconComp className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">{b.title}</span>
              <span className="text-[9px] text-muted-foreground font-light mt-0.5">{b.desc}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
