import { forwardRef, useEffect, useId, useRef, useState, type ChangeEvent, type KeyboardEvent, type ReactNode, type SelectHTMLAttributes } from 'react';
import { useDismissibleLayer } from '../overlays/useOverlay';

export interface SelectOption { label: ReactNode; value: string; disabled?: boolean }
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> { label?: string; hint?: string; error?: string; options: readonly SelectOption[]; placeholder?: string }

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { id, label, hint, error, options, placeholder, className = '', value, defaultValue, onChange, disabled, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...props }, forwardedRef,
) {
  const generatedId = useId(); const inputId = id ?? generatedId; const triggerId = `${inputId}-trigger`; const listboxId = `${inputId}-listbox`; const descriptionId = `${inputId}-description`;
  const [open, setOpen] = useState(false);
  const rootRef = useDismissibleLayer<HTMLDivElement>(open, () => setOpen(false), { autoFocus: false }); const nativeRef = useRef<HTMLSelectElement | null>(null);
  const [innerValue, setInnerValue] = useState(() => String(defaultValue ?? (placeholder ? '' : options.find((option) => !option.disabled)?.value ?? '')));
  const selectedValue = value === undefined ? innerValue : String(value); const selectedOption = options.find((option) => option.value === selectedValue);
  const enabledIndices = options.map((option, index) => option.disabled ? -1 : index).filter((index) => index >= 0); const selectedIndex = options.findIndex((option) => option.value === selectedValue);
  const [activeIndex, setActiveIndex] = useState(selectedIndex >= 0 ? selectedIndex : enabledIndices[0] ?? -1);
  const assignRef = (node: HTMLSelectElement | null) => { nativeRef.current = node; if (typeof forwardedRef === 'function') forwardedRef(node); else if (forwardedRef) forwardedRef.current = node; };
  const handleNativeChange = (event: ChangeEvent<HTMLSelectElement>) => { if (value === undefined) setInnerValue(event.currentTarget.value); onChange?.(event); };
  const choose = (nextValue: string) => { const native = nativeRef.current; if (!native) return; Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set?.call(native, nextValue); native.dispatchEvent(new Event('change', { bubbles: true })); if (value === undefined) setInnerValue(nextValue); setOpen(false); window.requestAnimationFrame(() => document.getElementById(triggerId)?.focus()); };
  useEffect(() => { if (selectedIndex >= 0) setActiveIndex(selectedIndex); }, [selectedIndex]);
  const move = (direction: 1 | -1) => { if (!enabledIndices.length) return; const current = enabledIndices.indexOf(activeIndex); const next = current < 0 ? 0 : (current + direction + enabledIndices.length) % enabledIndices.length; setActiveIndex(enabledIndices[next]!); };
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); if (!open) setOpen(true); move(event.key === 'ArrowDown' ? 1 : -1); }
    else if ((event.key === 'Enter' || event.key === ' ') && open) { event.preventDefault(); const option = options[activeIndex]; if (option && !option.disabled) choose(option.value); }
    else if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false); }
    else if (event.key === 'Home' && open && enabledIndices.length) { event.preventDefault(); setActiveIndex(enabledIndices[0]!); }
    else if (event.key === 'End' && open && enabledIndices.length) { event.preventDefault(); setActiveIndex(enabledIndices[enabledIndices.length - 1]!); }
    else if (event.key === 'Tab') setOpen(false);
  };
  return <div className={`hf-field ${className}`.trim()} ref={rootRef}>
    {label && <label className="hf-field__label" htmlFor={triggerId}>{label}</label>}
    <div className={`hf-select-shell ${open ? 'hf-select-shell--open' : ''} ${error ? 'hf-select-shell--error' : ''}`}>
      <select ref={assignRef} id={inputId} className="hf-select-native" tabIndex={-1} aria-hidden="true" value={selectedValue} disabled={disabled} onChange={handleNativeChange} {...props}>{placeholder && <option value="" disabled>{placeholder}</option>}{options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{typeof option.label === 'string' ? option.label : option.value}</option>)}</select>
      <button id={triggerId} type="button" className="hf-select" disabled={disabled} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listboxId : undefined} aria-activedescendant={open && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined} aria-invalid={Boolean(error)} aria-describedby={hint || error ? descriptionId : undefined} onClick={() => { setActiveIndex(selectedIndex >= 0 ? selectedIndex : enabledIndices[0] ?? -1); setOpen((current) => !current); }} onKeyDown={handleKeyDown}><span className={!selectedOption ? 'hf-select__placeholder' : ''}>{selectedOption?.label ?? placeholder ?? '请选择'}</span><svg className="hf-select__chevron" viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d={open ? 'm4.5 9.75 3.5-3.5 3.5 3.5' : 'm4.5 6.25 3.5 3.5 3.5-3.5'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
      {open && <div id={listboxId} className="hf-select-menu" role="listbox" aria-labelledby={triggerId}>{options.map((option, index) => <button id={`${listboxId}-option-${index}`} type="button" role="option" aria-selected={option.value === selectedValue} disabled={option.disabled} className={index === activeIndex ? 'is-active' : ''} key={option.value} onPointerMove={() => !option.disabled && setActiveIndex(index)} onClick={() => choose(option.value)}><span>{option.label}</span>{option.value === selectedValue && <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true"><path d="m3.5 8 3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}</button>)}</div>}
    </div>
    {(error || hint) && <span id={descriptionId} className={`hf-field__hint ${error ? 'hf-field__hint--error' : ''}`}>{error ?? hint}</span>}
  </div>;
});
