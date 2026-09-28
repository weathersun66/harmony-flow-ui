import { useState } from 'react';
import { Button } from '../workspace/InspectableLibrary';
import { MonacoCodeEditor } from '../../src/monaco';
import { inspected } from '../workspace/PreviewConfiguration';
import './file-workspace-preview.css';

const EnhancedCodeEditor = inspected(MonacoCodeEditor, 'CodeEditor');

const initial = {
  'rollout.ts': [
    '// 灰度发布配置',
    'export const rollout = 25;',
    '',
    'export function isEnabled(userId: number) {',
    '  const bucket = Math.abs(userId) % 100;',
    '  return bucket < rollout;',
    '}',
    '',
    'export const options = {',
    '  region: "cn-east",',
    '  retry: 3,',
    '};',
  ].join('\n'),
  'theme.json': '{\n  "name": "Harmony Flow",\n  "density": "comfortable",\n  "motion": true\n}',
};

export function CodeEditorPreview() {
  const [active, setActive] = useState<keyof typeof initial>('rollout.ts');
  const [drafts, setDrafts] = useState(initial);
  const [readonly, setReadonly] = useState(false);
  const [lightweight, setLightweight] = useState(false);
  const value = drafts[active];
  return <section className="docs-code-workspace" data-doc-preview="codeeditor">
    <header><strong>代码工作区</strong><div>
      <Button size="sm" variant="quiet" aria-pressed={lightweight} onClick={() => setLightweight(!lightweight)}>{lightweight ? '切换增强模式' : '切换轻量模式'}</Button>
      <Button size="sm" variant="quiet" aria-pressed={readonly} onClick={() => setReadonly(!readonly)}>{readonly ? '切换为编辑' : '切换为只读'}</Button>
    </div></header>
    <div className="docs-code-workspace__files" aria-label="选择代码文件">
      {(Object.keys(initial) as (keyof typeof initial)[]).map(name => <button type="button" key={name} aria-pressed={active === name}
        onClick={() => setActive(name)}><span aria-hidden="true">{name.endsWith('.ts') ? 'TS' : '{}'}</span>{name}{drafts[name] !== initial[name] && <span aria-label="已修改">●</span>}</button>)}
    </div>
    <div className="docs-code-workspace__path"><span>src</span><span aria-hidden="true">/</span><span>{active}</span></div>
    <EnhancedCodeEditor path={active} lightweight={lightweight} label="规则脚本" language={active.endsWith('.ts') ? 'typescript' : 'json'} height={300}
      readOnly={readonly} value={value} onChange={next => setDrafts(current => ({ ...current, [active]: next }))} />
    <footer><span aria-live="polite">{value.split('\n').length} 行 {active.endsWith('.ts') ? 'TypeScript' : 'JSON'}</span><span>修改保留在当前页面</span></footer>
  </section>;
}
