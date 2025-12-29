import { apiFetch } from './client';

export type Product = {
  id: number;
  category_id?: number | null;
  title: string;
  description?: string | null;
  price_cents: number;
  currency: string;
  photo_url?: string | null;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type ProductsResponse = {
  data: Product[];
};

type ProductResponse = {
  data: Product;
};

export const fetchProducts = async (params?: { categoryId?: number }): Promise<Product[]> => {
  const search = new URLSearchParams();
  if (params?.categoryId) {
    search.set('categoryId', String(params.categoryId));
  }
  const suffix = search.toString();
  const res = await apiFetch(`/products${suffix ? `?${suffix}` : ''}`);
  if (!res.ok) {
    throw new Error(`Fetch products failed: ${res.status}`);
  }
  const payload = (await res.json()) as ProductsResponse;
  return payload.data ?? [];
};

export const fetchProduct = async (id: number): Promise<Product> => {
  const res = await apiFetch(`/products/${id}`);
  if (!res.ok) {
    throw new Error(`Fetch product failed: ${res.status}`);
  }
  const payload = (await res.json()) as ProductResponse;
  return payload.data;
};

export const fetchAdminProducts = async (params?: { categoryId?: number }): Promise<Product[]> => {
  const search = new URLSearchParams();
  if (params?.categoryId) {
    search.set('categoryId', String(params.categoryId));
  }
  const suffix = search.toString();
  const res = await apiFetch(`/admin/products${suffix ? `?${suffix}` : ''}`);
  if (!res.ok) {
    throw new Error(`Fetch admin products failed: ${res.status}`);
  }
  const payload = (await res.json()) as ProductsResponse;
  return payload.data ?? [];
};

export const createProduct = async (payload: {
  category_id?: number | null;
  title: string;
  description?: string;
  price_cents: number;
  currency: string;
  photo_url?: string;
  stock?: number;
  active?: boolean;
}): Promise<Product> => {
  const res = await apiFetch('/admin/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Create product failed: ${res.status}`);
  }
  const data = (await res.json()) as ProductResponse;
  return data.data;
};

export const updateProduct = async (
  id: number,
  payload: {
    category_id?: number | null;
    title?: string;
    description?: string;
    price_cents?: number;
    currency?: string;
    photo_url?: string;
    stock?: number;
    active?: boolean;
  }
): Promise<Product> => {
  const res = await apiFetch(`/admin/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Update product failed: ${res.status}`);
  }
  const data = (await res.json()) as ProductResponse;
  return data.data;
};

export const presignProductPhoto = async (
  id: number,
  contentType: string
): Promise<{ upload_url: string; public_url: string; key: string; disabled?: boolean }> => {
  const res = await apiFetch(`/admin/products/${id}/photo/presign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content_type: contentType })
  });
  if (!res.ok) {
    throw new Error(`Presign photo failed: ${res.status}`);
  }
  const data = (await res.json()) as { data: { upload_url: string; public_url: string; key: string; disabled?: boolean } };
  return data.data;
};
