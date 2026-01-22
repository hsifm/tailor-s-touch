export const CURRENCY = {
  code: 'AED',
  symbol: 'AED',
  locale: 'en-AE',
};

export function formatCurrency(amount: number): string {
  return `${CURRENCY.symbol} ${amount.toLocaleString()}`;
}
