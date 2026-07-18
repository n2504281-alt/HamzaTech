"use client";

import React from "react";
import Image from "next/image";
import { Volume2, Battery, Zap, Disc, Bluetooth, Award } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { HoverTilt } from "@/components/animations/hover-tilt";

export function Features() {
  const highlightFeatures = [
    {
      title: "Active Noise Cancellation",
      description: "Advanced hybrid ANC blocks up to 45dB of low-frequency chatter, creating a vacuum of crystal clear audio.",
      icon: <Volume2 className="h-6 w-6 text-accent" />,
      image: "/images/features_anc.png",
      span: "md:col-span-2",
    },
    {
      title: "Hi-Res Audio Drivers",
      description: "Our signature 40mm beryllium-coated dynamic drivers deliver distortion-free audio with intense depth and spatial mappings.",
      icon: <Disc className="h-6 w-6 text-accent" />,
      image: "/images/features_driver.png",
      span: "md:col-span-2",
    },
  ];

  const gridFeatures = [
    {
      title: "40h Wireless Battery",
      description: "Enjoy up to 40 hours of continuous high-fidelity listening with ANC enabled on a single full charge.",
      icon: <Battery className="h-5 w-5 text-accent" />,
    },
    {
      title: "Ultra Fast Charging",
      description: "Running low? A rapid 10-minute USB-C quick charge provides up to 5 hours of playback time.",
      icon: <Zap className="h-5 w-5 text-accent" />,
    },
    {
      title: "Bluetooth 5.4 Connect",
      description: "Zero-latency synchronization, dual-device multipoint connection, and extended 50-foot wireless range.",
      icon: <Bluetooth className="h-5 w-5 text-accent" />,
    },
    {
      title: "Premium Comfort Arch",
      description: "Ergonomic leather headband and ultra-soft memory foam earcups designed for fatigue-free listening.",
      icon: <Award className="h-5 w-5 text-accent" />,
    },
  ];

  return (
    <section id="features" className="relative w-full py-20 md:py-28 bg-background border-t border-border overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
          <Reveal direction="down" delay={0.1}>
            <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
              Engineered Specs
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mt-4 mb-6 leading-tight">
              Sensory Innovation, Uncompromising Detail.
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
              Every detail of the Aura X1 is refined to achieve acoustical equilibrium and long-term ergonomic stability.
            </p>
          </Reveal>
        </div>

        {/* Visual Feature Highlights (ANC & Driver) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-12">
          {highlightFeatures.map((feat, index) => (
            <div key={index} className={`${feat.span} col-span-1`}>
              <Reveal direction="up" delay={0.1 * index}>
                <HoverTilt maxRotation={5} className="glass-card flex flex-col h-full rounded-3xl overflow-hidden border border-border/50 group">
                  <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-black/20">
                    <Image
                      src={feat.image}
                      alt={feat.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-w-768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-accent/10 w-fit mb-4">
                      {feat.icon}
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                      {feat.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed font-light">
                      {feat.description}
                    </p>
                  </div>
                </HoverTilt>
              </Reveal>
            </div>
          ))}
        </div>

        {/* Supporting Grid Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {gridFeatures.map((feat, index) => (
            <Reveal key={index} direction="up" delay={0.1 * index}>
              <div className="glass-card p-8 rounded-2xl border border-border/40 hover:border-accent/40 transition-colors duration-300 h-full flex flex-col">
                <div className="p-2.5 rounded-xl bg-accent/5 w-fit mb-4">
                  {feat.icon}
                </div>
                <h3 className="font-heading text-base font-bold text-foreground mb-2">
                  {feat.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-light">
                  {feat.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
