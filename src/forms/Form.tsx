import {
  createContext,
  useContext,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

const FormContext = createContext<{ disabled?: boolean }>({});

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  layout?: 'vertical' | 'horizontal';
  disabled?: boolean;
}

export function Form({
  layout = 'vertical',
  disabled,
  className = '',
  children,
  ...props
}: FormProps) {
  return (
    <FormContext.Provider value={{ disabled }}>
      <form
        className={`hf-form hf-form--${layout} ${className}`.trim()}
        aria-disabled={disabled || undefined}
        {...props}
      >
        <fieldset className="hf-form__fieldset" disabled={disabled}>
          {children}
        </fieldset>
      </form>
    </FormContext.Provider>
  );
}

export interface FormItemProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
}

export function FormItem({
  label,
  required,
  hint,
  error,
  children,
  className = '',
  ...props
}: FormItemProps) {
  const { disabled } = useContext(FormContext);
  return (
    <div
      className={`hf-form-item${error ? ' is-error' : ''} ${className}`.trim()}
      aria-disabled={disabled || undefined}
      {...props}
    >
      {label && (
        <div className="hf-form-item__label">
          {label}
          {required && <span aria-hidden="true">*</span>}
        </div>
      )}
      <div>
        {children}
        {(error || hint) && <small className={error ? 'is-error' : ''}>{error || hint}</small>}
      </div>
    </div>
  );
}
