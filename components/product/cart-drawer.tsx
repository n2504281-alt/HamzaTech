"use client";

import React from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CartDrawer() {
  const router = useRouter();
  const { isCartOpen, setCartOpen } = useUIStore();
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();

  const handleCheckout = () => {
    setCartOpen(false);
    toast.success("Redirecting to checkout page...");
    router.push("/checkout");
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md border-l border-border bg-background p-6 flex flex-col h-full focus-visible:outline-none">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-accent" />
            Shopping Cart ({getTotalItems()})
          </SheetTitle>
          <SheetDescription className="hidden">
            Manage your selected items and proceed to checkout.
          </SheetDescription>
        </SheetHeader>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
              <div className="p-4 rounded-full bg-accent/5 text-muted-foreground">
                <ShoppingBag className="h-10 w-10" />
              </div>
              <p className="text-muted-foreground text-sm font-light">Your shopping cart is currently empty.</p>
              <Button
                variant="outline"
                onClick={() => setCartOpen(false)}
                className="rounded-full border-border bg-transparent text-foreground"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-4 p-3 rounded-2xl bg-card border border-border/60"
              >
                {/* Product Thumbnail */}
                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-muted border border-border flex-shrink-0">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </div>

                {/* Info and Actions */}
                <div className="flex-1 flex flex-col">
                  <span className="text-sm font-bold text-foreground line-clamp-1">
                    {item.product.name}
                  </span>
                  <span className="text-xs text-accent font-semibold mt-0.5">
                    ${item.product.price.toFixed(2)}
                  </span>
                  
                  {/* Quantity Actions */}
                  <div className="flex items-center gap-2.5 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 rounded bg-muted hover:bg-border text-foreground transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold text-foreground w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 rounded bg-muted hover:bg-border text-foreground transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    removeItem(item.product.id);
                    toast.info("Item removed from cart.");
                  }}
                  className="text-muted-foreground hover:text-red-500 rounded-full"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Footer section */}
        {items.length > 0 && (
          <div className="border-t border-border pt-4 mt-auto space-y-4">
            <div className="flex items-center justify-between text-base font-bold text-foreground">
              <span>Subtotal</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
              Shipping and taxes calculated at checkout. Express delivery is free for all pre-orders.
            </p>
            <Button
              onClick={handleCheckout}
              className="w-full h-12 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-accent/15"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
