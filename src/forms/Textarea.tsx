import { forwardRef, useId, type TextareaHTMLAttributes, type ReactNode } from 'react';
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { label?: ReactNode; hint?: ReactNode; error?: ReactNode; resize?: 'none' | 'vertical' | 'both'; }
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ label, hint, error, resize = 'vertical', id, className = '', ...props }, ref) {
  const generated = useId(); const fieldId = id ?? generated; const message = error ?? hint; const messageId = message ? `${fieldId}-message` : undefined;
  return <label className="hf-field" htmlFor={fieldId}>{label && <span className="hf-field__label">{label}</span>}<textarea ref={ref} id={fieldId} className={`hf-textarea hf-textarea--${resize}${error ? ' hf-textarea--error' : ''} ${className}`} aria-invalid={error ? true : undefined} aria-describedby={messageId} {...props} />{message && <span id={messageId} className={`hf-field__hint${error ? ' hf-field__hint--error' : ''}`}>{message}</span>}</label>;
});
