"use client";

import React, { useState } from "react";
import { trackOrderAction } from "@/actions/order";
import { Order, OrderItem } from "@/types/database";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Search,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  Box,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type OrderWithItems = Order & { items: OrderItem[] };

export default function TrackOrderPage() {
  const [orderNumberInput, setOrderNumberInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderWithItems | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumberInput.trim()) {
      toast.error("Please enter an order number (e.g. HT-123456-AX1)");
      return;
    }

    setIsSearching(true);
    try {
      const res = await trackOrderAction(orderNumberInput);
      if (!res.success || !res.data) {
        toast.error(res.error || "Order not found");
        setOrderResult(null);
      } else {
        setOrderResult(res.data as OrderWithItems);
        toast.success("Order trace details loaded successfully!");
      }
    } catch {
      toast.error("Failed to fetch order status. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const getStepStatus = (step: "placed" | "processing" | "shipped" | "delivered", currentStatus: string) => {
    const statuses = ["pending", "processing", "shipped", "delivered"];
    const currentIdx = statuses.indexOf(currentStatus.toLowerCase());
    const stepIdx = statuses.indexOf(step === "placed" ? "pending" : step);

    if (currentStatus === "cancelled") return "cancelled";
    if (stepIdx < currentIdx) return "completed";
    if (stepIdx === currentIdx) return "active";
    return "pending";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent selection:text-white">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 md:py-20 max-w-4xl">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="text-xs font-black text-accent uppercase tracking-widest bg-accent/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Real-Time Logistics
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Track Your Order
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-3 font-light">
            Enter your order number (e.g. <span className="text-foreground font-semibold">HT-123456-AX1</span>) to inspect live shipping updates.
          </p>
        </div>

        {/* Search Input Form */}
        <form
          onSubmit={handleSearch}
          className="glass-card p-3 sm:p-4 rounded-full border border-border/60 bg-muted/10 shadow-2xl flex items-center gap-2 max-w-xl mx-auto mb-12"
        >
          <div className="pl-4 text-muted-foreground">
            <Search className="h-5 w-5" />
          </div>
          <Input
            type="text"
            placeholder="Enter Order Number (HT-XXXXXX-AX1)..."
            value={orderNumberInput}
            onChange={(e) => setOrderNumberInput(e.target.value)}
            className="border-0 bg-transparent text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground/60 h-11"
          />
          <Button
            type="submit"
            disabled={isSearching}
            className="h-11 rounded-full px-6 bg-accent hover:bg-accent/90 text-white font-black text-xs transition-all shrink-0"
          >
            {isSearching ? (
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                Track Package
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </>
            )}
          </Button>
        </form>

        {/* Trace Result Output */}
        <AnimatePresence mode="wait">
          {orderResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8 w-full"
            >
              {/* Order Status Header Card */}
              <div className="glass-card p-6 sm:p-8 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="font-heading font-black text-xl text-foreground">
                      {orderResult.order_number}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        orderResult.status === "delivered"
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : orderResult.status === "cancelled"
                          ? "bg-red-500/10 text-red-500 border border-red-500/20"
                          : "bg-accent/10 text-accent border border-accent/20"
                      }`}
                    >
                      {orderResult.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-light">
                    Placed on {new Date(orderResult.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-muted/10 border border-border/30 px-4 py-2.5 rounded-2xl">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Payment Status</span>
                    <span className="text-xs font-black capitalize text-foreground">{orderResult.payment_status}</span>
                  </div>
                </div>
              </div>

              {/* Step Progress Bar */}
              <div className="glass-card p-6 sm:p-8 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-md">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-8">
                  Shipping Timeline
                </h3>

                {orderResult.status === "cancelled" ? (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-xs font-bold">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>This order was cancelled. Please contact customer support for assistance.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative">
                    {[
                      { key: "placed", label: "Order Placed", desc: "Receipt Generated", icon: Box },
                      { key: "processing", label: "Processing", desc: "Quality Inspection", icon: Clock },
                      { key: "shipped", label: "In Transit", desc: "Couriers Dispatch", icon: Truck },
                      { key: "delivered", label: "Delivered", desc: "Handed over to recipient", icon: PackageCheck },
                    ].map((st) => {
                      const state = getStepStatus(st.key as "placed" | "processing" | "shipped" | "delivered", orderResult.status);
                      const Icon = st.icon;

                      return (
                        <div key={st.key} className="flex flex-col items-center text-center gap-3 relative z-10">
                          <div
                            className={`h-12 w-12 rounded-2xl border flex items-center justify-center transition-all ${
                              state === "completed"
                                ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20"
                                : state === "active"
                                ? "bg-accent border-accent text-white shadow-lg shadow-accent/20 animate-pulse"
                                : "bg-muted/10 border-border/40 text-muted-foreground"
                            }`}
                          >
                            {state === "completed" ? (
                              <CheckCircle2 className="h-6 w-6" />
                            ) : (
                              <Icon className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h4
                              className={`text-xs font-black ${
                                state === "active" || state === "completed"
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {st.label}
                            </h4>
                            <p className="text-[10px] text-muted-foreground/70 font-light mt-0.5">{st.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Items Breakdown */}
              <div className="glass-card p-6 sm:p-8 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-md flex flex-col gap-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Order Items Breakdown
                </h3>

                <div className="divide-y divide-border/20 border border-border/30 rounded-2xl overflow-hidden bg-muted/5">
                  {orderResult.items.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between text-xs sm:text-sm font-semibold">
                      <div className="flex flex-col">
                        <span className="text-foreground font-bold">{item.variant}</span>
                        <span className="text-[11px] text-muted-foreground font-light">Quantity: {item.quantity}</span>
                      </div>
                      <span className="font-heading font-black text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price summary line */}
                <div className="flex justify-between items-center border-t border-border/20 pt-4 mt-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Grand Total Paid</span>
                  <span className="font-heading font-black text-xl text-accent">
                    ${orderResult.grand_total.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
