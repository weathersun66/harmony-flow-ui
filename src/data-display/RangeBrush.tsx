import { useId, type ReactNode } from 'react';

export interface RangeBrushProps {
  value: readonly [number, number];
  onValueChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  formatValue?: (value: number) => string;
  children?: ReactNode;
  className?: string;
}

export function RangeBrush({ value, onValueChange, min = 0, max = 100, step = 1,
  label = '区间筛选', disabled = false, formatValue = String, children, className = '' }: RangeBrushProps) {
  const id = useId();
  const valid = Number.isFinite(min) && Number.isFinite(max) && max > min && Number.isFinite(max - min);
  const lower = valid ? min : 0;
  const upper = valid ? max : 100;
  const increment = Number.isFinite(step) && step > 0 ? step : 1;
  const steps = (upper - lower) / increment;
  const effectiveStep = Number.isFinite(steps) ? increment : upper - lower;
  const effectiveCount = (upper - lower) / effectiveStep;
  const lastStep = Math.floor(effectiveCount + Number.EPSILON * Math.max(1, effectiveCount) * 2);
  const snap = (number: number, fallback: number) => {
    const candidate = Math.min(upper, Math.max(lower, Number.isFinite(number) ? number : fallback));
    const position = Math.min(lastStep, Math.round((candidate - lower) / effectiveStep));
    return Math.min(upper, Number((lower + position * effectiveStep).toPrecision(12)));
  };
  const values = [snap(value[0], lower), snap(value[1], upper)].sort((a, b) => a - b);
  const start = values[0]!;
  const end = values[1]!;
  const percent = (number: number) => `${(number - lower) / (upper - lower) * 100}%`;
  return <fieldset className={`hf-range-brush ${className}`} disabled={disabled || !valid}>
    <legend>{label}</legend>
    <div className="hf-range-brush__plot" aria-hidden="true" inert>
      {children}
      <div className="hf-range-brush__selection" style={{ left: percent(start), right: percent(upper - end + lower) }} />
    </div>
    {!valid && <p role="status">区间范围无效：max 必须大于 min，且边界必须为有限数。</p>}
    <div className="hf-range-brush__controls">
      <label htmlFor={`${id}-start`}>起点 <output>{formatValue(start)}</output></label>
      <input id={`${id}-start`} type="range" min={lower} max={upper} step={effectiveStep} value={start}
        aria-valuetext={formatValue(start)} onChange={(event) => onValueChange([Math.min(end, snap(Number(event.target.value), start)), end])} />
      <label htmlFor={`${id}-end`}>终点 <output>{formatValue(end)}</output></label>
      <input id={`${id}-end`} type="range" min={lower} max={upper} step={effectiveStep} value={end}
        aria-valuetext={formatValue(end)} onChange={(event) => onValueChange([start, Math.max(start, snap(Number(event.target.value), end))])} />
    </div>
  </fieldset>;
}
