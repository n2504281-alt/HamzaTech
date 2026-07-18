"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CheckoutClient } from "./checkout-client";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Redirect if cart is empty
    if (cartItems.length === 0) {
      toast.error("Your shopping cart is empty! Add items to continue.");
      router.push("/");
    }
  }, [cartItems, router]);

  if (!mounted || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Header />
        <main className="flex-1 pt-32 pb-12 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navigation Header */}
      <Header />

      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-6">
          
          {/* Header titles */}
          <div className="max-w-6xl mx-auto text-left border-b border-border/40 pb-6 mb-8 mt-6">
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-accent" />
              Secure Checkout
            </h1>
            <p className="text-xs text-muted-foreground font-light mt-1">
              Provide your delivery and payment particulars to authorize shipping.
            </p>
          </div>

          {/* Stepper context form client */}
          <CheckoutClient />

        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
