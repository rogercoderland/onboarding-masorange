'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { CartLine, Device } from '../lib/models';

const STORAGE_KEY = 'tienda-cart';

type Variant = Device['variants'][number];

interface CartContextValue {
  items: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (device: Device, variant: Variant) => void;
  removeItem: (sku: string) => void;
  setQty: (sku: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartLine[]);
    } catch {
      // Ignore corrupt/unavailable storage.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore availability errors.
    }
  }, [items, hydrated]);

  const addItem = useCallback((device: Device, variant: Variant) => {
    setItems((prev) => {
      const existing = prev.find((line) => line.sku === variant.sku);
      if (existing) {
        return prev.map((line) =>
          line.sku === variant.sku ? { ...line, qty: line.qty + 1 } : line,
        );
      }
      return [
        ...prev,
        {
          slug: device.slug,
          name: device.name,
          price: device.price,
          image: device.images[0],
          color: variant.color,
          storage: variant.storage,
          sku: variant.sku,
          qty: 1,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((sku: string) => {
    setItems((prev) => prev.filter((line) => line.sku !== sku));
  }, []);

  const setQty = useCallback((sku: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((line) => line.sku !== sku)
        : prev.map((line) => (line.sku === sku ? { ...line, qty } : line)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const count = useMemo(
    () => items.reduce((total, line) => total + line.qty, 0),
    [items],
  );
  const subtotal = useMemo(
    () => items.reduce((total, line) => total + line.price * line.qty, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      setQty,
      clear,
    }),
    [
      items,
      count,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      setQty,
      clear,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
