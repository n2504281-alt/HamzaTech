"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartItem } from "@/components/cart/cart-item";
import { OrderSummary } from "@/components/cart/order-summary";
import { CouponBox } from "@/components/cart/coupon-box";
import { EmptyCart } from "@/components/cart/empty-cart";
import { RecommendedProducts } from "@/components/cart/recommended-products";
import { useCartStore } from "@/store/cartStore";
import { Reveal } from "@/components/animations/reveal";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  
  const cartItems = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getTotalPrice());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
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

  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navigation Header */}
      <Header />

      <main className="flex-1 pt-28 pb-16">
        <div className="container mx-auto px-6">
          
          {isEmpty ? (
            <Reveal direction="down" delay={0.1}>
              <div className="max-w-4xl mx-auto flex flex-col items-center">
                {/* Header title */}
                <div className="text-left w-full border-b border-border/40 pb-6 mb-10 mt-6">
                  <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
                    <ShoppingBag className="h-8 w-8 text-accent" />
                    Shopping Cart
                  </h1>
                </div>
                
                {/* Empty Cart message card */}
                <EmptyCart />

                {/* Recommendations carousel even if empty */}
                <div className="max-w-xl w-full mt-6">
                  <RecommendedProducts />
                </div>
              </div>
            </Reveal>
          ) : (
            <div className="max-w-5xl mx-auto flex flex-col gap-6 mt-6">
              
              {/* Header Details */}
              <Reveal direction="down" delay={0.1}>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-border/40 pb-6 mb-6">
                  <div className="text-left">
                    <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
                      <ShoppingBag className="h-8 w-8 text-accent" />
                      Shopping Cart
                    </h1>
                    <p className="text-xs text-muted-foreground font-light mt-1">
                      Review and manage items before proceeding to checkout security screens.
                    </p>
                  </div>

                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mt-4 sm:mt-0"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Showcase
                  </Link>
                </div>
              </Reveal>

              {/* Main 2-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Items & Promo box & Recommendations */}
                <div className="lg:col-span-7 flex flex-col gap-6 w-full">
                  <Reveal direction="up" delay={0.15}>
                    <div className="flex flex-col gap-4">
                      {cartItems.map((item) => (
                        <CartItem key={item.product.id} item={item} />
                      ))}
                    </div>
                  </Reveal>

                  {/* Promo Input Box */}
                  <Reveal direction="up" delay={0.2}>
                    <CouponBox
                      onApplyDiscount={setDiscountPercent}
                      activeDiscount={discountPercent}
                    />
                  </Reveal>

                  {/* Recommendations */}
                  <Reveal direction="up" delay={0.25}>
                    <RecommendedProducts />
                  </Reveal>
                </div>

                {/* Right Side: Sticky Checkout Summary */}
                <div className="lg:col-span-5 w-full lg:sticky lg:top-28">
                  <Reveal direction="up" delay={0.3}>
                    <OrderSummary
                      subtotal={subtotal}
                      discountPercent={discountPercent}
                    />
                  </Reveal>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
