"use client";

import React from "react";
import { Star, CheckCircle } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { HoverTilt } from "@/components/animations/hover-tilt";

export function Reviews() {
  const reviews = [
    {
      name: "Marcus Vance",
      role: "Lead Acoustic Engineer, London",
      rating: 5,
      comment: "The transient response is unbelievable. The beryllium driver handles complex symphonic layers without a hint of harmonic distortion. ANC is clean, silent, and has zero pressure build-up.",
      initials: "MV",
    },
    {
      name: "Sora Takahashi",
      role: "Minimalist Product Designer, Tokyo",
      rating: 5,
      comment: "A breathtaking union of mechanical detail and digital performance. The glass dial scroll feels analog and physical, while the carbon alloy body sits weightless on the head. Pure industrial art.",
      initials: "ST",
    },
    {
      name: "Elena Rostova",
      role: "Electronic Music Producer, Berlin",
      rating: 5,
      comment: "The custom soundstage and low-frequency mapping makes mixing on-the-go actually possible. ANC cuts sub-bass train rumble instantly. Orange LED rings add a killer futuristic touch.",
      initials: "ER",
    },
  ];

  return (
    <section id="reviews" className="relative w-full py-20 md:py-28 bg-background border-t border-border overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <Reveal direction="down" delay={0.1}>
            <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
              Critical Acclaim
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mt-4 mb-6 leading-tight">
              Verified User Reviews
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
              Discover why premium creators, audiophiles, and engineering leads choose the Aura X1.
            </p>
          </Reveal>
        </div>

        {/* Global Score Panel */}
        <Reveal direction="up" delay={0.35}>
          <div className="glass-card max-w-md mx-auto p-6 rounded-3xl border border-border/60 text-center mb-16 backdrop-blur-md">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-accent fill-accent" />
              ))}
            </div>
            <h3 className="font-heading text-3xl font-black text-foreground">4.9 / 5.0</h3>
            <p className="text-muted-foreground text-xs font-light mt-2 flex items-center justify-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-accent" />
              Based on over 1,200+ verified audiophile reviews
            </p>
          </div>
        </Reveal>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <Reveal key={index} direction="up" delay={0.1 * index}>
              <HoverTilt maxRotation={5} className="h-full">
                <div className="glass-card h-full p-8 rounded-3xl border border-border/50 flex flex-col justify-between hover-lift">
                  <div>
                    {/* Stars and Initials */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-accent fill-accent" />
                        ))}
                      </div>
                      <div className="h-10 w-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-heading text-sm font-bold text-accent">
                        {rev.initials}
                      </div>
                    </div>

                    {/* Review Comment */}
                    <p className="text-muted-foreground text-sm font-light leading-relaxed italic mb-6">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>

                  {/* Profile Signature */}
                  <div className="border-t border-border/40 pt-4 flex flex-col mt-4">
                    <span className="font-heading text-base font-bold text-foreground">
                      {rev.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-light tracking-wide mt-1">
                      {rev.role}
                    </span>
                  </div>
                </div>
              </HoverTilt>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
