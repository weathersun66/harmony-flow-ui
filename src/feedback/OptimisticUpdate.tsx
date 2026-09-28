import { useId, type ReactNode } from 'react';
import { useOptimisticRequest } from './useOptimisticRequest';

export interface OptimisticUpdateState<T> {
  value: T;
  phase: 'idle' | 'pending' | 'success' | 'error';
  disabled: boolean;
  update: (next: T) => void;
  retry: () => void;
}

export interface OptimisticUpdateProps<T> {
  operationKey: string | number;
  initialValue: T;
  onUpdate: (next: T, signal: AbortSignal) => Promise<T>;
  children: (state: OptimisticUpdateState<T>) => ReactNode;
  disabled?: boolean;
  label?: string;
  errorMessage?: string;
  className?: string;
}

export function OptimisticUpdate<T>(props: OptimisticUpdateProps<T>) {
  return <OptimisticSession key={props.operationKey} {...props} />;
}

function OptimisticSession<T>({ initialValue, onUpdate, children, disabled = false,
  label = '更新', errorMessage = '保存失败，已恢复最近确认的状态，请重试。',
  className = '' }: OptimisticUpdateProps<T>) {
  const state = useOptimisticRequest(initialValue, onUpdate, disabled);
  const statusId = useId();
  const name = label.trim() || '更新';
  return <div className={`hf-optimistic-update ${className}`.trim()} role="group" aria-label={name} aria-describedby={statusId}>
    {children(state)}
    <p id={statusId} role="status" aria-atomic="true" className="hf-optimistic-update__status">
      {state.phase === 'pending' ? `${name}：正在保存…` : state.phase === 'success' ? `${name}：已保存` : ''}
    </p>
    {state.phase === 'error' && <p role="alert" className="hf-optimistic-update__error hf-tone--danger">
      {errorMessage.trim() || '保存失败，已恢复最近确认的状态，请重试。'}
    </p>}
  </div>;
}
