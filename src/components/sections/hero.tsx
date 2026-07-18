"use client";

import Image from "next/image";
import { ArrowRight, ShieldCheck, Globe } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32 flex items-center min-h-[90vh]">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-8 flex flex-col justify-center text-center lg:text-left">
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-1.5 self-center lg:self-start bg-accent/10 border border-accent/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-accent uppercase tracking-wider font-heading"
            >
              <span>Introducing the Aura Edition</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading leading-tight tracking-tight text-foreground"
            >
              Timeless Aesthetics.
              <br />
              <span className="text-accent">Uncompromising Quality.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed font-sans"
            >
              Handcrafted for the modern purist. We design minimal, functional, and premium lifestyle essentials made to last a lifetime. Elevate your everyday carry.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <a
                href="#products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/95 px-8 py-4 rounded-xl text-sm font-semibold transition-all shadow-md font-heading"
              >
                <span>Shop Collection</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#featured-collection"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border border-border hover:bg-muted/40 text-foreground px-8 py-4 rounded-xl text-sm font-semibold transition-all font-heading"
              >
                <span>Discover Story</span>
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60 max-w-md mx-auto lg:mx-0"
            >
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-bold font-heading text-foreground">4.9★</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">Client Rating</span>
              </div>
              <div className="flex flex-col items-center lg:items-start border-x border-border/60 px-4">
                <span className="text-xl sm:text-2xl font-bold font-heading text-foreground">2-Year</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">Full Warranty</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-bold font-heading text-foreground">Free</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">Global Delivery</span>
              </div>
            </motion.div>
          </div>

          {/* Visual Showcase */}
          <div className="lg:col-span-6 relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full max-w-[500px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-border"
            >
              <Image
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"
                alt="AURA Chronograph lifestyle watch showcase"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />

              {/* Floating Badge 1 */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 left-8 bg-card/90 backdrop-blur-md border border-border/80 p-3 rounded-xl shadow-lg flex items-center gap-2.5 z-10 hidden sm:flex"
              >
                <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider font-heading">
                    Swiss Quartz
                  </p>
                  <p className="text-xs font-bold text-foreground font-heading">Swiss Movement</p>
                </div>
              </motion.div>

              {/* Floating Badge 2 */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-8 right-8 bg-card/90 backdrop-blur-md border border-border/80 p-3 rounded-xl shadow-lg flex items-center gap-2.5 z-10 hidden sm:flex"
              >
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <Globe className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider font-heading">
                    Sustainable
                  </p>
                  <p className="text-xs font-bold text-foreground font-heading">Eco Packaging</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
