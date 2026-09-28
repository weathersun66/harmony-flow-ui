import { useState } from 'react';
import { Button, CodeBlock, FileExplorer, FilePreview, Icon, Input, MarkdownContent, type FileItem } from '../workspace/InspectableLibrary';
import './file-workspace-preview.css';

const content = '# 支付确认流程\n\n确认订单信息后提交支付，所有状态都应提供明确反馈。\n\n## 操作顺序\n\n- 核对收货地址与配送方式\n- 确认订单金额与优惠\n- 提交支付并等待结果\n- 支付失败时保留订单，允许重试\n\n## 无障碍\n\n所有操作支持键盘访问，错误提示与对应输入关联。';
const documents: Record<string, { name: string; content: string; type: string }> = {
  checkout: { name: 'checkout-flow.md', content, type: 'Markdown' },
  'checkout-spec': { name: 'checkout-accessibility-specification-v12.md', content: '# 验收规范\n\n- 键盘可以完成全部操作\n- 长文本在移动端完整呈现\n- 状态变化向辅助技术公布\n- 错误恢复不丢失用户输入', type: 'Markdown' },
  tokens: { name: 'tokens.json', content: '{\n  "primary": "harmony-blue",\n  "density": "comfortable",\n  "radius": 8\n}', type: 'JSON' },
};
const fileNode = (id: string): FileItem => ({ id, name: documents[id]!.name, type: 'file', size: `${new TextEncoder().encode(documents[id]!.content).length} B`, modified: '今天 09:42' });
const files: FileItem[] = [
  { id: 'flows', name: 'Flows', type: 'folder', children: [fileNode('checkout'), fileNode('checkout-spec')] },
  fileNode('tokens'), { id: 'archive', name: 'Archive', type: 'folder', children: [] },
];

function DocumentPreview({ selected, onClear }: { selected?: string; onClear: () => void }) {
  const [source, setSource] = useState(false);
  const [downloaded, setDownloaded] = useState('');
  const document = selected ? documents[selected] : undefined;
  function download() {
    if (!document) return;
    const url = URL.createObjectURL(new Blob([document.content], { type: 'text/plain;charset=utf-8' }));
    const anchor = window.document.createElement('a');
    anchor.href = url;
    anchor.download = document.name;
    anchor.click();
    URL.revokeObjectURL(url);
    setDownloaded(document.name);
  }
  return <div className="docs-file-workspace__document">
    <div className="docs-file-workspace__path"><span>项目文件</span><span aria-hidden="true">/</span><span>{document?.name ?? '未选择文件'}</span></div>
    <FilePreview name={document?.name} type={document?.type}
      size={document ? `${new TextEncoder().encode(document.content).length} B` : undefined} modified="今天 09:42"
      empty="从左侧目录选择一个文件开始预览"
      actions={<><Button size="sm" variant="quiet" onClick={() => setSource(!source)}>{source ? '预览' : '源码'}</Button><Button size="sm" variant="secondary" onClick={download}>下载</Button></>}>
      {document && (source || document.type === 'JSON'
        ? <CodeBlock code={document.content} language={document.type.toLowerCase()} wrap />
        : <MarkdownContent content={document.content} />)}
    </FilePreview>
    <footer className="docs-file-workspace__footer">
      <span role="status">{document ? downloaded === document.name ? `已下载：${document.name}` : `预览状态：${document.name}` : '预览状态：未选择文件'}</span>
      {selected && <Button size="sm" variant="quiet" onClick={onClear}>清除选择</Button>}
    </footer>
  </div>;
}

export function FileExplorerPreview() {
  const [selected, setSelected] = useState<string | undefined>('checkout');
  const [query, setQuery] = useState('');
  const filtered = query.trim() ? Object.keys(documents).filter(id => documents[id]!.name.toLowerCase().includes(query.trim().toLowerCase())).map(fileNode) : files;
  return <section className="docs-file-workspace" data-doc-preview="fileexplorer">
    <header><strong>文件工作区</strong><span>Harmony Flow UI</span></header>
    <div className="docs-file-workspace__split">
      <aside aria-label="项目资源">
        <Input aria-label="搜索文件" placeholder="搜索文件" value={query} onChange={event => setQuery(event.target.value)} prefix={<Icon name="search" size={16} />} />
        <FileExplorer items={filtered} selectedId={selected} onSelect={setSelected} empty="没有匹配的文件" />
        <span className="docs-file-workspace__selection" aria-live="polite">{selected ? `已选择：${selected}` : '尚未选择文件'}</span>
      </aside>
      <DocumentPreview selected={selected} onClear={() => setSelected(undefined)} />
    </div>
  </section>;
}

export function FilePreviewPreview() {
  const [selected, setSelected] = useState<string | undefined>('checkout');
  return <section className="docs-file-workspace" data-doc-preview="filepreview">
    <header><strong>文件预览</strong><div className="docs-file-workspace__switcher" aria-label="选择示例文件">
      {Object.entries(documents).filter(([id]) => id !== 'checkout-spec').map(([id, document]) =>
        <Button key={id} size="sm" variant={selected === id ? 'secondary' : 'quiet'} aria-pressed={selected === id} onClick={() => setSelected(id)}>{document.name}</Button>)}
    </div></header>
    <DocumentPreview selected={selected} onClear={() => setSelected(undefined)} />
  </section>;
}
