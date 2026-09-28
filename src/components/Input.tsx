import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className = '', id, label, hint, error, prefix, disabled, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  return (
    <label className={`hf-field ${className}`.trim()} htmlFor={inputId}>
      {label && <span className="hf-field__label">{label}</span>}
      <span className={`hf-input-shell ${error ? 'hf-input-shell--error' : ''}`}>
        {prefix && <span className="hf-input-shell__prefix" aria-hidden="true">{prefix}</span>}
        <input
          ref={ref}
          id={inputId}
          className="hf-input"
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={hint || error ? descriptionId : undefined}
          {...props}
        />
      </span>
      {(error || hint) && (
        <span id={descriptionId} className={`hf-field__hint ${error ? 'hf-field__hint--error' : ''}`}>
          {error ?? hint}
        </span>
      )}
    </label>
  );
});
