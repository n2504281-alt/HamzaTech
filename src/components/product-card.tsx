"use client";

import Image from "next/image";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";
import { Product } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.some((p) => p.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    if (isWishlisted) {
      toast.info(`Removed ${product.name} from wishlist.`);
    } else {
      toast.success(`Added ${product.name} to wishlist!`);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Quick View: ${product.name} - ${product.price}$`, {
      description: product.description || "Premium handcrafted designer item.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden bg-card rounded-xl border border-border/60 hover:shadow-lg transition-all duration-300"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={false}
        />

        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-3 left-3 bg-red-600 text-white font-heading text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
            {product.discount}% OFF
          </span>
        )}

        {/* Quick Action Overlay Buttons */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
          <button
            onClick={handleToggleWishlist}
            className={cn(
              "p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
              isWishlisted
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white text-gray-900 hover:bg-gray-100"
            )}
            aria-label="Add to wishlist"
          >
            <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button
            onClick={handleQuickView}
            className="p-3 bg-white text-gray-900 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:bg-gray-100"
            aria-label="Quick view product"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-3 bg-accent text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:bg-accent/90"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] font-heading font-semibold text-muted-foreground uppercase tracking-widest">
          {product.category}
        </span>
        <h3 className="mt-1.5 text-sm font-heading font-semibold text-foreground line-clamp-1 group-hover:text-accent transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(product.rating)
                    ? "fill-current"
                    : "text-gray-300 dark:text-gray-600"
                )}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Price Info */}
        <div className="mt-auto pt-3 flex items-center gap-2">
          <span className="text-base font-semibold text-foreground font-heading">
            ${product.price}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through font-heading">
              ${product.oldPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
