import { apiFetch } from './client';

export type Category = {
  id: number;
  name: string;
  sort: number;
  created_at: string;
};

type CategoriesResponse = {
  data: Category[];
};

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await apiFetch('/categories');
  if (!res.ok) {
    throw new Error(`Fetch categories failed: ${res.status}`);
  }
  const payload = (await res.json()) as CategoriesResponse;
  return payload.data ?? [];
};

export const fetchAdminCategories = async (): Promise<Category[]> => {
  const res = await apiFetch('/admin/categories');
  if (!res.ok) {
    throw new Error(`Fetch admin categories failed: ${res.status}`);
  }
  const payload = (await res.json()) as CategoriesResponse;
  return payload.data ?? [];
};

export const createCategory = async (payload: { name: string; sort?: number }): Promise<Category> => {
  const res = await apiFetch('/admin/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Create category failed: ${res.status}`);
  }
  const data = (await res.json()) as { data: Category };
  return data.data;
};

export const updateCategory = async (
  id: number,
  payload: { name?: string; sort?: number }
): Promise<Category> => {
  const res = await apiFetch(`/admin/categories/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Update category failed: ${res.status}`);
  }
  const data = (await res.json()) as { data: Category };
  return data.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  const res = await apiFetch(`/admin/categories/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    throw new Error(`Delete category failed: ${res.status}`);
  }
};
