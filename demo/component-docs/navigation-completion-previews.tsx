import { useState } from 'react';
import { BackToTop, HierarchicalSidebar, LongPageNavigation, type NavigationItem } from '../workspace/InspectableLibrary';

const hierarchy: NavigationItem[] = [
  { key: 'start', label: '开始使用', children: [{ key: 'install', label: '安装' }, { key: 'theme', label: '主题配置' }] },
  { key: 'patterns', label: '交互模式', children: [{ key: 'navigation', label: '导航' }, { key: 'feedback', label: '反馈' }] },
];

export function BackToTopPreview() {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  return <div className="nav-completion-scene" data-doc-preview="backtotop"><div ref={setTarget} className="nav-completion-scroll"><p>向下滚动查看按钮</p><div /><p>已到达内容底部</p></div><BackToTop target={target} threshold={32} /></div>;
}

export function HierarchicalSidebarPreview() {
  const [active, setActive] = useState('install');
  return <div className="nav-completion-scene" data-doc-preview="hierarchicalsidebar"><HierarchicalSidebar items={hierarchy} activeKey={active} defaultExpandedKeys={['start']} onItemSelect={(item) => setActive(item.key)} /><p role="status">当前章节：{active}</p></div>;
}

export function LongPageNavigationPreview() {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const [active, setActive] = useState('install');
  return <div className="nav-completion-scene nav-completion-scene--long" data-doc-preview="longpagenavigation"><div ref={setTarget} className="nav-completion-scroll">{hierarchy.flatMap((group) => group.children ?? []).map((item) => <section id={item.key} key={item.key}><strong>{item.label}</strong><p>用于演示长内容定位的章节。</p></section>)}</div><LongPageNavigation items={hierarchy.flatMap((group) => group.children ?? [])} target={target} activeKey={active} backToTopThreshold={32} onItemSelect={(item) => setActive(item.key)} /></div>;
}
