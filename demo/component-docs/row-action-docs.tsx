import type { ComponentDoc, ComponentPropDoc } from './types';
import { ChecklistConfirmPreview, SwipeActionsPreview } from './row-action-previews';
import './confirmation-docs.css';
import './row-action-docs.css';

const prop = (name: string, type: string, defaultValue: string, description: string): ComponentPropDoc => ({ name, type, defaultValue, description });
export const rowActionDocs: readonly ComponentDoc[] = [
  {
    name: 'SwipeActions', title: '滑动行操作', category: '数据展示',
    description: '左滑露出操作、右滑收起，只有点击动作才发出业务请求；始终保留按钮替代手势。',
    importCode: "import { SwipeActions } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<SwipeActions actionKey={task.id} label={task.title} actions={[{ id: "archive", label: "归档", onAction: archive }]}>{task.title}</SwipeActions>',
    preview: <SwipeActionsPreview />,
    props: [
      prop('actionKey / label / children', 'string / string / ReactNode', '必填', '操作对象标识 / 可访问名称 / 行内容；对象变化必须改actionKey'),
      prop('actions', 'readonly SwipeAction[]', '必填', 'id、label、onAction及可选disabled、tone；空列表或标识/名称无效、重复id时不开放操作'),
      prop('open / defaultOpen / onOpenChange', 'boolean / boolean / (open: boolean) => void', '— / false / —', '受控或非受控开关；拒绝更新不会擅自展开；对象或动作结构变化重建内部状态'),
      prop('disabled / className', 'boolean / string', 'false / —', '禁用所有交互 / 根样式类'),
    ],
    keyboard: 'Tab进入显示操作按钮，Enter/Space展开后可访问动作；Escape收起并返回触发按钮。左/右水平滑动至少40px，松手才请求开关，短滑/垂直滑/取消/失焦不提交；内部按钮和输入不启动手势。动作区宽144px，多项可纵向滚动。无持续动画，滑动永不直接执行删除；业务负责请求状态与权限。',
    related: ['SortableList', 'KanbanBoard', 'Button'],
  },
  {
    name: 'ChecklistConfirm', title: '逐项勾选确认', category: '反馈',
    description: '把操作后果逐项列出，要求全部确认后提交；不提供预勾选或一键全选。',
    importCode: "import { ChecklistConfirm } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<ChecklistConfirm actionKey={space.id} title="确认影响范围" items={consequences} onConfirm={closeSpace} loading={pending} error={error} />',
    preview: <ChecklistConfirmPreview />,
    props: [
      prop('actionKey / title', 'string / string', '必填', '操作对象标识 / 清单标题；对象变化重置确认意图'),
      prop('items', 'readonly ConfirmationItem[]', '必填', 'id、label与可选description；内容改变全部清空；空清单、重复id或空白标识/名称禁止提交'),
      prop('onConfirm / confirmLabel', '() => void / string', '必填 / 确认执行', '确认请求 / 按钮文字；每次请求后清空勾选，不假设业务成功'),
      prop('disabled / loading / error / className', 'boolean / boolean / string / string', 'false / false / — / —', '禁用、处理中、业务错误与根样式类'),
    ],
    keyboard: 'Tab逐项访问、Space勾选，全部勾选后可确认；取消任一项立即禁用确认。提交后焦点回到首项，内容或actionKey变更清空。业务须管理loading、权限、幂等和错误重试；本组件不是认证授权或业务任务完成清单。',
    related: ['Checkbox', 'TypedConfirm', 'HoldToConfirm'],
  },
];
