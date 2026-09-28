import { useEffect, useRef, useState } from 'react';

interface HoldOptions {
  actionKey: string;
  duration: number;
  blocked: boolean;
  onConfirm: () => void;
}

interface HoldSession {
  source: string;
  started: number;
  actionKey: string;
  duration: number;
  requested: boolean;
}

/** 仅管理一次按住意图；业务结果与数据修改始终由调用方负责。 */
export function useHoldConfirmation(options: HoldOptions) {
  const latest = useRef(options);
  latest.current = options;
  const session = useRef<HoldSession | null>(null);
  const frame = useRef<number | undefined>(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  function stopFrame() {
    if (frame.current !== undefined) cancelAnimationFrame(frame.current);
    frame.current = undefined;
  }

  function cancel() {
    stopFrame();
    if (session.current && !session.current.requested) setMessage('已取消，未发出确认请求');
    session.current = null;
    setProgress(0);
  }

  function tick(now: number) {
    const current = session.current;
    const config = latest.current;
    if (!current || current.requested) return;
    if (config.blocked || document.hidden || current.actionKey !== config.actionKey || current.duration !== config.duration) {
      cancel();
      return;
    }
    const next = Math.min(1, (now - current.started) / current.duration);
    setProgress(next);
    if (next < 1) {
      frame.current = requestAnimationFrame(tick);
      return;
    }
    frame.current = undefined;
    current.requested = true;
    setMessage('已发出确认请求，请等待操作结果');
    config.onConfirm();
  }

  function start(source: string) {
    if (latest.current.blocked || session.current || document.hidden) return;
    session.current = { source, started: performance.now(), actionKey: latest.current.actionKey,
      duration: latest.current.duration, requested: false };
    setMessage('保持按住，松开可取消');
    setProgress(0);
    frame.current = requestAnimationFrame(tick);
  }

  function release(source: string) {
    if (session.current?.source === source) cancel();
  }

  useEffect(() => {
    cancel();
  }, [options.actionKey, options.duration, options.blocked]);

  useEffect(() => {
    const hide = () => { if (document.hidden) cancel(); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') cancel(); };
    document.addEventListener('visibilitychange', hide);
    document.addEventListener('keydown', escape);
    window.addEventListener('blur', cancel);
    return () => {
      stopFrame();
      session.current = null;
      document.removeEventListener('visibilitychange', hide);
      document.removeEventListener('keydown', escape);
      window.removeEventListener('blur', cancel);
    };
  }, []);

  return { progress, message, start, release, cancel };
}
