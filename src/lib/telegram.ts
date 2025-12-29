export const getTelegramWebApp = () => {
  return window.Telegram?.WebApp ?? null;
};
