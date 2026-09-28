import { useId, useRef, useState, type ReactNode } from 'react';
import { Button } from '../components/Button';
import { useDismissibleLayer } from '../overlays/useOverlay';

export interface HotspotGuideProps {
  title: string;
  children: ReactNode;
  unread?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAcknowledge?: () => void;
  disabled?: boolean;
  className?: string;
}

export function HotspotGuide({ title, children, unread = true, open, defaultOpen = false,
  onOpenChange, onAcknowledge, disabled = false, className = '' }: HotspotGuideProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const visible = !disabled && (open ?? internal);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const root = useDismissibleLayer<HTMLDivElement>(visible, () => update(false), {
    autoFocus: false, restoreFocus: false, closeOnOutside: true,
  });
  function update(next: boolean) {
    if (open === undefined) setInternal(next);
    onOpenChange?.(next);
    if (!next && root.current?.contains(document.activeElement)) trigger.current?.focus();
  }
  return <div ref={root} className={`hf-hotspot-guide ${className}`}>
    <Button ref={trigger} type="button" variant="quiet" size="sm" disabled={disabled}
      aria-expanded={visible} aria-controls={visible ? id : undefined}
      onClick={() => update(!visible)}>
      <span className="hf-hotspot-guide__dot" data-unread={unread} aria-hidden="true">{unread ? '●' : '✓'}</span>
      {title}<span className="hf-hotspot-guide__state">{unread ? '未读提示' : '已读提示'}</span>
    </Button>
    {visible && <section id={id} className="hf-hotspot-guide__content" aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`}>{title}</h3>
      <div>{children}</div>
      <div className="hf-hotspot-guide__actions">
        <Button type="button" variant="quiet" size="sm" onClick={() => update(false)}>关闭提示</Button>
        {unread && onAcknowledge && <Button type="button" size="sm" onClick={() => {
          onAcknowledge();
          update(false);
        }}>知道了</Button>}
      </div>
    </section>}
  </div>;
}
