import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'quiet' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'pill' | 'square';
  fullWidth?: boolean;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  iconOnly?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, className = '', variant = 'primary', size = 'md', shape = 'rounded', fullWidth = false, loading = false, leadingIcon, trailingIcon, iconOnly = false, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`hf-button hf-button--${variant} hf-button--${size} hf-button--${shape} ${fullWidth ? 'hf-button--full' : ''} ${iconOnly ? 'hf-button--icon' : ''} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <span className="hf-spinner" aria-hidden="true" /> : leadingIcon}
      {!iconOnly && <span>{loading ? '处理中' : children}</span>}
      {!loading && trailingIcon}
    </button>
  );
});
