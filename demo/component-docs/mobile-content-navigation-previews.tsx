import { useState } from 'react';
import { BottomNavigation, MobileContentNavigation, PullToRefresh, type NavigationItem } from '../workspace/InspectableLibrary';

const items: NavigationItem[] = [{ key: 'feed', label: '动态', icon: '◫' }, { key: 'tasks', label: '任务', icon: '✓' }, { key: 'profile', label: '我的', icon: '○' }];
const cards = <div className="mobile-content-cards"><strong>今日概览</strong><p>下拉内容区域可刷新，底部入口保持在安全区之上。</p><button type="button">内容操作</button></div>;

export function BottomNavigationPreview() {
  const [active, setActive] = useState('feed');
  return <div className="mobile-content-scene" data-doc-preview="bottomnavigation"><div className="mobile-content-placeholder">当前：{active}</div><BottomNavigation items={items} activeKey={active} onItemSelect={(item) => setActive(item.key)} /></div>;
}

export function PullToRefreshPreview() {
  const [count, setCount] = useState(0);
  return <div className="mobile-content-scene" data-doc-preview="pulltorefresh"><PullToRefresh onRefresh={() => setCount((value) => value + 1)}>{cards}<p role="status">已刷新 {count} 次</p></PullToRefresh></div>;
}

export function MobileContentNavigationPreview() {
  const [active, setActive] = useState('feed');
  const [count, setCount] = useState(0);
  return <div className="mobile-content-scene" data-doc-preview="mobilecontentnavigation"><MobileContentNavigation items={items} activeKey={active} onItemSelect={(item) => setActive(item.key)} onRefresh={() => setCount((value) => value + 1)}>{cards}<p role="status">{active} · 刷新 {count} 次</p></MobileContentNavigation></div>;
}
