import { API_BASE_URL } from './baseUrl';
import { getTelegramWebApp } from '../lib/telegram';

export const apiFetch = (path: string, init?: RequestInit) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const headers = new Headers(init?.headers);
  const initData = getTelegramWebApp()?.initData;
  if (initData) {
    headers.set('X-Telegram-Init-Data', initData);
  }
  return fetch(`${API_BASE_URL}${normalizedPath}`, { ...init, headers });
};
