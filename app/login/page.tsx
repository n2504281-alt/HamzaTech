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
import { LogIn, Key, Mail, ShieldAlert, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message || "Failed to log in. Please check credentials.");
        setIsLoading(false);
        return;
      }

      toast.success("Welcome back! Login authorized.");
      router.push("/profile");
      router.refresh();
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : "An unexpected error occurred during authorization.";
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-6 flex justify-center">
          <div className="w-full max-w-md glass-card border border-border/50 rounded-3xl p-8 bg-muted/5 backdrop-blur-md shadow-2xl relative overflow-hidden text-left">
            {/* Design Gradient Glow */}
            <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col gap-2 mb-6">
              <h1 className="font-heading text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                <LogIn className="h-6 w-6 text-accent" />
                Sign In
              </h1>
              <p className="text-xs text-muted-foreground font-light">
                Sign in to your premium account dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
                  <Mail className="h-3 w-3 text-accent" />
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    {...register("email")}
                    className={`bg-background/40 border h-11 px-4 text-xs font-semibold rounded-2xl ${
                      errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-border/80"
                    }`}
                  />
                </div>
                {errors.email && (
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-foreground uppercase tracking-wider flex items-center gap-1">
                    <Key className="h-3 w-3 text-accent" />
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-bold text-accent hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className={`bg-background/40 border h-11 px-4 text-xs font-semibold rounded-2xl ${
                      errors.password ? "border-red-500 focus-visible:ring-red-500" : "border-border/80"
                    }`}
                  />
                </div>
                {errors.password && (
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  {...register("rememberMe")}
                  className="h-4 w-4 rounded border-border/80 text-accent focus:ring-accent accent-accent cursor-pointer"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-xs font-medium text-muted-foreground select-none cursor-pointer"
                >
                  Remember Me on this device
                </label>
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
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Switch to Signup link */}
            <div className="text-center mt-6 pt-4 border-t border-border/10">
              <p className="text-xs text-muted-foreground font-light">
                Don&apos;t have an account yet?{" "}
                <Link href="/signup" className="text-accent font-bold hover:underline">
                  Create Premium Account
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
