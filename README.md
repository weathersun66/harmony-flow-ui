# Harmony Flow UI

**简体中文** · [English](./README.en.md)

面向 React 应用的 TypeScript 组件库，提供主题定制、交互组件与可运行的组件展示站。

[npm](https://www.npmjs.com/package/@hxdhxd/harmony-flow-ui) · [使用教程](#快速开始) · [本地演示](#运行组件展示站) · [问题反馈](https://github.com/weathersun66/harmony-flow-ui/issues)

## 特性

- **169 个组件**：覆盖基础控件、表单、导航、数据展示、反馈、布局、协作与 AI 交互场景。
- **TypeScript 支持**：提供类型声明、ES Modules、CommonJS 和独立 CSS 入口。
- **主题定制**：内置浅色、深色和高对比度主题，可通过设计 Token 调整颜色、圆角与动效。
- **交互设计**：提供键盘操作、焦点管理及 ARIA 语义；具体行为可在组件展示站中体验。
- **可选代码编辑器**：通过独立 Monaco 入口提供增强编辑能力。
- **交互展示站**：查看组件示例、Props、源码、移动端布局以及液态和粒子材质预览。

液态与粒子效果目前属于展示站预览功能，npm 组件的默认外观使用基础主题。

## 快速开始

### 1. 安装

在已有的 React 项目中安装组件库。需要 React 与 React DOM 18 或更高版本。

```bash
npm install @hxdhxd/harmony-flow-ui
```

### 2. 引入样式并使用组件

在应用入口引入一次样式。以下示例可保存为 `App.tsx`：

```tsx
import { useState } from 'react';
import { Button, ThemeProvider } from '@hxdhxd/harmony-flow-ui';
import '@hxdhxd/harmony-flow-ui/style.css';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider mode="light">
      <main style={{ padding: 24 }}>
        <Button onClick={() => setCount(count + 1)}>
          已点击 {count} 次
        </Button>
      </main>
    </ThemeProvider>
  );
}
```

`ThemeProvider` 为其子树设置主题。组件事件沿用 React 的使用方式；受控组件需由应用维护状态。使用 Next.js App Router 等框架时，将交互示例放在声明了 `'use client'` 的客户端组件中，并按框架约定引入全局 CSS。

## 使用教程

### 按钮状态与外观

```tsx
import { Button } from '@hxdhxd/harmony-flow-ui';

export function Actions() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="primary">保存</Button>
      <Button variant="outline" size="sm">取消</Button>
      <Button loading>提交</Button>
      <Button disabled>暂不可用</Button>
    </div>
  );
}
```

`variant` 支持 `primary`、`secondary`、`outline`、`quiet`、`danger`；`size` 支持 `sm`、`md`、`lg`。仅图标按钮应提供明确的 `aria-label`。

### 切换主题

```tsx
import { Button, ThemeProvider } from '@hxdhxd/harmony-flow-ui';

export function ThemedPanel() {
  return (
    <ThemeProvider
      mode="dark"
      tokens={{ colorPrimary: '#8b5cf6', colorPrimaryHover: '#7c3aed' }}
    >
      <Button>自定义主题</Button>
    </ThemeProvider>
  );
}
```

`mode` 支持 `light`、`dark` 和 `high-contrast`；`tokens` 接受部分 `ThemeTokens`。完整定义见 [主题源码](./src/theme/tokens.ts)。

### 创建滚动区域

```tsx
import { VerticalScrollArea } from '@hxdhxd/harmony-flow-ui';

export function ActivityList() {
  return (
    <VerticalScrollArea label="活动记录" maxHeight={240}>
      {Array.from({ length: 30 }, (_, index) => (
        <p key={index}>活动 {index + 1}</p>
      ))}
    </VerticalScrollArea>
  );
}
```

横向滚动使用 `HorizontalScrollArea`，双向滚动使用 `ScrollArea`。纵向滚动需要高度约束；`ref` 指向实际滚动节点，可调用 `scrollTo()`。

### 使用 Monaco 编辑器

1. 引入独立组件入口及其样式。
2. 将 `node_modules/@hxdhxd/harmony-flow-ui/dist/monaco-assets/` 中的全部内容复制到应用静态目录，例如 `public/monaco/`。保留目录结构、Worker、字体及许可证文件，并确保部署后可通过同源 `/monaco/` 路径访问。
3. 通过 `value` 和 `onChange` 管理编辑内容。

```tsx
import { useState } from 'react';
import { MonacoCodeEditor } from '@hxdhxd/harmony-flow-ui/monaco';
import '@hxdhxd/harmony-flow-ui/style.css';
import '@hxdhxd/harmony-flow-ui/monaco/style.css';

export function ScriptEditor() {
  const [value, setValue] = useState('const message = "Hello";');

  return (
    <MonacoCodeEditor
      label="脚本编辑器"
      path="main.ts"
      language="typescript"
      value={value}
      onChange={setValue}
      assetsUrl="/monaco/"
      height={320}
    />
  );
}
```

Monaco 资源按需加载。移动端默认采用轻量编辑模式，也可设置 `lightweight`；加载失败时提供降级模式。同页增强编辑器实例应使用统一主题。升级组件包后，请同步更新静态资源。

## 运行组件展示站

从源码运行需要 Node.js 18 或更高版本及 npm。

```bash
git clone https://github.com/weathersun66/harmony-flow-ui.git
cd harmony-flow-ui
npm ci
npm run build:demo
npm run serve
```

打开 [http://localhost:6633](http://localhost:6633)。通过分类或搜索进入组件详情，查看 Props、调整预览参数并复制示例代码。展示站使用 esbuild 构建；修改源码后需重新执行 `npm run build:demo`。

服务配置支持 `HF_DEMO_PORT`（默认 `6633`）、`HF_DEMO_HOST`（默认 `0.0.0.0`）与 `HF_DEMO_ROOT`（默认使用 `public` 或 `demo-dist`）。展示数据用于演示，实际应用需自行接入身份、权限、网络请求和持久化。

## 从源码构建

| 命令 | 用途 |
| --- | --- |
| `npm run check` | 检查 TypeScript 和源码结构 |
| `npm run build` | 构建 ESM、CommonJS、类型声明、CSS 与 Monaco 资源 |
| `npm run build:demo` | 构建组件展示站 |
| `npm test` | 执行类型、构建、公开 API 和安装包消费检查 |
| `npm run build:preview` | 生成可独立部署的展示站目录 |

构建输出位于 `dist/`、`demo-dist/` 和 `build/`，不纳入版本控制。`npm test` 的消费检查使用 npm 本地缓存；请先完成 `npm ci`。

可选浏览器检查需要 Python 3 与 Playwright。安装 `pip install playwright`、执行 `python -m playwright install chromium`，启动展示站后，将 `HF_BASE_URL` 设为 `http://127.0.0.1:6633`，运行 `npm run test:browser` 或 `npm run test:completeness`。

## 项目结构

```text
src/          组件、主题、样式和 Monaco 集成
demo/         展示站源码与运行必需资源
scripts/      构建、静态服务和安装包验证脚本
test/         源码检查、API 契约和浏览器测试代码
```

组件导出见 [src/index.ts](./src/index.ts)，各组件的 Props 定义与实现保存在对应源码中。

## 参与贡献

欢迎通过 [Issues](https://github.com/weathersun66/harmony-flow-ui/issues) 提交问题与建议，或通过 Pull Request 贡献代码。报告问题时，请提供组件包版本、浏览器、复现步骤与最小示例。提交前运行 `npm test` 和 `npm run build:demo`，界面改动请同时验证交互及窄屏布局。

## 许可证

采用 [MIT License](./LICENSE)。随演示站分发的字体及 Monaco 构建资源遵循各自附带的许可证；再分发时请保留相关声明。
