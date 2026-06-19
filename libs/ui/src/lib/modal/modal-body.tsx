import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { modalClasses } from './modal.classes';
import type { ModalSectionProps } from './modal.types';

/** Main scrollable content region of the modal. */
export const ModalBody = forwardRef<HTMLDivElement, ModalSectionProps>(
  function ModalBody({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={clsx(modalClasses.body, className)} {...props}>
        {children}
      </div>
    );
  },
);
ModalBody.displayName = 'ModalBody';
