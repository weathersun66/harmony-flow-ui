import { liquidPreset } from './liquid/presets';
import { useEffect, useRef, type RefObject } from 'react';
import type { MaterialMode } from './assessment';
import { attachRefraction } from './liquid/renderer';
import { attachInteraction } from './liquid/interaction';
import { liquidActionSelector, materialElements } from './action-surfaces';

export function useSurfaceScope(root: RefObject<HTMLDivElement | null>, selector: string, mode: MaterialMode, owner: string) {
  const surfaces = useRef(new Set<HTMLElement>());
  useEffect(() => {
    const host = root.current;
    if (!host || !selector || mode === 'original') return;
    const owned = surfaces.current;
    const portalStyles = new Map<HTMLElement, Map<string, string>>();
    const theme = host.closest('.hf-theme');
    const cleanups = new Map<HTMLElement, () => void>();
    const backdrops = new Set<HTMLElement>();
    const chromium = /(?:Chrome|Chromium)\//.test(navigator.userAgent) && CSS.supports('backdrop-filter', 'url("#probe")');
    const mark = (node: ParentNode) => {
      const elements = materialElements(node, selector, mode === 'liquid');
      for (const element of elements) {
        if (mode === 'liquid' && host.contains(element) && element.matches(selector)) {
          for (let parent = element.parentElement; parent && parent !== host; parent = parent.parentElement) {
            // 导航遮罩承载关闭交互与背景压暗，不能作为装饰底板清空。
            if (parent.matches(selector) || parent.matches('.hf-mobile-nav__backdrop')) continue;
            parent.dataset.hfLiquidBackdrop = '';
            backdrops.add(parent);
          }
        }
        if (!host.contains(element)) {
          const previous = portalStyles.get(element) ?? new Map<string, string>();
          const tokens = getComputedStyle(host);
          for (const key of ['primary', 'surface', 'text', 'text-muted', 'border', 'background']) {
            const property = `--hf-color-${key}`;
            if (!previous.has(property)) previous.set(property, element.style.getPropertyValue(property));
            element.style.setProperty(property, tokens.getPropertyValue(property));
          }
          portalStyles.set(element, previous);
          element.dataset.hfMaterialContrast = String(theme?.classList.contains('hf-theme--high-contrast'));
          element.dataset.hfMaterialTheme = theme?.classList.contains('hf-theme--dark') ? 'dark' : 'light';
        }
        if (!owned.has(element) && mode === 'liquid') {
          if (element.matches(liquidActionSelector)) element.dataset.hfLiquidAction = '';
          element.dataset.hfLiquidPreset = liquidPreset(element);
          let renderer: ReturnType<typeof attachRefraction> | undefined;
          try { if (chromium) renderer = attachRefraction(element); }
          catch (error) { console.warn('液态折射初始化失败，使用兼容材质', error); }
          const disposeInteraction = attachInteraction(element, pressed => renderer?.press(pressed));
          cleanups.set(element, () => { disposeInteraction(); renderer?.dispose(); });
        }
        element.dataset.hfMaterial = mode;
        owned.add(element);
      }
    };
    mark(host);
    const scan = () => {
      for (const element of backdrops) if (!host.contains(element)) {
        delete element.dataset.hfLiquidBackdrop;
        backdrops.delete(element);
      }
      for (const element of owned) if (!element.isConnected) {
        cleanups.get(element)?.(); cleanups.delete(element); owned.delete(element); portalStyles.delete(element);
      }
      mark(host);
      for (const panel of document.querySelectorAll<HTMLElement>('[data-hf-overlay-owner]')) {
        if (panel.dataset.hfOverlayOwner === owner) mark(panel);
      }
      // 只处理预览触发器明确关联的浮层，不依赖时间窗口猜测归属。
      for (const trigger of host.querySelectorAll('[aria-controls],[aria-describedby]')) {
        const ids = `${trigger.getAttribute('aria-controls') || ''} ${trigger.getAttribute('aria-describedby') || ''}`;
        for (const id of ids.split(/\s+/).filter(Boolean)) {
          const panel = document.getElementById(id);
          if (panel && !host.contains(panel)) mark(panel);
        }
      }
    };
    const local = new MutationObserver(scan);
    local.observe(host, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-controls', 'aria-describedby'] });
    const portals = new MutationObserver(scan);
    portals.observe(document.body, { childList: true });
    const themeObserver = new MutationObserver(scan);
    if (theme) themeObserver.observe(theme, { attributes: true, attributeFilter: ['class', 'style'] });
    scan();
    return () => {
      local.disconnect(); portals.disconnect(); themeObserver.disconnect();
      for (const dispose of cleanups.values()) dispose();
      cleanups.clear();
      for (const element of backdrops) delete element.dataset.hfLiquidBackdrop;
      backdrops.clear();
      for (const element of owned) {
        delete element.dataset.hfLiquidPreset; delete element.dataset.hfMaterial; delete element.dataset.hfMaterialContrast; delete element.dataset.hfMaterialTheme;
        delete element.dataset.hfLiquidAction;
        if (portalStyles.has(element)) {
          for (const [property, previous] of portalStyles.get(element)!) {
            if (previous) element.style.setProperty(property, previous);
            else element.style.removeProperty(property);
          }
        }
      }
      owned.clear();
    };
  }, [root, selector, mode, owner]);
  return surfaces;
}
