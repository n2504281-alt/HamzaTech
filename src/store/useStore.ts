import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface StoreState {
  cartOpen: boolean;
  wishlistOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  cart: CartItem[];
  wishlist: Product[];
  setCartOpen: (open: boolean) => void;
  setWishlistOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set) => ({
  cartOpen: false,
  wishlistOpen: false,
  mobileMenuOpen: false,
  searchOpen: false,
  cart: [],
  wishlist: [],
  setCartOpen: (open) => set({ cartOpen: open }),
  setWishlistOpen: (open) => set({ wishlistOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.id === item.id);
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
      ),
    })),
  toggleWishlist: (product) =>
    set((state) => {
      const exists = state.wishlist.some((p) => p.id === product.id);
      if (exists) {
        return { wishlist: state.wishlist.filter((p) => p.id !== product.id) };
      }
      return { wishlist: [...state.wishlist, product] };
    }),
  clearCart: () => set({ cart: [] }),
}));
