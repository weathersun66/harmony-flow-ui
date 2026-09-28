import { Brand } from './Brand';
import { useState } from 'react';
import { Breadcrumb, Button, DropdownMenu, FloatingNav, MegaMenu, MobileNavigation, Scrollspy, Sidebar, type NavigationItem } from '../src';

const primaryItems: readonly NavigationItem[] = [
  { key: 'navigation', label: '概览', href: '#navigation' },
  { key: 'components', label: '组件', href: '#components' },
  { key: 'theme', label: '主题', href: '#theme' },
];

const sidebarItems: readonly NavigationItem[] = [
  { key: 'dashboard', label: '工作台', icon: '⌂' },
  { key: 'projects', label: '项目', icon: '◇' },
  { key: 'insights', label: '洞察', icon: '◌' },
  { key: 'settings', label: '设置', icon: '⚙' },
];

const menuItems: readonly NavigationItem[] = [
  { key: 'create', label: '新建项目' },
  { key: 'templates', label: '从模板开始' },
  { key: 'import', label: '导入文件' },
];

const megaItems: readonly NavigationItem[] = [
  { key: 'build', label: '构建', children: [
    { key: 'forms', label: '表单', icon: '⌁', description: '采集与验证数据' },
    { key: 'content', label: '内容', icon: '▤', description: '组织复杂信息' },
  ] },
  { key: 'navigate', label: '导航', children: [
    { key: 'menus', label: '菜单', icon: '☷', description: '连接产品空间' },
    { key: 'steps', label: '步骤', icon: '→', description: '表达任务进度' },
  ] },
  { key: 'respond', label: '反馈', children: [
    { key: 'dialogs', label: '弹窗', icon: '□', description: '聚焦关键决策' },
    { key: 'toasts', label: '轻提示', icon: '●', description: '确认操作结果' },
  ] },
];

export function NavigationShowcase() {
  const [sidebarActive, setSidebarActive] = useState('dashboard');
  const [selected, setSelected] = useState('尚未选择菜单项');
  const [mobileMode, setMobileMode] = useState<'drawer' | 'fullscreen'>('drawer');
  return (
    <section id="navigation" className="demo-section demo-navigation">
      <div className="demo-section__heading"><div><p className="demo-kicker">NAVIGATION SYSTEM</p><h2>从抵达，到找到。</h2></div><span>9 种导航 · 同一套语义</span></div>
      <div className="demo-nav-stack">
        <div className="demo-nav-example"><div className="demo-nav-example__label"><strong>悬浮吸顶</strong><span>Floating · Sticky</span></div><FloatingNav brand={<Brand label="HF Studio" />} items={primaryItems} activeKey="navigation" action={<Button size="sm">新建</Button>} /></div>
        <div className="demo-nav-columns">
          <div className="demo-nav-example"><div className="demo-nav-example__label"><strong>侧边栏</strong><span>Collapsible sidebar</span></div><div className="demo-sidebar-stage"><Sidebar brand={<Brand />} items={sidebarItems} activeKey={sidebarActive} onItemSelect={(item) => setSidebarActive(item.key)} /></div></div>
          <div className="demo-nav-example"><div className="demo-nav-example__label"><strong>层级路径</strong><span>Breadcrumb · Scrollspy</span></div><div className="demo-path-stage"><Breadcrumb items={[{ key: 'home', label: '首页' }, { key: 'library', label: '组件库' }, { key: 'nav', label: '导航' }]} /><Scrollspy items={primaryItems} /></div></div>
        </div>
        <div className="demo-nav-example"><div className="demo-nav-example__label"><strong>分层菜单</strong><span>Dropdown · Mega menu</span></div><div className="demo-menu-stage"><DropdownMenu label="创建" items={menuItems} onItemSelect={(item) => setSelected(item.label)} /><MegaMenu label="浏览全部组件" items={megaItems} onItemSelect={(item) => setSelected(item.label)} /><small>{selected}</small></div></div>
        <div className="demo-nav-columns">
          <div className="demo-nav-example"><div className="demo-nav-example__label"><strong>汉堡抽屉</strong><span>Hamburger · Drawer</span></div><MobileNavigation brand={<Brand />} items={primaryItems} mode="drawer" /></div>
          <div className="demo-nav-example"><div className="demo-nav-example__label"><strong>全屏导航</strong><span>Full-screen overlay</span></div><MobileNavigation brand={<Brand />} items={primaryItems.map((item) => ({ ...item, description: item.key === 'navigation' ? '产品全貌' : item.key === 'components' ? '可复用能力' : '视觉与品牌' }))} mode={mobileMode} /><Button className="demo-mode-toggle" variant="quiet" size="sm" onClick={() => setMobileMode((value) => value === 'drawer' ? 'fullscreen' : 'drawer')}>当前：{mobileMode === 'drawer' ? '抽屉' : '全屏'}，点击切换</Button></div>
        </div>
      </div>
    </section>
  );
}
