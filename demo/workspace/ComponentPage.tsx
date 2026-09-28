import { useEffect, useState } from 'react';
import type { ComponentDoc } from '../component-docs/types';
import { catalog, categoryTitle, importCode, type CatalogItem } from './catalog/catalog';
import { getCachedDoc, loadDoc } from './docs';
import { CopyButton } from './Primitives';
import { Playground } from './Playground';
import { RouteLink } from './routing';
import { personal, usePersonal } from './personal';
import { defaultTheme } from '../../src/theme/tokens';

const sections = [['overview', '概览'], ['preview', '交互预览'], ['usage', '使用方式'], ['states', '变体与状态'], ['api', 'API'], ['accessibility', '无障碍'], ['tokens', '设计 Tokens'], ['related', '相关组件']] as const;
export function ComponentPage({ item, standalone = false }: { item: CatalogItem; standalone?: boolean }) {
  const [doc, setDoc] = useState<ComponentDoc | null>(() => getCachedDoc(item));
  const [error, setError] = useState(false);
  const [active, setActive] = useState('overview');
  const state = usePersonal();
  useEffect(() => {
    let current = true;
    setDoc(getCachedDoc(item)); setError(false);
    loadDoc(item).then(result => { if (current) { setDoc(result); personal.visit(item.id); } }).catch(error => {
      console.error('组件文档加载失败', { step: 'load-document', component: item.id, error });
      if (current) setError(true);
    });
    return () => { current = false; };
  }, [item]);
  useEffect(() => {
    if (!doc) return;
    const observer = new IntersectionObserver(entries => {
      const entry = entries.find(entry => entry.isIntersecting);
      if (entry) setActive(entry.target.id);
    }, { rootMargin: '-80px 0px -65% 0px' });
    document.querySelectorAll('.ws-doc-section').forEach(element => observer.observe(element));
    if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    return () => observer.disconnect();
  }, [doc]);
  const outline = <nav aria-label="本页目录"><strong>本页目录</strong>{sections.map(([id, title]) => <a href={`#${id}`} key={id} aria-current={active === id ? 'location' : undefined}>{title}</a>)}</nav>;
  // 浏览器会记住失败的模块导入，重新加载文档可清除该状态并恢复当前 URL。
  if (error) return <div className="ws-empty" role="alert"><h1>文档加载失败</h1><button onClick={() => window.location.reload()}>重新加载</button></div>;
  if (!doc) return <div className="ws-empty" role="status">正在加载 {item.name} 文档…</div>;
  return <div className={`ws-document${standalone ? ' ws-document--playground' : ''}`} id="component-docs">
    <article className="ws-doc-body component-docs__detail">
      <nav className="ws-breadcrumb" aria-label="面包屑"><RouteLink href="/components">组件</RouteLink><span>/</span><RouteLink href={`/components?category=${item.category}`}>{categoryTitle(item.category)}</RouteLink><span>/</span><span>{item.name}</span></nav>
      <header id="overview" className="ws-doc-section ws-doc-header"><div><p className="ws-eyebrow">{item.subgroup}</p><h1>{item.name}<small>{item.title}</small></h1><p>{doc.description}</p></div><div className="ws-inline-actions"><button className="ws-button" aria-pressed={state.favorites.includes(item.id)} onClick={() => personal.toggle(item.id)}>{state.favorites.includes(item.id) ? '★ 已收藏' : '☆ 收藏'}</button><CopyButton label="复制 Import" value={importCode(item)} /><RouteLink className="ws-button" href={standalone ? `/components/${item.id}` : `/components/${item.id}/playground`}>{standalone ? '返回文档' : '打开 Playground ↗'}</RouteLink></div></header>
      <details className="ws-mobile-outline"><summary>本页目录</summary>{outline}</details>
      <section id="preview" className="ws-doc-section demo-renderer"><h2>{standalone ? 'Playground' : '交互预览'}</h2><Playground key={item.id} doc={doc} /></section>
      {!standalone && <>
        <section id="usage" className="ws-doc-section"><h2>使用方式</h2><p>{doc.description} 以下示例基于当前工作区 API；新增组件发布状态请查阅资源页。</p><pre><code>npm install @hxdhxd/harmony-flow-ui{'\n\n'}import '@hxdhxd/harmony-flow-ui/style.css';{'\n'}{doc.importCode}</code></pre><p>复杂组件的状态与操作可在预览中直接体验，属性以 API 表为准。</p></section>
        <section id="states" className="ws-doc-section"><h2>变体与状态</h2><p>以下状态来自当前文档 API。预览中的操作保持真实键盘和指针行为。</p><ul>{doc.props.filter(prop => /variant|size|disabled|loading|error|status|checked|selected|open|value|current/.test(prop.name)).map(prop => <li key={prop.name}><code>{prop.name}</code> — {prop.description}（{prop.type}）</li>)}</ul></section>
        <section id="api" className="ws-doc-section component-api"><h2>API</h2><div className="ws-table-scroll"><table><thead><tr><th>属性 / 回调</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>{doc.props.map(prop => <tr key={prop.name}><td><code>{prop.name}</code></td><td><code>{prop.type}</code></td><td>{prop.defaultValue}</td><td>{prop.description}</td></tr>)}</tbody></table></div></section>
        <section id="accessibility" className="ws-doc-section"><h2>无障碍</h2><p>{doc.keyboard}</p><p>请在真实业务中提供可访问名称，并验证键盘焦点、错误反馈与禁用状态。</p></section>
        <section id="tokens" className="ws-doc-section"><h2>设计 Tokens</h2><p>组件共享 ThemeProvider 语义主题，局部样式与支持范围以源码为准。</p><div className="ws-table-scroll"><table><thead><tr><th>全局语义 Token</th><th>默认值</th></tr></thead><tbody>{Object.entries(defaultTheme).filter(([key]) => ['colorPrimary', 'colorSurface', 'colorText', 'radiusControl', 'motionDuration'].includes(key)).map(([key, value]) => <tr key={key}><td><code>{key}</code></td><td>{value}</td></tr>)}</tbody></table></div></section>
        <section id="related" className="ws-doc-section"><h2>相关组件</h2><div className="ws-related">{doc.related.map(name => catalog.find(record => record.name === name)).filter(Boolean).map(record => <RouteLink className="ws-button" key={record!.id} href={`/components/${record!.id}`}>{record!.name} →</RouteLink>)}</div><RouteLink className="ws-source-link" href={`/source/${item.id}`}>查看当前示例源码 →</RouteLink></section>
      </>}
    </article>{!standalone && <aside className="ws-outline">{outline}</aside>}
  </div>;
}
