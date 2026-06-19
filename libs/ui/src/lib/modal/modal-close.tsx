import { forwardRef } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { clsx } from 'clsx';
import { modalClasses } from './modal.classes';
import type { ModalCloseProps } from './modal.types';

/**
 * Close (X) button. Wraps Base UI's `Dialog.Close`, so Base UI handles the
 * actual close. Defaults to an `aria-label` since it renders only an icon.
 */
export const ModalClose = forwardRef<HTMLButtonElement, ModalCloseProps>(
  function ModalClose(
    { className, children, 'aria-label': ariaLabel = 'Close', ...props },
    ref,
  ) {
    return (
      <Dialog.Close
        ref={ref}
        className={clsx(modalClasses.close, className)}
        aria-label={ariaLabel}
        {...props}
      >
        {children ?? (
          <svg
            className={modalClasses.closeIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        )}
      </Dialog.Close>
    );
  },
);
ModalClose.displayName = 'ModalClose';
