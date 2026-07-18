"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

export function CartSidebar() {
  const {
    cartOpen,
    setCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
  } = useStore();

  // Prevent scroll when cart is open
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckoutPlaceholder = () => {
    toast.success("Proceeding to checkout...", {
      description: "Checkout logic will be integrated with Supabase in the next phase.",
    });
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
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
                <ShoppingBag className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-bold font-heading">Shopping Cart ({cart.length})</h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-base font-heading">Your cart is empty</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-[240px]">
                    Looks like you haven&apos;t added anything to your cart yet.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
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
                        {item.category && (
                          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-heading font-medium">
                            {item.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-border rounded-md overflow-hidden bg-background">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-xs font-semibold text-foreground font-heading select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold font-heading text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => {
                              removeFromCart(item.id);
                              toast.info(`Removed ${item.name} from cart.`);
                            }}
                            className="text-muted-foreground hover:text-red-500 p-1 rounded transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-border bg-muted/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-bold font-heading text-foreground">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping, taxes, and discounts will be calculated during checkout.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-full py-3 text-center border border-border hover:bg-muted text-sm font-medium rounded-lg transition-colors font-heading"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={handleCheckoutPlaceholder}
                    className="w-full py-3 text-center bg-accent text-white hover:bg-accent/90 text-sm font-medium rounded-lg transition-all shadow-sm font-heading"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
