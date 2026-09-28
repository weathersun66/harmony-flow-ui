import { useState } from "react";
import {
  ActivityFeed,
  AgentRunTimeline,
  ApprovalFlow,
  AuditLog,
  Button,
  type ApprovalStatus,
} from '../workspace/InspectableLibrary';

function RunLedger({ slug, sequence, title, status, children }: { slug: string; sequence: string; title: string; status: string; children: React.ReactNode }) {
  return <section className="run-ledger" data-doc-preview={slug}>
    <header><span>RUN LEDGER · {sequence}</span><h4>{title}</h4><i>LIVE RECORD</i></header>
    <div className="run-ledger__content">{children}</div>
    <output aria-live="polite">{status}</output>
  </section>;
}

const runSteps = [
  { id: "policy", title: "读取发布策略", status: "success" as const, description: "已加载生产环境保护规则", timestamp: "10:02:11" },
  { id: "checks", title: "执行质量门禁", status: "success" as const, description: "144 项 API 与浏览器检查通过", timestamp: "10:03:48" },
  { id: "approval", title: "等待变更审批", status: "running" as const, description: "需要发布经理确认", timestamp: "10:04:02", detail: <small>检查点 · CP-2048</small> },
  { id: "deploy", title: "部署生产环境", status: "queued" as const, description: "审批通过后自动开始" },
];

export function AgentRunTimelinePreview() {
  const [active, setActive] = useState("approval");
  const title = runSteps.find((step) => step.id === active)?.title;
  return <RunLedger slug="agentruntimeline" sequence="07A" title="发布代理执行轨迹" status={`当前查看：${title}`}>
    <AgentRunTimeline steps={runSteps} activeId={active} onSelect={setActive} label="生产发布执行过程" />
  </RunLedger>;
}

const activities = [
  { id: "a1", actor: "发布代理", action: "完成", target: "质量门禁", timestamp: "10:03", icon: "✓", detail: <small>构建 9f3c2a · 144/144</small> },
  { id: "a2", actor: "林默", action: "提交", target: "生产发布申请", timestamp: "10:04", avatar: "林", detail: <small>风险等级：中</small> },
  { id: "a3", actor: "系统", action: "通知", target: "发布经理、安全负责人和当值运维工程师", timestamp: "10:04", icon: "↗", detail: <small>所有接收人需要在生产变更窗口关闭前确认风险与回滚路径</small> },
];

export function ActivityFeedPreview() {
  const [grouped, setGrouped] = useState(true);
  const [empty, setEmpty] = useState(false);
  return <RunLedger slug="activityfeed" sequence="07B" title="变更活动流" status={empty ? "当前状态：暂无动态" : grouped ? "当前视图：按事件分组" : "当前视图：连续动态"}>
    <div className="run-ledger__toolbar"><Button size="sm" variant="secondary" onClick={() => setGrouped((value) => !value)}>切换视图</Button><Button size="sm" variant="quiet" onClick={() => setEmpty((value) => !value)}>{empty ? "恢复动态" : "显示空状态"}</Button></div>
    <ActivityFeed items={empty ? [] : activities} grouped={grouped} empty="当前筛选条件下没有动态" />
  </RunLedger>;
}

const initialApproval = [
  { id: "owner", title: "变更负责人", approver: "林默 · Frontend", status: "approved" as ApprovalStatus, timestamp: "10:04", comment: "验收证据齐全" },
  { id: "manager", title: "发布经理", approver: "周宁 · Release", status: "pending" as ApprovalStatus },
  { id: "security", title: "安全复核", approver: "策略引擎", status: "pending" as ApprovalStatus },
];

export function ApprovalFlowPreview() {
  const [steps, setSteps] = useState(initialApproval);
  const current = steps.find((step) => step.status === "pending")?.id;
  const rejected = steps.find((step) => step.status === "rejected")?.id;
  const decide = (id: string, status: ApprovalStatus) => setSteps((items) => items.map((item) => item.id === id ? { ...item, status, timestamp: "刚刚", comment: status === "approved" ? "允许继续发布" : "需要补充回滚验证" } : status === "rejected" && item.status === "pending" ? { ...item, status: "skipped" } : item));
  return <RunLedger slug="approvalflow" sequence="07C" title="生产变更审批" status={rejected ? `审批已拒绝：${rejected}` : current ? `当前审批：${current}` : "审批流程已完成"}>
    <ApprovalFlow steps={steps} currentId={current} onApprove={(id) => decide(id, "approved")} onReject={(id) => decide(id, "rejected")} />
  </RunLedger>;
}

const auditEvents = [
  { id: "evt-481", timestamp: "10:04:18", actor: "lin.mo", action: "创建发布申请", resource: "release/prod-82", result: "success" as const, ip: "10.24.8.16", detail: "版本 0.1.0" },
  { id: "evt-482", timestamp: "10:04:31", actor: "policy-bot", action: "评估变更风险", resource: "policy/P-17", result: "warning" as const, ip: "service", detail: "需要人工审批" },
  { id: "evt-483", timestamp: "10:05:02", actor: "zhou.ning", action: "读取验收证据", resource: "evidence/group-8", result: "success" as const, ip: "10.24.7.9" },
];

export function AuditLogPreview() {
  const [selected, setSelected] = useState("尚未选择事件");
  const [empty, setEmpty] = useState(false);
  return <RunLedger slug="auditlog" sequence="07D" title="不可变审计记录" status={empty ? "当前状态：暂无审计记录" : selected}>
    <div className="run-ledger__toolbar"><Button size="sm" variant="quiet" onClick={() => setEmpty((value) => !value)}>{empty ? "恢复记录" : "显示空状态"}</Button></div>
    <div className="run-ledger__scroll"><AuditLog events={empty ? [] : auditEvents} caption="生产发布审计日志" onSelect={(id) => setSelected(`已选择事件：${id}`)} empty="该时间范围内没有审计记录" /></div>
  </RunLedger>;
}
