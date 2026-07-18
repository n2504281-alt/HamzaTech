"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { KeyRound, Mail, ShieldAlert, ArrowLeft, MailCheck } from "lucide-react";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message || "Failed to send reset email.");
        setIsLoading(false);
        return;
      }

      toast.success("Recovery instructions sent!");
      setIsSent(true);
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : "An unexpected error occurred.";
      toast.error(errorMsg);
    } finally {
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

            {isSent ? (
              // Success Screen
              <div className="flex flex-col items-center text-center py-4">
                <div className="h-16 w-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 animate-pulse">
                  <MailCheck className="h-8 w-8 text-accent" />
                </div>
                <h1 className="font-heading text-2xl font-black text-foreground tracking-tight mb-2">
                  Check Your Inbox
                </h1>
                <p className="text-xs text-muted-foreground font-light max-w-sm mb-8 leading-relaxed">
                  We have sent secure password recovery instructions to your email address. Please click the recovery link in that email to reset your credentials.
                </p>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-accent hover:underline flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to Sign In
                </Link>
              </div>
            ) : (
              // Forgot Form Screen
              <>
                <div className="flex flex-col gap-2 mb-6">
                  <h1 className="font-heading text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                    <KeyRound className="h-6 w-6 text-accent" />
                    Reset Password
                  </h1>
                  <p className="text-xs text-muted-foreground font-light">
                    Enter your email to receive secure recovery instructions.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

                  {/* Submit CTA */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-accent/15 mt-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Sending request...
                      </>
                    ) : (
                      "Send Recovery Link"
                    )}
                  </Button>
                </form>

                {/* Back to login */}
                <div className="text-center mt-6 pt-4 border-t border-border/10">
                  <Link
                    href="/login"
                    className="text-xs font-semibold text-accent hover:underline flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
