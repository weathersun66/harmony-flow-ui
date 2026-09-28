import { useEffect, useState } from 'react';

/** 期限来自业务，不因焦点、后台或重渲染延长。 */
export function useUndoDeadline(expiresAt: number | undefined, active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  const valid = expiresAt === undefined || Number.isFinite(expiresAt);
  const expired = expiresAt !== undefined && valid && expiresAt <= Math.max(now, Date.now());

  useEffect(() => {
    if (!active || !valid || expiresAt === undefined || expired) return;
    const update = () => setNow(Date.now());
    const timer = window.setTimeout(update, Math.min(1000, Math.max(1, expiresAt - Date.now())));
    document.addEventListener('visibilitychange', update);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', update);
    };
  }, [expiresAt, active, valid, expired, now]);

  const remaining = expiresAt === undefined || !valid ? undefined : Math.max(0, Math.ceil((expiresAt - Math.max(now, Date.now())) / 1000));
  return { valid, expired, remaining };
}
