import type { ComponentDoc, ComponentPropDoc } from './types';
import { ZoomableChart } from '../workspace/InspectableLibrary';

const prop = (name: string, type: string, defaultValue: string, description: string): ComponentPropDoc => ({ name, type, defaultValue, description });
const points = Array.from({ length: 30 }, (_, index) => ({ id: String(index), label: `${index + 1}日`, value: 40 + index * 2 + (index % 4) * 6 }));
export const manipulationDocs: readonly ComponentDoc[] = [{
  name: 'ZoomableChart', title: '图表缩放视窗', category: '数据展示',
  description: '从全量趋势放大局部区间，平移浏览相邻数据，并随时还原完整视图。',
  importCode: "import { ZoomableChart } from '@hxdhxd/harmony-flow-ui';",
  exampleCode: '<ZoomableChart points={points} window={range} onWindowChange={setRange} label="每日访问量" />',
  preview: <ZoomableChart points={points} label="每日咨询量" formatValue={(value) => `${value}次`} />,
  props: [
    prop('points', 'readonly CrosshairPoint[]', '必填', '复用逐点读数的数据结构：唯一id、label、有限数值或null；数组顺序即离散横轴顺序'),
    prop('window / defaultWindow', 'readonly [number, number]', '— / 全量', '包含两端点的零起始索引区间，受控/非受控；非有限值回退，排序夹取，至少两点（数据不足时除外）'),
    prop('onWindowChange', '(window: [number, number]) => void', '—', '缩放、平移或区间选择请求；受控时调用方决定是否更新'),
    prop('label / formatValue', 'string / (value: number) => string', '趋势缩放 / String', '图表标题 / 纵轴和读数格式化'),
    prop('disabled / className', 'boolean / string', 'false / —', '禁用全部操作 / 根样式类'),
  ],
  keyboard: 'Tab进入放大、缩小、前后平移、还原按钮，Enter/Space执行；区间和读数滑块支持方向键/Home/End。放大以中点缩短区间，平移半个视窗；不会劫持页面滚轮。仅等距离散单序列，不支持双指手势、连续时间插值或网络数据加载。',
  related: ['ChartCrosshair', 'RangeBrush', 'LegendFilter'],
}];
