import { useId, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { Checkbox } from '../forms/Choice';

export interface ConfirmationItem {
  id: string;
  label: string;
  description?: string;
}

export interface ChecklistConfirmProps {
  actionKey: string;
  title: string;
  items: readonly ConfirmationItem[];
  onConfirm: () => void;
  confirmLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  className?: string;
}

export function ChecklistConfirm(props: ChecklistConfirmProps) {
  const identity = JSON.stringify([props.actionKey, props.items.map(({ id, label, description }) => [id, label, description])]);
  return <ChecklistConfirmFields key={identity} {...props} />;
}

function ChecklistConfirmFields({ title, items, onConfirm, confirmLabel = '确认执行',
  disabled = false, loading = false, error, className = '' }: ChecklistConfirmProps) {
  const [checked, setChecked] = useState<ReadonlySet<string>>(new Set());
  const [requested, setRequested] = useState(false);
  const lock = useRef(false);
  const first = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const valid = items.length > 0 && items.every((item) => item.id.trim() && item.label.trim())
    && new Set(items.map((item) => item.id)).size === items.length;
  const blocked = disabled || loading || !valid;
  const allChecked = valid && items.every((item) => checked.has(item.id));

  function toggle(id: string, value: boolean) {
    if (blocked) return;
    lock.current = false;
    setRequested(false);
    setChecked((current) => {
      const next = new Set(current);
      if (value) next.add(id); else next.delete(id);
      return next;
    });
  }

  function confirm() {
    if (blocked || !allChecked || lock.current) return;
    lock.current = true;
    setChecked(new Set());
    setRequested(true);
    first.current?.focus();
    onConfirm();
  }

  return <section className={`hf-checklist-confirm ${className}`} aria-labelledby={titleId}>
    <h3 id={titleId}>{title}</h3>
    {!valid && <p role="alert" className="hf-tone--danger hf-row-error">
      {items.length ? '确认项标识和名称必须非空，且标识不能重复。' : '暂无确认项，不能提交。'}
    </p>}
    <div className="hf-checklist-confirm__items">
      {items.map((item, index) => <Checkbox key={index} ref={index === 0 ? first : undefined}
        label={item.label} description={item.description} checked={checked.has(item.id)} disabled={blocked}
        onChange={(event) => toggle(item.id, event.target.checked)} />)}
    </div>
    <p className="hf-row-hint" role="status">{requested ? '已发出确认请求，请等待操作结果' : `已确认 ${checked.size} / ${items.length} 项`}</p>
    <Button type="button" disabled={blocked || !allChecked} onClick={confirm}>{loading ? '正在处理请求' : confirmLabel}</Button>
    {error && <p role="alert" className="hf-tone--danger hf-row-error">{error}</p>}
  </section>;
}
