import { BrandLogo } from '../Brand';
import { Select } from '../../src/forms/Select';
import { lazy, Suspense, useEffect, useState } from 'react';
import { ThemeProvider } from '../../src/theme/ThemeProvider';
import { catalog, categories } from './catalog/catalog';
import { Explorer } from './Explorer';
import { RouteLink, navigate, useRoute } from './routing';
import { Search } from './Search';
import { Boundary, Dialog } from './Primitives';
import { usePersonal } from './personal';
import './workspace.css';
import './content.css';
import './typography.css';
import { SearchResults } from './SearchResults';
import { ComponentPage } from './ComponentPage';
import { Patterns } from './Patterns';
import { Overview, Templates, Design, Resources } from './ResourcePages';

const TemplatePreview = lazy(() => import('../TemplatePreview').then(m => ({ default: m.TemplatePreview })));
const SourcePage = lazy(() => import('./SourcePage').then(m => ({ default: m.SourcePage })));
const tabs = [['overview', '概览'], ['components', '组件'], ['patterns', '组合模式'], ['templates', '页面模板'], ['design', '设计'], ['resources', '资源']] as const;

export function Workspace() {
  const route = useRoute();
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mode, setMode] = useState<'light' | 'dark' | 'high-contrast'>('light');
  const personal = usePersonal();
  const segments = route.pathname.split('/').filter(Boolean);
  const section = segments[0] ?? 'components';
  const item = catalog.find(item => item.id === segments[1]);
  const category = item?.category ?? route.searchParams.get('category');
  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearch(value => !value); }
    }
    function restore() { window.requestAnimationFrame(() => window.scrollTo(0, window.history.state?.scroll ?? 0)); }
    window.addEventListener('keydown', keydown); window.addEventListener('popstate', restore);
    return () => { window.removeEventListener('keydown', keydown); window.removeEventListener('popstate', restore); };
  }, []);
  useEffect(() => {
    setMenu(false);
    document.title = `${item?.name ?? tabs.find(([id]) => id === section)?.[1] ?? '未找到页面'} · Harmony Flow`;
    if (route.pathname === '/products') navigate('/templates', true);
    if (route.pathname === '/' && route.hash === '#getting-started') navigate('/resources', true);
    if (route.pathname === '/' && route.hash === '#theme') navigate('/design', true);
  }, [route.pathname, route.hash, item, section]);
  const navigation = <nav aria-label="组件分类" className="ws-category-nav">
    <RouteLink className={!category && !route.searchParams.get('collection') ? 'is-active' : ''} href="/components"><span>▦ 全部组件</span><small>{catalog.length}</small></RouteLink>
    <RouteLink className={route.searchParams.get('collection') === 'favorites' ? 'is-active' : ''} href="/components?collection=favorites"><span>☆ 收藏</span><small>{personal.favorites.length}</small></RouteLink>
    <RouteLink className={route.searchParams.get('collection') === 'recent' ? 'is-active' : ''} href="/components?collection=recent"><span>◷ 最近访问</span></RouteLink>
    <div className="ws-nav-label">组件分类</div>{categories.map(c => <RouteLink aria-current={category === c.id ? 'page' : undefined} className={category === c.id ? 'is-active' : ''} href={`/components?category=${c.id}${route.searchParams.get('q') ? `&q=${encodeURIComponent(route.searchParams.get('q')!)}` : ''}`} key={c.id}><span><i aria-hidden="true">{c.icon}</i>{c.title}</span><small>{catalog.filter(item => item.category === c.id).length}</small></RouteLink>)}
    <div className="ws-nav-bottom"><span className="ws-status-dot" />当前工作区<span>{catalog.length} 个组件文档</span></div>
  </nav>;
  if (section === 'templates' && segments.length === 2 && ['dashboard', 'onboarding', 'insights'].includes(segments[1]!)) return <Boundary><Suspense fallback={<p>正在加载模板…</p>}><TemplatePreview slug={segments[1]!} /></Suspense></Boundary>;
  let page;
  if (section === 'components' && !segments[1]) page = <Explorer />;
  else if (section === 'components' && item && (segments.length === 2 || segments[2] === 'playground')) page = <ComponentPage key={item.id} item={item} standalone={segments[2] === 'playground'} />;
  else if (section === 'overview') page = <Overview />;
  else if (section === 'patterns') page = <Patterns key={segments[1]} slug={segments[1]} />;
  else if (section === 'templates' || section === 'products') page = <Templates slug={segments[1]} />;
  else if (section === 'design') page = <Design />;
  else if (section === 'resources') page = <Resources />;
  else if (section === 'search') page = <SearchResults />;
  else if (section === 'source') page = <SourcePage key={segments[1]} id={segments[1] ?? ''} />;
  else page = <div className="ws-empty"><h1>未找到页面</h1><RouteLink href="/components">返回组件浏览器</RouteLink></div>;
  return <ThemeProvider mode={mode}><div className="ws-app">
    <a className="ws-skip" href="#workspace-main">跳到主要内容</a>
    <header className="ws-topbar"><button className="ws-mobile-toggle ws-icon-button" aria-label="打开导航" onClick={() => setMenu(true)}>☰</button><RouteLink href="/overview" className="ws-brand"><BrandLogo decorative /><strong>Harmony Flow</strong></RouteLink><nav aria-label="产品导航" className="ws-product-nav">{tabs.map(([id, title]) => <RouteLink key={id} href={`/${id}`} aria-current={section === id ? 'page' : undefined}>{title}</RouteLink>)}</nav><div className="ws-topbar-tools"><button className="ws-search-trigger" onClick={() => setSearch(true)}><span>⌕ 搜索</span><kbd>Ctrl K</kbd></button><Select aria-label="界面主题" value={mode} onChange={event => setMode(event.target.value as typeof mode)} options={[{value: 'light', label: '浅色'}, {value: 'dark', label: '暗色'}, {value: 'high-contrast', label: '高对比'}]} /><a className="ws-github" href="https://github.com/weathersun66/harmony-flow-ui" target="_blank" rel="noreferrer">GitHub ↗</a></div></header>
    <div className={`ws-layout${section !== 'components' ? ' ws-layout--wide' : ''}`}>
      {section === 'components' && <aside className="ws-sidebar">{navigation}</aside>}
      <main id="workspace-main" tabIndex={-1}>{personal.warning && <p role="status" className="ws-storage-warning">{personal.warning}</p>}<Boundary key={route.pathname}><Suspense fallback={<div className="ws-empty" role="status">正在加载…</div>}>{page}</Suspense></Boundary></main>
    </div>
    {search && <Search onClose={() => setSearch(false)} />}
    {menu && <Dialog title="导航" onClose={() => setMenu(false)}><nav className="ws-mobile-products">{tabs.map(([id, title]) => <RouteLink onClick={() => setMenu(false)} key={id} href={`/${id}`}>{title}</RouteLink>)}</nav>{navigation}</Dialog>}
  </div></ThemeProvider>;
}
