"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { INSTAGRAM_IMAGES } from "@/lib/mockData";

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export function InstagramGallery() {
  return (
    <section className="py-16 sm:py-24 bg-card border-t border-border/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest font-heading">
            Social Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            Curated Inspiration
          </h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold font-heading text-muted-foreground hover:text-accent transition-colors"
          >
            @aura.collective
          </a>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTAGRAM_IMAGES.map((imgUrl, idx) => (
            <motion.a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05, ease: "easeOut" }}
              className="group relative aspect-square rounded-xl overflow-hidden bg-muted border border-border/60 shadow-xs block"
            >
              <Image
                src={imgUrl}
                alt={`AURA gallery inspiration image ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Hover Tint & Icon */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white z-10">
                <Instagram className="h-6 w-6 transition-transform duration-500 group-hover:scale-110" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
