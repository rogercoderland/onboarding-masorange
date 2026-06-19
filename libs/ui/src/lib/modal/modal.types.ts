import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export const MODAL_SIDES = ['center', 'right', 'left'] as const;
export type ModalSide = (typeof MODAL_SIDES)[number];

export interface ModalProps {
  /** Whether the modal is open (controlled). */
  open: boolean;
  /** Called when the modal requests to close (Esc, overlay, close button). */
  onClose: () => void;
  /** Placement: `center` (modal) or `right`/`left` (drawer). @default 'center' */
  side?: ModalSide;
  /** Convenience title; renders a header with the title and close button. */
  title?: ReactNode;
  /** Convenience footer region (e.g. actions). */
  footer?: ReactNode;
  /** Render the top-right close (X) button. @default true */
  showClose?: boolean;
  /** Allow closing via overlay click. Esc always closes. @default true */
  dismissible?: boolean;
  /** Accessible label used when no `title`/`Modal.Title` is provided. */
  ariaLabel?: string;
  /** Custom className on the popup panel. */
  className?: string;
  children?: ReactNode;
}

export type ModalSectionProps = HTMLAttributes<HTMLDivElement>;
export type ModalTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type ModalCloseProps = ButtonHTMLAttributes<HTMLButtonElement>;
