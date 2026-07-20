"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Search, Heart, ShoppingBag, User, Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Header() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const { isMobileMenuOpen, setMobileMenuOpen, setCartOpen } = useUIStore();

  useEffect(() => {
    setMounted(true);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: "Aura X1", href: "/product/aura-x1" },
    { name: "Features", href: "/#features" },
    { name: "Showcase", href: "/#showcase" },
    { name: "Track Order", href: "/track-order" },
    { name: "Reviews", href: "#reviews" },
    { name: "FAQ", href: "#faq" },
  ];

  if (!mounted) {
    return (
      <header className="fixed top-0 z-50 w-full border-b border-transparent bg-transparent py-4 transition-all duration-300">
        <div className="container mx-auto flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="font-heading text-xl font-extrabold tracking-tight text-white">
              HAMZA<span className="text-accent">TECH</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-5 w-5 rounded bg-zinc-800 animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-border bg-background/70 py-3 backdrop-blur-md"
          : "border-b border-transparent bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1.5 focus-visible:outline-none">
          <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
            HAMZA<span className="text-accent">TECH</span>
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Interaction Toolbar */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggler */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 transition-transform duration-300 hover:-rotate-12" />
            )}
          </Button>

          {/* Search Placeholder */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Wishlist Placeholder */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4 hover:scale-110 hover:text-red-500 transition-all" />
          </Button>

          {/* Cart Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCartOpen(true)}
            className="relative rounded-full text-muted-foreground hover:text-foreground"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {cartItemsCount}
              </span>
            )}
          </Button>

          {/* Profile Button */}
          <Link
            href={user ? "/profile" : "/login"}
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-all"
            aria-label={user ? "View Account" : "Sign In"}
          >
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile Avatar"
                className="h-6 w-6 rounded-full border border-accent/20 bg-muted"
              />
            ) : (
              <User className="h-4 w-4" />
            )}
          </Link>

          {/* Mobile Menu Drawer */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-full text-muted-foreground hover:text-foreground"
                  aria-label="Menu"
                />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-border bg-background p-6">
              <SheetHeader>
                <SheetTitle className="text-left font-heading text-lg font-extrabold text-foreground">
                  HAMZA<span className="text-accent">TECH</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="h-[1px] w-full bg-border" />
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full rounded-full gap-2 text-foreground bg-background"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCartOpen(true);
                    }}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Cart ({cartItemsCount})
                  </Button>

                  <Button
                    variant="default"
                    className="w-full rounded-full bg-accent hover:bg-accent/90 text-white font-semibold gap-2"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push(user ? "/profile" : "/login");
                    }}
                  >
                    <User className="h-4 w-4" />
                    {user ? "My Profile" : "Sign In"}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
