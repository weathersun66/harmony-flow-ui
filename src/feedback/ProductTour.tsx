import { useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../components/Button';
import { useDismissibleLayer } from '../overlays/useOverlay';
import { useTourPosition } from './useTourPosition';

export interface ProductTourStep {
  id: string;
  title: string;
  description: ReactNode;
  target?: () => HTMLElement | null;
}

export interface ProductTourProps {
  steps: readonly ProductTourStep[];
  open: boolean;
  current: number;
  onCurrentChange: (current: number) => void;
  onClose: () => void;
  onFinish?: () => void;
  className?: string;
}

export function ProductTour({ steps, open, current, onCurrentChange, onClose, onFinish, className = '' }: ProductTourProps) {
  const index = Number.isFinite(current) ? Math.max(0, Math.min(steps.length - 1, Math.floor(current))) : 0;
  const step = steps[index];
  const active = open && !!step;
  const ref = useDismissibleLayer<HTMLDivElement>(active, onClose, true);
  const { marker, rect, theme } = useTourPosition(active, step?.target);
  const id = useId();
  return <><span ref={marker} hidden />{active && step && typeof document !== 'undefined' && createPortal(
    <div className={`hf-product-tour ${className}`} style={theme}>
      <svg className="hf-product-tour__shade" aria-hidden="true" width="100%" height="100%">
        <defs><mask id={`${id}-mask`}><rect width="100%" height="100%" fill="white" />
          {rect && <rect width={rect.width} height={rect.height} x={rect.left} y={rect.top} fill="black" />}
        </mask></defs>
        <rect width="100%" height="100%" fill="currentColor" mask={`url(#${id}-mask)`} />
      </svg>
      {rect && <div className="hf-product-tour__target" style={rect} aria-hidden="true" />}
      <div ref={ref} className="hf-product-tour__card" role="dialog" aria-modal="true"
        aria-labelledby={`${id}-title`} aria-describedby={`${id}-body`} tabIndex={-1}>
        <span className="hf-product-tour__count">{index + 1} / {steps.length}</span>
        <h3 id={`${id}-title`}>{step.title}</h3>
        <div id={`${id}-body`}>{step.description}</div>
        {step.target && !rect && <p role="status">目标当前不可见，请关闭导览后检查页面。</p>}
        <div className="hf-product-tour__actions">
          <Button variant="quiet" onClick={onClose}>关闭导览</Button>
          <Button variant="outline" disabled={index === 0} onClick={() => onCurrentChange(index - 1)}>上一步</Button>
          <Button onClick={() => index < steps.length - 1 ? onCurrentChange(index + 1) : (onFinish ?? onClose)()}>
            {index < steps.length - 1 ? '下一步' : '结束导览'}
          </Button>
        </div>
      </div>
    </div>, document.body)}</>;
}
