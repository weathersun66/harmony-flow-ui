import { Button } from '../../src/components/Button';
import { Select } from '../../src/forms/Select';
import { useState } from 'react';
import { ThemeProvider } from '../../src/theme/ThemeProvider';
import { CopyButton, Boundary } from './Primitives';
import type { ComponentDoc } from '../component-docs/types';
import { PreviewConfiguration } from './PreviewConfiguration';
import { PropControls, type PropValue } from './PropControls';
import { withPreviewProps } from './exampleCode';
import { MaterialControls, MaterialPreview } from './effects/MaterialPreview';
import { assessMaterial, type MaterialMode } from './effects/assessment';

export function Playground({ doc }: { doc: ComponentDoc }) {
  const [mode, setMode] = useState<'light' | 'dark' | 'high-contrast'>('light');
  const [width, setWidth] = useState('100%');
  const [values, setValues] = useState<Record<string, PropValue>>({});
  const [generation, setGeneration] = useState(0);
  const [material, setMaterial] = useState<MaterialMode>(() => {
    const requested = new URLSearchParams(window.location.search).get('material');
    const supported = assessMaterial(doc.name);
    return requested === 'liquid' && supported.liquid ? 'liquid'
      : requested === 'particle' && supported.particle ? 'particle' : 'original';
  });
  const modified = Object.keys(values).length > 0;
  const example = modified ? withPreviewProps(doc.exampleCode, doc.name) : doc.exampleCode;
  const code = doc.importCode + '\n\n' + (modified ? 'const previewProps = ' + JSON.stringify(values, null, 2) + ';\n\n' : '') + example;
  function change(name: string, value: PropValue | undefined) {
    setValues(previous => { const next = { ...previous }; if (value === undefined) delete next[name]; else next[name] = value; return next; });
  }
  function reset() { setMode('light'); setWidth('100%'); setMaterial('original'); setValues({}); setGeneration(value => value + 1); }
  return <div className="ws-playground">
    <div className="ws-playground-controls">
      <div className="ws-inline-field">预览宽度<Select aria-label="预览宽度" value={width} onChange={event => setWidth(event.target.value)} options={[{value: '100%', label: '适应容器'}, {value: '768px', label: '平板 768px'}, {value: '390px', label: '移动 390px'}]} /></div>
      <div className="ws-inline-field">主题<Select aria-label="主题" value={mode} onChange={event => setMode(event.target.value as typeof mode)} options={[{value: 'light', label: '浅色'}, {value: 'dark', label: '暗色'}, {value: 'high-contrast', label: '高对比'}]} /></div>
      <Button variant="outline" size="sm" onClick={reset}>重置</Button>
    </div>
    <PropControls props={doc.props} values={values} onChange={change} />
    <MaterialControls name={doc.name} value={material} onChange={setMaterial} />
    <PreviewConfiguration.Provider value={{ name: doc.name, values }}>
      <ThemeProvider mode={mode}><Boundary key={generation}><MaterialPreview name={doc.name} mode={material}><div className="ws-playground-stage demo-renderer__preview" style={{ maxWidth: width }} key={generation}>{doc.preview}</div></MaterialPreview></Boundary></ThemeProvider>
    </PreviewConfiguration.Provider>
    <div className="ws-code-heading"><span>React · TSX{modified ? ' · 已覆盖示例属性' : ''}</span><CopyButton value={code} /></div><pre><code>{code}</code></pre>
  </div>;
}
