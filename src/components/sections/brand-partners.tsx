"use client";

import { motion } from "framer-motion";
import { PARTNERS } from "@/lib/mockData";

export function BrandPartners() {
  return (
    <section className="py-12 bg-muted/10 border-t border-border/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-widest font-heading mb-8">
          Featured Publications & Press
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-65">
          {PARTNERS.map((partner, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="text-foreground/60 hover:text-foreground font-heading font-black text-sm sm:text-base tracking-[0.35em] transition-all cursor-default select-none"
            >
              {partner.logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
