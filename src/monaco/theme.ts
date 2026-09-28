import type { Runtime } from './loadRuntime';

/** Monaco's theme service is shared: all enhanced editors follow the page theme. */
export function observeTheme(runtime: Runtime, host: HTMLElement) {
  const themeRoot = host.closest('.hf-theme') ?? document.documentElement;
  const apply = () => {
    const style = getComputedStyle(host);
    const color = (token: string, fallback: string) => {
      const value = style.getPropertyValue(token).trim();
      if (/^#[\da-f]{3,8}$/i.test(value)) return value;
      if (!value || !CSS.supports('color', value)) return fallback;
      const canvas = document.createElement('canvas').getContext('2d');
      if (!canvas) return fallback;
      canvas.fillStyle = value;
      canvas.fillRect(0, 0, 1, 1);
      return '#' + Array.from(canvas.getImageData(0, 0, 1, 1).data, channel => channel.toString(16).padStart(2, '0')).join('');
    };
    const highContrast = themeRoot.classList.contains('hf-theme--high-contrast');
    const dark = themeRoot.classList.contains('hf-theme--dark');
    runtime.monaco.editor.defineTheme('harmony-flow', {
      base: highContrast ? 'hc-light' : dark ? 'vs-dark' : 'vs', inherit: true, rules: [],
      colors: {
        'editor.background': color('--hf-color-surface', dark ? '#172235' : '#ffffff'),
        'editor.foreground': color('--hf-color-text', dark ? '#f2f6fc' : '#142033'),
        'editorLineNumber.foreground': color('--hf-color-text-muted', '#66758c'),
        'editorLineNumber.activeForeground': color('--hf-color-primary', '#0a7cff'),
        'editorCursor.foreground': color('--hf-color-primary', '#0a7cff'),
        'editorWidget.background': color('--hf-color-surface', '#ffffff'),
        'editorWidget.border': color('--hf-color-border', '#dce9f7'),
        'editorSuggestWidget.background': color('--hf-color-surface', '#ffffff'),
        'editorSuggestWidget.foreground': color('--hf-color-text', '#142033'),
        'focusBorder': color('--hf-color-primary', '#0a7cff'),
      },
    });
    runtime.monaco.editor.setTheme('harmony-flow');
  };
  apply();
  const observer = new MutationObserver(apply);
  for (let node: Element | null = themeRoot; node; node = node.parentElement) {
    observer.observe(node, { attributes: true, attributeFilter: ['class', 'style'] });
  }
  return () => observer.disconnect();
}
