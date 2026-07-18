"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, Product } from "@/store/useStore";
import { toast } from "sonner";

export function WishlistSidebar() {
  const {
    wishlistOpen,
    setWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
  } = useStore();

  // Prevent scroll when wishlist is open
  useEffect(() => {
    if (wishlistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [wishlistOpen]);

  const handleMoveToCart = (item: Product) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
    toggleWishlist(item);
    toast.success(`Moved ${item.name} to cart!`);
  };

  return (
    <AnimatePresence>
      {wishlistOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setWishlistOpen(false)}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Slider Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card shadow-2xl z-50 flex flex-col border-l border-border"
          >
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 fill-current" />
                <h2 className="text-lg font-bold font-heading">Wishlist ({wishlist.length})</h2>
              </div>
              <button
                onClick={() => setWishlistOpen(false)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close wishlist"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Wishlist Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-base font-heading">Your wishlist is empty</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-[240px]">
                    Save items you love here to find them easily later.
                  </p>
                </div>
              ) : (
                wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/20 transition-colors"
                  >
                    <div className="relative h-20 w-20 rounded bg-muted overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold line-clamp-1 text-foreground font-heading">
                          {item.name}
                        </h4>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-heading font-medium">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold font-heading text-foreground">
                          ${item.price}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent/90 text-white rounded-md text-xs font-medium font-heading transition-colors"
                            aria-label="Add to cart"
                          >
                            <ShoppingBag className="h-3 w-3" />
                            <span>Add to Cart</span>
                          </button>
                          <button
                            onClick={() => {
                              toggleWishlist(item);
                              toast.info(`Removed ${item.name} from wishlist.`);
                            }}
                            className="text-muted-foreground hover:text-red-500 p-1.5 rounded border border-border hover:border-red-200 bg-background transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
