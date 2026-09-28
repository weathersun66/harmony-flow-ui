import { useState } from 'react';
import { Button, CheckboxGroup, Drawer, Grid, Popover, Progress, RadioGroup, Select, Skeleton, Sparkline, StatisticCard } from '../src';

const taskOptions = [
  { value: 'reading', label: '阅读设计系统章节', description: '30 分钟 · 交互基础' },
  { value: 'practice', label: '完成组件练习', description: '45 分钟 · React' },
  { value: 'review', label: '整理今日错题', description: '20 分钟 · 复盘' },
] as const;

export function WorkspaceShowcase() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [completed, setCompleted] = useState<string[]>(['reading']);
  const [period, setPeriod] = useState('week');
  return <section id="workspace" className="demo-section workspace-showcase">
    <div className="demo-section__heading"><div><p className="demo-kicker">DASHBOARD EXAMPLE</p><h2>数据与任务工作台</h2></div><span>筛选、指标、趋势与任务协同工作</span></div>
    <div className="workspace-toolbar"><div><strong>学习概览</strong><span>今天的节奏平稳，继续保持。</span></div><div className="demo-row">
      <Select aria-label="统计周期" value={period} onChange={(event) => setPeriod(event.target.value)} options={[{ label: '本周', value: 'week' }, { label: '本月', value: 'month' }]} />
      <Popover trigger={<Button variant="quiet">筛选 ···</Button>} label="筛选工作台"><div className="workspace-popover"><strong>内容范围</strong><RadioGroup defaultValue="all" options={[{ label: '全部任务', value: 'all' }, { label: '仅未完成', value: 'pending' }]} /></div></Popover>
      <Button onClick={() => setDrawerOpen(true)}>安排任务</Button>
    </div></div>
    <Grid minItemWidth={190} gap={14}>
      <StatisticCard label="累计学习" value="90 天" trend="较上周 +12%" icon="↗" />
      <StatisticCard label="今日专注" value="2h 36m" trend="目标完成 78%" icon="◷" tone="violet" />
      <StatisticCard label="任务完成率" value="82%" trend="连续提升 3 周" icon="✓" tone="green" />
      <StatisticCard label="连续打卡" value="16 天" trend="最长记录 24 天" icon="⚡" tone="amber" />
    </Grid>
    <div className="workspace-grid">
      <article className="workspace-panel workspace-chart"><header><div><span>学习趋势</span><strong>{period === 'week' ? '本周 14.6 小时' : '本月 58.2 小时'}</strong></div><small>小时 / 日</small></header><Sparkline data={period === 'week' ? [1.3, 2.2, 1.8, 3.4, 2.6, 1.9, 2.8] : [22, 31, 28, 45, 39, 51, 58]} height={110} width={420} label="学习时长上升趋势" /><Progress label="本周目标" value={14.6} max={18} /></article>
      <article className="workspace-panel workspace-tasks"><header><div><span>今日任务</span><strong>{completed.length} / {taskOptions.length} 已完成</strong></div><Button size="sm" variant="quiet" onClick={() => setDrawerOpen(true)}>编辑</Button></header><CheckboxGroup options={taskOptions} value={completed} onChange={setCompleted} /></article>
    </div>
    <article className="workspace-panel workspace-loading"><header><div><span>加载状态</span><strong>内容骨架</strong></div><small>保持布局稳定，降低等待焦虑</small></header><div className="workspace-skeleton"><Skeleton circle width={42} height={42} /><div><Skeleton width="42%" /><Skeleton height={12} width="88%" /><Skeleton height={12} width="66%" /></div></div></article>
    <Drawer open={drawerOpen} title="安排今日任务" onClose={() => setDrawerOpen(false)} footer={<><Button variant="quiet" onClick={() => setDrawerOpen(false)}>取消</Button><Button onClick={() => setDrawerOpen(false)}>保存安排</Button></>}><div className="demo-stack"><Select label="任务类型" defaultValue="study" options={[{ label: '学习', value: 'study' }, { label: '复盘', value: 'review' }, { label: '练习', value: 'practice' }]} /><RadioGroup label="优先级" direction="row" defaultValue="normal" options={[{ label: '普通', value: 'normal' }, { label: '优先', value: 'high' }]} /><p className="workspace-drawer-note">Drawer 保留原页面上下文，适合承载比 Popover 更复杂、又不需要阻断当前任务的内容。</p></div></Drawer>
  </section>;
}
