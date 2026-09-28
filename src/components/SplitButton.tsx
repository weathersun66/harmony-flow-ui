import { useState, type ReactNode } from 'react';
import { Button, type ButtonProps } from './Button';
import { Icon } from '../foundations/Icon';
import { useDismissibleLayer } from '../overlays/useOverlay';
export interface SplitButtonOption { key: string; label: ReactNode; disabled?: boolean; danger?: boolean }
export interface SplitButtonProps extends Pick<ButtonProps, 'variant' | 'size' | 'disabled'> { label: ReactNode; options: readonly SplitButtonOption[]; onPrimaryAction: () => void; onOptionSelect: (key: string) => void }
export function SplitButton({ label, options, onPrimaryAction, onOptionSelect, variant = 'primary', size = 'md', disabled }: SplitButtonProps) {
  const [open, setOpen] = useState(false); const ref = useDismissibleLayer<HTMLDivElement>(open, () => setOpen(false), { autoFocus: false });
  return <div className="hf-split-button" ref={ref}><Button variant={variant} size={size} shape="rounded" disabled={disabled} onClick={onPrimaryAction}>{label}</Button><Button variant={variant} size={size} shape="rounded" disabled={disabled} iconOnly leadingIcon={<Icon name="chevron-down" size={16} />} aria-label="更多操作" aria-expanded={open} onClick={() => setOpen(!open)} />{open && <div className="hf-split-button__menu" role="menu">{options.map((option) => <button role="menuitem" type="button" key={option.key} disabled={option.disabled} className={option.danger ? 'is-danger' : ''} onClick={() => { onOptionSelect(option.key); setOpen(false); }}>{option.label}</button>)}</div>}</div>;
}
