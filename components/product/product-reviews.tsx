"use client";

import React, { useState } from "react";
import { Star, CheckCircle, ThumbsUp, Sparkles } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";

interface ReviewItem {
  id: string;
  name: string;
  country: string;
  rating: number;
  date: string;
  comment: string;
  helpfulCount: number;
  initials: string;
}

export function ProductReviews() {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([
    {
      id: "rev-1",
      name: "Marcus Vance",
      country: "London, UK",
      rating: 5,
      date: "May 12, 2026",
      comment: "The transient response is unbelievable. The beryllium driver handles complex symphonic layers without a hint of harmonic distortion. ANC is clean, silent, and has zero pressure build-up.",
      helpfulCount: 42,
      initials: "MV",
    },
    {
      id: "rev-2",
      name: "Sora Takahashi",
      country: "Tokyo, Japan",
      rating: 5,
      date: "June 02, 2026",
      comment: "A breathtaking union of mechanical detail and digital performance. The glass dial scroll feels analog and physical, while the carbon alloy body sits weightless on the head. Pure industrial art.",
      helpfulCount: 28,
      initials: "ST",
    },
    {
      id: "rev-3",
      name: "Elena Rostova",
      country: "Berlin, Germany",
      rating: 5,
      date: "June 25, 2026",
      comment: "The custom soundstage and low-frequency mapping makes mixing on-the-go actually possible. ANC cuts sub-bass train rumble instantly. Orange LED rings add a killer futuristic touch.",
      helpfulCount: 17,
      initials: "ER",
    },
    {
      id: "rev-4",
      name: "Lucas Dupont",
      country: "Paris, France",
      rating: 4,
      date: "July 08, 2026",
      comment: "Exceptional audio fidelity and incredibly comfortable ear cushions. The orange breathing rings look insane in dark rooms. Docked 1 star because the companion app took 2 minutes to sync initially, but subsequent connection is instant.",
      helpfulCount: 9,
      initials: "LD",
    },
  ]);

  const [votedIds, setVotedIds] = useState<Record<string, boolean>>({});

  const handleHelpfulClick = (id: string) => {
    if (votedIds[id]) return; // limit one vote
    setReviewsList((prev) =>
      prev.map((rev) => (rev.id === id ? { ...rev, helpfulCount: rev.helpfulCount + 1 } : rev))
    );
    setVotedIds((prev) => ({ ...prev, [id]: true }));
  };

  const ratingStats = [
    { stars: 5, percentage: 88 },
    { stars: 4, percentage: 9 },
    { stars: 3, percentage: 2 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 0 },
  ];

  return (
    <section id="reviews" className="relative w-full py-20 md:py-28 bg-card border-t border-border overflow-hidden">
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <Reveal direction="down" delay={0.1}>
            <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
              Reviews & Ratings
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mt-4 mb-6 leading-tight">
              Customer Feedback
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
              Read how audio professionals, product designers, and audiophiles around the world describe their experience.
            </p>
          </Reveal>
        </div>

        {/* Global Breakdown layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-start">
          
          {/* Breakdown stats sidebar */}
          <div className="col-span-1 lg:col-span-4 glass-card p-6 md:p-8 rounded-3xl border border-border/60 bg-muted/5 flex flex-col gap-6">
            <div className="text-center">
              <h3 className="font-heading text-5xl font-black text-foreground">4.9</h3>
              <div className="flex items-center justify-center gap-1 mt-2.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-light mt-2">
                Based on 1,248 verified customer scores
              </p>
            </div>

            {/* Progress Bars */}
            <div className="flex flex-col gap-2.5 border-t border-border/20 pt-6">
              {ratingStats.map((stat) => (
                <div key={stat.stars} className="flex items-center gap-3 text-xs font-semibold">
                  <span className="w-3 text-foreground">{stat.stars}</span>
                  <Star className="h-3.5 w-3.5 text-accent fill-accent shrink-0" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      style={{ width: `${stat.percentage}%` }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                  <span className="w-8 text-right text-muted-foreground font-light">
                    {stat.percentage}%
                  </span>
                </div>
              ))}
            </div>

            {/* Recommendation badge */}
            <div className="border-t border-border/20 pt-6 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/5 text-accent shrink-0 animate-pulse">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">98% Recommend</h4>
                <p className="text-[10px] text-muted-foreground font-light mt-0.5 leading-relaxed">
                  Of audiophiles recommend the Aura X1 for critical listening sessions.
                </p>
              </div>
            </div>
          </div>

          {/* List of customer reviews */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-6 text-left">
            {reviewsList.map((rev) => (
              <Reveal key={rev.id} direction="up" delay={0.1}>
                <div className="glass-card p-6 md:p-8 rounded-3xl border border-border/50 bg-muted/5 flex flex-col gap-5 hover-lift transition-all duration-300">
                  
                  {/* Header info */}
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-heading text-sm font-bold text-accent">
                        {rev.initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-heading text-sm font-bold text-foreground">
                          {rev.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-light tracking-wide mt-0.5">
                          {rev.country} • {rev.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < rev.rating ? "text-accent fill-accent" : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Verified Buyer
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-muted-foreground text-sm font-light leading-relaxed italic">
                    &quot;{rev.comment}&quot;
                  </p>

                  {/* Helpful trigger */}
                  <div className="flex items-center gap-4 border-t border-border/20 pt-4 mt-1">
                    <button
                      onClick={() => handleHelpfulClick(rev.id)}
                      disabled={votedIds[rev.id]}
                      className={`flex items-center gap-2 text-xs font-semibold transition ${
                        votedIds[rev.id]
                          ? "text-accent cursor-default"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>
                        Helpful ({rev.helpfulCount})
                      </span>
                    </button>
                  </div>

                </div>
              </Reveal>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
