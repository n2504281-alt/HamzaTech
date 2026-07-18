"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  selectedColor: "black" | "white" | "orange";
}

export function ProductGallery({ selectedColor }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: "none" });
  const containerRef = useRef<HTMLDivElement>(null);

  // Images mapping based on color selection
  const images = {
    orange: [
      "/images/headphones_hero.png",
      "/images/features_anc.png",
      "/images/features_driver.png",
    ],
    black: [
      "/images/headphones_black.png",
      "/images/features_anc.png",
      "/images/features_driver.png",
    ],
    white: [
      "/images/headphones_white.png",
      "/images/features_anc.png",
      "/images/features_driver.png",
    ],
  };

  const activeImages = images[selectedColor];

  // Reset index when color change
  useEffect(() => {
    setActiveIdx(0);
  }, [selectedColor]);

  // Hover magnifier calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${activeImages[activeIdx]})`,
      backgroundSize: "200%",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  // Grayscale and shift filters for secondary angles depending on selected color
  const getImageClassName = (index: number) => {
    if (index === 0) return "object-contain p-6"; // Main image is perfectly colored
    if (selectedColor === "black") {
      return "object-cover grayscale brightness-50 contrast-125 transition-all duration-300";
    }
    if (selectedColor === "white") {
      return "object-cover invert brightness-125 grayscale contrast-75 transition-all duration-300";
    }
    return "object-cover contrast-100 transition-all duration-300"; // Original orange
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Main Large Showcase Panel */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-square w-full rounded-3xl border border-border/60 bg-muted/30 overflow-hidden group cursor-crosshair backdrop-blur-sm"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedColor}-${activeIdx}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full relative"
          >
            <Image
              src={activeImages[activeIdx]}
              alt={`HamzaTech Aura X1 ${selectedColor} view`}
              fill
              priority
              className={getImageClassName(activeIdx)}
              sizes="(max-w-768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Magnifier Glass overlay */}
        <div
          style={zoomStyle}
          className="absolute inset-0 pointer-events-none hidden md:block rounded-3xl border border-accent/20 bg-no-repeat shadow-inner transition-opacity duration-150"
        />

        {/* Fullscreen Trigger */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-4 right-4 p-3 rounded-full bg-background/80 hover:bg-background text-foreground border border-border hover:scale-105 active:scale-95 transition shadow-lg backdrop-blur-md"
          aria-label="Expand image fullscreen"
        >
          <Maximize2 className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Thumbnail Nav Gallery */}
      <div className="grid grid-cols-3 gap-4">
        {activeImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`relative aspect-square rounded-2xl overflow-hidden border bg-muted/20 transition-all duration-300 ${
              activeIdx === idx
                ? "border-accent ring-1 ring-accent"
                : "border-border hover:border-accent/40"
            }`}
          >
            <Image
              src={img}
              alt={`Aura X1 thumbnail ${idx + 1}`}
              fill
              className={getImageClassName(idx)}
              sizes="120px"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 backdrop-blur-lg p-6"
          >
            {/* Close trigger */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-muted/80 hover:bg-muted text-foreground border border-border transition"
              aria-label="Close fullscreen modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Slider container */}
            <div className="relative w-full max-w-4xl aspect-[4/3] sm:aspect-video flex items-center justify-center">
              {/* Prev Button */}
              <button
                onClick={() =>
                  setActiveIdx((prev) => (prev === 0 ? activeImages.length - 1 : prev - 1))
                }
                className="absolute left-4 p-3 rounded-full bg-muted/80 hover:bg-muted text-foreground border border-border transition z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="relative w-full h-full">
                <Image
                  src={activeImages[activeIdx]}
                  alt="Aura X1 fullscreen view"
                  fill
                  className={`object-contain ${activeIdx === 0 ? "p-8" : ""}`}
                  sizes="100vw"
                />
              </div>

              {/* Next Button */}
              <button
                onClick={() =>
                  setActiveIdx((prev) => (prev === activeImages.length - 1 ? 0 : prev + 1))
                }
                className="absolute right-4 p-3 rounded-full bg-muted/80 hover:bg-muted text-foreground border border-border transition z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Slider Dots */}
            <div className="flex items-center gap-2 mt-6">
              {activeImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIdx === idx ? "w-6 bg-accent" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
