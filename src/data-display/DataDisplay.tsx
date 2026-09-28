import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export interface StatisticCardProps extends HTMLAttributes<HTMLElement> { label: ReactNode; value: ReactNode; trend?: ReactNode; icon?: ReactNode; tone?: 'blue' | 'green' | 'violet' | 'amber' }
export function StatisticCard({ label, value, trend, icon, tone = 'blue', className = '', ...props }: StatisticCardProps) {
  return <article className={`hf-stat hf-stat--${tone} ${className}`.trim()} {...props}><div className="hf-stat__top"><span>{label}</span>{icon && <i>{icon}</i>}</div><strong>{value}</strong>{trend && <small>{trend}</small>}<span className="hf-stat__glow" aria-hidden="true" /></article>;
}
/** COMPAT: StatisticCard remains available for existing consumers; Stat is the concise public name. */
export const Stat = StatisticCard;

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> { value: number; max?: number; label?: ReactNode; showValue?: boolean; size?: 'sm' | 'md' | 'lg'; tone?: 'primary' | 'success' | 'warning' }
export function Progress({ value, max = 100, label, showValue = true, size = 'md', tone = 'primary', className = '', ...props }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, max ? value / max * 100 : 0));
  return <div className={`hf-progress hf-progress--${size} hf-progress--${tone} ${className}`.trim()} {...props}>{(label || showValue) && <div className="hf-progress__meta"><span>{label}</span>{showValue && <strong>{Math.round(percent)}%</strong>}</div>}<div className="hf-progress__track" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}><span style={{ '--hf-progress': `${percent}%` } as CSSProperties} /></div></div>;
}

export interface CircularProgressProps extends HTMLAttributes<HTMLDivElement> { value: number; max?: number; label?: ReactNode; size?: number; thickness?: number }
export function CircularProgress({ value, max = 100, label, size = 92, thickness = 8, className = '', ...props }: CircularProgressProps) {
  const percent = Math.min(100, Math.max(0, max ? value / max * 100 : 0));
  return <div className={`hf-circular-progress ${className}`.trim()} style={{ '--hf-circle': `${percent * 3.6}deg`, '--hf-circle-size': `${size}px`, '--hf-circle-thickness': `${thickness}px` } as CSSProperties} role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} {...props}><span><strong>{Math.round(percent)}%</strong>{label && <small>{label}</small>}</span></div>;
}

export interface StepProgressProps extends HTMLAttributes<HTMLOListElement> { steps: readonly ReactNode[]; current: number }
export function StepProgress({ steps, current, className = '', ...props }: StepProgressProps) {
  return <ol className={`hf-step-progress ${className}`.trim()} {...props}>{steps.map((step, index) => <li key={index} className={index < current ? 'is-complete' : index === current ? 'is-current' : ''}><span>{index < current ? '✓' : index + 1}</span><small>{step}</small></li>)}</ol>;
}

export interface ActivityIndicatorProps extends HTMLAttributes<HTMLSpanElement> { variant?: 'spinner' | 'dots' | 'radar' | 'wave'; label?: string; size?: 'sm' | 'md' | 'lg' }
export function ActivityIndicator({ variant = 'spinner', label = '正在加载', size = 'md', className = '', ...props }: ActivityIndicatorProps) {
  return <span className={`hf-activity hf-activity--${variant} hf-activity--${size} ${className}`.trim()} role="status" aria-label={label} {...props}>{variant === 'dots' && <><i /><i /><i /></>}{variant === 'wave' && Array.from({ length: 5 }, (_, index) => <i key={index} />)}{variant === 'radar' && <i />}</span>;
}

export interface SparklineProps extends HTMLAttributes<SVGSVGElement> { data: readonly number[]; width?: number; height?: number; label?: string; filled?: boolean }
export function Sparkline({ data, width = 160, height = 48, label = '趋势图', filled = true, ...props }: SparklineProps) {
  const min = Math.min(...data); const max = Math.max(...data); const range = max - min || 1;
  const points = data.map((value, index) => `${data.length === 1 ? width / 2 : index / (data.length - 1) * width},${height - ((value - min) / range * (height - 8) + 4)}`).join(' ');
  const area = `0,${height} ${points} ${width},${height}`;
  return <svg className="hf-sparkline" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} {...props}>{filled && <polygon points={area} className="hf-sparkline__area" />}<polyline points={points} className="hf-sparkline__line" /></svg>;
}
