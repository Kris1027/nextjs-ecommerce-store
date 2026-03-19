const currencyFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
});

const formatPrice = (price: string): string => {
  const value = Number(price);
  if (!Number.isFinite(value)) return '—';
  return currencyFormatter.format(value);
};

export { formatPrice };
