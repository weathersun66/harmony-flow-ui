import type { ReactNode } from 'react';
import { Icon, type IconName } from '../foundations/Icon';
export function EmptyState({ icon = 'inbox', title, description, action, size = 'md' }: { icon?: IconName; title: ReactNode; description?: ReactNode; action?: ReactNode; size?: 'sm' | 'md' }) { return <div className={`hf-empty hf-empty--${size}`}><span className="hf-empty__icon"><Icon name={icon} size={size === 'sm' ? 22 : 28} /></span><strong>{title}</strong>{description && <p>{description}</p>}{action && <div>{action}</div>}</div>; }
