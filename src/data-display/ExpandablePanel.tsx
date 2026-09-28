import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Button } from '../components/Button';

export interface ExpandablePanelProps {
  title: string;
  summary?: ReactNode;
  children: ReactNode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function ExpandablePanel({ title, summary, children, expanded, defaultExpanded = false,
  onExpandedChange, disabled = false, className = '' }: ExpandablePanelProps) {
  const [internal, setInternal] = useState(defaultExpanded);
  const open = expanded ?? internal;
  const id = useId();
  const body = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open && body.current?.contains(document.activeElement)) {
      header.current?.querySelector('button')?.focus();
    }
  }, [open]);
  function toggle() {
    if (expanded === undefined) setInternal(!open);
    onExpandedChange?.(!open);
  }
  return <section className={`hf-expandable-panel ${className}`} aria-labelledby={`${id}-title`}>
    <div className="hf-expandable-panel__header" ref={header}>
      <h3 id={`${id}-title`}>{title}</h3>
      <Button variant="quiet" size="sm" disabled={disabled} aria-expanded={open} aria-controls={id} onClick={toggle}>
        {open ? '收起详情' : '展开详情'}
      </Button>
    </div>
    {summary && <div className="hf-expandable-panel__summary">{summary}</div>}
    <div id={id} ref={body} className="hf-expandable-panel__reveal" data-open={open} aria-hidden={!open} inert={!open}>
      <div><div className="hf-expandable-panel__content">{children}</div></div>
    </div>
  </section>;
}
