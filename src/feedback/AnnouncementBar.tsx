import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Icon } from '../foundations/Icon';

export interface Announcement {
  id: string;
  message: string;
  actionLabel?: string;
}

export interface AnnouncementBarProps {
  items: readonly Announcement[];
  label?: string;
  autoPlay?: boolean;
  interval?: number;
  onAction?: (id: string) => void;
  onDismiss?: () => void;
  className?: string;
}

export function AnnouncementBar({
  items, label = '公告', autoPlay = false, interval = 6000,
  onAction, onDismiss, className = '',
}: AnnouncementBarProps) {
  const [selectedId, setSelectedId] = useState(items[0]?.id);
  const [playing, setPlaying] = useState(autoPlay);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const index = Math.max(0, items.findIndex((item) => item.id === selectedId));
  const selected = items[index];
  const rotating = playing && !hovered && !focused && !pageHidden && !reducedMotion && items.length > 1;
  const delay = Number.isFinite(interval) ? Math.max(3000, interval) : 6000;

  useEffect(() => setPlaying(autoPlay), [autoPlay]);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(preference.matches);
    const syncVisibility = () => setPageHidden(document.hidden);
    syncMotion();
    syncVisibility();
    preference.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    return () => {
      preference.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);
  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => setSelectedId(items[(index + 1) % items.length]?.id), delay);
    return () => window.clearTimeout(timer);
  }, [rotating, items, index, delay]);

  if (!selected) return null;
  function move(direction: number) {
    setPlaying(false);
    setSelectedId(items[(index + direction + items.length) % items.length]?.id);
  }

  return (
    <section className={`hf-announcement ${className}`.trim()} aria-label={label}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <span className="hf-announcement__label"><Icon name="info" size={18} />{label}</span>
      <div className="hf-announcement__message" aria-live={rotating ? 'off' : 'polite'} aria-atomic="true">
        <span>{selected.message}</span>
        {selected.actionLabel && onAction && <Button variant="quiet" size="sm"
          onClick={() => onAction(selected.id)}>{selected.actionLabel}</Button>}
      </div>
      <div className="hf-announcement__controls">
        {items.length > 1 && <>
          <span aria-label={`第${index + 1}条，共${items.length}条`}>{index + 1} / {items.length}</span>
          <Button size="sm" variant="quiet" onClick={() => move(-1)} aria-label="上一条公告">上一条</Button>
          <Button size="sm" variant="quiet" onClick={() => move(1)} aria-label="下一条公告">下一条</Button>
          {!reducedMotion && <Button size="sm" variant="quiet" onClick={() => setPlaying(!playing)}
            aria-label={playing ? '暂停公告轮播' : '开始公告轮播'}>{playing ? '暂停' : '播放'}</Button>}
        </>}
        {onDismiss && <Button size="sm" variant="quiet" onClick={onDismiss} aria-label="关闭公告">关闭</Button>}
      </div>
    </section>
  );
}
