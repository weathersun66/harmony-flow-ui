import { OverlayOwner } from '../../../src/overlays/OverlayOwner';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { assessMaterial, type MaterialMode } from './assessment';
import { useSurfaceScope } from './surface-scope';
import { dissolve } from './particles';
import './materials.css';

export function MaterialControls({ name, value, onChange }: {
  name: string; value: MaterialMode; onChange: (value: MaterialMode) => void;
}) {
  const assessment = assessMaterial(name);
  return <div className="hf-material-controls">
    <div role="group" aria-label="组件展示状态" className="hf-material-switch">
      {([['original', '原有态', true], ['liquid', '液态组件', assessment.liquid],
        ['particle', '粒子态组件', assessment.particle]] as const).map(([mode, label, enabled]) =>
        <button type="button" key={mode} disabled={!enabled} aria-pressed={value === mode}
          title={!enabled ? assessment.reason : undefined} onClick={() => onChange(mode)}>{label}</button>)}
    </div>
    <details><summary>特效适配评估</summary><p>{assessment.reason}</p>
      <p>当前为展示站可选效果，原组件 API 与默认材质保持不变。液态在 Chrome / Edge 中使用背景折射与触摸光感，其他浏览器使用兼容透光材质；粒子根据组件表面与文字位置生成。</p>
    </details>
  </div>;
}

export function MaterialPreview({ name, mode, children }: { name: string; mode: MaterialMode; children: ReactNode }) {
  const owner = useId();
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const cancel = useRef<(() => void) | null>(null);
  const target = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<'ready' | 'running' | 'gone'>('ready');
  const [message, setMessage] = useState('');
  const assessment = assessMaterial(name, mode);
  const surfaces = useSurfaceScope(root, assessment.selector, mode, owner);
  function restore() {
    cancel.current?.(); cancel.current = null;
    if (target.current) { target.current.inert = false; target.current.removeAttribute('aria-hidden'); }
    target.current = null; setPhase('ready'); setMessage('');
  }
  useEffect(() => {
    restore();
    return () => {
      cancel.current?.();
      if (target.current) { target.current.inert = false; target.current.removeAttribute('aria-hidden'); }
    };
  }, [mode, name]);
  function play() {
    restore();
    const element = [...surfaces.current].find(element => element.isConnected && element.getBoundingClientRect().width > 0);
    if (!element || !canvas.current) { setMessage('请先在示例中显示组件，再播放消散。'); return; }
    target.current = element;
    element.inert = true; element.setAttribute('aria-hidden', 'true'); setPhase('running');
    cancel.current = dissolve(element, canvas.current, () => { setPhase('gone'); setMessage('消散展示完成，可恢复组件继续操作。'); });
  }
  return <OverlayOwner.Provider value={owner}>
    {mode === 'particle' && <div className="hf-material-actions">
      <button type="button" onClick={play} disabled={phase === 'running'}>播放消散</button>
      <button type="button" onClick={restore} disabled={phase === 'ready'}>恢复组件</button>
      <span role="status">{message || '演示首个内容项消散，原始数据保留。'}</span>
    </div>}
    <div ref={root} style={mode === 'liquid' ? { backgroundImage: 'url("/liquid-scene.svg")' } : undefined} className={`hf-material-preview hf-material-preview--${mode}`}>
      {children}
    </div>
    {mode === 'particle' && createPortal(<canvas ref={canvas} className="hf-material-canvas" aria-hidden="true" />, document.body)}
  </OverlayOwner.Provider>;
}
