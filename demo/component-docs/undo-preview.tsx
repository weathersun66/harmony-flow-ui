import { useState } from 'react';
import { Button, Checkbox, UndoNotice } from '../workspace/InspectableLibrary';

export function UndoNoticePreview() {
  const [operation, setOperation] = useState(0);
  const [archived, setArchived] = useState(false);
  const [failOnce, setFailOnce] = useState(false);

  async function restore(signal: AbortSignal) {
    await new Promise<void>((resolve, reject) => {
      const abort = () => { window.clearTimeout(timer); reject(new Error('撤销请求已取消')); };
      const timer = window.setTimeout(() => {
        signal.removeEventListener('abort', abort);
        resolve();
      }, 700);
      if (signal.aborted) abort(); else signal.addEventListener('abort', abort, { once: true });
    });
    if (signal.aborted) return;
    if (failOnce) {
      setFailOnce(false);
      throw new Error('演示：暂时无法恢复');
    }
    setArchived(false);
  }

  return <div className="hf-confirm-demo hf-row-action-demo">
    <h3>研究周报 · 第 12 期</h3>
    <p role="status">{archived ? '周报已移入归档' : '周报位于工作列表'}</p>
    <Checkbox label="演示一次撤销失败" checked={failOnce} onChange={(event) => setFailOnce(event.target.checked)} />
    <Button type="button" disabled={archived} onClick={() => { setArchived(true); setOperation((value) => value + 1); }}>归档周报</Button>
    {operation > 0 && <UndoNotice operationKey={String(operation)} message="研究周报已归档"
      onUndo={restore} successMessage="研究周报已恢复到工作列表" errorMessage="暂时无法恢复周报，请重试。" />}
  </div>;
}
