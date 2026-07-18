"use client";

import React from "react";
import { Sparkles, Compass, Cpu } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { HoverTilt } from "@/components/animations/hover-tilt";

export function Showcase() {
  const showcaseItems = [
    {
      feature: "Reactive Aura LED",
      title: "Interactive Ambient Light Dials",
      description: "Customizable orange LED rings built into the external glass ear cups. Pulse to the rhythm of your audio or set them to glow breathing patterns.",
      icon: <Sparkles className="h-5 w-5 text-accent" />,
      color: "from-orange-500/20 to-transparent",
    },
    {
      feature: "Acoustical Geometry",
      title: "Aerospace Carbon Alloy Arch",
      description: "An incredibly lightweight framework that distributes clamping force evenly. Finished with a premium micro-brushed anodized surface.",
      icon: <Compass className="h-5 w-5 text-accent" />,
      color: "from-zinc-500/20 to-transparent",
    },
    {
      feature: "Sensory Interfaces",
      title: "Tactile Glass Control Dial",
      description: "A precision-tuned tempered glass dial that lets you adjust volume, skip tracks, or toggle ANC with microscopic physical clicks.",
      icon: <Cpu className="h-5 w-5 text-accent" />,
      color: "from-blue-500/20 to-transparent",
    },
  ];

  return (
    <section id="showcase" className="relative w-full py-20 md:py-28 bg-card border-t border-border overflow-hidden">
      {/* Background Volumetric Gradients */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Title */}
        <div className="max-w-2xl mb-16 md:mb-24">
          <Reveal direction="left" delay={0.1}>
            <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
              Product Anatomy
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mt-4 mb-6 leading-tight">
              Crafted Beyond Boundaries.
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
              Every detail is engineered with luxury materials to establish an intimate interface between you and the acoustic spectrum.
            </p>
          </Reveal>
        </div>

        {/* Showcase Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {showcaseItems.map((item, index) => (
            <Reveal key={index} direction="up" delay={0.1 * index}>
              <HoverTilt maxRotation={6} className="h-full">
                <div className="relative glass-card h-full p-8 rounded-3xl border border-border/50 flex flex-col justify-between overflow-hidden group">
                  
                  {/* Subtle Colored Aura Corner Glow */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} blur-[30px] rounded-full pointer-events-none`} />

                  <div>
                    {/* Feature Identifier */}
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xs font-bold uppercase tracking-wider text-accent">
                        {item.feature}
                      </span>
                      <div className="p-2 rounded-full bg-accent/5">
                        {item.icon}
                      </div>
                    </div>

                    {/* Headline */}
                    <h3 className="font-heading text-2xl font-bold text-foreground mb-4 leading-tight">
                      {item.title}
                    </h3>
                  </div>

                  {/* Body description */}
                  <p className="text-muted-foreground text-sm leading-relaxed font-light mt-6">
                    {item.description}
                  </p>

                  {/* Visual bottom accent */}
                  <div className="h-1 w-0 bg-accent mt-8 group-hover:w-full transition-all duration-500 rounded-full" />
                </div>
              </HoverTilt>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
