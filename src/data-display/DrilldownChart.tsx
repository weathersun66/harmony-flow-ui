import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '../components/Button';

export interface DrilldownItem {
  id: string;
  label: string;
  value: number;
  children?: readonly DrilldownItem[];
  disabled?: boolean;
}
export interface DrilldownChartProps {
  items: readonly DrilldownItem[];
  title?: string;
  path?: readonly string[];
  defaultPath?: readonly string[];
  onPathChange?: (path: string[]) => void;
  onLeafSelect?: (item: DrilldownItem, path: string[]) => void;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  className?: string;
}

function resolveLevel(items: readonly DrilldownItem[], path: readonly string[]) {
  const ancestors: DrilldownItem[] = [];
  let current = items;
  for (const key of path) {
    const item = current.find((candidate) => candidate.id === key);
    if (!item?.children?.length || item.disabled) break;
    ancestors.push(item);
    current = item.children;
  }
  return { ancestors, current };
}

export function DrilldownChart({ items, title = '层级数据', path, defaultPath = [], onPathChange,
  onLeafSelect, formatValue = String, disabled = false, className = '' }: DrilldownChartProps) {
  const [internal, setInternal] = useState<readonly string[]>(defaultPath);
  const requested = path ?? internal;
  const { ancestors, current } = resolveLevel(items, requested);
  const keys = ancestors.map((item) => item.id);
  const key = JSON.stringify(keys);
  const previous = useRef(key);
  const heading = useRef<HTMLHeadingElement>(null);
  const id = useId();
  useEffect(() => {
    if (previous.current !== key) heading.current?.focus();
    previous.current = key;
  }, [key]);
  function navigate(next: string[]) {
    if (path === undefined) setInternal(next);
    onPathChange?.(next);
  }
  let maximum = 1;
  for (const item of current) if (Number.isFinite(item.value)) maximum = Math.max(maximum, item.value);
  return <section className={`hf-drilldown-chart ${className}`} aria-labelledby={id}>
    <nav aria-label={`${title}路径`}><Button type="button" variant="quiet" size="sm" disabled={disabled || !keys.length}
      onClick={() => navigate([])}>{title}</Button>
      {ancestors.map((item, index) => <Button key={JSON.stringify(keys.slice(0, index + 1))} type="button" variant="quiet" size="sm"
        disabled={disabled || index === ancestors.length - 1} onClick={() => navigate(keys.slice(0, index + 1))}>{item.label}</Button>)}
    </nav>
    <div className="hf-drilldown-chart__header">
      <h3 id={id} ref={heading} tabIndex={-1}>{ancestors.at(-1)?.label ?? title}</h3>
      {keys.length > 0 && <Button type="button" variant="outline" size="sm" disabled={disabled}
        onClick={() => navigate(keys.slice(0, -1))}>返回上层</Button>}
    </div>
    {requested.length !== keys.length && <p role="status">原路径已失效，已显示最近的有效层级。</p>}
    {!current.length && <p role="status">暂无层级数据</p>}
    <ul>{current.map((item) => {
      const valid = Number.isFinite(item.value) && item.value >= 0;
      const branch = !!item.children?.length;
      const actionable = branch || !!onLeafSelect;
      const content = <><span className="hf-drilldown-chart__label">{item.label}</span>
        <span>{valid ? formatValue(item.value) : '数值无效'}{branch ? ' · 查看明细' : ''}</span>
        <span className="hf-drilldown-chart__track" aria-hidden="true"><span style={{ width: `${valid ? item.value / maximum * 100 : 0}%` }} /></span></>;
      return <li key={item.id}>{actionable ? <button type="button" disabled={disabled || item.disabled || !valid}
        onClick={() => branch ? navigate([...keys, item.id]) : onLeafSelect?.(item, [...keys, item.id])}>{content}</button>
        : <div className="hf-drilldown-chart__leaf">{content}</div>}</li>;
    })}</ul>
  </section>;
}
