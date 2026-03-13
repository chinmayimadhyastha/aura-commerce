// src/contexts/WishlistContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface WishlistContextType {
  items: number[];
  toggle: (id: number) => void;
  isLiked: (id: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  toggle: () => {},
  isLiked: () => false,
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<number[]>([]);

  const toggle = (id: number) =>
    setItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const isLiked = (id: number) => items.includes(id);

  return (
    <WishlistContext.Provider value={{ items, toggle, isLiked }}>
      {children}
    </WishlistContext.Provider>
  );
};