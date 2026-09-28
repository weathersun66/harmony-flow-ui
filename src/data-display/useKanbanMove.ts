import { useRef, useState, type PointerEvent } from 'react';
import type { KanbanBoardProps } from './WorkflowViews';

type Session = { id: string; from: string; snapshot: string; pointer?: number; x: number; y: number; moved: boolean };

export function useKanbanMove({ columns, onMove }: KanbanBoardProps) {
  const root = useRef<HTMLDivElement>(null);
  const session = useRef<Session | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const snapshot = JSON.stringify(columns.map((column) => [column.id, column.cards.map((card) => card.id)]));
  function cancel() {
    if (session.current) setAnnouncement('已取消移动，未提交更改');
    session.current = null;
    setTarget(null);
  }
  function request(id: string, from: string, to: string) {
    const source = columns.find((column) => column.id === from);
    const destination = columns.find((column) => column.id === to);
    if (!onMove || from === to || !source?.cards.some((card) => card.id === id) || !destination) return;
    onMove(id, from, to);
    setAnnouncement('已请求移动卡片，请以更新后的列内容为准');
    root.current?.focus();
  }
  function atPoint(event: PointerEvent) {
    const node = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-hf-kanban-column]');
    return node?.closest('[data-hf-kanban-root]') === root.current ? node?.dataset.hfKanbanColumn ?? null : null;
  }
  function begin(id: string, from: string) {
    session.current = { id, from, snapshot, x: 0, y: 0, moved: false };
  }
  function start(event: PointerEvent<HTMLButtonElement>, id: string, from: string) {
    if (!onMove || event.button !== 0 || !event.isPrimary) return;
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    session.current = { id, from, snapshot, pointer: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
  }
  function move(event: PointerEvent<HTMLButtonElement>) {
    const current = session.current;
    if (!current || current.pointer !== event.pointerId) return;
    if (!onMove || current.snapshot !== snapshot) { cancel(); return; }
    if (!current.moved && Math.hypot(event.clientX - current.x, event.clientY - current.y) < 5) return;
    current.moved = true;
    const column = atPoint(event);
    setTarget(column !== current.from ? column : null);
  }
  function drop(to: string | null) {
    const current = session.current;
    if (!current || !to || current.snapshot !== snapshot || !onMove) { cancel(); return; }
    session.current = null;
    setTarget(null);
    request(current.id, current.from, to);
  }
  function finish(event: PointerEvent<HTMLButtonElement>) {
    const current = session.current;
    if (!current || current.pointer !== event.pointerId) return;
    if (current.moved) drop(atPoint(event)); else cancel();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  function previewNative(to: string) {
    if (session.current && session.current.pointer === undefined && session.current.from !== to) setTarget(to);
  }
  return { root, target, announcement, cancel, request, start, move, finish, begin, drop, previewNative };
}
