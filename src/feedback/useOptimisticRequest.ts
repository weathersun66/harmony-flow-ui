import { useEffect, useRef, useState } from 'react';
import type { OptimisticUpdateState } from './OptimisticUpdate';

/** Serial absolute-value writes; pending intents coalesce, confirmed values never regress. */
export function useOptimisticRequest<T>(initialValue: T,
  onUpdate: (next: T, signal: AbortSignal) => Promise<T>, disabled: boolean): OptimisticUpdateState<T> {
  const [view, setView] = useState<{ value: T; phase: OptimisticUpdateState<T>['phase'] }>(
    { value: initialValue, phase: 'idle' });
  const currentView = useRef(view);
  const confirmed = useRef(initialValue);
  const desired = useRef<{ id: number; value: T } | null>(null);
  const failed = useRef<{ value: T } | null>(null);
  const active = useRef<AbortController | null>(null);
  const sequence = useRef(0);
  const alive = useRef(true);
  const latest = useRef({ onUpdate, disabled });
  latest.current = { onUpdate, disabled };

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      active.current?.abort();
      active.current = null;
      desired.current = null;
    };
  }, []);

  function publish(value: T, phase: OptimisticUpdateState<T>['phase']) {
    currentView.current = { value, phase };
    setView(currentView.current);
  }

  async function drain() {
    if (!alive.current || active.current || !desired.current) return;
    const intent = desired.current;
    const controller = new AbortController();
    active.current = controller;
    let succeeded = false;
    let result = confirmed.current;
    try {
      result = await latest.current.onUpdate(intent.value, controller.signal);
      succeeded = true;
    } catch {
      // Network details belong to the caller; render only the configured error message.
    }
    if (!alive.current || controller.signal.aborted || active.current !== controller) return;
    active.current = null;
    if (succeeded) confirmed.current = result;
    if (desired.current?.id !== intent.id) {
      // An intermediate response can update the rollback baseline, never the newer visible intent.
      void drain();
      return;
    }
    desired.current = null;
    failed.current = succeeded ? null : { value: intent.value };
    publish(confirmed.current, succeeded ? 'success' : 'error');
  }

  function update(next: T) {
    if (!alive.current || latest.current.disabled) return;
    desired.current = { id: ++sequence.current, value: next };
    failed.current = null;
    publish(next, 'pending');
    void drain();
  }

  function retry() {
    if (currentView.current.phase === 'error' && failed.current) update(failed.current.value);
  }

  return { ...view, disabled, update, retry };
}
