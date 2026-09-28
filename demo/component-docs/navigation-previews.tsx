import { Brand } from '../Brand';
import { useState, type ReactNode } from "react";
import {
  Breadcrumb,
  Button,
  ConversationBranch,
  DropdownMenu,
  FloatingNav,
  MegaMenu,
  MobileNavigation,
  Scrollspy,
  Sidebar,
  type NavigationItem,
} from '../workspace/InspectableLibrary';

const items: NavigationItem[] = [
  {
    key: "overview",
    label: "概览",
    icon: "⌂",
    description: "项目状态与关键指标",
  },
  {
    key: "runs",
    label: "运行记录",
    icon: "↻",
    description: "查看自动化执行历史",
  },
  {
    key: "settings",
    label: "设置",
    icon: "⚙",
    description: "成员、权限与集成",
  },
];

function NavScene({
  slug,
  title,
  children,
  result,
}: {
  slug: string;
  title: string;
  children: ReactNode;
  result: string;
}) {
  return (
    <div className="nav-doc-scene" data-doc-preview={slug}>
      <header>
        <span>NAVIGATION MAP</span>
        <strong>{title}</strong>
      </header>
      <div className="nav-doc-scene__canvas">{children}</div>
      <div className="nav-doc-scene__result" role="status">
        {result}
      </div>
    </div>
  );
}

export function BreadcrumbPreview() {
  const [result, setResult] = useState("当前位置：发布设置");
  const crumbs = [
    { key: "home", label: "工作台" },
    { key: "project", label: "组件项目" },
    { key: "release", label: "发布设置" },
  ];
  return (
    <NavScene slug="breadcrumb" title="当前位置" result={result}>
      <Breadcrumb
        items={crumbs}
        separator="›"
        onItemSelect={(item) => setResult(`返回：${item.label}`)}
      />
    </NavScene>
  );
}

export function DropdownMenuPreview() {
  const [active, setActive] = useState("overview");
  return (
    <NavScene slug="dropdownmenu" title="项目菜单" result={`当前：${active}`}>
      <DropdownMenu
        label="切换页面"
        items={items}
        activeKey={active}
        onItemSelect={(item) => setActive(item.key)}
      />
    </NavScene>
  );
}

export function FloatingNavPreview() {
  const [active, setActive] = useState("overview");
  return (
    <NavScene slug="floatingnav" title="悬浮主导航" result={`页面：${active}`}>
      <FloatingNav
        brand={<Brand label="Harmony" />}
        items={items}
        activeKey={active}
        action={<Button size="sm">新建</Button>}
        onItemSelect={(item) => setActive(item.key)}
      />
    </NavScene>
  );
}

export function MegaMenuPreview() {
  const [result, setResult] = useState("等待选择模块");
  const groups = [
    { key: "build", label: "构建", children: items.slice(0, 2) },
    { key: "manage", label: "管理", children: items.slice(2) },
  ];
  return (
    <NavScene slug="megamenu" title="产品能力地图" result={result}>
      <MegaMenu
        label="所有产品"
        items={groups}
        onItemSelect={(item) => setResult(`打开：${item.label}`)}
      />
    </NavScene>
  );
}

export function MobileNavigationPreview() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("overview");
  return (
    <NavScene
      slug="mobilenavigation"
      title="移动端入口"
      result={open ? "导航已展开" : `当前：${active}`}
    >
      <MobileNavigation
        brand={<Brand label="Harmony" />}
        items={items}
        open={open}
        activeKey={active}
        onOpenChange={setOpen}
        onItemSelect={(item) => setActive(item.key)}
      />
    </NavScene>
  );
}

export function ScrollspyPreview() {
  const [active, setActive] = useState("overview");
  return (
    <NavScene slug="scrollspy" title="页内章节" result={`章节：${active}`}>
      <Scrollspy
        items={items}
        activeKey={active}
        onItemSelect={(item) => setActive(item.key)}
      />
    </NavScene>
  );
}

export { ShrinkNavPreview } from './shrink-nav-preview';

export function SidebarPreview() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("overview");
  return (
    <NavScene
      slug="sidebar"
      title="工作区侧栏"
      result={`${collapsed ? "已折叠" : "已展开"} · ${active}`}
    >
      <Sidebar
        brand={<Brand label="HF Studio" />}
        items={items}
        collapsed={collapsed}
        activeKey={active}
        appearance="inset"
        onCollapsedChange={setCollapsed}
        onItemSelect={(item) => setActive(item.key)}
      />
    </NavScene>
  );
}

export function ConversationBranchPreview() {
  const [current, setCurrent] = useState(1);
  return (
    <NavScene
      slug="conversationbranch"
      title="回答分支"
      result={`正在查看第 ${current + 1} 个回答`}
    >
      <ConversationBranch current={current} total={4} onChange={setCurrent} />
    </NavScene>
  );
}
