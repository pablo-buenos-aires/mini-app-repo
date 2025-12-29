import { apiFetch } from './client';

export type HealthResponse = {
  status: string;
};

export const fetchHealth = async (): Promise<HealthResponse> => {
  const res = await apiFetch('/health');
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }
  return res.json() as Promise<HealthResponse>;
};
