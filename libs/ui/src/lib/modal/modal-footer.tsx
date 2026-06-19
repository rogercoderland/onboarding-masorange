import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { modalClasses } from './modal.classes';
import type { ModalSectionProps } from './modal.types';

/** Footer region of the modal, typically holding actions. */
export const ModalFooter = forwardRef<HTMLDivElement, ModalSectionProps>(
  function ModalFooter({ className, children, ...props }, ref) {
    return (
      <div ref={ref} className={clsx(modalClasses.footer, className)} {...props}>
        {children}
      </div>
    );
  },
);
ModalFooter.displayName = 'ModalFooter';
