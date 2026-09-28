import { useState } from 'react';
import { AnnouncementBar, Button, OnboardingChecklist, ReadMore, SortableList } from '../workspace/InspectableLibrary';
import type { SortableListItem, OnboardingTask } from '../workspace/InspectableLibrary';

const article = '一个好用的组件，需要回答用户在操作前、操作中和操作后的问题。操作前，清楚说明它会改变什么；操作中，让进度、当前位置和可取消的范围可见；操作后，用明确反馈告诉用户发生了什么。\n\n长文不一定需要新页面。当阅读仍属于当前任务时，可以先展示摘要，再原地展开全文，保持上下文与阅读位置。键盘用户也应能完成同样的操作，减少动态效果的偏好需要得到尊重。\n\n组件的外观由主题令牌统一管理，完成状态由业务数据决定。即使内容为空、网络失败或文字很长，也应有清楚的呈现方式，而不是让用户猜测。';

export function ReadMorePreview() {
  const [expanded, setExpanded] = useState(false);
  return <div className="docs-pattern-stack">
    <ReadMore text={article} lines={3} expanded={expanded} onExpandedChange={setExpanded} />
    <div className="docs-pattern-secondary"><strong>短文本不会出现多余按钮</strong><ReadMore text="内容已经完整显示，无需展开。" /></div>
  </div>;
}

export function AnnouncementBarPreview() {
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState('');
  return <div className="docs-pattern-stack">
    {visible ? <AnnouncementBar items={[
      { id: 'review', message: '组件评审安排已更新，请查看最新时间。', actionLabel: '查看安排' },
      { id: 'keyboard', message: '新增排序列表支持拖动手柄，也支持键盘和上下移动按钮。' },
      { id: 'notice', message: '公告可以暂停；鼠标悬停、键盘焦点进入和页面切换到后台时，不会自动切换内容。' },
    ]} onAction={() => setMessage('评审时间：周三 14:00，设计协作区。')} onDismiss={() => setVisible(false)} />
      : <Button variant="secondary" onClick={() => setVisible(true)}>重新显示公告</Button>}
    {message && <p role="status">{message}</p>}
  </div>;
}

const initialTasks: OnboardingTask[] = [
  { id: 'workspace', title: '创建工作区', description: '为团队建立统一的协作空间。', completed: true },
  { id: 'profile', title: '完善团队资料', description: '添加团队名称与协作说明。' },
  { id: 'component', title: '添加第一个组件', description: '选择一个组件，查看属性与键盘行为。' },
  { id: 'invite', title: '邀请团队成员', description: '等待管理员开放邀请权限。', disabled: true },
];

export function OnboardingChecklistPreview() {
  const [items, setItems] = useState(initialTasks);
  const [visible, setVisible] = useState(true);
  return <div className="docs-pattern-stack">
    {visible && <OnboardingChecklist title="搭建你的组件工作区" items={items}
      onTaskAction={(id) => setItems(items.map((item) => item.id === id ? { ...item, completed: true } : item))}
      onDismiss={() => setVisible(false)} />}
    <div className="docs-pattern-actions">
      <Button variant="secondary" size="sm" onClick={() => setItems(items.map((item) => ({ ...item, disabled: false })))}>模拟开放邀请权限</Button>
      <Button variant="quiet" size="sm" onClick={() => { setItems(initialTasks); setVisible(true); }}>重置本地演示</Button>
    </div>
    <p className="docs-pattern-note">此处仅演示本地状态变化，实际完成状态应由业务操作确认后传入。</p>
  </div>;
}

const initialOrder: SortableListItem[] = [
  { id: 'research', label: '需求调研', description: '明确目标、边界与使用场景。' },
  { id: 'design', label: '交互设计', description: '确认正常、空白、错误与加载状态。' },
  { id: 'develop', label: '组件开发', description: '实现可复用属性与键盘交互。' },
  { id: 'verify', label: '回归验收', description: '保留测试结果与真实视觉证据。' },
];

export function SortableListPreview() {
  const [items, setItems] = useState(initialOrder);
  const [disabled, setDisabled] = useState(false);
  return <div className="docs-pattern-stack">
    <SortableList label="交付顺序" items={items} onOrderChange={setItems} disabled={disabled} />
    <div className="docs-pattern-actions">
      <Button variant="secondary" size="sm" onClick={() => setDisabled(!disabled)}>{disabled ? '允许排序' : '锁定顺序'}</Button>
      <Button variant="quiet" size="sm" onClick={() => setItems(initialOrder)}>恢复初始顺序</Button>
    </div>
  </div>;
}
