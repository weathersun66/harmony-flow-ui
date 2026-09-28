import { defaultTheme } from '../../src/theme/tokens';
import { catalog, categories } from './catalog/catalog';
import { resources } from './resources';
import { RouteLink } from './routing';
import { InstallSnippet, QuickStart, installCommand, monacoExample, packageName, packageVersion } from './Installation';

export function Overview() {
  return <section><div className="ws-page-heading"><div><p className="ws-eyebrow">HARMONY FLOW / DEVELOPER WORKSPACE</p><h1>从组件到完整界面</h1><p>{catalog.length} 个组件，统一的交互语言与可直接检查的实现。</p></div><RouteLink className="ws-primary" href="/components">浏览组件 →</RouteLink></div><h2>按任务浏览</h2><div className="ws-resource-grid">{categories.map(category => <RouteLink key={category.id} href={`/components?category=${category.id}`}><span className="ws-category-glyph">{category.icon}</span><h2>{category.title}<small>{catalog.filter(item => item.category === category.id).length}</small></h2><p>{category.english}</p></RouteLink>)}</div><h2>接入项目</h2><QuickStart /></section>;
}
export function Design() {
  return <section className="ws-reading"><p className="ws-eyebrow">DESIGN SYSTEM</p><h1>设计与主题</h1><p>白色内容面、浅蓝窗口背景与清晰的实体层级。通过语义 Token 统一组件，而非覆盖内部样式。</p><h2>主题 Tokens</h2><div className="ws-table-scroll"><table><thead><tr><th>名称</th><th>默认值</th><th>预览</th></tr></thead><tbody>{Object.entries(defaultTheme).map(([key, value]) => <tr id={key} key={key}><td><code>{key}</code></td><td><code>{value}</code></td><td>{key.startsWith('color') && <span className="ws-swatch" style={{ background: value }} />}</td></tr>)}</tbody></table></div><h2>排版与密度</h2><p>展示站英文采用 Inter，中文优先苹方或微软雅黑。组件预览保留原有字体，文档代码采用 JetBrains Mono 等宽字体。普通区域靠间距、细边界和标题层级区分。</p><h2>键盘与状态</h2><p>操作必须能通过键盘到达，焦点状态应清晰可辨：输入类控件使用边框反馈，其他控件保留键盘焦点提示。禁用、加载、错误和成功均使用明确语义，减少动态偏好下关闭非必要动效。</p><RouteLink href="/components/themeprovider">ThemeProvider 文档 →</RouteLink><h2>图标</h2><p>图标配合明确的可访问名称使用；单独图标按钮应提供 aria-label。</p><RouteLink href="/components/icon">查看 Icon →</RouteLink></section>;
}
export function Resources() {
  return <section className="ws-reading">
    <p className="ws-eyebrow">RESOURCES</p><h1>安装与资源</h1>
    <p>文档版本 {packageVersion} · {catalog.length} 个组件 · React 18+ · TypeScript · ESM / CommonJS · MIT</p>
    <h2 id="getting-started">快速接入</h2><QuickStart />
    <h2>版本与升级</h2>
    <p>当前组件目录对应 {packageVersion}，包含 {catalog.length} 个组件。安装包包含类型声明、ESM / CommonJS 入口和样式；组件 API 与交互示例可在组件详情页查看。</p>
    <p>从旧版升级到本文档版本，可在现有项目中执行下方命令。升级后检查主题配置、表单状态和键盘交互。</p>
    <InstallSnippet code={installCommand} label="复制升级命令" />
    <p>0.5.0 新增横向、纵向与双向滚动区域，收缩导航支持独立滚动容器。展示站提供液态与粒子预览、完整导航演示及内部操作按钮材质切换；npm 默认组件保留原有主题。</p>
    <h2>主题与使用</h2>
    <p>ThemeProvider 支持 light、dark 和 high-contrast 模式，可通过 tokens 调整颜色、圆角、阴影和动效。基础样式应在应用入口统一导入，避免逐个覆盖组件内部样式。</p>
    <div className="ws-related"><RouteLink href="/components/themeprovider">ThemeProvider 文档 →</RouteLink><RouteLink href="/design">设计与主题 →</RouteLink><RouteLink href="/components">全部组件 →</RouteLink></div>
    <h2>可选 Monaco 编辑器</h2>
    <p>普通组件使用主入口；需要代码高亮与编辑能力时，单独导入 MonacoCodeEditor。原 CodeEditor 继续可用。</p>
    <InstallSnippet code={monacoExample} label="复制 Monaco 示例" />
    <p>将 node_modules/{packageName}/dist/monaco-assets/ 整个目录复制到站点可访问的 /monaco/，保留 chunks、fonts、Worker、CSS 和许可证文件。assetsUrl 可指定其他同源目录，无需另外安装 monaco-editor。</p>
    <p>Monaco 资源按需加载，移动端或加载失败时使用轻量编辑器；同页多个增强编辑器应使用统一主题。</p>
    <RouteLink href="/components/codeeditor">代码编辑器文档 →</RouteLink>
    <h2>示例与下载</h2>
    <p>页面模板提供完整预览与源码 ZIP，包含示例数据、所需组件、样式和品牌资源。真实接口、权限与持久化需要接入自己的业务。</p>
    <div className="ws-related"><RouteLink href="/templates">页面模板与源码下载 →</RouteLink><RouteLink href="/patterns">组合模式 →</RouteLink></div>
    <h2>工作区与迁移</h2>
    <p>旧组件详情 URL 保持可用。成品页面入口整合为页面模板；收藏和最近访问保存在当前浏览器。站点 Logo 与预览图属于展示资源更新，具体 API 以安装包版本为准。</p>
    <h2>源码与贡献</h2>
    <div className="ws-related"><a href={`https://www.npmjs.com/package/${packageName}/v/${packageVersion}`} target="_blank" rel="noreferrer">npm · {packageVersion} ↗</a><a href="https://github.com/weathersun66/harmony-flow-ui" target="_blank" rel="noreferrer">GitHub 仓库 ↗</a></div>
    <p>提交问题时附上组件名称、安装版本、复现步骤与运行环境。贡献前请核对现有 API、主题契约、无障碍与回归测试。</p>
  </section>;
}
const dependencies: Record<string, string[]> = {
  dashboard: ['KanbanBoard', 'Table', 'Stat', 'Avatar'],
  onboarding: ['AuthLayout', 'Input', 'Button', 'Switch'],
  insights: ['InsightBoard', 'Sparkline', 'StatisticCard'],
};
export function Templates({ slug }: { slug?: string }) {
  const template = resources.find(resource => resource.id === slug && resource.type === '页面模板');
  if (template) return <section className="ws-reading"><RouteLink href="/templates">← 全部页面模板</RouteLink><h1>{template.title}</h1><p>{template.description}</p><a className="ws-primary" href={`/templates/${template.id}`}>打开全屏预览 ↗</a><h2>布局结构</h2><p>{slug === 'dashboard' ? '页面导航 → 数据概览 → 任务列表与协作区域' : slug === 'onboarding' ? '品牌辅助区 → 身份表单 → 结果与引导' : '指标摘要 → 趋势分析 → 明细与筛选'}</p><h2>主要依赖组件</h2><div className="ws-related">{dependencies[template.id]!.map(name => <RouteLink key={name} href={`/components/${name.toLowerCase()}`}>{name} →</RouteLink>)}</div><h2>获取完整示例</h2><p>下载包包含模板源码、示例数据、所需源码与样式及运行说明。真实接口、权限与持久化需按业务环境接入。</p><a className="ws-button" href={`/downloads/${template.id}.zip`} download>下载源码 ZIP</a><h2>数据与操作边界</h2><p>模板使用本地示例数据，预览内的操作不会修改真实业务数据。接入时应验证加载、失败、空状态、权限和网络取消流程。</p></section>;
  return <section><div className="ws-page-heading"><div><p className="ws-eyebrow">TEMPLATES</p><h1>页面模板</h1><p>经过组合的完整页面，检查布局、交互与依赖后带入项目。</p></div></div><div className="ws-resource-grid">{resources.filter(r => r.type === '页面模板').map(r => <RouteLink key={r.id} href={r.url}><div className="ws-template-diagram" aria-hidden="true"><i /><div><b /><span /><span /><span /></div></div><h2>{r.title}</h2><p>{r.description}</p><span>查看结构与预览 →</span></RouteLink>)}</div></section>;
}
