import { useState, type ComponentType } from 'react';
import { Button, SegmentedControl, Select, ThemeProvider } from '../src';
import { DiscoveryShowcase } from './DiscoveryShowcase';
import { ExperienceShowcase } from './ExperienceShowcase';
import { WorkspaceShowcase } from './WorkspaceShowcase';

type Viewport = 'desktop' | 'tablet' | 'mobile';
const templates: Record<string, { title: string; component: ComponentType }> = {
  dashboard: { title: '数据与任务工作台', component: WorkspaceShowcase },
  onboarding: { title: '入口与身份验证', component: ExperienceShowcase },
  insights: { title: '运营洞察中心', component: DiscoveryShowcase },
};
const colors = { blue: '#0a7cff', green: '#19a989', violet: '#7657e6' } as const;

export function TemplatePreview({ slug }: { slug: string }) {
  const template = templates[slug] ?? templates.dashboard!;
  const Preview = template.component;
  const [accent, setAccent] = useState<keyof typeof colors>('blue');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const viewportWidth = { desktop: 1440, tablet: 820, mobile: 390 }[viewport];
  return <ThemeProvider tokens={{ colorPrimary: colors[accent] }}>
    <div className={`template-preview template-preview--${density}`}>
      <header className="template-toolbar">
        <a href="/products" aria-label="返回成品页面">← <span>返回</span></a>
        <div className="template-toolbar__title"><small>实时成品预览</small><strong>{template.title}</strong></div>
        <div className="template-toolbar__controls">
          <Select aria-label="预览主题" value={accent} onChange={(event) => setAccent(event.target.value as keyof typeof colors)} options={[{ label: '云水蓝', value: 'blue' }, { label: '青瓷绿', value: 'green' }, { label: '鸢尾紫', value: 'violet' }]} />
          <Select aria-label="预览密度" value={density} onChange={(event) => setDensity(event.target.value as typeof density)} options={[{ label: '舒展', value: 'comfortable' }, { label: '紧凑', value: 'compact' }]} />
          <SegmentedControl label="预览设备" value={viewport} onChange={setViewport} options={[{ label: '桌面', value: 'desktop' }, { label: '平板', value: 'tablet' }, { label: '移动', value: 'mobile' }]} />
        </div>
        <Button size="sm" variant="quiet" onClick={() => window.location.href = '/products'}>退出预览</Button>
      </header>
      <main className={`template-stage template-stage--${viewport}`}><div style={{ maxWidth: viewportWidth }}><Preview /></div></main>
    </div>
  </ThemeProvider>;
}

export function TemplateLinks() {
  return <div className="template-links" aria-label="完整页面预览">
    <div><span>Dashboard</span><strong>数据与任务工作台</strong><a href="/templates/dashboard">全屏预览 ↗</a></div>
    <div><span>Authentication</span><strong>入口与身份验证</strong><a href="/templates/onboarding">全屏预览 ↗</a></div>
    <div><span>Analytics</span><strong>运营洞察中心</strong><a href="/templates/insights">全屏预览 ↗</a></div>
  </div>;
}
