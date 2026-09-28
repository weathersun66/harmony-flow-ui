import { useState } from 'react';
import { Button, HoldToConfirm, TypedConfirm } from '../workspace/InspectableLibrary';

export function HoldConfirmationPreview() {
  const [archived, setArchived] = useState(false);
  return <div className="hf-confirm-demo">
    <header><span>任务记录</span><h3>归档本周已完成任务</h3></header>
    <p>将 12 项已完成任务移出当前视图，归档后仍可恢复。</p>
    <HoldToConfirm actionKey="weekly-tasks" label="归档已完成任务" disabled={archived}
      onConfirm={() => setArchived(true)} />
    <p role="status">{archived ? '12 项任务已归档' : '12 项任务待归档'}</p>
    {archived && <Button variant="outline" onClick={() => setArchived(false)}>恢复任务</Button>}
  </div>;
}

export function TypedConfirmationPreview() {
  const [removed, setRemoved] = useState(false);
  return <div className="hf-confirm-demo">
    <header><span>临时资源</span><h3>结束发布预演</h3></header>
    <TypedConfirm actionKey="release-preview" label="移除临时预览环境" confirmationText="release-preview"
      description="移除后当前预览入口将不可用，不影响正式环境。" confirmLabel="移除预览环境"
      disabled={removed} onConfirm={() => setRemoved(true)} />
    <p role="status">{removed ? '临时预览环境已移除' : '临时预览环境运行中'}</p>
    {removed && <Button variant="outline" onClick={() => setRemoved(false)}>重新创建预览</Button>}
  </div>;
}
