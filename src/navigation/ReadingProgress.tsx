import { useReadingPosition } from './useReadingPosition';

export interface ReadingProgressProps {
  /** Omit for the whole document; pass an element for its scroll position, null while unavailable. */
  target?: HTMLElement | null;
  label?: string;
  showValue?: boolean;
  className?: string;
}

/** Scroll position, not proof that a person has read the content. */
export function ReadingProgress({ target, label = '阅读进度', showValue = true, className = '' }: ReadingProgressProps) {
  const value = useReadingPosition(target);
  const name = label.trim() || '阅读进度';
  return <div className={`hf-reading-progress ${className}`.trim()}>
    {showValue && <div className="hf-reading-progress__caption" aria-hidden="true">
      <span>{name}</span><span>{value}%</span>
    </div>}
    <div className="hf-reading-progress__track" role="progressbar" aria-label={name}
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <span className="hf-reading-progress__fill" style={{ width: `${value}%` }} />
    </div>
  </div>;
}
