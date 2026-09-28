import type { ReactNode } from 'react';

export interface LegendFilterItem {
  id: string;
  label: ReactNode;
  color?: string;
  disabled?: boolean;
}

export interface LegendFilterProps {
  items: readonly LegendFilterItem[];
  visibleKeys: readonly string[];
  onVisibleKeysChange: (keys: string[]) => void;
  label?: string;
  allowEmpty?: boolean;
  disabled?: boolean;
  className?: string;
}

export function LegendFilter({ items, visibleKeys, onVisibleKeysChange, label = '图例筛选',
  allowEmpty = false, disabled = false, className = '' }: LegendFilterProps) {
  const keys = items.filter((item) => visibleKeys.includes(item.id)).map((item) => item.id);
  function toggle(id: string) {
    const next = keys.includes(id) ? keys.filter((key) => key !== id) : [...keys, id];
    if (allowEmpty || next.length) onVisibleKeysChange(next);
  }
  return <div className={`hf-legend-filter ${className}`} role="group" aria-label={label}>
    {items.length === 0 && <span>暂无图例</span>}
    {items.map((item) => {
      const active = keys.includes(item.id);
      return <button key={item.id} type="button" aria-pressed={active}
        disabled={disabled || item.disabled || (!allowEmpty && active && keys.length === 1)}
        onClick={() => toggle(item.id)}>
        <span className="hf-legend-filter__swatch" aria-hidden="true" style={{ backgroundColor: item.color }} />
        <span>{item.label}</span><span aria-hidden="true">{active ? '✓' : '−'}</span>
      </button>;
    })}
  </div>;
}
