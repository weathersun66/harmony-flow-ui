import { useState, type HTMLAttributes } from 'react';
import { activateNavigationItem, type NavigationItem, type NavigationSelectionProps } from './types';
import { useDismissibleLayer } from '../overlays/useOverlay';
import { Icon } from '../foundations/Icon';

interface BaseMenuProps extends HTMLAttributes<HTMLDivElement>, NavigationSelectionProps {
  label: string;
  items: readonly NavigationItem[];
}

export function DropdownMenu({ label, items, activeKey, onItemSelect, className = '', ...props }: BaseMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useDismissibleLayer<HTMLDivElement>(open, () => setOpen(false), { autoFocus: false });
  return <div ref={ref} className={`hf-menu ${className}`.trim()} {...props}><button type="button" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((value) => !value)}><span>{label}</span><Icon className="hf-menu__chevron" name="chevron-down" size={16} /></button>{open && <div className="hf-menu__panel" role="menu">{items.map((item) => <a key={item.key} role="menuitem" href={item.href ?? '#'} aria-current={activeKey === item.key ? 'page' : undefined} onClick={() => { activateNavigationItem(item, onItemSelect); setOpen(false); }}>{item.label}</a>)}</div>}</div>;
}

export function MegaMenu({ label, items, onItemSelect, className = '', ...props }: BaseMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useDismissibleLayer<HTMLDivElement>(open, () => setOpen(false), { autoFocus: false });
  return <div ref={ref} className={`hf-menu hf-mega-menu ${className}`.trim()} {...props}><button type="button" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((value) => !value)}><span>{label}</span><Icon className="hf-menu__chevron" name="chevron-down" size={16} /></button>{open && <div className="hf-mega-menu__panel" role="menu">{items.map((group) => <section key={group.key}><h3>{group.label}</h3>{group.children?.map((item) => <a key={item.key} role="menuitem" href={item.href ?? '#'} onClick={() => { activateNavigationItem(item, onItemSelect); setOpen(false); }}><span>{item.icon}</span><span><strong>{item.label}</strong>{item.description && <small>{item.description}</small>}</span></a>)}</section>)}</div>}</div>;
}
