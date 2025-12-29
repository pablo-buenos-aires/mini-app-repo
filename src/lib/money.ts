export const formatMoney = (cents: number, currency = 'ARS') => {
  const amount = cents / 100;
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency
  }).format(amount);
};
