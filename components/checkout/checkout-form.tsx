"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required (minimum 2 characters)"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  company: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(3, "Please enter a valid postal code"),
  address1: z.string().min(5, "Address Line 1 is required"),
  address2: z.string().optional(),
  orderNotes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  form: UseFormReturn<CheckoutFormValues>;
}

export function CheckoutForm({ form }: CheckoutFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-6 text-left">
      <h3 className="font-heading text-lg font-black text-foreground uppercase tracking-wide border-b border-border/20 pb-4">
        Customer Information
      </h3>

      {/* Row: Full Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-xs font-bold text-foreground uppercase tracking-wider">
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="e.g. Alexander Mercer"
            {...register("fullName")}
            className={`bg-muted/10 border rounded-full h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground/40 ${
              errors.fullName ? "border-red-500/50" : "border-border/80"
            }`}
          />
          {errors.fullName && (
            <span className="text-[10px] font-semibold text-red-500 mt-0.5 ml-3">
              {errors.fullName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-bold text-foreground uppercase tracking-wider">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            placeholder="e.g. alex@example.com"
            {...register("email")}
            className={`bg-muted/10 border rounded-full h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground/40 ${
              errors.email ? "border-red-500/50" : "border-border/80"
            }`}
          />
          {errors.email && (
            <span className="text-[10px] font-semibold text-red-500 mt-0.5 ml-3">
              {errors.email.message}
            </span>
          )}
        </div>
      </div>

      {/* Row: Phone & Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-xs font-bold text-foreground uppercase tracking-wider">
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="e.g. +1 (555) 019-2834"
            {...register("phone")}
            className={`bg-muted/10 border rounded-full h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground/40 ${
              errors.phone ? "border-red-500/50" : "border-border/80"
            }`}
          />
          {errors.phone && (
            <span className="text-[10px] font-semibold text-red-500 mt-0.5 ml-3">
              {errors.phone.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-xs font-bold text-foreground uppercase tracking-wider">
            Company <span className="text-muted-foreground/60">(Optional)</span>
          </label>
          <input
            id="company"
            type="text"
            placeholder="e.g. Acme Corporation"
            {...register("company")}
            className="bg-muted/10 border border-border/80 rounded-full h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground/40"
          />
        </div>
      </div>

      <h3 className="font-heading text-lg font-black text-foreground uppercase tracking-wide border-b border-border/20 pb-4 mt-4">
        Shipping Address
      </h3>

      {/* Row: Address Line 1 */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="address1" className="text-xs font-bold text-foreground uppercase tracking-wider">
          Address Line 1 *
        </label>
        <input
          id="address1"
          type="text"
          placeholder="e.g. 742 Evergreen Terrace"
          {...register("address1")}
          className={`bg-muted/10 border rounded-full h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground/40 ${
            errors.address1 ? "border-red-500/50" : "border-border/80"
          }`}
        />
        {errors.address1 && (
          <span className="text-[10px] font-semibold text-red-500 mt-0.5 ml-3">
            {errors.address1.message}
          </span>
        )}
      </div>

      {/* Row: Address Line 2 */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="address2" className="text-xs font-bold text-foreground uppercase tracking-wider">
          Address Line 2 <span className="text-muted-foreground/60">(Optional)</span>
        </label>
        <input
          id="address2"
          type="text"
          placeholder="e.g. Apartment, Suite, Unit, etc."
          {...register("address2")}
          className="bg-muted/10 border border-border/80 rounded-full h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground/40"
        />
      </div>

      {/* Row: Country, State, City, PostalCode */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="country" className="text-xs font-bold text-foreground uppercase tracking-wider">
            Country *
          </label>
          <input
            id="country"
            type="text"
            placeholder="e.g. United States"
            {...register("country")}
            className={`bg-muted/10 border rounded-full h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground/40 ${
              errors.country ? "border-red-500/50" : "border-border/80"
            }`}
          />
          {errors.country && (
            <span className="text-[10px] font-semibold text-red-500 mt-0.5 ml-3">
              {errors.country.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="text-xs font-bold text-foreground uppercase tracking-wider">
            City *
          </label>
          <input
            id="city"
            type="text"
            placeholder="e.g. Springfield"
            {...register("city")}
            className={`bg-muted/10 border rounded-full h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground/40 ${
              errors.city ? "border-red-500/50" : "border-border/80"
            }`}
          />
          {errors.city && (
            <span className="text-[10px] font-semibold text-red-500 mt-0.5 ml-3">
              {errors.city.message}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="state" className="text-xs font-bold text-foreground uppercase tracking-wider">
            State / Province *
          </label>
          <input
            id="state"
            type="text"
            placeholder="e.g. Illinois"
            {...register("state")}
            className={`bg-muted/10 border rounded-full h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground/40 ${
              errors.state ? "border-red-500/50" : "border-border/80"
            }`}
          />
          {errors.state && (
            <span className="text-[10px] font-semibold text-red-500 mt-0.5 ml-3">
              {errors.state.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="postalCode" className="text-xs font-bold text-foreground uppercase tracking-wider">
            Postal Code *
          </label>
          <input
            id="postalCode"
            type="text"
            placeholder="e.g. 62704"
            {...register("postalCode")}
            className={`bg-muted/10 border rounded-full h-11 px-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground/40 ${
              errors.postalCode ? "border-red-500/50" : "border-border/80"
            }`}
          />
          {errors.postalCode && (
            <span className="text-[10px] font-semibold text-red-500 mt-0.5 ml-3">
              {errors.postalCode.message}
            </span>
          )}
        </div>
      </div>

      {/* Order Notes Optional Textbox */}
      <div className="flex flex-col gap-1.5 mt-2">
        <label htmlFor="orderNotes" className="text-xs font-bold text-foreground uppercase tracking-wider">
          Order Notes <span className="text-muted-foreground/60">(Optional)</span>
        </label>
        <textarea
          id="orderNotes"
          placeholder="e.g. Please leave the package with the concierge."
          rows={3}
          {...register("orderNotes")}
          className="bg-muted/10 border border-border/80 rounded-2xl p-4 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground/40 resize-none font-sans"
        />
      </div>

    </div>
  );
}
