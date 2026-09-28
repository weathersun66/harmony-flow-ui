import type { ComponentDoc, ComponentPropDoc } from "./types";
import {
  CitationListPreview,
  CodeBlockPreview,
  DiffViewerPreview,
  JsonViewerPreview,
  MarkdownContentPreview,
  TokenUsagePreview,
} from "./developer-data-previews";
import "./developer-data-docs.css";

const prop = (
  name: string,
  type: string,
  defaultValue: string,
  description: string,
): ComponentPropDoc => ({ name, type, defaultValue, description });

export const developerDataDocs: readonly ComponentDoc[] = [
  {
    name: "JsonViewer",
    title: "JSON 查看器",
    category: "数据展示",
    description:
      "以可折叠树结构检查嵌套对象和数组，适合工具输入、API 响应与运行载荷。",
    importCode: "import { JsonViewer } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<JsonViewer data={run} name="agentRun" maxDepth={2} />`,
    preview: <JsonViewerPreview />,
    props: [
      prop("data", "unknown", "—", "需要检查的数据"),
      prop("name", "string", "—", "根节点名称与可访问名称"),
      prop("defaultExpanded", "boolean", "true", "默认展开节点"),
      prop("maxDepth", "number", "2", "默认展开深度"),
    ],
    keyboard: "Tab 聚焦节点；Enter 或 Space 展开和折叠对象。",
    related: ["CodeBlock", "DiffViewer", "ToolCallCard"],
  },
  {
    name: "DiffViewer",
    title: "差异对比器",
    category: "数据展示",
    description:
      "按行展示文本修改，支持并排和统一视图，适合代码补丁与配置变更审阅。",
    importCode: "import { DiffViewer } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<DiffViewer before={before} after={after} mode="split" />`,
    preview: <DiffViewerPreview />,
    props: [
      prop("before", "string", "—", "修改前文本"),
      prop("after", "string", "—", "修改后文本"),
      prop("mode", "'split' | 'unified'", "'split'", "差异布局"),
      prop("beforeLabel", "string", "'修改前'", "左侧标题"),
    ],
    keyboard: "只读内容按行读取；视图切换按钮支持标准键盘操作。",
    related: ["CodeBlock", "JsonViewer", "VersionHistory"],
  },
  {
    name: "MarkdownContent",
    title: "Markdown 内容",
    category: "数据展示",
    description:
      "安全渲染标题、列表、引用、链接、强调和代码块等常用 Markdown 内容。",
    importCode: "import { MarkdownContent } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<MarkdownContent content={report} />`,
    preview: <MarkdownContentPreview />,
    props: [
      prop("content", "string", "—", "Markdown 源文本"),
      prop("className", "string", "''", "附加样式类"),
    ],
    keyboard:
      "内容遵循标题与列表的语义阅读顺序；链接和嵌入代码按钮可正常聚焦。",
    related: ["CodeBlock", "ChatMessage", "CitationList"],
  },
  {
    name: "CodeBlock",
    title: "代码块",
    category: "数据展示",
    description: "展示带语言、文件名、行号和复制操作的源码片段。",
    importCode: "import { CodeBlock } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<CodeBlock code={source} language="typescript" filename="request.ts" />`,
    preview: <CodeBlockPreview />,
    props: [
      prop("code", "string", "—", "源码文本"),
      prop("language", "string", "'text'", "语言标签"),
      prop("filename", "ReactNode", "—", "文件名"),
      prop("wrap", "boolean", "false", "是否折行"),
      prop("onCopy", "(code: string) => void", "—", "复制完成回调"),
    ],
    keyboard: "Tab 聚焦复制按钮；Enter 或 Space 复制代码。",
    related: ["MarkdownContent", "DiffViewer", "JsonViewer"],
  },
  {
    name: "CitationList",
    title: "引用来源",
    category: "数据展示",
    description:
      "列出 AI 回答使用的来源、摘要和出处，并支持选择来源进行进一步检查。",
    importCode: "import { CitationList } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<CitationList items={sources} onSelect={openSource} />`,
    preview: <CitationListPreview />,
    props: [
      prop("items", "readonly CitationItem[]", "—", "引用来源"),
      prop("title", "ReactNode", "'参考来源'", "区域标题"),
      prop("onSelect", "(item) => void", "—", "来源选择回调"),
    ],
    keyboard: "Tab 在来源间移动；Enter 打开链接或触发选择。",
    related: ["MarkdownContent", "ChatMessage", "InsightBoard"],
  },
  {
    name: "TokenUsage",
    title: "Token 用量",
    category: "数据展示",
    description: "显示上下文预算使用比例，并拆分输入、输出和缓存 Token。",
    importCode: "import { TokenUsage } from '@hxdhxd/harmony-flow-ui';",
    exampleCode: `<TokenUsage used={21700} limit={32000} input={18420} output={3280} />`,
    preview: <TokenUsagePreview />,
    props: [
      prop("used", "number", "—", "已用 Token"),
      prop("limit", "number", "—", "Token 上限"),
      prop("input", "number", "—", "输入 Token"),
      prop("output", "number", "—", "输出 Token"),
      prop("compact", "boolean", "false", "紧凑显示"),
    ],
    keyboard: "进度通过 progressbar 语义公布；密度切换按钮支持标准键盘操作。",
    related: ["CircularProgress", "StatisticCard", "ChatMessage"],
  },
];
