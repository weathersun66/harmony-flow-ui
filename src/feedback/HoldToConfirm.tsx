import { useId } from 'react';
import { Button } from '../components/Button';
import { useHoldConfirmation } from './useHoldConfirmation';
import { ConfirmationAlternative } from './ConfirmationAlternative';

export interface HoldToConfirmProps {
  actionKey: string;
  label: string;
  onConfirm: () => void;
  duration?: number;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  className?: string;
}

export function HoldToConfirm({ actionKey, label, onConfirm, duration = 1500,
  disabled = false, loading = false, error, className = '' }: HoldToConfirmProps) {
  const milliseconds = Number.isFinite(duration) ? Math.max(500, Math.min(10000, duration)) : 1500;
  const blocked = disabled || loading;
  const hold = useHoldConfirmation({ actionKey, duration: milliseconds, blocked, onConfirm });
  const hintId = useId();

  return <div className={`hf-hold-confirm ${className}`}>
    <p id={hintId} className="hf-confirm-hint">按住{milliseconds / 1000}秒发出确认请求，提前松开可取消。</p>
    <Button type="button" fullWidth disabled={blocked} aria-describedby={hintId}
      className="hf-hold-confirm__button" onClick={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        if (event.button !== 0 || !event.isPrimary) return;
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture(event.pointerId);
        hold.start(`pointer:${event.pointerId}`);
      }} onPointerMove={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) hold.cancel();
      }} onPointerUp={(event) => hold.release(`pointer:${event.pointerId}`)}
      onPointerCancel={hold.cancel} onLostPointerCapture={hold.cancel} onBlur={hold.cancel}
      onContextMenu={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        if (event.key !== ' ' && event.key !== 'Enter') return;
        event.preventDefault();
        if (!event.repeat) hold.start(`key:${event.key}`);
      }} onKeyUp={(event) => {
        if (event.key !== ' ' && event.key !== 'Enter') return;
        event.preventDefault();
        hold.release(`key:${event.key}`);
      }}>{loading ? '正在处理请求' : label}</Button>
    <div className="hf-hold-confirm__track" aria-hidden="true">
      <span style={{ width: `${hold.progress * 100}%` }} />
    </div>
    <ConfirmationAlternative key={JSON.stringify([actionKey, milliseconds, blocked])} label={label}
      blocked={blocked} onOpen={hold.cancel} onConfirm={onConfirm} />
    <p className="hf-confirm-hint" role="status">{hold.message}</p>
    {error && <p className="hf-confirm-error hf-tone--danger" role="alert">{error}</p>}
  </div>;
}
