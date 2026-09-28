import { useId, type ReactNode } from 'react';

export interface ChoiceOption<T extends string = string> {
  label: ReactNode;
  value: T;
  description?: ReactNode;
  disabled?: boolean;
}

interface ChoiceGroupProps<T extends string> {
  label?: string;
  options: readonly ChoiceOption<T>[];
  value?: T | T[];
  defaultValue?: T | T[];
  onChange?: (value: T | T[]) => void;
  type?: 'radio' | 'checkbox';
  direction?: 'row' | 'column';
  disabled?: boolean;
  name?: string;
}

export function ChoiceGroup<T extends string>({ label, options, value, defaultValue, onChange, type = 'radio', direction = 'column', disabled, name }: ChoiceGroupProps<T>) {
  const id = useId();
  const groupName = name ?? id;
  const values = Array.isArray(value) ? value : value ? [value] : undefined;
  const defaults = Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : [];
  return <fieldset className={`hf-choice-group hf-choice-group--${direction}`} disabled={disabled}>
    {label && <legend>{label}</legend>}
    {options.map((option) => {
      const checked = values?.includes(option.value);
      return <label className="hf-choice" key={option.value}>
        <input type={type} name={type === 'radio' ? groupName : `${groupName}-${option.value}`} value={option.value} checked={checked} defaultChecked={values ? undefined : defaults.includes(option.value)} disabled={option.disabled} onChange={(event) => {
          if (type === 'radio') onChange?.(option.value);
          else {
            const next = new Set(values ?? defaults);
            event.currentTarget.checked ? next.add(option.value) : next.delete(option.value);
            onChange?.([...next]);
          }
        }} />
        <span className="hf-choice__control" aria-hidden="true" />
        <span className="hf-choice__copy"><strong>{option.label}</strong>{option.description && <small>{option.description}</small>}</span>
      </label>;
    })}
  </fieldset>;
}

export function RadioGroup<T extends string>(props: Omit<ChoiceGroupProps<T>, 'type' | 'value' | 'defaultValue' | 'onChange'> & { value?: T; defaultValue?: T; onChange?: (value: T) => void }) {
  return <ChoiceGroup {...props} type="radio" onChange={(next) => props.onChange?.(next as T)} />;
}

export function CheckboxGroup<T extends string>(props: Omit<ChoiceGroupProps<T>, 'type' | 'value' | 'defaultValue' | 'onChange'> & { value?: T[]; defaultValue?: T[]; onChange?: (value: T[]) => void }) {
  return <ChoiceGroup {...props} type="checkbox" onChange={(next) => props.onChange?.(next as T[])} />;
}
