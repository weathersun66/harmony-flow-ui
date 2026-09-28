import type { ComponentDoc, ComponentPropDoc } from "./types";
import {
  ChartContainerPreview,
  FlowCanvasPreview,
  GanttChartPreview,
  KanbanBoardPreview,
  PivotTablePreview,
} from "./workflow-data-previews";
import "./workflow-data-docs.css";

const prop = (
  name: string,
  type: string,
  defaultValue: string,
  description: string,
): ComponentPropDoc => ({ name, type, defaultValue, description });

export const workflowDataDocs: readonly ComponentDoc[] = [
  {
    name: "FlowCanvas",
    title: "流程画布",
    category: "数据展示",
    description:
      "用节点和连线呈现工作流结构、状态与当前选择，适合自动化编排和执行路径。",
    importCode: "import { FlowCanvas } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<FlowCanvas nodes={nodes} edges={edges} selectedId={selected} onSelect={setSelected} />`,
    preview: <FlowCanvasPreview />,
    props: [
      prop("nodes", "readonly FlowNode[]", "—", "节点及坐标"),
      prop("edges", "readonly FlowEdge[]", "—", "节点连线"),
      prop("selectedId", "string", "—", "当前选中节点"),
      prop("onSelect", "(id: string) => void", "—", "节点选择回调"),
      prop("width / height", "number", "900 / 420", "画布尺寸"),
    ],
    keyboard: "Tab 在节点间移动；Enter 或 Space 选择节点；窄屏可滚动画布。",
    related: ["KanbanBoard", "AgentRunTimeline", "ApprovalFlow"],
  },
  {
    name: "KanbanBoard",
    title: "看板",
    category: "数据展示",
    description:
      "按工作状态组织任务卡片，支持选择和拖放移动，适合迭代与交付管理。",
    importCode: "import { KanbanBoard } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<KanbanBoard columns={columns} onCardClick={openTask} onMove={moveTask} />`,
    preview: <KanbanBoardPreview />,
    props: [
      prop("columns", "readonly KanbanColumn[]", "—", "看板列与卡片"),
      prop("onCardClick", "(cardId, columnId) => void", "—", "卡片选择回调"),
      prop("onMove", "(cardId, from, to) => void", "—", "跨列移动请求：支持原生拖放、触摸手柄和目标列选择器；调用方确认后更新columns，不改变原数组；limit仅展示，不自动限制移动"),
      prop("empty", "ReactNode", "'暂无看板列'", "空状态内容"),
    ],
    keyboard:
      "Tab选择卡片或目标列；Enter/Space选择卡片，原生选择器提供键盘跨列移动。拖动手柄支持鼠标与触摸，Escape、外部松手、pointercancel或列/卡片结构变化取消。只接受当前看板内部发起的拖放；不支持同列排序或自动滚屏。移动后聚焦看板并播报请求，实际列位置由调用方确认。",
    related: ["FlowCanvas", "GanttChart", "ActivityFeed"],
  },
  {
    name: "GanttChart",
    title: "甘特图",
    category: "数据展示",
    description:
      "在统一日期轴上展示任务区间、分组与完成比例，用于排期和依赖检查。",
    importCode: "import { GanttChart } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<GanttChart tasks={tasks} start="2026-08-18" end="2026-08-27" onTaskClick={openTask} />`,
    preview: <GanttChartPreview />,
    props: [
      prop("tasks", "readonly GanttTask[]", "—", "排期任务"),
      prop("start / end", "string | Date", "自动计算", "时间轴范围"),
      prop("onTaskClick", "(id: string) => void", "—", "任务选择回调"),
      prop("empty", "ReactNode", "'暂无排期任务'", "空状态内容"),
    ],
    keyboard:
      "Tab 在任务条间移动；Enter 或 Space 选择任务；窄屏可横向浏览日期轴。",
    related: ["KanbanBoard", "Timeline", "Scheduler"],
  },
  {
    name: "ChartContainer",
    title: "图表容器",
    category: "数据展示",
    description:
      "统一图表标题、说明、图例、高度以及加载和空状态，为不同图形提供稳定外壳。",
    importCode: "import { ChartContainer } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<ChartContainer title="每周完成任务" legend={legend} loading={loading}><Chart /></ChartContainer>`,
    preview: <ChartContainerPreview />,
    props: [
      prop("children", "ReactNode", "—", "图表内容"),
      prop("title / description", "ReactNode", "—", "标题与说明"),
      prop("legend", "readonly ChartLegendItem[]", "—", "图例数据"),
      prop("height", "number", "320", "图表内容高度"),
      prop("loading / empty", "boolean", "false", "加载与空状态"),
    ],
    keyboard: "容器保持子图表语义；状态切换控件使用标准按钮键盘行为。",
    related: ["Sparkline", "InsightBoard", "PivotTable"],
  },
  {
    name: "PivotTable",
    title: "透视表",
    category: "数据展示",
    description:
      "按行、列和聚合指标交叉汇总数据，适合团队、周期与业务维度分析。",
    importCode: "import { PivotTable } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<PivotTable data={rows} row={(x) => x.team} column={(x) => x.sprint} values={metrics} />`,
    preview: <PivotTablePreview />,
    props: [
      prop("data", "readonly T[]", "—", "原始明细"),
      prop("row / column", "(item: T) => string", "—", "行列维度"),
      prop("values", "readonly PivotValue<T>[]", "—", "聚合指标"),
      prop("showTotals", "boolean", "true", "是否显示合计"),
      prop("rowLabel", "ReactNode", "'项目'", "行维度标题"),
    ],
    keyboard:
      "表格按表头、行头和单元格顺序读取；合计切换按钮支持标准键盘操作。",
    related: ["Table", "DataGrid", "ChartContainer"],
  },
];
