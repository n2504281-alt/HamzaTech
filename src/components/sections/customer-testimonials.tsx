"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/mockData";

export function CustomerTestimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-card border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest font-heading">
            Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            What Our Community Says
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md font-sans">
            Hear from our global collective of design professionals, industrial engineers, and minimalists.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((test, idx) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
              className="relative p-6 sm:p-8 rounded-2xl border border-border/60 bg-muted/5 hover:bg-muted/10 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Quote Mark */}
              <div className="absolute top-6 right-6 text-muted-foreground/15">
                <Quote className="h-10 w-10 fill-current" />
              </div>

              <div>
                {/* Rating */}
                <div className="flex text-amber-500 gap-0.5 mb-5">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-sm sm:text-base text-foreground leading-relaxed font-sans italic">
                  &ldquo;{test.content}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border/40">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted border border-border shrink-0">
                  <Image
                    src={test.avatar}
                    alt={test.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-heading text-foreground">{test.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {test.role} &middot; <span className="font-medium text-accent">{test.location}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
