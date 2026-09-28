import { useId } from 'react';

export interface SegmentOption<T extends string> { label: string; value: T }
export interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({ label, options, value, onChange, className = '' }: SegmentedControlProps<T>) {
  const name = useId();
  return (
    <fieldset className={`hf-segmented ${className}`.trim()} aria-label={label}>
      <legend className="hf-sr-only">{label}</legend>
      {options.map((option) => (
        <label key={option.value} className="hf-segmented__option">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
