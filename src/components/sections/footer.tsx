"use client";

import { Compass, ArrowUp } from "lucide-react";

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Twitter = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = [
    {
      title: "Products",
      links: [
        { label: "Apparel", href: "#products" },
        { label: "Chrono Watches", href: "#products" },
        { label: "Leather Bags", href: "#products" },
        { label: "Audio Gear", href: "#products" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#why-choose-us" },
        { label: "Sustainability", href: "#why-choose-us" },
        { label: "Press", href: "#testimonials" },
        { label: "Careers", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "#" },
        { label: "Size Guides", href: "#" },
        { label: "Shipping Policy", href: "#" },
        { label: "Returns & Exchanges", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-primary text-primary-foreground border-t border-border/10 pt-16 pb-8 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-white/10">
          {/* Logo & Description */}
          <div className="md:col-span-4 space-y-5">
            <span className="text-xl font-black uppercase tracking-[0.25em] text-white">
              AURA
            </span>
            <p className="text-xs sm:text-sm text-primary-foreground/70 max-w-sm leading-relaxed">
              Redefining contemporary luxury through precision engineering, minimal design, and organic material sourcing. Made for the modern purist.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-primary-foreground/60 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/60 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-primary-foreground/60 hover:text-white transition-colors"
                aria-label="Pinterest"
              >
                <Compass className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((group, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white font-heading">
                  {group.title}
                </h4>
                <ul className="space-y-2.5">
                  {group.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={link.href}
                        className="text-xs sm:text-sm text-primary-foreground/65 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Area */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className="text-xs text-primary-foreground/50">
              &copy; {new Date().getFullYear()} AURA Inc. All rights reserved.
            </span>
            <div className="flex gap-3.5 text-xs text-primary-foreground/50">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Accessibility
              </a>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-3 select-none opacity-40 text-xs tracking-widest font-heading font-semibold text-white">
            <span>VISA</span>
            <span>MC</span>
            <span>AMEX</span>
            <span>APPLE PAY</span>
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors self-center sm:self-auto"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
