import { useRef, useState } from 'react';
import { LoadMore, InfiniteScroll, LazyLoad, Button } from '../../src';

export function ContentLoadingPreview({ infinite = false }: { infinite?: boolean }) {
  const [count, setCount] = useState(4);
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const fail = useRef(false);
  async function load(signal: AbortSignal) {
    await new Promise<void>((resolve, reject) => {
      const abort = () => { clearTimeout(timer); reject(new Error('cancelled')); };
      const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, 500);
      signal.addEventListener('abort', abort, { once: true });
    });
    if (signal.aborted) return;
    if (fail.current) { fail.current = false; throw new Error('demo failure'); }
    setCount(value => Math.min(12, value + 4));
  }
  const items = <ul>{Array.from({ length: count }, (_, i) => <li key={i} style={{ padding: 16 }}>阅读资料 {i + 1}</li>)}</ul>;
  return <div>
    <Button variant="outline" onClick={() => { fail.current = true; }}>模拟下次加载失败</Button>
    {infinite ? <div ref={setRoot} style={{ height: 260, overflowY: 'auto' }} tabIndex={0} aria-label="可滚动阅读资料">
      <InfiniteScroll root={root} hasMore={count < 12} onLoad={load}>{items}</InfiniteScroll>
    </div> : <>{items}<LoadMore hasMore={count < 12} onLoad={load} /></>}
  </div>;
}

export function LazyLoadPreview() {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  return <div ref={setRoot} style={{ height: 260, overflowY: 'auto' }} tabIndex={0} aria-label="懒加载阅读区">
    <p style={{ minHeight: 300 }}>向下滚动，查看延迟挂载的内容。</p>
    <LazyLoad root={root} placeholder={<p>内容将在进入阅读区后显示。</p>}>
      <article><h3>延迟挂载的资料</h3><p>离开阅读区后仍保留输入。</p><input aria-label="阅读笔记" placeholder="记录笔记" /></article>
    </LazyLoad>
  </div>;
}
