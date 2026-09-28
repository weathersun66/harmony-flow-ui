import metadata from '../../package.json';
import { CopyButton } from './Primitives';

export const packageVersion = metadata.version;
export const packageName = metadata.name;
export const installCommand = `npm install ${packageName}@${packageVersion}`;
export const appExample = `import { Button, ThemeProvider } from '${packageName}';
import '${packageName}/style.css';

export default function App() {
  return (
    <ThemeProvider>
      <Button onClick={() => console.log('saved')}>保存更改</Button>
    </ThemeProvider>
  );
}`;
export const monacoExample = `import { useState } from 'react';
import { MonacoCodeEditor } from '${packageName}/monaco';
import '${packageName}/style.css';
import '${packageName}/monaco/style.css';

export default function Editor() {
  const [code, setCode] = useState('const ready = true;');
  return <MonacoCodeEditor path="main.ts" language="typescript"
    value={code} onChange={setCode} assetsUrl="/monaco/" />;
}`;

export function InstallSnippet({ code, label }: { code: string; label: string }) {
  return <><CopyButton value={code} label={label} /><pre><code>{code}</code></pre></>;
}
export function QuickStart() {
  return <>
    <p>在已有 React 18+ 项目的终端中安装与本文档一致的版本：</p>
    <InstallSnippet code={installCommand} label="复制安装命令" />
    <p>项目需已安装 react 和 react-dom。然后在应用入口导入一次基础样式，并用 ThemeProvider 包裹组件：</p>
    <InstallSnippet code={appExample} label="复制 React 示例" />
  </>;
}
