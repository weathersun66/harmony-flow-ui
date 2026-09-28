import { useMemo, useState } from "react";
import {
  Button,
  CircularProgress,
  InsightBoard,
  Select,
  Sparkline,
  StatisticCard,
  StepProgress,
  Timeline,
  VirtualList,
} from '../workspace/InspectableLibrary';

function DataScene({
  slug,
  eyebrow,
  title,
  status,
  children,
}: {
  slug: string;
  eyebrow: string;
  title: string;
  status: string;
  children: React.ReactNode;
}) {
  return (
    <section className="data-summary-scene" data-doc-preview={slug}>
      <header>
        <span>{eyebrow}</span>
        <h4>{title}</h4>
      </header>
      <div className="data-summary-scene__content">{children}</div>
      <output aria-live="polite">{status}</output>
    </section>
  );
}

export function CircularProgressPreview() {
  const [value, setValue] = useState(68);
  return (
    <DataScene
      slug="circularprogress"
      eyebrow="DELIVERY HEALTH"
      title="发布准备度"
      status={`当前准备度：${value}%`}
    >
      <div className="data-summary-circles">
        <CircularProgress
          value={value}
          label="总体"
          size={126}
          thickness={10}
        />
        <CircularProgress value={92} label="测试" />
        <CircularProgress value={74} label="文档" />
      </div>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setValue((current) => (current === 68 ? 84 : 68))}
      >
        同步最新检查
      </Button>
    </DataScene>
  );
}

export function InsightBoardPreview() {
  const [period, setPeriod] = useState("week");
  const weekly = period === "week";
  return (
    <DataScene
      slug="insightboard"
      eyebrow="OPERATIONS PULSE"
      title="交付洞察"
      status={`统计周期：${weekly ? "本周" : "本月"}`}
    >
      <InsightBoard
        heading={
          <div>
            <strong>发布稳定性</strong>
            <small>{weekly ? "近 7 天" : "近 30 天"}</small>
          </div>
        }
        filters={
          <Select
            aria-label="统计周期"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            options={[
              { label: "本周", value: "week" },
              { label: "本月", value: "month" },
            ]}
          />
        }
        summary={
          <div className="data-summary-kpi">
            <strong>{weekly ? "96.8%" : "94.2%"}</strong>
            <span>成功发布率</span>
          </div>
        }
        trend={
          <Sparkline
            data={
              weekly
                ? [72, 81, 78, 86, 90, 88, 97]
                : [62, 70, 68, 77, 74, 82, 94]
            }
            label="发布成功率趋势"
          />
        }
        detail={
          <ul className="data-summary-detail">
            <li>
              <span>失败发布</span>
              <strong>{weekly ? 2 : 9}</strong>
            </li>
            <li>
              <span>平均恢复</span>
              <strong>{weekly ? "8m" : "11m"}</strong>
            </li>
          </ul>
        }
      />
    </DataScene>
  );
}

export function SparklinePreview() {
  const [series, setSeries] = useState<"requests" | "latency">("requests");
  const data =
    series === "requests"
      ? [34, 42, 39, 58, 54, 67, 72, 69, 83]
      : [82, 74, 79, 63, 68, 55, 49, 52, 41];
  return (
    <DataScene
      slug="sparkline"
      eyebrow="LIVE SIGNAL"
      title="服务趋势"
      status={`当前指标：${series === "requests" ? "请求量" : "延迟"}`}
    >
      <div className="data-summary-sparkline">
        <div>
          <span>{series === "requests" ? "每分钟请求" : "P95 延迟"}</span>
          <strong>{series === "requests" ? "8,420" : "186 ms"}</strong>
        </div>
        <Sparkline
          data={data}
          width={420}
          height={104}
          label={`${series === "requests" ? "请求量" : "延迟"}趋势`}
        />
      </div>
      <div className="data-summary-actions">
        <Button
          size="sm"
          variant={series === "requests" ? "primary" : "secondary"}
          onClick={() => setSeries("requests")}
        >
          请求量
        </Button>
        <Button
          size="sm"
          variant={series === "latency" ? "primary" : "secondary"}
          onClick={() => setSeries("latency")}
        >
          延迟
        </Button>
      </div>
    </DataScene>
  );
}

export function StatisticCardPreview() {
  const [scope, setScope] = useState<"team" | "org">("team");
  const organization = scope === "org";
  return (
    <DataScene
      slug="statisticcard"
      eyebrow="WORKSPACE SCORECARD"
      title="关键指标"
      status={`数据范围：${organization ? "全组织" : "当前团队"}`}
    >
      <div className="data-summary-stats">
        <StatisticCard
          label="活跃项目"
          value={organization ? "128" : "24"}
          trend="较上周期 +12%"
          tone="blue"
        />
        <StatisticCard
          label="按时完成"
          value={organization ? "89.4%" : "94.8%"}
          trend="目标 90%"
          tone="green"
        />
        <StatisticCard
          label="待处理风险"
          value={organization ? "17" : "3"}
          trend="需要本周处理"
          tone="amber"
        />
      </div>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          setScope((current) => (current === "team" ? "org" : "team"))
        }
      >
        切换数据范围
      </Button>
    </DataScene>
  );
}

export function StepProgressPreview() {
  const steps = ["准备变更", "质量检查", "灰度发布", "全量上线"];
  const [current, setCurrent] = useState(1);
  return (
    <DataScene
      slug="stepprogress"
      eyebrow="RELEASE TRACK"
      title="上线进度"
      status={`当前阶段：${steps[current]}`}
    >
      <StepProgress steps={steps} current={current} />
      <Button
        size="sm"
        onClick={() =>
          setCurrent((value) => Math.min(steps.length - 1, value + 1))
        }
        disabled={current === steps.length - 1}
      >
        推进下一阶段
      </Button>
    </DataScene>
  );
}

export function TimelinePreview() {
  const [deployed, setDeployed] = useState(false);
  const items = [
    {
      key: "review",
      title: "变更评审完成",
      description: "12 个文件通过双人评审",
      time: "09:20",
      status: "complete" as const,
    },
    {
      key: "verify",
      title: "自动化检查通过",
      description: "类型、API 与视觉回归无异常",
      time: "09:42",
      status: "complete" as const,
    },
    {
      key: "deploy",
      title: deployed ? "灰度发布完成" : "等待灰度发布",
      description: deployed ? "10% 流量运行稳定" : "等待发布负责人确认",
      time: deployed ? "10:08" : "待定",
      status: deployed ? ("complete" as const) : ("current" as const),
    },
  ];
  return (
    <DataScene
      slug="timeline"
      eyebrow="CHANGE HISTORY"
      title="发布事件"
      status={deployed ? "灰度发布已记录" : "灰度发布待确认"}
    >
      <Timeline items={items} label="发布事件时间轴" />
      <Button size="sm" onClick={() => setDeployed(true)} disabled={deployed}>
        记录灰度完成
      </Button>
    </DataScene>
  );
}

export function VirtualListPreview() {
  const items = useMemo(
    () =>
      Array.from({ length: 120 }, (_, index) => ({
        id: index + 1,
        name: `运行记录 #${String(index + 1).padStart(3, "0")}`,
        duration: `${82 + index * 3} ms`,
      })),
    [],
  );
  return (
    <DataScene
      slug="virtuallist"
      eyebrow="HIGH VOLUME"
      title="运行记录"
      status={`共 ${items.length} 条，仅渲染可视区域`}
    >
      <VirtualList
        items={items}
        height={236}
        itemHeight={48}
        itemKey={(item) => item.id}
        label="运行记录虚拟列表"
        renderItem={(item) => (
          <div className="data-summary-row">
            <span>
              <i aria-hidden="true" />
              {item.name}
            </span>
            <strong>{item.duration}</strong>
          </div>
        )}
      />
    </DataScene>
  );
}
