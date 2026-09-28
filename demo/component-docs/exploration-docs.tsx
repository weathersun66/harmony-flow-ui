import type { ComponentDoc, ComponentPropDoc } from './types';
import { ExpandablePanelPreview, LegendFilterPreview, ProductTourPreview, RangeBrushPreview } from './exploration-previews';
import './exploration-docs.css';

const prop = (name: string, type: string, defaultValue: string, description: string): ComponentPropDoc => ({ name, type, defaultValue, description });

export const explorationDocs: readonly ComponentDoc[] = [
  {
    name: 'ProductTour', title: '分步高亮导览', category: '反馈',
    description: '高亮页面目标，通过分步说明介绍现有功能，支持退出与键盘焦点恢复。',
    importCode: "import { ProductTour } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<ProductTour steps={steps} open={open} current={current} onCurrentChange={setCurrent} onClose={() => setOpen(false)} />',
    preview: <ProductTourPreview />,
    props: [
      prop('steps', 'readonly ProductTourStep[]', '必填', '唯一id、title、description，可选target回调返回当前HTMLElement或null；目标需可见'),
      prop('open / current', 'boolean / number', '必填', '受控显示与零起始步骤；越界步骤夹到有效范围，空steps不渲染'),
      prop('onCurrentChange / onClose', '(index: number) => void / () => void', '必填', '翻页与关闭请求，调用方负责更新属性'),
      prop('onFinish', '() => void', 'onClose', '末步结束请求；传入后由调用方关闭，不表示业务任务已完成'),
      prop('className', 'string', '—', '门户根样式类；自动复制打开时的宿主主题变量'),
    ],
    keyboard: 'Tab在导览内循环，Escape请求关闭并恢复启动焦点；背景指针操作被阻止。目标隐藏/移除显示提示，窗口缩放与滚动更新高亮；不自动滚动。固定底部说明卡可能覆盖靠近底部的目标，适合短步骤桌面/移动导览。',
    related: ['OnboardingChecklist', 'Modal', 'Steps'],
  },
  {
    name: 'LegendFilter', title: '交互图例筛选', category: '数据展示',
    description: '用图例按钮控制指标显示，支持多选、禁用和至少保留一个指标。',
    importCode: "import { LegendFilter } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<LegendFilter items={series} visibleKeys={visible} onVisibleKeysChange={setVisible} />',
    preview: <LegendFilterPreview />,
    props: [
      prop('items', 'readonly LegendFilterItem[]', '必填', '唯一id、label，可选CSS颜色color和disabled；颜色不作为唯一状态信息'),
      prop('visibleKeys / onVisibleKeysChange', 'readonly string[] / (keys: string[]) => void', '必填', '受控可见id；回调去除未知id，图表数据由调用方过滤'),
      prop('allowEmpty / disabled', 'boolean', 'false / false', '允许隐藏全部 / 禁用全部操作；初始空选择不会自行补选'),
      prop('label / className', 'string', '图例筛选 / —', '组无障碍名称 / 根样式类'),
    ],
    keyboard: 'Tab导航，Enter/Space切换，aria-pressed公布状态。禁止空选择时最后一个可见项不可隐藏；空items展示空状态。',
    related: ['ChartContainer', 'SegmentedControl'],
  },
  {
    name: 'RangeBrush', title: '图表区间刷选', category: '数据展示',
    description: '在概览中高亮数值区间，通过双端点滑块实时筛选，不与图表渲染实现耦合。',
    importCode: "import { RangeBrush } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<RangeBrush min={1} max={12} value={range} onValueChange={setRange} label="月份" />',
    preview: <RangeBrushPreview />,
    props: [
      prop('value / onValueChange', 'readonly [number, number] / (range: [number, number]) => void', '必填', '受控区间；输入即时请求更新，端点不交叉；展示值排序、夹取、按step归一化'),
      prop('min / max / step', 'number', '0 / 100 / 1', '有限递增边界，无效范围禁用并提示；无效step回退1'),
      prop('label / formatValue', 'string / (value: number) => string', '区间筛选 / String', '区域名称 / 数值及无障碍格式化'),
      prop('disabled / children / className', 'boolean / ReactNode / string', 'false / — / —', '禁用操作 / 装饰性概览（inert、不可交互） / 根样式类'),
    ],
    keyboard: 'Tab分别聚焦起点与终点，方向键、Home/End使用原生滑块语义；鼠标和触摸拖动滑块实时更新。不提供松手提交/取消事务、二维套索或选区整体平移。',
    related: ['Slider', 'ChartContainer', 'LegendFilter'],
  },
  {
    name: 'ExpandablePanel', title: '可展开内容面板', category: '数据展示',
    description: '保留概览并原地展开详情，支持表单内容和收起后保留输入状态。',
    importCode: "import { ExpandablePanel } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<ExpandablePanel title="交付概况" summary="评审已完成">{details}</ExpandablePanel>',
    preview: <ExpandablePanelPreview />,
    props: [
      prop('title / summary / children', 'string / ReactNode / ReactNode', '必填 / — / 必填', '标题 / 常驻概览 / 保留挂载的详情内容'),
      prop('expanded / defaultExpanded', 'boolean', '— / false', '受控状态 / 非受控初始状态'),
      prop('onExpandedChange', '(expanded: boolean) => void', '—', '切换请求；受控时由调用方确认更新'),
      prop('disabled / className', 'boolean / string', 'false / —', '禁用切换 / 根样式类'),
    ],
    keyboard: 'Enter/Space切换；收起时详情区域inert且对辅助技术隐藏，不产生隐藏焦点。减少动态偏好下即时展开。内容保留挂载，不适合用作敏感内容权限隔离。',
    related: ['Accordion', 'ReadMore', 'Card'],
  },
];
