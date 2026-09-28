import { useState } from "react";
import {
  Button,
  ChartContainer,
  FlowCanvas,
  GanttChart,
  KanbanBoard,
  PivotTable,
} from '../workspace/InspectableLibrary';

function WorkflowScene({
  slug,
  title,
  status,
  children,
}: {
  slug: string;
  title: string;
  status: string;
  children: React.ReactNode;
}) {
  return (
    <section className="workflow-data-scene" data-doc-preview={slug}>
      <header>
        <span>DELIVERY CONTROL PLANE</span>
        <h4>{title}</h4>
      </header>
      <div className="workflow-data-scene__content">{children}</div>
      <output aria-live="polite">{status}</output>
    </section>
  );
}

export function FlowCanvasPreview() {
  const [selected, setSelected] = useState("build");
  const nodes = [
    {
      id: "brief",
      label: "需求确认",
      description: "范围已锁定",
      x: 28,
      y: 92,
      status: "success" as const,
    },
    {
      id: "build",
      label: "组件实现",
      description: "正在开发",
      x: 232,
      y: 92,
      status: "active" as const,
    },
    {
      id: "verify",
      label: "质量验证",
      description: "等待执行",
      x: 436,
      y: 92,
      status: "default" as const,
    },
  ];
  return (
    <WorkflowScene
      slug="flowcanvas"
      title="交付流程"
      status={`当前节点：${nodes.find((node) => node.id === selected)?.label}`}
    >
      <FlowCanvas
        nodes={nodes}
        edges={[
          { from: "brief", to: "build", label: "通过" },
          { from: "build", to: "verify", label: "提交" },
        ]}
        width={628}
        height={250}
        selectedId={selected}
        onSelect={setSelected}
      />
    </WorkflowScene>
  );
}

export function KanbanBoardPreview() {
  const [selected, setSelected] = useState("尚未选择任务");
  const [columns, setColumns] = useState([
    {
      id: "todo",
      title: "待处理",
      accent: "#7a8ca5",
      cards: [
        {
          id: "docs",
          title: "补齐 API 文档",
          description: "完善属性与键盘说明",
          tags: ["Docs"],
          meta: "今天",
        },
      ],
    },
    {
      id: "doing",
      title: "进行中",
      accent: "#0875f5",
      cards: [
        {
          id: "flow",
          title: "工作流预览",
          description: "接入真实数据与交互",
          tags: ["UI", "P1"],
          meta: "林默",
        },
      ],
    },
    {
      id: "done",
      title: "已完成",
      accent: "#17a673",
      cards: [
        { id: "backup", title: "保存修改前证据", tags: ["QA"], meta: "10 张" },
      ],
    },
  ]);
  function moveTask(id: string, from: string, to: string) {
    setColumns((current) => {
      const card = current.find((column) => column.id === from)?.cards.find((item) => item.id === id);
      if (!card) return current;
      return current.map((column) => ({ ...column, cards: column.id === from
        ? column.cards.filter((item) => item.id !== id) : column.id === to ? [...column.cards, card] : column.cards }));
    });
    setSelected(`已移动任务：${id}`);
  }
  return (
    <WorkflowScene slug="kanbanboard" title="交付看板" status={selected}>
      <KanbanBoard
        columns={columns}
        onMove={moveTask}
        onCardClick={(id) => setSelected(`已选择任务：${id}`)}
      />
    </WorkflowScene>
  );
}

export function GanttChartPreview() {
  const [selected, setSelected] = useState("尚未选择排期");
  const tasks = [
    {
      id: "design",
      label: "交互设计",
      group: "Design",
      start: "2026-08-18",
      end: "2026-08-21",
      progress: 100,
      color: "#17a673",
    },
    {
      id: "build",
      label: "组件实现",
      group: "Frontend",
      start: "2026-08-20",
      end: "2026-08-25",
      progress: 68,
      color: "#0875f5",
    },
    {
      id: "qa",
      label: "回归验收",
      group: "Quality",
      start: "2026-08-24",
      end: "2026-08-27",
      progress: 20,
      color: "#7a5af8",
    },
  ];
  return (
    <WorkflowScene slug="ganttchart" title="迭代排期" status={selected}>
      <div className="workflow-scroll">
        <GanttChart
          tasks={tasks}
          start="2026-08-18"
          end="2026-08-27"
          onTaskClick={(id) => setSelected(`已选择排期：${id}`)}
        />
      </div>
    </WorkflowScene>
  );
}

export function ChartContainerPreview() {
  const [state, setState] = useState<"data" | "loading" | "empty">("data");
  return (
    <WorkflowScene
      slug="chartcontainer"
      title="交付吞吐"
      status={`图表状态：${state}`}
    >
      <ChartContainer
        title="每周完成任务"
        description="最近六周"
        height={220}
        loading={state === "loading"}
        empty={state === "empty"}
        legend={[
          { label: "已完成", color: "#0875f5", value: "86" },
          { label: "延期", color: "#f59e0b", value: "7" },
        ]}
      >
        <div className="workflow-bars" aria-label="每周完成任务柱状图">
          {[42, 58, 51, 76, 68, 88].map((value, index) => (
            <i key={index} style={{ height: `${value}%` }}>
              <span>W{index + 1}</span>
            </i>
          ))}
        </div>
      </ChartContainer>
      <div className="workflow-actions">
        <Button size="sm" onClick={() => setState("data")}>
          数据
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setState("loading")}
        >
          加载
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setState("empty")}>
          空状态
        </Button>
      </div>
    </WorkflowScene>
  );
}

type DeliveryRow = { team: string; sprint: string; completed: number };
const deliveryRows: DeliveryRow[] = [
  { team: "体验组", sprint: "Sprint 21", completed: 18 },
  { team: "体验组", sprint: "Sprint 22", completed: 24 },
  { team: "平台组", sprint: "Sprint 21", completed: 15 },
  { team: "平台组", sprint: "Sprint 22", completed: 21 },
];

export function PivotTablePreview() {
  const [totals, setTotals] = useState(true);
  return (
    <WorkflowScene
      slug="pivottable"
      title="团队交付汇总"
      status={totals ? "正在显示合计" : "已隐藏合计"}
    >
      <PivotTable
        data={deliveryRows}
        row={(item) => item.team}
        column={(item) => item.sprint}
        rowLabel="团队"
        showTotals={totals}
        values={[
          {
            key: "completed",
            label: "完成",
            value: (item) => item.completed,
            aggregate: "sum",
          },
        ]}
      />
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setTotals((value) => !value)}
      >
        切换合计
      </Button>
    </WorkflowScene>
  );
}
