"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductExperience } from "@/components/product/product-experience";
import { ProductSpecs } from "@/components/product/product-specs";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductRelated } from "@/components/product/product-related";
import { FAQ } from "@/components/sections/faq";
import { Newsletter } from "@/components/sections/newsletter";
import { Reveal } from "@/components/animations/reveal";
import { Headphones, Briefcase, Cable, FileText, Award } from "lucide-react";

export function ProductDetailClient() {
  const [selectedColor, setSelectedColor] = useState<"black" | "white" | "orange">("orange");

  const boxItems = [
    { name: "Aura X1 Wireless Headphones", icon: Headphones },
    { name: "Eco-Luxury Rigid Travel Case", icon: Briefcase },
    { name: "Type-C Braided Heavy Duty Charging Cable", icon: Cable },
    { name: "3.5mm Aux Audio Heavy Duty Cable", icon: Cable },
    { name: "Matte-Laminated User Manual", icon: FileText },
    { name: "Signature 3-Year Warranty Certificate Card", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navigation Header */}
      <Header />

      {/* Main product presentation block */}
      <main className="flex-1 pt-28 pb-12">
        <div className="container mx-auto px-6">
          
          {/* Main 2-column layout (Desktop: Left=Gallery, Right=Info with sticky purchase) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
            
            {/* Left side: Product Gallery */}
            <div className="lg:col-span-7 w-full lg:sticky lg:top-28">
              <Reveal direction="down" delay={0.1}>
                <ProductGallery selectedColor={selectedColor} />
              </Reveal>
            </div>

            {/* Right side: Product Information & sticky buy actions */}
            <div className="lg:col-span-5 w-full">
              <Reveal direction="up" delay={0.2}>
                <ProductInfo
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                />
              </Reveal>
            </div>

          </div>

          {/* Core Product Description Block with premium typography */}
          <div className="max-w-4xl mx-auto mt-24 border-t border-border/40 pt-16 text-left">
            <Reveal direction="up" delay={0.1}>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground mb-6">
                Pure Acoustic Architecture
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed font-sans mb-8">
                Designed to deliver absolute silence and reference-grade audio reproduction, the HamzaTech Aura X1 incorporates a fully custom-tuned acoustic chamber. Our engineers implemented high-purity beryllium-coated diaphragm units that reduce transient distortion to less than 0.08% at 1kHz. Combined with custom-designed active noise cancellation DSP algorithms, the headset creates a pristine canvas for critical listening.
              </p>
              <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed font-sans mb-12">
                The external housing represents a meticulous balance of carbon alloy framing and custom-tempered structural glass plates. The glass elements contain reactive LEDs, responding with gentle ambient pulses to control feedback, EQ states, and bass dynamics.
              </p>
            </Reveal>

            {/* What's In The Box */}
            <Reveal direction="up" delay={0.2}>
              <div className="glass-card border border-border/50 rounded-3xl p-8 bg-muted/5 mt-6">
                <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground mb-6">
                  What&apos;s In The Box
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {boxItems.map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors duration-150">
                        <div className="p-2 rounded-xl bg-accent/5 text-accent shrink-0">
                          <IconComp className="h-4.5 w-4.5" />
                        </div>
                        <span>{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>

        </div>

        {/* 3D Parallax Sensory Experience */}
        <ProductExperience selectedColor={selectedColor} />

        {/* Technical Specs Comparison Table */}
        <ProductSpecs />

        {/* Customer Reviews Section */}
        <ProductReviews />

        {/* Related/Companion Products Section */}
        <ProductRelated />

        {/* FAQ Section */}
        <FAQ />

        {/* Newsletter Call to Action */}
        <Newsletter />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
