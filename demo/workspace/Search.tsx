import { useMemo, useState } from 'react';
import { searchCatalog } from './catalog/catalog';
import { Dialog } from './Primitives';
import { navigate } from './routing';
import { usePersonal } from './personal';
import { resources } from './resources';

export function Search({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [composing, setComposing] = useState(false);
  const personal = usePersonal();
  const results = useMemo(() => {
    const components = searchCatalog(query).filter(item => query || personal.recents.some(r => r.id === item.id)).slice(0, 10)
      .map(item => ({ id: item.id, title: item.name, description: item.title, type: '组件', url: `/components/${item.id}` }));
    const rest = resources.filter(item => !query || `${item.title} ${item.description} ${item.keywords}`.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
    return [...components, ...rest];
  }, [query, personal.recents]);
  function open(index: number) {
    const item = results[index];
    if (item) { onClose(); navigate(item.url); }
  }
  return <Dialog title="搜索工作区" onClose={onClose}>
    <div className="ws-command-input"><span aria-hidden="true">⌕</span><input autoFocus aria-label="全局搜索" role="combobox" aria-expanded="true" aria-controls="workspace-search-results" aria-activedescendant={results[active] ? `search-result-${active}` : undefined} placeholder="组件、组合模式、模板、设计资源…" value={query} maxLength={200}
      onCompositionStart={() => setComposing(true)} onCompositionEnd={() => setComposing(false)}
      onChange={event => { setQuery(event.target.value); setActive(0); }}
      onKeyDown={event => {
        if (composing || event.nativeEvent.isComposing) return;
        if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
          event.preventDefault();
          const next = (active + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % Math.max(1, results.length);
          setActive(next); document.getElementById(`search-result-${next}`)?.scrollIntoView({ block: 'nearest' });
        }
        if (event.key === 'Enter') { event.preventDefault(); open(active); }
      }} /></div>
    <div className="ws-command-results" id="workspace-search-results" role="listbox" aria-label="搜索结果">
      {results.map((result, index) => <div id={`search-result-${index}`} key={`${result.type}-${result.id}`} role="option" aria-selected={index === active} onMouseMove={() => setActive(index)} onMouseDown={event => event.preventDefault()} onClick={() => open(index)}><span><strong>{result.title}</strong><small>{result.description}</small></span><span className="ws-badge">{result.type}</span></div>)}
      {!results.length && <p className="ws-empty">没有匹配结果，试试“弹窗”“上传”或英文名称。</p>}
    </div><footer className="ws-command-footer"><span role="status">{results.length} 条结果 · ↑↓ 选择 · Enter 打开</span><button onClick={() => { onClose(); navigate(`/search?q=${encodeURIComponent(query)}`); }}>查看全部结果 →</button></footer>
  </Dialog>;
}
