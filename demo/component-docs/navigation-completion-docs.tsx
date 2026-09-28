import type { ComponentDoc } from './types';
import { BackToTopPreview, HierarchicalSidebarPreview, LongPageNavigationPreview } from './navigation-completion-previews';
import './navigation-completion-docs.css';

export const navigationCompletionDocs: readonly ComponentDoc[] = [
  {
    name: 'BackToTop', title: '返回顶部', category: '导航', description: '超过指定滚动距离后提供可访问的返回顶部操作，并尊重系统减少动态效果设置。',
    importCode: "import { BackToTop } from '@hxdhxd/harmony-flow-ui';", exampleCode: '<BackToTop target={scrollContainer} threshold={320} />', preview: <BackToTopPreview />,
    props: [{ name: 'target', type: 'HTMLElement | null', defaultValue: 'window', description: '滚动容器；null 时暂不启用' }, { name: 'threshold', type: 'number', defaultValue: '320', description: '按钮出现的滚动距离' }, { name: 'behavior', type: 'ScrollBehavior', defaultValue: 'smooth', description: '返回行为；减少动态效果时自动改为 auto' }, { name: 'onActivate', type: '() => void', defaultValue: '—', description: '用户触发返回后的通知' }],
    keyboard: '按钮可用 Tab 聚焦并通过 Enter 或 Space 激活；不可见时从焦点顺序移除。', related: ['LongPageNavigation', 'ReadingProgress'],
  },
  {
    name: 'HierarchicalSidebar', title: '层级侧栏', category: '导航', description: '使用统一 NavigationItem 树呈现可展开的多级内容目录；非受控模式自动揭示当前节点路径。',
    importCode: "import { HierarchicalSidebar } from '@hxdhxd/harmony-flow-ui';", exampleCode: '<HierarchicalSidebar items={tree} activeKey={active} defaultExpandedKeys={["guide"]} />', preview: <HierarchicalSidebarPreview />,
    props: [{ name: 'items', type: 'readonly NavigationItem[]', defaultValue: '必填', description: '以 children 表达的导航树' }, { name: 'expandedKeys', type: 'readonly string[]', defaultValue: '内部状态', description: '受控展开分组' }, { name: 'defaultExpandedKeys', type: 'readonly string[]', defaultValue: '[]', description: '非受控初始展开分组' }, { name: 'onExpandedChange', type: '(keys: string[]) => void', defaultValue: '—', description: '展开集合变化通知' }],
    keyboard: '分组使用原生按钮，叶节点使用原生链接；Tab、Enter 与 Space 保持浏览器语义。', related: ['Sidebar', 'LongPageNavigation'],
  },
  {
    name: 'LongPageNavigation', title: '长页面导航', category: '导航', description: '组合阅读进度、章节定位和返回顶部，面向文档、报告与长表单页面。',
    importCode: "import { LongPageNavigation } from '@hxdhxd/harmony-flow-ui';", exampleCode: '<LongPageNavigation items={sections} target={article} />', preview: <LongPageNavigationPreview />,
    props: [{ name: 'items', type: 'readonly NavigationItem[]', defaultValue: '必填', description: '章节导航，可传层级数据并按阅读顺序展开' }, { name: 'target', type: 'HTMLElement | null', defaultValue: 'window', description: '被观察的滚动容器' }, { name: 'backToTopThreshold', type: 'number', defaultValue: '320', description: '返回顶部入口出现阈值' }, { name: 'showProgress', type: 'boolean', defaultValue: 'true', description: '是否显示阅读进度' }],
    keyboard: '章节链接和返回按钮均保留原生键盘行为；当前位置与进度通过 ARIA 属性公布。', related: ['Scrollspy', 'ReadingProgress', 'BackToTop'],
  },
];
