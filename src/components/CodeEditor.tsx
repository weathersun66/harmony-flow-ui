import { useId } from 'react';
import { Icon } from '../foundations/Icon';
import { useCodeEditor } from './useCodeEditor';

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  label?: string;
  readOnly?: boolean;
  height?: number;
}

export function CodeEditor({ value, onChange, language = 'text', label = '代码编辑器', readOnly, height = 260 }: CodeEditorProps) {
  const editor = useCodeEditor(value, onChange, readOnly);
  const helpId = useId();
  const lines = value.split('\n').length;
  return <div className={`hf-code-editor${readOnly ? ' is-readonly' : ''}`}>
    <header className="hf-code-editor__header">
      <div className="hf-code-editor__title"><span aria-hidden="true">{'</>'}</span><strong>{label}</strong></div>
      <div className="hf-code-editor__tools">
        <button type="button" aria-label="查找代码" aria-expanded={editor.finding} onClick={editor.openFind}><Icon name="search" size={16} /><span>查找</span></button>
        <button type="button" onClick={editor.copy}>复制</button>
      </div>
    </header>
    {editor.finding && <div className="hf-code-editor__find" role="search" aria-label="代码查找">
      <input ref={editor.search} aria-label="查找内容" placeholder="查找文本（区分大小写）" value={editor.query}
        onChange={(event) => editor.setQuery(event.target.value)}
        onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); editor.find(event.shiftKey ? -1 : 1); } else if (event.key === 'Escape') editor.closeFind(); }} />
      <span role="status">{editor.query ? `${editor.matches.length} 个匹配` : '输入关键词'}</span>
      <button type="button" aria-label="上一个匹配" disabled={!editor.matches.length} onClick={() => editor.find(-1)}>↑</button>
      <button type="button" aria-label="下一个匹配" disabled={!editor.matches.length} onClick={() => editor.find(1)}>↓</button>
      <button type="button" aria-label="关闭查找" onClick={editor.closeFind}><Icon name="close" size={14} /></button>
    </div>}
    <div className="hf-code-editor__body" style={{ height }}>
      <pre ref={editor.gutter} className="hf-code-editor__gutter" aria-hidden="true">
        {Array.from({ length: lines }, (_, index) => <span className={editor.position.line === index + 1 ? 'is-active' : ''} key={index}>{index + 1}{'\n'}</span>)}
      </pre>
      <textarea ref={editor.input} spellCheck={false} autoCapitalize="off" autoCorrect="off" wrap="off"
        readOnly={readOnly} aria-label={label} aria-describedby={helpId} value={value}
        onChange={(event) => onChange(event.target.value)} onSelect={editor.syncSelection} onKeyDown={editor.keyDown}
        onScroll={(event) => { if (editor.gutter.current) editor.gutter.current.scrollTop = event.currentTarget.scrollTop; }} />
    </div>
    <footer className="hf-code-editor__status">
      <span>{readOnly ? '只读' : '可编辑'}</span><span>行 {editor.position.line}，列 {editor.position.column}</span>
      <span>{editor.selection.end > editor.selection.start ? `已选 ${editor.selection.end - editor.selection.start} 字符` : `${lines} 行 · ${value.length} 字符`}</span>
      <span className="hf-code-editor__language">{language}</span>
    </footer>
    <span className="hf-code-editor__sr" id={helpId}>Tab 插入两个空格；按 Escape 后再按 Tab 离开编辑器，Shift+Tab 返回上一个控件。</span>
    {editor.copyStatus && <div className="hf-code-editor__message" role="status">{editor.copyStatus}</div>}
  </div>;
}
