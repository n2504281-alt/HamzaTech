"use client";

import React, { useState } from "react";
import { Star, Heart, Share2, Shield, Truck, RotateCcw, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { toast } from "sonner";

interface ProductInfoProps {
  selectedColor: "black" | "white" | "orange";
  onColorChange: (color: "black" | "white" | "orange") => void;
}

export function ProductInfo({ selectedColor, onColorChange }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  const stockLimit = 12;

  // Base product object to construct cart records
  const getProductObject = () => {
    const colorNames = {
      orange: "Orange Edition",
      black: "Carbon Black",
      white: "Ceramic White",
    };
    return {
      id: `aura-x1-${selectedColor}`,
      name: `HamzaTech Aura X1 — ${colorNames[selectedColor]}`,
      description: "Premium Wireless ANC Headphones with Spatial Audio",
      price: 399.00,
      image_url:
        selectedColor === "orange"
          ? "/images/headphones_hero.png"
          : selectedColor === "black"
          ? "/images/headphones_black.png"
          : "/images/headphones_white.png",
    };
  };

  const handleAddToCart = () => {
    const prod = getProductObject();
    addItem(prod, quantity);
    toast.success(`${quantity} x Aura X1 (${selectedColor}) added to cart.`);
  };

  const handleBuyNow = () => {
    const prod = getProductObject();
    addItem(prod, quantity);
    setCartOpen(true);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Product page link copied to clipboard!");
    }
  };

  const colors = [
    { id: "orange", label: "Orange Edition", class: "bg-orange-500 ring-orange-500/30" },
    { id: "black", label: "Carbon Black", class: "bg-neutral-800 ring-neutral-800/30" },
    { id: "white", label: "Ceramic White", class: "bg-neutral-200 ring-neutral-200/30" },
  ] as const;

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      
      {/* Brand & Category */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
          HamzaTech Flagship
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          Premium ANC Wireless Headphones
        </span>
      </div>

      {/* Product Title */}
      <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-none">
        Aura X1
      </h1>

      {/* Ratings */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-4">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4.5 w-4.5 text-accent fill-accent" />
          ))}
        </div>
        <span className="text-sm font-bold text-foreground">4.9</span>
        <span className="text-xs text-muted-foreground font-light">
          (1,200+ Verified Customer Reviews)
        </span>
        <span className="ml-auto text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded flex items-center gap-1">
          <CheckCircle className="h-3 w-3" /> Verified Purchase
        </span>
      </div>

      {/* Price Block */}
      <div className="flex items-baseline gap-4 mt-2">
        <span className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
          $399.00
        </span>
        <span className="text-lg text-muted-foreground line-through font-light">
          $499.00
        </span>
        <span className="text-xs font-bold text-white bg-accent px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
          Save 20%
        </span>
      </div>

      {/* Short Description */}
      <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed font-sans mt-2">
        Experience acoustic excellence with hybrid active noise cancellation, custom 40mm beryllium drivers, real-time spatial head tracking, and customizable Aura ambient glow rings.
      </p>

      {/* Color Selection */}
      <div className="flex flex-col gap-3 mt-2">
        <span className="text-xs font-bold text-foreground uppercase tracking-wider">
          Color:{" "}
          <span className="text-accent">
            {selectedColor === "orange"
              ? "Orange Edition"
              : selectedColor === "black"
              ? "Carbon Black"
              : "Ceramic White"}
          </span>
        </span>
        <div className="flex items-center gap-3">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => onColorChange(c.id)}
              className={`h-9 w-9 rounded-full border-2 transition-all duration-300 relative ${
                selectedColor === c.id
                  ? "border-accent scale-110 ring-4 " + c.class
                  : "border-transparent hover:scale-105"
              } ${c.id === "white" ? "bg-white" : c.id === "black" ? "bg-zinc-900" : "bg-orange-500"}`}
              aria-label={`Select ${c.label}`}
            />
          ))}
        </div>
      </div>

      {/* Stock Alerts & Metadata */}
      <div className="glass-card border border-border/50 rounded-2xl p-4 flex flex-col gap-2.5 mt-2 bg-muted/10">
        <div className="flex items-center gap-2 text-xs font-bold text-red-500">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Hurry! Only {stockLimit} units left in stock for priority delivery.</span>
        </div>
        <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs font-medium text-muted-foreground border-t border-border/20 pt-3">
          <div>
            SKU: <span className="text-foreground">HT-AURAX1-{selectedColor.toUpperCase()}</span>
          </div>
          <div>
            Warranty: <span className="text-foreground">3 Years Signature Plan</span>
          </div>
          <div>
            Brand: <span className="text-foreground">HamzaTech</span>
          </div>
          <div>
            Category: <span className="text-foreground">Wireless ANC</span>
          </div>
        </div>
      </div>

      {/* Quantity & Buy controls */}
      <div className="flex flex-col gap-4 mt-4">
        {/* Quantity Select */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            Quantity
          </span>
          <div className="flex items-center border border-border/80 rounded-full h-11 px-2.5 bg-background">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-muted-foreground hover:text-foreground px-2 text-lg font-bold"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="text-sm font-bold text-foreground px-4 w-12 text-center select-none">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(stockLimit, q + 1))}
              className="text-muted-foreground hover:text-foreground px-2 text-lg font-bold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Buy Actions Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="h-13 rounded-full border-border bg-card hover:bg-muted font-semibold text-foreground text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Add to Cart
          </Button>
          <Button
            onClick={handleBuyNow}
            className="h-13 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-accent/15"
          >
            Buy Now
          </Button>
        </div>

        {/* Wishlist & Share */}
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={() => toast.success("Product added to your wishlist!")}
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-red-500 transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" /> Add to Wishlist
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-accent transition-colors"
            aria-label="Share product page"
          >
            <Share2 className="h-4 w-4" /> Share Product
          </button>
        </div>
      </div>

      {/* Shipping & Return Details */}
      <div className="flex flex-col gap-3 border-t border-border/40 pt-6 mt-4">
        <div className="flex items-start gap-3.5 text-xs">
          <div className="p-2 rounded-xl bg-accent/5 text-accent shrink-0">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">Free Global Express Shipping</h4>
            <p className="text-muted-foreground font-light leading-relaxed mt-0.5">
              Fully insured shipping in custom crates. Delivery within 2-4 business days.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3.5 text-xs">
          <div className="p-2 rounded-xl bg-accent/5 text-accent shrink-0">
            <RotateCcw className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-foreground">30-Day Luxury Return Policy</h4>
            <p className="text-muted-foreground font-light leading-relaxed mt-0.5">
              Not completely satisfied? We provide complimentary returns and refunds with zero hassle.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-6 mt-4">
        <div className="flex items-center gap-2.5">
          <Shield className="h-4.5 w-4.5 text-accent shrink-0" />
          <span className="text-[11px] font-bold text-foreground uppercase tracking-wide">
            Secure SSL Checkout
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Truck className="h-4.5 w-4.5 text-accent shrink-0" />
          <span className="text-[11px] font-bold text-foreground uppercase tracking-wide">
            Insured Express Shipping
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <Shield className="h-4.5 w-4.5 text-accent shrink-0" />
          <span className="text-[11px] font-bold text-foreground uppercase tracking-wide">
            3-Year Warranty Plan
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <RotateCcw className="h-4.5 w-4.5 text-accent shrink-0" />
          <span className="text-[11px] font-bold text-foreground uppercase tracking-wide">
            30-Day Money Back
          </span>
        </div>
      </div>

    </div>
  );
}
