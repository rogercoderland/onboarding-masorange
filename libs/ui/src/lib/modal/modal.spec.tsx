import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './modal';
import { ModalHeader } from './modal-header';
import { ModalTitle } from './modal-title';
import { ModalBody } from './modal-body';
import { ModalFooter } from './modal-footer';
import { ModalClose } from './modal-close';

describe('Modal', () => {
  it('renders an accessible dialog with the title when open', () => {
    render(
      <Modal open onClose={() => undefined} title="Confirm">
        <p>Body content</p>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders nothing when closed', () => {
    render(
      <Modal open={false} onClose={() => undefined} title="Hidden">
        <p>Body</p>
      </Modal>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders content through the compound parts', () => {
    render(
      <Modal open onClose={() => undefined} ariaLabel="Panel">
        <Modal.Header>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>Compound body</Modal.Body>
        <Modal.Footer>
          <button>Apply</button>
        </Modal.Footer>
      </Modal>,
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Compound body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('renders the footer via the convenience prop', () => {
    render(
      <Modal open onClose={() => undefined} title="T" footer={<button>OK</button>}>
        <p>Body</p>
      </Modal>,
    );

    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="T">
        <p>Body</p>
      </Modal>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="T">
        <p>Body</p>
      </Modal>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('hides the close button when showClose is false', () => {
    render(
      <Modal open onClose={() => undefined} title="T" showClose={false}>
        <p>Body</p>
      </Modal>,
    );

    expect(
      screen.queryByRole('button', { name: 'Close' }),
    ).not.toBeInTheDocument();
  });

  it('applies the side modifier class', () => {
    render(
      <Modal open onClose={() => undefined} side="right" ariaLabel="Panel">
        <p>Body</p>
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toHaveClass('modal', 'modal--right');
  });

  it('exposes parts via dot-notation and named exports', () => {
    expect(Modal.Header).toBe(ModalHeader);
    expect(Modal.Title).toBe(ModalTitle);
    expect(Modal.Body).toBe(ModalBody);
    expect(Modal.Footer).toBe(ModalFooter);
    expect(Modal.Close).toBe(ModalClose);
  });
});
