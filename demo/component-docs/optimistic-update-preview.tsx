import { useRef, useState } from 'react';
import { Button, OptimisticUpdate } from '../../src';

function waitForServer(signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(new Error('cancelled')); return; }
    const abort = () => { clearTimeout(timer); reject(new Error('cancelled')); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, 900);
    signal.addEventListener('abort', abort, { once: true });
  });
}

export function OptimisticUpdatePreview() {
  const fail = useRef(false);
  const [armed, setArmed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [requests, setRequests] = useState(0);
  async function save(next: boolean, signal: AbortSignal) {
    const shouldFail = fail.current;
    fail.current = false;
    setArmed(false);
    setRequests(count => count + 1);
    await waitForServer(signal);
    if (signal.aborted) throw new Error('cancelled');
    if (shouldFail) throw new Error('demo rejection');
    setConfirmed(next);
    return next;
  }
  return <div className="optimistic-demo">
    <article className="optimistic-demo__item">
      <h3>让等待变得可感知</h3>
      <p>收藏立即改变，保存期间可继续切换。连续点击后只提交最后一个等待中的目标。</p>
      <OptimisticUpdate operationKey="article-favorite" initialValue={false} onUpdate={save} label="收藏">
        {({ value, phase, disabled, update, retry }) => <div className="optimistic-demo__actions">
          <Button variant={value ? 'primary' : 'outline'} aria-disabled={disabled} aria-pressed={value} onClick={() => update(!value)}>{value ? '已收藏' : '收藏文章'}</Button>
          <Button variant="quiet" aria-disabled={disabled || phase !== 'error'} onClick={retry}>重试保存</Button>
        </div>}
      </OptimisticUpdate>
      <p className="optimistic-demo__meta">服务端确认：{confirmed ? '已收藏' : '未收藏'} · 已发出 {requests} 次请求</p>
      <Button variant="outline" aria-pressed={armed} onClick={() => { fail.current = !fail.current; setArmed(fail.current); }}>
        {armed ? '下一次请求将失败' : '模拟下次请求失败'}
      </Button>
    </article>
    <article className="optimistic-demo__item">
      <h3>通知偏好</h3>
      <p>独立设置拥有独立请求会话，互不回滚。</p>
      <OptimisticUpdate operationKey="notification-setting" initialValue="摘要" label="通知偏好"
        onUpdate={async (next, signal) => { await waitForServer(signal); return next; }}>
        {({ value, phase, disabled, update, retry }) => <div className="optimistic-demo__actions">
          {['关闭', '摘要', '全部'].map(option => <Button key={option} variant={value === option ? 'primary' : 'outline'} aria-disabled={disabled} aria-pressed={value === option} onClick={() => update(option)}>{option}</Button>)}
          <Button variant="quiet" aria-disabled={disabled || phase !== 'error'} onClick={retry}>重试设置</Button>
        </div>}
      </OptimisticUpdate>
    </article>
  </div>;
}
