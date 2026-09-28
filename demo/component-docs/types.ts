import type { ReactNode } from 'react';

export type ComponentCategory = '通用' | '表单' | '导航' | '反馈' | '数据展示';
export type ComponentPropDoc = { name: string; type: string; defaultValue: string; description: string };

export type ComponentDoc = {
  name: string;
  title: string;
  category: ComponentCategory;
  description: string;
  importCode: string;
  exampleCode: string;
  preview: ReactNode;
  props: readonly ComponentPropDoc[];
  keyboard: string;
  related: readonly string[];
};
