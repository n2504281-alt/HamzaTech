"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  changeType?: "increase" | "decrease" | "neutral";
  icon: LucideIcon;
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
}: StatCardProps) {
  return (
    <div className="glass-card border border-border/50 rounded-3xl p-6 bg-muted/5 flex flex-col gap-4 text-left transition-all duration-300 hover:scale-[1.02] hover:border-accent/40 hover:bg-muted/10 relative overflow-hidden group select-none shadow-sm">
      {/* Background Volumetric Ambient Radial Glow on hover */}
      <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div className="h-9 w-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mt-1">
        <h3 className="font-heading text-2xl font-black text-foreground">
          {value}
        </h3>
        
        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-0.5">
            {changeType === "increase" ? (
              <span className="flex items-center text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                {change}
              </span>
            ) : changeType === "decrease" ? (
              <span className="flex items-center text-[10px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                <TrendingDown className="h-3 w-3 mr-0.5" />
                {change}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-muted-foreground bg-muted-foreground/10 px-2 py-0.5 rounded-full">
                {change}
              </span>
            )}
            {description && (
              <span className="text-[10px] text-muted-foreground font-light leading-none">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
