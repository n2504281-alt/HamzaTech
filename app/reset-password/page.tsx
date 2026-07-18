"use client";

import React, { useState, useEffect } from "react";
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
import { ShieldCheck, Key, ShieldAlert, Check, X } from "lucide-react";

// Password strength schema
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const watchPassword = watch("password");

  useEffect(() => {
    setPasswordValue(watchPassword || "");
  }, [watchPassword]);

  // Visual password indicators
  const strengthChecks = [
    { label: "At least 8 characters", valid: passwordValue.length >= 8 },
    { label: "At least one uppercase letter", valid: /[A-Z]/.test(passwordValue) },
    { label: "At least one number", valid: /[0-9]/.test(passwordValue) },
    { label: "At least one special character", valid: /[^a-zA-Z0-9]/.test(passwordValue) },
  ];

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        toast.error(error.message || "Failed to update password.");
        setIsLoading(false);
        return;
      }

      toast.success("Password updated successfully! Welcome to your account.");
      router.push("/profile");
      router.refresh();
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : "An unexpected error occurred during password update.";
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-6 flex justify-center">
          <div className="w-full max-w-md glass-card border border-border/50 rounded-3xl p-8 bg-muted/5 backdrop-blur-md shadow-2xl relative overflow-hidden text-left animate-fadeIn">
            {/* Design Gradient Glow */}
            <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-2 mb-6">
              <h1 className="font-heading text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-accent" />
                New Credentials
              </h1>
              <p className="text-xs text-muted-foreground font-light">
                Please configure a strong, secure new password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
                  <Key className="h-3 w-3 text-accent" />
                  New Password
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

              {/* Strength Indicators */}
              <div className="p-3 bg-muted/10 rounded-2xl border border-border/20 flex flex-col gap-1.5">
                <span className="text-[9px] font-bold uppercase text-foreground/60 tracking-wider">
                  Password Strength Requirements:
                </span>
                <div className="flex flex-col gap-1">
                  {strengthChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-1.5 text-[10px]">
                      {check.valid ? (
                        <Check className="h-3.5 w-3.5 text-green-500 stroke-[3]" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-muted-foreground/60 stroke-[3]" />
                      )}
                      <span className={check.valid ? "text-green-500 font-semibold" : "text-muted-foreground font-medium"}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
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

              {/* Submit CTA */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-accent/15 mt-3"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Updating credentials...
                  </>
                ) : (
                  "Update Password & Log In"
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
