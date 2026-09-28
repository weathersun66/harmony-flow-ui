import { useState } from 'react';
import { ChartCrosshair, DrilldownChart, HotspotGuide } from '../workspace/InspectableLibrary';

export function HotspotGuidePreview() {
  const [unread, setUnread] = useState(true);
  return <div className="reading-preview">
    <strong>数据工作台</strong>
    <p>将常用报表保存到工作台，便于团队查看。</p>
    <HotspotGuide title="新的筛选方式" unread={unread} onAcknowledge={() => setUnread(false)}>
      可以先选择图例，再按月份筛选。筛选只影响当前视图，不修改原始数据。
    </HotspotGuide>
  </div>;
}

export function ChartCrosshairPreview() {
  return <ChartCrosshair label="每周咨询量" formatValue={(value) => `${value}次`} points={[
    { id: 'mon', label: '周一', value: 42 }, { id: 'tue', label: '周二', value: 64 },
    { id: 'wed', label: '周三', value: 55 }, { id: 'thu', label: '周四', value: 76 },
    { id: 'fri', label: '周五', value: 68 }, { id: 'sat', label: '周六', value: 94 },
    { id: 'sun', label: '周日', value: 80 },
  ]} />;
}

export function DrilldownChartPreview() {
  const [selected, setSelected] = useState('');
  return <div className="reading-preview">
    <DrilldownChart title="渠道咨询量" formatValue={(value) => `${value}次`} onLeafSelect={(item) => setSelected(item.label)} items={[
      { id: 'search', label: '自然搜索', value: 340, children: [
        { id: 'desktop', label: '桌面搜索', value: 220 }, { id: 'mobile', label: '移动搜索', value: 120 },
      ] },
      { id: 'social', label: '社交渠道', value: 210, children: [
        { id: 'content', label: '内容推荐', value: 150 }, { id: 'shared', label: '用户分享', value: 60 },
      ] },
      { id: 'direct', label: '直接访问', value: 90 },
    ]} />
    {selected && <p role="status">已选明细：{selected}</p>}
  </div>;
}
