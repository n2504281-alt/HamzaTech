"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { UserPlus, User, Mail, Key, Phone, ShieldAlert, ArrowRight } from "lucide-react";
import { subscribeNewsletterAction } from "@/actions/newsletter";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms & Conditions to proceed",
    }),
    newsletter: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
      newsletter: false,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      // 1. Sign up user via Supabase Auth
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            phone: data.phone || "",
            avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.fullName)}`,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpErr) {
        toast.error(signUpErr.message || "Failed to create account.");
        setIsLoading(false);
        return;
      }

      // 2. Opt-in to Newsletter if checked
      if (data.newsletter) {
        await subscribeNewsletterAction({ email: data.email });
      }

      // Check if user session exists immediately (e.g. if email verification is disabled)
      if (signUpData.session) {
        toast.success("Account created successfully!");
        router.push("/profile");
      } else {
        toast.success("Verification link sent! Check your inbox.");
        router.push("/verify-email");
      }
      router.refresh();
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : "An unexpected error occurred.";
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-6 flex justify-center">
          <div className="w-full max-w-lg glass-card border border-border/50 rounded-3xl p-8 bg-muted/5 backdrop-blur-md shadow-2xl relative overflow-hidden text-left animate-fadeIn">
            {/* Design Gradient Glow */}
            <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-2 mb-6">
              <h1 className="font-heading text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                <UserPlus className="h-6 w-6 text-accent" />
                Create Premium Account
              </h1>
              <p className="text-xs text-muted-foreground font-light">
                Sign up to unlock order tracking, default shipping configurations, and exclusive product support.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
                    <User className="h-3 w-3 text-accent" />
                    Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    {...register("fullName")}
                    className={`bg-background/40 border h-11 px-4 text-xs font-semibold rounded-2xl ${
                      errors.fullName ? "border-red-500 focus-visible:ring-red-500" : "border-border/80"
                    }`}
                  />
                  {errors.fullName && (
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      {errors.fullName.message}
                    </span>
                  )}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
                    <Phone className="h-3 w-3 text-accent" />
                    Phone (Optional)
                  </label>
                  <Input
                    type="tel"
                    placeholder="+1 555-0199"
                    {...register("phone")}
                    className="bg-background/40 border border-border/80 h-11 px-4 text-xs font-semibold rounded-2xl"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
                  <Mail className="h-3 w-3 text-accent" />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className={`bg-background/40 border h-11 px-4 text-xs font-semibold rounded-2xl ${
                    errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-border/80"
                  }`}
                />
                {errors.email && (
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
                    <Key className="h-3 w-3 text-accent" />
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className={`bg-background/40 border h-11 px-4 text-xs font-semibold rounded-2xl ${
                      errors.password ? "border-red-500 focus-visible:ring-red-500" : "border-border/80"
                    }`}
                  />
                  {errors.password && (
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      {errors.password.message}
                    </span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
                    <Key className="h-3 w-3 text-accent" />
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={`bg-background/40 border h-11 px-4 text-xs font-semibold rounded-2xl ${
                      errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : "border-border/80"
                    }`}
                  />
                  {errors.confirmPassword && (
                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col gap-2 mt-2">
                {/* Terms and Conditions */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    {...register("terms")}
                    className="h-4 w-4 rounded border-border/80 text-accent focus:ring-accent accent-accent cursor-pointer mt-0.5"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs font-medium text-muted-foreground select-none cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-accent hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-accent hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 pl-6">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {errors.terms.message}
                  </span>
                )}

                {/* Newsletter */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="newsletter"
                    {...register("newsletter")}
                    className="h-4 w-4 rounded border-border/80 text-accent focus:ring-accent accent-accent cursor-pointer mt-0.5"
                  />
                  <label
                    htmlFor="newsletter"
                    className="text-xs font-medium text-muted-foreground select-none cursor-pointer"
                  >
                    Subscribe to newsletter updates and exclusive pricing deals (Optional)
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-accent/15 mt-3"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Switch to login link */}
            <div className="text-center mt-6 pt-4 border-t border-border/10">
              <p className="text-xs text-muted-foreground font-light">
                Already have an account?{" "}
                <Link href="/login" className="text-accent font-bold hover:underline">
                  Sign In Instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
