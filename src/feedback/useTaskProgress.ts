import { useCallback, useEffect, useRef, useState } from 'react';

export type TaskProgressPhase = 'idle' | 'running' | 'success' | 'error' | 'cancelled';

export interface TaskProgressReport {
  stageId: string;
  progress?: number;
  message?: string;
}

export interface TaskProgressContext {
  signal: AbortSignal;
  report: (update: TaskProgressReport) => void;
}

export interface TaskProgressSnapshot<TResult> {
  phase: TaskProgressPhase;
  activeStageId?: string;
  progress: number;
  message?: string;
  result?: TResult;
  start: () => void;
  cancel: () => void;
  retry: () => void;
}

const clamp = (value: number) => Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));

export function useTaskProgress<TResult>(
  run: (context: TaskProgressContext) => Promise<TResult>,
  stageIds: readonly string[],
  disabled: boolean,
): TaskProgressSnapshot<TResult> {
  const [snapshot, setSnapshot] = useState<Omit<TaskProgressSnapshot<TResult>, 'start' | 'cancel' | 'retry'>>({
    phase: 'idle', progress: 0,
  });
  const runRef = useRef(run);
  const controllerRef = useRef<AbortController | undefined>(undefined);
  const generationRef = useRef(0);
  runRef.current = run;

  const start = useCallback(() => {
    if (disabled || controllerRef.current) return;
    const generation = ++generationRef.current;
    const controller = new AbortController();
    controllerRef.current = controller;
    setSnapshot({ phase: 'running', activeStageId: stageIds[0], progress: 0 });
    const report = (update: TaskProgressReport) => {
      if (generation !== generationRef.current || controller.signal.aborted || !stageIds.includes(update.stageId)) return;
      setSnapshot(current => current.phase !== 'running' ? current : {
        ...current,
        activeStageId: update.stageId,
        progress: update.progress === undefined ? current.progress : clamp(update.progress),
        message: update.message,
      });
    };
    Promise.resolve().then(() => {
      if (generation !== generationRef.current || controller.signal.aborted) throw new Error('cancelled');
      return runRef.current({ signal: controller.signal, report });
    }).then(
      result => {
        if (generation !== generationRef.current || controller.signal.aborted) return;
        controllerRef.current = undefined;
        setSnapshot({ phase: 'success', activeStageId: stageIds.at(-1), progress: 100, result });
      },
      () => {
        if (generation !== generationRef.current || controller.signal.aborted) return;
        controllerRef.current = undefined;
        setSnapshot(current => ({ ...current, phase: 'error' }));
      },
    );
  }, [disabled, stageIds]);

  const cancel = useCallback(() => {
    if (!controllerRef.current) return;
    generationRef.current += 1;
    controllerRef.current.abort();
    controllerRef.current = undefined;
    setSnapshot(current => ({ ...current, phase: 'cancelled' }));
  }, []);

  const retry = useCallback(() => {
    if (snapshot.phase !== 'error' && snapshot.phase !== 'cancelled') return;
    start();
  }, [snapshot.phase, start]);

  useEffect(() => () => {
    generationRef.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = undefined;
  }, []);

  return { ...snapshot, start, cancel, retry };
}
