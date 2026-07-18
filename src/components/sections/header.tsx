"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const {
    setCartOpen,
    setWishlistOpen,
    setSearchOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
    cart,
    wishlist,
  } = useStore();

  // Handle hydrated state for theme toggle to prevent SSR mismatches
  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: "Shop All", href: "#products" },
    { label: "Categories", href: "#categories" },
    { label: "Our Story", href: "#why-choose-us" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full z-40 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border py-4 shadow-sm"
            : "bg-transparent border-b border-transparent py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="text-xl font-black font-heading uppercase tracking-[0.2em] text-foreground select-none"
          >
            AURA
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium font-heading text-muted-foreground hover:text-foreground transition-colors relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-full transition-all"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Dark Mode Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-full transition-all"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-full transition-all relative"
              aria-label="View wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center font-heading border border-background">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-full transition-all relative"
              aria-label="View cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalCartItems > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-accent text-[9px] font-bold text-white rounded-full flex items-center justify-center font-heading border border-background">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Account */}
            <button
              className="hidden sm:inline-flex p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-full transition-all"
              aria-label="User Account"
            >
              <User className="h-5 w-5" />
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-full transition-all"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />

            {/* Menu Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-xs bg-card shadow-2xl z-50 flex flex-col md:hidden border-l border-border"
            >
              <div className="p-5 border-b border-border flex items-center justify-between">
                <span className="text-lg font-black font-heading uppercase tracking-widest text-foreground">
                  AURA
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 p-6 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-base font-semibold font-heading text-muted-foreground hover:text-foreground transition-colors py-2 border-b border-border/40"
                  >
                    {link.label}
                  </a>
                ))}
                <button className="flex items-center gap-3 text-base font-semibold font-heading text-muted-foreground hover:text-foreground py-2 mt-4">
                  <User className="h-5 w-5" />
                  <span>My Account</span>
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
