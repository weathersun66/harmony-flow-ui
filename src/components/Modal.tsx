import { useOverlayOwner } from '../overlays/OverlayOwner';
import { useId, type PropsWithChildren, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { Icon } from '../foundations/Icon';
import { useDismissibleLayer } from '../overlays/useOverlay';

export interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}

export function Modal({ open, title, children, onClose, footer }: PropsWithChildren<ModalProps>) {
  const overlayOwner = useOverlayOwner();
  const titleId = useId();
  const dialogRef = useDismissibleLayer<HTMLDivElement>(open, onClose, true);

  if (!open) return null;
  return createPortal(
    <div data-hf-overlay-owner={overlayOwner} className="hf-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={dialogRef} className="hf-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
        <header className="hf-modal__header">
          <h2 id={titleId}>{title}</h2>
          <Button variant="quiet" size="sm" iconOnly leadingIcon={<Icon name="close" size={16} />} onClick={onClose} aria-label="关闭弹窗" />
        </header>
        <div className="hf-modal__body">{children}</div>
        {footer && <footer className="hf-modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
