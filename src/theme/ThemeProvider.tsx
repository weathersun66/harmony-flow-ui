import type { HTMLAttributes, PropsWithChildren } from 'react';
import { darkTheme, defaultTheme, highContrastTheme, tokensToStyle, type ThemeTokens } from './tokens';

export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  tokens?: Partial<ThemeTokens>;
  mode?: 'light' | 'dark' | 'high-contrast';
}

export function ThemeProvider({ children, tokens, mode = 'light', className = '', style, ...props }: PropsWithChildren<ThemeProviderProps>) {
  const mergedTokens = { ...(mode === 'dark' ? darkTheme : mode === 'high-contrast' ? highContrastTheme : defaultTheme), ...tokens };
  return (
    <div
      className={`hf-theme hf-theme--${mode} ${className}`.trim()}
      style={{ ...tokensToStyle(mergedTokens), ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
