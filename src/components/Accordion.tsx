import { useState, type ReactNode } from 'react';
export interface AccordionItem { key: string; title: ReactNode; content: ReactNode; disabled?: boolean }
export interface AccordionProps { items: readonly AccordionItem[]; value?: readonly string[]; defaultValue?: readonly string[]; onChange?: (keys: string[]) => void; multiple?: boolean }
export function Accordion({ items, value, defaultValue = [], onChange, multiple = false }: AccordionProps) {
  const [inner, setInner] = useState<string[]>([...defaultValue]); const active = value ? [...value] : inner;
  const toggle = (key: string) => { const next = active.includes(key) ? active.filter((item) => item !== key) : multiple ? [...active, key] : [key]; if (!value) setInner(next); onChange?.(next); };
  return <div className="hf-accordion">{items.map((item) => { const open = active.includes(item.key); return <section className={open ? 'is-open' : ''} key={item.key}><h3><button type="button" aria-expanded={open} disabled={item.disabled} onClick={() => toggle(item.key)}><span>{item.title}</span><span className="hf-accordion__toggle" aria-hidden="true"><i /><i /></span></button></h3>{open && <div className="hf-accordion__panel">{item.content}</div>}</section>; })}</div>;
}
