import type { ComponentDoc } from './types';
import { UndoNoticePreview } from './undo-preview';
import './confirmation-docs.css';
import './row-action-docs.css';

export const undoDocs: readonly ComponentDoc[] = [{
  name: 'UndoNotice', title: '操作后撤销', category: '反馈',
  description: '在可逆操作执行后提供明确的恢复入口，区分请求中、已撤销、失败和过期；默认不限制操作时间。',
  importCode: "import { UndoNotice } from '@hxdhxd/harmony-flow-ui';",
  exampleCode: '<UndoNotice operationKey={operation.id} message="项目已归档" onUndo={async (signal) => { await restoreProject(operation.id, { signal }); }} />',
  preview: <UndoNoticePreview />,
  props: [
    { name: 'operationKey / message', type: 'string / string', defaultValue: '必填', description: '已执行操作标识 / 结果说明；每次新操作必须换标识，旧请求信号会被中止。修改文案或期限不会重置已撤销状态' },
    { name: 'onUndo', type: '(signal: AbortSignal) => Promise<void>', defaultValue: '必填', description: '业务恢复请求，真正成功才resolve；拒绝显示失败。请求中防重复，卸载或换对象中止信号并忽略迟到结果' },
    { name: 'expiresAt', type: 'number', defaultValue: '不限制', description: '绝对截止时间（毫秒）；非有限值禁止操作。悬停、焦点、后台不延长；截止前已发出的请求仍等待结果，到期不会自动提交/删除数据' },
    { name: 'undoLabel / successMessage / errorMessage', type: 'string', defaultValue: '撤销 / 已撤销操作 / 撤销失败，请稍后重试。', description: '操作及结果文案；错误不显示原始服务端信息；空白结果文案使用安全默认值' },
    { name: 'disabled / className', type: 'boolean / string', defaultValue: 'false / —', description: '阻止新请求（不中止在途请求）/ 根样式类' },
  ],
  keyboard: 'Tab聚焦撤销按钮，Enter/Space触发；等待、成功、过期时按钮仍可聚焦读取说明，但不能重复触发。状态polite播报，倒计时不逐秒播报。不自动消失、不抢焦点。业务负责认证、幂等、网络超时和脱敏审计；AbortSignal不保证服务器回滚。有限期限时，应在上层提供历史记录等持久恢复入口。演示为本地状态，不访问服务器。',
  related: ['SwipeActions', 'Toast', 'TypedConfirm'],
}];
