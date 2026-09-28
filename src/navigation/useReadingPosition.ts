import { useEffect, useState } from 'react';

/** One frame at most per event burst; no polling or business reading-state storage. */
export function useReadingPosition(target: HTMLElement | null | undefined) {
  const [snapshot, setSnapshot] = useState({ target, value: 0 });

  useEffect(() => {
    if (target === null) return;
    const view = target?.ownerDocument.defaultView ?? window;
    const root = target ?? view.document.documentElement;
    const events = target ?? view;
    let frame = 0;
    let disposed = false;

    const measure = () => {
      frame = 0;
      if (disposed) return;
      const viewport = target ? root.clientHeight : view.innerHeight;
      const height = target ? root.scrollHeight : Math.max(root.scrollHeight, view.document.body?.scrollHeight ?? 0);
      const offset = target ? root.scrollTop : view.scrollY;
      const range = Math.max(0, height - viewport);
      const value = range === 0 ? 100 : Math.round(Math.min(1, Math.max(0, offset / range)) * 100);
      setSnapshot(previous => previous.target === target && previous.value === value ? previous : { target, value });
    };
    const schedule = () => {
      if (!disposed && !frame) frame = view.requestAnimationFrame(measure);
    };
    const resize = new ResizeObserver(schedule);
    const observeContent = () => {
      resize.disconnect();
      resize.observe(root);
      for (const child of root.children) resize.observe(child);
      if (!target && view.document.body) {
        resize.observe(view.document.body);
        for (const child of view.document.body.children) resize.observe(child);
      }
      schedule();
    };
    const mutations = new MutationObserver(observeContent);
    mutations.observe(root, { childList: true, subtree: true, characterData: true, attributes: true });
    events.addEventListener('scroll', schedule, { passive: true });
    view.addEventListener('resize', schedule);
    root.addEventListener('load', schedule, true);
    observeContent();
    return () => {
      disposed = true;
      view.cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
      events.removeEventListener('scroll', schedule);
      view.removeEventListener('resize', schedule);
      root.removeEventListener('load', schedule, true);
    };
  }, [target]);

  return target === null || snapshot.target !== target ? 0 : snapshot.value;
}
