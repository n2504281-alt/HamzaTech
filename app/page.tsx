import React from "react";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { Showcase } from "@/components/sections/showcase";
import { Specifications } from "@/components/sections/specifications";
import { WhyHamzaTech } from "@/components/sections/why-hamzatech";
import { Reviews } from "@/components/sections/reviews";
import { FAQ } from "@/components/sections/faq";
import { Newsletter } from "@/components/sections/newsletter";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col">
      {/* Sticky Header Nav */}
      <Header />

      {/* Main Page Layout */}
      <main className="flex-grow flex flex-col">
        {/* 1. Hero Experience */}
        <Hero />

        {/* 2. Core Features */}
        <Features />

        {/* 3. Product Anatomy Showcase */}
        <Showcase />

        {/* 4. Technical Specs Tab Sheet */}
        <Specifications />

        {/* 5. Brand Integrity & Benefits */}
        <WhyHamzaTech />

        {/* 6. Client Testimonial Reviews */}
        <Reviews />

        {/* 7. Animated FAQ Accordion */}
        <FAQ />

        {/* 8. Luxury Minimalist Newsletter */}
        <Newsletter />
      </main>

      {/* Semantic Footer */}
      <Footer />
    </div>
  );
}
