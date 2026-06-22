import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './input';

describe('Input', () => {
  it('renders a label associated with the control', () => {
    render(<Input label="Email" placeholder="you@example.com" />);

    const input = screen.getByLabelText('Email');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'you@example.com');
    expect(input).toHaveClass('input__control');
  });

  it('calls the change handler when typing', () => {
    const handleChange = vi.fn();
    render(<Input label="Name" onChange={handleChange} />);

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Ada' },
    });

    expect(handleChange).toHaveBeenCalled();
  });

  it('shows the error message and marks the field invalid', () => {
    const { container } = render(
      <Input label="Price" error="Enter a valid price" />,
    );

    expect(screen.getByText('Enter a valid price')).toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(container.querySelector('.input')).toHaveClass('input--error');
  });

  it('renders no error message by default', () => {
    const { container } = render(<Input label="Price" />);

    expect(container.querySelector('.input__error')).not.toBeInTheDocument();
    expect(container.querySelector('.input')).not.toHaveClass('input--error');
  });

  it('disables the control when disabled', () => {
    render(<Input label="Locked" disabled />);

    expect(screen.getByLabelText('Locked')).toBeDisabled();
  });

  it('forwards the ref to the underlying input element', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input label="Email" ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
