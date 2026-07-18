"use client";

import React from "react";
import { Check, X, ShieldAlert } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";

export function ProductSpecs() {
  const specItems = [
    {
      parameter: "Driver Configuration",
      auraVal: "40mm Beryllium-coated dynamic drivers",
      competitorVal: "40mm Standard PET dynamic drivers",
      highlight: true,
    },
    {
      parameter: "Frequency Response",
      auraVal: "4Hz – 45kHz (Hi-Res Audio)",
      competitorVal: "20Hz – 20kHz",
      highlight: true,
    },
    {
      parameter: "Active Noise Cancellation",
      auraVal: "Hybrid Adaptive ANC up to -45dB",
      competitorVal: "Standard ANC up to -38dB",
      highlight: true,
    },
    {
      parameter: "Bluetooth Technology",
      auraVal: "Bluetooth 5.4 Low Energy",
      competitorVal: "Bluetooth 5.2",
      highlight: false,
    },
    {
      parameter: "Acoustic Codecs",
      auraVal: "LDAC, AAC, SBC, aptX Adaptive",
      competitorVal: "AAC, SBC only",
      highlight: true,
    },
    {
      parameter: "Battery Life (ANC On)",
      auraVal: "Up to 40 hours continuous",
      competitorVal: "Up to 30 hours continuous",
      highlight: true,
    },
    {
      parameter: "Recharging Speed",
      auraVal: "10 mins charge = 5 hours playback",
      competitorVal: "15 mins charge = 2 hours playback",
      highlight: false,
    },
    {
      parameter: "Weight Parameters",
      auraVal: "285 grams (Ultralight design)",
      competitorVal: "310 grams",
      highlight: false,
    },
    {
      parameter: "Spatial Audio Head-Tracking",
      auraVal: "Interactive 3D head-tracking native",
      competitorVal: "Static stereo mapping only",
      highlight: true,
    },
    {
      parameter: "Chassis Material Build",
      auraVal: "Anodized Carbon Alloy & Tempered Glass",
      competitorVal: "Standard Matte Plastic shell",
      highlight: true,
    },
    {
      parameter: "Acoustic Warranty Period",
      auraVal: "3 Years Full Replacement Coverage",
      competitorVal: "1 Year Limited Coverage",
      highlight: true,
    },
  ];

  return (
    <section id="specifications" className="relative w-full py-20 md:py-28 bg-background border-t border-border overflow-hidden">
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Title Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <Reveal direction="down" delay={0.1}>
            <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
              Spec Comparison
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mt-4 mb-6 leading-tight">
              Compare the Standards
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
              Explore the parameters side-by-side to understand why the Aura X1 represents the next leap in acoustic technology.
            </p>
          </Reveal>
        </div>

        {/* Specifications Comparison Table */}
        <Reveal direction="up" delay={0.4}>
          <div className="max-w-4xl mx-auto overflow-x-auto rounded-3xl border border-border/50 glass-card bg-muted/5">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border/60 bg-muted/20">
                  <th className="p-5 text-sm font-extrabold text-foreground uppercase tracking-wider w-[34%]">
                    Parameters
                  </th>
                  <th className="p-5 text-sm font-extrabold text-accent uppercase tracking-wider w-[33%] bg-accent/5">
                    Aura X1 (HamzaTech)
                  </th>
                  <th className="p-5 text-sm font-extrabold text-muted-foreground uppercase tracking-wider w-[33%]">
                    Standard ANC Flagships
                  </th>
                </tr>
              </thead>
              <tbody>
                {specItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-border/40 transition-colors duration-150 hover:bg-muted/10 ${
                      item.highlight ? "bg-accent/[0.01]" : ""
                    }`}
                  >
                    {/* Parameter name */}
                    <td className="p-5 text-sm font-bold text-foreground flex items-center gap-2">
                      {item.highlight && <ShieldAlert className="h-4 w-4 text-accent shrink-0" />}
                      {item.parameter}
                    </td>

                    {/* Aura X1 specs */}
                    <td className="p-5 text-sm font-extrabold text-foreground bg-accent/[0.02]">
                      <div className="flex items-center gap-2">
                        <Check className="h-4.5 w-4.5 text-accent shrink-0" />
                        <span>{item.auraVal}</span>
                      </div>
                    </td>

                    {/* Competitor specs */}
                    <td className="p-5 text-sm font-medium text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <X className="h-4.5 w-4.5 text-muted-foreground/50 shrink-0" />
                        <span>{item.competitorVal}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
