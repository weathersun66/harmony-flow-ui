import { useId, useMemo, useState, type PointerEvent } from 'react';
import { crosshairGeometry } from './crosshairGeometry';

export interface CrosshairPoint { id: string; label: string; value: number | null }
export interface ChartCrosshairProps {
  points: readonly CrosshairPoint[];
  label?: string;
  selectedId?: string;
  defaultSelectedId?: string;
  onSelectedIdChange?: (id: string) => void;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  className?: string;
}

export function ChartCrosshair({ points, label = '逐点读数', selectedId, defaultSelectedId,
  onSelectedIdChange, formatValue = String, disabled = false, className = '' }: ChartCrosshairProps) {
  const [internal, setInternal] = useState(defaultSelectedId);
  const id = useId();
  const geometry = useMemo(() => crosshairGeometry(points), [points]);
  const index = geometry.indexById.get(selectedId ?? internal ?? '') ?? 0;
  const point = points[index];
  const position = geometry.coordinates[index];
  const valueText = point?.value !== null && point?.value !== undefined && Number.isFinite(point.value)
    ? formatValue(point.value) : '暂无读数';
  function select(next: number) {
    const candidate = points[next];
    if (disabled || !candidate || candidate.id === point?.id) return;
    if (selectedId === undefined) setInternal(candidate.id);
    onSelectedIdChange?.(candidate.id);
  }
  function locate(event: PointerEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width) return;
    const fraction = ((event.clientX - bounds.left) / bounds.width * 600 - 24) / 552;
    select(Math.max(0, Math.min(points.length - 1, Math.round(fraction * (points.length - 1)))));
  }
  return <section className={`hf-chart-crosshair ${className}`} aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}>{label}</h3>
    {!point ? <p role="status">暂无图表数据</p> : <>
      <div className="hf-chart-crosshair__scale" aria-hidden="true">
        <span>纵轴下界 {formatValue(geometry.min)}</span><span>上界 {formatValue(geometry.max)}</span>
      </div>
      <svg viewBox="0 0 600 220" preserveAspectRatio="none" aria-hidden="true"
        onPointerMove={(event) => { if (event.pointerType !== 'touch') locate(event); }} onPointerDown={locate}>
        <path className="hf-chart-crosshair__axis" d="M24 24V196H576" />
        <path className="hf-chart-crosshair__line" d={geometry.path} />
        {position && <>
          <path className="hf-chart-crosshair__cursor" d={`M${position.x} 24V196${position.y === null ? '' : ` M24 ${position.y}H576`}`} />
          {position.y !== null && <circle cx={position.x} cy={position.y} r="5" />}
        </>}
      </svg>
      <div className="hf-chart-crosshair__reading"><span>{point.label}</span><strong>{valueText}</strong></div>
      <label htmlFor={`${id}-point`}>选择数据点（{index + 1}/{points.length}）</label>
      <input id={`${id}-point`} type="range" min={0} max={Math.max(0, points.length - 1)} step={1}
        value={index} disabled={disabled || points.length < 2} aria-valuetext={`${point.label}：${valueText}`}
        onChange={(event) => select(Number(event.target.value))} />
      {!geometry.hasValues && <p role="status">当前序列没有有效数值</p>}
    </>}
  </section>;
}
