import type { ComponentDoc, ComponentPropDoc } from './types';
import { ChartCrosshairPreview, DrilldownChartPreview, HotspotGuidePreview } from './reading-previews';
import './reading-docs.css';

const prop = (name: string, type: string, defaultValue: string, description: string): ComponentPropDoc => ({ name, type, defaultValue, description });
export const readingDocs: readonly ComponentDoc[] = [
  {
    name: 'HotspotGuide', title: '热点提示', category: '反馈',
    description: '在功能入口旁展示可点击提示，原地展开说明并显式确认已读，不阻断页面操作。',
    importCode: "import { HotspotGuide } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<HotspotGuide title="新的筛选方式" unread={unread} onAcknowledge={() => setUnread(false)}>先选指标，再筛选月份。</HotspotGuide>',
    preview: <HotspotGuidePreview />,
    props: [
      prop('title / children', 'string / ReactNode', '必填 / 必填', '入口与提示标题 / 说明内容，可以包含操作'),
      prop('unread / onAcknowledge', 'boolean / () => void', 'true / —', '已读状态由调用方控制；明确点击知道了才请求确认，打开不自动标记已读'),
      prop('open / defaultOpen / onOpenChange', 'boolean / boolean / (open: boolean) => void', '— / false / —', '受控/非受控显示与变化请求；受控时需确认属性更新'),
      prop('disabled / className', 'boolean / string', 'false / —', '禁用且隐藏内容 / 根样式类'),
    ],
    keyboard: 'Enter/Space展开，Tab进入内容，Escape或外部点击关闭。关闭时焦点若仍在提示内则返回入口；不锁滚动、不圈定焦点。提示卡在文档流内展开，调用方应放在允许扩展的布局容器中。无自动动画，无持久化。',
    related: ['Popover', 'Tooltip', 'ProductTour'],
  },
  {
    name: 'ChartCrosshair', title: '图表逐点读数', category: '数据展示',
    description: '对离散单序列折线吸附最近数据点，横纵准线与标签读数同步更新。',
    importCode: "import { ChartCrosshair } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<ChartCrosshair points={points} selectedId={selectedId} onSelectedIdChange={setSelectedId} label="每周咨询量" />',
    preview: <ChartCrosshairPreview />,
    props: [
      prop('points', 'readonly CrosshairPoint[]', '必填', '唯一稳定id、label、value；value为有限数值或null，缺失/非有限值断开折线且显示暂无读数'),
      prop('selectedId / defaultSelectedId', 'string', '— / —', '受控/非受控选点；未指定或id失效时展示首点，不静默回调'),
      prop('onSelectedIdChange', '(id: string) => void', '—', '选择变化请求；鼠标吸附、触摸点选或键盘操作均可触发'),
      prop('label / formatValue', 'string / (value: number) => string', '逐点读数 / String', '区域标题 / 数值格式化，包括纵轴范围'),
      prop('disabled / className', 'boolean / string', 'false / —', '禁用所有选点方式 / 根样式类'),
    ],
    keyboard: 'Tab进入原生滑块，方向键逐点、Home/End跳到首末点；aria-valuetext包含标签与读数。触摸点选不拦截纵向滚动。选点在移出后保留，便于键盘和触摸对照。仅等距离散横轴、单序列；不插值、不缩放、不替代统计分析。数据更新需提供新数组。',
    related: ['RangeBrush', 'LegendFilter', 'Sparkline'],
  },
  {
    name: 'DrilldownChart', title: '层级数据下钻', category: '数据展示',
    description: '从当前层的条形数据进入明细，保留路径并支持返回上层或根层。',
    importCode: "import { DrilldownChart } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<DrilldownChart items={channels} path={path} onPathChange={setPath} title="渠道咨询量" />',
    preview: <DrilldownChartPreview />,
    props: [
      prop('items', 'readonly DrilldownItem[]', '必填', '同层唯一id、label、非负有限value，可选children及disabled；只显示当前层，不自动计算父级汇总'),
      prop('path / defaultPath / onPathChange', 'readonly string[] / readonly string[] / (path: string[]) => void', '— / [] / —', '受控/非受控节点路径；失效部分截断并提示，不自动写回受控路径'),
      prop('onLeafSelect', '(item: DrilldownItem, path: string[]) => void', '—', '叶子选择请求；未传入时叶子为只读行，不提供无效按钮'),
      prop('title / formatValue', 'string / (value: number) => string', '层级数据 / String', '根层名称 / 数值格式化'),
      prop('disabled / className', 'boolean / string', 'false / —', '禁用导航和叶子动作 / 根样式类'),
    ],
    keyboard: 'Tab导航，Enter/Space进入或返回；成功切层后聚焦新标题，受控拒绝更新时不抢焦点。空层显示空状态，无效数值不可点击。层级数据由调用方提供，不加载网络，不执行持久化。',
    related: ['Tree', 'ChartContainer', 'Breadcrumb'],
  },
];
