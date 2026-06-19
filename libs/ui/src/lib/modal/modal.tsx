import { forwardRef } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { modalClasses } from './modal.classes';
import type { ModalProps } from './modal.types';
import { ModalHeader } from './modal-header';
import { ModalTitle } from './modal-title';
import { ModalBody } from './modal-body';
import { ModalFooter } from './modal-footer';
import { ModalClose } from './modal-close';
import './modal.css';

const popupVariants = cva(modalClasses.popup, {
  variants: {
    side: {
      center: modalClasses.center,
      right: modalClasses.right,
      left: modalClasses.left,
    },
  },
  defaultVariants: {
    side: 'center',
  },
});

const ModalRoot = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open,
    onClose,
    side = 'center',
    title,
    footer,
    showClose = true,
    dismissible = true,
    ariaLabel,
    className,
    children,
  },
  ref,
) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
      modal
      disablePointerDismissal={!dismissible}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className={modalClasses.backdrop} />
        <Dialog.Popup
          ref={ref}
          className={clsx(popupVariants({ side }), className)}
          aria-modal="true"
          aria-label={title ? undefined : ariaLabel}
        >
          {showClose && <ModalClose />}
          {title && (
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
            </ModalHeader>
          )}
          {children}
          {footer && <ModalFooter>{footer}</ModalFooter>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
});
ModalRoot.displayName = 'Modal';

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Title: ModalTitle,
  Body: ModalBody,
  Footer: ModalFooter,
  Close: ModalClose,
});
