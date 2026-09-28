import { useEffect, useRef, useState } from 'react';
import { CodeEditor, type CodeEditorProps } from '../components/CodeEditor';
import { loadRuntime, prefersLightEditor, withTimeout } from './loadRuntime';
import { createSession } from './session';
import './style.css';

export interface MonacoCodeEditorProps extends CodeEditorProps {
  /** Stable file identity. Up to 20 recently opened models retain undo and view state. */
  path?: string;
  /** Same-origin directory containing the prebuilt monaco-assets files. Default: /monaco/. */
  assetsUrl?: string;
  /** Force the lightweight editor, e.g. for low-memory devices. Mobile uses it automatically. */
  lightweight?: boolean;
}

export function MonacoCodeEditor(props: MonacoCodeEditorProps) {
  const { assetsUrl = '/monaco/', lightweight = false, height = 260, label = '代码编辑器' } = props;
  const host = useRef<HTMLDivElement>(null);
  const current = useRef(props);
  current.current = props;
  const session = useRef<ReturnType<typeof createSession> | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback' | 'error'>('loading');
  const [retry, setRetry] = useState(0);
  const [position, setPosition] = useState({ line: 1, column: 1 });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (lightweight || prefersLightEditor()) { setStatus('fallback'); return; }
    let disposed = false;
    let stopErrors: (() => void) | undefined;
    let owned: ReturnType<typeof createSession> | undefined;
    const fail = (error: unknown) => {
      if (disposed) return;
      console.error('[Harmony Flow Monaco]', error);
      stopErrors?.(); owned?.dispose(); owned = undefined; session.current = null;
      setStatus('error');
    };
    setStatus('loading');
    loadRuntime(assetsUrl, retry).then(async runtime => {
      if (disposed || !host.current) return;
      if (retry) runtime.restartWorkers();
      stopErrors = runtime.onWorkerError(() => fail(new Error('Monaco Worker 加载失败')));
      owned = createSession(runtime, host.current, current.current,
        value => current.current.onChange(value), (line, column) => setPosition({ line, column }));
      session.current = owned;
      await withTimeout(runtime.verifyWorker(owned.editor.getModel()!));
      if (!disposed && owned) { owned.update(current.current); setStatus('ready'); }
    }).catch(fail);
    return () => { disposed = true; stopErrors?.(); owned?.dispose(); session.current = null; };
  }, [assetsUrl, lightweight, retry]);

  useEffect(() => { session.current?.update(props); }, [props.value, props.path, props.language, props.readOnly, props.label]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(current.current.value); setMessage('已复制'); }
    catch { setMessage('复制失败，请选中代码后复制'); }
  };
  return <div className="hf-monaco" data-editor-state={status}>
    {status !== 'ready' && <>
      <div className="hf-monaco__notice" role="status">
        {status === 'loading' ? '正在加载增强编辑器，可先继续编辑' : status === 'error' ? '增强编辑器加载失败，已使用轻量模式' : '轻量编辑模式'}
        {status === 'error' && <button type="button" onClick={() => setRetry(value => value + 1)}>重试加载</button>}
      </div>
      <CodeEditor {...props} />
    </>}
    <div className="hf-code-editor hf-monaco__enhanced" hidden={status !== 'ready'}>
      <header className="hf-code-editor__header">
        <div className="hf-code-editor__title"><span aria-hidden="true">{'</>'}</span><strong>{label}</strong></div>
        <div className="hf-code-editor__tools">
          <button type="button" onClick={() => { session.current?.editor.focus(); void session.current?.editor.getAction('actions.find')?.run(); }}>查找</button>
          <button type="button" onClick={copy}>复制</button>
        </div>
      </header>
      <div ref={host} className="hf-monaco__canvas" style={{ height }} />
      <footer className="hf-code-editor__status">
        <span>{props.readOnly ? '只读' : '可编辑'}</span><span>行 {position.line}，列 {position.column}</span>
        <span>UTF-8 · Monaco</span><span className="hf-code-editor__language">{props.language ?? 'text'}</span>
      </footer>
      <span className="hf-code-editor__sr">Tab 离开编辑器；Ctrl+M 切换 Tab 缩进模式。</span>
      {message && <div className="hf-code-editor__message" role="status">{message}</div>}
    </div>
  </div>;
}
