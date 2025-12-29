import { apiFetch } from './client';

export type OrderItem = {
  product_id: number;
  title: string;
  price_cents: number;
  qty: number;
  subtotal_cents: number;
};

export type Order = {
  id: number;
  user_id: number;
  total_cents: number;
  currency: string;
  status: string;
  contact_phone?: string | null;
  delivery_address?: string | null;
  comment?: string | null;
  created_at: string;
  items: OrderItem[];
};

export type OrderSummary = {
  id: number;
  total_cents: number;
  currency: string;
  status: string;
  created_at: string;
};

export type CustomerSummary = {
  user_id: number;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  first_seen_at: string;
  last_seen_at: string;
  orders_count: number;
};

type OrdersResponse = {
  data: Order[];
};

type OrderSummaryResponse = {
  data: OrderSummary;
};

type CustomersResponse = {
  data: CustomerSummary[];
};

export const createOrder = async (payload: {
  contact_phone?: string;
  delivery_address?: string;
  comment?: string;
}): Promise<OrderSummary> => {
  const res = await apiFetch('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Create order failed: ${res.status}`);
  }
  const data = (await res.json()) as OrderSummaryResponse;
  return data.data;
};

export const fetchMyOrders = async (): Promise<Order[]> => {
  const res = await apiFetch('/orders/my');
  if (!res.ok) {
    throw new Error(`Fetch orders failed: ${res.status}`);
  }
  const data = (await res.json()) as OrdersResponse;
  return data.data ?? [];
};

export const fetchAdminOrders = async (params?: {
  status?: string;
  from?: string;
  to?: string;
}): Promise<Order[]> => {
  const search = new URLSearchParams();
  if (params?.status) {
    search.set('status', params.status);
  }
  if (params?.from) {
    search.set('from', params.from);
  }
  if (params?.to) {
    search.set('to', params.to);
  }
  const suffix = search.toString();
  const res = await apiFetch(`/admin/orders${suffix ? `?${suffix}` : ''}`);
  if (!res.ok) {
    throw new Error(`Fetch admin orders failed: ${res.status}`);
  }
  const data = (await res.json()) as OrdersResponse;
  return data.data ?? [];
};

export const fetchAdminCustomers = async (): Promise<CustomerSummary[]> => {
  const res = await apiFetch('/admin/customers');
  if (!res.ok) {
    throw new Error(`Fetch admin customers failed: ${res.status}`);
  }
  const data = (await res.json()) as CustomersResponse;
  return data.data ?? [];
};
