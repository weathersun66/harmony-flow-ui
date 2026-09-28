import { useState } from 'react';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { Switch } from '../../src/components/Switch';
import { resources } from './resources';
import { RouteLink } from './routing';
import { CopyButton } from './Primitives';
import { TableActions, UploadFlow, UndoFlow } from './WorkflowPatterns';
import { workflowPatternCode } from './catalog/patternCode';

const snippets: Record<string, string> = {
  'table-actions': workflowPatternCode, 'upload-flow': workflowPatternCode, 'undo-flow': workflowPatternCode,
  login: `import { useState } from 'react';\nimport { Button, Input } from '@hxdhxd/harmony-flow-ui';\nexport function LoginForm({ onSubmit }: { onSubmit: (email: string) => Promise<void> }) {\n  const [email, setEmail] = useState('');\n  const [busy, setBusy] = useState(false);\n  const [error, setError] = useState('');\n  return <form onSubmit={async e => {\n    e.preventDefault(); setBusy(true); setError('');\n    try { await onSubmit(email); } catch { setError('提交失败，请重试'); }\n    finally { setBusy(false); }\n  }}>\n    <Input label="邮箱" type="email" required value={email} onChange={e => setEmail(e.target.value)} />\n    {error && <p role="alert">{error}</p>}\n    <Button type="submit" loading={busy}>继续</Button>\n  </form>;\n}`,
  search: `import { useState } from 'react';\nimport { Input } from '@hxdhxd/harmony-flow-ui';\nexport function SearchPanel({ items }: { items: string[] }) {\n  const [query, setQuery] = useState('');\n  const results = items.filter(item => item.toLowerCase().includes(query.toLowerCase()));\n  return <section><Input label="搜索" value={query} onChange={e => setQuery(e.target.value)} />\n    <p role="status">{results.length} 项结果</p>\n    <ul>{results.map(item => <li key={item}>{item}</li>)}</ul>\n  </section>;\n}`,
  settings: `import { useState } from 'react';\nimport { Switch } from '@hxdhxd/harmony-flow-ui';\nexport function SettingsPanel() {\n  const [enabled, setEnabled] = useState(true);\n  return <Switch label="自动保存" checked={enabled} onChange={event => setEnabled(event.target.checked)} />;\n}`,
};
export function Patterns({ slug }: { slug?: string }) {
  const [value, setValue] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const pattern = resources.find(resource => resource.id === slug && resource.type === '组合模式');
  if (!pattern) return <section><div className="ws-page-heading"><div><p className="ws-eyebrow">PATTERNS</p><h1>组合模式</h1><p>从一个业务任务出发，理解组件如何协同工作。</p></div></div><div className="ws-resource-grid">{resources.filter(r => r.type === '组合模式').map(r => <RouteLink key={r.id} href={r.url}><span className="ws-eyebrow">PATTERN</span><h2>{r.title}</h2><p>{r.description}</p><span>查看组合与代码 →</span></RouteLink>)}</div></section>;
  return <section className="ws-reading"><RouteLink href="/patterns">← 全部组合模式</RouteLink><h1>{pattern.title}</h1><p>{pattern.description}</p><h2>交互预览</h2><div className="ws-pattern-stage">
    {slug === 'login' && <form onSubmit={event => { event.preventDefault(); setSubmitted(true); }}><Input label="邮箱" type="email" required value={value} onChange={event => { setValue(event.target.value); setSubmitted(false); }} /><Button type="submit">验证表单</Button>{submitted && <p role="status">格式校验通过。此示例未连接认证服务。</p>}</form>}
    {slug === 'search' && <><Input label="搜索组件" value={value} onChange={event => setValue(event.target.value)} /><ul>{['Button', 'Input', 'Switch', 'Select'].filter(name => name.toLowerCase().includes(value.toLowerCase())).map(name => <li key={name}>{name}</li>)}</ul></>}
    {slug === 'settings' && <Switch label="自动保存" checked={enabled} onChange={event => setEnabled(event.target.checked)} />}
    {slug === 'table-actions' && <TableActions />}
    {slug === 'upload-flow' && <UploadFlow />}
    {slug === 'undo-flow' && <UndoFlow />}
  </div><h2>依赖组件</h2><div className="ws-related">{(slug === 'settings' ? ['Switch'] : slug === 'search' ? ['Input'] : slug === 'table-actions' ? ['DataGrid', 'Button'] : slug === 'upload-flow' ? ['Upload', 'Button'] : slug === 'undo-flow' ? ['UndoNotice', 'Button'] : ['Input', 'Button']).map(name => <RouteLink key={name} href={`/components/${name.toLowerCase()}`}>{name} →</RouteLink>)}</div><h2>React 实现</h2><CopyButton value={snippets[slug!]!} /><pre><code>{snippets[slug!]}</code></pre><h2>业务接入与异常处理</h2><p>表单的认证、权限、数据持久化和异步错误由调用方负责；演示数据保留在浏览器内。为加载、失败和空结果提供反馈，提交期间阻止重复操作。</p><h2>无障碍</h2><p>保持可见标签与自然 Tab 顺序；提交结果通过状态区域通知，错误就近呈现。</p></section>;
}
