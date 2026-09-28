import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../foundations/Icon';

export function Divider({ orientation = 'horizontal', label, className = '' }: { orientation?: 'horizontal' | 'vertical'; label?: ReactNode; className?: string }) { return <div className={`hf-divider hf-divider--${orientation}${label ? ' hf-divider--labelled' : ''} ${className}`} role="separator" aria-orientation={orientation}>{label && <span>{label}</span>}</div>; }
export function Link({ external, className = '', children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { external?: boolean }) { return <a className={`hf-link ${className}`} target={external ? '_blank' : props.target} rel={external ? 'noreferrer' : props.rel} {...props}>{children}{external && <span aria-hidden="true">↗</span>}</a>; }

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
export function Badge({ tone = 'neutral', dot, className = '', ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone; dot?: boolean }) { return <span className={`hf-badge hf-tone--${tone} ${className}`} {...props}>{dot && <i aria-hidden="true" />}{props.children}</span>; }
export function Tag({ tone = 'neutral', onRemove, removeLabel = '移除标签', className = '', children, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone; onRemove?: () => void; removeLabel?: string }) { return <span className={`hf-tag hf-tone--${tone} ${className}`} {...props}>{children}{onRemove && <button type="button" aria-label={removeLabel} onClick={onRemove}><Icon name="close" size={14} /></button>}</span>; }

export function Avatar({ src, name, alt = '', size = 'md', status, className = '' }: { src?: string; name: string; alt?: string; size?: 'sm' | 'md' | 'lg'; status?: 'online' | 'busy' | 'away'; className?: string }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  return <span className={`hf-avatar hf-avatar--${size} ${className}`} title={name}>{src ? <img src={src} alt={alt || name} /> : <span aria-hidden="true">{initials}</span>}{status && <i className={`hf-avatar__status hf-avatar__status--${status}`} aria-label={{ online: '在线', busy: '忙碌', away: '离开' }[status]} />}</span>;
}
