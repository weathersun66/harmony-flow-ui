import { useState, type ReactNode } from "react";
import {
  ActivityIndicator, AvailabilityGrid, Button, ChatMessage, CommentThread,
  ContextMenu, Drawer, EventCard, LoadingDots, LoadingOverlay, NotificationCenter,
  Popover, Presence, ProgressBar, ProgressRing, ResourceCalendar, Scheduler,
  SharePanel, Skeleton, Spinner, ToolCallCard,
} from '../workspace/InspectableLibrary';

function BatchPanel({ slug, title, status, children }: { slug: string; title: string; status: ReactNode; children: ReactNode }) {
  return <section className="batch-26082501" data-doc-preview={slug}>
    <header><span>BATCH 26082501</span><h4>{title}</h4></header>
    <div className="batch-26082501__body">{children}</div>
    <output aria-live="polite">{status}</output>
  </section>;
}

export function ActivityIndicatorPreview() {
  const [active, setActive] = useState(true);
  return <BatchPanel slug="activityindicator" title="异步活动状态" status={active ? "状态：正在同步" : "状态：同步已暂停"}>
    <div className="batch-26082501__row">{(["spinner", "dots", "radar", "wave"] as const).map((variant) => <ActivityIndicator key={variant} variant={variant} label={`${variant} 加载状态`} />)}</div>
    <Button size="sm" onClick={() => setActive((value) => !value)}>{active ? "暂停同步" : "继续同步"}</Button>
  </BatchPanel>;
}

export function DrawerPreview() {
  const [open, setOpen] = useState(false);
  return <BatchPanel slug="drawer" title="项目设置抽屉" status={open ? "抽屉已打开" : "抽屉已关闭"}>
    <Button onClick={() => setOpen(true)}>打开项目设置</Button>
    <Drawer open={open} title="项目设置" onClose={() => setOpen(false)} footer={<Button onClick={() => setOpen(false)}>保存并关闭</Button>}><p>在不中断主任务的情况下编辑项目名称与通知策略。</p></Drawer>
  </BatchPanel>;
}

export function LoadingDotsPreview() {
  const [label, setLabel] = useState("正在分析数据");
  return <BatchPanel slug="loadingdots" title="轻量等待反馈" status={label}><LoadingDots label={label} /><Button size="sm" onClick={() => setLabel("分析完成，正在生成摘要")}>推进任务</Button></BatchPanel>;
}

export function LoadingOverlayPreview() {
  const [active, setActive] = useState(true);
  return <BatchPanel slug="loadingoverlay" title="局部加载遮罩" status={active ? "内容正在刷新" : "内容刷新完成"}>
    <Button size="sm" onClick={() => setActive((value) => !value)}>{active ? "完成刷新" : "重新刷新"}</Button>
    <LoadingOverlay active={active} label="正在刷新项目摘要"><article className="batch-26082501__card"><strong>本周进展</strong><p>已完成 18 个任务，剩余 4 个待确认。</p></article></LoadingOverlay>
  </BatchPanel>;
}

export function PopoverPreview() {
  const [open, setOpen] = useState(false);
  return <BatchPanel slug="popover" title="上下文详情" status={open ? "详情已展开" : "详情已收起"}>
    <Popover open={open} onOpenChange={setOpen} trigger={<Button variant="secondary">查看风险说明</Button>} label="风险说明"><strong>中等风险</strong><p>本次变更涉及 3 个共享组件。</p></Popover>
  </BatchPanel>;
}

export function ProgressBarPreview() {
  const [value, setValue] = useState(42);
  return <BatchPanel slug="progressbar" title="线性任务进度" status={`当前进度：${value}%`}><ProgressBar value={value} label="资源上传" /><ProgressBar indeterminate label="等待服务响应" /><Button size="sm" onClick={() => setValue((current) => Math.min(100, current + 18))}>推进进度</Button></BatchPanel>;
}

export function ProgressRingPreview() {
  const [value, setValue] = useState(64);
  return <BatchPanel slug="progressring" title="紧凑环形进度" status={`完成度：${value}%`}><ProgressRing value={value} label="发布准备度" /><Button size="sm" onClick={() => setValue(100)}>标记完成</Button></BatchPanel>;
}

export function SkeletonPreview() {
  const [loaded, setLoaded] = useState(false);
  return <BatchPanel slug="skeleton" title="内容骨架占位" status={loaded ? "内容已加载" : "内容加载中"}>{loaded ? <article className="batch-26082501__card"><strong>市场洞察报告</strong><p>转化率较上周提升 8.2%。</p></article> : <div className="batch-26082501__skeleton"><Skeleton circle width={44} height={44} /><div><Skeleton width="55%" /><Skeleton width="90%" /><Skeleton width="72%" /></div></div>}<Button size="sm" onClick={() => setLoaded((value) => !value)}>{loaded ? "重新加载" : "显示内容"}</Button></BatchPanel>;
}

export function SpinnerPreview() {
  const [size, setSize] = useState(24);
  return <BatchPanel slug="spinner" title="旋转加载状态" status={`尺寸：${size}px`}><div className="batch-26082501__row"><Spinner size={16} label="小型加载" /><Spinner size={size} label="当前加载任务" /><Spinner size={36} label="大型加载" /></div><Button size="sm" onClick={() => setSize((value) => value === 24 ? 30 : 24)}>切换尺寸</Button></BatchPanel>;
}

export function ContextMenuPreview() {
  const [selected, setSelected] = useState("尚未选择操作");
  return <BatchPanel slug="contextmenu" title="右键快捷操作" status={selected}><ContextMenu label="文件操作" onSelect={(key) => setSelected(`已选择：${key}`)} items={[{ key: "rename", label: "重命名" }, { key: "duplicate", label: "创建副本" }, { key: "delete", label: "删除", danger: true }]}><div className="batch-26082501__context" tabIndex={0}>在此区域点击右键</div></ContextMenu></BatchPanel>;
}

const notices = [{ key: "n1", title: "部署完成", content: "生产环境已更新至 v2.4.0", time: "刚刚", unread: true, tone: "success" as const }, { key: "n2", title: "审批待办", content: "有一项发布申请等待确认", time: "5 分钟前", unread: true, tone: "info" as const }];
export function NotificationCenterPreview() {
  const [items, setItems] = useState(notices);
  return <BatchPanel slug="notificationcenter" title="通知收件箱" status={items.length ? `当前通知：${items.length} 条` : "通知已清空"}><NotificationCenter items={items} onRead={(key) => setItems((current) => current.map((item) => item.key === key ? { ...item, unread: false } : item))} onReadAll={() => setItems((current) => current.map((item) => ({ ...item, unread: false })))} onDismiss={(key) => setItems((current) => current.filter((item) => item.key !== key))} empty="所有通知均已处理" /><Button size="sm" variant="quiet" onClick={() => setItems([])}>清空通知</Button></BatchPanel>;
}

export function ChatMessagePreview() {
  const [streaming, setStreaming] = useState(true);
  return <BatchPanel slug="chatmessage" title="多角色对话消息" status={streaming ? "助手正在生成" : "助手回复完成"}><ChatMessage role="user" name="林晓" timestamp="10:24">请总结本周组件验收情况。</ChatMessage><ChatMessage role="assistant" name="Harmony AI" timestamp="10:24" streaming={streaming} actions={<Button size="sm" variant="quiet" onClick={() => setStreaming(false)}>完成生成</Button>}>已完成 117 个组件文档，本批将收口剩余 20 个。</ChatMessage><ChatMessage role="system" error="演示错误状态">系统消息可承载运行约束。</ChatMessage></BatchPanel>;
}

export function ToolCallCardPreview() {
  const [status, setStatus] = useState<"running" | "success" | "error">("running");
  return <BatchPanel slug="toolcallcard" title="工具执行记录" status={`工具状态：${status}`}><ToolCallCard name="组件完整性检查" status={status} description="扫描展厅文档完整度" input={<code>expected=0</code>} output={status === "success" ? <code>placeholderCount=0</code> : undefined} defaultExpanded onCancel={() => setStatus("error")} onRetry={() => setStatus("success")} /><div className="batch-26082501__row"><Button size="sm" onClick={() => setStatus("success")}>模拟成功</Button><Button size="sm" variant="danger" onClick={() => setStatus("error")}>模拟失败</Button></div></BatchPanel>;
}

export function PresencePreview() {
  const [status, setStatus] = useState<"online" | "away" | "busy" | "offline">("online");
  return <BatchPanel slug="presence" title="成员在线状态" status={`当前状态：${status}`}><div className="batch-26082501__row">{(["online", "away", "busy", "offline"] as const).map((item) => <Presence key={item} status={item} />)}</div><Button size="sm" onClick={() => setStatus(status === "online" ? "busy" : "online")}>切换本人状态</Button><Presence status={status} label={`林晓 · ${status}`} /></BatchPanel>;
}

const initialComments = [{ id: "c1", author: { name: "周宁" }, content: "建议补齐移动端空状态证据。", timestamp: "10:08", reactions: [{ emoji: "👍", count: 2 }] }];
export function CommentThreadPreview() {
  const [comments, setComments] = useState(initialComments);
  const reply = (id: string, content: string) => setComments((current) => current.map((item) => item.id === id ? { ...item, replies: [{ id: `${id}-reply`, author: { name: "林晓" }, content, timestamp: "刚刚" }] } : item));
  return <BatchPanel slug="commentthread" title="审阅评论讨论" status={comments.length ? `评论：${comments.length} 条` : "暂无评论"}><CommentThread comments={comments} onReply={reply} onReact={() => undefined} onDelete={(id) => setComments((current) => current.filter((item) => item.id !== id))} empty="开始第一条讨论" /><Button size="sm" variant="quiet" onClick={() => setComments([])}>显示空状态</Button></BatchPanel>;
}

export function SharePanelPreview() {
  const [scope, setScope] = useState<"restricted" | "organization" | "public">("restricted"); const [copied, setCopied] = useState(false);
  return <BatchPanel slug="sharepanel" title="资源共享权限" status={copied ? "共享链接已复制" : `共享范围：${scope}`}><SharePanel scope={scope} onScopeChange={setScope} onCopyLink={() => setCopied(true)} linkCopied={copied} members={<p>已邀请：林晓、周宁</p>} /></BatchPanel>;
}

const events = [{ id: "e1", title: "设计评审", start: "周一 10:00", end: "11:00", resourceId: "room-a" }, { id: "e2", title: "发布复盘", start: "周三 15:00", end: "16:00", resourceId: "room-b" }];
export function SchedulerPreview() { const [selected, setSelected] = useState("尚未选择日程"); return <BatchPanel slug="scheduler" title="一周日程排期" status={selected}><Scheduler days={["周一", "周二", "周三"]} events={events} onEventClick={(id) => setSelected(`已选择日程：${id}`)} /></BatchPanel>; }
export function ResourceCalendarPreview() { return <BatchPanel slug="resourcecalendar" title="会议室资源日历" status="2 个资源 · 2 项预约"><ResourceCalendar resources={[{ id: "room-a", name: "云水会议室" }, { id: "room-b", name: "星河会议室" }]} events={events} /></BatchPanel>; }
export function AvailabilityGridPreview() { return <BatchPanel slug="availabilitygrid" title="团队可用性" status="推荐时段：10:00"><AvailabilityGrid people={[{ id: "lin", name: "林晓" }, { id: "zhou", name: "周宁" }]} slots={["09:00", "10:00", "11:00"]} value={{ lin: { "09:00": "busy", "10:00": "available", "11:00": "tentative" }, zhou: { "09:00": "tentative", "10:00": "available", "11:00": "busy" } }} /></BatchPanel>; }
export function EventCardPreview() { const [selected, setSelected] = useState("尚未选择日程"); return <BatchPanel slug="eventcard" title="紧凑日程卡片" status={selected}><div className="batch-26082501__events">{events.map((event) => <EventCard key={event.id} event={event} onClick={(id) => setSelected(`已选择日程：${id}`)} />)}</div></BatchPanel>; }
