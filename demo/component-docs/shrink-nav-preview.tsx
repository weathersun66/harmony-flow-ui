import { useId, useState } from 'react';
import { Brand } from '../Brand';
import { Button, ShrinkNav } from '../workspace/InspectableLibrary';
import './shrink-nav-preview.css';

const sections = [
  { key: 'overview', label: '概览', eyebrow: '产品工作台', title: '把项目进展放在同一页',
    description: '查看交付进度、团队分工与发布准备。向下滚动浏览内容，顶部导航会自动收紧。',
    cards: [['12', '本周完成事项'], ['3', '协作中的项目'], ['96%', '发布检查通过率']] },
  { key: 'workflow', label: '协作', eyebrow: '从计划到交付', title: '让每一步都有明确负责人',
    description: '把需求拆成可执行事项，在设计、开发与验收之间保持进度同步。',
    cards: [['01', '明确目标与验收标准'], ['02', '分配负责人并跟踪进度'], ['03', '完成评审与回归验证']] },
  { key: 'release', label: '发布', eyebrow: '交付准备', title: '确认准备情况，再开始发布',
    description: '核对版本内容、验证结果和回滚方案，让团队清楚本次交付的范围。',
    cards: [['已完成', '功能与交互验证'], ['已准备', '版本说明与交付文件'], ['可恢复', '上一版本与配置备份']] },
];

export function ShrinkNavPreview() {
  const id = useId();
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const [active, setActive] = useState('overview');
  const [scrolled, setScrolled] = useState(false);
  const items = sections.map(section => ({ key: section.key, label: section.label, href: `#${id}-${section.key}` }));
  const jump = (key: string) => {
    if (!target) return;
    const section = target.querySelector<HTMLElement>(`[data-section="${key}"]`);
    if (!section) return;
    const inset = matchMedia('(max-width: 720px)').matches ? 124 : 88;
    const top = key === 'overview' ? 0 : section.offsetTop - inset;
    target.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    section.focus({ preventScroll: true });
  };
  const measure = () => {
    if (!target) return;
    setScrolled(target.scrollTop > 48);
    const visible = [...target.querySelectorAll<HTMLElement>('[data-section]')]
      .filter(section => section.offsetTop <= target.scrollTop + 140).at(-1);
    setActive(visible?.dataset.section ?? 'overview');
  };
  return <div className="shrink-preview" data-doc-preview="shrinknav">
    <div className="shrink-preview__caption"><span>在下方页面内滚动，或点击导航跳转</span>
      <span className="shrink-preview__state">{scrolled ? '已滚动 · 导航收紧' : '页面顶部 · 导航展开'}</span></div>
    <div className="shrink-preview__viewport" ref={setTarget} onScroll={measure} tabIndex={0}
      role="region" aria-label="收缩导航演示页面">
      <ShrinkNav target={target} threshold={48} brand={<Brand label="Harmony" />} items={items} activeKey={active}
        onClickCapture={event => { if ((event.target as HTMLElement).closest('a')) event.preventDefault(); }}
        onItemSelect={item => jump(item.key)} action={<Button size="sm" variant="secondary" onClick={() => jump('overview')}>回到顶部</Button>} />
      {sections.map(section => <section className="shrink-preview__section" key={section.key}
        id={`${id}-${section.key}`} data-section={section.key} tabIndex={-1} aria-labelledby={`${id}-${section.key}-title`}>
        <span className="shrink-preview__eyebrow">{section.eyebrow}</span>
        <h2 id={`${id}-${section.key}-title`}>{section.title}</h2><p>{section.description}</p>
        <div className="shrink-preview__cards">{section.cards.map(([value, label]) =>
          <article key={label}><strong>{value}</strong><span>{label}</span></article>)}</div>
        {section.key === 'overview' && <Button onClick={() => jump('workflow')}>查看协作流程</Button>}
        {section.key === 'release' && <Button variant="secondary" onClick={() => jump('overview')}>返回项目概览</Button>}
      </section>)}
    </div>
  </div>;
}
