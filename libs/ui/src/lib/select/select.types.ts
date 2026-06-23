import type { ReactNode } from 'react';

export interface SelectOption<Value extends string = string> {
  /** Unique value submitted/reported when this option is chosen. */
  value: Value;
  /** Visible label. */
  label: ReactNode;
  /** Renders the option non-interactive. */
  disabled?: boolean;
}

export interface SelectProps<Value extends string = string> {
  /** Options to render in the listbox. */
  options: SelectOption<Value>[];
  /** Controlled value. */
  value?: Value;
  /** Initial value when uncontrolled. */
  defaultValue?: Value;
  /** Called with the new value when the selection changes. */
  onValueChange?: (value: Value) => void;
  /** Text shown on the trigger when no value is selected. */
  placeholder?: string;
  /** Accessible label rendered above the trigger. */
  label?: string;
  /** Field name for native form submission. */
  name?: string;
  /** Disables the whole control. */
  disabled?: boolean;
  /** Custom className appended to the trigger classes. */
  className?: string;
}
