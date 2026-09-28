import { useId } from 'react';
import { Button } from '../components/Button';
import { useUndoDeadline } from './useUndoDeadline';
import { useUndoRequest } from './useUndoRequest';

export interface UndoNoticeProps {
  operationKey: string;
  message: string;
  onUndo: (signal: AbortSignal) => Promise<void>;
  expiresAt?: number;
  undoLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
}

export function UndoNotice(props: UndoNoticeProps) {
  return <UndoNoticeSession key={props.operationKey} {...props} />;
}

function UndoNoticeSession({ operationKey, message, onUndo, expiresAt, undoLabel = '撤销',
  successMessage = '已撤销操作', errorMessage = '撤销失败，请稍后重试。',
  disabled = false, className = '' }: UndoNoticeProps) {
  const { phase, undo } = useUndoRequest(onUndo);
  const deadline = useUndoDeadline(expiresAt, phase === 'ready' || phase === 'failed');
  const messageId = useId();
  const statusId = useId();
  const valid = deadline.valid && !!operationKey.trim() && !!message.trim() && !!undoLabel.trim();
  const pending = phase === 'pending';
  const undone = phase === 'undone';
  const blocked = !valid || disabled || pending || undone || deadline.expired;
  const status = !valid ? '撤销配置无效，请检查操作标识、文案和截止时间。'
    : pending ? '正在撤销，请等待结果。'
    : undone ? successMessage.trim() || '已撤销操作'
    : deadline.expired ? '撤销期限已过。需要恢复时，请联系管理员或使用历史记录。'
    : disabled ? '当前暂不可撤销。' : '可撤销此操作。';

  function requestUndo() {
    if (blocked || (expiresAt !== undefined && Date.now() >= expiresAt)) return;
    void undo();
  }

  return <section className={`hf-undo-notice ${className}`.trim()} aria-labelledby={messageId}>
    <div className="hf-undo-notice__content">
      <p id={messageId} className="hf-undo-notice__message">{message}</p>
      <p id={statusId} role="status" aria-atomic="true" className="hf-undo-notice__status">{status}</p>
      {phase === 'failed' && <p role="alert" className="hf-undo-notice__error hf-tone--danger">
        {errorMessage.trim() || '撤销失败，请稍后重试。'}
      </p>}
      {valid && !pending && !undone && !deadline.expired && deadline.remaining !== undefined
        && <p className="hf-undo-notice__deadline" aria-live="off">剩余 {deadline.remaining} 秒</p>}
    </div>
    <Button type="button" variant="outline" aria-describedby={statusId} aria-disabled={blocked}
      aria-busy={pending || undefined} onClick={requestUndo}>
      {pending ? '正在撤销' : undone ? '已撤销' : undoLabel.trim() || '撤销'}
    </Button>
  </section>;
}
