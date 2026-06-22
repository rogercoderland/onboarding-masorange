import { forwardRef } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { clsx } from 'clsx';
import { modalClasses } from './modal.classes';
import type { ModalTitleProps } from './modal.types';

/**
 * Modal title. Wraps Base UI's `Dialog.Title`, which Base UI wires to the
 * dialog's `aria-labelledby` automatically.
 */
export const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  function ModalTitle({ className, children, ...props }, ref) {
    return (
      <Dialog.Title
        ref={ref}
        className={clsx(modalClasses.title, className)}
        {...props}
      >
        {children}
      </Dialog.Title>
    );
  },
);
ModalTitle.displayName = 'ModalTitle';
