import { useEffect, useRef, useState } from 'react';

type UndoPhase = 'ready' | 'pending' | 'undone' | 'failed';

/** 每个已执行操作只维护一个恢复请求；业务负责幂等和网络超时。 */
export function useUndoRequest(onUndo: (signal: AbortSignal) => Promise<void>) {
  const [phase, setPhase] = useState<UndoPhase>('ready');
  const currentPhase = useRef<UndoPhase>('ready');
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  async function undo() {
    if (currentPhase.current === 'pending' || currentPhase.current === 'undone') return;
    const controller = new AbortController();
    request.current = controller;
    currentPhase.current = 'pending';
    setPhase('pending');
    try {
      await onUndo(controller.signal);
      if (controller.signal.aborted) return;
      currentPhase.current = 'undone';
      setPhase('undone');
    } catch {
      // 不把服务端原始错误（可能含敏感数据）暴露到提示区。
      // 原始错误及请求标识应由调用方在请求层记录；这里明确呈现失败。
      if (controller.signal.aborted) return;
      currentPhase.current = 'failed';
      setPhase('failed');
    } finally {
      if (request.current === controller) request.current = null;
    }
  }

  return { phase, undo };
}
