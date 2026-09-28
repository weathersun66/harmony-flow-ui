import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Icon } from '../foundations/Icon';
import { TreeFileIcon } from '../data-display/TreeFileIcon';

export interface FileItem {
  id: string;
  name: ReactNode;
  type: 'folder' | 'file';
  children?: readonly FileItem[];
  size?: ReactNode;
  modified?: ReactNode;
  icon?: ReactNode;
}
type VisibleFileItem = { item: FileItem; level: number; parentId?: string };

function flatten(items: readonly FileItem[], open: readonly string[]) {
  const result: VisibleFileItem[] = [];
  const visit = (nodes: readonly FileItem[], level: number, parentId?: string) => {
    nodes.forEach((item) => {
      result.push({ item, level, parentId });
      if (item.children?.length && open.includes(item.id)) visit(item.children, level + 1, item.id);
    });
  };
  visit(items, 1);
  return result;
}

export function FileExplorer({ items, selectedId, onSelect, empty = '暂无文件' }: {
  items: readonly FileItem[]; selectedId?: string; onSelect?: (id: string) => void; empty?: ReactNode;
}) {
  const [open, setOpen] = useState<readonly string[]>([]);
  const [focused, setFocused] = useState<string>();
  const refs = useRef(new Map<string, HTMLButtonElement>());
  const visible = useMemo(() => flatten(items, open), [items, open]);
  const active = visible.find(({ item }) => item.id === focused)?.item.id
    ?? visible.find(({ item }) => item.id === selectedId)?.item.id ?? visible[0]?.item.id;
  const toggle = (id: string) => setOpen((value) => value.includes(id) ? value.filter((key) => key !== id) : [...value, id]);
  const focusAt = (index: number) => refs.current.get(visible[Math.max(0, Math.min(visible.length - 1, index))]?.item.id ?? '')?.focus();
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, entry: VisibleFileItem, index: number) {
    const expandable = Boolean(entry.item.children?.length);
    if (event.key === 'ArrowDown') focusAt(index + 1);
    else if (event.key === 'ArrowUp') focusAt(index - 1);
    else if (event.key === 'Home') focusAt(0);
    else if (event.key === 'End') focusAt(visible.length - 1);
    else if (event.key === 'ArrowRight' && expandable) open.includes(entry.item.id) ? focusAt(index + 1) : toggle(entry.item.id);
    else if (event.key === 'ArrowLeft') {
      if (expandable && open.includes(entry.item.id)) toggle(entry.item.id);
      else if (entry.parentId) refs.current.get(entry.parentId)?.focus();
      else return;
    } else return;
    event.preventDefault();
  }
  return <div className="hf-file-explorer">
    <div className="hf-file-explorer__heading" aria-hidden="true"><span>名称</span><span>大小</span></div>
    <ul role="tree" aria-label="文件目录">
      {visible.map((entry, index) => {
        const { item, level } = entry;
        const expandable = Boolean(item.children?.length);
        const expanded = expandable && open.includes(item.id);
        return <li key={item.id} role="none">
          <button type="button" role="treeitem" aria-level={level} aria-selected={selectedId === item.id}
            aria-expanded={expandable ? expanded : undefined} tabIndex={active === item.id ? 0 : -1}
            className={`hf-file-explorer__row${selectedId === item.id ? ' is-selected' : ''}`}
            style={{ paddingInlineStart: (level - 1) * 18 + 10 }}
            ref={(node) => { if (node) refs.current.set(item.id, node); else refs.current.delete(item.id); }}
            onFocus={() => setFocused(item.id)} onKeyDown={(event) => onKeyDown(event, entry, index)}
            onClick={() => { if (expandable) toggle(item.id); onSelect?.(item.id); }}>
            <span className={`hf-file-explorer__toggle${expanded ? ' is-open' : ''}`} aria-hidden="true">
              {expandable && <Icon name="chevron-down" size={14} />}
            </span>
            <span className={`hf-file-explorer__icon${item.type === 'folder' ? ' is-folder' : ''}`} aria-hidden="true">
              {item.icon ?? <TreeFileIcon folder={item.type === 'folder'} open={expanded} />}
            </span>
            <span className="hf-file-explorer__name"><strong>{item.name}</strong>{item.modified != null && <small>{item.modified}</small>}</span>
            {item.size != null && <span className="hf-file-explorer__size">{item.size}</span>}
          </button>
        </li>;
      })}
    </ul>
    {!items.length && <div className="hf-file-explorer__empty" role="status">{empty}</div>}
  </div>;
}
