"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/animations/reveal";

const newsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

export function Newsletter() {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterValues) => {
    setIsLoading(true);
    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success(`Subscribed successfully with ${data.email}! Welcome to the HamzaTech inner circle.`);
    reset();
  };

  return (
    <section className="relative w-full py-24 md:py-32 bg-card border-t border-border overflow-hidden">
      {/* Glow rings background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          
          <Reveal direction="down" delay={0.1}>
            <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
              Exclusive Access
            </span>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mt-4 mb-6 leading-tight">
              Join the Acoustic Circle
            </h2>
          </Reveal>

          <Reveal direction="up" delay={0.3}>
            <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed mb-10 max-w-xl mx-auto">
              Subscribe to receive exclusive pre-order notifications, early access to research whitepapers, and firmware update logs.
            </p>
          </Reveal>

          {/* Subscription Input Form */}
          <Reveal direction="up" delay={0.4}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="relative flex flex-col sm:flex-row items-stretch justify-center max-w-lg mx-auto gap-3"
            >
              <div className="relative flex-grow flex flex-col items-start">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  {...register("email")}
                  className={`h-14 pl-12 pr-4 bg-background border-border hover:border-accent/40 focus:border-accent rounded-full text-foreground placeholder:text-muted-foreground font-sans focus-visible:ring-1 focus-visible:ring-accent w-full ${
                    errors.email ? "border-red-500 hover:border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-14 px-8 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-accent/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
            {errors.email && (
              <p className="text-xs font-semibold text-red-500 text-center mt-3">
                {errors.email.message}
              </p>
            )}
          </Reveal>

          <Reveal direction="up" delay={0.5}>
            <p className="text-[11px] text-muted-foreground font-light tracking-wide mt-6 uppercase">
              No spam. Unsubscribe at any time with a single click.
            </p>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
