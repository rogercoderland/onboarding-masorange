import { formatPrice } from '../app/lib/format';

describe('formatPrice', () => {
  it('formats an amount as euros', () => {
    const result = formatPrice(909);
    expect(result).toContain('909');
    expect(result).toContain('€');
  });

  it('keeps the integer amount and adds no decimals', () => {
    // ICU-agnostic: a grouping separator may or may not be present depending on
    // the runtime's ICU data, but the digits must be exactly the amount and there
    // must be no decimal part.
    expect(formatPrice(1329).replace(/[^\d]/g, '')).toBe('1329');
    expect(formatPrice(909)).not.toMatch(/,\d/);
  });
});
