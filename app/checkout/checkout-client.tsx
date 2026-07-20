"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { placeOrderAction } from "@/actions/order";
import { createAddressAction } from "@/actions/address";
import { createClient } from "@/lib/supabase/client";

// Components
import { CheckoutForm, checkoutSchema, CheckoutFormValues } from "@/components/checkout/checkout-form";
import { ShippingCard, DeliveryTier } from "@/components/checkout/shipping-card";
import { PaymentSelector, PaymentMethod } from "@/components/checkout/payment-selector";
import { OrderSummary } from "@/components/checkout/order-summary";
import { TrustBadges } from "@/components/checkout/trust-badges";
import { SuccessCard } from "@/components/checkout/success-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ShieldCheck, Check } from "lucide-react";

export function CheckoutClient() {
  const [currentStep, setCurrentStep] = useState(1); // 1 to 4
  const [shippingFee, setShippingFee] = useState(0);
  const [selectedTier, setSelectedTier] = useState<DeliveryTier>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState("");

  // Form setup
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      address1: "",
      address2: "",
      country: "",
      city: "",
      state: "",
      postalCode: "",
      orderNotes: "",
    },
  });

  const { trigger, getValues } = form;

  const stepsList = [
    { num: 1, label: "Information" },
    { num: 2, label: "Shipping" },
    { num: 3, label: "Payment" },
    { num: 4, label: "Review" },
  ];

  // Validate current step fields before going forward
  const handleNextStep = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger([
        "fullName",
        "email",
        "phone",
        "company",
        "address1",
        "address2",
        "country",
        "city",
        "state",
        "postalCode",
      ]);
    } else if (currentStep === 2) {
      isValid = true; // Shipping selection is always valid
    } else if (currentStep === 3) {
      isValid = true; // Payment method choice (UI is self-validating)
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(4, prev + 1));
    } else {
      toast.error("Please fill in all required fields before proceeding.");
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const cartItems = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getTotalPrice());

  const getColorVariant = (name: string, id: string) => {
    if (id.includes("buds-pro") || name.toLowerCase().includes("buds")) {
      return "Aura Buds Pro";
    }
    if (id.includes("soundbar") || name.toLowerCase().includes("soundbar")) {
      return "Aura Soundbar X";
    }
    if (name.includes("Carbon Black") || id.includes("black")) {
      return "Carbon Black";
    }
    if (name.includes("Ceramic White") || id.includes("white")) {
      return "Ceramic White";
    }
    return "Orange Edition";
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let shippingAddressId: string | null = null;

      if (user) {
        const addressRes = await createAddressAction({
          street: `${getValues("address1")}${getValues("address2") ? ", " + getValues("address2") : ""}`,
          city: getValues("city"),
          state: getValues("state"),
          postalCode: getValues("postalCode"),
          country: getValues("country"),
          isDefault: false,
        });

        if (addressRes.success && addressRes.data) {
          shippingAddressId = addressRes.data.id;
        }
      }

      const discountAmount = subtotal * (discountPercent / 100);
      const taxAmount = subtotal * 0.08;
      const grandTotal = subtotal - discountAmount + taxAmount + shippingFee;

      const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      const items = cartItems.map((item) => {
        // Only pass productId if it is already a real UUID (i.e. fetched from the DB).
        // All legacy slugs (aura-x1-orange, aura-buds-pro-colorless, etc.) are mapped
        // to null so they never violate Zod uuid() or Supabase FK constraints.
        const rawId = item.product.id;
        const productId: string | null = UUID_REGEX.test(rawId) ? rawId : null;

        return {
          productId,
          quantity: item.quantity,
          price: item.product.price,
          variant: getColorVariant(item.product.name, item.product.id),
        };
      });

      const orderRes = await placeOrderAction({
        subtotal,
        shippingFee,
        discount: discountAmount,
        tax: taxAmount,
        grandTotal,
        shippingAddressId,
        orderNotes: getValues("orderNotes") || "",
        items,
      });

      if (!orderRes.success) {
        toast.error(orderRes.error || "Failed to process and authorize order.");
        setIsSubmitting(false);
        return;
      }

      if (orderRes.data) {
        setPlacedOrderNumber(orderRes.data.order_number);
      }
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Order authorized! Transferring to invoice overview.");
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : "An unexpected error occurred during checkout authorization.";
      toast.error(errorMsg);
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <SuccessCard email={getValues("email")} orderNumber={placedOrderNumber} />;
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 text-left mt-6">
      
      {/* Stepper progress indicator */}
      <div className="w-full flex items-center justify-between border-b border-border/40 pb-6 mb-4">
        {stepsList.map((step) => {
          const isCompleted = step.num < currentStep;
          const isActive = step.num === currentStep;

          return (
            <div key={step.num} className="flex-1 flex items-center gap-2.5">
              <div
                className={`h-7 w-7 rounded-full border text-xs font-bold flex items-center justify-center transition-all ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? "bg-accent border-accent text-white"
                    : "border-border/60 text-muted-foreground bg-transparent"
                }`}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : step.num}
              </div>
              <span
                className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider hidden sm:inline ${
                  isActive ? "text-foreground" : "text-muted-foreground/60"
                }`}
              >
                {step.label}
              </span>
              {step.num < 4 && (
                <div className="flex-1 h-[1px] bg-border/40 mx-4 hidden sm:block" />
              )}
            </div>
          );
        })}
      </div>

      {/* Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left column - form stepper pages */}
        <div className="lg:col-span-7 flex flex-col gap-8 w-full bg-card/20 border border-border/40 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              {currentStep === 1 && (
                <CheckoutForm form={form} />
              )}

              {currentStep === 2 && (
                <ShippingCard
                  selectedTier={selectedTier}
                  onTierChange={(tier, fee) => {
                    setSelectedTier(tier);
                    setShippingFee(fee);
                  }}
                />
              )}

              {currentStep === 3 && (
                <PaymentSelector
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                />
              )}

              {currentStep === 4 && (
                <div className="flex flex-col gap-6">
                  <h3 className="font-heading text-lg font-black text-foreground uppercase tracking-wide border-b border-border/20 pb-4">
                    Review Order details
                  </h3>

                  {/* Summary grid details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-muted-foreground">
                    <div className="flex flex-col gap-1.5 border border-border/30 rounded-2xl p-4 bg-muted/5">
                      <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">Contact Info</span>
                      <span>{getValues("fullName")}</span>
                      <span>{getValues("email")}</span>
                      <span>{getValues("phone")}</span>
                    </div>

                    <div className="flex flex-col gap-1.5 border border-border/30 rounded-2xl p-4 bg-muted/5">
                      <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">Shipping Address</span>
                      <span>{getValues("address1")}</span>
                      {getValues("address2") && <span>{getValues("address2")}</span>}
                      <span>{getValues("city")}, {getValues("state")} {getValues("postalCode")}</span>
                      <span>{getValues("country")}</span>
                    </div>

                    <div className="flex flex-col gap-1.5 border border-border/30 rounded-2xl p-4 bg-muted/5">
                      <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">Delivery Priority</span>
                      <span className="text-accent font-bold capitalize">{selectedTier} shipping</span>
                    </div>

                    <div className="flex flex-col gap-1.5 border border-border/30 rounded-2xl p-4 bg-muted/5">
                      <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">Payment Method</span>
                      <span className="text-accent font-bold capitalize">{paymentMethod} gateway</span>
                    </div>
                  </div>

                  {getValues("orderNotes") && (
                    <div className="flex flex-col gap-1.5 border border-border/30 rounded-2xl p-4 bg-muted/5 text-xs text-muted-foreground">
                      <span className="font-bold text-foreground uppercase tracking-wider text-[10px]">Order Notes</span>
                      <span className="italic">&quot;{getValues("orderNotes")}&quot;</span>
                    </div>
                  )}

                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav Stepper buttons */}
          <div className="flex items-center justify-between border-t border-border/20 pt-6 mt-4">
            {currentStep > 1 ? (
              <button
                onClick={handlePrevStep}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button
                onClick={handleNextStep}
                className="h-11 rounded-full px-6 bg-accent hover:bg-accent/90 text-white font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="h-11 rounded-full px-8 bg-accent hover:bg-accent/90 text-white font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-accent/15"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </>
                )}
              </Button>
            )}
          </div>

        </div>

        {/* Right column - order calculations overview */}
        <div className="lg:col-span-5 w-full lg:sticky lg:top-28">
          <OrderSummary
            shippingFee={shippingFee}
            discountPercent={discountPercent}
            onApplyDiscount={setDiscountPercent}
          />
          <div className="hidden lg:block">
            <TrustBadges />
          </div>
        </div>

      </div>

    </div>
  );
}
