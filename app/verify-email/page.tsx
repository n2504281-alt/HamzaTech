"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Mail, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-6 flex justify-center">
          <div className="w-full max-w-md glass-card border border-border/50 rounded-3xl p-8 bg-muted/5 backdrop-blur-md shadow-2xl relative overflow-hidden text-center animate-fadeIn">
            {/* Design Gradient Glow */}
            <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

            <div className="h-16 w-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 mx-auto animate-bounce">
              <Mail className="h-8 w-8 text-accent" />
            </div>

            <h1 className="font-heading text-2xl font-black text-foreground tracking-tight mb-2">
              Verify Your Email
            </h1>
            <p className="text-xs text-muted-foreground font-light max-w-xs mx-auto mb-8 leading-relaxed">
              We have sent a secure verification link to your email address. Please click the verification link in the email to activate your premium account profile.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full h-11 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-accent/15"
              >
                Proceed to Sign In
                <ArrowRight className="h-4 w-4" />
              </Link>

              <span className="text-[10px] text-muted-foreground/60">
                Didn&apos;t receive the email? Check your Spam or Promotion folders.
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
