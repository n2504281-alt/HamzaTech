"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type FormData = z.infer<typeof schema>;

export function Newsletter() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Welcome to the AURA Collective!", {
      description: `Successfully subscribed with ${data.email}.`,
    });
    reset();
  };

  return (
    <section className="py-16 sm:py-24 bg-background overflow-hidden border-t border-border/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-4">
            <span className="text-xs font-semibold text-accent uppercase tracking-widest font-heading">
              AURA Collective
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground tracking-tight">
              Join the Collective
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto font-sans leading-relaxed">
              Subscribe to receive private sale access, custom batch announcements, and curated lifestyle editorials. No spam, unsubscribe anytime.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto space-y-3"
            noValidate
          >
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  {...register("email")}
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-3.5 bg-card border border-border focus:border-accent rounded-xl text-sm outline-none transition-colors disabled:opacity-60 text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/95 disabled:bg-primary/80 disabled:cursor-not-allowed px-6 py-3.5 sm:py-0 rounded-xl text-sm font-semibold transition-all shadow-sm font-heading shrink-0"
              >
                <span>{isSubmitting ? "Subscribing..." : "Subscribe"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Error Message */}
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-left text-xs text-red-500 font-medium font-heading px-1"
              >
                {errors.email.message}
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
