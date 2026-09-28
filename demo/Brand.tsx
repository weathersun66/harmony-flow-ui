import './brand.css';

export const brandLogoUrl = '/brand/icon-192-20260925.png';

export function BrandLogo({ className = '', decorative = false }: { className?: string; decorative?: boolean }) {
  return <img className={`site-brand-logo ${className}`.trim()} src={brandLogoUrl} alt={decorative ? '' : 'Harmony Flow'} width={36} height={36} decoding="async" />;
}

export function Brand({ label = 'Harmony Flow' }: { label?: string }) {
  return <span className="site-brand"><BrandLogo decorative /><strong>{label}</strong></span>;
}
