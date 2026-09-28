import { useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { ChartCrosshair, type CrosshairPoint } from './ChartCrosshair';
import { RangeBrush } from './RangeBrush';

export interface ZoomableChartProps {
  points: readonly CrosshairPoint[];
  label?: string;
  window?: readonly [number, number];
  defaultWindow?: readonly [number, number];
  onWindowChange?: (window: [number, number]) => void;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  className?: string;
}

function normalizeWindow(value: readonly [number, number], length: number): [number, number] {
  const last = Math.max(0, length - 1);
  const clamp = (number: number, fallback: number) => Number.isFinite(number) ? Math.max(0, Math.min(last, Math.round(number))) : fallback;
  let start = clamp(value[0], 0);
  let end = clamp(value[1], last);
  if (start > end) [start, end] = [end, start];
  if (start === end && length > 1) { if (end < last) end++; else start--; }
  return [start, end];
}

export function ZoomableChart({ points, label = '趋势缩放', window: controlled, defaultWindow,
  onWindowChange, formatValue, disabled = false, className = '' }: ZoomableChartProps) {
  const [internal, setInternal] = useState<readonly [number, number] | undefined>(defaultWindow);
  const [start, end] = normalizeWindow(controlled ?? internal ?? [0, points.length - 1], points.length);
  const visible = useMemo(() => points.slice(start, end + 1), [points, start, end]);
  const count = end - start + 1;
  function update(next: readonly [number, number]) {
    if (disabled) return;
    const normalized = normalizeWindow(next, points.length);
    if (normalized[0] === start && normalized[1] === end) return;
    if (controlled === undefined) setInternal(normalized);
    onWindowChange?.(normalized);
  }
  function resize(factor: number) {
    const size = Math.max(2, Math.min(points.length, Math.round(count * factor)));
    const left = Math.max(0, Math.min(points.length - size, Math.round((start + end - size + 1) / 2)));
    update([left, left + size - 1]);
  }
  function pan(direction: number) {
    const left = Math.max(0, Math.min(points.length - count, start + direction * Math.max(1, Math.floor(count / 2))));
    update([left, left + count - 1]);
  }
  return <div className={`hf-zoomable-chart ${className}`}>
    <div className="hf-zoomable-chart__controls" role="group" aria-label={`${label}视窗操作`}>
      <Button type="button" size="sm" variant="outline" disabled={disabled || count <= 2} onClick={() => resize(.5)}>放大</Button>
      <Button type="button" size="sm" variant="outline" disabled={disabled || count >= points.length} onClick={() => resize(2)}>缩小</Button>
      <Button type="button" size="sm" variant="outline" disabled={disabled || start === 0} onClick={() => pan(-1)}>向前平移</Button>
      <Button type="button" size="sm" variant="outline" disabled={disabled || end >= points.length - 1} onClick={() => pan(1)}>向后平移</Button>
      <Button type="button" size="sm" variant="outline" disabled={disabled || count >= points.length}
        onClick={() => update([0, points.length - 1])}>还原全部</Button>
    </div>
    <ChartCrosshair points={visible} label={label} formatValue={formatValue} disabled={disabled} />
    {points.length > 1 && <RangeBrush label="可见数据范围" min={0} max={points.length - 1} value={[start, end]}
      disabled={disabled} onValueChange={update} formatValue={(index) => points[index]?.label ?? String(index)} />}
    <p className="hf-zoomable-chart__summary" role="status">{points.length ? `显示第${start + 1}—${end + 1}点，共${points.length}点` : '没有可缩放的数据'}</p>
  </div>;
}
