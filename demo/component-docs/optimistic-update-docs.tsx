import type { ComponentDoc } from './types';
import { OptimisticUpdatePreview } from './optimistic-update-preview';
import './optimistic-update-docs.css';

export const optimisticUpdateDocs: readonly ComponentDoc[] = [{
  name: 'OptimisticUpdate', title: '乐观更新', category: '反馈',
  description: '立即呈现最新操作，串行保存目标值；失败回滚最近确认值，并支持重试与会话隔离。',
  importCode: "import { OptimisticUpdate, Button } from '@hxdhxd/harmony-flow-ui';",
  exampleCode: '<OptimisticUpdate operationKey={`${item.id}:${item.version}`} initialValue={item.favorite} onUpdate={async (next, signal) => { const saved = await saveFavorite(item.id, next, { signal }); return saved.favorite; }} label="收藏">\n  {({ value, phase, disabled, update, retry }) => <>\n    <Button aria-pressed={value} disabled={disabled} onClick={() => update(!value)}>{value ? "已收藏" : "收藏"}</Button>\n    <Button aria-disabled={disabled || phase !== "error"} onClick={retry}>重试</Button>\n  </>}\n</OptimisticUpdate>',
  preview: <OptimisticUpdatePreview />,
  props: [
    { name: 'operationKey', type: 'string | number', defaultValue: '必填', description: '对象及版本的会话标识；变化时重置为initialValue、中止旧信号并隔离旧响应' },
    { name: 'initialValue', type: 'T', defaultValue: '必填', description: '会话初始确认值，仅初始化；外部刷新值时同时更新operationKey。不与内部value双向绑定' },
    { name: 'onUpdate', type: '(next: T, signal: AbortSignal) => Promise<T>', defaultValue: '必填', description: '保存完整目标值，返回服务端确认值（可正规化）；失败reject。业务负责超时、幂等、signal检查和服务端版本冲突' },
    { name: 'children', type: '(state: OptimisticUpdateState<T>) => ReactNode', defaultValue: '必填', description: 'value为当前显示值；phase为idle/pending/success/error；update(next)立即更新；retry()重试失败目标；disabled供控件使用。不要原地修改对象值' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '拦截新意图与重试；已经接受的请求和排队目标继续完成' },
    { name: 'label', type: 'string', defaultValue: '更新', description: '分组可访问名称及保存状态前缀；空白回退默认值' },
    { name: 'errorMessage', type: 'string', defaultValue: '保存失败，已恢复最近确认的状态，请重试。', description: '失败提示，原始错误不直接显示；空白回退默认文案' },
    { name: 'className', type: 'string', defaultValue: '—', description: '根元素样式类' },
  ],
  keyboard: '由children提供原生按钮/输入语义；示例支持Tab、Enter/Space、触摸和aria-pressed。保存期间不锁定操作，状态通过status播报，最终失败通过alert提示。相同会话只允许一个在途请求；等待中的目标合并到最后一次，旧响应不覆盖较新意图。最终失败回到最近确认值，retry重发失败目标；不自动无限重试。组件不重挂载children以保留焦点，operationKey切换会重挂载整个会话。仅用于绝对目标值设置，不用于逐次累加或必须每条执行的命令。SSR输出初始值且不请求；卸载中止信号。跨会话、跨客户端服务端写入顺序须由业务版本校验保障。',
  related: ['UndoNotice', 'LoadMore', 'Button', 'Switch'],
}];
