import type { CartItem } from '../store/cart';
import { apiFetch } from './client';

type CartResponse = {
  data: CartItem[];
};

export const fetchCart = async (): Promise<CartItem[]> => {
  const res = await apiFetch('/cart');
  if (!res.ok) {
    throw new Error(`Fetch cart failed: ${res.status}`);
  }
  const payload = (await res.json()) as CartResponse;
  return payload.data ?? [];
};

export const syncCart = async (items: CartItem[]): Promise<CartItem[]> => {
  const res = await apiFetch('/cart/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(items)
  });
  if (!res.ok) {
    throw new Error(`Sync cart failed: ${res.status}`);
  }
  const payload = (await res.json()) as CartResponse;
  return payload.data ?? [];
};
