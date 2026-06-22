import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './button';

describe('Button', () => {
  it('renders the label with default variant and size classes', () => {
    render(<Button>Continue</Button>);

    const button = screen.getByRole('button', { name: 'Continue' });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('button', 'button--primary', 'button--md');
  });

  it('applies the requested variant and size', () => {
    render(
      <Button variant="ghost" size="lg">
        Cancel
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Cancel' });

    expect(button).toHaveClass('button--ghost', 'button--lg');
    expect(button).not.toHaveClass('button--primary');
  });

  it('calls the provided click handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Save</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick while disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows a spinner, sets aria-busy and blocks clicks while loading', () => {
    const handleClick = vi.fn();
    const { container } = render(
      <Button loading onClick={handleClick}>
        Saving
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Saving' });

    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();
    expect(container.querySelector('.button__spinner')).toBeInTheDocument();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders iconLeft when not loading', () => {
    const { container } = render(
      <Button iconLeft={<svg data-testid="icon" />}>Add</Button>,
    );

    expect(container.querySelector('.button__icon')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('forwards the ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Continue</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
