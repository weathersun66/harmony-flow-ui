import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Button } from '../components/Button';
import { useSwipeReveal } from './useSwipeReveal';

export interface SwipeAction {
  id: string;
  label: string;
  onAction: () => void;
  disabled?: boolean;
  tone?: 'primary' | 'danger';
}

export interface SwipeActionsProps {
  actionKey: string;
  label: string;
  children: ReactNode;
  actions: readonly SwipeAction[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function SwipeActions(props: SwipeActionsProps) {
  const identity = JSON.stringify([props.actionKey, props.disabled, props.actions.map(({ id, label, disabled, tone }) => [id, label, disabled, tone])]);
  return <SwipeActionsRow key={identity} {...props} />;
}

function SwipeActionsRow({ label, children, actions, open: controlled, defaultOpen = false,
  onOpenChange, disabled = false, className = '' }: SwipeActionsProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const trigger = useRef<HTMLButtonElement>(null);
  const tools = useRef<HTMLDivElement>(null);
  const id = useId();
  const valid = actions.length > 0 && actions.every((item) => item.id.trim() && item.label.trim())
    && new Set(actions.map((item) => item.id)).size === actions.length;
  const blocked = disabled || !valid;
  const open = !blocked && (controlled ?? internal);

  function request(next: boolean) {
    if (blocked || next === open) return;
    if (controlled === undefined) setInternal(next);
    onOpenChange?.(next);
  }

  const swipe = useSwipeReveal({ open, disabled: blocked, width: 144, onChange: request });

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      if (document.activeElement === trigger.current) tools.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  function close() {
    swipe.cancel();
    request(false);
    trigger.current?.focus();
  }

  function act(action: SwipeAction) {
    if (!open || blocked || action.disabled) return;
    close();
    action.onAction();
  }

  return <div className={`hf-swipe-actions ${className}`} onKeyDown={(event) => {
    if (event.key === 'Escape') close();
  }}>
    <div className="hf-swipe-actions__viewport" role="group" aria-label={label} tabIndex={-1}
      onPointerDown={swipe.start} onPointerMove={swipe.move} onPointerUp={swipe.finish}
      onPointerCancel={swipe.cancel} onLostPointerCapture={swipe.cancel}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) swipe.cancel(); }}>
      {open && <div id={id} ref={tools} className="hf-swipe-actions__tools">
        {actions.map((action, index) => <Button key={index} type="button" size="sm"
          disabled={blocked || action.disabled} variant={action.tone === 'danger' ? 'danger' : 'outline'}
          onClick={() => act(action)}>{action.label}</Button>)}
      </div>}
      <div className="hf-swipe-actions__content" inert={open} aria-hidden={open}
        style={{ transform: `translateX(${swipe.offset}px)` }}>{children}</div>
    </div>
    <Button type="button" ref={trigger} variant="quiet" size="sm" disabled={blocked}
      aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => { swipe.cancel(); request(!open); }}>
      {open ? '收起操作' : '显示操作'}：{label}
    </Button>
    {!valid && <p className="hf-row-hint">{actions.length ? '操作标识和名称必须非空，且标识不能重复。' : '暂无可用操作'}</p>}
  </div>;
}
