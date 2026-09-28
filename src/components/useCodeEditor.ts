import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

export function useCodeEditor(value: string, onChange: (value: string) => void, readOnly?: boolean) {
  const input = useRef<HTMLTextAreaElement>(null);
  const gutter = useRef<HTMLPreElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const pending = useRef<number | undefined>(undefined);
  const escapeTab = useRef(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [finding, setFinding] = useState(false);
  const [query, setQuery] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const line = value.slice(0, Math.min(selection.start, value.length)).split('\n');
  const position = { line: line.length, column: (line.at(-1)?.length ?? 0) + 1 };
  const matches: number[] = [];
  if (query) {
    let offset = value.indexOf(query);
    while (offset !== -1) { matches.push(offset); offset = value.indexOf(query, offset + query.length); }
  }
  useEffect(() => () => { if (pending.current !== undefined) cancelAnimationFrame(pending.current); }, []);
  useEffect(() => { setCopyStatus(''); }, [value]);
  function syncSelection() {
    if (input.current) setSelection({ start: input.current.selectionStart, end: input.current.selectionEnd });
  }
  function openFind() { setFinding(true); requestAnimationFrame(() => search.current?.focus()); }
  function closeFind() { setFinding(false); input.current?.focus(); }
  function find(direction = 1) {
    if (!matches.length || !input.current) return;
    const start = input.current.selectionStart;
    const end = input.current.selectionEnd;
    const next = direction > 0
      ? matches.find((offset) => offset >= (end > start ? end : start)) ?? matches[0]!
      : [...matches].reverse().find((offset) => offset < start) ?? matches.at(-1)!;
    input.current.focus();
    input.current.setSelectionRange(next, next + query.length);
    const row = value.slice(0, next).split('\n').length - 1;
    input.current.scrollTop = Math.max(0, row * 22 - input.current.clientHeight / 2);
    if (gutter.current) gutter.current.scrollTop = input.current.scrollTop;
    syncSelection();
  }
  async function copy() {
    try { await navigator.clipboard.writeText(value); setCopyStatus('已复制'); }
    catch { setCopyStatus('复制失败，请选中文本后复制'); }
  }
  function keyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') { event.preventDefault(); openFind(); return; }
    if (event.key === 'Escape') { escapeTab.current = true; if (finding) closeFind(); return; }
    if (event.key === 'Tab') {
      if (escapeTab.current || event.shiftKey || readOnly) { escapeTab.current = false; return; }
      if (event.nativeEvent.isComposing) return;
      event.preventDefault();
      const start = event.currentTarget.selectionStart;
      const end = event.currentTarget.selectionEnd;
      onChange(`${value.slice(0, start)}  ${value.slice(end)}`);
      pending.current = requestAnimationFrame(() => { input.current?.setSelectionRange(start + 2, start + 2); syncSelection(); });
    } else escapeTab.current = false;
  }
  return { input, gutter, search, selection, position, finding, query, setQuery, matches, copyStatus,
    syncSelection, openFind, closeFind, find, copy, keyDown };
}
