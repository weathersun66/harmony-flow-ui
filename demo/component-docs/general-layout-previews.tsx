import { Brand } from '../Brand';
import { useState, type ReactNode } from 'react';
import {
  AuthLayout, AvatarGroup, Button, ButtonGroup, Card, Hero, IconButton, Input, Masonry,
  PageLayout, PromptSuggestions, ResizablePanel, SplitButton, ThemeProvider,
  type PromptSuggestion,
} from '../workspace/InspectableLibrary';

function Scene({ slug, children }: { slug: string; children: ReactNode }) {
  return <div className="catalog-scene" data-doc-preview={slug}>{children}</div>;
}

export function AuthLayoutPreview() {
  return (
    <Scene slug="authlayout">
      <AuthLayout variant="step" currentStep={2} steps={3} brand={<Brand label="Harmony Cloud" />} footer="继续即表示同意团队安全策略">
        <div className="demo-stack">
          <span className="catalog-scene__status">第 2 步 · 创建工作区</span>
          <Input label="工作区名称" defaultValue="产品体验组" />
          <Button>继续配置</Button>
        </div>
      </AuthLayout>
    </Scene>
  );
}

export function CardPreview() {
  const metrics = [['成功率', '98.6%'], ['平均耗时', '1.8s'], ['待处理', '12']];
  return (
    <Scene slug="card">
      <div className="catalog-scene__bar"><strong>今日运行概览</strong><span>刚刚更新</span></div>
      <div className="catalog-scene__cards">
        {metrics.map(([label, value]) => (
          <Card key={label} eyebrow="Metric" title={label} interactive>
            <strong>{value}</strong><p>较昨日保持稳定</p>
          </Card>
        ))}
      </div>
    </Scene>
  );
}

export function HeroPreview() {
  const visual = <div className="catalog-scene__visual" aria-label="任务完成趋势"><i /><i /><i /><i /></div>;
  return (
    <div data-doc-preview="hero">
      <Hero
        eyebrow="WORKFLOW STUDIO"
        title="把复杂流程，变成清晰下一步。"
        description="连接数据、编排任务，并在每个关键节点保留人工确认。"
        primaryAction={<Button>创建工作流</Button>}
        secondaryAction={<Button variant="quiet">查看示例</Button>}
        proof="已服务 28 个协作团队"
        visual={visual}
      />
    </div>
  );
}

export function MasonryPreview() {
  const notes = [
    ['需求澄清', '确认权限边界与异常路径。', ''],
    ['视觉检查', '桌面、移动和暗色主题均需验证。', 'is-tall'],
    ['发布准备', '构建产物与回滚记录已就绪。', ''],
  ];
  return (
    <Scene slug="masonry">
      <div className="catalog-scene__bar"><strong>项目便签</strong><span>自动适应内容高度</span></div>
      <Masonry minColumnWidth={180} gap={12}>
        {notes.map(([title, body, className]) => (
          <article className={`catalog-masonry-note ${className}`} key={title}>
            <strong>{title}</strong><p>{body}</p>
          </article>
        ))}
      </Masonry>
    </Scene>
  );
}

export function PageLayoutPreview() {
  const navigation = <nav aria-label="工作台导航">概览<br />任务<br />成员</nav>;
  return (
    <Scene slug="pagelayout">
      <PageLayout className="catalog-mini-layout" variant="dashboard" sidebarWidth={150} header={<strong>运营工作台</strong>} sidebar={navigation}>
        <div className="catalog-scene__metric"><small>活跃任务</small><strong>24</strong></div>
        <div className="catalog-scene__metric"><small>今日完成</small><strong>18</strong></div>
      </PageLayout>
    </Scene>
  );
}

export function SplitButtonPreview() {
  const [result, setResult] = useState('等待发布操作');
  const options = [
    { key: 'staging', label: '发布到预发环境' },
    { key: 'schedule', label: '定时发布' },
    { key: 'rollback', label: '查看回滚点' },
  ];
  return (
    <Scene slug="splitbutton">
      <div className="catalog-scene__bar"><strong>版本 v2.4.0</strong><span>所有检查已通过</span></div>
      <SplitButton label="发布生产环境" options={options} onPrimaryAction={() => setResult('已开始发布生产环境')} onOptionSelect={(key) => setResult(`已选择：${key}`)} />
      <p className="catalog-avatar-result" role="status">{result}</p>
    </Scene>
  );
}

export function ThemeProviderPreview() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  return (
    <Scene slug="themeprovider">
      <div className="catalog-scene__bar">
        <strong>局部主题沙盒</strong>
        <Button size="sm" variant="secondary" onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>切换为{mode === 'light' ? '暗色' : '浅色'}</Button>
      </div>
      <ThemeProvider mode={mode} tokens={{ colorPrimary: '#19a989' }}>
        <div className="catalog-theme-sample"><h4>青瓷工作区</h4><p>主题令牌在运行时同步影响颜色、边框与焦点状态。</p><Button>保存主题</Button></div>
      </ThemeProvider>
    </Scene>
  );
}

export function IconButtonPreview() {
  const [count, setCount] = useState(2);
  return (
    <Scene slug="iconbutton">
      <div className="catalog-scene__bar"><strong>快捷操作</strong><span>每个图标都有可访问名称</span></div>
      <ButtonGroup aria-label="消息快捷操作">
        <IconButton label="标记为已读" icon="✓" variant="secondary" onClick={() => setCount(0)} />
        <IconButton label="固定消息" icon="⌖" variant="secondary" />
        <IconButton label="删除消息" icon="×" variant="danger" />
      </ButtonGroup>
      <p role="status">未读消息：{count}</p>
    </Scene>
  );
}

export function ButtonGroupPreview() {
  const [view, setView] = useState('列表');
  return (
    <Scene slug="buttongroup">
      <div className="catalog-scene__bar"><strong>项目视图</strong><span>当前：{view}</span></div>
      <ButtonGroup aria-label="选择项目视图">
        {['列表', '看板', '时间线'].map((item) => <Button key={item} variant={view === item ? 'primary' : 'secondary'} onClick={() => setView(item)}>{item}</Button>)}
      </ButtonGroup>
      <div className="catalog-scene__metric"><small>视图已切换</small><strong>{view}</strong></div>
    </Scene>
  );
}

export function ResizablePanelPreview() {
  const [size, setSize] = useState(44);
  const editor = <div className="catalog-resize-pane"><strong>Markdown 编辑器</strong><p># 产品发布说明</p></div>;
  const preview = <div className="catalog-resize-pane is-secondary"><strong>实时预览</strong><p>产品发布说明</p></div>;
  return (
    <Scene slug="resizablepanel">
      <div className="catalog-scene__bar"><strong>编辑与预览</strong><span>编辑区 {Math.round(size)}%</span></div>
      <ResizablePanel defaultSize={44} minSize={28} maxSize={72} onResize={setSize} primary={editor} secondary={preview} />
    </Scene>
  );
}

export function PromptSuggestionsPreview() {
  const [selected, setSelected] = useState('尚未选择建议');
  const items: PromptSuggestion[] = [
    { id: 'summary', title: '总结本周进展', description: '提炼完成项、风险与下一步', icon: '✦' },
    { id: 'review', title: '审查发布风险', description: '检查权限、数据和兼容性', icon: '◇' },
  ];
  return (
    <Scene slug="promptsuggestions">
      <PromptSuggestions title="你可以这样开始" items={items} onSelect={(item) => setSelected(String(item.title))} />
      <div className="catalog-prompt-result" role="status">已选择：{selected}</div>
    </Scene>
  );
}

export function AvatarGroupPreview() {
  const [message, setMessage] = useState('4 位成员正在协作');
  const items = [
    { id: 'lin', name: '林晓', status: 'online' as const },
    { id: 'chen', name: '陈屿', status: 'busy' as const },
    { id: 'zhou', name: '周宁', status: 'away' as const },
    { id: 'sun', name: '孙禾', status: 'online' as const },
    { id: 'gao', name: '高远', status: 'online' as const },
    { id: 'xu', name: '徐然', status: 'away' as const },
  ];
  return (
    <Scene slug="avatargroup">
      <div className="catalog-scene__bar"><strong>设计评审</strong><span>今天 15:30</span></div>
      <AvatarGroup items={items} max={4} size="lg" onMore={() => setMessage('已展开其余 2 位成员')} />
      <p className="catalog-avatar-result" role="status">{message}</p>
    </Scene>
  );
}
