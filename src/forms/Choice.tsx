import { forwardRef, useEffect, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
type BaseProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { label: ReactNode; description?: ReactNode };
export const Checkbox = forwardRef<HTMLInputElement, BaseProps & { indeterminate?: boolean }>(function Checkbox({ label, description, indeterminate, className = '', ...props }, forwardedRef) {
  const local = useRef<HTMLInputElement>(null); useEffect(() => { if (local.current) local.current.indeterminate = Boolean(indeterminate); }, [indeterminate]);
  const setRef = (node: HTMLInputElement | null) => { local.current = node; if (typeof forwardedRef === 'function') forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; };
  return <label className={`hf-choice-control ${className}`}><input ref={setRef} type="checkbox" {...props} /><span className="hf-choice-control__mark"><IconCheck /></span><span><strong>{label}</strong>{description && <small>{description}</small>}</span></label>;
});
export const Radio = forwardRef<HTMLInputElement, BaseProps>(function Radio({ label, description, className = '', ...props }, ref) { return <label className={`hf-choice-control hf-choice-control--radio ${className}`}><input ref={ref} type="radio" {...props} /><span className="hf-choice-control__mark"><i /></span><span><strong>{label}</strong>{description && <small>{description}</small>}</span></label>; });
function IconCheck() { return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8 3 3 6-6" /></svg>; }
