import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

export function useTourPosition(open: boolean, target: (() => HTMLElement | null) | undefined) {
  const marker = useRef<HTMLSpanElement>(null);
  const [rect, setRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [theme, setTheme] = useState<CSSProperties>({});
  useLayoutEffect(() => {
    if (!open) return;
    const host = marker.current?.closest('.hf-theme') ?? marker.current;
    if (host) {
      const computed = getComputedStyle(host);
      const variables: Record<string, string> = { fontFamily: computed.fontFamily, colorScheme: computed.colorScheme };
      for (const key of computed) if (key.startsWith('--hf-')) variables[key] = computed.getPropertyValue(key);
      setTheme(variables);
    }
    let observed: HTMLElement | null = null;
    const resize = new ResizeObserver(update);
    function update() {
      const node = target?.() ?? null;
      if (observed !== node) {
        if (observed) resize.unobserve(observed);
        observed = node;
        if (node) resize.observe(node);
      }
      const bounds = node?.isConnected ? node.getBoundingClientRect() : null;
      const visible = bounds && node && getComputedStyle(node).visibility !== 'hidden'
        && bounds.width > 0 && bounds.height > 0 && bounds.bottom > 0
        && bounds.top < window.innerHeight && bounds.right > 0 && bounds.left < window.innerWidth;
      const next = visible ? { top: Math.max(0, bounds.top), left: Math.max(0, bounds.left),
        width: Math.min(window.innerWidth, bounds.right) - Math.max(0, bounds.left),
        height: Math.min(window.innerHeight, bounds.bottom) - Math.max(0, bounds.top) } : null;
      setRect((previous) => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    }
    update();
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const mutation = new MutationObserver((records) => {
      if (records.some((record) => !(record.target instanceof Element)
        || !record.target.closest('.hf-product-tour'))) schedule();
    });
    mutation.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'hidden'] });
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    document.addEventListener('transitionend', schedule, true);
    document.addEventListener('animationend', schedule, true);
    return () => {
      resize.disconnect();
      mutation.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      document.removeEventListener('transitionend', schedule, true);
      document.removeEventListener('animationend', schedule, true);
    };
  }, [open, target]);
  return { marker, rect, theme };
}
