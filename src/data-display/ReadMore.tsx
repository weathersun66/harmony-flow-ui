import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { Button } from '../components/Button';

export interface ReadMoreProps {
  text: string;
  lines?: number;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  expandLabel?: string;
  collapseLabel?: string;
  className?: string;
}

/** 仅截断纯文本，避免折叠区中出现不可见但可聚焦的链接或按钮。 */
export function ReadMore({
  text, lines = 3, expanded, defaultExpanded = false, onExpandedChange,
  expandLabel = '展开全文', collapseLabel = '收起全文', className = '',
}: ReadMoreProps) {
  const id = useId();
  const content = useRef<HTMLParagraphElement>(null);
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const [overflow, setOverflow] = useState(false);
  const isExpanded = expanded ?? internalExpanded;
  const lineCount = Number.isFinite(lines) ? Math.max(1, Math.floor(lines)) : 3;

  useEffect(() => {
    const element = content.current;
    if (!element || isExpanded) return;
    const measure = () => setOverflow(element.scrollHeight > element.clientHeight + 1);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [text, lineCount, isExpanded]);

  function toggle() {
    if (expanded === undefined) setInternalExpanded(!isExpanded);
    onExpandedChange?.(!isExpanded);
  }

  return (
    <div className={`hf-read-more ${className}`.trim()}>
      <p
        ref={content}
        id={id}
        className={isExpanded ? 'hf-read-more__text' : 'hf-read-more__text is-clamped'}
        style={{ '--hf-read-more-lines': lineCount } as CSSProperties}
      >{text}</p>
      {(overflow || (isExpanded && Boolean(text))) && (
        <Button variant="quiet" size="sm" onClick={toggle} aria-expanded={isExpanded} aria-controls={id}>
          {isExpanded ? collapseLabel : expandLabel}
        </Button>
      )}
    </div>
  );
}
