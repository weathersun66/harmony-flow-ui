import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '../components/Button';

interface AlternativeProps {
  label: string;
  blocked: boolean;
  onOpen: () => void;
  onConfirm: () => void;
}

/** 无时间限制的显式二次确认，供不能持续按住的用户使用。 */
export function ConfirmationAlternative({ label, blocked, onOpen, onConfirm }: AlternativeProps) {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const requestedRef = useRef(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const confirm = useRef<HTMLButtonElement>(null);
  const id = useId();

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }

  function toggle() {
    if (open) { close(); return; }
    onOpen();
    requestedRef.current = false;
    setRequested(false);
    setOpen(true);
  }

  function request() {
    if (blocked || requestedRef.current) return;
    requestedRef.current = true;
    setRequested(true);
    onConfirm();
  }

  useEffect(() => {
    if (open) confirm.current?.focus();
  }, [open]);

  return <div>
    <Button type="button" ref={trigger} variant="quiet" size="sm" disabled={blocked}
      aria-expanded={open} aria-controls={open ? id : undefined} onClick={toggle}>分步确认（无需长按）</Button>
    {open && <div id={id} className="hf-hold-confirm__alternative" role="group" aria-label="分步确认"
      onKeyDown={(event) => { if (event.key === 'Escape') close(); }}>
      <p>确认执行“{label}”？</p>
      <div className="hf-confirm-actions">
        <Button type="button" variant="outline" onClick={close}>取消</Button>
        <Button type="button" ref={confirm} disabled={blocked || requested} onClick={request}>确认执行</Button>
      </div>
      {requested && <p className="hf-confirm-hint" role="status">已发出确认请求，请等待操作结果</p>}
    </div>}
  </div>;
}
