"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Shield, Sparkles, Disc } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";

interface ProductExperienceProps {
  selectedColor: "black" | "white" | "orange";
}

export function ProductExperience({ selectedColor }: ProductExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coords motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs configuration
  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  // Parallax offsets for floating badge overlays
  const badgeX1 = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const badgeY1 = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);

  const badgeX2 = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, -20]), springConfig);
  const badgeY2 = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), springConfig);

  // Shadow movement opposite to headphone tilt
  const shadowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [15, -15]), springConfig);
  const shadowScale = useSpring(useTransform(mouseY, [-0.5, 0.5], [0.95, 1.05]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const xVal = (e.clientX - left) / width - 0.5;
    const yVal = (e.clientY - top) / height - 0.5;
    mouseX.set(xVal);
    mouseY.set(yVal);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const imagePaths = {
    orange: "/images/headphones_hero.png",
    black: "/images/headphones_black.png",
    white: "/images/headphones_white.png",
  };

  return (
    <section className="relative w-full py-20 md:py-28 bg-card border-t border-border overflow-hidden">
      
      {/* Dynamic glow rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <Reveal direction="down" delay={0.1}>
            <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
              Sensory Innovation
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mt-4 mb-6 leading-tight">
              3D Sensory Experience
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.3}>
            <p className="text-muted-foreground text-base sm:text-lg font-light leading-relaxed">
              Interact with the architectural structure of the Aura X1. Hover or drag your cursor to explore depth, reflections, and lights.
            </p>
          </Reveal>
        </div>

        {/* Parallax Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative max-w-2xl h-[450px] md:h-[550px] mx-auto rounded-3xl border border-border/40 bg-muted/10 overflow-hidden flex items-center justify-center p-8 cursor-grab active:cursor-grabbing backdrop-blur-sm"
          style={{ perspective: 1000 }}
        >
          {/* Pulsing Backlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none animate-pulse" />

          {/* Interactive Tilt Headphone Frame */}
          <motion.div
            style={{
              rotateX: rotateX,
              rotateY: rotateY,
              transformStyle: "preserve-3d",
            }}
            animate={{
              y: isHovered ? 0 : [0, -10, 0],
            }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
              },
            }}
            className="relative z-10 w-[260px] h-[260px] md:w-[380px] md:h-[380px] flex items-center justify-center"
          >
            {/* Front Light Flare Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-full opacity-40 pointer-events-none" />

            <Image
              src={imagePaths[selectedColor]}
              alt={`Aura X1 3D Object ${selectedColor}`}
              fill
              className="object-contain drop-shadow-[0_20px_40px_rgba(249,115,22,0.1)] select-none pointer-events-none"
              sizes="380px"
            />
          </motion.div>

          {/* Dynamic Depth Drop Shadow */}
          <motion.div
            style={{
              x: shadowX,
              scale: shadowScale,
            }}
            className="absolute bottom-12 w-[180px] h-6 md:w-[240px] md:h-8 bg-black/40 rounded-full blur-xl z-0 pointer-events-none"
          />

          {/* Parallax Floating Stat Badge 1 */}
          <motion.div
            style={{
              x: badgeX1,
              y: badgeY1,
              transform: "translateZ(60px)",
            }}
            className="absolute top-16 left-6 md:left-12 glass-card px-4 py-2.5 rounded-2xl border border-white/10 hidden sm:flex items-center gap-2 backdrop-blur-md shadow-lg"
          >
            <Disc className="h-4 w-4 text-accent animate-spin" style={{ animationDuration: "6s" }} />
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Acoustics</span>
              <span className="text-xs font-bold text-foreground">Spatial Sound</span>
            </div>
          </motion.div>

          {/* Parallax Floating Stat Badge 2 */}
          <motion.div
            style={{
              x: badgeX2,
              y: badgeY2,
              transform: "translateZ(80px)",
            }}
            className="absolute bottom-20 right-6 md:right-12 glass-card px-4 py-2.5 rounded-2xl border border-white/10 hidden sm:flex items-center gap-2 backdrop-blur-md shadow-lg"
          >
            <Shield className="h-4 w-4 text-accent" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">Cancellation</span>
              <span className="text-xs font-bold text-foreground">Hybrid -45dB ANC</span>
            </div>
          </motion.div>

          {/* Center Info Indicator */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/60 border border-border/40 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-accent animate-ping" />
              Hover to Tilt
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
