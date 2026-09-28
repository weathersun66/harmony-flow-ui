import { useId, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../foundations/Icon';
import { TreeFileIcon } from './TreeFileIcon';
import { useTreeState } from './useTreeState';

export interface TreeNode {
  key: string;
  label: ReactNode;
  children?: readonly TreeNode[];
  disabled?: boolean;
  icon?: ReactNode;
}
export interface TreeProps {
  nodes: readonly TreeNode[];
  selectedKey?: string;
  onSelect?: (key: string) => void;
  defaultExpandedKeys?: readonly string[];
  expandedKeys?: readonly string[];
  onExpand?: (keys: string[]) => void;
  label?: string;
  showIcon?: boolean;
  showLine?: boolean;
  emptyText?: ReactNode;
}

export function Tree({ nodes, selectedKey, onSelect, defaultExpandedKeys = [], expandedKeys,
  onExpand, label = '树形列表', showIcon = false, showLine = true, emptyText = '暂无内容' }: TreeProps) {
  const id = useId();
  const { elements, expanded, activeKey, focus, toggle, onKeyDown, setFocusedKey } = useTreeState({
    nodes, selectedKey, onSelect, defaultExpandedKeys, expandedKeys, onExpand,
  });

  function render(items: readonly TreeNode[], level: number): ReactNode {
    return <ul role={level ? 'group' : 'tree'} aria-label={level ? undefined : label}>
      {items.map((node) => {
        const open = expanded.has(node.key);
        const branch = Boolean(node.children?.length);
        const folder = node.children !== undefined;
        const labelId = `${id}-${encodeURIComponent(node.key)}`;
        return <li role="treeitem" key={node.key} aria-labelledby={labelId}
          aria-level={level + 1} aria-expanded={branch ? open : undefined}
          aria-selected={node.key === selectedKey} aria-disabled={node.disabled || undefined}
          tabIndex={!node.disabled && node.key === activeKey ? 0 : -1}
          ref={(element) => { if (element) elements.current.set(node.key, element); else elements.current.delete(node.key); }}
          onFocus={(event) => { if (event.target === event.currentTarget) setFocusedKey(node.key); }}
          onKeyDown={(event) => onKeyDown(event, node)}>
          <div className={`hf-tree__row${node.key === selectedKey ? ' is-selected' : ''}`}
            style={{ '--hf-tree-depth': level } as CSSProperties}
            onClick={() => { if (!node.disabled) { focus(node.key); onSelect?.(node.key); } }}>
            <span className="hf-tree__guides" aria-hidden="true">
              {Array.from({ length: level }, (_, depth) => <i key={depth} />)}
            </span>
            {branch ? <button type="button" className="hf-tree__toggle" tabIndex={-1}
              disabled={node.disabled} aria-label={`${open ? '收起' : '展开'}${typeof node.label === 'string' ? node.label : '节点'}`}
              onClick={(event) => { event.stopPropagation(); focus(node.key); toggle(node); }}>
              <Icon name="chevron-down" size={14} className={open ? 'is-open' : ''} />
            </button> : <span className="hf-tree__spacer" aria-hidden="true" />}
            {(node.icon != null || showIcon) && <span className={`hf-tree__icon${folder ? ' is-folder' : ''}`} aria-hidden="true">
              {node.icon ?? <TreeFileIcon folder={folder} open={open} />}
            </span>}
            <span id={labelId} className="hf-tree__label" title={typeof node.label === 'string' ? node.label : undefined}>{node.label}</span>
          </div>
          {branch && open && render(node.children!, level + 1)}
        </li>;
      })}
    </ul>;
  }

  return <div className={`hf-tree${showLine ? ' hf-tree--lines' : ''}`}>
    {render(nodes, 0)}
    {!nodes.length && <div className="hf-tree__empty" role="status">{emptyText}</div>}
  </div>;
}
