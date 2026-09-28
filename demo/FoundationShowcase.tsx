import { useState } from 'react';
import { Alert, Avatar, Badge, Button, Checkbox, Divider, EmptyState, Icon, Link, Radio, Tag, Textarea, Tooltip, Typography } from '../src';

export function FoundationShowcase() {
  const [tagVisible, setTagVisible] = useState(true);
  const [alertVisible, setAlertVisible] = useState(true);
  return <section className="demo-section foundation-showcase" aria-labelledby="foundation-showcase-title">
    <div className="demo-section__heading"><div><p className="demo-kicker">CONTENT & STATUS</p><h2 id="foundation-showcase-title">内容原子与状态表达</h2></div><span>真实组件，可聚焦、可操作、可直接引用</span></div>
    <div className="foundation-showcase__grid">
      <article className="foundation-sample foundation-sample--wide"><header><span>CONTENT</span><h3>Typography · Icon · Link · Divider</h3></header><Typography variant="h2">清楚表达，胜过堆叠装饰。</Typography><Typography muted>稳定的字阶、图标与链接语义，让内容在不同业务里保持一致。</Typography><div className="foundation-sample__row"><Link href="#getting-started">查看接入方式 <Icon name="arrow-right" size={16} /></Link><Tooltip content="复制当前页面链接"><Button size="sm" variant="quiet" aria-label="分享"><Icon name="arrow-right" size={17} /></Button></Tooltip></div><Divider label="或者" /><Typography variant="caption" muted>辅助信息使用低层级样式，不抢夺主任务注意力。</Typography></article>
      <article className="foundation-sample"><header><span>IDENTITY</span><h3>Avatar · Badge · Tag</h3></header><div className="foundation-sample__row"><Avatar name="林晓" status="online" /><Avatar name="Alex Chen" size="lg" status="busy" /><Badge tone="success" dot>运行正常</Badge></div><div className="foundation-sample__row"><Tag tone="primary">设计系统</Tag>{tagVisible ? <Tag tone="neutral" onRemove={() => setTagVisible(false)} removeLabel="移除待确认标签">待确认</Tag> : <Button size="sm" variant="quiet" onClick={() => setTagVisible(true)}>恢复标签</Button>}</div></article>
      <article className="foundation-sample"><header><span>FORM</span><h3>Textarea · Checkbox · Radio</h3></header><Textarea label="补充说明" placeholder="输入具体背景和预期结果…" hint="最多 300 字" maxLength={300} /><div className="foundation-sample__choices"><Checkbox label="同步通知团队" description="保存后发送站内通知" defaultChecked /><Radio label="仅自己可见" name="visibility" defaultChecked /><Radio label="团队可见" name="visibility" /></div></article>
      <article className="foundation-sample foundation-sample--wide"><header><span>FEEDBACK</span><h3>Alert · EmptyState</h3></header>{alertVisible ? <Alert tone="warning" title="有 2 项配置尚未完成" onClose={() => setAlertVisible(false)} action={<Link href="#components">立即检查</Link>}>完成配置后，自动化流程才会开始运行。</Alert> : <Button size="sm" variant="secondary" onClick={() => setAlertVisible(true)}>恢复提示</Button>}<EmptyState title="暂无协作者" description="邀请团队成员后，可以共同查看并编辑这个工作区。" action={<Button size="sm">邀请成员</Button>} /></article>
    </div>
  </section>;
}
