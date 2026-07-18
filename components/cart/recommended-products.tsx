"use client";

import React from "react";
import Image from "next/image";
import { Star, Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

interface RecommendItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  rating: number;
  category: string;
}

export function RecommendedProducts() {
  const addItem = useCartStore((state) => state.addItem);

  const recommendList: RecommendItem[] = [
    {
      id: "aura-buds-pro-colorless",
      name: "Aura Buds Pro",
      category: "Wireless Earbuds",
      description: "Ceramic dynamic drivers with adaptive Hybrid ANC.",
      price: 199.00,
      image_url: "/images/features_driver.png", // reusing driver asset for earbuds showcase
      rating: 4.8,
    },
    {
      id: "aura-soundbar-x-colorless",
      name: "Aura Soundbar X",
      category: "Spatial Speakers",
      description: "9 beryllium drivers with dynamic beamforming audio.",
      price: 599.00,
      image_url: "/images/features_anc.png", // reusing anc asset for spatial speaker showcase
      rating: 4.9,
    },
  ];

  const handleAddRecommend = (prod: RecommendItem) => {
    // Convert to standard Product type
    const productData = {
      id: prod.id,
      name: `HamzaTech ${prod.name}`,
      description: prod.description,
      price: prod.price,
      image_url: prod.image_url,
    };
    addItem(productData, 1);
    toast.success(`Added ${prod.name} to your shopping cart!`);
  };

  return (
    <div className="w-full flex flex-col gap-6 text-left border-t border-border/40 pt-12 mt-12">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
          Complete the Set
        </span>
        <h3 className="font-heading text-lg sm:text-xl font-extrabold text-foreground">
          Recommended for You
        </h3>
      </div>

      {/* Horizontal List layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {recommendList.map((prod) => (
          <div
            key={prod.id}
            className="glass-card border border-border/50 rounded-3xl p-5 bg-muted/5 hover-lift transition-all duration-300 flex items-center gap-4 relative overflow-hidden group"
          >
            {/* Thumbnail */}
            <div className="relative aspect-square w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-border/40 bg-muted/30 overflow-hidden shrink-0 flex items-center justify-center p-2">
              <Image
                src={prod.image_url}
                alt={prod.name}
                fill
                className="object-cover grayscale hover:grayscale-0 transition duration-300"
                sizes="96px"
              />
            </div>

            {/* Description content */}
            <div className="flex-1 flex flex-col text-left gap-1 min-w-0">
              <span className="text-[9px] font-bold text-accent uppercase tracking-wider">
                {prod.category}
              </span>
              <h4 className="font-heading text-sm sm:text-base font-bold text-foreground truncate group-hover:text-accent transition-colors">
                {prod.name}
              </h4>
              <p className="text-[11px] text-muted-foreground font-light leading-relaxed line-clamp-2">
                {prod.description}
              </p>

              {/* Price & Rating */}
              <div className="flex items-center justify-between border-t border-border/10 pt-2.5 mt-1">
                <span className="text-sm font-extrabold text-foreground">
                  ${prod.price.toFixed(2)}
                </span>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-[10px] font-semibold text-foreground">
                    <Star className="h-3 w-3 text-accent fill-accent" />
                    <span>{prod.rating}</span>
                  </div>

                  <button
                    onClick={() => handleAddRecommend(prod)}
                    className="h-7 w-7 rounded-full bg-accent hover:bg-accent/90 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
                    aria-label={`Add ${prod.name} to cart`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
