import type { ComponentDoc } from './types';
import { TaskProgressPreview } from './task-progress-preview';
import './task-progress-docs.css';

export const taskProgressDocs: readonly ComponentDoc[] = [{
  name: 'TaskProgress', title: '任务进度', category: '反馈',
  description: '呈现多阶段后台任务的实时进度，支持取消、失败重试及完成结果返回。',
  importCode: "import { TaskProgress } from '@hxdhxd/harmony-flow-ui';",
  exampleCode: '<TaskProgress taskKey={job.id} stages={stages} run={async ({ signal, report }) => { report({ stageId: "prepare", progress: 10 }); return await createReport({ signal }); }} renderResult={result => <a href={result.url}>下载结果</a>} />',
  preview: <TaskProgressPreview />,
  props: [
    { name: 'taskKey', type: 'string | number', defaultValue: '必填', description: '任务及版本标识；变化时重建会话、中止旧任务并隔离迟到结果' },
    { name: 'stages', type: 'readonly TaskProgressStage[]', defaultValue: '必填', description: '有序阶段；id在单个任务内唯一且应保持稳定' },
    { name: 'run', type: '(context: TaskProgressContext) => Promise<TResult>', defaultValue: '必填', description: '启动后台任务；通过report推进阶段与百分比，成功返回业务结果，并响应AbortSignal' },
    { name: 'title', type: 'ReactNode', defaultValue: '任务进度', description: '任务可访问标题' },
    { name: 'autoStart', type: 'boolean', defaultValue: 'false', description: '挂载后自动开始；StrictMode下仍只接受一个在途任务' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '禁止开始或重新执行；不强制中断已经运行的任务' },
    { name: 'renderResult', type: '(result: TResult) => ReactNode', defaultValue: '—', description: '任务成功后渲染返回结果；组件不复制或持久化业务结果' },
    { name: 'onPhaseChange', type: '(phase: TaskProgressPhase) => void', defaultValue: '—', description: '任务阶段变化通知：idle/running/success/error/cancelled' },
    { name: 'className', type: 'string', defaultValue: '—', description: '根元素样式类' },
  ],
  keyboard: '开始、取消和重新执行均使用原生按钮，支持Tab与Enter/Space。运行状态由status播报，失败由alert公布；进度条提供当前百分比，活动阶段提供aria-current。取消会触发AbortSignal并隔离迟到结果；失败可从头重新执行。taskKey变化或卸载会中止当前信号。原始异常不会直接暴露；业务负责网络超时、服务端取消、幂等与结果持久化。',
  related: ['ProgressBar', 'Result', 'LoadMore', 'OptimisticUpdate'],
}];
