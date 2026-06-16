/**
 * Class contract for the `Input` component (BEM, prefix-free for portability).
 */
export const inputClasses = {
  root: 'input',
  label: 'input__label',
  control: 'input__control',
  error: 'input__error',
  errorModifier: 'input--error',
} as const;

export type InputClassName = (typeof inputClasses)[keyof typeof inputClasses];
