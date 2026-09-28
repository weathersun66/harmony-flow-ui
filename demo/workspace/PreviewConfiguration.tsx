import { createContext, createElement, forwardRef, useContext, type ElementType } from 'react';

export const PreviewConfiguration = createContext<{ name: string; values: Record<string, string | number | boolean> } | null>(null);

// 只用于展示站：保留原示例的必需参数、回调、ref和children。
// 属性覆盖来自显式编辑的简单值，不执行用户输入的代码。
export function inspected<T extends ElementType>(component: T, name: string): T {
  const Preview = forwardRef<unknown, Record<string, unknown>>((props, ref) => {
    const configuration = useContext(PreviewConfiguration);
    const overrides = configuration?.name === name ? configuration.values : {};
    return createElement(component, { ...props, ...overrides, ...(ref ? { ref } : {}) });
  });
  Preview.displayName = `Preview(${name})`;
  return Preview as unknown as T;
}
