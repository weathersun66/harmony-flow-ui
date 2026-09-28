import { useState } from 'react';
import { Button, ChecklistConfirm, SwipeActions } from '../workspace/InspectableLibrary';

export function SwipeActionsPreview() {
  const [archived, setArchived] = useState(false);
  const [message, setMessage] = useState('向左滑动任务，或点击显示操作。');
  return <div className="hf-confirm-demo hf-row-action-demo">
    <header><span>行操作</span><h3>今天的安排</h3></header>
    {!archived ? <SwipeActions actionKey="research-notes" label="整理访谈笔记" actions={[
      { id: 'pin', label: '置顶', onAction: () => setMessage('整理访谈笔记已置顶') },
      { id: 'archive', label: '归档', onAction: () => { setArchived(true); setMessage('整理访谈笔记已归档'); } },
    ]}><strong>整理访谈笔记</strong><p>19:00 · 用户研究 · 6 位受访者</p></SwipeActions>
      : <Button variant="outline" onClick={() => { setArchived(false); setMessage('任务已恢复'); }}>恢复任务</Button>}
    <p role="status">{message}</p>
  </div>;
}

export function ChecklistConfirmPreview() {
  const [finished, setFinished] = useState(false);
  return <div className="hf-confirm-demo hf-row-action-demo">
    <header><span>变更复核</span><h3>关闭临时协作空间</h3></header>
    <ChecklistConfirm actionKey="review-space" title="逐项确认影响范围" disabled={finished}
      confirmLabel="关闭临时空间" items={[
        { id: 'files', label: '已导出需要保留的文件', description: '关闭后成员将无法访问该空间的文件。' },
        { id: 'links', label: '已确认共享链接失效', description: '所有对外分享入口将停止服务。' },
        { id: 'members', label: '已通知协作成员', description: '本次操作只影响当前临时空间。' },
      ]} onConfirm={() => setFinished(true)} />
    <p role="status">{finished ? '临时协作空间已关闭' : '临时协作空间开放中'}</p>
    {finished && <Button variant="outline" onClick={() => setFinished(false)}>重新开放空间</Button>}
  </div>;
}
