import type { ComponentDoc } from "./types";
import {
  CircularProgressPreview,
  InsightBoardPreview,
  SparklinePreview,
  StatisticCardPreview,
  StepProgressPreview,
  TimelinePreview,
  VirtualListPreview,
} from "./data-summary-previews";
import "./data-summary-docs.css";

const props = (items: Array<[string, string, string, string]>) =>
  items.map(([name, type, defaultValue, description]) => ({
    name,
    type,
    defaultValue,
    description,
  }));

export const dataSummaryDocs: readonly ComponentDoc[] = [
  {
    name: "CircularProgress",
    title: "环形进度",
    category: "数据展示",
    description:
      "在紧凑空间内显示一个可计算任务的完成比例，并通过 progressbar 语义公布当前值。",
    importCode: "import { CircularProgress } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<CircularProgress value={68} label="总体" size={126} />`,
    preview: <CircularProgressPreview />,
    props: props([
      ["value", "number", "—", "当前进度值"],
      ["max", "number", "100", "进度最大值"],
      ["size", "number", "92", "环形区域尺寸"],
      ["thickness", "number", "8", "轨道宽度"],
    ]),
    keyboard:
      "只读状态无需聚焦；辅助技术通过 progressbar、aria-valuenow 与 aria-valuemax 获取进度。",
    related: ["Progress", "StepProgress", "StatisticCard"],
  },
  {
    name: "InsightBoard",
    title: "洞察面板",
    category: "数据展示",
    description:
      "把核心结论、趋势与原因组织成连续的分析阅读路径，适合运营与业务洞察。",
    importCode: "import { InsightBoard } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<InsightBoard heading="发布稳定性" summary={<Summary />} trend={<Trend />} detail={<Detail />} />`,
    preview: <InsightBoardPreview />,
    props: props([
      ["summary", "ReactNode", "—", "核心结果区域"],
      ["trend", "ReactNode", "—", "变化趋势区域"],
      ["detail", "ReactNode", "—", "明细与原因区域"],
      ["filters", "ReactNode", "—", "可选筛选控件"],
    ]),
    keyboard:
      "阅读顺序为标题、筛选、核心结果、趋势和明细；筛选控件遵循自身键盘行为。",
    related: ["StatisticCard", "Sparkline", "ChartContainer"],
  },
  {
    name: "Sparkline",
    title: "迷你趋势图",
    category: "数据展示",
    description: "用最少坐标信息表达一段连续趋势，适合与关键数字并排呈现。",
    importCode: "import { Sparkline } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<Sparkline data={[34, 42, 39, 58, 67, 72]} label="请求量趋势" />`,
    preview: <SparklinePreview />,
    props: props([
      ["data", "readonly number[]", "—", "按时间排序的数据点"],
      ["width", "number", "160", "SVG 视图宽度"],
      ["height", "number", "48", "SVG 视图高度"],
      ["filled", "boolean", "true", "是否显示面积填充"],
      ["label", "string", "'趋势图'", "图形的可访问名称"],
    ]),
    keyboard: "图形不需要焦点；通过 role=img 与 label 向辅助技术提供指标含义。",
    related: ["StatisticCard", "InsightBoard", "ChartContainer"],
  },
  {
    name: "StatisticCard",
    title: "统计卡片",
    category: "数据展示",
    description: "突出单个关键指标、趋势和语义色，适合组成可扫读的指标概览。",
    importCode: "import { StatisticCard } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<StatisticCard label="活跃项目" value="24" trend="较上周 +12%" tone="blue" />`,
    preview: <StatisticCardPreview />,
    props: props([
      ["label", "ReactNode", "—", "指标名称"],
      ["value", "ReactNode", "—", "指标值"],
      ["trend", "ReactNode", "—", "趋势或补充信息"],
      ["tone", "'blue' | 'green' | 'violet' | 'amber'", "'blue'", "指标语义色"],
    ]),
    keyboard: "只读卡片按文档顺序读取；范围切换由预览按钮提供。",
    related: ["Stat", "Sparkline", "InsightBoard"],
  },
  {
    name: "StepProgress",
    title: "步骤进度",
    category: "数据展示",
    description:
      "只读展示流程的已完成、当前和待进行阶段；需要可操作步骤时使用 Steps。",
    importCode: "import { StepProgress } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<StepProgress steps={['准备', '检查', '发布']} current={1} />`,
    preview: <StepProgressPreview />,
    props: props([
      ["steps", "readonly ReactNode[]", "—", "按顺序排列的阶段"],
      ["current", "number", "—", "当前阶段的零基索引"],
    ]),
    keyboard: "只读有序列表无需聚焦；阶段按 DOM 顺序朗读。",
    related: ["Steps", "Timeline", "Progress"],
  },
  {
    name: "Timeline",
    title: "时间轴",
    category: "数据展示",
    description:
      "按时间顺序呈现事件、状态与说明，适合发布历史、审计记录和业务进程。",
    importCode: "import { Timeline } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<Timeline items={[{ key: 'review', title: '评审完成', status: 'complete' }]} />`,
    preview: <TimelinePreview />,
    props: props([
      ["items", "readonly TimelineItem[]", "—", "时间轴事件"],
      ["label", "string", "'时间轴'", "有序列表的可访问名称"],
      [
        "item.status",
        "'complete' | 'current' | 'upcoming'",
        "'upcoming'",
        "事件状态",
      ],
    ]),
    keyboard: "只读有序列表无需聚焦；事件标题、说明和时间按顺序读取。",
    related: ["StepProgress", "AuditLog", "ActivityFeed"],
  },
  {
    name: "VirtualList",
    title: "虚拟列表",
    category: "数据展示",
    description:
      "只渲染当前滚动窗口附近的条目，在大量同高数据中保持稳定的渲染成本。",
    importCode: "import { VirtualList } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<VirtualList items={runs} height={236} itemHeight={48} itemKey={(run) => run.id} renderItem={(run) => <RunRow run={run} />} />`,
    preview: <VirtualListPreview />,
    props: props([
      ["items", "readonly T[]", "—", "完整数据集合"],
      ["height", "number", "—", "滚动视口高度"],
      ["itemHeight", "number", "—", "每条数据的固定高度"],
      ["renderItem", "(item, index) => ReactNode", "—", "条目渲染函数"],
      ["overscan", "number", "3", "视口外预渲染条数"],
    ]),
    keyboard: "滚动区域可通过鼠标、触控板或触摸滚动；列表和列表项语义保留。",
    related: ["List", "DataGrid", "Table"],
  },
];
