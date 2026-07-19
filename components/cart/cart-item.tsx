"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash2, Bookmark, Check, Shield, Truck } from "lucide-react";
import { QuantitySelector } from "./quantity-selector";
import { useCartStore } from "@/store/cartStore";
import { CartItem as CartItemType } from "@/types";
import { toast } from "sonner";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const [isSaved, setIsSaved] = useState(false);

  const { product, quantity } = item;

  // Extract color variant from name or ID
  const getColorVariant = () => {
    if (product.id.includes("buds-pro") || product.name.toLowerCase().includes("buds")) {
      return "Aura Buds Pro";
    }
    if (product.id.includes("soundbar") || product.name.toLowerCase().includes("soundbar")) {
      return "Aura Soundbar X";
    }
    if (product.name.includes("Carbon Black") || product.id.includes("black")) {
      return "Carbon Black";
    }
    if (product.name.includes("Ceramic White") || product.id.includes("white")) {
      return "Ceramic White";
    }
    return "Orange Edition";
  };

  const handleSaveForLater = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success(`${product.name} saved for later.`);
    } else {
      toast.info(`${product.name} returned to active cart.`);
    }
  };

  const handleRemove = () => {
    removeItem(product.id);
    toast.success(`Removed ${product.name} from your cart.`);
  };

  return (
    <div className="glass-card border border-border/50 rounded-3xl p-5 md:p-6 bg-muted/5 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover-lift transition-all duration-300">
      
      {/* Thumbnail Image */}
      <div className="relative aspect-square w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border border-border/40 bg-muted/30 overflow-hidden shrink-0 flex items-center justify-center p-3">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-contain p-2"
          sizes="112px"
        />
      </div>

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col gap-2.5 text-left w-full">
        {/* Title and Remove Trigger */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
              {product.name.startsWith("HamzaTech ") ? "HamzaTech" : "Accessory Set"}
            </span>
            <h3 className="font-heading text-base sm:text-lg font-bold text-foreground leading-tight">
              {product.name.replace("HamzaTech ", "")}
            </h3>
            <span className="text-xs font-semibold text-muted-foreground mt-0.5">
              {product.id.includes("colorless") || product.id.includes("buds-pro") || product.id.includes("soundbar") ? "Special Accessory" : <>Variant: <span className="text-foreground">{getColorVariant()}</span></>}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveForLater}
              className={`p-2 rounded-full border border-border/60 hover:bg-muted transition-colors ${
                isSaved ? "text-accent border-accent/30 bg-accent/5" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Save for Later"
              aria-label="Save for later"
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? "fill-accent" : ""}`} />
            </button>
            <button
              onClick={handleRemove}
              className="p-2 rounded-full border border-border/60 text-muted-foreground hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5 transition-colors"
              title="Remove Item"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Badges and delivery stats */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1">
          <span className="text-[10px] font-bold text-green-500 flex items-center gap-1">
            <Check className="h-3.5 w-3.5" /> In Stock
          </span>
          <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
            <Truck className="h-3.5 w-3.5 text-accent" /> Delivered in 2-4 Days
          </span>
          <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-accent" /> 3-Year Warranty Plan
          </span>
        </div>

        {/* Quantity selector and Pricing row */}
        <div className="flex flex-row items-center justify-between border-t border-border/20 pt-4 mt-2.5 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quantity:
            </span>
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={(q) => updateQuantity(product.id, q)}
              maxStock={12}
            />
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">Item Total</span>
            <span className="font-heading text-lg font-extrabold text-foreground">
              ${(product.price * quantity).toFixed(2)}
            </span>
            <span className="text-[10px] text-muted-foreground font-light">
              (${product.price.toFixed(2)} unit)
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
