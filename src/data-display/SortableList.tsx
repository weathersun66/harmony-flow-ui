import { useId, type ReactNode } from 'react';
import { Button } from '../components/Button';
import { useSortableOrder } from './useSortableOrder';

export interface SortableListItem {
  id: string;
  label: string;
  description?: ReactNode;
  disabled?: boolean;
}

export interface SortableListProps {
  items: readonly SortableListItem[];
  onOrderChange: (items: SortableListItem[]) => void;
  label?: string;
  disabled?: boolean;
  emptyMessage?: ReactNode;
  className?: string;
}

/** 指针预览不修改业务数据；只有松手或明确的键盘移动才提交新数组。 */
export function SortableList({
  items, onOrderChange, label = '排序列表', disabled = false,
  emptyMessage = '暂无可排序项目', className = '',
}: SortableListProps) {
  const hintId = useId();
  const { root, preview, announcement, commit, cancel, start, move, finish } = useSortableOrder({ items, disabled, onOrderChange });
  const sourceIndex = items.findIndex((item) => item.id === preview?.id);
  return (
    <section className={`hf-sortable ${className}`.trim()} aria-label={label}>
      <p id={hintId} className="hf-sortable__hint">拖动手柄调整顺序，也可使用上下移动按钮或 Alt + 方向键。</p>
      {items.length === 0 ? <p>{emptyMessage}</p> : (
        <ol ref={root} data-hf-sortable-list="true" className="hf-sortable__list" aria-label={label}>
          {items.map((item, index) => {
            const unavailable = disabled || Boolean(item.disabled);
            const destination = preview?.targetId === item.id && preview.id !== item.id;
            const state = preview?.id === item.id ? 'is-dragging' : destination
              ? (sourceIndex < index ? 'is-drop-after' : 'is-drop-before') : '';
            return (
              <li key={item.id} data-hf-sortable-id={item.id} className={state}>
                <button type="button" className="hf-sortable__handle" disabled={unavailable}
                  aria-label={`拖动${item.label}`} aria-describedby={hintId}
                  onPointerDown={(event) => start(event, item.id)} onPointerMove={move}
                  onPointerUp={finish} onPointerCancel={cancel} onLostPointerCapture={cancel}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') { event.preventDefault(); cancel(); }
                    if (event.altKey && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
                      event.preventDefault();
                      cancel();
                      commit(item.id, index + (event.key === 'ArrowUp' ? -1 : 1));
                    }
                  }}>
                  <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true" fill="currentColor">
                    {[5, 10, 15].map((y) => <g key={y}><circle cx="6" cy={y} r="1.4" /><circle cx="12" cy={y} r="1.4" /></g>)}
                  </svg>
                </button>
                <div className="hf-sortable__content"><strong>{item.label}</strong>{item.description && <div>{item.description}</div>}</div>
                <div className="hf-sortable__actions">
                  <Button variant="quiet" size="sm" disabled={unavailable || index === 0}
                    aria-label={`上移${item.label}`} onClick={() => commit(item.id, index - 1)}>↑</Button>
                  <Button variant="quiet" size="sm" disabled={unavailable || index === items.length - 1}
                    aria-label={`下移${item.label}`} onClick={() => commit(item.id, index + 1)}>↓</Button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
      <span className="hf-sr-only" role="status">{announcement}</span>
    </section>
  );
}
