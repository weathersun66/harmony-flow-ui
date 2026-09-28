import { useState } from "react";
import {
  Button,
  CitationList,
  CodeBlock,
  DiffViewer,
  JsonViewer,
  MarkdownContent,
  TokenUsage,
} from '../workspace/InspectableLibrary';

function DevScene({
  slug,
  title,
  status,
  children,
}: {
  slug: string;
  title: string;
  status: string;
  children: React.ReactNode;
}) {
  return (
    <section className="developer-data-scene" data-doc-preview={slug}>
      <header>
        <span>AGENT DEBUG CONSOLE</span>
        <h4>{title}</h4>
      </header>
      <div>{children}</div>
      <output aria-live="polite">{status}</output>
    </section>
  );
}

const payload = {
  runId: "run_8fc2",
  status: "success",
  model: { name: "gpt-5", latency: 842 },
  tools: ["search", "code"],
  usage: { input: 18420, output: 3280 },
};

export function JsonViewerPreview() {
  const [depth, setDepth] = useState(2);
  return (
    <DevScene
      slug="jsonviewer"
      title="运行载荷"
      status={`默认展开深度：${depth}`}
    >
      <JsonViewer data={payload} name="agentRun" maxDepth={depth} />
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setDepth((value) => (value === 2 ? 4 : 2))}
      >
        切换展开深度
      </Button>
    </DevScene>
  );
}

export function DiffViewerPreview() {
  const [mode, setMode] = useState<"split" | "unified">("split");
  const before = `const timeout = 3000;\nreturn fetch(url, { timeout });`;
  const after = `const timeout = 8000;\nconst signal = AbortSignal.timeout(timeout);\nreturn fetch(url, { signal });`;
  return (
    <DevScene
      slug="diffviewer"
      title="修复差异"
      status={`查看模式：${mode === "split" ? "并排" : "统一"}`}
    >
      <DiffViewer
        before={before}
        after={after}
        mode={mode}
        beforeLabel="修复前"
        afterLabel="修复后"
      />
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          setMode((value) => (value === "split" ? "unified" : "split"))
        }
      >
        切换差异模式
      </Button>
    </DevScene>
  );
}

export function MarkdownContentPreview() {
  const [detail, setDetail] = useState(false);
  const content = detail
    ? `## 诊断结论\n\n**根因**是请求超时过短。\n\n- 将超时调整为 8 秒\n- 使用 \`AbortSignal.timeout\`\n\n> 变更已通过浏览器回归。`
    : `## 执行摘要\n\n本次运行完成 **3 项检查**，没有发现阻断问题。`;
  return (
    <DevScene
      slug="markdowncontent"
      title="Agent 报告"
      status={detail ? "正在查看详细诊断" : "正在查看执行摘要"}
    >
      <MarkdownContent content={content} />
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setDetail((value) => !value)}
      >
        切换报告内容
      </Button>
    </DevScene>
  );
}

export function CodeBlockPreview() {
  const [copied, setCopied] = useState(false);
  const code = `const response = await fetch(endpoint, {\n  signal: AbortSignal.timeout(8000),\n});\nreturn response.json();`;
  return (
    <DevScene
      slug="codeblock"
      title="建议补丁"
      status={copied ? "代码已复制" : "等待复制"}
    >
      <CodeBlock
        code={code}
        language="typescript"
        filename="request.ts"
        onCopy={() => setCopied(true)}
      />
    </DevScene>
  );
}

export function CitationListPreview() {
  const [selected, setSelected] = useState("尚未选择来源");
  const items = [
    {
      id: "api",
      title: "AbortSignal.timeout()",
      url: "https://developer.mozilla.org/docs/Web/API/AbortSignal/timeout_static",
      source: "MDN Web Docs",
      excerpt: "创建一个在指定时间后自动中止的信号。",
    },
    {
      id: "fetch",
      title: "Fetch API 错误处理",
      url: "https://fetch.spec.whatwg.org/",
      source: "WHATWG",
      excerpt: "网络错误与应用层响应需要分别处理。",
    },
  ];
  return (
    <DevScene slug="citationlist" title="回答依据" status={selected}>
      <CitationList
        items={items}
        onSelect={(item) => setSelected(`已选择：${String(item.title)}`)}
      />
    </DevScene>
  );
}

export function TokenUsagePreview() {
  const [compact, setCompact] = useState(false);
  return (
    <DevScene
      slug="tokenusage"
      title="上下文预算"
      status={compact ? "紧凑模式" : "详细模式"}
    >
      <TokenUsage
        used={21700}
        limit={32000}
        input={18420}
        output={3280}
        cached={6400}
        compact={compact}
      />
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setCompact((value) => !value)}
      >
        切换显示密度
      </Button>
    </DevScene>
  );
}
