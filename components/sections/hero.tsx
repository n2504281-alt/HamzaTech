"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Battery, ShieldAlert, Disc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverTilt } from "@/components/animations/hover-tilt";
import { Reveal } from "@/components/animations/reveal";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityBg = useTransform(scrollY, [0, 500], [1, 0]);

  // Mock product object for adding to cart
  const auraX1Product = {
    id: "aura-x1-headphones",
    name: "HamzaTech Aura X1",
    description: "Premium Wireless ANC Headphones",
    price: 399.00,
    image_url: "/images/headphones_hero.png",
  };

  const handlePreOrder = () => {
    addItem(auraX1Product, 1);
    setCartOpen(true);
  };

  const stats = [
    { icon: <ShieldAlert className="h-4 w-4 text-accent" />, text: "Hybrid ANC -45dB" },
    { icon: <Battery className="h-4 w-4 text-accent" />, text: "40h Battery Life" },
    { icon: <Disc className="h-4 w-4 text-accent" />, text: "Spatial Audio" },
  ];

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background pt-24 pb-12"
    >
      {/* Dynamic Background Volumetric Glow */}
      <motion.div
        style={{ y: yBg, opacity: opacityBg }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-accent/15 dark:bg-accent/10 rounded-full blur-[120px] pointer-events-none z-0"
      />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Hero Left Content */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
          <Reveal direction="down" delay={0.1}>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 mb-6 hover:bg-accent/10 transition-colors pointer-events-none mx-auto lg:mx-0 w-fit">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                The New Standard of Acoustics
              </span>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.2}>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-foreground mb-6">
              AURA <span className="text-gradient font-black">X1</span>
            </h1>
          </Reveal>

          <Reveal direction="up" delay={0.3}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8 mx-auto lg:mx-0 leading-relaxed font-sans font-light">
              Immerse yourself in acoustic perfection. Designed with luxury carbon alloy, reactive ambient aura dials, and zero-latency spatial mapping.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                onClick={handlePreOrder}
                className="w-full sm:w-auto h-14 px-8 rounded-full bg-accent hover:bg-accent/90 text-white font-semibold text-base shadow-lg shadow-accent/20 hover:shadow-accent/45 transition-all duration-300 hover:scale-105"
              >
                Pre-order Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link
                href="#specifications"
                className="w-full sm:w-auto h-14 px-8 rounded-full border border-border bg-card hover:bg-muted font-semibold text-base text-foreground transition-all duration-300 flex items-center justify-center"
              >
                <Play className="mr-2 h-4 w-4 fill-foreground" />
                Explore Specs
              </Link>
            </div>
          </Reveal>

          {/* Quick Specifications Overlay */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto lg:mx-0">
            {stats.map((stat, index) => (
              <Reveal key={index} direction="up" delay={0.5 + index * 0.1}>
                <div className="glass-card flex flex-col items-center p-3 rounded-2xl border border-border/50 text-center">
                  <div className="p-2 rounded-full bg-accent/5 mb-2">
                    {stat.icon}
                  </div>
                  <span className="text-xs font-semibold text-foreground tracking-tight">
                    {stat.text}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Hero Right Media (3D Headphone Parallax Container) */}
        <div className="col-span-1 lg:col-span-6 flex justify-center items-center relative h-[450px] md:h-[600px] w-full">
          <HoverTilt maxRotation={8} className="w-full h-full flex items-center justify-center">
            {/* Background Orange Ambient Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-accent/20 dark:bg-accent/15 blur-[60px] pointer-events-none z-0 animate-pulse" />

            {/* Floating Headphone Asset */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ 
                y: [0, -15, 0], 
                opacity: 1 
              }}
              transition={{
                y: {
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut"
                },
                opacity: {
                  duration: 1
                }
              }}
              className="relative z-10 w-[300px] h-[300px] md:w-[450px] md:h-[450px] drop-shadow-[0_25px_50px_rgba(249,115,22,0.15)] filter"
            >
              <Image
                src="/images/headphones_hero.png"
                alt="HamzaTech Aura X1 Premium ANC Headphones"
                fill
                priority
                className="object-contain hover:scale-105 transition-transform duration-500"
                sizes="(max-w-768px) 300px, 450px"
              />
            </motion.div>

            {/* Parallax Floating Glass Cards */}
            <motion.div
              style={{ transform: "translateZ(30px)" }}
              className="absolute top-1/4 left-0 sm:left-4 z-25 glass-card px-4 py-3 rounded-2xl border border-white/10 hidden sm:flex items-center gap-2.5 backdrop-blur-md"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-accent animate-ping" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Aura Glow Ring</span>
                <span className="text-xs font-bold text-foreground">Interactive LEDs</span>
              </div>
            </motion.div>

            <motion.div
              style={{ transform: "translateZ(50px)" }}
              className="absolute bottom-1/4 right-0 sm:right-4 z-25 glass-card px-4 py-3 rounded-2xl border border-white/10 hidden sm:flex items-center gap-2.5 backdrop-blur-md"
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Audio Fidelity</span>
                <span className="text-xs font-bold text-foreground">40mm Dynamic Driver</span>
              </div>
            </motion.div>
          </HoverTilt>
        </div>

      </div>
    </section>
  );
}
