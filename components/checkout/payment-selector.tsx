"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Landmark, Wallet, Check, ShieldCheck } from "lucide-react";

export type PaymentMethod = "card" | "paypal" | "apple" | "google" | "cod";

interface PaymentSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

export function PaymentSelector({ selectedMethod, onMethodChange }: PaymentSelectorProps) {
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const methods = [
    { id: "card" as PaymentMethod, name: "Credit / Debit Card", icon: CreditCard, subtitle: "Visa, Mastercard, Amex" },
    { id: "paypal" as PaymentMethod, name: "PayPal Premium", icon: Wallet, subtitle: "Secure redirect connection" },
    { id: "apple" as PaymentMethod, name: "Apple Pay Wallet", icon: Wallet, subtitle: "Direct biometrics check" },
    { id: "google" as PaymentMethod, name: "Google Pay Wallet", icon: Wallet, subtitle: "Chrome browser credentials" },
    { id: "cod" as PaymentMethod, name: "Cash on Delivery", icon: Landmark, subtitle: "Payment on courier handoff" },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      <h3 className="font-heading text-lg font-black text-foreground uppercase tracking-wide border-b border-border/20 pb-4">
        Payment Method
      </h3>

      <div className="flex flex-col gap-3.5">
        {methods.map((m) => {
          const IconComp = m.icon;
          const isSelected = selectedMethod === m.id;

          return (
            <div key={m.id} className="flex flex-col">
              <button
                onClick={() => onMethodChange(m.id)}
                type="button"
                className={`glass-card border rounded-3xl p-4 flex items-center justify-between transition-all duration-300 hover:scale-[1.01] text-left w-full ${
                  isSelected
                    ? "border-accent bg-accent/5 ring-1 ring-accent"
                    : "border-border/60 hover:border-accent/40 bg-muted/5"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-2xl border flex items-center justify-center transition-all ${
                      isSelected ? "bg-accent/15 text-accent border-accent/20" : "bg-muted/10 text-muted-foreground border-border/40"
                    }`}
                  >
                    <IconComp className="h-5 w-5" />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-foreground">{m.name}</span>
                    <span className="text-[10px] text-muted-foreground font-light">{m.subtitle}</span>
                  </div>
                </div>

                <div
                  className={`h-5.5 w-5.5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected ? "border-accent bg-accent" : "border-border/60 bg-transparent"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 text-white stroke-[3.5]" />}
                </div>
              </button>

              {/* Collapsible Card Input Fields */}
              <AnimatePresence initial={false}>
                {isSelected && m.id === "card" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-muted/10 border border-border/50 rounded-3xl p-5 flex flex-col gap-4 text-left ml-2"
                  >
                    {/* Cardholder Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alexander Mercer"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="bg-background border border-border/80 rounded-full h-10 px-4 text-xs font-semibold text-foreground focus:outline-none placeholder:text-muted-foreground/40"
                      />
                    </div>

                    {/* Card Number */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="•••• •••• •••• ••••"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="bg-background border border-border/80 rounded-full h-10 px-4 text-xs font-semibold text-foreground focus:outline-none placeholder:text-muted-foreground/40"
                      />
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="bg-background border border-border/80 rounded-full h-10 px-4 text-xs font-semibold text-foreground focus:outline-none placeholder:text-muted-foreground/40 text-center"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                          CVV Code
                        </label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="bg-background border border-border/80 rounded-full h-10 px-4 text-xs font-semibold text-foreground focus:outline-none placeholder:text-muted-foreground/40 text-center"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground border-t border-border/10 pt-3 mt-1 font-medium">
                      <ShieldCheck className="h-4 w-4 text-accent" />
                      <span>Encrypted SSL card transmission. Payment is processed securely.</span>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
