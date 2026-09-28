import type { ComponentDoc, ComponentPropDoc } from './types';
import { HoldConfirmationPreview, TypedConfirmationPreview } from './confirmation-previews';
import './confirmation-docs.css';

const prop = (name: string, type: string, defaultValue: string, description: string): ComponentPropDoc => ({ name, type, defaultValue, description });
const commonProps = [
  prop('actionKey', 'string', '必填', '操作对象标识；对象变化必须同步修改，避免复用旧确认意图'),
  prop('label', 'string', '必填', '明确描述确认的操作'),
  prop('onConfirm', '() => void', '必填', '只发出确认请求；权限、幂等、数据修改和请求结果由业务管理'),
  prop('disabled / loading / error', 'boolean / boolean / string', 'false / false / —', '禁用、请求处理中与业务错误；不会自行宣称成功'),
  prop('className', 'string', '—', '根样式类'),
];

export const confirmationDocs: readonly ComponentDoc[] = [
  {
    name: 'HoldToConfirm', title: '长按确认', category: '反馈',
    description: '保持按住达到时长才发出请求，提前松开取消；提供无时间要求的分步确认。',
    importCode: "import { HoldToConfirm } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<HoldToConfirm actionKey={task.id} label="归档任务" duration={1500} onConfirm={archive} loading={pending} error={error} />',
    preview: <HoldConfirmationPreview />,
    props: [...commonProps, prop('duration', 'number', '1500', '按住时长毫秒，有限值夹取500—10000，NaN/Infinity回退1500')],
    keyboard: 'Tab聚焦，保持Space/Enter确认，松开或Escape取消；重复keydown不会重启。移出按钮、失焦、进入后台、pointercancel、对象或时长变化取消。分步确认无需持续按住，Escape/取消返回触发按钮；减少动态下没有装饰动画。每次确认仅代表请求，调用方须立即管理loading和最终结果。',
    related: ['TypedConfirm', 'Button', 'Popconfirm'],
  },
  {
    name: 'TypedConfirm', title: '输入文字确认', category: '反馈',
    description: '要求用户输入指定内容，精确匹配后才能确认，适合需要明确操作对象的场景。',
    importCode: "import { TypedConfirm } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: '<TypedConfirm actionKey={environment.id} label="移除临时环境" confirmationText={environment.name} onConfirm={remove} loading={pending} error={error} />',
    preview: <TypedConfirmationPreview />,
    props: [...commonProps,
      prop('confirmationText', 'string', '必填', '精确匹配，区分大小写与空格；空白或含换行的目标禁止确认；目标变化清空输入'),
      prop('description / confirmLabel', 'string / string', '— / 确认执行', '后果说明 / 确认按钮文字'),
    ],
    keyboard: 'Tab输入；精确匹配后Enter或按钮确认，组合输入期间不提交；每次请求后清空输入，重新确认需再次输入。允许粘贴，不作为安全认证或后端授权机制。没有隐式表单提交，不自动关闭外部Modal。',
    related: ['HoldToConfirm', 'Input', 'Modal'],
  },
];
