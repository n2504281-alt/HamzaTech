"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";

export function ProductRelated() {
  const relatedProducts = [
    {
      id: "buds-pro",
      name: "Aura Buds Pro",
      category: "Wireless Earbuds",
      description: "Hi-Res acoustics with adaptive hybrid noise cancellation packed in a micro ceramic chassis.",
      price: "$199.00",
      rating: 4.8,
      isUpcoming: false,
    },
    {
      id: "soundbar-x",
      name: "Aura Soundbar X",
      category: "Spatial Speakers",
      description: "Volumetric room-filling acoustics utilizing 9 beryllium driver arrays with dynamic beamforming.",
      price: "$599.00",
      rating: 4.9,
      isUpcoming: true,
    },
  ];

  return (
    <section className="relative w-full py-20 md:py-28 bg-background border-t border-border overflow-hidden">
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <Reveal direction="down" delay={0.1}>
            <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
              Brand Companions
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mt-4 mb-6 leading-tight">
              Related Creations
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
              Explore secondary devices designed to complement the acoustic ecosystem of the Aura X1.
            </p>
          </Reveal>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
          {relatedProducts.map((prod, idx) => (
            <Reveal key={prod.id} direction="up" delay={idx * 0.15 + 0.1}>
              <div className="glass-card p-8 rounded-3xl border border-border/50 bg-muted/5 flex flex-col gap-6 hover-lift transition-all duration-300 h-full relative overflow-hidden group">
                
                {/* Upcoming Badge */}
                {prod.isUpcoming && (
                  <div className="absolute top-4 right-4 bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded text-[10px] font-extrabold text-accent flex items-center gap-1">
                    <Sparkles className="h-3 w-3 animate-pulse" /> UPCOMING
                  </div>
                )}

                {/* Product Meta */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                    {prod.category}
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-foreground group-hover:text-accent transition-colors">
                    {prod.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm font-light leading-relaxed flex-1">
                  {prod.description}
                </p>

                {/* Bottom line price and actions */}
                <div className="flex items-center justify-between border-t border-border/20 pt-6 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Est. Price</span>
                    <span className="text-lg font-extrabold text-foreground">{prod.price}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-xs font-semibold mr-4">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span className="text-foreground">{prod.rating}</span>
                    </div>

                    {prod.isUpcoming ? (
                      <span className="text-xs font-bold text-muted-foreground bg-muted px-4 py-2 rounded-full cursor-not-allowed">
                        Register Interest
                      </span>
                    ) : (
                      <Link
                        href="#"
                        className="flex items-center justify-center h-10 w-10 rounded-full bg-accent hover:bg-accent/90 text-white transition-all hover:scale-105 active:scale-95"
                        aria-label={`View details for ${prod.name}`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>

              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
