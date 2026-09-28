import { useState } from 'react';
import { Button, Icon, Input, Tree, type TreeNode } from '../workspace/InspectableLibrary';
import './tree-demo.css';

const file = (key: string, label: string, kind?: string): TreeNode => ({ key, label,
  icon: kind ? <span className="docs-file-tree__type">{kind}</span> : undefined });
const nodes: readonly TreeNode[] = [
  { key: 'src', label: 'src', children: [
    { key: 'components', label: 'components', children: [
      file('src/components/Button.tsx', 'Button.tsx', 'TS'),
      file('src/components/Tree.tsx', 'Tree.tsx', 'TS'),
      file('src/components/Input.tsx', 'Input.tsx', 'TS'),
    ] },
    { key: 'theme', label: 'theme', children: [file('src/theme/tokens.ts', 'tokens.ts', 'TS'), file('src/theme/styles.css', 'styles.css', '#')] },
    file('src/index.ts', 'index.ts', 'TS'),
  ] },
  { key: 'public', label: 'public', children: [file('public/logo.svg', 'logo.svg')] },
  { key: 'docs', label: 'docs', children: [file('docs/组件设计与使用规范.md', '组件设计与使用规范.md')] },
  { key: 'archive', label: 'archive（无访问权限）', disabled: true, children: [file('archive/old.md', 'old.md')] },
  file('package.json', 'package.json', '{}'),
  file('README.md', 'README.md', 'M↓'),
];
const folders = ['src', 'components', 'theme', 'public', 'docs'];

function filterNodes(items: readonly TreeNode[], query: string): TreeNode[] {
  return items.flatMap((node) => {
    if (String(node.label).toLocaleLowerCase().includes(query)) return [node];
    const children = node.children && filterNodes(node.children, query);
    return children?.length ? [{ ...node, children }] : [];
  });
}

export function TreeDemo() {
  const [selected, setSelected] = useState('src/components/Tree.tsx');
  const [expanded, setExpanded] = useState(['src', 'components', 'theme']);
  const [query, setQuery] = useState('');
  const [searchExpanded, setSearchExpanded] = useState(folders);
  const normalized = query.trim().toLocaleLowerCase();
  const visible = normalized ? filterNodes(nodes, normalized) : nodes;
  const keys = normalized ? searchExpanded : expanded;
  const changeExpanded = normalized ? setSearchExpanded : setExpanded;
  return <section className="docs-file-tree" aria-label="项目文件示例">
    <header className="docs-file-tree__header">
      <div><strong>项目文件</strong><span>Harmony Flow UI</span></div>
      <Button variant="quiet" size="sm" onClick={() => changeExpanded(keys.length ? [] : folders)}>
        {keys.length ? '全部收起' : '全部展开'}
      </Button>
    </header>
    <div className="docs-file-tree__search">
      <Input aria-label="搜索项目文件" placeholder="搜索文件或文件夹" value={query}
        prefix={<Icon name="search" size={16} />}
        onChange={(event) => { setQuery(event.target.value); setSearchExpanded(folders); }} />
      {query && <Button variant="quiet" size="sm" onClick={() => setQuery('')}>清除</Button>}
    </div>
    <div className="docs-file-tree__body">
      <Tree nodes={visible} selectedKey={selected} onSelect={setSelected} label="项目文件"
        expandedKeys={keys} onExpand={changeExpanded} showIcon showLine emptyText="没有匹配的文件或文件夹" />
    </div>
    <footer className="docs-file-tree__footer" aria-live="polite"><span>已选择</span><span>{selected}</span></footer>
  </section>;
}
