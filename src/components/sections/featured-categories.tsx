"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/mockData";

export function FeaturedCategories() {
  return (
    <section id="categories" className="py-16 sm:py-24 bg-muted/20 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12 sm:mb-16">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest font-heading">
            Curated Collections
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            Shop by Category
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md font-sans">
            Explore our meticulously designed ranges, engineered for everyday utility and timeless elegance.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              className="group relative h-80 rounded-xl overflow-hidden cursor-pointer border border-border/60 shadow-xs flex flex-col justify-end"
            >
              {/* Category Background Image */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Tint Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent transition-opacity duration-300" />

              {/* Text Info Overlay */}
              <div className="relative p-6 z-10 flex items-end justify-between w-full text-white">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold font-heading text-accent/80">
                    {cat.count} Products
                  </span>
                  <h3 className="text-lg font-bold font-heading mt-1">{cat.name}</h3>
                </div>
                <div className="h-9 w-9 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-black">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
