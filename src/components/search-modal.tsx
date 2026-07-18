"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, X, TrendingUp, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { PRODUCTS } from "@/lib/mockData";

export function SearchModal() {
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  // Filter products based on search query
  const filteredProducts = query
    ? PRODUCTS.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const popularSearches = ["Chrono", "Leather Bag", "Headphones", "Linen", "Espresso"];

  const handlePopularSearch = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 bg-black"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-2xl mx-auto mt-20 p-4"
          >
            <div className="bg-card rounded-xl border border-border/80 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              {/* Input Header */}
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search premium products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground text-base"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                    aria-label="Clear query"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center gap-1 h-5 select-none rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span>ESC</span>
                </kbd>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors sm:hidden"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-5">
                {query === "" ? (
                  /* Initial State: Popular searches */
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest font-heading flex items-center gap-2">
                        <TrendingUp className="h-3.5 w-3.5 text-accent" />
                        Popular Searches
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {popularSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handlePopularSearch(term)}
                            className="px-3 py-1.5 rounded-full border border-border hover:border-accent hover:text-accent bg-muted/20 text-xs font-medium font-heading transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  /* Empty Results State */
                  <div className="text-center py-10">
                    <p className="text-sm text-muted-foreground">
                      No results found for &ldquo;<span className="font-semibold text-foreground">{query}</span>&rdquo;
                    </p>
                  </div>
                ) : (
                  /* Search Results State */
                  <div className="space-y-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest font-heading">
                      Search Results ({filteredProducts.length})
                    </h3>
                    <div className="space-y-2">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            setSearchOpen(false);
                            // Normally navigation to product page occurs here
                          }}
                          className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-muted/40 border border-transparent hover:border-border/60 transition-all cursor-pointer group"
                        >
                          <div className="relative h-12 w-12 rounded bg-muted overflow-hidden shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors font-heading">
                              {product.name}
                            </h4>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-heading mt-0.5">
                              {product.category}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-foreground font-heading">
                            ${product.price}
                          </span>
                          <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
