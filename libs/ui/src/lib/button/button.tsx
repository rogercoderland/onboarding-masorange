import { forwardRef } from 'react';
import { Button as BaseButton } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { buttonClasses } from './button.classes';
import type { ButtonProps } from './button.types';
import './button.css';

const buttonVariants = cva(buttonClasses.root, {
  variants: {
    variant: {
      primary: buttonClasses.primary,
      secondary: buttonClasses.secondary,
      ghost: buttonClasses.ghost,
    },
    size: {
      sm: buttonClasses.sm,
      md: buttonClasses.md,
      lg: buttonClasses.lg,
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

/**
 * Generic, theme-driven button built on Base UI.
 *
 * Variants: `primary` (default), `secondary`, `ghost`. Sizes: `sm`, `md` (default), `lg`.
 * `loading` shows a spinner, sets `aria-busy`, and blocks interaction.
 *
 * @example
 * <Button onClick={save}>Save</Button>
 * <Button variant="secondary" iconLeft={<PlusIcon />}>Add</Button>
 * <Button loading>Saving…</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant,
    size,
    loading = false,
    disabled = false,
    iconLeft,
    className,
    children,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;

  return (
    <BaseButton
      ref={ref}
      className={clsx(buttonVariants({ variant, size }), className)}
      disabled={isDisabled}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className={buttonClasses.spinner} aria-hidden="true" />}
      {!loading && iconLeft && (
        <span className={buttonClasses.icon} aria-hidden="true">
          {iconLeft}
        </span>
      )}
      <span className={buttonClasses.label}>{children}</span>
    </BaseButton>
  );
});
Button.displayName = 'Button';
