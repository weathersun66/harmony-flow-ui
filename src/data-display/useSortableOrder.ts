import { useRef, useState, type PointerEvent, type RefObject } from 'react';
import type { SortableListItem, SortableListProps } from './SortableList';

type DragSession = {
  id: string;
  targetId: string;
  pointerId: number;
  x: number;
  y: number;
  moved: boolean;
  snapshot: string;
};

function itemAtPointer(event: PointerEvent, root: RefObject<HTMLOListElement | null>) {
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-hf-sortable-id]');
  return target?.closest('[data-hf-sortable-list]') === root.current ? target : undefined;
}

function reordered(items: readonly SortableListItem[], id: string, destination: number) {
  const source = items.findIndex((item) => item.id === id);
  const item = items[source];
  if (!item || item.disabled || destination < 0 || destination >= items.length || source === destination) return;
  const next = [...items];
  next.splice(source, 1);
  next.splice(destination, 0, item);
  return { next, item };
}

/** 将临时指针会话和业务提交分开，卸载无需遗留全局事件或定时器。 */
export function useSortableOrder({ items, disabled, onOrderChange }: SortableListProps) {
  const root = useRef<HTMLOListElement>(null);
  const drag = useRef<DragSession | null>(null);
  const [preview, setPreview] = useState<{ id: string; targetId: string } | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const snapshot = JSON.stringify(items.map((item) => [item.id, Boolean(item.disabled)]));

  function commit(id: string, destination: number) {
    const result = reordered(items, id, destination);
    if (disabled || !result) return;
    onOrderChange(result.next);
    setAnnouncement(`已请求将${result.item.label}移至第${destination + 1}项，共${items.length}项`);
  }

  function cancel() {
    if (drag.current) setAnnouncement('已取消排序，原顺序未提交');
    drag.current = null;
    setPreview(null);
  }

  function start(event: PointerEvent<HTMLButtonElement>, id: string) {
    if (disabled || event.button !== 0 || !event.isPrimary) return;
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id, targetId: id, pointerId: event.pointerId,
      x: event.clientX, y: event.clientY, moved: false, snapshot };
  }

  function move(event: PointerEvent<HTMLButtonElement>) {
    const session = drag.current;
    if (!session || event.pointerId !== session.pointerId) return;
    if (disabled || session.snapshot !== snapshot) { cancel(); return; }
    if (Math.hypot(event.clientX - session.x, event.clientY - session.y) < 5 && !session.moved) return;
    session.moved = true;
    const target = itemAtPointer(event, root);
    if (target?.dataset.hfSortableId) session.targetId = target.dataset.hfSortableId;
    setPreview({ id: session.id, targetId: session.targetId });
  }

  function finish(event: PointerEvent<HTMLButtonElement>) {
    const session = drag.current;
    if (!session || session.pointerId !== event.pointerId) return;
    const inside = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-hf-sortable-list]') === root.current;
    if (session.moved && inside && session.snapshot === snapshot && !disabled) {
      commit(session.id, items.findIndex((item) => item.id === session.targetId));
      drag.current = null;
      setPreview(null);
    } else cancel();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return { root, preview, announcement, commit, cancel, start, move, finish };
}
