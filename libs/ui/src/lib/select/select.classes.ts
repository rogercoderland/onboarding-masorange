/**
 * Class contract for the `Select` component (BEM, prefix-free for portability).
 */
export const selectClasses = {
  root: 'select',
  label: 'select__label',
  trigger: 'select__trigger',
  value: 'select__value',
  icon: 'select__icon',
  popup: 'select__popup',
  item: 'select__item',
  itemText: 'select__item-text',
  itemIndicator: 'select__item-indicator',
} as const;

export type SelectClassName =
  (typeof selectClasses)[keyof typeof selectClasses];
