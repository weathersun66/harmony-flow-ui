import { useEffect, useId, useMemo, type ReactNode } from 'react';
import { Button } from '../components/Button';
import { useTaskProgress, type TaskProgressContext, type TaskProgressPhase } from './useTaskProgress';

export interface TaskProgressStage {
  id: string;
  label: ReactNode;
  description?: ReactNode;
}

export interface TaskProgressProps<TResult> {
  taskKey: string | number;
  stages: readonly TaskProgressStage[];
  run: (context: TaskProgressContext) => Promise<TResult>;
  title?: ReactNode;
  autoStart?: boolean;
  disabled?: boolean;
  renderResult?: (result: TResult) => ReactNode;
  onPhaseChange?: (phase: TaskProgressPhase) => void;
  className?: string;
}

export function TaskProgress<TResult>(props: TaskProgressProps<TResult>) {
  return <TaskProgressSession key={`${typeof props.taskKey}:${String(props.taskKey)}`} {...props} />;
}

function TaskProgressSession<TResult>({ stages, run, title = '任务进度', autoStart = false, disabled = false,
  renderResult, onPhaseChange, className = '' }: TaskProgressProps<TResult>) {
  const stageSignature = JSON.stringify(stages.map(stage => stage.id));
  const stageIds = useMemo(() => stages.map(stage => stage.id), [stageSignature]);
  const state = useTaskProgress(run, stageIds, disabled || stages.length === 0);
  const statusId = useId();
  const activeIndex = state.activeStageId ? stageIds.indexOf(state.activeStageId) : -1;

  useEffect(() => {
    if (!autoStart || disabled || stages.length === 0) return;
    const timer = window.setTimeout(state.start, 0);
    return () => window.clearTimeout(timer);
  }, [autoStart, disabled, stages.length, state.start]);
  useEffect(() => { onPhaseChange?.(state.phase); }, [onPhaseChange, state.phase]);

  const statusText = state.phase === 'running' ? state.message || `正在执行，已完成 ${Math.round(state.progress)}%`
    : state.phase === 'success' ? '任务已完成'
    : state.phase === 'error' ? '任务执行失败，可以重试'
    : state.phase === 'cancelled' ? '任务已取消，可以重新执行'
    : '任务尚未开始';

  return <section className={`hf-task-progress ${className}`.trim()} aria-labelledby={`${statusId}-title`} aria-busy={state.phase === 'running'}>
    <header className="hf-task-progress__header">
      <div><h3 id={`${statusId}-title`}>{title}</h3><p id={statusId} role="status" aria-live="polite" aria-atomic="true">{statusText}</p></div>
      <strong aria-hidden="true">{Math.round(state.progress)}%</strong>
    </header>
    <div className="hf-task-progress__track" role="progressbar" aria-valuemin={0} aria-valuemax={100}
      aria-valuenow={Math.round(state.progress)} aria-describedby={statusId}>
      <span style={{ width: `${state.progress}%` }} />
    </div>
    <ol className="hf-task-progress__stages">
      {stages.map((stage, index) => {
        const status = state.phase === 'success' || index < activeIndex ? 'complete'
          : index === activeIndex ? (state.phase === 'error' ? 'error' : state.phase === 'cancelled' ? 'cancelled' : 'active')
          : 'pending';
        return <li key={stage.id} data-status={status} aria-current={status === 'active' ? 'step' : undefined}>
          <span className="hf-task-progress__marker" aria-hidden="true">{status === 'complete' ? '✓' : index + 1}</span>
          <div><strong>{stage.label}</strong>{stage.description && <p>{stage.description}</p>}</div>
        </li>;
      })}
    </ol>
    {state.phase === 'error' && <p className="hf-task-progress__error" role="alert">任务未完成，请检查连接后重试。</p>}
    {state.phase === 'success' && renderResult && <div className="hf-task-progress__result">{renderResult(state.result as TResult)}</div>}
    <div className="hf-task-progress__actions">
      {state.phase === 'idle' && <Button type="button" disabled={disabled || stages.length === 0} onClick={state.start}>开始任务</Button>}
      {state.phase === 'running' && <Button type="button" variant="outline" onClick={state.cancel}>取消任务</Button>}
      {(state.phase === 'error' || state.phase === 'cancelled') && <Button type="button" disabled={disabled} onClick={state.retry}>重新执行</Button>}
    </div>
  </section>;
}

export type { TaskProgressContext, TaskProgressPhase, TaskProgressReport, TaskProgressSnapshot } from './useTaskProgress';
