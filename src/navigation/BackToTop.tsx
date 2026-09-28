import { useEffect, useState, type ButtonHTMLAttributes } from 'react';

export interface BackToTopProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> {
  target?: HTMLElement | null;
  threshold?: number;
  behavior?: ScrollBehavior;
  label?: string;
  onActivate?: () => void;
}

export function BackToTop({ target, threshold = 320, behavior = 'smooth', label = '返回顶部', onActivate, className = '', ...props }: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (target === null) {
      setVisible(false);
      return;
    }
    const view = target?.ownerDocument.defaultView ?? window;
    const source: HTMLElement | Window = target ?? view;
    const measure = () => setVisible((target?.scrollTop ?? view.scrollY) >= threshold);
    measure();
    source.addEventListener('scroll', measure, { passive: true });
    return () => source.removeEventListener('scroll', measure);
  }, [target, threshold]);

  const handleActivate = () => {
    const view = target?.ownerDocument.defaultView ?? window;
    const reduceMotion = view.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const resolvedBehavior = reduceMotion ? 'auto' : behavior;
    if (target) target.scrollTo({ top: 0, behavior: resolvedBehavior });
    else view.scrollTo({ top: 0, behavior: resolvedBehavior });
    onActivate?.();
  };

  if (!visible) return null;
  return (
    <button {...props} type="button" className={`hf-back-to-top hf-back-to-top--visible ${className}`.trim()} onClick={handleActivate}>
      <span aria-hidden="true">↑</span>
      <span>{label}</span>
    </button>
  );
}
