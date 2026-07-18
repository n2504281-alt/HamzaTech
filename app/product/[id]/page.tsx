import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProductDetailClient } from "./product-detail-client";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Generate dynamic SEO metadata matching requirements
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;

  if (id !== "aura-x1") {
    return {
      title: "Product Not Found | HamzaTech",
    };
  }

  return {
    title: "HamzaTech | Aura X1 — Premium Wireless ANC Headphones",
    description: "Experience absolute acoustic luxury with the HamzaTech Aura X1. Features adaptive -45dB Hybrid Active Noise Cancellation, Spatial Audio, and 40h Battery Life.",
    openGraph: {
      title: "HamzaTech Aura X1 Premium ANC Headphones",
      description: "Experience absolute acoustic luxury with the HamzaTech Aura X1.",
      images: [
        {
          url: "/images/headphones_hero.png",
          width: 800,
          height: 600,
          alt: "HamzaTech Aura X1 Headphones",
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  // Protect route and only allow aura-x1 for the flagship single-product context
  if (id !== "aura-x1") {
    notFound();
  }

  // Inject structured product JSON-LD data for SEO search benefits
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "HamzaTech Aura X1",
    "description": "Premium Wireless ANC Headphones",
    "image": "/images/headphones_hero.png",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "399.00",
      "availability": "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient />
    </>
  );
}
