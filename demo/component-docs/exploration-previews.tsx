import { useRef, useState } from 'react';
import { Button, ExpandablePanel, LegendFilter, ProductTour, RangeBrush } from '../workspace/InspectableLibrary';

export function LegendFilterPreview() {
  const [visible, setVisible] = useState(['visits', 'orders']);
  return <div className="exploration-preview">
    <LegendFilter items={[{ id: 'visits', label: '访问量' }, { id: 'orders', label: '订单量', color: 'var(--hf-color-success)' }]}
      visibleKeys={visible} onVisibleKeysChange={setVisible} />
    <div className="exploration-preview__metrics" aria-live="polite">
      {visible.includes('visits') && <div><span>访问量</span><strong>12,840</strong></div>}
      {visible.includes('orders') && <div><span>订单量</span><strong>1,268</strong></div>}
    </div>
  </div>;
}

export function RangeBrushPreview() {
  const [value, setValue] = useState<[number, number]>([3, 9]);
  return <div className="exploration-preview">
    <RangeBrush label="按月份筛选" min={1} max={12} value={value} onValueChange={setValue} formatValue={(v) => `${v}月`}>
      <div className="exploration-preview__bars">{[35, 52, 48, 72, 63, 80, 68, 90, 76, 65, 82, 94].map((height, index) =>
        <span key={index} style={{ height: `${height}%` }} />)}</div>
    </RangeBrush>
    <p role="status">当前区间：{value[0]}月至{value[1]}月 · 共{value[1] - value[0] + 1}个月</p>
  </div>;
}

export function ExpandablePanelPreview() {
  return <ExpandablePanel title="交付概况" summary="设计评审已完成，查看交付内容与备注。">
    <div className="exploration-preview">
      <p>交付包含组件源码、使用示例、键盘交互说明和验收记录。</p>
      <label>交付备注<input className="exploration-preview__input" placeholder="填写备注，收起后内容会保留" /></label>
    </div>
  </ExpandablePanel>;
}

export function ProductTourPreview() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const filters = useRef<HTMLDivElement>(null);
  const range = useRef<HTMLDivElement>(null);
  return <div className="exploration-preview">
    <Button onClick={() => { setCurrent(0); setOpen(true); }}>开始导览</Button>
    <div ref={filters}><LegendFilterPreview /></div>
    <div ref={range}><RangeBrushPreview /></div>
    <ProductTour open={open} current={current} onCurrentChange={setCurrent} onClose={() => setOpen(false)}
      steps={[
        { id: 'legend', title: '选择关注的指标', description: '点击图例可以显示或隐藏指标，至少保留一项。', target: () => filters.current },
        { id: 'range', title: '聚焦一个时间区间', description: '使用起点和终点筛选月份，导览结束后即可操作。', target: () => range.current },
      ]} />
  </div>;
}
