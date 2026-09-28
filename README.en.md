# Harmony Flow UI

[简体中文](./README.md) · **English**

A TypeScript component library for React applications, with customizable themes, interactive components, and a runnable component playground.

[npm](https://www.npmjs.com/package/@hxdhxd/harmony-flow-ui) · [Getting started](#getting-started) · [Local playground](#run-the-component-playground) · [Report an issue](https://github.com/weathersun66/harmony-flow-ui/issues)

## Features

- **169 components** covering controls, forms, navigation, data display, feedback, layouts, collaboration, and AI interfaces.
- **TypeScript support** with declarations, ES Modules, CommonJS, and a separate CSS entry point.
- **Customizable themes** with light, dark, and high-contrast modes, plus tokens for colors, radii, and motion.
- **Interactive behavior** with keyboard controls, focus management, and ARIA semantics. Explore individual behaviors in the playground.
- **Optional code editor** with enhanced editing through a separate Monaco entry point.
- **Component playground** with examples, Props, source code, mobile layouts, and liquid and particle material previews.

Liquid and particle effects currently belong to the playground previews. Published npm components use the base theme by default.

## Getting started

### 1. Install

Install the library in an existing React application. React and React DOM 18 or later are required.

```bash
npm install @hxdhxd/harmony-flow-ui
```

### 2. Import styles and use a component

Import the stylesheet once in your application entry point. Save this example as `App.tsx`:

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
          Clicked {count} times
        </Button>
      </main>
    </ThemeProvider>
  );
}
```

`ThemeProvider` applies a theme to its children. Events follow React conventions, and your application owns the state of controlled components. In frameworks such as Next.js App Router, place interactive examples in a client component with `'use client'` and import global CSS according to your framework's conventions.

## Usage guide

### Button appearance and states

```tsx
import { Button } from '@hxdhxd/harmony-flow-ui';

export function Actions() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="primary">Save</Button>
      <Button variant="outline" size="sm">Cancel</Button>
      <Button loading>Submit</Button>
      <Button disabled>Unavailable</Button>
    </div>
  );
}
```

`variant` accepts `primary`, `secondary`, `outline`, `quiet`, or `danger`; `size` accepts `sm`, `md`, or `lg`. Give icon-only buttons a descriptive `aria-label`. Some built-in labels currently use Chinese, including the button's loading text; an English application may need to adapt those labels.

### Customize the theme

```tsx
import { Button, ThemeProvider } from '@hxdhxd/harmony-flow-ui';

export function ThemedPanel() {
  return (
    <ThemeProvider
      mode="dark"
      tokens={{ colorPrimary: '#8b5cf6', colorPrimaryHover: '#7c3aed' }}
    >
      <Button>Custom theme</Button>
    </ThemeProvider>
  );
}
```

`mode` accepts `light`, `dark`, or `high-contrast`. `tokens` accepts a partial `ThemeTokens` object. See the [theme source](./src/theme/tokens.ts) for the complete definition.

### Create a scroll area

```tsx
import { VerticalScrollArea } from '@hxdhxd/harmony-flow-ui';

export function ActivityList() {
  return (
    <VerticalScrollArea label="Activity log" maxHeight={240}>
      {Array.from({ length: 30 }, (_, index) => (
        <p key={index}>Activity {index + 1}</p>
      ))}
    </VerticalScrollArea>
  );
}
```

Use `HorizontalScrollArea` for horizontal scrolling or `ScrollArea` for both axes. Vertical scrolling requires a height constraint. The forwarded `ref` points to the actual scrolling element and supports `scrollTo()`.

### Use the Monaco editor

1. Import the separate component entry point and its styles.
2. Copy everything from `node_modules/@hxdhxd/harmony-flow-ui/dist/monaco-assets/` to your application's static directory, for example `public/monaco/`. Preserve the directory structure, Workers, fonts, and license files. Serve them from the same origin at `/monaco/`.
3. Manage editor content with `value` and `onChange`.

```tsx
import { useState } from 'react';
import { MonacoCodeEditor } from '@hxdhxd/harmony-flow-ui/monaco';
import '@hxdhxd/harmony-flow-ui/style.css';
import '@hxdhxd/harmony-flow-ui/monaco/style.css';

export function ScriptEditor() {
  const [value, setValue] = useState('const message = "Hello";');

  return (
    <MonacoCodeEditor
      label="Script editor"
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

Monaco resources load on demand. Mobile devices use the lightweight editor by default; you can also set `lightweight` explicitly. A fallback is available when loading fails. Enhanced editor instances on the same page should share a theme. Update the static assets whenever you upgrade the package.

## Run the component playground

Building from source requires Node.js 18 or later and npm.

```bash
git clone https://github.com/weathersun66/harmony-flow-ui.git
cd harmony-flow-ui
npm ci
npm run build:demo
npm run serve
```

Open [http://localhost:6633](http://localhost:6633). Browse categories or search for a component, inspect its Props, adjust preview controls, and copy example code. The playground currently uses Chinese interface text. It is built with esbuild; rerun `npm run build:demo` after editing source files.

Server configuration supports `HF_DEMO_PORT` (default `6633`), `HF_DEMO_HOST` (default `0.0.0.0`), and `HF_DEMO_ROOT` (defaults to `public` when present, otherwise `demo-dist`). Playground data is illustrative. Connect authentication, authorization, network requests, and persistence in your own application.

## Build from source

| Command | Purpose |
| --- | --- |
| `npm run check` | Check TypeScript and source structure |
| `npm run build` | Build ESM, CommonJS, declarations, CSS, and Monaco assets |
| `npm run build:demo` | Build the component playground |
| `npm test` | Run type, build, public API, and package consumption checks |
| `npm run build:preview` | Generate a standalone playground deployment directory |

Generated files live in `dist/`, `demo-dist/`, and `build/` and are excluded from version control. The package consumption check in `npm test` uses the local npm cache; run `npm ci` first.

Optional browser checks require Python 3 and Playwright. Run `pip install playwright` and `python -m playwright install chromium`, start the playground, set `HF_BASE_URL` to `http://127.0.0.1:6633`, then run `npm run test:browser` or `npm run test:completeness`.

## Repository structure

```text
src/          Components, themes, styles, and Monaco integration
demo/         Playground source and required runtime assets
scripts/      Build, static server, and package verification scripts
test/         Source checks, API contract, and browser test code
```

See [src/index.ts](./src/index.ts) for public exports. Component source files contain their Props definitions and implementations.

## Contributing

Report bugs and suggest improvements through [Issues](https://github.com/weathersun66/harmony-flow-ui/issues), or contribute a Pull Request. Include the package version, browser, reproduction steps, and a minimal example when reporting a bug. Run `npm test` and `npm run build:demo` before submitting; verify interactions and narrow layouts for UI changes.

## License

Released under the [MIT License](./LICENSE). Bundled playground fonts and Monaco build assets retain their own included licenses. Preserve those notices when redistributing them.
