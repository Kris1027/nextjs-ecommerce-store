const currencyFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
});

const formatPrice = (price: string): string => {
  return currencyFormatter.format(Number(price));
};

export { formatPrice };
