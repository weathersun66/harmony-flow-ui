import { Select } from '../../src/forms/Select';
import { searchCatalog } from './catalog/catalog';
import { resources } from './resources';
import { RouteLink, updateFilters, useRoute } from './routing';

export function SearchResults() {
  const route = useRoute();
  const query = (route.searchParams.get('q') ?? '').slice(0, 200);
  const type = route.searchParams.get('type') ?? '';
  const components = searchCatalog(query).map(item => ({ id: item.id, title: item.name, description: item.description, type: '组件', url: `/components/${item.id}` }));
  const others = resources.filter(item => `${item.title} ${item.description} ${item.keywords}`.toLowerCase().includes(query.toLowerCase()));
  const results = [...components, ...others].filter(item => !type || item.type === type);
  const pages = Math.max(1, Math.ceil(results.length / 24));
  const page = Math.max(1, Math.min(pages, Math.floor(Number(route.searchParams.get('page'))) || 1));
  return <section><div className="ws-page-heading"><div><p className="ws-eyebrow">SEARCH WORKSPACE</p><h1>搜索工作区</h1><p>跨组件、组合、模板和设计资源查找。</p></div></div><div className="ws-toolbar"><label className="ws-search-field"><input aria-label="搜索全部资源" value={query} maxLength={200} onChange={event => updateFilters({ q: event.target.value }, true)} /></label><Select aria-label="资源类型" value={type} onChange={event => updateFilters({ type: event.target.value })} options={[{value: '', label: '全部类型'}, ...['组件', '组合模式', '页面模板', '文档', '设计', 'Token', '图标'].map(value => ({value, label: value}))]} /></div><p className="ws-results-bar" role="status">{results.length} 条结果</p><div className="ws-list">{results.slice((page - 1) * 24, page * 24).map(item => <RouteLink className="ws-search-result" key={`${item.type}-${item.id}`} href={item.url}><span><strong>{item.title}</strong><p>{item.description}</p></span><small>{item.type} →</small></RouteLink>)}</div>{!results.length && <p className="ws-empty">没有匹配结果，请调整关键词或资源类型。</p>}<nav className="ws-pagination" aria-label="搜索结果分页"><span>{page}/{pages}</span><button disabled={page === 1} onClick={() => updateFilters({ page: String(page - 1) })}>上一页</button><button disabled={page === pages} onClick={() => updateFilters({ page: String(page + 1) })}>下一页</button></nav></section>;
}
