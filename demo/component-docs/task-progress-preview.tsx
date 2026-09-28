import { useRef, useState } from 'react';
import { Button, TaskProgress, type TaskProgressContext } from '../../src';

const stages = [
  { id: 'prepare', label: '准备数据', description: '校验输入并建立后台任务。' },
  { id: 'process', label: '生成内容', description: '后台处理主要工作。' },
  { id: 'deliver', label: '返回结果', description: '保存产物并返回可用结果。' },
] as const;

function delay(milliseconds: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, milliseconds);
    signal.addEventListener('abort', () => { clearTimeout(timer); reject(new Error('cancelled')); }, { once: true });
  });
}

export function TaskProgressPreview() {
  const failNext = useRef(false);
  const [taskKey, setTaskKey] = useState(0);
  const [armed, setArmed] = useState(false);
  async function run({ signal, report }: TaskProgressContext) {
    for (const [index, stage] of stages.entries()) {
      report({ stageId: stage.id, progress: index * 34, message: `正在${stage.label}…` });
      await delay(650, signal);
      if (stage.id === 'process' && failNext.current) {
        failNext.current = false; setArmed(false); throw new Error('demo failure');
      }
    }
    return { name: '内容分析报告.pdf', summary: '已生成并保存到项目文件。' };
  }
  return <div className="task-progress-demo">
    <TaskProgress key={taskKey} taskKey={taskKey} title="生成分析报告" stages={stages} run={run}
      renderResult={result => <div><strong>{result.name}</strong><p>{result.summary}</p></div>} />
    <div className="task-progress-demo__tools">
      <Button variant="outline" aria-pressed={armed} onClick={() => { failNext.current = !failNext.current; setArmed(failNext.current); }}>
        {armed ? '下次执行将在处理中失败' : '模拟下次执行失败'}
      </Button>
      <Button variant="quiet" onClick={() => setTaskKey(value => value + 1)}>切换任务</Button>
    </div>
  </div>;
}
