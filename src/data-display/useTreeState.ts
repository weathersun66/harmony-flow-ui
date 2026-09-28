import { useRef, useState, type KeyboardEvent } from 'react';
import type { TreeNode, TreeProps } from './Tree';

function visibleNodes(nodes: readonly TreeNode[], expanded: ReadonlySet<string>, parent?: string) {
  const result: { node: TreeNode; parent?: string }[] = [];
  for (const node of nodes) {
    result.push({ node, parent });
    if (node.children && expanded.has(node.key)) result.push(...visibleNodes(node.children, expanded, node.key));
  }
  return result;
}

export function useTreeState({ nodes, selectedKey, onSelect, defaultExpandedKeys = [], expandedKeys, onExpand }: TreeProps) {
  const [internalExpanded, setExpanded] = useState<string[]>([...defaultExpandedKeys]);
  const [focusedKey, setFocusedKey] = useState<string>();
  const elements = useRef(new Map<string, HTMLLIElement>());
  const expanded = new Set(expandedKeys ?? internalExpanded);
  const visible = visibleNodes(nodes, expanded);
  const enabled = visible.filter(({ node }) => !node.disabled);
  const activeKey = enabled.find(({ node }) => node.key === focusedKey)?.node.key
    ?? enabled.find(({ node }) => node.key === selectedKey)?.node.key ?? enabled[0]?.node.key;

  function focus(key?: string) {
    if (key === undefined) return;
    setFocusedKey(key);
    elements.current.get(key)?.focus();
  }

  function toggle(node: TreeNode) {
    if (node.disabled || !node.children?.length) return;
    const next = new Set(expanded);
    if (next.has(node.key)) next.delete(node.key);
    else next.add(node.key);
    if (expandedKeys === undefined) setExpanded([...next]);
    onExpand?.([...next]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLLIElement>, node: TreeNode) {
    if (event.target !== event.currentTarget || node.disabled) return;
    const index = enabled.findIndex((item) => item.node.key === node.key);
    const branch = Boolean(node.children?.length);
    const open = expanded.has(node.key);
    const actions: Record<string, () => void> = {
      ArrowDown: () => focus(enabled[Math.min(index + 1, enabled.length - 1)]?.node.key),
      ArrowUp: () => focus(enabled[Math.max(index - 1, 0)]?.node.key),
      Home: () => focus(enabled[0]?.node.key),
      End: () => focus(enabled.at(-1)?.node.key),
      ArrowRight: () => { if (branch && !open) toggle(node); else if (branch) focus(node.children?.find((child) => !child.disabled)?.key); },
      ArrowLeft: () => {
        if (branch && open) toggle(node);
        else {
          let parent = visible.find((item) => item.node.key === node.key)?.parent;
          while (parent !== undefined && visible.find((item) => item.node.key === parent)?.node.disabled) {
            parent = visible.find((item) => item.node.key === parent)?.parent;
          }
          focus(parent);
        }
      },
      Enter: () => onSelect?.(node.key),
      ' ': () => onSelect?.(node.key),
    };
    const action = actions[event.key];
    if (action) {
      event.preventDefault();
      event.stopPropagation();
      action();
    }
  }

  return { elements, expanded, activeKey, focus, toggle, onKeyDown, setFocusedKey };
}
