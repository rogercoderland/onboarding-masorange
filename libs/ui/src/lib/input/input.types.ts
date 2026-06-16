import type { ReactNode } from 'react';
import type { Input as BaseInput } from '@base-ui/react/input';

export interface InputProps
  extends Omit<BaseInput.Props, 'className' | 'render'> {
  /** Field label rendered above the control. */
  label?: ReactNode;
  /** Error message; its presence flips the field to the invalid state. */
  error?: ReactNode;
  /** Custom className on the field wrapper. */
  className?: string;
  /** Custom className on the underlying `<input>`. */
  inputClassName?: string;
}
