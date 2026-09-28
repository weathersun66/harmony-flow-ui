import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { catalog } from './catalog/catalog';
import { getCachedDoc, loadDoc } from './docs';

function prefetchDocument(href: string) {
  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) return;
  const match = /^\/components\/([^/]+)(?:\/playground)?\/?$/.exec(url.pathname);
  const item = match && catalog.find(record => record.id === match[1]);
  if (!item || getCachedDoc(item)) return;
  void loadDoc(item).catch(error => {
    console.warn('组件文档预取失败，打开页面时重试', { step: 'prefetch-document', component: item.id, error });
  });
}

const eventName = 'hf:route';
const snapshot = () => window.location.pathname + window.location.search + window.location.hash;
const subscribe = (listener: () => void) => {
  window.addEventListener('popstate', listener);
  window.addEventListener(eventName, listener);
  return () => { window.removeEventListener('popstate', listener); window.removeEventListener(eventName, listener); };
};
export function navigate(url: string, replace = false) {
  prefetchDocument(url);
  window.history.replaceState({ ...window.history.state, scroll: window.scrollY }, '');
  window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
  window.dispatchEvent(new Event(eventName));
  if (!replace) window.scrollTo(0, 0);
}
export function useRoute() {
  const route = useSyncExternalStore(subscribe, snapshot);
  return new URL(route, window.location.origin);
}
export function updateFilters(patch: Record<string, string | null>, replace = false) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(patch)) value ? url.searchParams.set(key, value) : url.searchParams.delete(key);
  if (!('page' in patch)) url.searchParams.delete('page');
  navigate(url.pathname + url.search, replace);
}
export function RouteLink({ href = '/', onClick, onMouseEnter, onFocus, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  function click(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 || props.target || !href.startsWith('/')) return;
    event.preventDefault();
    navigate(href);
  }
  return <a {...props} href={href} onClick={click}
    onMouseEnter={event => { onMouseEnter?.(event); if (!event.defaultPrevented && !props.target) prefetchDocument(href); }}
    onFocus={event => { onFocus?.(event); if (!event.defaultPrevented && !props.target) prefetchDocument(href); }} />;
}
