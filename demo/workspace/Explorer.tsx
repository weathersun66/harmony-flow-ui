import { Select } from '../../src/forms/Select';
import { catalog, categories, categoryTitle, componentUrl, importCode, searchCatalog, type CatalogItem } from './catalog/catalog';
import { RouteLink, updateFilters, useRoute } from './routing';
import { personal, usePersonal } from './personal';
import { CopyButton } from './Primitives';
import { VisiblePreview } from './docs';
import { assessMaterial } from './effects/assessment';

function ItemActions({ item }: { item: CatalogItem }) {
  const state = usePersonal();
  return <>
    <button className="ws-icon-button" aria-label={`${state.favorites.includes(item.id) ? '取消收藏' : '收藏'} ${item.name}`} aria-pressed={state.favorites.includes(item.id)} onClick={() => personal.toggle(item.id)}>{state.favorites.includes(item.id) ? '★' : '☆'}</button>
    <details className="ws-more"><summary aria-label={`${item.name} 更多操作`}>⋯</summary><div>
      <CopyButton value={importCode(item)} label="复制 Import" />
      <CopyButton value={item.name} label="复制名称" />
      <RouteLink href={componentUrl(item)}>打开文档</RouteLink>
      <RouteLink href={`${componentUrl(item)}/playground`}>打开 Playground</RouteLink>
      <RouteLink href={`/source/${item.id}`}>查看示例源码</RouteLink>
    </div></details>
  </>;
}
export function Explorer() {
  const route = useRoute();
  const p = route.searchParams;
  const state = usePersonal();
  const category = categories.some(c => c.id === p.get('category')) ? p.get('category') ?? '' : '';
  const query = (p.get('q') ?? '').slice(0, 200);
  const collection = p.get('collection');
  const list = p.get('view') === 'list';
  const material = p.get('material');
  const base = catalog.filter(item => (!category || item.category === category)
    && (collection !== 'favorites' || state.favorites.includes(item.id))
    && (collection !== 'recent' || state.recents.some(r => r.id === item.id))
    && (!p.get('group') || item.subgroup === p.get('group'))
    && (!p.get('letter') || item.name.startsWith(p.get('letter')!))
    && (material !== 'liquid' || assessMaterial(item.name).liquid)
    && (material !== 'particle' || assessMaterial(item.name).particle));
  const results = searchCatalog(query, base);
  if (p.get('sort') === 'name' || !query) results.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  if (!query && collection === 'favorites') results.sort((a, b) => state.favorites.indexOf(a.id) - state.favorites.indexOf(b.id));
  if (!query && collection === 'recent') results.sort((a, b) => state.recents.findIndex(r => r.id === a.id) - state.recents.findIndex(r => r.id === b.id));
  const size = p.get('size') === '48' ? 48 : 24;
  const pages = Math.max(1, Math.ceil(results.length / size));
  const page = Math.max(1, Math.min(pages, Math.floor(Number(p.get('page'))) || 1));
  const items = results.slice((page - 1) * size, page * size);
  const groups = category && !query && !collection ? [...new Set(items.map(item => item.subgroup))] : [''];
  const title = collection === 'favorites' ? '收藏组件' : collection === 'recent' ? '最近访问' : categoryTitle(category);
  return <section className="ws-explorer" id="component-docs">
    <div className="ws-page-heading"><div><p className="ws-eyebrow">COMPONENT EXPLORER</p><h1>{title}<span>{results.length}</span></h1><p>浏览真实组件，找到适合当前任务的交互与实现。</p></div><span className="ws-version-label">React · TypeScript</span></div>
    {!collection && !category && !query && state.recents.length > 0 && <div className="ws-recent-strip"><span>继续浏览</span>{state.recents.slice(0, 5).map(r => <RouteLink key={r.id} href={`/components/${r.id}`}>{catalog.find(item => item.id === r.id)?.name}</RouteLink>)}</div>}
    <div className="ws-toolbar">
      <label className="ws-search-field"><span aria-hidden="true">⌕</span><input aria-label="搜索组件" placeholder="搜索名称、用途或关键词…" maxLength={200} value={query} onChange={event => updateFilters({ q: event.target.value }, true)} />{query && <button aria-label="清空搜索" onClick={() => updateFilters({ q: null }, true)}>×</button>}</label>
      <div className="ws-view-switch" role="group" aria-label="显示方式"><button aria-pressed={!list} onClick={() => updateFilters({ view: 'grid' })}>▦ 网格</button><button aria-pressed={list} onClick={() => updateFilters({ view: 'list' })}>☷ 列表</button></div>
      <Select aria-label="排序" value={p.get('sort') ?? (query ? 'relevance' : 'name')} onChange={event => updateFilters({ sort: event.target.value })} options={[{value: 'name', label: '名称 A–Z'}, {value: 'relevance', label: '相关度'}]} />
      <Select aria-label="特效适配" value={material ?? ''} onChange={event => updateFilters({ material: event.target.value || null })} options={[{ value: '', label: '全部组件态' }, { value: 'liquid', label: '可展示液态' }, { value: 'particle', label: '可展示粒子态' }]} />
      <details className="ws-filter"><summary>筛选</summary><div>
        <div className="ws-inline-field">首字母<Select aria-label="首字母" value={p.get('letter') ?? ''} onChange={event => updateFilters({ letter: event.target.value })} options={[{value: '', label: '全部'}, ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => ({value: letter, label: letter, disabled: !catalog.some(item => item.name.startsWith(letter))}))]} /></div>
        {category && <div className="ws-inline-field">分组<Select aria-label="分组" value={p.get('group') ?? ''} onChange={event => updateFilters({ group: event.target.value })} options={[{value: '', label: '全部'}, ...[...new Set(catalog.filter(item => item.category === category).map(item => item.subgroup))].map(group => ({value: group, label: group}))]} /></div>}
      </div></details>
    </div>
    <div className="ws-results-bar"><span role="status">{results.length} 个组件{query && ` · “${query}”`}{p.get('letter') && ` · ${p.get('letter')}`}{p.get('group') && ` · ${p.get('group')}`}</span>{collection === 'recent' && <button onClick={() => personal.clear()}>清空最近访问</button>}{(query || p.get('letter') || p.get('group')) && <button onClick={() => updateFilters({ q: null, letter: null, group: null })}>重置筛选</button>}</div>
    {groups.map(group => <section key={group} className="ws-result-group">{group && <h2>{group}</h2>}<div className={list ? 'ws-list' : 'ws-grid'}>
      {items.filter(item => !group || item.subgroup === group).map(item => <article className={list ? 'ws-list-row' : 'ws-card'} key={item.id} data-component={item.id}>
        {!list && <VisiblePreview item={item} enabled={items.indexOf(item) < 12} />}
        <div className="ws-card-info"><div><RouteLink className="ws-component-name" href={componentUrl(item)}>{item.name}</RouteLink><p>{item.title}</p></div><ItemActions item={item} /></div>
        <div className="ws-card-footer"><span>{categoryTitle(item.category)}</span><RouteLink href={`${componentUrl(item)}/playground${material === 'liquid' || material === 'particle' ? `?material=${material}` : ''}`}>{material === 'liquid' ? '液态展示' : material === 'particle' ? '粒子态展示' : '交互预览'} ↗</RouteLink>{collection === 'recent' && <button onClick={() => personal.removeRecent(item.id)}>移除</button>}</div>
      </article>)}
    </div></section>)}
    {results.length === 0 && <div className="ws-empty"><h2>{collection === 'favorites' ? '还没有收藏组件' : collection === 'recent' ? '还没有访问记录' : '没有匹配的组件'}</h2><p>试试中文用途、英文名称，或浏览全部组件。</p><RouteLink className="ws-button" href="/components">浏览全部组件</RouteLink></div>}
    {results.length > 0 && <nav className="ws-pagination" aria-label="结果分页"><div className="ws-inline-field">每页<Select aria-label="每页数量" value={size} onChange={event => updateFilters({ size: event.target.value })} options={[{value: '24', label: '24'}, {value: '48', label: '48'}]} /></div><span>{page} / {pages}</span><button disabled={page <= 1} onClick={() => updateFilters({ page: String(page - 1) })}>上一页</button><button disabled={page >= pages} onClick={() => updateFilters({ page: String(page + 1) })}>下一页</button></nav>}
  </section>;
}
