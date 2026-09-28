// 操作按钮同步材质；选项、日期、标签页等由各组件的状态样式管理。
export const liquidActionSelector = '.hf-button, button:not([role]):not([aria-selected]):not([aria-pressed]), [role="button"]:not([aria-selected]):not([aria-pressed])';

export function materialElements(node: ParentNode, selector: string, actions: boolean) {
  const query = actions ? `${selector}, ${liquidActionSelector}` : selector;
  const elements = new Set(node.querySelectorAll<HTMLElement>(query));
  if (node instanceof HTMLElement && node.matches(query)) elements.add(node);
  return elements;
}
