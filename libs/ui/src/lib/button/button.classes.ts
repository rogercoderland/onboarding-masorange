/**
 * Class contract for the `Button` component (BEM, prefix-free for portability).
 */
export const buttonClasses = {
  root: 'button',
  spinner: 'button__spinner',
  icon: 'button__icon',
  label: 'button__label',
  primary: 'button--primary',
  secondary: 'button--secondary',
  ghost: 'button--ghost',
  sm: 'button--sm',
  md: 'button--md',
  lg: 'button--lg',
} as const;

export type ButtonClassName = (typeof buttonClasses)[keyof typeof buttonClasses];
