import { Component, useEffect, useRef, useState, type ReactNode } from 'react';

export function CopyButton({ value, label = '复制代码' }: { value: string; label?: string }) {
  const [status, setStatus] = useState('');
  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(value);
      setStatus('已复制');
    } catch { setStatus('复制失败，请选中代码手动复制'); }
  }
  useEffect(() => { if (status) { const timer = window.setTimeout(() => setStatus(''), 3000); return () => clearTimeout(timer); } }, [status]);
  return <><button className="ws-button" onClick={copy}>{status === '已复制' ? status : label}</button>{status && <span className="ws-copy-status" role="status">{status}</span>}</>;
}
export function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const dialog = ref.current!;
    dialog.showModal();
    dialog.querySelector<HTMLInputElement>('[role="combobox"]')?.focus();
    return () => { dialog.close(); previous?.focus(); };
  }, []);
  return <dialog ref={ref} className="ws-dialog" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === ref.current) onClose(); }} aria-label={title}>
    <header><strong>{title}</strong><button className="ws-icon-button" aria-label="关闭" onClick={onClose}>×</button></header>{children}
  </dialog>;
}
export class Boundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  componentDidCatch(error: Error) { console.error('预览加载失败', error); }
  render() {
    return this.state.error ? <div className="ws-empty" role="alert"><p>内容加载失败，请重新加载。</p><button onClick={() => window.location.reload()}>重新加载</button></div> : this.props.children;
  }
}
