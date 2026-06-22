import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { modalClasses } from './modal.classes';
import type { ModalSectionProps } from './modal.types';

/** Header region of the modal, typically holding the title. */
export const ModalHeader = forwardRef<HTMLDivElement, ModalSectionProps>(
  function ModalHeader({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={clsx(modalClasses.header, className)} {...props}>
        {children}
      </div>
    );
  },
);
ModalHeader.displayName = 'ModalHeader';
