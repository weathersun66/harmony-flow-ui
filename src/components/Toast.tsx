import { useOverlayOwner } from '../overlays/OverlayOwner';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface ToastProps {
  open: boolean;
  message: string;
  tone?: 'success' | 'info' | 'error';
  duration?: number;
  onClose: () => void;
}

export function Toast({ open, message, tone = 'info', duration = 2600, onClose }: ToastProps) {
  const overlayOwner = useOverlayOwner();
  useEffect(() => {
    if (!open || duration <= 0) return;
    const timer = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onClose, open]);
  if (!open) return null;
  return createPortal(
    <div data-hf-overlay-owner={overlayOwner} className={`hf-toast hf-toast--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <span className="hf-toast__mark" aria-hidden="true" />
      {message}
    </div>,
    document.body,
  );
}
