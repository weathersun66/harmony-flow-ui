import { forwardRef, type InputHTMLAttributes } from 'react';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, className = '', ...props },
  ref,
) {
  return (
    <label className={`hf-switch ${className}`.trim()}>
      <input ref={ref} className="hf-switch__input" type="checkbox" role="switch" {...props} />
      <span className="hf-switch__track" aria-hidden="true"><span className="hf-switch__thumb" /></span>
      <span className="hf-switch__label">{label}</span>
    </label>
  );
});
