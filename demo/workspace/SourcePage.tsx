import { useEffect, useState } from 'react';
import { catalog } from './catalog/catalog';
import { CopyButton } from './Primitives';
import { RouteLink } from './routing';

export function SourcePage({ id }: { id: string }) {
  const item = catalog.find(item => item.id === id);
  const [source, setSource] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (!item) return;
    const controller = new AbortController();
    fetch(`/sources/${item.id}.txt`, { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error('源码加载失败');
      return response.text();
    }).then(setSource).catch(error => { if (error.name !== 'AbortError') setError('源码加载失败，请刷新重试。'); });
    return () => controller.abort();
  }, [item]);
  if (!item) return <p>未找到源码。</p>;
  return <section className="ws-reading"><RouteLink href={`/components/${item.id}`}>← 返回 {item.name}</RouteLink><h1>示例源码</h1><p>{item.source} · 当前构建快照</p>{error && <p role="alert">{error}</p>}{source ? <><CopyButton value={source} /><pre><code>{source}</code></pre></> : !error && <p role="status">正在加载…</p>}</section>;
}
