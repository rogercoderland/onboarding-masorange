/**
 * Class contract for the `Modal` compound component
 */
export const modalClasses = {
  backdrop: 'modal__backdrop',
  popup: 'modal',
  center: 'modal--center',
  right: 'modal--right',
  left: 'modal--left',
  header: 'modal__header',
  title: 'modal__title',
  body: 'modal__body',
  footer: 'modal__footer',
  close: 'modal__close',
  closeIcon: 'modal__close-icon',
} as const;

export type ModalClassName = (typeof modalClasses)[keyof typeof modalClasses];
