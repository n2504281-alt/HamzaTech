"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";


const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

export function Footer() {
  const footerLinks = {
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press Kit", href: "#" },
      { name: "News", href: "#" },
    ],
    support: [
      { name: "Product Support", href: "#" },
      { name: "Order Tracking", href: "#" },
      { name: "Returns & Exchanges", href: "#" },
      { name: "Store Locator", href: "#" },
    ],
    resources: [
      { name: "Developers", href: "#" },
      { name: "Aura Community", href: "#" },
      { name: "Acoustic Research", href: "#" },
      { name: "Corporate Sales", href: "#" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Settings", href: "#" },
      { name: "Warranty Details", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: <Twitter className="h-4 w-4" />, href: "#", name: "Twitter" },
    { icon: <Instagram className="h-4 w-4" />, href: "#", name: "Instagram" },
    { icon: <Github className="h-4 w-4" />, href: "#", name: "Github" },
    { icon: <Youtube className="h-4 w-4" />, href: "#", name: "Youtube" },
  ];

  return (
    <footer className="w-full bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-1">
              <span className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
                HAMZA<span className="text-accent">TECH</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-6">
              Engineering the future of audio. We design and build ultra-premium sensory products for creators and audio enthusiasts.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {socialLinks.map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">
              Company
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 inline-flex items-center gap-0.5 transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">
              Support
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 inline-flex items-center gap-0.5 transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">
              Resources
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 inline-flex items-center gap-0.5 transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">
              Legal
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 inline-flex items-center gap-0.5 transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-border mb-8" />

        {/* Copyright Panel */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HamzaTech. All rights reserved. Designed for the futuristic soundscape.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Powered by Next.js & Vercel</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
