import { describe, it, expect } from 'vitest';
import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('formats whole pesos with PHP symbol', () => {
    expect(formatCurrency(100)).toContain('100');
    expect(formatCurrency(100)).toContain('₱');
  });

  it('formats centavos correctly', () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain('1,234');
    expect(result).toContain('56');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toContain('0');
  });

  it('formats large amounts with comma separators', () => {
    expect(formatCurrency(10000)).toContain('10,000');
  });
});
