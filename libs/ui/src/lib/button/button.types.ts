import type { ReactNode } from 'react';
import type { Button as BaseButton } from '@base-ui/react/button';

export const BUTTON_VARIANTS = ['primary', 'secondary', 'ghost'] as const;
export const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];

export interface ButtonProps
  extends Omit<BaseButton.Props, 'render' | 'className'> {
  /** Visual style. @default 'primary' */
  variant?: ButtonVariant;
  /** Control size. @default 'md' */
  size?: ButtonSize;
  /** Shows a spinner and blocks interaction while truthy. */
  loading?: boolean;
  /** Icon rendered before the label (hidden while loading). */
  iconLeft?: ReactNode;
  /** Custom className appended to the variant classes. */
  className?: string;
  children?: ReactNode;
}
