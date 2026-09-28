export type Runtime = typeof import('./runtime-entry');
const requests = new Map<string, Promise<Runtime>>();

export function withTimeout<T>(promise: Promise<T>, milliseconds = 20000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Monaco 资源或 Worker 加载超时')), milliseconds);
    promise.then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
  });
}

/** Assets are explicitly self-hosted. Never silently switch to a public CDN. */
export function loadRuntime(assetsUrl: string, retry: number): Promise<Runtime> {
  const base = new URL(assetsUrl.endsWith('/') ? assetsUrl : `${assetsUrl}/`, document.baseURI);
  if (base.origin !== location.origin) return Promise.reject(new Error('Monaco 资源必须与页面同源'));
  const key = base.href;
  const existing = requests.get(key);
  if (existing) return existing;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('runtime.css', base).href;
  const css = new Promise<void>((resolve, reject) => {
    link.onload = () => resolve();
    link.onerror = () => reject(new Error('Monaco 样式加载失败'));
    document.head.append(link);
  });
  const script = new URL('runtime.js', base);
  if (retry) script.searchParams.set('retry', String(retry));
  const request = withTimeout(Promise.all([import(script.href) as Promise<Runtime>, css]))
    .then(([runtime]) => runtime)
    .catch(error => { link.remove(); requests.delete(key); throw error; });
  requests.set(key, request);
  return request;
}

export function prefersLightEditor() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent));
}
