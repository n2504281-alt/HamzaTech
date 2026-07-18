"use client";

import Image from "next/image";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";

export function FeaturedCollection() {
  const { addToCart } = useStore();

  const handleAddToCart = () => {
    addToCart({
      id: "p2",
      name: "Classic Saddle Leather Tote",
      price: 189,
      image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80",
      category: "Leather Goods",
    });
    toast.success("Classic Saddle Leather Tote added to cart!");
  };

  const keyDetails = [
    "100% full-grain Italian vegetable-tanned leather",
    "Reinforced base and straps with solid copper rivets",
    "Internal zippered pocket and dedicated phone slot",
    "Hand-finished painted edges for clean aesthetics",
  ];

  return (
    <section id="featured-collection" className="py-16 sm:py-24 bg-muted/30 border-y border-border/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Collection Editorial Image */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative w-full aspect-4/5 sm:aspect-square lg:aspect-4/5 rounded-2xl overflow-hidden border border-border shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1000&q=80"
                alt="AURA Leather Saddle Collection"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover transition-transform duration-700 ease-out hover:scale-103"
              />
            </motion.div>
          </div>

          {/* Collection Editorial Content */}
          <div className="lg:col-span-6 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-1.5 bg-accent/10 border border-accent/20 px-3 py-1 rounded-full text-[10px] font-semibold text-accent uppercase tracking-wider font-heading">
                <Sparkles className="h-3 w-3" />
                <span>Limited Edition Batch</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground tracking-tight">
                The Saddle Leather Collection
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-sans">
                Each piece in this signature collection is crafted from the finest select full-grain cowhide, sourced from organic tanneries in Florence. Over time, it will develop a rich, customized patina that tells the story of your journeys.
              </p>
            </motion.div>

            {/* List features */}
            <motion.ul
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="space-y-3"
            >
              {keyDetails.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="font-sans leading-relaxed">{detail}</span>
                </li>
              ))}
            </motion.ul>

            {/* Price & Purchase CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="pt-6 border-t border-border flex flex-col sm:flex-row items-center gap-6"
            >
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-heading font-semibold">
                  Saddle Leather Tote
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold font-heading text-foreground">$189.00</span>
                  <span className="text-sm text-muted-foreground line-through font-heading">$239.00</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/95 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-sm font-heading"
                >
                  <span>Add to Cart</span>
                </button>
                <a
                  href="#products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border border-border hover:bg-muted/40 text-foreground px-6 py-3.5 rounded-xl text-sm font-semibold transition-all font-heading"
                >
                  <span>Explore Batch</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
