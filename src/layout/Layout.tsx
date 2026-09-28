import type { CSSProperties, HTMLAttributes, PropsWithChildren, ReactNode } from 'react';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: number | 'auto';
  minItemWidth?: number;
  gap?: number;
}

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> { size?: 'sm' | 'md' | 'lg' | 'full'; padding?: number; }
export function Container({ size = 'lg', padding = 24, className = '', style, ...props }: PropsWithChildren<ContainerProps>) {
  return <div className={`hf-container hf-container--${size} ${className}`.trim()} style={{ '--hf-container-padding': `${padding}px`, ...style } as CSSProperties} {...props} />;
}

export interface StackProps extends HTMLAttributes<HTMLDivElement> { direction?: 'row' | 'column'; gap?: number; align?: CSSProperties['alignItems']; justify?: CSSProperties['justifyContent']; wrap?: boolean; }
export function Stack({ direction = 'column', gap = 12, align, justify, wrap = false, className = '', style, ...props }: PropsWithChildren<StackProps>) {
  return <div className={`hf-stack hf-stack--${direction} ${className}`.trim()} style={{ '--hf-stack-gap': `${gap}px`, alignItems: align, justifyContent: justify, flexWrap: wrap ? 'wrap' : undefined, ...style } as CSSProperties} {...props} />;
}

export function Grid({ columns = 'auto', minItemWidth = 240, gap = 16, className = '', style, ...props }: PropsWithChildren<GridProps>) {
  const gridStyle = {
    '--hf-grid-columns': columns === 'auto' ? `repeat(auto-fit, minmax(min(100%, ${minItemWidth}px), 1fr))` : `repeat(${columns}, minmax(0, 1fr))`,
    '--hf-grid-gap': `${gap}px`,
    ...style,
  } as CSSProperties;
  return <div className={`hf-grid ${className}`.trim()} style={gridStyle} {...props} />;
}

export interface MasonryProps extends HTMLAttributes<HTMLDivElement> {
  columns?: number;
  minColumnWidth?: number;
  gap?: number;
}

export function Masonry({ columns, minColumnWidth = 260, gap = 16, className = '', style, children, ...props }: PropsWithChildren<MasonryProps>) {
  const masonryStyle = {
    '--hf-masonry-columns': columns ?? 'auto',
    '--hf-masonry-width': `${minColumnWidth}px`,
    '--hf-masonry-gap': `${gap}px`,
    ...style,
  } as CSSProperties;
  return <div className={`hf-masonry ${className}`.trim()} style={masonryStyle} {...props}>{children}</div>;
}

export interface PageLayoutProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'single' | 'sidebar-left' | 'sidebar-right' | 'split' | 'dashboard' | 'full-screen';
  sidebar?: ReactNode;
  header?: ReactNode;
  sidebarWidth?: number;
}

export function PageLayout({ variant = 'single', sidebar, header, sidebarWidth = 280, className = '', style, children, ...props }: PropsWithChildren<PageLayoutProps>) {
  const layoutStyle = { '--hf-layout-sidebar': `${sidebarWidth}px`, ...style } as CSSProperties;
  return <div className={`hf-page-layout hf-page-layout--${variant} ${className}`.trim()} style={layoutStyle} {...props}>{header && <header className="hf-page-layout__header">{header}</header>}{sidebar && <aside className="hf-page-layout__sidebar">{sidebar}</aside>}<main className="hf-page-layout__main">{children}</main></div>;
}
