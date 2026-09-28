import type { CSSProperties, HTMLAttributes, PropsWithChildren, ReactNode } from 'react';

export function Spinner({ label = '正在加载', size = 20, className = '' }: { label?: string; size?: number; className?: string }) {
  return <span className={`hf-loading-spinner ${className}`.trim()} role="status" aria-label={label} style={{ '--hf-loading-size': `${size}px` } as CSSProperties} />;
}

export function LoadingDots({ label = '正在加载' }: { label?: string }) {
  return <span className="hf-loading-dots" role="status" aria-label={label}><i /><i /><i /></span>;
}

export function ProgressBar({ value, label, indeterminate = false, className = '' }: { value?: number; label?: ReactNode; indeterminate?: boolean; className?: string }) {
  const percent = Math.min(100, Math.max(0, value ?? 0));
  return <div className={`hf-progress ${indeterminate ? 'is-indeterminate' : ''} ${className}`.trim()}>{label && <div className="hf-progress__label"><span>{label}</span>{!indeterminate && <strong>{percent}%</strong>}</div>}<div className="hf-progress__track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={indeterminate ? undefined : percent}><i style={{ '--hf-progress': `${percent}%` } as CSSProperties} /></div></div>;
}

export function ProgressRing({ value, size = 72, label }: { value: number; size?: number; label?: string }) {
  const percent = Math.min(100, Math.max(0, value));
  return <span className="hf-progress-ring" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} style={{ '--hf-ring-value': `${percent * 3.6}deg`, '--hf-ring-size': `${size}px` } as CSSProperties}><strong>{percent}%</strong></span>;
}

export interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> { active?: boolean; label?: string }
export function LoadingOverlay({ active = true, label = '正在准备内容', className = '', children, ...props }: PropsWithChildren<LoadingOverlayProps>) {
  return <div className={`hf-loading-overlay ${className}`.trim()} aria-busy={active} {...props}>{children}{active && <div className="hf-loading-overlay__veil" role="status"><Spinner label={label} size={28} /><span>{label}</span></div>}</div>;
}
