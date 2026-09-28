import { useState } from 'react';
import { Avatar, Badge, Button, Container, Descriptions, Grid, List, Pagination, SegmentedControl, Stack, Stat, Table } from '../src';

const projects = [
  { id: 'HF-128', name: '移动端导航重构', owner: '林晓', status: '进行中', updated: '10 分钟前' },
  { id: 'HF-117', name: '数据概览体验优化', owner: '陈默', status: '待评审', updated: '昨天' },
  { id: 'HF-096', name: '权限模型梳理', owner: 'Alex Chen', status: '已完成', updated: '8 月 17 日' },
];

export function DataLayoutShowcase() {
  const [page, setPage] = useState(1); const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable'); const [selected, setSelected] = useState(projects[0]!);
  return <section className={`demo-section data-layout-showcase is-${density}`} aria-labelledby="data-layout-title">
    <div className="demo-section__heading"><div><p className="demo-kicker">DATA & LAYOUT</p><h2 id="data-layout-title">让密集信息仍然容易扫描</h2></div><SegmentedControl label="数据密度" value={density} onChange={setDensity} options={[{ label: '舒展', value: 'comfortable' }, { label: '紧凑', value: 'compact' }]} /></div>
    <Container size="full" padding={0}><Stack gap={18}>
      <Grid columns={3} minItemWidth={210}><Stat label="活跃项目" value="24" trend="较上周 +12%" tone="blue" /><Stat label="按时完成" value="91.6%" trend="保持稳定" tone="green" /><Stat label="待处理事项" value="7" trend="其中 2 项即将到期" tone="amber" /></Grid>
      <div className="data-layout-showcase__workspace">
        <div><Table caption="最近更新的项目" rowKey="id" striped data={projects} onRowClick={setSelected} columns={[{ key: 'name', header: '项目', render: (item) => <Stack direction="row" gap={10} align="center"><Avatar name={item.owner} size="sm" /><span><strong>{item.name}</strong><small>{item.id}</small></span></Stack> }, { key: 'owner', header: '负责人' }, { key: 'status', header: '状态', render: (item) => <Badge tone={item.status === '已完成' ? 'success' : item.status === '待评审' ? 'warning' : 'primary'} dot>{item.status}</Badge> }, { key: 'updated', header: '最近更新', align: 'right' }]} /><Pagination page={page} total={58} pageSize={10} onChange={setPage} /></div>
        <aside><header><span>SELECTED</span><h3>{selected.name}</h3></header><Descriptions columns={2} bordered items={[{ key: 'id', label: '项目编号', value: selected.id }, { key: 'owner', label: '负责人', value: selected.owner }, { key: 'status', label: '当前状态', value: selected.status }, { key: 'updated', label: '最近更新', value: selected.updated }]} /><List items={[{ key: 1, title: '完成交互评审', description: '产品与前端共同确认', trailing: '今天' }, { key: 2, title: '补充移动端用例', description: '覆盖 390px 与横屏', trailing: '明天' }]} /><Button size="sm" variant="secondary">查看项目详情</Button></aside>
      </div>
    </Stack></Container>
  </section>;
}
