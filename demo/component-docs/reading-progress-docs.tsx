import type { ComponentDoc } from './types';
import { ReadingProgressPreview } from './reading-progress-preview';

export const readingProgressDocs: readonly ComponentDoc[] = [{
  name: 'ReadingProgress', title: '阅读进度', category: '导航',
  description: '随整页或独立容器的滚动位置更新进度，帮助长报告读者了解当前位置与剩余距离。',
  importCode: "import { ReadingProgress } from '@hxdhxd/harmony-flow-ui';",
  exampleCode: 'const [target, setTarget] = useState<HTMLDivElement | null>(null);\n<div ref={setTarget} style={{ height: 320, overflowY: "auto" }} tabIndex={0}>长报告内容</div>\n<ReadingProgress target={target} />',
  preview: <ReadingProgressPreview />,
  props: [
    { name: 'target', type: 'HTMLElement | null', defaultValue: '整页', description: '省略时监听页面；传滚动容器元素时测量该容器；null表示尚未挂载，显示0。使用回调ref配合state，元素更换后自动解绑旧容器' },
    { name: 'label', type: 'string', defaultValue: '阅读进度', description: '可访问名称和可见文案；空白使用默认名称' },
    { name: 'showValue', type: 'boolean', defaultValue: 'true', description: '是否显示名称和整数百分比；关闭后仍保留进度条可访问名称及数值' },
    { name: 'className', type: 'string', defaultValue: '—', description: '根元素样式类；默认处于文档流，由调用方安排底部或粘性位置' },
  ],
  keyboard: '进度条只读、不进入Tab序列，不逐次live播报。示例阅读区支持Tab聚焦和方向键/PageDown滚动，也支持触摸。按scrollTop/(scrollHeight-clientHeight)取整并限制在0到100；无需滚动时为100。内容增删、属性或尺寸变化后重新测量，非轮询；卸载清理监听和观察器。不追踪停留时间，不记录已读状态，不推断任务完成。服务端初始值为0，挂载后测量；请为滚动容器提供明确高度。',
  related: ['Scrollspy', 'ReadMore', 'StepProgress'],
}];
