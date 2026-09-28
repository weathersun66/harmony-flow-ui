import { useOverlayOwner } from '../overlays/OverlayOwner';
import { useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../components/Button';
import { Icon } from '../foundations/Icon';
import { useDismissibleLayer } from '../overlays/useOverlay';

export interface DrawerProps { open: boolean; title: string; children: ReactNode; onClose: () => void; footer?: ReactNode; side?: 'left' | 'right' | 'bottom'; size?: 'sm' | 'md' | 'lg' }

export function Drawer({ open, title, children, onClose, footer, side = 'right', size = 'md' }: DrawerProps) {
  const overlayOwner = useOverlayOwner();
  const titleId = useId();
  const drawerRef = useDismissibleLayer<HTMLDivElement>(open, onClose, true);
  if (!open) return null;
  return createPortal(<div data-hf-overlay-owner={overlayOwner} className="hf-drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div ref={drawerRef} className={`hf-drawer hf-drawer--${side} hf-drawer--${size}`} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
      <header><h2 id={titleId}>{title}</h2><Button variant="quiet" size="sm" iconOnly leadingIcon={<Icon name="close" size={16} />} onClick={onClose} aria-label="关闭抽屉" /></header>
      <div className="hf-drawer__body">{children}</div>{footer && <footer>{footer}</footer>}
    </div>
  </div>, document.body);
}
