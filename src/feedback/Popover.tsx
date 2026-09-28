import { cloneElement, isValidElement, useId, useState, type ReactElement, type ReactNode } from 'react';
import { useDismissibleLayer } from '../overlays/useOverlay';

export interface PopoverProps { trigger: ReactElement; children: ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; placement?: 'top' | 'bottom' | 'left' | 'right'; label?: string }

export function Popover({ trigger, children, open, defaultOpen = false, onOpenChange, placement = 'bottom', label = '更多内容' }: PopoverProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const controlled = open !== undefined;
  const visible = controlled ? open : innerOpen;
  const contentId = useId();
  const update = (next: boolean) => { if (!controlled) setInnerOpen(next); onOpenChange?.(next); };
  const rootRef = useDismissibleLayer<HTMLSpanElement>(visible, () => update(false));
  const triggerProps = { 'aria-expanded': visible, 'aria-controls': visible ? contentId : undefined, 'aria-haspopup': 'dialog' as const, onClick: () => update(!visible) };
  return <span className="hf-popover" ref={rootRef}>{isValidElement(trigger) && cloneElement(trigger, triggerProps)}{visible && <span id={contentId} role="dialog" aria-label={label} className={`hf-popover__content hf-popover__content--${placement}`}>{children}</span>}</span>;
}
