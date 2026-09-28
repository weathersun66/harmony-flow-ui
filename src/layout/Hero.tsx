import type { ReactNode } from 'react';

export interface HeroProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  visual?: ReactNode;
  proof?: ReactNode;
  align?: 'left' | 'center';
  kind?: 'product' | 'personal' | 'event' | 'commerce';
}

export function Hero({ eyebrow, title, description, primaryAction, secondaryAction, visual, proof, align = 'left', kind = 'product' }: HeroProps) {
  return <section className={`hf-hero hf-hero--${align} hf-hero--${kind}`}>
    <div className="hf-hero__content">{eyebrow && <div className="hf-hero__eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}{(primaryAction || secondaryAction) && <div className="hf-hero__actions">{primaryAction}{secondaryAction}</div>}{proof && <div className="hf-hero__proof">{proof}</div>}</div>
    {visual && <div className="hf-hero__visual">{visual}</div>}
  </section>;
}
