import type { CSSProperties } from 'react';

export interface ThemeTokens {
  colorPrimary: string;
  colorPrimaryHover: string;
  colorBackground: string;
  colorSurface: string;
  colorText: string;
  colorTextMuted: string;
  colorBorder: string;
  radiusControl?: string;
  radiusPanel?: string;
  radiusOverlay?: string;
  shadowPopover?: string;
  shadowModal?: string;
  /** @deprecated COMPAT: 兼容现有消费者；项目内引用清零并进入下一主版本后移除。请改用 radiusControl 或 radiusPanel。 */
  radiusMd: string;
  /** @deprecated COMPAT: 兼容现有消费者；项目内引用清零并进入下一主版本后移除。请改用 radiusPanel 或 radiusOverlay。 */
  radiusLg: string;
  /** @deprecated COMPAT: 兼容现有消费者；项目内引用清零并进入下一主版本后移除。请改用 shadowPopover 或 shadowModal。 */
  shadowElevated: string;
  motionDuration: string;
}

export const defaultTheme: ThemeTokens = {
  colorPrimary: '#0a7cff',
  colorPrimaryHover: '#006fe8',
  colorBackground: '#f5faff',
  colorSurface: '#ffffff',
  colorText: '#142033',
  colorTextMuted: '#66758c',
  colorBorder: '#dce9f7',
  radiusControl: '6px',
  radiusPanel: '8px',
  radiusOverlay: '10px',
  shadowPopover: '0 8px 24px rgba(41, 106, 168, 0.12)',
  shadowModal: '0 18px 48px rgba(41, 106, 168, 0.16)',
  radiusMd: '14px',
  radiusLg: '24px',
  shadowElevated: '0 18px 48px rgba(41, 106, 168, 0.16)',
  motionDuration: '180ms',
};
export const darkTheme: ThemeTokens = {
  ...defaultTheme,
  colorPrimary: '#58a9ff',
  colorPrimaryHover: '#7cbbff',
  colorBackground: '#0d1724',
  colorSurface: '#152337',
  colorText: '#f4f8fc',
  colorTextMuted: '#a9bad0',
  colorBorder: '#30445b',
  shadowPopover: '0 8px 24px rgba(0, 0, 0, 0.32)',
  shadowModal: '0 20px 54px rgba(0, 0, 0, 0.46)',
  shadowElevated: '0 20px 54px rgba(0, 0, 0, 0.46)',
};
export const highContrastTheme: ThemeTokens = {
  ...defaultTheme,
  colorPrimary: '#005fcc',
  colorPrimaryHover: '#004a9f',
  colorBackground: '#ffffff',
  colorSurface: '#ffffff',
  colorText: '#000000',
  colorTextMuted: '#303030',
  colorBorder: '#000000',
  shadowPopover: '0 0 0 2px #000000',
  shadowModal: '0 0 0 2px #000000',
  shadowElevated: '0 0 0 2px #000000',
  motionDuration: '0ms',
};

const tokenVariables: Record<keyof ThemeTokens, string> = {
  colorPrimary: '--hf-color-primary',
  colorPrimaryHover: '--hf-color-primary-hover',
  colorBackground: '--hf-color-background',
  colorSurface: '--hf-color-surface',
  colorText: '--hf-color-text',
  colorTextMuted: '--hf-color-text-muted',
  colorBorder: '--hf-color-border',
  radiusControl: '--hf-radius-control',
  radiusPanel: '--hf-radius-panel',
  radiusOverlay: '--hf-radius-overlay',
  shadowPopover: '--hf-shadow-popover',
  shadowModal: '--hf-shadow-modal',
  radiusMd: '--hf-radius-md',
  radiusLg: '--hf-radius-lg',
  shadowElevated: '--hf-shadow-elevated',
  motionDuration: '--hf-motion-duration',
};

export function tokensToStyle(tokens: Partial<ThemeTokens>): CSSProperties {
  return Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => [tokenVariables[key as keyof ThemeTokens], value]),
  ) as CSSProperties;
}
