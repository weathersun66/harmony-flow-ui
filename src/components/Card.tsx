import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  interactive?: boolean;
}

export function Card({ children, title, eyebrow, action, interactive = false, className = '', ...props }: PropsWithChildren<CardProps>) {
  return (
    <article className={`hf-card ${interactive ? 'hf-card--interactive' : ''} ${className}`.trim()} {...props}>
      {(eyebrow || title || action) && (
        <header className="hf-card__header">
          <div>
            {eyebrow && <p className="hf-card__eyebrow">{eyebrow}</p>}
            {title && <h3 className="hf-card__title">{title}</h3>}
          </div>
          {action}
        </header>
      )}
      <div className="hf-card__body">{children}</div>
    </article>
  );
}
