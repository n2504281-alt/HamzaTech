"use client";

import React from "react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (val: number) => void;
  maxStock?: number;
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  maxStock = 12,
}: QuantitySelectorProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    if (valStr === "") {
      // Allow empty temporarily while typing, but handle default on blur
      return;
    }
    const val = parseInt(valStr, 10);
    if (!isNaN(val)) {
      const sanitized = Math.max(1, Math.min(maxStock, val));
      onQuantityChange(sanitized);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      onQuantityChange(1);
    }
  };

  return (
    <div className="flex items-center border border-border/80 rounded-full h-10 px-2 bg-background w-fit">
      <button
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        className="text-muted-foreground hover:text-foreground px-2 text-base font-bold transition-colors"
        type="button"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <input
        type="text"
        value={quantity}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="w-10 text-center font-bold text-sm bg-transparent border-none outline-none text-foreground p-0 focus:ring-0 focus:outline-none"
        aria-label="Item quantity"
      />
      <button
        onClick={() => onQuantityChange(Math.min(maxStock, quantity + 1))}
        className="text-muted-foreground hover:text-foreground px-2 text-base font-bold transition-colors"
        type="button"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
