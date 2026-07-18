"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function PromotionalBanner() {
  return (
    <section className="py-16 sm:py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative bg-primary rounded-2xl overflow-hidden py-12 px-6 sm:px-12 lg:py-16 lg:px-20 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 border border-border/10 shadow-2xl"
        >
          {/* Decorative mesh/blob overlays */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/15 rounded-full filter blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full filter blur-2xl pointer-events-none translate-y-1/2 -translate-x-1/3" />

          {/* Banner Copy */}
          <div className="relative space-y-4 max-w-lg z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[9px] font-semibold text-white uppercase tracking-wider font-heading">
              <Sparkles className="h-3 w-3 text-amber-300" />
              <span>Seasonal Upgrade</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-primary-foreground tracking-tight">
              Elevate Your Daily Essentials.
            </h2>
            <p className="text-sm text-primary-foreground/75 leading-relaxed font-sans">
              Enjoy 15% off your first custom layout ensemble. Free premium shipping and gift wrapping included automatically at checkout.
            </p>
          </div>

          {/* Banner CTA */}
          <div className="relative shrink-0 z-10 self-center">
            <a
              href="#products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-neutral-100 px-6 py-4 rounded-xl text-sm font-semibold transition-all shadow-md font-heading"
            >
              <span>Explore Collection</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
