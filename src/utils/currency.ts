export function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
}
