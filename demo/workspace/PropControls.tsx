import { Input } from '../../src/components/Input';
import { Select } from '../../src/forms/Select';
import type { ComponentPropDoc } from '../component-docs/types';

export type PropValue = string | number | boolean;
export function controlFor(prop: ComponentPropDoc) {
  if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(prop.name) || prop.name.startsWith('on')) return null;
  // 浮层开关由示例触发器控制，避免强制open后焦点陷阱阻止用户回到编辑器。
  if (['open', 'defaultOpen', 'visible'].includes(prop.name)) return null;
  const options = [...prop.type.matchAll(/'([^']+)'/g)].map(match => match[1]!);
  if (options.length >= 2 && !/[<>()[\]{}]/.test(prop.type)) return { kind: 'enum' as const, options };
  if (prop.type === 'boolean') return { kind: 'boolean' as const, options: [] };
  if (prop.type === 'number') return { kind: 'number' as const, options: [] };
  if (prop.type === 'string') return { kind: 'string' as const, options: [] };
  return null;
}
export function PropControls({ props, values, onChange }: { props: readonly ComponentPropDoc[]; values: Record<string, PropValue>; onChange: (name: string, value: PropValue | undefined) => void }) {
  return <div className="ws-prop-controls">{props.map(prop => {
    const control = controlFor(prop);
    if (!control) return null;
    const value = values[prop.name];
    return <div className="ws-prop-field" key={prop.name}><span title={prop.description}>{prop.name}</span>
      {(control.kind === 'enum' || control.kind === 'boolean') ? <Select aria-label={`属性 ${prop.name}`} value={value === undefined ? '' : String(value)} onChange={event => onChange(prop.name, event.target.value === '' ? undefined : control.kind === 'boolean' ? event.target.value === 'true' : event.target.value)} options={[{value: '', label: '保留示例值'}, ...(control.kind === 'boolean' ? ['true', 'false'] : control.options).map(option => ({value: option, label: option}))]} />
        : <Input aria-label={`属性 ${prop.name}`} type={control.kind === 'number' ? 'number' : 'text'} placeholder={`示例默认值 ${prop.defaultValue}`} maxLength={200} value={value === undefined ? '' : String(value)} onChange={event => {
          const raw = event.target.value;
          if (!raw) onChange(prop.name, undefined);
          else if (control.kind === 'number') { const number = Number(raw); if (Number.isFinite(number) && Math.abs(number) <= 10000) onChange(prop.name, number); }
          else onChange(prop.name, raw);
        }} />}
    </div>;
  })}</div>;
}
