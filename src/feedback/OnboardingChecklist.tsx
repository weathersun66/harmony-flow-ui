import { useId, type ReactNode } from 'react';
import { Button } from '../components/Button';
import { Icon } from '../foundations/Icon';

export interface OnboardingTask {
  id: string;
  title: string;
  description?: ReactNode;
  completed?: boolean;
  disabled?: boolean;
  actionLabel?: string;
}

export interface OnboardingChecklistProps {
  items: readonly OnboardingTask[];
  title?: string;
  onTaskAction?: (id: string) => void;
  onDismiss?: () => void;
  completedMessage?: ReactNode;
  emptyMessage?: ReactNode;
  className?: string;
}

/** 只展示调用方确认的完成状态；点击操作不代表业务任务成功。 */
export function OnboardingChecklist({
  items, title = '开始使用', onTaskAction, onDismiss,
  completedMessage = '全部任务已完成', emptyMessage = '暂无引导任务', className = '',
}: OnboardingChecklistProps) {
  const titleId = useId();
  const completed = items.filter((item) => item.completed).length;
  const nextId = items.find((item) => !item.completed && !item.disabled)?.id;

  return (
    <section className={`hf-onboarding ${className}`.trim()} aria-labelledby={titleId}>
      <header className="hf-onboarding__header">
        <h3 id={titleId}>{title}</h3>
        {onDismiss && <Button variant="quiet" size="sm" onClick={onDismiss} aria-label={`关闭${title}`}>关闭</Button>}
      </header>
      {items.length === 0 ? <p>{emptyMessage}</p> : <>
        <div className="hf-onboarding__progress">
          <span role="status">已完成 {completed} / {items.length}</span>
          <progress value={completed} max={items.length} aria-label={`${title}完成进度`} />
        </div>
        <ol className="hf-onboarding__tasks">
          {items.map((item, index) => (
            <li key={item.id} className={item.completed ? 'is-complete' : ''}>
              <span className="hf-onboarding__marker" aria-hidden="true">
                {item.completed ? <Icon name="check" size={16} /> : index + 1}
              </span>
              <div className="hf-onboarding__detail">
                <strong>{item.title}</strong>
                <span className="hf-onboarding__state">
                  {item.completed ? '已完成' : item.disabled ? '暂不可用' : nextId === item.id ? '下一步' : '待完成'}
                </span>
                {item.description && <div>{item.description}</div>}
              </div>
              {!item.completed && onTaskAction && (
                <Button size="sm" variant={nextId === item.id ? 'primary' : 'secondary'}
                  disabled={item.disabled} onClick={() => onTaskAction(item.id)}
                  aria-label={`${item.actionLabel ?? '去完成'}：${item.title}`}>
                  {item.actionLabel ?? '去完成'}
                </Button>
              )}
            </li>
          ))}
        </ol>
        {completed === items.length && <p className="hf-onboarding__done" role="status">{completedMessage}</p>}
      </>}
    </section>
  );
}
