"use client";

import { Truck, Sparkles, Heart, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export function WhyChooseUs() {
  const values = [
    {
      icon: Truck,
      title: "Complimentary Delivery",
      description: "Enjoy secure, fully insured premium delivery on all orders worldwide, with carbon offset tracking included.",
    },
    {
      icon: Sparkles,
      title: "Bespoke Craftsmanship",
      description: "Our items are individually handcrafted in micro-batches to eliminate waste and guarantee absolute perfection.",
    },
    {
      icon: Heart,
      title: "Ethically Sourced",
      description: "We work directly with family-owned tanneries and mills that observe strict sustainable and fair labor practices.",
    },
    {
      icon: RotateCcw,
      title: "Effortless Returns",
      description: "Experience absolute peace of mind with our complimentary 30-day return policy and simple prepaid courier collections.",
    },
  ];

  return (
    <section id="why-choose-us" className="py-16 sm:py-24 bg-card border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest font-heading">
            Our Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            The AURA Experience
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md font-sans">
            We are dedicated to redefining modern luxury by prioritizing sustainability, transparency, and design integrity.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, idx) => {
            const IconComponent = val.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                className="group p-6 rounded-xl border border-border/60 bg-muted/5 hover:bg-muted/10 hover:border-accent/40 transition-all duration-300 flex flex-col items-center sm:items-start text-center sm:text-left"
              >
                {/* Icon wrapper */}
                <div className="h-12 w-12 rounded-xl bg-accent/5 group-hover:bg-accent/10 border border-accent/10 flex items-center justify-center text-accent transition-colors duration-300 mb-5">
                  <IconComponent className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold font-heading text-foreground">
                  {val.title}
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
                  {val.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
