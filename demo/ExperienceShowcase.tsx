import { Brand } from './Brand';
import { useState } from 'react';
import { ActivityIndicator, AuthLayout, Button, CircularProgress, Hero, Input, SegmentedControl, StepProgress, ValidatedInput } from '../src';

function LoginForm({ stepped = false }: { stepped?: boolean }) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  return <div className="experience-login"><p className="demo-kicker">WELCOME BACK</p><h3>{stepped && step === 2 ? '验证你的邮箱' : '继续你的创作'}</h3><p>{stepped && step === 2 ? '验证码已发送，请在十分钟内完成验证。' : '登录后同步组件、主题与项目设置。'}</p>{step === 1 ? <ValidatedInput label="邮箱" placeholder="name@example.com" value={email} onChange={setEmail} rules={[{ validate: (value) => value.includes('@'), message: '请输入有效的邮箱地址' }]} /> : <Input label="验证码" inputMode="numeric" placeholder="6 位数字" />}<Button fullWidth shape="rounded" onClick={() => stepped && setStep(2)}>{stepped && step === 1 ? '下一步' : '登录工作台'}</Button><Button className="experience-link" variant="quiet" size="sm">使用其他方式登录</Button></div>;
}

export function ExperienceShowcase() {
  const [authVariant, setAuthVariant] = useState<'split' | 'card' | 'immersive' | 'step'>('split');
  return <section id="experience" className="demo-section experience-showcase">
    <div className="demo-section__heading"><div><p className="demo-kicker">ONBOARDING EXAMPLE</p><h2>入口、校验与进度反馈</h2></div><span>登录结构与状态语言协同工作</span></div>
    <Hero eyebrow="IDENTITY WORKFLOW" title="统一身份与任务状态" description="使用同一套登录结构、输入校验和进度反馈完成账号接入。" primaryAction={<Button size="lg">配置登录</Button>} secondaryAction={<Button size="lg" variant="outline">查看接入说明</Button>} proof="覆盖登录、验证、同步与异常恢复" visual={<ol className="experience-flow-map"><li><span>01</span><strong>登录</strong><small>确认账号</small></li><li><span>02</span><strong>校验</strong><small>验证凭据</small></li><li><span>03</span><strong>同步</strong><small>进入工作区</small></li></ol>} />
    <div className="experience-subhead"><div><p className="demo-kicker">AUTH LAYOUT</p><h3>登录页先选结构，再选风格</h3></div><SegmentedControl label="登录布局" value={authVariant} onChange={(value) => setAuthVariant(value as typeof authVariant)} options={[{ label: '分屏', value: 'split' }, { label: '卡片', value: 'card' }, { label: '沉浸', value: 'immersive' }, { label: '分步', value: 'step' }]} /></div>
    <AuthLayout variant={authVariant} brand={<Brand label="Harmony ID" />} currentStep={authVariant === 'step' ? 1 : undefined} steps={2} aside={<div><p className="demo-kicker">ACCOUNT SYNC</p><h3>登录后恢复工作区</h3><p>同步主题设置、组件收藏和最近项目。</p></div>} footer="继续即表示你同意服务条款与隐私政策"><LoginForm stepped={authVariant === 'step'} /></AuthLayout>
    <div className="experience-matrix">
      <article className="workspace-panel"><header><div><span>按钮语义</span><strong>形态 × 样式 × 文字</strong></div></header><div className="experience-buttons"><Button shape="rounded">保存更改</Button><Button shape="rounded" variant="outline">查看详情</Button><Button variant="quiet">忘记密码</Button><Button leadingIcon="↓">下载文件</Button><Button variant="danger" leadingIcon="×">删除项目</Button><Button fullWidth shape="rounded">移动端全宽操作</Button></div></article>
      <article className="workspace-panel"><header><div><span>确定进度</span><strong>用户知道还要等多久</strong></div></header><div className="experience-progress"><CircularProgress value={72} label="上传" /><div><StepProgress current={1} steps={['解析', '生成', '完成']} /><div className="experience-progress-note">文件正在生成，预计还需 18 秒</div></div></div></article>
      <article className="workspace-panel"><header><div><span>不确定进度</span><strong>表达活动，而不是伪造百分比</strong></div></header><div className="experience-activity">{(['spinner','radar','dots','wave'] as const).map((variant) => <div key={variant}><ActivityIndicator variant={variant} size="lg" /><small>{{ spinner: '循环同步', radar: '雷达扫描', dots: '点跳动', wave: '音频波纹' }[variant]}</small></div>)}</div></article>
    </div>
  </section>;
}
