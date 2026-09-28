import { useId, useRef, useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export interface TypedConfirmProps {
  actionKey: string;
  confirmationText: string;
  label: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  className?: string;
}

/** key隔离不同操作对象，避免前一个对象的确认文字复用到新对象。 */
export function TypedConfirm(props: TypedConfirmProps) {
  return <TypedConfirmFields key={JSON.stringify([props.actionKey, props.confirmationText])} {...props} />;
}

function TypedConfirmFields({ confirmationText, label, description, confirmLabel = '确认执行',
  onConfirm, disabled = false, loading = false, error, className = '' }: TypedConfirmProps) {
  const [value, setValue] = useState('');
  const [composing, setComposing] = useState(false);
  const [requested, setRequested] = useState(false);
  const composingRef = useRef(false);
  const valueRef = useRef('');
  const titleId = useId();
  const validTarget = confirmationText.trim().length > 0 && !/[\r\n]/.test(confirmationText);
  const blocked = disabled || loading;
  const matches = validTarget && value === confirmationText && !composing;

  function confirm() {
    if (blocked || composingRef.current || !validTarget || valueRef.current !== confirmationText) return;
    valueRef.current = '';
    setValue('');
    setRequested(true);
    onConfirm();
  }

  return <section className={`hf-typed-confirm ${className}`} aria-labelledby={titleId}>
    <h3 id={titleId}>{label}</h3>
    {description && <p>{description}</p>}
    {validTarget ? <p>输入 <code>{confirmationText}</code> 以确认，需完全一致。</p>
      : <p role="alert" className="hf-confirm-error hf-tone--danger">确认文字不能为空或包含换行，请配置有效的单行内容。</p>}
    <Input label="确认文字" value={value} disabled={blocked || !validTarget} autoComplete="off" spellCheck={false}
      hint="区分大小写，保留前后空格。" onChange={(event) => {
        valueRef.current = event.target.value;
        setValue(event.target.value);
        setRequested(false);
      }} onCompositionStart={() => { composingRef.current = true; setComposing(true); }}
      onCompositionEnd={() => { composingRef.current = false; setComposing(false); }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          if (!event.nativeEvent.isComposing && !event.repeat) confirm();
        }
      }} />
    <Button type="button" disabled={blocked || !matches} onClick={confirm}>{loading ? '正在处理请求' : confirmLabel}</Button>
    <p className="hf-confirm-hint" role="status">{requested ? '已发出确认请求，请等待操作结果' : matches ? '文字已匹配，可以确认' : ''}</p>
    {error && <p className="hf-confirm-error hf-tone--danger" role="alert">{error}</p>}
  </section>;
}
