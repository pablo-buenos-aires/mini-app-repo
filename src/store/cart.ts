import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  product_id: number;
  title: string;
  price_cents: number;
  qty: number;
  subtotal_cents: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'qty' | 'subtotal_cents'>, qty: number) => void;
  increment: (productId: number) => void;
  decrement: (productId: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  mergeItems: (serverItems: CartItem[]) => void;
  totalCents: () => number;
};

const buildItem = (
  product: Omit<CartItem, 'qty' | 'subtotal_cents'>,
  qty: number
): CartItem => ({
  ...product,
  qty,
  subtotal_cents: product.price_cents * qty
});

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, qty) =>
        set((state) => {
          const safeQty = qty < 1 ? 1 : qty;
          const existing = state.items.find(
            (entry) => entry.product_id === product.product_id
          );
          if (existing) {
            return {
              items: state.items.map((entry) => {
                if (entry.product_id !== product.product_id) {
                  return entry;
                }
                const nextQty = entry.qty + safeQty;
                return {
                  ...entry,
                  qty: nextQty,
                  subtotal_cents: entry.price_cents * nextQty
                };
              })
            };
          }
          return { items: [...state.items, buildItem(product, safeQty)] };
        }),
      increment: (productId) =>
        set((state) => ({
          items: state.items.map((entry) => {
            if (entry.product_id !== productId) {
              return entry;
            }
            const nextQty = entry.qty + 1;
            return {
              ...entry,
              qty: nextQty,
              subtotal_cents: entry.price_cents * nextQty
            };
          })
        })),
      decrement: (productId) =>
        set((state) => ({
          items: state.items
            .map((entry) => {
              if (entry.product_id !== productId) {
                return entry;
              }
              const nextQty = entry.qty - 1;
              if (nextQty < 1) {
                return null;
              }
              return {
                ...entry,
                qty: nextQty,
                subtotal_cents: entry.price_cents * nextQty
              };
            })
            .filter((entry): entry is CartItem => entry !== null)
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((entry) => entry.product_id !== productId)
        })),
      clear: () => set({ items: [] }),
      mergeItems: (serverItems) =>
        set((state) => {
          if (state.items.length === 0) {
            return { items: serverItems };
          }
          if (serverItems.length === 0) {
            return { items: state.items };
          }
          const localIds = new Set(state.items.map((item) => item.product_id));
          const merged = [...state.items];
          for (const item of serverItems) {
            if (!localIds.has(item.product_id)) {
              merged.push(item);
            }
          }
          return { items: merged };
        }),
      totalCents: () =>
        get().items.reduce((sum, item) => sum + item.subtotal_cents, 0)
    }),
    {
      name: 'telegram_shop_cart',
      partialize: (state) => ({ items: state.items })
    }
  )
);

export default useCartStore;
