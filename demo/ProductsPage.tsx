import { BrandLogo } from './Brand';
import { Button, ShrinkNav, ThemeProvider } from '../src';
import { AdvancedFormShowcase } from './AdvancedFormShowcase';
import { DataLayoutShowcase } from './DataLayoutShowcase';
import { DiscoveryShowcase } from './DiscoveryShowcase';
import { ExperienceShowcase } from './ExperienceShowcase';
import { FoundationShowcase } from './FoundationShowcase';
import { LoadingLayoutShowcase } from './LoadingLayoutShowcase';
import { NavigationShowcase } from './NavigationShowcase';
import { TemplateLinks } from './TemplatePreview';
import { WorkspaceShowcase } from './WorkspaceShowcase';

const coverage = [
  ['基础操作', '按钮、图标、排版、状态标签'],
  ['数据工作台', '统计、表格、筛选、分页、弹出层'],
  ['复杂表单', '校验、选择、上传、步骤与提交反馈'],
  ['导航结构', '顶部栏、侧边栏、面包屑、菜单与标签页'],
  ['系统反馈', '加载、骨架屏、空状态、抽屉、弹窗与提示'],
  ['完整体验', '登录、引导、数据洞察与响应式布局'],
] as const;

export function ProductsPage() {
  return <ThemeProvider>
    <div className="demo-shell product-page">
      <ShrinkNav
        brand={<a className="demo-brand" href="/" aria-label="返回 Harmony Flow 首页"><BrandLogo decorative /><strong>Harmony Flow</strong></a>}
        items={[{ key: 'overview', label: '成品总览', href: '#product-overview' }, { key: 'workspace', label: '工作台', href: '#workspace' }, { key: 'experience', label: '体验流程', href: '#experience' }, { key: 'components', label: '返回组件', href: '/#component-docs' }]}
        action={<Button size="sm" variant="secondary" onClick={() => window.location.href = '/'}>返回组件库</Button>}
      />
      <main id="product-overview">
        <section className="product-hero">
          <div>
            <p className="demo-kicker"><span /> COMPLETE PRODUCT CANVAS</p>
            <h1>不是组件拼盘，<br /><em>是一套会工作的界面。</em></h1>
            <p>这里集中展示 Harmony Flow 在真实产品里的组合方式：从入口、导航、数据、表单到反馈闭环。每个区域都可以操作，也可以单独打开全屏模板。</p>
            <div className="demo-actions"><Button size="lg" onClick={() => document.querySelector('#workspace')?.scrollIntoView({ behavior: 'smooth' })}>进入工作台</Button><Button size="lg" variant="quiet" onClick={() => window.location.href = '/#component-docs'}>查看组件 API →</Button></div>
          </div>
          <div className="product-coverage" aria-label="组件覆盖范围">
            {coverage.map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><p>{detail}</p></div>)}
          </div>
        </section>

        <section className="product-jump"><div><p className="demo-kicker">FULL-PAGE TEMPLATES</p><h2>选择一个成品，单独查看。</h2></div><TemplateLinks /></section>
        <div className="product-scene"><WorkspaceShowcase /></div>
        <div className="product-scene"><ExperienceShowcase /></div>
        <div className="product-scene"><DiscoveryShowcase /></div>
        <div className="product-scene"><DataLayoutShowcase /></div>
        <div className="product-scene"><AdvancedFormShowcase /></div>
        <div className="product-scene"><FoundationShowcase /></div>
        <div className="product-scene"><NavigationShowcase /></div>
        <div className="product-scene product-scene--last"><LoadingLayoutShowcase /></div>
      </main>
      <footer className="demo-footer"><span>Harmony Flow UI · 成品总览</span><a href="/">返回组件库 ↑</a></footer>
    </div>
  </ThemeProvider>;
}
