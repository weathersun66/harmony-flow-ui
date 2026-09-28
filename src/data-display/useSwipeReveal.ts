import { useEffect, useRef, useState, type PointerEvent } from 'react';

interface SwipeOptions {
  open: boolean;
  disabled: boolean;
  width: number;
  onChange: (open: boolean) => void;
}

interface SwipeSession {
  pointer: number;
  x: number;
  y: number;
  delta: number;
  open: boolean;
}

/** 手势只请求开关，不执行行操作。父组件的对象key负责会话隔离。 */
export function useSwipeReveal({ open, disabled, width, onChange }: SwipeOptions) {
  const session = useRef<SwipeSession | null>(null);
  const [offset, setOffset] = useState<number | null>(null);
  const cleanup = useRef<(() => void) | null>(null);

  function cancel() {
    cleanup.current?.();
    cleanup.current = null;
    session.current = null;
    setOffset(null);
  }

  function start(event: PointerEvent<HTMLDivElement>) {
    if (disabled || event.button !== 0 || !event.isPrimary || session.current) return;
    if ((event.target as Element).closest('button,input,select,textarea,a,[contenteditable="true"]')) return;
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    session.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, delta: 0, open };
    const hide = () => { if (document.hidden) cancel(); };
    window.addEventListener('blur', cancel);
    document.addEventListener('visibilitychange', hide);
    cleanup.current = () => {
      window.removeEventListener('blur', cancel);
      document.removeEventListener('visibilitychange', hide);
    };
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    const current = session.current;
    if (!current || current.pointer !== event.pointerId) return;
    if (disabled || current.open !== open) { cancel(); return; }
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (Math.abs(dy) > Math.max(10, Math.abs(dx))) { cancel(); return; }
    current.delta = dx;
    setOffset(Math.max(-width, Math.min(0, (open ? -width : 0) + dx)));
  }

  function finish(event: PointerEvent<HTMLDivElement>) {
    const current = session.current;
    if (!current || current.pointer !== event.pointerId) return;
    cancel();
    if (!disabled && current.open === open && Math.abs(current.delta) >= 40) onChange(current.delta < 0);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  useEffect(() => () => { cleanup.current?.(); session.current = null; }, []);

  return { offset: offset ?? (open ? -width : 0), start, move, finish, cancel };
}
