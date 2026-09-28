import { lazy, Suspense, useState } from 'react';
import type { ComponentDoc } from '../component-docs/types';
import type { CatalogItem } from './catalog/catalog';
import { loaders } from './catalog/loaders';
import { Boundary } from './Primitives';

// 按文档分组去重请求；成功结果可同步读取，避免热访问先渲染空状态。
const pending = new Map<string, Promise<readonly ComponentDoc[]>>();
const resolved = new Map<string, ComponentDoc>();
export function getCachedDoc(item: CatalogItem) { return resolved.get(item.name) ?? null; }
export function loadDoc(item: CatalogItem) {
  const cached = getCachedDoc(item);
  if (cached) return Promise.resolve(cached);
  if (!pending.has(item.docKey)) {
    const promise = loaders[item.docKey]!().then(docs => {
      for (const doc of docs) resolved.set(doc.name, doc);
      return docs;
    }).catch(error => { pending.delete(item.docKey); throw error; });
    pending.set(item.docKey, promise);
  }
  return pending.get(item.docKey)!.then(docs => {
    const doc = docs.find(doc => doc.name === item.name);
    if (!doc) throw new Error(`缺少文档：${item.name}`);
    return doc;
  });
}
const previews = new Map<string, ReturnType<typeof lazy>>();
function previewComponent(item: CatalogItem) {
  if (!previews.has(item.id)) previews.set(item.id, lazy(() => loadDoc(item).then(doc => ({ default: () => <>{doc.preview}</> }))));
  return previews.get(item.id)!;
}
export function Preview({ item, miniature = false }: { item: CatalogItem; miniature?: boolean }) {
  const Component = previewComponent(item);
  return <Boundary key={item.id}><Suspense fallback={<div className="ws-preview-loading" role="status">加载预览…</div>}><div className={miniature ? 'ws-miniature' : 'ws-live-preview'}><Component /></div></Suspense></Boundary>;
}
export function VisiblePreview({ item }: { item: CatalogItem; enabled?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <div className="ws-card-preview">
    {failed ? <div className="ws-preview-placeholder"><span>{item.title}</span><small>快照暂不可用，可打开交互预览</small></div> : <img src={`/previews/${item.id}.png`} alt={`${item.title} · 真实组件静态快照`} loading="lazy" decoding="async" width="640" height="240" onError={() => setFailed(true)} />}
  </div>;
}
