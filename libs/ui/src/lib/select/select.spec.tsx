import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Select } from './select';
import type { SelectOption } from './select.types';

const OPTIONS: SelectOption[] = [
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

describe('Select', () => {
  it('renders a labelled trigger showing the placeholder when empty', () => {
    render(<Select options={OPTIONS} label="Sort" placeholder="Choose…" />);

    expect(screen.getByText('Sort')).toBeInTheDocument();

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('select__trigger');
    expect(trigger).toHaveTextContent('Choose…');
  });

  it('shows the selected option label when a defaultValue is set', () => {
    render(<Select options={OPTIONS} defaultValue="price-desc" />);

    expect(screen.getByRole('combobox')).toHaveTextContent('Price: high to low');
  });

  it('marks the trigger disabled when disabled', () => {
    render(<Select options={OPTIONS} disabled />);

    expect(screen.getByRole('combobox')).toHaveAttribute('data-disabled');
  });
});
