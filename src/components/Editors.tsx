import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';

export interface RichTextEditorProps { value: string; onChange: (html: string) => void; label?: string; placeholder?: string; disabled?: boolean }
export function RichTextEditor({ value, onChange, label, placeholder = '输入内容…', disabled }: RichTextEditorProps) {
  const editor = useRef<HTMLDivElement>(null);
  useEffect(() => { if (editor.current && editor.current.innerHTML !== value) editor.current.innerHTML = value; }, [value]);
  const format = (command: 'bold' | 'italic' | 'insertUnorderedList') => { editor.current?.focus(); document.execCommand(command); onChange(editor.current?.innerHTML ?? ''); };
  return <div className="hf-rich-editor"><div className="hf-rich-editor__header">{label && <strong>{label}</strong>}<div role="toolbar" aria-label="文本格式"><button type="button" aria-label="粗体" disabled={disabled} onClick={() => format('bold')}><b>B</b></button><button type="button" aria-label="斜体" disabled={disabled} onClick={() => format('italic')}><i>I</i></button><button type="button" aria-label="无序列表" disabled={disabled} onClick={() => format('insertUnorderedList')}>• 列表</button></div></div><div ref={editor} className="hf-rich-editor__content" contentEditable={!disabled} role="textbox" aria-multiline="true" aria-label={label ?? '富文本编辑器'} data-placeholder={placeholder} onInput={(event) => onChange(event.currentTarget.innerHTML)} /></div>;
}

export interface MentionOption { value: string; label: string; description?: string }
export interface MentionInputProps { value: string; onChange: (value: string) => void; options: readonly MentionOption[]; label?: string; placeholder?: string; disabled?: boolean }
export function MentionInput({ value, onChange, options, label, placeholder = '输入 @ 提及成员', disabled }: MentionInputProps) {
  const [active, setActive] = useState(0); const match = value.match(/(?:^|\s)@([^\s@]*)$/); const query = match?.[1]?.toLowerCase();
  const results = useMemo(() => query === undefined ? [] : options.filter((item) => `${item.label} ${item.value}`.toLowerCase().includes(query)).slice(0, 6), [options, query]);
  useEffect(() => setActive(0), [query]);
  const choose = (item: MentionOption) => { if (!match) return; onChange(`${value.slice(0, match.index!)}${match[0].startsWith(' ') ? ' ' : ''}@${item.label} `); };
  const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => { if (!results.length) return; if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setActive((index) => (index + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length); } else if (event.key === 'Enter' || event.key === 'Tab') { event.preventDefault(); choose(results[active]!); } else if (event.key === 'Escape') { event.preventDefault(); onChange(`${value} `); } };
  return <label className="hf-field hf-mention-input">{label && <span className="hf-field__label">{label}</span>}<textarea value={value} placeholder={placeholder} disabled={disabled} aria-autocomplete="list" aria-expanded={Boolean(results.length)} onChange={(event) => onChange(event.target.value)} onKeyDown={keyDown} />{results.length > 0 && <div className="hf-mention-input__menu" role="listbox">{results.map((item, index) => <button type="button" role="option" aria-selected={index === active} key={item.value} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(item)}><span>@{item.label}</span>{item.description && <small>{item.description}</small>}</button>)}</div>}</label>;
}

export { CodeEditor, type CodeEditorProps } from './CodeEditor';
