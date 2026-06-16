import { forwardRef } from 'react';
import { Field } from '@base-ui/react/field';
import { Input as BaseInput } from '@base-ui/react/input';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { inputClasses } from './input.classes';
import type { InputProps } from './input.types';
import './input.css';

const inputRoot = cva(inputClasses.root, {
  variants: {
    invalid: {
      true: inputClasses.errorModifier,
      false: '',
    },
  },
  defaultVariants: {
    invalid: false,
  },
});

/**
 * Generic, theme-driven text input built on Base UI's Field + Input.
 *
 * Passing `error` renders the message below the control, sets `aria-invalid`,
 * and applies the error styling. `disabled` flows through Base UI's Field.
 *
 * @example
 * <Input label="Email" placeholder="you@example.com" value={v} onChange={onChange} />
 * <Input label="Price" value="000" error="Enter a valid price" />
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, disabled = false, className, inputClassName, ...props },
  ref,
) {
  const hasError = Boolean(error);

  return (
    <Field.Root
      disabled={disabled}
      className={clsx(inputRoot({ invalid: hasError }), className)}
    >
      {label && (
        <Field.Label className={inputClasses.label}>{label}</Field.Label>
      )}

      <BaseInput
        ref={ref}
        className={clsx(inputClasses.control, inputClassName)}
        aria-invalid={hasError || undefined}
        {...props}
      />

      {hasError && (
        <Field.Error className={inputClasses.error} match>
          {error}
        </Field.Error>
      )}
    </Field.Root>
  );
});
Input.displayName = 'Input';
