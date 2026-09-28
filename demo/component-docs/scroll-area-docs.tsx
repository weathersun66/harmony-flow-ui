import { ScrollArea, HorizontalScrollArea, VerticalScrollArea } from '../workspace/InspectableLibrary';
import type { ComponentDoc } from './types';

const entries = Array.from({ length: 18 }, (_, index) => <div key={index} style={{ padding: 16, borderBottom: '1px solid var(--hf-color-border)' }}>
  <strong>运行记录 {String(index + 1).padStart(2, '0')}</strong>　组件检查通过 · 支持滚轮、键盘和触摸滑动
</div>);
const cards = <div style={{ display: 'flex', gap: 16, width: 'max-content', padding: 12 }}>
  {Array.from({ length: 8 }, (_, index) => <article key={index} style={{ width: 220, padding: 20, border: '1px solid var(--hf-color-border)', borderRadius: 8, background: 'var(--hf-color-surface)' }}>
    <strong>工作空间 {index + 1}</strong><p>横向滑动浏览更多内容</p>
  </article>)}
</div>;
const props = [
  { name: 'label', type: 'string', defaultValue: '必填', description: '供辅助技术识别滚动区域的名称' },
  { name: 'maxHeight', type: 'CSSProperties["maxHeight"]', defaultValue: '—', description: '纵向内容的最大高度；也可通过 style/className 设置高度' },
  { name: 'onScroll', type: 'UIEventHandler<HTMLDivElement>', defaultValue: '—', description: '原滚动事件；ref 直接指向可滚动节点' },
];
const keyboard = 'Tab 聚焦区域，方向键与 PageUp/PageDown 滚动；保留浏览器滚轮、Shift+滚轮、触摸及滚动条拖动。';
export const scrollAreaDocs: readonly ComponentDoc[] = [
  { name: 'HorizontalScrollArea', title: '横向滚动区域', category: '通用', description: '以统一细圆角滚动条承载横向卡片、宽表格与时间轴。', importCode: "import { HorizontalScrollArea } from '@hxdhxd/harmony-flow-ui';", exampleCode: '<HorizontalScrollArea label="工作空间">\n  <div style={{ width: 1600 }}>横向内容</div>\n</HorizontalScrollArea>', preview: <HorizontalScrollArea label="横向工作空间">{cards}</HorizontalScrollArea>, props, keyboard, related: ['VerticalScrollArea', 'ScrollArea', 'Table'] },
  { name: 'VerticalScrollArea', title: '纵向滚动区域', category: '通用', description: '在受限高度内展示长列表、日志和内容面板，支持键盘与触摸。', importCode: "import { VerticalScrollArea } from '@hxdhxd/harmony-flow-ui';", exampleCode: '<VerticalScrollArea label="运行记录" maxHeight={280}>\n  {records}\n</VerticalScrollArea>', preview: <VerticalScrollArea label="纵向运行记录" maxHeight={280}>{entries}</VerticalScrollArea>, props, keyboard, related: ['HorizontalScrollArea', 'ScrollArea', 'VirtualList'] },
  { name: 'ScrollArea', title: '双向滚动区域', category: '通用', description: '统一双轴滚动容器，保留浏览器滚动坐标与原生输入操作。', importCode: "import { ScrollArea } from '@hxdhxd/harmony-flow-ui';", exampleCode: '<ScrollArea label="审计记录" maxHeight={280}>\n  <div style={{ width: 1200 }}>{records}</div>\n</ScrollArea>', preview: <ScrollArea label="双向审计记录" maxHeight={280}><div style={{ width: 1200 }}>{entries}</div></ScrollArea>, props: [{ name: 'orientation', type: "'horizontal' | 'vertical' | 'both'", defaultValue: "'both'", description: '可滚动方向' }, ...props], keyboard, related: ['HorizontalScrollArea', 'VerticalScrollArea'] },
];
