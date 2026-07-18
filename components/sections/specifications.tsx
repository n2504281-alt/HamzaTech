"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "@/components/animations/reveal";

export function Specifications() {
  const specData = {
    audio: [
      { key: "Driver Unit", value: "40mm beryllium-coated dynamic drivers" },
      { key: "Frequency Response", value: "4Hz – 45,000Hz (Hi-Res Certified)" },
      { key: "Active Noise Cancel", value: "Hybrid ANC up to -45dB (4 mics)" },
      { key: "Impedance", value: "32 Ohms passive / 48 Ohms active" },
      { key: "Spatial Audio", value: "Interactive 3D head-tracking enabled" },
      { key: "Codecs Supported", value: "LDAC, AAC, SBC, aptX Adaptive" },
    ],
    connectivity: [
      { key: "Bluetooth Version", value: "Bluetooth 5.4 Low Energy" },
      { key: "Multipoint Connect", value: "Dual devices simultaneous pairing" },
      { key: "Latency Mode", value: "Ultra low-latency gaming mode (40ms)" },
      { key: "Effective Range", value: "Up to 50 feet (15 meters)" },
      { key: "Physical Inputs", value: "USB-C Audio & Power, 3.5mm Aux input" },
      { key: "Voice Assistants", value: "Siri, Google Assistant native support" },
    ],
    power: [
      { key: "Battery Capacity", value: "850mAh high-density lithium polymer" },
      { key: "Playtime (ANC On)", value: "Up to 40 hours continuous use" },
      { key: "Playtime (ANC Off)", value: "Up to 55 hours continuous use" },
      { key: "Charge Duration", value: "1.5 hours for full 100% capacity" },
      { key: "Fast Charge Speed", value: "10 minutes charge = 5 hours playback" },
      { key: "Standby Time", value: "Up to 300 hours" },
    ],
    design: [
      { key: "Earcup Shells", value: "Anodized carbon alloy & tempered glass" },
      { key: "Ear Cushion Cushion", value: "Premium breathable memory foam" },
      { key: "Headband Cushion", value: "Eco-luxury vegan leather wrapping" },
      { key: "Interactive Lighting", value: "Reactive Orange LED Aura Rings" },
      { key: "Weight Details", value: "285 grams (Ultralight design)" },
      { key: "Travel Storage", value: "Fold-flat swiveling ear cups" },
    ],
  };

  return (
    <section id="specifications" className="relative w-full py-20 md:py-28 bg-background border-t border-border overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal direction="down" delay={0.1}>
            <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
              Full Breakdown
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mt-4 mb-6 leading-tight">
              Technical Specifications
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
              Explore the advanced parameters that fuel the high-fidelity acoustic performance of the Aura X1.
            </p>
          </Reveal>
        </div>

        {/* Responsive Specifications Tabs */}
        <Reveal direction="up" delay={0.4}>
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="audio" className="w-full">
              {/* Tab Trigger Buttons */}
              <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-muted border border-border/80 rounded-2xl p-1 mb-8 gap-1 h-auto md:h-12">
                <TabsTrigger
                  value="audio"
                  className="rounded-xl py-2 text-sm font-semibold text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all focus-visible:outline-none"
                >
                  Audio & ANC
                </TabsTrigger>
                <TabsTrigger
                  value="connectivity"
                  className="rounded-xl py-2 text-sm font-semibold text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all focus-visible:outline-none"
                >
                  Connectivity
                </TabsTrigger>
                <TabsTrigger
                  value="power"
                  className="rounded-xl py-2 text-sm font-semibold text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all focus-visible:outline-none"
                >
                  Power & Battery
                </TabsTrigger>
                <TabsTrigger
                  value="design"
                  className="rounded-xl py-2 text-sm font-semibold text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all focus-visible:outline-none"
                >
                  Design & Materials
                </TabsTrigger>
              </TabsList>

              {/* Tab Content Areas */}
              {(Object.keys(specData) as Array<keyof typeof specData>).map((category) => (
                <TabsContent
                  key={category}
                  value={category}
                  className="glass-card rounded-3xl border border-border/50 p-6 md:p-8 backdrop-blur-md outline-none"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {specData[category].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-3 gap-1"
                      >
                        <span className="text-sm font-semibold text-muted-foreground">
                          {item.key}
                        </span>
                        <span className="text-sm font-bold text-foreground text-left sm:text-right">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
