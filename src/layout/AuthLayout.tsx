import type { CSSProperties, ReactNode } from 'react';

export interface AuthLayoutProps {
  children: ReactNode;
  brand?: ReactNode;
  aside?: ReactNode;
  footer?: ReactNode;
  variant?: 'split' | 'card' | 'immersive' | 'step';
  backgroundImage?: string;
  currentStep?: number;
  steps?: number;
}

export function AuthLayout({ children, brand, aside, footer, variant = 'card', backgroundImage, currentStep = 1, steps = 1 }: AuthLayoutProps) {
  const style = backgroundImage ? { '--hf-auth-image': `url("${backgroundImage}")` } as CSSProperties : undefined;
  return <section className={`hf-auth hf-auth--${variant}`} style={style}>
    {brand && <header className="hf-auth__brand">{brand}</header>}
    {aside && <aside className="hf-auth__aside">{aside}</aside>}
    <main className="hf-auth__main">
      {variant === 'step' && <div className="hf-auth__steps" aria-label={`第 ${currentStep} 步，共 ${steps} 步`}>{Array.from({ length: steps }, (_, index) => <span key={index} className={index < currentStep ? 'is-active' : ''} />)}</div>}
      <div className="hf-auth__card">{children}</div>
      {footer && <footer>{footer}</footer>}
    </main>
  </section>;
}
