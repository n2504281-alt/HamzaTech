"use client";

import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { PRODUCTS } from "@/lib/mockData";

export function BestSellingProducts() {
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section id="products" className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div className="space-y-4 text-center md:text-left">
            <span className="text-xs font-semibold text-accent uppercase tracking-widest font-heading">
              Customer Favorites
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
              Best Selling Products
            </h2>
            <p className="text-sm text-muted-foreground max-w-md font-sans">
              Handpicked customer favorites crafted with superior materials and functional excellence.
            </p>
          </div>

          <a
            href="#products"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold font-heading text-accent hover:text-accent/90 transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile Call To Action */}
        <div className="mt-10 text-center md:hidden">
          <a
            href="#products"
            className="w-full inline-flex items-center justify-center gap-2 bg-transparent border border-border hover:bg-muted/40 text-foreground px-6 py-3.5 rounded-xl text-sm font-semibold transition-all font-heading"
          >
            <span>View All Products</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
