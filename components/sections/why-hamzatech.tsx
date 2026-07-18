"use client";

import React from "react";
import { ShieldCheck, RefreshCw, Leaf, Truck } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";

export function WhyHamzaTech() {
  const brandValues = [
    {
      title: "3-Year Signature Warranty",
      description: "Our confidence in carbon alloy architecture translates to a comprehensive 3-year hardware warranty on the Aura X1.",
      icon: <ShieldCheck className="h-6 w-6 text-accent" />,
    },
    {
      title: "Adaptive OTA Acoustic Updates",
      description: "We regularly update the active noise cancellation and digital signal processing algorithms over the air via our mobile companion app.",
      icon: <RefreshCw className="h-6 w-6 text-accent" />,
    },
    {
      title: "Eco-Luxury Materials",
      description: "Committed to circularity, we utilize 100% recycled aluminum housings and plastic-free plant-fiber composite cushions.",
      icon: <Leaf className="h-6 w-6 text-accent" />,
    },
    {
      title: "Free Express Insured Shipping",
      description: "Every pre-order includes complimentary global priority express delivery in custom protected carbon-neutral shipping crates.",
      icon: <Truck className="h-6 w-6 text-accent" />,
    },
  ];

  return (
    <section className="relative w-full py-20 md:py-28 bg-card border-t border-border overflow-hidden">
      <div className="absolute top-1/4 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Title Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <Reveal direction="down" delay={0.1}>
            <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
              Brand Integrity
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mt-4 mb-6 leading-tight">
              Why Choose HamzaTech
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
              We do not just manufacture headphones; we redefine the hardware relationship between user comfort, sound, and technology.
            </p>
          </Reveal>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {brandValues.map((value, index) => (
            <Reveal key={index} direction="up" delay={0.1 * index}>
              <div className="glass-card flex items-start gap-6 p-8 rounded-3xl border border-border/50 hover:border-accent/30 hover-lift transition-all duration-300">
                <div className="p-3.5 rounded-2xl bg-accent/10 w-fit shrink-0">
                  {value.icon}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-light">
                    {value.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
