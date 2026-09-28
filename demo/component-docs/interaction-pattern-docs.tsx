import type { ComponentDoc, ComponentPropDoc } from './types';
import { AnnouncementBarPreview, OnboardingChecklistPreview, ReadMorePreview, SortableListPreview } from './interaction-pattern-previews';
import './interaction-pattern-docs.css';

const prop = (name: string, type: string, defaultValue: string, description: string): ComponentPropDoc => ({ name, type, defaultValue, description });

export const interactionPatternDocs: readonly ComponentDoc[] = [
  {
    name: 'ReadMore', title: '长文展开', category: '数据展示',
    description: '将长文本截断为指定行数，按需原地展开和收起；短文本不显示多余操作。',
    importCode: "import { ReadMore } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<ReadMore text={article} lines={3} expanded={expanded} onExpandedChange={setExpanded} />',
    preview: <ReadMorePreview />,
    props: [
      prop('text', 'string', '必填', '纯文本内容，支持换行；不接受HTML或可交互子组件'),
      prop('lines', 'number', '3', '收起行数，非有限值回退为3，最少1行'),
      prop('expanded / defaultExpanded', 'boolean', 'false', '受控展开 / 非受控初始展开'),
      prop('onExpandedChange', '(expanded: boolean) => void', '—', '切换请求；受控时需调用方更新expanded'),
      prop('expandLabel / collapseLabel', 'string', '展开全文 / 收起全文', '按钮文案'),
      prop('className', 'string', '—', '根节点样式类'),
    ],
    keyboard: 'Tab进入按钮，Enter或Space切换；aria-expanded与aria-controls关联正文。视觉截断不删除屏幕阅读器可读的全文。',
    related: ['Accordion', 'Typography'],
  },
  {
    name: 'AnnouncementBar', title: '轮播公告条', category: '反馈',
    description: '在当前页面展示多条公告，支持手动轮播、暂停、操作与关闭；空消息数组不渲染。',
    importCode: "import { AnnouncementBar } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<AnnouncementBar items={[{ id: "update", message: "组件评审安排已更新", actionLabel: "查看安排" }]} onAction={openSchedule} />',
    preview: <AnnouncementBarPreview />,
    props: [
      prop('items', 'readonly Announcement[]', '必填', '唯一稳定id、message文字、可选actionLabel'),
      prop('label', 'string', '公告', '区域名称'),
      prop('autoPlay', 'boolean', 'false', '开启自动轮播；减少动态偏好下只允许手动切换'),
      prop('interval', 'number', '6000', '轮播间隔毫秒，最小3000；非有限值回退6000'),
      prop('onAction', '(id: string) => void', '—', '当前公告操作，未传则不渲染操作按钮'),
      prop('onDismiss', '() => void', '—', '关闭请求；调用方负责隐藏公告'),
      prop('className', 'string', '—', '根节点样式类'),
    ],
    keyboard: 'Tab和Enter操作；焦点进入、悬停、页面后台均暂停自动切换，手动切换停止轮播。播放按钮失焦后才恢复自动切换。自动轮播不逐条打断屏幕阅读器。',
    related: ['NotificationCenter', 'Alert', 'Toast'],
  },
  {
    name: 'OnboardingChecklist', title: '新手任务清单', category: '反馈',
    description: '以任务清单记录入门进度，突出下一步，支持禁用任务与全部完成反馈。',
    importCode: "import { OnboardingChecklist } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<OnboardingChecklist title="开始使用" items={tasks} onTaskAction={openTask} />',
    preview: <OnboardingChecklistPreview />,
    props: [
      prop('items', 'readonly OnboardingTask[]', '必填', '唯一id、title、description、completed、disabled、actionLabel'),
      prop('title', 'string', '开始使用', '区域标题与无障碍名称'),
      prop('onTaskAction', '(id: string) => void', '—', '请求执行任务；不会自行标记完成'),
      prop('onDismiss', '() => void', '—', '关闭请求，由调用方控制显示'),
      prop('completedMessage', 'ReactNode', '全部任务已完成', '所有任务完成后的反馈'),
      prop('emptyMessage', 'ReactNode', '暂无引导任务', '无任务时的反馈，不虚报完成'),
      prop('className', 'string', '—', '根节点样式类'),
    ],
    keyboard: 'Tab进入任务操作；Enter或Space执行。已完成任务不重复显示按钮，禁用任务不可操作。原生progress和status公布进度，不依赖颜色。',
    related: ['Steps', 'ProgressBar', 'EmptyState'],
  },
  {
    name: 'SortableList', title: '可排序列表', category: '数据展示',
    description: '通过拖动手柄、上下移动按钮或键盘调整同一列表顺序；松手提交、取消保留原序。',
    importCode: "import { SortableList } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<SortableList label="交付顺序" items={items} onOrderChange={setItems} />',
    preview: <SortableListPreview />,
    props: [
      prop('items', 'readonly SortableListItem[]', '必填', '唯一稳定id、label、可选description与disabled；顺序由调用方控制'),
      prop('onOrderChange', '(items: SortableListItem[]) => void', '必填', '返回新数组，不修改原数组；调用方确认后更新items'),
      prop('label', 'string', '排序列表', '列表无障碍名称'),
      prop('disabled', 'boolean', 'false', '禁用全部排序操作'),
      prop('emptyMessage', 'ReactNode', '暂无可排序项目', '空列表文案'),
      prop('className', 'string', '—', '根节点样式类'),
    ],
    keyboard: '聚焦手柄后Alt+上/下立即请求移动，或Tab到上下按钮；拖动中Escape取消，放到列表外取消。支持触摸手柄。disabled项不能被直接移动，但其他项排序可能改变其索引。适用于小中型列表，不支持跨列表、虚拟滚动与自动滚屏。',
    related: ['List', 'KanbanBoard', 'Transfer'],
  },
];
