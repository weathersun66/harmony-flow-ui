import type { SVGAttributes } from 'react';

export type IconName = 'check' | 'close' | 'info' | 'warning' | 'error' | 'search' | 'chevron-down' | 'arrow-right' | 'user' | 'inbox';
export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> { name: IconName; size?: number; label?: string; }

const paths: Record<IconName, string> = {
  check: 'M5 12.5 9.2 17 19 7', close: 'm7 7 10 10M17 7 7 17', info: 'M12 11v6M12 7.5h.01',
  warning: 'M12 4 3.5 19h17L12 4Zm0 5v4.5m0 2.5h.01', error: 'M8 8l8 8m0-8-8 8',
  search: 'm20 20-4.5-4.5m2.5-4A7 7 0 1 1 4 11a7 7 0 0 1 14 0Z', 'chevron-down': 'm7 10 5 5 5-5',
  'arrow-right': 'M5 12h14m-5-5 5 5-5 5', user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0',
  inbox: 'M4 5h16v13H4V5Zm0 9h4l2 2h4l2-2h4',
};

export function Icon({ name, size = 20, label, className = '', ...props }: IconProps) {
  return <svg className={`hf-icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} {...props}><path d={paths[name]} /></svg>;
}
